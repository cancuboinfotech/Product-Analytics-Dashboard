import { create } from 'zustand';
import { Product, FilterState, SortOption } from '@/types';
import { productService } from '@/services/productService';

interface ProductStore {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  sortOption: SortOption;
  
  fetchProducts: () => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  setSortOption: (option: SortOption) => void;
  updateProduct: (product: Product) => void;
  applyFiltersAndSort: () => void;
}

const initialFilters: FilterState = {
  search: '',
  categories: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  filteredProducts: [],
  isLoading: false,
  error: null,
  filters: initialFilters,
  sortOption: 'price-asc',

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await productService.getProducts();
      set({ products: data });
      get().applyFiltersAndSort();
      
      // Subscribe to real-time updates
      productService.subscribeToUpdates((updatedProduct) => {
        get().updateProduct(updatedProduct);
      });
    } catch (err) {
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().applyFiltersAndSort();
  },

  setSortOption: (option) => {
    set({ sortOption: option });
    get().applyFiltersAndSort();
  },

  updateProduct: (updatedProduct) => {
    set((state) => {
      const updatedProducts = state.products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      );
      
      return { products: updatedProducts };
    });
    // We optionally throttle applyFiltersAndSort here if needed
    // But directly updating filteredProducts is more efficient for single item updates
    set((state) => {
      // Small optimization: If the product is in the filtered list, update it in place.
      const index = state.filteredProducts.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        const newFiltered = [...state.filteredProducts];
        newFiltered[index] = updatedProduct;
        return { filteredProducts: newFiltered };
      }
      return state;
    });
  },

  applyFiltersAndSort: () => {
    const { products, filters, sortOption } = get();
    
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(searchLower));
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Price filters
    if (filters.minPrice !== null) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }

    // Rating filter
    if (filters.minRating !== null) {
      result = result.filter(p => p.rating >= filters.minRating!);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    set({ filteredProducts: result, isLoading: false });
  }
}));
