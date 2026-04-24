import React from 'react';

// Using a Next.js App Router dynamic route
export default async function ProductDetail({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = await params;
  return (
    <main className="container">
      <div style={{ padding: '2rem' }}>
        <h1 className="header-title">Product Details</h1>
        <h2>Viewing details for Product {resolvedParams.productId}</h2>
        <p>This is a dynamically generated page for product ID {resolvedParams.productId}.</p>
      </div>
    </main>
  );
}
