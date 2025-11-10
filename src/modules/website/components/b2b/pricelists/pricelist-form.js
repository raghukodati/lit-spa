/**
 * Price List Form Component - Create/Edit Price Lists
 */

import { html } from 'lit';
import { BaseComponent } from '../../../../../shared/components/base/BaseComponent.js';
import { PriceList } from '../../../models/pricelist.model.js';

class PriceListForm extends BaseComponent {
  static properties = {
    priceListId: { type: String },
    priceList: { type: Object },
    companies: { type: Array },
    products: { type: Array },
    loading: { type: Boolean },
    saving: { type: Boolean },
    error: { type: String },
    validationErrors: { type: Array }
  };

  constructor() {
    super();
    this.priceListId = null;
    this.priceList = {
      name: '',
      code: '',
      description: '',
      status: 'active',
      type: 'custom',
      currency: 'USD',
      priceModifier: 'percentage',
      modifierValue: 0,
      items: [],
      volumeTiers: [],
      assignedCompanies: [],
      assignedCategories: [],
      assignedProducts: [],
      validFrom: '',
      validTo: '',
      priority: 5,
      minimumOrderQty: 0,
      minimumOrderAmount: 0
    };
    this.companies = [];
    this.products = [];
    this.loading = false;
    this.saving = false;
    this.error = '';
    this.validationErrors = [];
    this._pricelistService = null;
    this._companyService = null;
    this._productService = null;
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
    
    const pathname = window.location.pathname;
    const match = pathname.match(/\/website\/b2b\/pricelists\/edit\/(\d+)/);
    if (match) {
      this.priceListId = match[1];
      await this.loadPriceList();
    }
  }

  async loadData() {
    this.loading = true;
    try {
      if (!this._companyService) {
        this._companyService = await this.getService('companyService');
      }
      if (!this._productService) {
        this._productService = await this.getService('productService');
      }
      
      [this.companies, this.products] = await Promise.all([
        this._companyService.getCompanies({ status: 'active' }),
        this._productService.getProducts({ status: 'active' })
      ]);
    } catch (err) {
      this.error = 'Failed to load data';
    } finally {
      this.loading = false;
    }
  }

  async loadPriceList() {
    if (!this.priceListId) return;

    this.loading = true;
    try {
      if (!this._pricelistService) {
        this._pricelistService = await this.getService('pricelistService');
      }
      const priceList = await this._pricelistService.getPriceListById(this.priceListId);
      if (priceList) {
        this.priceList = priceList;
      }
    } catch (err) {
      this.error = 'Failed to load price list';
    } finally {
      this.loading = false;
    }
  }

  handleInputChange(field, value) {
    this.priceList[field] = value;
    this.requestUpdate();
  }

  handleAddVolumeTier() {
    this.priceList.volumeTiers.push({
      minQty: 0,
      maxQty: null,
      discount: 0,
      price: 0
    });
    this.requestUpdate();
  }

  handleRemoveVolumeTier(index) {
    this.priceList.volumeTiers.splice(index, 1);
    this.requestUpdate();
  }

  handleTierChange(index, field, value) {
    this.priceList.volumeTiers[index][field] = value;
    this.requestUpdate();
  }

  handleAddProductPrice() {
    this.priceList.items.push({
      productId: null,
      sku: '',
      price: 0,
      minQty: null,
      maxQty: null
    });
    this.requestUpdate();
  }

  handleRemoveProductPrice(index) {
    this.priceList.items.splice(index, 1);
    this.requestUpdate();
  }

  handleProductPriceChange(index, field, value) {
    this.priceList.items[index][field] = value;
    
    if (field === 'productId' && value) {
      const product = this.products.find(p => p.id === parseInt(value));
      if (product) {
        this.priceList.items[index].sku = product.sku;
      }
    }
    
    this.requestUpdate();
  }

