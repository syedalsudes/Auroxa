export interface Product {
  _id?: string;
  title?: string | null;
  images?: string[];
  category?: string | null;
  targetAudience?: string | null;
  price: number;
  discountPrice?: number | null;
  description?: string | null;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  brand?: string | null;
  isFeatured?: boolean;
  slug?: string | null;
  createdAt?: string | Date | null;
}
