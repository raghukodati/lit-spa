/**
 * Purchase Order Model - B2B Purchase Orders
 */

export class PurchaseOrder {
  constructor(data = {}) {
    this.id = data.id || null;
    this.poNumber = data.poNumber || '';
    this.customerPONumber = data.customerPONumber || ''; // Customer's internal PO number
    
    // Company & Contact
    this.companyId = data.companyId || null;
    this.companyName = data.companyName || '';
    this.contactId = data.contactId || null;
    this.contactName = data.contactName || '';
    this.contactEmail = data.contactEmail || '';
    
    // Status
    this.status = data.status || 'draft'; // draft, submitted, approved, processing, shipped, delivered, cancelled
    this.approvalStatus = data.approvalStatus || 'pending'; // pending, approved, rejected
    
    // Linked Documents
    this.quoteId = data.quoteId || null;
    this.contractId = data.contractId || null;
    this.orderId = data.orderId || null; // Converted to sales order
    
    // Line Items
    this.items = data.items || [];
    
    // Pricing
    this.subtotal = data.subtotal || 0;
    this.discountAmount = data.discountAmount || 0;
    this.taxAmount = data.taxAmount || 0;
    this.shippingAmount = data.shippingAmount || 0;
    this.total = data.total || 0;
    this.currency = data.currency || 'USD';
    
    // Payment
    this.paymentTerms = data.paymentTerms || 'Net 30';
    this.paymentMethod = data.paymentMethod || 'invoice';
    this.paymentStatus = data.paymentStatus || 'unpaid'; // unpaid, partial, paid
    this.paidAmount = data.paidAmount || 0;
    
    // Shipping
    this.shippingAddress = data.shippingAddress || null;
    this.billingAddress = data.billingAddress || null;
    this.shippingMethod = data.shippingMethod || '';
    this.requestedDeliveryDate = data.requestedDeliveryDate || null;
    this.estimatedDeliveryDate = data.estimatedDeliveryDate || null;
    this.actualDeliveryDate = data.actualDeliveryDate || null;
    
    // Tracking
    this.trackingNumber = data.trackingNumber || '';
    this.carrier = data.carrier || '';
    
    // Approval Workflow
    this.requiresApproval = data.requiresApproval || false;
    this.approvalLimit = data.approvalLimit || 0;
    this.approvers = data.approvers || []; // { userId, name, status, approvedAt }
    this.approvedBy = data.approvedBy || null;
    this.approvedAt = data.approvedAt || null;
    this.rejectedBy = data.rejectedBy || null;
    this.rejectedAt = data.rejectedAt || null;
    this.rejectionReason = data.rejectionReason || '';
    
    // Special Instructions
    this.specialInstructions = data.specialInstructions || '';
    this.internalNotes = data.internalNotes || '';
    this.deliveryInstructions = data.deliveryInstructions || '';
    
    // Tax & Compliance
    this.taxExempt = data.taxExempt || false;
    this.taxExemptId = data.taxExemptId || '';
    
    // Budget & Cost Center
    this.costCenter = data.costCenter || '';
    this.budgetCode = data.budgetCode || '';
    this.projectCode = data.projectCode || '';
    
    // Attachments
    this.attachments = data.attachments || [];
    
    // Account Manager
    this.accountManagerId = data.accountManagerId || null;
    this.salesRepId = data.salesRepId || null;
    
    // Metadata
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.createdBy = data.createdBy || null;
    this.submittedAt = data.submittedAt || null;
  }

  get isApproved() {
    return this.approvalStatus === 'approved';
  }

  get isPending() {
    return this.status === 'submitted' && this.approvalStatus === 'pending';
  }

  get isFullyPaid() {
    return this.paymentStatus === 'paid';
  }

  get remainingBalance() {
    return this.total - this.paidAmount;
  }

  get itemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  calculateTotals() {
    this.subtotal = this.items.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    
    const afterDiscount = this.subtotal - this.discountAmount;
    
    if (!this.taxExempt) {
      this.taxAmount = afterDiscount * 0.08; // Example tax rate
    } else {
      this.taxAmount = 0;
    }
    
    this.total = afterDiscount + this.taxAmount + this.shippingAmount;
  }

  needsApproval() {
    if (!this.requiresApproval) return false;
    if (this.approvalLimit === 0) return true;
    return this.total > this.approvalLimit;
  }

  canApprove(userId) {
    if (!this.needsApproval()) return false;
    if (this.approvalStatus !== 'pending') return false;
    return this.approvers.some(a => a.userId === userId && a.status === 'pending');
  }

  approve(userId, userName) {
    const approver = this.approvers.find(a => a.userId === userId);
    if (approver) {
      approver.status = 'approved';
      approver.approvedAt = new Date().toISOString();
    }
    
    // Check if all approvers have approved
    if (this.approvers.every(a => a.status === 'approved')) {
      this.approvalStatus = 'approved';
      this.approvedBy = userId;
      this.approvedAt = new Date().toISOString();
    }
  }

  reject(userId, reason) {
    this.approvalStatus = 'rejected';
    this.rejectedBy = userId;
    this.rejectedAt = new Date().toISOString();
    this.rejectionReason = reason;
  }

  validate() {
    const errors = [];
    
    if (!this.companyId) {
      errors.push('Company is required');
    }
    
    if (!this.customerPONumber || this.customerPONumber.trim() === '') {
      errors.push('Customer PO number is required');
    }
    
    if (this.items.length === 0) {
      errors.push('At least one item is required');
    }
    
    if (!this.shippingAddress) {
      errors.push('Shipping address is required');
    }
    
    if (this.total <= 0) {
      errors.push('Total must be greater than zero');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return { ...this };
  }

  static fromAPI(data) {
    return new PurchaseOrder(data);
  }
}

export default PurchaseOrder;
