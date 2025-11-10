/**
 * Forecast Model
 */

export class Forecast {
  constructor(data = {}) {
    this.id = data.id || null;
    this.year = data.year || new Date().getFullYear();
    this.month = data.month || new Date().getMonth() + 1;
    this.customer = data.customer || '';
    this.revenue = data.revenue || 0;
    this.cost = data.cost || 0;
    this.profit = data.profit || 0;
    this.notes = data.notes || '';
    this.status = data.status || 'Draft';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    const errors = [];
    
    if (!this.year || this.year < 2000) {
      errors.push('Valid year is required');
    }
    
    if (!this.month || this.month < 1 || this.month > 12) {
      errors.push('Valid month is required (1-12)');
    }
    
    if (!this.customer || this.customer.trim() === '') {
      errors.push('Customer is required');
    }
    
    if (this.revenue < 0) {
      errors.push('Revenue cannot be negative');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  calculateProfit() {
    this.profit = this.revenue - this.cost;
    return this.profit;
  }

  toJSON() {
    return {
      id: this.id,
      year: this.year,
      month: this.month,
      customer: this.customer,
      revenue: this.revenue,
      cost: this.cost,
      profit: this.profit,
      notes: this.notes,
      status: this.status,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromAPI(data) {
    return new Forecast(data);
  }
}

export default Forecast;
