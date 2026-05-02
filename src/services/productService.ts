import { Product, ProductFilters, SortConfig } from '../types/product';

// TOGGLE: Set this to your real API URL.
// Currently configured to use DummyJSON as a base for 1000+ items.
const REAL_API_URL = 'https://dummyjson.com'; 

export const ProductService = {
  getProducts: async (
    filters: ProductFilters,
    sort: SortConfig
  ): Promise<Product[]> => {
    
    // 1. Initial Load: Decide between Real API or Mock Data
    if (!globalProducts) {
      let apiProducts: Product[] | null = null;
      
      // Try to fetch from real API first
      if (REAL_API_URL.trim() !== '') {
        try {
          // Note: If using dummyjson, it maxes out at ~100 products without pagination logic.
          // Depending on the API, adjust the limit as needed.
          const response = await fetch(`${REAL_API_URL}/products?limit=1000`);
          if (response.ok) {
            const data = await response.json();
            apiProducts = data.products.map((p: any) => ({
              id: `api-${p.id}`,
              name: p.title || p.name || 'Unknown Product',
              price: Number(p.price) || 0,
              category: p.category || 'Uncategorized',
              rating: Number(p.rating) || 0,
              stock: Number(p.stock) || 0,
              image: p.thumbnail || p.image || (p.images && p.images[0]) || `https://picsum.photos/seed/${p.id}/200/200`
            }));
          }
        } catch (e) {
          console.error("API Fetch failed, using pure mock data", e);
        }
      }

      // If API succeeded, use ONLY API data. Otherwise, use a small set of generated items.
      if (apiProducts && apiProducts.length > 0) {
        globalProducts = apiProducts;
      } else {
        globalProducts = generateMockProducts(100, 0);
      }
    }

    return applyLocalFilters(globalProducts, filters, sort);
  }
};

// Internal Helper to handle Filtering & Sorting
async function applyLocalFilters(
  data: Product[], 
  filters: ProductFilters, 
  sort: SortConfig
): Promise<Product[]> {
  let filtered = [...data];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  }

  if (filters.categories.length > 0) {
    filtered = filtered.filter(p => filters.categories.includes(p.category));
  }

  filtered = filtered.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
  filtered = filtered.filter(p => p.rating >= filters.minRating);

  filtered.sort((a, b) => {
    const modifier = sort.order === 'asc' ? 1 : -1;
    const field = sort.field as keyof Product;
    if (a[field] < b[field]) return -1 * modifier;
    if (a[field] > b[field]) return 1 * modifier;
    return 0;
  });

  return filtered;
}

// In-memory cache for the mock data
let globalProducts: Product[] | null = null;

const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'];
const NAMES = {
  Electronics: ['Pro Laptop', 'Smart Watch', 'Wireless Buds', '4K Monitor', 'Gaming Mouse', 'VR Headset'],
  Clothing: ['Premium Hoodie', 'Slim Fit Jeans', 'Running Shoes', 'Leather Jacket', 'Cotton T-Shirt'],
  Home: ['Smart Lamp', 'Coffee Maker', 'Air Purifier', 'Robot Vacuum', 'Ergo Chair'],
  Beauty: ['Skin Serum', 'Hydrating Mask', 'Ionic Dryer', 'Matte Lipstick', 'Fragrance Gold'],
  Sports: ['Yoga Mat', 'Dumbbell Set', 'Cycling Helmet', 'Soccer Ball', 'Tennis Racket'],
};

function generateMockProducts(count: number, startIndex: number): Product[] {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const names = NAMES[category as keyof typeof NAMES];
    const name = names[Math.floor(Math.random() * names.length)] + ' ' + (Math.floor((i + startIndex) / 5) + 1);
    
    products.push({
      id: `prod-${i + startIndex}`,
      name,
      price: Math.floor(Math.random() * 950) + 50,
      category,
      rating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
      stock: Math.floor(Math.random() * 200),
      image: `https://picsum.photos/seed/${i + startIndex + 500}/200/200`,
    });
  }
  return products;
}
