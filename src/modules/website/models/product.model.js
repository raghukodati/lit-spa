/**
 * Product Model - E-commerce Product Entity
 */

export class Product {
  constructor(data = {}) {
    this.id = data.id || null;
    this.sku = data.sku || '';
    this.name = data.name || '';
    this.slug = data.slug || '';
    this.description = data.description || '';
    this.shortDescription = data.shortDescription || '';
    this.price = data.price || 0;
    this.compareAtPrice = data.compareAtPrice || 0;
    this.cost = data.cost || 0;
    this.currency = data.currency || 'USD';
    this.taxable = data.taxable !== undefined ? data.taxable : true;
    this.taxRate = data.taxRate || 0;
    
    // Inventory
    this.trackInventory = data.trackInventory !== undefined ? data.trackInventory : true;
    this.stock = data.stock || 0;
    this.lowStockThreshold = data.lowStockThreshold || 10;
    this.allowBackorder = data.allowBackorder || false;
    
    // Organization
    this.category = data.category || '';
    this.subcategory = data.subcategory || '';
    this.tags = data.tags || [];
    this.brand = data.brand || '';
    
    // Media
    this.images = data.images || [];
    this.featuredImage = data.featuredImage || '';
    this.videos = data.videos || [];
    
    // Variants
    this.hasVariants = data.hasVariants || false;
    this.variants = data.variants || [];
    this.options = data.options || []; // e.g., [{name: 'Size', values: ['S', 'M', 'L']}]
    
    // Shipping
    this.weight = data.weight || 0;
    this.weightUnit = data.weightUnit || 'kg';
    this.dimensions = data.dimensions || { length: 0, width: 0, height: 0 };
    this.dimensionUnit = data.dimensionUnit || 'cm';
    this.requiresShipping = data.requiresShipping !== undefined ? data.requiresShipping : true;
    this.shippingClass = data.shippingClass || 'standard';
    
    // SEO
    this.metaTitle = data.metaTitle || '';
    this.metaDescription = data.metaDescription || '';
    this.metaKeywords = data.metaKeywords || [];
    
    // Status
    this.status = data.status || 'draft'; // draft, active, archived
    this.visibility = data.visibility || 'visible'; // visible, hidden
    this.featured = data.featured || false;
    
    // Timestamps
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.publishedAt = data.publishedAt || null;
  }

  /**
   * Validate product data
   */
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Product name is required');
    }
    
    if (!this.sku || this.sku.trim() === '') {
      errors.push('SKU is required');
    }
    
    if (this.price < 0) {
      errors.push('Price cannot be negative');
    }
    
    if (this.trackInventory && this.stock < 0) {
      errors.push('Stock cannot be negative');
    }
    
    if (this.requiresShipping && this.weight <= 0) {
      errors.push('Weight is required for shippable products');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if product is in stock
   */
  isInStock() {
    if (!this.trackInventory) return true;
    return this.stock > 0 || this.allowBackorder;
  }

  /**
   * Check if stock is low
   */
  isLowStock() {
    if (!this.trackInventory) return false;
    return this.stock <= this.lowStockThreshold && this.stock > 0;
  }

  /**
   * Calculate discount percentage
   */
  getDiscountPercentage() {
    if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }

  /**
   * Calculate profit margin
   */
  getProfitMargin() {
    if (this.cost === 0) return 0;
    return ((this.price - this.cost) / this.price) * 100;
  }

  /**
   * Get price with tax
   */
  getPriceWithTax() {
    if (!this.taxable) return this.price;
    return this.price * (1 + this.taxRate / 100);
  }

  /**
   * Generate slug from name
   */
  generateSlug() {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return this.slug;
  }

  /**
   * Convert to JSON for API
   */
  toJSON() {
    return {
      id: this.id,
      sku: this.sku,
      name: this.name,
      slug: this.slug,
      description: this.description,
      shortDescription: this.shortDescription,
      price: this.price,
      compareAtPrice: this.compareAtPrice,
      cost: this.cost,
      currency: this.currency,
      taxable: this.taxable,
      taxRate: this.taxRate,
      trackInventory: this.trackInventory,
      stock: this.stock,
      lowStockThreshold: this.lowStockThreshold,
      allowBackorder: this.allowBackorder,
      category: this.category,
      subcategory: this.subcategory,
      tags: this.tags,
      brand: this.brand,
      images: this.images,
      featuredImage: this.featuredImage,
      videos: this.videos,
      hasVariants: this.hasVariants,
      variants: this.variants,
      options: this.options,
      weight: this.weight,
      weightUnit: this.weightUnit,
      dimensions: this.dimensions,
      dimensionUnit: this.dimensionUnit,
      requiresShipping: this.requiresShipping,
      shippingClass: this.shippingClass,
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
      metaKeywords: this.metaKeywords,
      status: this.status,
      visibility: this.visibility,
      featured: this.featured,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      publishedAt: this.publishedAt
    };
  }

  /**
   * Create from API response
   */
  static fromAPI(data) {
    return new Product(data);
  }
}

export default Product;
