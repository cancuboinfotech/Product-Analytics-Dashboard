export type Category = 'Electronics' | 'Clothing' | 'Home' | 'Beauty' | 'Sports';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  rating: number;
  stock: number;
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
}
