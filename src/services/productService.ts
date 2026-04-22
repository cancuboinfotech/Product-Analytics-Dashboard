import { Product, Category, ProductFilters, SortConfig } from '../types/product';

const CATEGORIES: Category[] = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'];

const generateMockProducts = (count: number): Product[] => {
  const products: Product[] = [];
  const prefixes = ['Pro', 'Ultra', 'Smart', 'Elite', 'Basic', 'Neo', 'Giga', 'Nano', 'Omni', 'Apex'];
  const baseNames = ['Gadget', 'Wear', 'Comfort', 'Glow', 'Gear', 'Link', 'Hub', 'Sense', 'Flow', 'Edge'];

  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const baseName = baseNames[Math.floor(Math.random() * baseNames.length)];
    
    products.push({
      id: `prod-${i + 1}`,
      name: `${prefix} ${baseName} ${i + 1}`,
      price: Math.floor(Math.random() * 950) + 50,
      category,
      rating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
      stock: Math.floor(Math.random() * 200),
    });
  }
  return products;
};

// Initial dataset
let mockProducts = generateMockProducts(1000);

export const ProductService = {
  getProducts: async (
    filters: ProductFilters,
    sort: SortConfig
  ): Promise<Product[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = mockProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(p.category);
      const matchesPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
      const matchesRating = p.rating >= filters.minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    filtered.sort((a, b) => {
      const order = sort.order === 'asc' ? 1 : -1;
      if (sort.field === 'price') return (a.price - b.price) * order;
      if (sort.field === 'rating') return (a.rating - b.rating) * order;
      return 0;
    });

    return filtered;
  },

  updateMockProduct: (id: string, updates: Partial<Product>) => {
    mockProducts = mockProducts.map((p) => (p.id === id ? { ...p, ...updates } : p));
  },

  getMockProducts: () => mockProducts,
};
