export interface WishlistItem {
  id: string; // Using URL as ID
  title: string;
  image: string | null;
  price: string | null;
  currency: string | null;
  sourceDomain: string;
  createdAt: string; // ISO String
  normalizedUrl: string; // For v2 schema
}
