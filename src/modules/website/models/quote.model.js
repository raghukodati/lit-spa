/**
 * Quote Model - B2B Request for Quote (RFQ) / Quotation
 */

export class Quote {
  constructor(data = {}) {
    this.id = data.id || null;
    this.quoteNumber = data.quoteNumber || '';
    this.type = data.type || 'standard'; // standard, rfq, bulk, contract
    
    // Company & Contact
    this.companyId = data.companyId || null;
    this.companyName = data.companyName || '';
    this.contactId = data.contactId || null;
    this.contactName = data.contactName || '';
    this.contactEmail = data.contactEmail || '';
    this.contactPhone = data.contactPhone || '';
    
    // Quote Details
    this.status = data.status || 'draft'; // draft, sent, viewed, accepted, rejected, expired, converted
    this.title = data.title || '';
    this.description = data.description || '';
    
    // Line Items
    this.items = data.items || []; // { productId, sku, name, quantity, unitPrice, discount, tax, total }
    
    // Pricing
    this.subtotal = data.subtotal || 0;
    this.discountAmount = data.discountAmount || 0;
    this.discountPercent = data.discountPercent || 0;
    this.taxAmount = data.taxAmount || 0;
    this.shippingAmount = data.shippingAmount || 0;
    this.total = data.total || 0;
    this.currency = data.currency || 'USD';
    
    // Terms & Conditions
    this.paymentTerms = data.paymentTerms || 'Net 30';
    this.deliveryTerms = data.deliveryTerms || '';
    this.validUntil = data.validUntil || null;
    this.termsAndConditions = data.termsAndConditions || '';
    this.notes = data.notes || '';
    
    // Shipping
    this.shippingAddress = data.shippingAddress || null;
    this.shippingMethod = data.shippingMethod || '';
    this.estimatedDelivery = data.estimatedDelivery || null;
    
    // Approval & Workflow
    this.requiresApproval = data.requiresApproval || false;
    this.approvedBy = data.approvedBy || null;
    this.approvedAt = data.approvedAt || null;
    this.rejectionReason = data.rejectionReason || '';
    
    // Sales Rep
    this.salesRepId = data.salesRepId || null;
    this.salesRepName = data.salesRepName || '';
    
    // Conversion
    this.convertedToOrderId = data.convertedToOrderId || null;
    this.convertedAt = data.convertedAt || null;
    
    // Files & Attachments
    this.attachments = data.attachments || [];
    
    // Metadata
    this.customFields = data.customFields || {};
    this.tags = data.tags || [];
    
    // Tracking
    this.viewedAt = data.viewedAt || null;
    this.viewCount = data.viewCount || 0;
    this.sentAt = data.sentAt || null;
    
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.createdBy = data.createdBy || null;
  }

  get isExpired() {
    if (!this.validUntil) return false;
    return new Date(this.validUntil) < new Date();
  }

  get isActive() {
    return ['sent', 'viewed'].includes(this.status) && !this.isExpired;
  }

  get isConverted() {
    return this.status === 'converted' && this.convertedToOrderId !== null;
  }

  get itemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  calculateTotals() {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    if (this.discountPercent > 0) {
      this.discountAmount = this.subtotal * (this.discountPercent / 100);
    }
    
    const afterDiscount = this.subtotal - this.discountAmount;
    this.taxAmount = afterDiscount * 0.08; // Example tax rate
    
    this.total = afterDiscount + this.taxAmount + this.shippingAmount;
  }

  addItem(item) {
    this.items.push({
      productId: item.productId,
      sku: item.sku,
      name: item.name,
      description: item.description || '',
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      discount: item.discount || 0,
      tax: item.tax || 0,
      total: (item.quantity || 1) * (item.unitPrice || 0)
    });
    this.calculateTotals();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.calculateTotals();
  }

  validate() {
    const errors = [];
    
    if (!this.companyId) {
      errors.push('Company is required');
    }
    
    if (!this.contactEmail || !this.isValidEmail(this.contactEmail)) {
      errors.push('Valid contact email is required');
    }
    
    if (this.items.length === 0) {
      errors.push('At least one item is required');
    }
    
    if (this.validUntil && new Date(this.validUntil) <= new Date()) {
      errors.push('Valid until date must be in the future');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  toJSON() {
    return { ...this };
  }

  static fromAPI(data) {
    return new Quote(data);
  }
}

export default Quote;
