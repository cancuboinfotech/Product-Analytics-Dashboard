import { Product } from '@/types';

const CATEGORIES = ['Electronics', 'Home & Kitchen', 'Toys', 'Books', 'Clothing', 'Sports', 'Beauty'];

const generateMockProducts = (count: number): Product[] => {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    products.push({
      id: `p-${i}`,
      name: `Product ${i + 1}`,
      price: Number((Math.random() * 500 + 10).toFixed(2)),
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      rating: Number((Math.random() * 4 + 1).toFixed(1)),
      stock: Math.floor(Math.random() * 200),
    });
  }
  return products;
};

export class ProductService {
  private products: Product[] = generateMockProducts(1000);
  private subscribers: Set<(updatedProduct: Product) => void> = new Set();
  private interval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Start simulation immediately if this is instantiated on the client side
    if (typeof window !== 'undefined') {
      this.startSimulation();
    }
  }

  private startSimulation() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.products.length);
      const isPriceUpdate = Math.random() > 0.5;
      
      const updated = { 
        ...this.products[randomIndex], 
        stock: isPriceUpdate ? this.products[randomIndex].stock : Math.floor(Math.random() * 100),
        price: isPriceUpdate ? Number((this.products[randomIndex].price * (1 + (Math.random() * 0.1 - 0.05))).toFixed(2)) : this.products[randomIndex].price
      };
      
      this.products[randomIndex] = updated;
      
      this.subscribers.forEach(callback => callback(updated));
    }, 1000); // 1 update per second
  }

  subscribeToUpdates(callback: (updatedProduct: Product) => void) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  async getProducts(): Promise<Product[]> {
    // Simulate network delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...this.products]);
      }, 800);
    });
  }
}

export const productService = new ProductService();
