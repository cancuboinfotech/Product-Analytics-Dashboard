import React from 'react';
import { List } from 'react-window';
import { Product } from '../../types/product';
import styles from './ProductList.module.css';
import { ShoppingCart, Star, Box, ArrowRight } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const Row = ({ index, style, products, loading, ariaAttributes }: { index: number; style: React.CSSProperties; products: Product[]; loading: boolean; ariaAttributes?: any }) => {
  if (loading) {
    return (
      <div style={style} className={styles.rowWrapper} {...ariaAttributes}>
        <div className={`${styles.card} ${styles.skeleton} glass`}>
          <div className={styles.skeletonImage} />
          <div className={styles.info}>
            <div className={styles.skeletonText} style={{ width: '60%' }} />
            <div className={styles.skeletonText} style={{ width: '30%', height: '0.75rem' }} />
          </div>
        </div>
      </div>
    );
  }

  const product = products[index];
  if (!product) return null;

  return (
    <div style={style} className={styles.rowWrapper} {...ariaAttributes}>
      <div className={`${styles.card} glass glass-hover`}>
        <div className={styles.imageContainer}>
          <img src={product.image} alt={product.name} loading="lazy" />
          <div className={styles.categoryBadge}>{product.category}</div>
        </div>
        
        <div className={styles.info}>
          <div className={styles.mainInfo}>
            <h3 title={product.name}>{product.name}</h3>
          </div>
          
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <Star size={14} className={styles.starIcon} fill="currentColor" />
              <span>{product.rating}</span>
            </div>
            <div className={styles.metric}>
              <Box size={14} />
              <span>{product.stock} units</span>
            </div>
          </div>
        </div>

        <div className={styles.priceContainer}>
          <span className={styles.price}>${product.price}</span>
          <button className={styles.viewButton}>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProductList: React.FC<ProductListProps> = ({ products, loading }) => {
  if (!loading && products.length === 0) {
    return (
      <div className={styles.empty}>
        <h3>No products found</h3>
        <p>Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <List
        rowCount={loading ? 10 : products.length}
        rowHeight={110}
        rowComponent={Row as any}
        rowProps={{ products, loading }}
        style={{ height: 800, width: '100%' }}
      />
    </div>
  );
};
