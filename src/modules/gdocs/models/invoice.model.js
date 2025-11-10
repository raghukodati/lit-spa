/**
 * Invoice Model
 */

export class Invoice {
  constructor(data = {}) {
    this.id = data.id || null;
    this.invoiceNumber = data.invoiceNumber || '';
    this.poNumber = data.poNumber || '';
    // Legacy label for display/backward-compatibility
    this.customer = data.customer || '';
    // Unified business partner reference
    this.counterpartyId = data.counterpartyId || null; // BusinessPartner id (usually customer)
    this.counterpartyType = data.counterpartyType || 'customer'; // customer, distributor, reseller, etc.
    this.items = data.items || [];
    this.subtotal = data.subtotal || 0;
    this.tax = data.tax || 0;
    this.totalAmount = data.totalAmount || 0;
    this.currency = data.currency || 'USD';
    this.status = data.status || 'Draft'; // Draft, Sent, Paid, Overdue, Cancelled
    this.invoiceDate = data.invoiceDate || new Date().toISOString();
    this.dueDate = data.dueDate || null;
    this.paidDate = data.paidDate || null;
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    const errors = [];
    
    if (!this.invoiceNumber || this.invoiceNumber.trim() === '') {
      errors.push('Invoice Number is required');
    }
    
    if (!this.customer || this.customer.trim() === '') {
      errors.push('Customer is required');
    }
    
    if (!this.items || this.items.length === 0) {
      errors.push('At least one item is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  calculateAmounts() {
    this.subtotal = this.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    
    this.tax = this.subtotal * 0.1; // 10% tax rate (configurable)
    this.totalAmount = this.subtotal + this.tax;
    
    return {
      subtotal: this.subtotal,
      tax: this.tax,
      totalAmount: this.totalAmount
    };
  }

  isOverdue() {
    if (!this.dueDate || this.status === 'Paid') {
      return false;
    }
    return new Date() > new Date(this.dueDate);
  }

  toJSON() {
    return {
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      poNumber: this.poNumber,
      customer: this.customer,
      counterpartyId: this.counterpartyId,
      counterpartyType: this.counterpartyType,
      items: this.items,
      subtotal: this.subtotal,
      tax: this.tax,
      totalAmount: this.totalAmount,
      currency: this.currency,
      status: this.status,
      invoiceDate: this.invoiceDate,
      dueDate: this.dueDate,
      paidDate: this.paidDate,
      notes: this.notes,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromAPI(data) {
    return new Invoice(data);
  }
}

export default Invoice;
