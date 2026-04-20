import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProductStore } from '../useProductStore';
import { Product } from '@/types';

const mockProducts: Product[] = [
  { id: '1', name: 'Notebook Pro', price: 1200, category: 'Electronics', rating: 4.5, stock: 50 },
  { id: '2', name: 'Coffee Maker', price: 90, category: 'Home & Kitchen', rating: 3.8, stock: 12 },
  { id: '3', name: 'Wireless Mouse', price: 45, category: 'Electronics', rating: 4.8, stock: 100 },
  { id: '4', name: 'Desk Chair', price: 150, category: 'Home & Kitchen', rating: 4.2, stock: 0 },
];

describe('useProductStore filters and sort', () => {
  beforeEach(() => {
    useProductStore.setState({
      products: mockProducts,
      filteredProducts: mockProducts,
      filters: { search: '', categories: [], minPrice: null, maxPrice: null, minRating: null },
      sortOption: 'price-asc',
    });
  });

  it('filters products by category and price range', () => {
    // Act
    useProductStore.getState().setFilters({
      categories: ['Electronics'],
      minPrice: 100,
    });

    const filtered = useProductStore.getState().filteredProducts;

    // Assert
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Notebook Pro');
    expect(filtered.every(p => p.category === 'Electronics' && p.price >= 100)).toBe(true);
  });

  it('searches products by name', () => {
    // Act
    useProductStore.getState().setFilters({
      search: 'Coffee',
    });

    const filtered = useProductStore.getState().filteredProducts;

    // Assert
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Coffee Maker');
  });

  it('sorts products by highest rating', () => {
    // Act
    useProductStore.getState().setSortOption('rating-desc');

    const filtered = useProductStore.getState().filteredProducts;

    // Assert
    expect(filtered[0].name).toBe('Wireless Mouse');
    expect(filtered[1].name).toBe('Notebook Pro');
  });
});
