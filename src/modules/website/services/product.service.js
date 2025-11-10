/**
 * Product Service - E-commerce Product Management
 */

import { delay } from '../../../services/api.js';
import { Product } from '../models/product.model.js';

// Mock product data - B2B Catalog
let products = [
  // Electronics
  {
    id: 1, sku: 'LAPTOP-001', name: 'Professional Laptop', slug: 'professional-laptop',
    description: 'High-performance laptop for professionals with 16GB RAM and 512GB SSD', price: 1299.99, compareAtPrice: 1499.99,
    stock: 25, category: 'electronics', subcategory: 'Computers', brand: 'TechPro',
    featuredImage: '/images/products/laptop.jpg', tags: ['laptop', 'computer', 'tech'],
    status: 'active', featured: true
  },
  {
    id: 2, sku: 'MON-001', name: '27" 4K Monitor', slug: '27-4k-monitor',
    description: 'Ultra HD 4K monitor with IPS panel', price: 449.99, compareAtPrice: 549.99,
    stock: 45, category: 'electronics', subcategory: 'Monitors', brand: 'TechPro',
    featuredImage: '/images/products/monitor.jpg', tags: ['monitor', 'display', '4k'],
    status: 'active', featured: true
  },
  {
    id: 3, sku: 'HEADPHONE-001', name: 'Wireless Headphones', slug: 'wireless-headphones',
    description: 'Noise-cancelling wireless headphones with 30hr battery', price: 299.99, compareAtPrice: 0,
    stock: 100, category: 'electronics', subcategory: 'Audio', brand: 'Acme Corp',
    featuredImage: '/images/products/headphones.jpg', tags: ['headphones', 'audio', 'wireless'],
    status: 'active', featured: false
  },
  {
    id: 4, sku: 'KB-PRO-001', name: 'Mechanical Keyboard', slug: 'mechanical-keyboard',
    description: 'Professional mechanical keyboard with RGB backlighting', price: 149.99, compareAtPrice: 199.99,
    stock: 60, category: 'electronics', subcategory: 'Peripherals', brand: 'TechPro',
    featuredImage: '/images/products/keyboard.jpg', tags: ['keyboard', 'mechanical', 'rgb'],
    status: 'active', featured: false
  },
  {
    id: 5, sku: 'MOUSE-PRO-001', name: 'Wireless Pro Mouse', slug: 'wireless-pro-mouse',
    description: 'Ergonomic wireless mouse with precision tracking', price: 79.99, compareAtPrice: 99.99,
    stock: 8, category: 'electronics', subcategory: 'Peripherals', brand: 'Acme Corp',
    featuredImage: '/images/products/mouse.jpg', tags: ['mouse', 'wireless', 'ergonomic'],
    status: 'active', featured: false
  },
  // Tools & Equipment
  {
    id: 6, sku: 'DRILL-001', name: 'Cordless Drill Set', slug: 'cordless-drill-set',
    description: '18V cordless drill with 2 batteries and carrying case', price: 249.99, compareAtPrice: 299.99,
    stock: 35, category: 'tools', subcategory: 'Power Tools', brand: 'Industrial Plus',
    featuredImage: '/images/products/drill.jpg', tags: ['drill', 'cordless', 'power-tool'],
    status: 'active', featured: true
  },
  {
    id: 7, sku: 'TOOL-KIT-001', name: 'Professional Tool Kit', slug: 'professional-tool-kit',
    description: '200-piece professional tool kit with storage case', price: 399.99, compareAtPrice: 499.99,
    stock: 20, category: 'tools', subcategory: 'Tool Sets', brand: 'Industrial Plus',
    featuredImage: '/images/products/toolkit.jpg', tags: ['tools', 'kit', 'professional'],
    status: 'active', featured: false
  },
  {
    id: 8, sku: 'SAW-001', name: 'Circular Saw', slug: 'circular-saw',
    description: '15-amp circular saw with laser guide', price: 179.99, compareAtPrice: 0,
    stock: 15, category: 'tools', subcategory: 'Power Tools', brand: 'Industrial Plus',
    featuredImage: '/images/products/saw.jpg', tags: ['saw', 'circular', 'power-tool'],
    status: 'active', featured: false
  },
  // Office Supplies
  {
    id: 9, sku: 'DESK-001', name: 'Adjustable Standing Desk', slug: 'adjustable-standing-desk',
    description: 'Electric height-adjustable desk with memory settings', price: 599.99, compareAtPrice: 799.99,
    stock: 12, category: 'supplies', subcategory: 'Furniture', brand: 'SupplyMax',
    featuredImage: '/images/products/desk.jpg', tags: ['desk', 'standing', 'adjustable'],
    status: 'active', featured: true
  },
  {
    id: 10, sku: 'CHAIR-001', name: 'Ergonomic Office Chair', slug: 'ergonomic-office-chair',
    description: 'Premium ergonomic chair with lumbar support', price: 449.99, compareAtPrice: 549.99,
    stock: 30, category: 'supplies', subcategory: 'Furniture', brand: 'SupplyMax',
    featuredImage: '/images/products/chair.jpg', tags: ['chair', 'ergonomic', 'office'],
    status: 'active', featured: false
  },
  {
    id: 11, sku: 'PAPER-001', name: 'Copy Paper 10 Reams', slug: 'copy-paper-bulk',
    description: 'Bulk copy paper pack - 10 reams (5000 sheets)', price: 49.99, compareAtPrice: 0,
    stock: 200, category: 'supplies', subcategory: 'Paper', brand: 'SupplyMax',
    featuredImage: '/images/products/paper.jpg', tags: ['paper', 'bulk', 'office'],
    status: 'active', featured: false
  },
  // Heavy Equipment
  {
    id: 12, sku: 'LADDER-001', name: 'Industrial Ladder 12ft', slug: 'industrial-ladder-12ft',
    description: 'Heavy-duty aluminum ladder, 300lb capacity', price: 189.99, compareAtPrice: 229.99,
    stock: 25, category: 'equipment', subcategory: 'Ladders', brand: 'Industrial Plus',
    featuredImage: '/images/products/ladder.jpg', tags: ['ladder', 'industrial', 'aluminum'],
    status: 'active', featured: false
  },
  {
    id: 13, sku: 'CART-001', name: 'Heavy Duty Cart', slug: 'heavy-duty-cart',
    description: 'Industrial cart with 1000lb capacity', price: 349.99, compareAtPrice: 0,
    stock: 18, category: 'equipment', subcategory: 'Carts', brand: 'Industrial Plus',
    featuredImage: '/images/products/cart.jpg', tags: ['cart', 'heavy-duty', 'industrial'],
    status: 'active', featured: false
  },
  // Safety Gear
  {
    id: 14, sku: 'HELMET-001', name: 'Safety Helmet Pack', slug: 'safety-helmet-pack',
    description: 'Industrial safety helmets - pack of 10', price: 199.99, compareAtPrice: 249.99,
    stock: 50, category: 'safety', subcategory: 'Head Protection', brand: 'Premium Brand',
    featuredImage: '/images/products/helmet.jpg', tags: ['safety', 'helmet', 'ppe'],
    status: 'active', featured: true
  },
  {
    id: 15, sku: 'GLOVES-001', name: 'Work Gloves Box', slug: 'work-gloves-box',
    description: 'Heavy-duty work gloves - box of 50 pairs', price: 89.99, compareAtPrice: 0,
    stock: 75, category: 'safety', subcategory: 'Hand Protection', brand: 'Premium Brand',
    featuredImage: '/images/products/gloves.jpg', tags: ['gloves', 'safety', 'ppe'],
    status: 'active', featured: false
  },
  {
    id: 16, sku: 'VEST-001', name: 'Safety Vest Pack', slug: 'safety-vest-pack',
    description: 'High-visibility safety vests - pack of 20', price: 149.99, compareAtPrice: 199.99,
    stock: 6, category: 'safety', subcategory: 'Visibility', brand: 'Premium Brand',
    featuredImage: '/images/products/vest.jpg', tags: ['vest', 'safety', 'visibility'],
    status: 'active', featured: false
  }
];
let nextProductId = 17;

