/**
 * Company Model - B2B Customer/Organization
 */

export class Company {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.legalName = data.legalName || '';
    this.taxId = data.taxId || '';
    this.companyType = data.companyType || 'business'; // business, enterprise, distributor, reseller
    this.partnerType = data.partnerType || 'customer'; // unified business partner type
    this.industry = data.industry || '';
    this.website = data.website || '';
    
    // Account Status
    this.status = data.status || 'pending'; // pending, active, suspended, inactive
    this.accountNumber = data.accountNumber || '';
    this.parentCompanyId = data.parentCompanyId || null;
    
    // Contact Information
    this.primaryContact = data.primaryContact || {
      name: '',
      email: '',
      phone: '',
      title: ''
    };
    this.billingAddress = data.billingAddress || {
      street1: '',
      street2: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    };
    this.shippingAddresses = data.shippingAddresses || [];
    
    // B2B Features
    this.creditLimit = data.creditLimit || 0;
    this.creditUsed = data.creditUsed || 0;
    this.paymentTerms = data.paymentTerms || 'Net 30'; // Net 30, Net 60, Net 90, COD, Prepaid
    this.priceListId = data.priceListId || null;
    this.discountPercent = data.discountPercent || 0;
    this.taxExempt = data.taxExempt || false;
    this.taxExemptId = data.taxExemptId || '';
    
    // Account Manager
    this.accountManagerId = data.accountManagerId || null;
    this.accountManagerName = data.accountManagerName || '';
    
    // Purchasing Settings
    this.requiresApproval = data.requiresApproval || false;
    this.approvalLimit = data.approvalLimit || 0;
    this.allowBackorders = data.allowBackorders || true;
    this.minimumOrderAmount = data.minimumOrderAmount || 0;
    this.maximumOrderAmount = data.maximumOrderAmount || null;
    
    // Customer Tier & Settings (from Customers module)
    this.tier = data.tier || 'basic';
    this.settings = data.settings || {
      allowSelfRegistration: false,
      requireMFA: false,
      sessionTimeout: 3600
    };

    // Custom Settings
    this.customCatalog = data.customCatalog || false;
    this.customCatalogId = data.customCatalogId || null;
    this.allowedPaymentMethods = data.allowedPaymentMethods || ['invoice', 'credit_card', 'purchase_order'];
    this.allowedShippingMethods = data.allowedShippingMethods || [];
    
    // Contract & Terms
    this.contractStartDate = data.contractStartDate || null;
    this.contractEndDate = data.contractEndDate || null;
    this.contractTerms = data.contractTerms || '';
    
    // Metadata
    this.notes = data.notes || '';
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.createdBy = data.createdBy || null;
  }

  get availableCredit() {
    return this.creditLimit - this.creditUsed;
  }

  get isActive() {
    return this.status === 'active';
  }

  get hasChildAccounts() {
    return this.parentCompanyId === null;
  }

  canPlaceOrder(orderTotal) {
    if (!this.isActive) return false;
    if (this.minimumOrderAmount && orderTotal < this.minimumOrderAmount) return false;
    if (this.maximumOrderAmount && orderTotal > this.maximumOrderAmount) return false;
    if (this.paymentTerms !== 'Prepaid' && this.paymentTerms !== 'COD') {
      if (orderTotal > this.availableCredit) return false;
    }
    return true;
  }

  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Company name is required');
    }
    
    if (!this.primaryContact.email || !this.isValidEmail(this.primaryContact.email)) {
      errors.push('Valid primary contact email is required');
    }
    
    if (this.creditLimit < 0) {
      errors.push('Credit limit cannot be negative');
    }
    
    if (this.discountPercent < 0 || this.discountPercent > 100) {
      errors.push('Discount percent must be between 0 and 100');
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
    return new Company(data);
  }
}

export default Company;
