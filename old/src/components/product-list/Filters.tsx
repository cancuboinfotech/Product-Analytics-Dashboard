import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useDebounce } from '@/hooks/useDebounce';
import { SortOption } from '@/types';
import styles from './Filters.module.css';

const CATEGORIES = ['Electronics', 'Home & Kitchen', 'Toys', 'Books', 'Clothing', 'Sports', 'Beauty'];

export const Filters: React.FC = () => {
  const { filters, setFilters, sortOption, setSortOption } = useProductStore();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters({ categories: newCategories });
  };

  return (
    <div className={`${styles.container} glass`}>
      <h3 className={styles.title}>Refine Data</h3>
      
      <div className={styles.searchWrap}>
        <Search className={styles.searchIcon} size={18} />
        <input 
          type="text" 
          placeholder="Search items by name..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.filterGrid}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Categories</label>
          <select 
            className={styles.select}
            onChange={(e) => {
              if (e.target.value) handleCategoryToggle(e.target.value);
              e.target.value = '';
            }}
            value=""
          >
            <option value="" disabled>Add a category...</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c} disabled={filters.categories.includes(c)}>{c}</option>
            ))}
          </select>
          {filters.categories.length > 0 && (
            <div className={styles.categoryTags}>
              {filters.categories.map(c => (
                <span key={c} className={styles.tag} onClick={() => handleCategoryToggle(c)}>
                  {c} <X size={12} />
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Price Range</label>
          <div className={styles.rangeInputs}>
            <input 
              type="number" 
              placeholder="Min" 
              className={styles.input}
              value={filters.minPrice ?? ''}
              onChange={(e) => setFilters({ minPrice: e.target.value ? Number(e.target.value) : null })}
            />
            <span style={{ color: 'var(--text-muted)' }}>-</span>
            <input 
              type="number" 
              placeholder="Max" 
              className={styles.input}
              value={filters.maxPrice ?? ''}
              onChange={(e) => setFilters({ maxPrice: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Minimum Rating</label>
          <select 
            className={styles.select}
            value={filters.minRating ?? ''}
            onChange={(e) => setFilters({ minRating: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Sort By</label>
          <select 
            className={styles.select}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
};