/**
 * Get all products with filtering, sorting, and pagination
 */
export async function getProducts(options = {}) {
  await delay(300);
  let result = [...products];
  
  // Filtering
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.sku.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (options.category) {
    result = result.filter(p => p.category === options.category);
  }
  
  if (options.subcategory) {
    result = result.filter(p => p.subcategory === options.subcategory);
  }
  
  if (options.brand) {
    result = result.filter(p => p.brand === options.brand);
  }
  
  if (options.status) {
    result = result.filter(p => p.status === options.status);
  }
  
  if (options.featured !== undefined) {
    result = result.filter(p => p.featured === options.featured);
  }
  
  if (options.inStock) {
    result = result.filter(p => p.stock > 0);
  }
  
  if (options.minPrice) {
    result = result.filter(p => p.price >= options.minPrice);
  }
  
  if (options.maxPrice) {
    result = result.filter(p => p.price <= options.maxPrice);
  }
  
  // Sorting
  if (options.sortBy) {
    result.sort((a, b) => {
      let aVal = a[options.sortBy];
      let bVal = b[options.sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (options.sortOrder === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
    });
  }
  
  const total = result.length;
  
  // Pagination
  if (options.page && options.pageSize) {
    const start = (options.page - 1) * options.pageSize;
    const end = start + options.pageSize;
    result = result.slice(start, end);
  }
  
  return {
    data: result.map(p => Product.fromAPI(p)),
    total: total,
    page: options.page || 1,
    pageSize: options.pageSize || total,
    totalPages: options.pageSize ? Math.ceil(total / options.pageSize) : 1
  };
}

/**
 * Get product by ID
 */
export async function getProductById(id) {
  await delay(200);
  const product = products.find(p => p.id === parseInt(id));
  return product ? Product.fromAPI(product) : null;
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug) {
  await delay(200);
  const product = products.find(p => p.slug === slug);
  return product ? Product.fromAPI(product) : null;
}

/**
 * Get product by SKU
 */
export async function getProductBySKU(sku) {
  await delay(200);
  const product = products.find(p => p.sku === sku);
  return product ? Product.fromAPI(product) : null;
}

/**
 * Create product
 */
export async function createProduct(productData) {
  await delay(300);
  
  const product = new Product(productData);
  const validation = product.validate();
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  // Auto-generate slug if not provided
  if (!product.slug) {
    product.generateSlug();
  }
  
  const newProduct = {
    ...product.toJSON(),
    id: nextProductId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  return Product.fromAPI(newProduct);
}

/**
 * Update product
 */
export async function updateProduct(id, updates) {
  await delay(300);
  const index = products.findIndex(p => p.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Product not found');
  }
  
  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return Product.fromAPI(products[index]);
}

/**
 * Delete product
 */
export async function deleteProduct(id) {
  await delay(300);
  const index = products.findIndex(p => p.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Product not found');
  }
  
  products.splice(index, 1);
  return true;
}

/**
 * Update product stock
 */
export async function updateProductStock(id, quantity) {
  await delay(200);
  const product = products.find(p => p.id === parseInt(id));
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  product.stock = quantity;
  product.updatedAt = new Date().toISOString();
  return Product.fromAPI(product);
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 10) {
  await delay(200);
  const featured = products.filter(p => p.featured && p.status === 'active');
  return featured.slice(0, limit).map(p => Product.fromAPI(p));
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category, options = {}) {
  return getProducts({ ...options, category });
}

/**
 * Get product categories (unique list)
 */
export async function getProductCategories() {
  await delay(100);
  const categories = [...new Set(products.map(p => p.category))];
  return categories.filter(c => c).sort();
}

/**
 * Get product brands (unique list)
 */
export async function getProductBrands() {
  await delay(100);
  const brands = [...new Set(products.map(p => p.brand))];
  return brands.filter(b => b).sort();
}

/**
 * Search products
 */
export async function searchProducts(query, options = {}) {
  return getProducts({ ...options, search: query });
}

/**
 * Get low stock products
 */
export async function getLowStockProducts() {
  await delay(200);
  return products
    .filter(p => p.stock <= (p.lowStockThreshold || 10) && p.stock > 0)
    .map(p => Product.fromAPI(p));
}

/**
 * Get out of stock products
 */
export async function getOutOfStockProducts() {
  await delay(200);
  return products
    .filter(p => p.stock === 0)
    .map(p => Product.fromAPI(p));
}

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductBySKU,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  getFeaturedProducts,
  getProductsByCategory,
  getProductCategories,
  getProductBrands,
  searchProducts,
  getLowStockProducts,
  getOutOfStockProducts
};
