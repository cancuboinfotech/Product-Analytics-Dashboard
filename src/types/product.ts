export type Category = string;

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  rating: number;
  stock: number;
  image: string;
}

export interface ProductFilters {
  search: string;
  categories: Category[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

export type SortField = 'price' | 'rating';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export interface DashboardStats {
  averagePricePerCategory: { category: string; value: number }[];
  productCountPerCategory: { category: string; value: number }[];
  averageRatingPerCategory: { category: string; value: number }[];
  totalStockPerCategory: { category: string; value: number }[];
}
