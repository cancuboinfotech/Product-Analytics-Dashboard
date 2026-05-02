import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, ProductFilters, SortConfig, DashboardStats } from '../types/product';
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
    try {
      setLoading(true);
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

  // Stable Categories (extracted once or updated when data source changes)
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    if (products.length > 0 && availableCategories.length === 0) {
      const cats = new Set<string>();
      products.forEach(p => {
        if (p.category) cats.add(p.category.trim());
      });
      if (cats.size > 0) {
        setAvailableCategories(Array.from(cats).sort());
      }
    }
  }, [products, availableCategories.length]);

  const stats = useMemo<DashboardStats>(() => {
    const categoryData: Record<string, { total: number; count: number; totalRating: number; totalStock: number }> = {};
    
    products.forEach((p) => {
      // Skip undefined or empty categories
      if (!p.category || p.category === 'undefined') return;

      if (!categoryData[p.category]) {
        categoryData[p.category] = { total: 0, count: 0, totalRating: 0, totalStock: 0 };
      }
      categoryData[p.category].total += p.price;
      categoryData[p.category].totalRating += p.rating;
      categoryData[p.category].totalStock += p.stock;
      categoryData[p.category].count += 1;
    });

    const averagePricePerCategory = Object.entries(categoryData).map(([category, data]) => ({
      category,
      value: Math.round(data.total / data.count),
    }));

    const productCountPerCategory = Object.entries(categoryData).map(([category, data]) => ({
      category,
      value: data.count,
    }));

    const averageRatingPerCategory = Object.entries(categoryData).map(([category, data]) => ({
      category,
      value: parseFloat((data.totalRating / data.count).toFixed(1)),
    }));

    const totalStockPerCategory = Object.entries(categoryData).map(([category, data]) => ({
      category,
      value: data.totalStock,
    }));

    return { 
      averagePricePerCategory, 
      productCountPerCategory,
      averageRatingPerCategory,
      totalStockPerCategory
    };
  }, [products]);

  const triggerManualUpdate = useCallback((updatedProducts: Product[]) => {
    setProducts(prev => {
      const productMap = new Map(prev.map(p => [p.id, p]));
      updatedProducts.forEach(up => {
        if (productMap.has(up.id)) {
          // Merge the update into the existing product to prevent missing fields
          productMap.set(up.id, { ...productMap.get(up.id)!, ...up });
        }
      });
      return Array.from(productMap.values());
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
    availableCategories,
    triggerManualUpdate,
  };
};
