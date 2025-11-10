/**
 * Contract Model - B2B Customer Contracts
 */

export class Contract {
  constructor(data = {}) {
    this.id = data.id || null;
    this.contractNumber = data.contractNumber || '';
    this.name = data.name || '';
    this.type = data.type || 'standard'; // standard, master, blanket, framework
    
    // Company
    this.companyId = data.companyId || null;
    this.companyName = data.companyName || '';
    
    // Status
    this.status = data.status || 'draft'; // draft, pending, active, expired, terminated, renewed
    
    // Contract Period
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.autoRenew = data.autoRenew || false;
    this.renewalPeriod = data.renewalPeriod || 12; // months
    this.renewalNotice = data.renewalNotice || 30; // days before end
    
    // Financial Terms
    this.totalValue = data.totalValue || 0;
    this.minimumCommitment = data.minimumCommitment || 0;
    this.paymentTerms = data.paymentTerms || 'Net 30';
    this.currency = data.currency || 'USD';
    this.priceListId = data.priceListId || null;
    
    // Pricing & Discounts
    this.discountPercent = data.discountPercent || 0;
    this.volumeDiscount = data.volumeDiscount || false;
    this.volumeTiers = data.volumeTiers || [];
    
    // Credit Terms
    this.creditLimit = data.creditLimit || 0;
    this.paymentSchedule = data.paymentSchedule || 'per_order'; // per_order, monthly, quarterly, annually
    
    // Products & Services
    this.includedProducts = data.includedProducts || []; // product IDs or categories
    this.excludedProducts = data.excludedProducts || [];
    this.serviceLevel = data.serviceLevel || 'standard'; // standard, premium, enterprise
    
    // Delivery Terms
    this.shippingTerms = data.shippingTerms || 'FOB';
    this.deliverySchedule = data.deliverySchedule || '';
    this.allowBackorders = data.allowBackorders || true;
    this.minOrderQty = data.minOrderQty || 0;
    this.maxOrderQty = data.maxOrderQty || null;
    
    // Legal & Compliance
    this.termsAndConditions = data.termsAndConditions || '';
    this.slaTerms = data.slaTerms || '';
    this.confidentialityClause = data.confidentialityClause || '';
    this.terminationClause = data.terminationClause || '';
    this.penaltyClause = data.penaltyClause || '';
    
    // Signatories
    this.customerSignatory = data.customerSignatory || null;
    this.customerSignedDate = data.customerSignedDate || null;
    this.vendorSignatory = data.vendorSignatory || null;
    this.vendorSignedDate = data.vendorSignedDate || null;
    
    // Account Management
    this.accountManagerId = data.accountManagerId || null;
    this.accountManagerName = data.accountManagerName || '';
    
    // Performance Tracking
    this.ordersPlaced = data.ordersPlaced || 0;
    this.totalSpent = data.totalSpent || 0;
    this.lastOrderDate = data.lastOrderDate || null;
    
    // Approval Workflow
    this.requiresApproval = data.requiresApproval || true;
    this.approvalStatus = data.approvalStatus || 'pending';
    this.approvedBy = data.approvedBy || [];
    this.approvedAt = data.approvedAt || null;
    
    // Attachments
    this.attachments = data.attachments || [];
    
    // Metadata
    this.notes = data.notes || '';
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.createdBy = data.createdBy || null;
  }

  get isActive() {
    if (this.status !== 'active') return false;
    
    const now = new Date();
    if (this.startDate && new Date(this.startDate) > now) return false;
    if (this.endDate && new Date(this.endDate) < now) return false;
    
    return true;
  }

  get isExpiringSoon() {
    if (!this.endDate || this.status !== 'active') return false;
    
    const now = new Date();
    const endDate = new Date(this.endDate);
    const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiry <= this.renewalNotice;
  }

  get remainingCommitment() {
    return Math.max(0, this.minimumCommitment - this.totalSpent);
  }

  get commitmentProgress() {
    if (this.minimumCommitment === 0) return 100;
    return Math.min(100, (this.totalSpent / this.minimumCommitment) * 100);
  }

  get isSigned() {
    return this.customerSignedDate !== null && this.vendorSignedDate !== null;
  }

  canPlaceOrder(orderTotal) {
    if (!this.isActive) return false;
    if (this.minOrderQty && orderTotal < this.minOrderQty) return false;
    if (this.maxOrderQty && orderTotal > this.maxOrderQty) return false;
    return true;
  }

  getVolumeDiscount(quantity) {
    if (!this.volumeDiscount || !this.volumeTiers.length) return 0;
    
    const tier = this.volumeTiers
      .filter(t => quantity >= t.minQty)
      .sort((a, b) => b.minQty - a.minQty)[0];
    
    return tier ? tier.discount : 0;
  }

  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Contract name is required');
    }
    
    if (!this.companyId) {
      errors.push('Company is required');
    }
    
    if (!this.startDate) {
      errors.push('Start date is required');
    }
    
    if (!this.endDate) {
      errors.push('End date is required');
    }
    
    if (this.startDate && this.endDate && new Date(this.startDate) >= new Date(this.endDate)) {
      errors.push('End date must be after start date');
    }
    
    if (this.totalValue < 0) {
      errors.push('Total value cannot be negative');
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
    return new Contract(data);
  }
}

export default Contract;
