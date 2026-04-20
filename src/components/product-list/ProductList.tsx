import React, { useRef, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Star, PackageX } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { formatCurrency, formatRating } from '@/utils';
import { Product } from '@/types';
import styles from './ProductList.module.css';

const ProductRow = memo(({ product, style }: { product: Product, style: React.CSSProperties }) => {
  const getStockClass = (stock: number) => {
    if (stock < 20) return styles.stockLow;
    if (stock < 60) return styles.stockMedium;
    return styles.stockHigh;
  };

  return (
    <div className={styles.row} style={style}>
      <div className={`${styles.cell} ${styles.name}`}>{product.name}</div>
      <div className={`${styles.cell} ${styles.price}`}>{formatCurrency(product.price)}</div>
      <div className={`${styles.cell} ${styles.category}`}>{product.category}</div>
      <div className={`${styles.cell} ${styles.rating}`}>
        <span>{formatRating(product.rating)}</span>
        <Star size={14} fill="currentColor" />
      </div>
      <div className={`${styles.cell} ${styles.stock} ${getStockClass(product.stock)}`}>
        {product.stock} in stock
      </div>
    </div>
  );
});

ProductRow.displayName = 'ProductRow';

export const ProductList: React.FC = () => {
  const { filteredProducts, isLoading } = useProductStore();
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredProducts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Estimate height of each row in px
    overscan: 5,
  });

  if (isLoading) {
    return (
      <div className={styles.listContainer}>
        <div className={styles.emptyState}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Loading dataset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <div>Product Name</div>
        <div>Price</div>
        <div className={styles.category}>Category</div>
        <div>Rating</div>
        <div className={styles.stock}>Inventory</div>
      </div>

      <div className={styles.listBody} ref={parentRef}>
        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <PackageX size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3>No products found</h3>
            <p>Try adjusting your search or filters to see more results.</p>
          </div>
        ) : (
          <div 
            className={styles.virtualSizer} 
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const product = filteredProducts[virtualItem.index];
              return (
                <ProductRow 
                  key={product.id} 
                  product={product} 
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }} 
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
