/**
 * Order Model - E-commerce Order Entity
 */

export class Order {
  constructor(data = {}) {
    this.id = data.id || null;
    this.orderNumber = data.orderNumber || '';
    this.customerId = data.customerId || null;
    this.customerEmail = data.customerEmail || '';
    
    // Order Items
    this.items = data.items || []; // [{productId, name, sku, quantity, price, total}]
    
    // Pricing
    this.subtotal = data.subtotal || 0;
    this.tax = data.tax || 0;
    this.taxRate = data.taxRate || 0;
    this.shipping = data.shipping || 0;
    this.discount = data.discount || 0;
    this.discountCode = data.discountCode || '';
    this.total = data.total || 0;
    this.currency = data.currency || 'USD';
    
    // Addresses
    this.shippingAddress = data.shippingAddress || {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: ''
    };
    this.billingAddress = data.billingAddress || {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: ''
    };
    this.billingSameAsShipping = data.billingSameAsShipping !== undefined ? data.billingSameAsShipping : true;
    
    // Payment
    this.paymentMethod = data.paymentMethod || ''; // credit_card, paypal, stripe, etc.
    this.paymentStatus = data.paymentStatus || 'pending'; // pending, authorized, paid, failed, refunded
    this.transactionId = data.transactionId || '';
    this.paymentDate = data.paymentDate || null;
    
    // Fulfillment
    this.fulfillmentStatus = data.fulfillmentStatus || 'unfulfilled'; // unfulfilled, partial, fulfilled
    this.shippingMethod = data.shippingMethod || '';
    this.trackingNumber = data.trackingNumber || '';
    this.trackingUrl = data.trackingUrl || '';
    this.carrier = data.carrier || '';
    this.shippedDate = data.shippedDate || null;
    this.deliveredDate = data.deliveredDate || null;
    this.estimatedDelivery = data.estimatedDelivery || null;
    
    // Status
    this.status = data.status || 'pending'; // pending, processing, shipped, delivered, cancelled, refunded
    this.notes = data.notes || '';
    this.customerNotes = data.customerNotes || '';
    this.tags = data.tags || [];
    
    // Timestamps
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.completedAt = data.completedAt || null;
    this.cancelledAt = data.cancelledAt || null;
  }

  /**
   * Validate order data
   */
  validate() {
    const errors = [];
    
    if (!this.customerEmail || this.customerEmail.trim() === '') {
      errors.push('Customer email is required');
    }
    
    if (!this.items || this.items.length === 0) {
      errors.push('Order must have at least one item');
    }
    
    if (this.total <= 0) {
      errors.push('Order total must be greater than 0');
    }
    
    // Validate shipping address
    const addr = this.shippingAddress;
    if (!addr.firstName || !addr.lastName || !addr.address1 || !addr.city || !addr.zipCode || !addr.country) {
      errors.push('Shipping address is incomplete');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate order totals
   */
  calculateTotals() {
    // Calculate subtotal from items
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate tax
    this.tax = (this.subtotal * this.taxRate) / 100;
    
    // Calculate total
    this.total = this.subtotal + this.tax + this.shipping - this.discount;
    
    // Update item totals
    this.items.forEach(item => {
      item.total = item.price * item.quantity;
    });
    
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
   * Check if order can be cancelled
   */
  canCancel() {
    return ['pending', 'processing'].includes(this.status) && 
           this.paymentStatus !== 'refunded';
  }

  /**
   * Check if order can be refunded
   */
  canRefund() {
    return this.paymentStatus === 'paid' && 
           !['cancelled', 'refunded'].includes(this.status);
  }

  /**
   * Check if order is fulfilled
   */
  isFulfilled() {
    return this.fulfillmentStatus === 'fulfilled';
  }

  /**
   * Check if order is paid
   */
  isPaid() {
    return this.paymentStatus === 'paid';
  }

  /**
   * Generate order number
   */
  generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}-${random}`;
    return this.orderNumber;
  }

  /**
   * Convert to JSON for API
   */
  toJSON() {
    return {
      id: this.id,
      orderNumber: this.orderNumber,
      customerId: this.customerId,
      customerEmail: this.customerEmail,
      items: this.items,
      subtotal: this.subtotal,
      tax: this.tax,
      taxRate: this.taxRate,
      shipping: this.shipping,
      discount: this.discount,
      discountCode: this.discountCode,
      total: this.total,
      currency: this.currency,
      shippingAddress: this.shippingAddress,
      billingAddress: this.billingAddress,
      billingSameAsShipping: this.billingSameAsShipping,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      transactionId: this.transactionId,
      paymentDate: this.paymentDate,
      fulfillmentStatus: this.fulfillmentStatus,
      shippingMethod: this.shippingMethod,
      trackingNumber: this.trackingNumber,
      trackingUrl: this.trackingUrl,
      carrier: this.carrier,
      shippedDate: this.shippedDate,
      deliveredDate: this.deliveredDate,
      estimatedDelivery: this.estimatedDelivery,
      status: this.status,
      notes: this.notes,
      customerNotes: this.customerNotes,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      completedAt: this.completedAt,
      cancelledAt: this.cancelledAt
    };
  }

  /**
   * Create from API response
   */
  static fromAPI(data) {
    return new Order(data);
  }
}

export default Order;
