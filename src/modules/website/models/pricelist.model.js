/**
 * Price List Model - B2B Custom Pricing
 */

export class PriceList {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.code = data.code || '';
    this.description = data.description || '';
    
    // Status & Type
    this.status = data.status || 'active'; // active, inactive, scheduled
    this.type = data.type || 'custom'; // custom, volume, promotional, contract
    this.currency = data.currency || 'USD';
    
    // Pricing Rules
    this.priceModifier = data.priceModifier || 'fixed'; // fixed, percentage, markup, discount
    this.modifierValue = data.modifierValue || 0;
    
    // Items (product-specific pricing)
    this.items = data.items || []; // { productId, sku, price, minQty, maxQty }
    
    // Volume Pricing Tiers
    this.volumeTiers = data.volumeTiers || []; // { minQty, maxQty, discount/price }
    
    // Assignment
    this.assignedCompanies = data.assignedCompanies || []; // company IDs
    this.assignedCategories = data.assignedCategories || []; // category IDs
    this.assignedProducts = data.assignedProducts || []; // product IDs
    
    // Validity
    this.validFrom = data.validFrom || null;
    this.validTo = data.validTo || null;
    
    // Priority (higher number = higher priority)
    this.priority = data.priority || 0;
    
    // Conditions
    this.minimumOrderQty = data.minimumOrderQty || 0;
    this.minimumOrderAmount = data.minimumOrderAmount || 0;
    
    // Metadata
    this.notes = data.notes || '';
    this.tags = data.tags || [];
    
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.createdBy = data.createdBy || null;
  }

  get isActive() {
    if (this.status !== 'active') return false;
    
    const now = new Date();
    if (this.validFrom && new Date(this.validFrom) > now) return false;
    if (this.validTo && new Date(this.validTo) < now) return false;
    
    return true;
  }

  getPrice(productId, quantity, basePrice) {
    // Check for product-specific price
    const item = this.items.find(i => i.productId === productId);
    if (item) {
      // Check if quantity matches min/max
      if (item.minQty && quantity < item.minQty) return basePrice;
      if (item.maxQty && quantity > item.maxQty) return basePrice;
      return item.price;
    }
    
    // Check volume tiers
    const tier = this.volumeTiers.find(t => 
      quantity >= (t.minQty || 0) && 
      (!t.maxQty || quantity <= t.maxQty)
    );
    
    if (tier) {
      if (this.priceModifier === 'fixed') {
        return tier.price;
      } else if (this.priceModifier === 'percentage') {
        return basePrice * (1 - tier.discount / 100);
      } else if (this.priceModifier === 'discount') {
        return basePrice - tier.discount;
      }
    }
    
    // Apply general modifier
    switch (this.priceModifier) {
      case 'fixed':
        return this.modifierValue;
      case 'percentage':
        return basePrice * (1 - this.modifierValue / 100);
      case 'markup':
        return basePrice * (1 + this.modifierValue / 100);
      case 'discount':
        return basePrice - this.modifierValue;
      default:
        return basePrice;
    }
  }

  addItem(productId, sku, price, minQty = null, maxQty = null) {
    this.items.push({ productId, sku, price, minQty, maxQty });
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.productId !== productId);
  }

  addVolumeTier(minQty, maxQty, discountOrPrice) {
    this.volumeTiers.push({ minQty, maxQty, 
      [this.priceModifier === 'fixed' ? 'price' : 'discount']: discountOrPrice 
    });
    // Sort by minQty
    this.volumeTiers.sort((a, b) => a.minQty - b.minQty);
  }

  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Price list name is required');
    }
    
    if (!this.code || this.code.trim() === '') {
      errors.push('Price list code is required');
    }
    
    if (this.validFrom && this.validTo && new Date(this.validFrom) > new Date(this.validTo)) {
      errors.push('Valid from date must be before valid to date');
    }
    
    if (this.modifierValue < 0) {
      errors.push('Modifier value cannot be negative');
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
    return new PriceList(data);
  }
}

export default PriceList;
