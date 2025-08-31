import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WishlistItem } from "../types";
import { getPreview } from "../services/api";
import { normalizeUrl } from "../utils/urlNormalizer";

const WISHLIST_STORAGE_KEY = "@Centscape:wishlist_v2";
const OLD_WISHLIST_KEY = "@Centscape:wishlist"; // v1 key

const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    try {
      // Schema Migration v1 -> v2
      const oldData = await AsyncStorage.getItem(OLD_WISHLIST_KEY);
      if (oldData) {
        const v1Items: Omit<WishlistItem, "normalizedUrl">[] =
          JSON.parse(oldData);
        const v2Items: WishlistItem[] = v1Items.map((item) => ({
          ...item,
          normalizedUrl: normalizeUrl(item.id), // Assuming id was the raw URL
        }));
        await AsyncStorage.setItem(
          WISHLIST_STORAGE_KEY,
          JSON.stringify(v2Items)
        );
        await AsyncStorage.removeItem(OLD_WISHLIST_KEY);
        setWishlist(
          v2Items.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } else {
        const storedWishlist = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
        if (storedWishlist) {
          setWishlist(
            JSON.parse(storedWishlist).sort(
              (a: WishlistItem, b: WishlistItem) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          );
        }
      }
    } catch (e) {
      setError("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const saveWishlist = async (newWishlist: WishlistItem[]) => {
    try {
      await AsyncStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(newWishlist)
      );
      setWishlist(
        newWishlist.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (e) {
      setError("Failed to save wishlist.");
    }
  };

  const addItem = async (url: string) => {
    setError(null);
    const normalized = normalizeUrl(url);

    // Deduplication check
    if (wishlist.some((item) => item.normalizedUrl === normalized)) {
      throw new Error("This item is already in your wishlist.");
    }

    try {
      const metadata = await getPreview(url);
      const newItem: WishlistItem = {
        id: url, // Use original URL for ID to be safe
        title: metadata.title || "Untitled Item",
        image: metadata.image,
        price: metadata.price,
        currency: metadata.currency,
        sourceDomain: metadata.siteName || new URL(url).hostname,
        createdAt: new Date().toISOString(),
        normalizedUrl: normalized,
      };
      await saveWishlist([newItem, ...wishlist]);
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || e.message || "Could not get item preview.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeItem = async (id: string) => {
    const newWishlist = wishlist.filter((item) => item.id !== id);
    await saveWishlist(newWishlist);
  };

  return {
    wishlist,
    loading,
    error,
    addItem,
    removeItem,
    refreshWishlist: loadWishlist,
  };
};

export default useWishlist;
