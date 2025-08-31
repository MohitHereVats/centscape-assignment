export const normalizeUrl = (urlString: string): string => {
  try {
    const url = new URL(urlString);

    // Remove UTM parameters
    const params = url.searchParams;
    for (const key of Array.from(params.keys())) {
      if (key.startsWith("utm_")) {
        params.delete(key);
      }
    }

    // Lowercase the host
    const host = url.hostname.toLowerCase();

    // Remove fragment
    const fragment = "";

    return `${url.protocol}//${host}${url.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }${fragment}`;
  } catch (error) {
    // If URL is invalid, return it as-is to be handled elsewhere
    return urlString;
  }
};
