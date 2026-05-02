'use client';

import React, { useEffect } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { Analytics } from '@/components/dashboard/Analytics';
import { Filters } from '@/components/product-list/Filters';
import { ProductList } from '@/components/product-list/ProductList';

export default function Home() {
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="container">
      <h1 className="header-title">Product Analytics Dashboard</h1>
      
      <Analytics />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Filters />
        <ProductList />
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
