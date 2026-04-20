import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Analytics Dashboard',
  description: 'A scalable frontend application with real-time analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