  handleCompanyToggle(companyId) {
    const index = this.priceList.assignedCompanies.indexOf(companyId);
    if (index > -1) {
      this.priceList.assignedCompanies.splice(index, 1);
    } else {
      this.priceList.assignedCompanies.push(companyId);
    }
    this.requestUpdate();
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Make sure we have the latest values
    this.requestUpdate();
    
    const priceListObj = new PriceList(this.priceList);
    const validation = priceListObj.validate();
    
    if (!validation.isValid) {
      this.validationErrors = validation.errors;
      this.error = 'Please fix validation errors before saving';
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    this.validationErrors = [];
    this.saving = true;
    this.error = '';

    try {
      if (!this._pricelistService) {
        this._pricelistService = await this.getService('pricelistService');
      }
      
      const action = this.priceListId ? 'update' : 'create';
      if (!this.can('pricelists', action)) {
        alert(`You do not have permission to ${action} price lists`);
        this.saving = false;
        return;
      }
      
      if (this.priceListId) {
        await this._pricelistService.updatePriceList(this.priceListId, this.priceList);
      } else {
        await this._pricelistService.createPriceList(this.priceList);
      }
      
      // Success - redirect to list
      window.location.pathname = '/website/b2b/pricelists';
    } catch (err) {
      this.error = err.message || 'Failed to save price list';
      this.saving = false;
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  render() {
    if (this.loading && !this.companies.length) {
      return html`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading...</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">${this.priceListId ? 'Edit' : 'Create'} Price List</h2>
            <p class="text-muted mb-0">Manage custom pricing & volume discounts</p>
          </div>
          <a href="#/website/b2b/pricelists" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Back
          </a>
        </div>

        ${this.error ? html`
          <div class="alert alert-danger alert-dismissible fade show">
            <i class="bi bi-exclamation-triangle me-2"></i>${this.error}
            <button type="button" class="btn-close" @click=${() => this.error = ''}></button>
          </div>
        ` : ''}

        ${this.validationErrors.length > 0 ? html`
          <div class="alert alert-warning alert-dismissible fade show">
            <strong>Validation Errors:</strong>
            <ul class="mb-0 mt-2">
              ${this.validationErrors.map(err => html`<li>${err}</li>`)}
            </ul>
            <button type="button" class="btn-close" @click=${() => this.validationErrors = []}></button>
          </div>
        ` : ''}

        <form @submit=${this.handleSubmit}>
          <div class="row">
            <div class="col-lg-8">
              <!-- Basic Information -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Basic Information</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Name *</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.priceList.name}
                        @input=${(e) => this.handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Code *</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.priceList.code}
                        @input=${(e) => this.handleInputChange('code', e.target.value)}
                        required
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Description</label>
                      <textarea
                        class="form-control"
                        rows="2"
                        .value=${this.priceList.description}
                        @input=${(e) => this.handleInputChange('description', e.target.value)}
                      ></textarea>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Type</label>
                      <select 
                        class="form-select"
                        .value=${this.priceList.type}
                        @change=${(e) => this.handleInputChange('type', e.target.value)}
                      >
                        <option value="custom">Custom</option>
                        <option value="volume">Volume</option>
                        <option value="promotional">Promotional</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Currency</label>
                      <select 
                        class="form-select"
                        .value=${this.priceList.currency}
                        @change=${(e) => this.handleInputChange('currency', e.target.value)}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Priority</label>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.priceList.priority}
                        @input=${(e) => this.handleInputChange('priority', parseInt(e.target.value))}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pricing Rules -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Pricing Rules</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Price Modifier</label>
                      <select 
                        class="form-select"
                        .value=${this.priceList.priceModifier}
                        @change=${(e) => this.handleInputChange('priceModifier', e.target.value)}
                      >
                        <option value="fixed">Fixed Price</option>
                        <option value="percentage">Percentage Discount</option>
                        <option value="markup">Markup</option>
                        <option value="discount">Discount Amount</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Modifier Value</label>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.priceList.modifierValue}
                        @input=${(e) => this.handleInputChange('modifierValue', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                      <small class="text-muted">
                        ${this.priceList.priceModifier === 'percentage' ? 'Percentage (%)' : 
                          this.priceList.priceModifier === 'fixed' ? 'Fixed amount' : 'Value'}
                      </small>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Minimum Order Qty</label>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.priceList.minimumOrderQty}
                        @input=${(e) => this.handleInputChange('minimumOrderQty', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Minimum Order Amount</label>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.priceList.minimumOrderAmount}
                        @input=${(e) => this.handleInputChange('minimumOrderAmount', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Volume Tiers -->
              <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">Volume Tiers</h5>
                  <button type="button" class="btn btn-sm btn-primary" @click=${this.handleAddVolumeTier}>
                    <i class="bi bi-plus-circle me-2"></i>Add Tier
                  </button>
                </div>
                <div class="card-body">
                  ${this.priceList.volumeTiers.length === 0 ? html`
                    <p class="text-muted text-center mb-0">No volume tiers defined</p>
                  ` : html`
                    <div class="table-responsive">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Min Qty</th>
                            <th>Max Qty</th>
                            <th>${this.priceList.priceModifier === 'fixed' ? 'Price' : 'Discount'}</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          ${this.priceList.volumeTiers.map((tier, index) => html`
                            <tr>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${tier.minQty}
                                  @input=${(e) => this.handleTierChange(index, 'minQty', parseInt(e.target.value) || 0)}
                                  min="0"
                                  style="width: 100px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${tier.maxQty || ''}
                                  @input=${(e) => this.handleTierChange(index, 'maxQty', e.target.value ? parseInt(e.target.value) : null)}
                                  min="0"
                                  placeholder="No limit"
                                  style="width: 100px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${this.priceList.priceModifier === 'fixed' ? tier.price : tier.discount}
                                  @input=${(e) => this.handleTierChange(
                                    index, 
                                    this.priceList.priceModifier === 'fixed' ? 'price' : 'discount',
                                    parseFloat(e.target.value) || 0
                                  )}
                                  min="0"
                                  step="0.01"
                                  style="width: 100px;"
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  class="btn btn-sm btn-outline-danger"
                                  @click=${() => this.handleRemoveVolumeTier(index)}
                                >
                                  <i class="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          `)}
                        </tbody>
                      </table>
                    </div>
                  `}
                </div>
              </div>

              <!-- Product-Specific Prices -->
              <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">Product-Specific Prices</h5>
                  <button type="button" class="btn btn-sm btn-primary" @click=${this.handleAddProductPrice}>
                    <i class="bi bi-plus-circle me-2"></i>Add Product
                  </button>
                </div>
                <div class="card-body">
                  ${this.priceList.items.length === 0 ? html`
                    <p class="text-muted text-center mb-0">No product-specific prices</p>
                  ` : html`
                    <div class="table-responsive">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Min Qty</th>
                            <th>Max Qty</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          ${this.priceList.items.map((item, index) => html`
                            <tr>
                              <td>
                                <select 
                                  class="form-select form-select-sm"
                                  .value=${item.productId || ''}
                                  @change=${(e) => this.handleProductPriceChange(index, 'productId', parseInt(e.target.value))}
                                >
                                  <option value="">Select Product</option>
                                  ${this.products.map(product => html`
                                    <option value="${product.id}">${product.name}</option>
                                  `)}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${item.price}
                                  @input=${(e) => this.handleProductPriceChange(index, 'price', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  step="0.01"
                                  style="width: 100px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${item.minQty || ''}
                                  @input=${(e) => this.handleProductPriceChange(index, 'minQty', e.target.value ? parseInt(e.target.value) : null)}
                                  min="0"
                                  style="width: 80px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${item.maxQty || ''}
                                  @input=${(e) => this.handleProductPriceChange(index, 'maxQty', e.target.value ? parseInt(e.target.value) : null)}
                                  min="0"
                                  style="width: 80px;"
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  class="btn btn-sm btn-outline-danger"
                                  @click=${() => this.handleRemoveProductPrice(index)}
                                >
                                  <i class="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          `)}
                        </tbody>
                      </table>
                    </div>
                  `}
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <!-- Status -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Status</h5>
                </div>
                <div class="card-body">
                  <select 
                    class="form-select"
                    .value=${this.priceList.status}
                    @change=${(e) => this.handleInputChange('status', e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <!-- Validity Period -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Validity Period</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Valid From</label>
                    <input
                      type="date"
                      class="form-control"
                      .value=${this.priceList.validFrom}
                      @input=${(e) => this.handleInputChange('validFrom', e.target.value)}
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Valid To</label>
                    <input
                      type="date"
                      class="form-control"
                      .value=${this.priceList.validTo}
                      @input=${(e) => this.handleInputChange('validTo', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <!-- Assigned Companies -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Assigned Companies</h5>
                </div>
                <div class="card-body">
                  <div style="max-height: 300px; overflow-y: auto;">
                    ${this.companies.map(company => html`
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          .checked=${this.priceList.assignedCompanies.includes(company.id)}
                          @change=${() => this.handleCompanyToggle(company.id)}
                          id="company-${company.id}"
                        />
                        <label class="form-check-label" for="company-${company.id}">
                          ${company.name}
                        </label>
                      </div>
                    `)}
                  </div>
                  ${this.companies.length === 0 ? html`
                    <p class="text-muted small mb-0">No companies available</p>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-end gap-2">
                <a href="#/website/b2b/pricelists" class="btn btn-outline-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary" ?disabled=${this.saving}>
                  ${this.saving ? html`
                    <span class="spinner-border spinner-border-sm me-2"></span>Saving...
                  ` : html`
                    <i class="bi bi-check-circle me-2"></i>${this.priceListId ? 'Update' : 'Create'} Price List
                  `}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('pricelist-form', PriceListForm);
