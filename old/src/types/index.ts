export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  stock: number;
}

export interface FilterState {
  search: string;
  categories: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc';
