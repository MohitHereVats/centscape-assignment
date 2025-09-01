import axios from "axios";
import * as cheerio from "cheerio";
import { URL } from "url";
// import dns from 'dns';
import dns from "dns/promises";
import { AppError } from "../utils/AppError";

interface Metadata {
  title: string | null;
  image: string | null;
  price: string | null;
  currency: string | null;
  siteName: string | null;
  sourceUrl: string;
}

export const isPrivateIp = async (hostname: string): Promise<boolean> => {
  return dns
    .lookup(hostname)
    .then((lookupResult) => {
      const address = lookupResult.address;
      const isPrivate =
        /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(
          address
        ) ||
        /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(address) ||
        /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(
          address
        ) ||
        /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(
          address
        ) ||
        /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(address) ||
        /^f[cd][0-9a-f]{2}:/i.test(address) ||
        /^fe80:/i.test(address) ||
        /^::1$/.test(address) ||
        /^::$/.test(address);
      return isPrivate;
    })
    .catch((err) => {
      return false;
    });
};

export const fetchUrlMetadata = async (url: string): Promise<Metadata> => {
  const urlObj = new URL(url);

  //SSRF Guard
  if (await isPrivateIp(urlObj.hostname)) {
    throw new AppError("Access to private or loopback IPs is forbidden.", 400);
  }

  const response = await axios.get(url, {
    timeout: 5000,
    maxRedirects: 3,
    maxContentLength: 5 * 1024 * 1024, // Allow up to 5 MB of content
    maxBodyLength: 5 * 1024 * 1024,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      // Add other headers if needed, like Accept-Language
      "Accept-Language": "en-US,en;q=0.9",
    },
    responseType: "arraybuffer",
  });

  const contentType = response.headers["content-type"];
  if (!contentType || !contentType.includes("text/html")) {
    throw new AppError("Content-Type must be text/html.", 400);
  }

  const html = response.data.toString("utf-8");
  const $ = cheerio.load(html);

  const getMetatag = (name: string) =>
    $(`meta[name="${name}"]`).attr("content") ||
    $(`meta[property="${name}"]`).attr("content");

  const metadata: Metadata = {
    // Extraction Order: Open Graph -> Twitter -> Fallback
    title:
      getMetatag("og:title") ||
      getMetatag("twitter:title") ||
      $("title").first().text(),
    image:
      getMetatag("og:image") ||
      getMetatag("twitter:image") ||
      $('#landingImage').attr('src') ||
      null,
    siteName: getMetatag("og:site_name") || urlObj.hostname,
    sourceUrl: url,
    price: getMetatag("og:price:amount") || null,
    currency: getMetatag("og:price:currency") || null,
  };

  // Resolve relative image URL
  if (metadata.image) {
    metadata.image = new URL(metadata.image, url).href;
  }

  // Fallback price extraction (simple example)
  if (!metadata.price) {
    const priceRegex = /[\$€£¥]\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/;
    const bodyText = $("body").text();
    const match = bodyText.match(priceRegex);
    if (match && match[1]) {
      metadata.price = match[1].replace(/,/g, "");
      metadata.currency = match[0].charAt(0);
    }
  }

  console.log("Extracted metadata:", metadata);

  return metadata;
};
