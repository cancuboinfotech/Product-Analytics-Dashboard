import { useState, useMemo, useEffect, useCallback } from 'react';
import { Product, ProductFilters, SortConfig, DashboardStats, Category } from '../types/product';
import { ProductService } from '../services/productService';

export const useDashboardState = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    categories: [],
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
  });

  const [sort, setSort] = useState<SortConfig>({
    field: 'price',
    order: 'asc',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ProductService.getProducts(filters, sort);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const stats: DashboardStats = useMemo(() => {
    const categories: Category[] = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'];
    
    const avgPrice = categories.map(cat => {
      const catProducts = products.filter(p => p.category === cat);
      const avg = catProducts.length > 0 
        ? catProducts.reduce((sum, p) => sum + p.price, 0) / catProducts.length 
        : 0;
      return { category: cat, value: parseFloat(avg.toFixed(2)) };
    });

    const counts = categories.map(cat => ({
      category: cat,
      value: products.filter(p => p.category === cat).length
    }));

    return {
      averagePricePerCategory: avgPrice,
      productCountPerCategory: counts
    };
  }, [products]);

  // Real-time update listener simulation
  const triggerManualUpdate = useCallback((updatedProducts: Product[]) => {
    // Only update existing products in the current filtered list if they match filters
    // For simplicity in simulation, we'll just re-filter/sort locally or just replace if simple
    setProducts(prev => {
        // Find if any of our currently displayed products need updating
        return prev.map(p => {
            const updated = updatedProducts.find(up => up.id === p.id);
            return updated ? updated : p;
        });
    });
  }, []);

  return {
    products,
    loading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
    stats,
    triggerManualUpdate
  };
};
