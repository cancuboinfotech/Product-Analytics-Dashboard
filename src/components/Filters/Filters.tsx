import React, { useState, useEffect } from 'react';
import { ProductFilters, Category } from '../../types/product';
import styles from './Filters.module.css';
import { Search, Sliders, Star } from 'lucide-react';
  
interface FiltersProps {
  filters: ProductFilters;
  availableCategories: Category[];
  onChange: (filters: ProductFilters) => void;
}

export const Filters: React.FC<FiltersProps> = ({ filters, availableCategories, onChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onChange({ ...filters, search: searchTerm });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, onChange, filters]);

  const toggleCategory = (cat: Category) => {
    const newCats = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: newCats });
  };

  return (
    <div className={`${styles.container} glass`}>
      <header className={styles.header}>
        <Sliders size={20} className={styles.icon} />
        <h2>Intelligence Filter</h2>
      </header>

      <section className={styles.section}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <div className={styles.divider}></div>

      <section className={styles.section}>
        <label>Classification</label>
        <div className={styles.categoryGrid}>
          {availableCategories.length > 0 ? (
            availableCategories.map((cat, idx) => (
              <button
                key={`${cat}-${idx}`}
                className={`${styles.catButton} ${filters.categories.includes(cat) ? styles.active : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </button>
            ))
          ) : (
            <span className={styles.loadingText}>Loading categories...</span>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.labelRow}>
          <label>Price Spectrum</label>
          <span className={styles.value}>${filters.maxPrice}</span>
        </div>
        <div className={styles.rangeWrapper}>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: parseInt(e.target.value) })}
          />
        </div>
      </section>

      <section className={styles.section}>
        <label>Minimum Performance</label>
        <div className={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`${styles.star} ${filters.minRating >= star ? styles.starActive : ''}`}
              onClick={() => onChange({ ...filters, minRating: star })}
            >
              <Star size={20} fill={filters.minRating >= star ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </section>

      <button 
        className={styles.resetButton}
        onClick={() => {
          setSearchTerm('');
          onChange({
            search: '',
            categories: [],
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0,
          });
        }}
      >
        Clear All Parameters
      </button>
    </div>
  );
};
