/**
 * Cart Model - Shopping Cart Entity
 */

export class Cart {
  constructor(data = {}) {
    this.id = data.id || null;
    this.sessionId = data.sessionId || '';
    this.customerId = data.customerId || null;
    this.items = data.items || []; // [{productId, name, sku, price, quantity, image}]
    this.subtotal = data.subtotal || 0;
    this.tax = data.tax || 0;
    this.taxRate = data.taxRate || 0;
    this.shipping = data.shipping || 0;
    this.discount = data.discount || 0;
    this.discountCode = data.discountCode || '';
    this.total = data.total || 0;
    this.currency = data.currency || 'USD';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.expiresAt = data.expiresAt || null;
  }

  /**
   * Add item to cart
   */
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: quantity,
        image: product.featuredImage || (product.images && product.images[0]) || ''
      });
    }
    
    this.calculateTotals();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Remove item from cart
   */
  removeItem(productId) {
    this.items = this.items.filter(item => item.productId !== productId);
    this.calculateTotals();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Update item quantity
   */
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.calculateTotals();
        this.updatedAt = new Date().toISOString();
      }
    }
  }

  /**
   * Clear cart
   */
  clear() {
    this.items = [];
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.discount = 0;
    this.discountCode = '';
    this.total = 0;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Calculate cart totals
   */
  calculateTotals() {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.tax = (this.subtotal * this.taxRate) / 100;
    this.total = this.subtotal + this.tax + this.shipping - this.discount;
    
    return {
      subtotal: this.subtotal,
      tax: this.tax,
      shipping: this.shipping,
      discount: this.discount,
      total: this.total
    };
  }

  /**
   * Get total item count
   */
  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Check if cart is empty
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Apply discount code
   */
  applyDiscount(code, discountAmount) {
    this.discountCode = code;
    this.discount = discountAmount;
    this.calculateTotals();
  }

  /**
   * Remove discount
   */
  removeDiscount() {
    this.discountCode = '';
    this.discount = 0;
    this.calculateTotals();
  }

  /**
   * Check if cart is expired
   */
  isExpired() {
    if (!this.expiresAt) return false;
    return new Date(this.expiresAt) < new Date();
  }

  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      id: this.id,
      sessionId: this.sessionId,
      customerId: this.customerId,
      items: this.items,
      subtotal: this.subtotal,
      tax: this.tax,
      taxRate: this.taxRate,
      shipping: this.shipping,
      discount: this.discount,
      discountCode: this.discountCode,
      total: this.total,
      currency: this.currency,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      expiresAt: this.expiresAt
    };
  }

  /**
   * Create from API response
   */
  static fromAPI(data) {
    return new Cart(data);
  }
}

export default Cart;
