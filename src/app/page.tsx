'use client';

import React from 'react';
import { useDashboardState } from '../hooks/useDashboardState';
import { useRealTimeSimulation } from '../hooks/useRealTimeSimulation';
import { Filters } from '../components/Filters/Filters';
import { ProductList } from '../components/ProductList/ProductList';
import { Analytics } from '../components/Analytics/Analytics';
import { Dropdown } from '../components/Dropdown/Dropdown';
import { SortField, SortOrder } from '../types/product';
import { 
  LayoutDashboard, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Package, 
  AlertCircle,
  Star,
  XOctagon,
  Award,
  ArrowUpRight
} from 'lucide-react';
import styles from './page.module.css';

export default function Dashboard() {
  const {
    products,
    loading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
    stats,
    availableCategories,
    triggerManualUpdate
  } = useDashboardState();

  useRealTimeSimulation(triggerManualUpdate);

  // Calculate summary metrics
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);
  const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length : 0;
  const lowStock = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 20).length;
  
  // New metrics
  const avgRating = products.length > 0 ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length : 0;
  const outOfStock = products.filter(p => (p.stock || 0) === 0).length;
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price || 0)) : 0;

  // Find Top Category (by count for simplicity)
  let topCategory = 'N/A';
  if (stats.productCountPerCategory.length > 0) {
    const top = [...stats.productCountPerCategory].sort((a, b) => b.value - a.value)[0];
    topCategory = top.category;
  }

  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Top Rated' },
  ];

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-') as [SortField, SortOrder];
    setSort({ field, order });
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={`${styles.logoIcon} glow-purple animate-float`}>
            <Zap size={24} fill="currentColor" />
          </div>
          <div className={styles.logoText}>
            <h1>Product Analytics</h1>
            <p>Advanced Inventory Insights</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Dropdown 
            label="Sort by:"
            options={sortOptions}
            value={`${sort.field}-${sort.order}`}
            onChange={handleSortChange}
          />
          <span className={styles.liveBadge}>
            <span className={styles.pulse}></span>
            Live
          </span>
        </div>
      </header>

      {/* Metric Summary Bar */}
      <section className={styles.metricsBar}>
        <div className={`${styles.metricCard} glass glass-hover`}>
          <div className={`${styles.metricIcon} ${styles.blue}`}>
            <Package size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Total Products</span>
            <span className={styles.metricValue}>{products.length.toLocaleString()}</span>
          </div>
        </div>

        <div className={`${styles.metricCard} glass glass-hover`}>
          <div className={`${styles.metricIcon} ${styles.purple}`}>
            <DollarSign size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Average Price</span>
            <span className={styles.metricValue}>${avgPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className={`${styles.metricCard} glass glass-hover`}>
          <div className={`${styles.metricIcon} ${styles.cyan}`}>
            <TrendingUp size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Inventory Value</span>
            <span className={styles.metricValue}>${(totalValue / 1000).toFixed(1)}k</span>
          </div>
        </div>

        <div className={`${styles.metricCard} glass glass-hover`}>
          <div className={`${styles.metricIcon} ${styles.orange}`}>
            <AlertCircle size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Low Stock</span>
            <span className={styles.metricValue}>{lowStock} items</span>
          </div>
        </div>

        {/* New Metric Cards */}
        <div className={`${styles.metricCard} glass glass-hover`}>
          <div className={`${styles.metricIcon} ${styles.green}`}>
            <Star size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Average Rating</span>
            <span className={styles.metricValue}>{avgRating.toFixed(1)} <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>/ 5</span></span>
          </div>
        </div>

        <div className={`${styles.metricCard} glass glass-hover`}>
          <div className={`${styles.metricIcon} ${styles.red}`}>
            <XOctagon size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Out of Stock</span>
            <span className={styles.metricValue}>{outOfStock} items</span>
          </div>
        </div>

        <div className={`${styles.metricCard} glass glass-hover`}>
          <div className={`${styles.metricIcon} ${styles.pink}`}>
            <Award size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Top Category</span>
            <span className={styles.metricValue} style={{fontSize: '1.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px'}} title={topCategory}>{topCategory}</span>
          </div>
        </div>

        <div className={`${styles.metricCard} glass glass-hover`}>
          <div className={`${styles.metricIcon} ${styles.yellow}`}>
            <ArrowUpRight size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Highest Price</span>
            <span className={styles.metricValue}>${maxPrice.toFixed(0)}</span>
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <Filters 
            filters={filters} 
            availableCategories={availableCategories} 
            onChange={setFilters} 
          />
        </aside>

        <section className={styles.displayArea}>
          <Analytics stats={stats} />

          <div className={styles.listSection}>
            <div className={styles.listHeader}>
              <LayoutDashboard size={18} />
              <h2>Product Catalog</h2>
            </div>
            <ProductList products={products} loading={loading} />
          </div>
        </section>
      </div>

      {error && (
        <div className={styles.errorToast}>
          <p>{error}</p>
        </div>
      )}
    </main>
  );
}
