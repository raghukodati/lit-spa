/**
 * Purchase Order Model
 */

export class PurchaseOrder {
  constructor(data = {}) {
    this.id = data.id || null;
    this.poNumber = data.poNumber || '';
    // Legacy labels
    this.vendor = data.vendor || '';
    this.customer = data.customer || '';
    // Unified business partner references
    this.vendorId = data.vendorId || null; // BusinessPartner id with partnerType 'vendor'
    this.customerId = data.customerId || null; // BusinessPartner id with partnerType 'customer'
    this.items = data.items || [];
    this.totalAmount = data.totalAmount || 0;
    this.currency = data.currency || 'USD';
    this.status = data.status || 'Draft'; // Draft, Sent, Acknowledged, Fulfilled, Cancelled
    this.orderDate = data.orderDate || new Date().toISOString();
    this.deliveryDate = data.deliveryDate || null;
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    const errors = [];
    
    if (!this.poNumber || this.poNumber.trim() === '') {
      errors.push('PO Number is required');
    }
    
    if (!this.vendor || this.vendor.trim() === '') {
      errors.push('Vendor is required');
    }
    
    if (!this.items || this.items.length === 0) {
      errors.push('At least one item is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  calculateTotal() {
    this.totalAmount = this.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    return this.totalAmount;
  }

  toJSON() {
    return {
      id: this.id,
      poNumber: this.poNumber,
      vendor: this.vendor,
      customer: this.customer,
      vendorId: this.vendorId,
      customerId: this.customerId,
      items: this.items,
      totalAmount: this.totalAmount,
      currency: this.currency,
      status: this.status,
      orderDate: this.orderDate,
      deliveryDate: this.deliveryDate,
      notes: this.notes,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromAPI(data) {
    return new PurchaseOrder(data);
  }
}

export default PurchaseOrder;
