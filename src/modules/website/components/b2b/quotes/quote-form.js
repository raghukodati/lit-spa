/**
 * Quote Form Component - Create/Edit B2B Quotes
 */

import { html } from 'lit';
import { BaseComponent } from '../../../../../shared/components/base/BaseComponent.js';
import { Quote } from '../../../models/quote.model.js';

class QuoteForm extends BaseComponent {
  static properties = {
    quoteId: { type: String },
    quote: { type: Object },
    companies: { type: Array },
    products: { type: Array },
    loading: { type: Boolean },
    saving: { type: Boolean },
    error: { type: String },
    validationErrors: { type: Array }
  };

  constructor() {
    super();
    this.quoteId = null;
    this.quote = {
      type: 'standard',
      companyId: null,
      companyName: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      title: '',
      description: '',
      items: [],
      discountPercent: 0,
      discountAmount: 0,
      shippingAmount: 0,
      paymentTerms: 'Net 30',
      validUntil: '',
      termsAndConditions: '',
      notes: ''
    };
    this.companies = [];
    this.products = [];
    this.loading = false;
    this.saving = false;
    this.error = '';
    this.validationErrors = [];
    this._quoteService = null;
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
    const match = pathname.match(/\/website\/b2b\/quotes\/edit\/(\d+)/);
    if (match) {
      this.quoteId = match[1];
      await this.loadQuote();
    }
    
    // Check for companyId in URL
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('companyId');
    if (companyId && !this.quoteId) {
      this.handleCompanyChange({ target: { value: companyId } });
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

  async loadQuote() {
    if (!this.quoteId) return;

    this.loading = true;
    try {
      if (!this._quoteService) {
        this._quoteService = await this.getService('quoteService');
      }
      const quote = await this._quoteService.getQuoteById(this.quoteId);
      if (quote) {
        this.quote = quote;
      }
    } catch (err) {
      this.error = 'Failed to load quote';
    } finally {
      this.loading = false;
    }
  }

  handleCompanyChange(e) {
    const companyId = parseInt(e.target.value);
    const company = this.companies.find(c => c.id === companyId);
    
    if (company) {
      this.quote = {
        ...this.quote,
        companyId: company.id,
        companyName: company.name,
        contactName: company.primaryContact.name,
        contactEmail: company.primaryContact.email,
        contactPhone: company.primaryContact.phone,
        paymentTerms: company.paymentTerms,
        discountPercent: company.discountPercent
      };
      this.requestUpdate();
    }
  }

  handleInputChange(field, value) {
    this.quote[field] = value;
    this.requestUpdate();
  }

  handleAddItem() {
    this.quote.items.push({
      productId: null,
      sku: '',
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0
    });
    this.requestUpdate();
  }

  handleRemoveItem(index) {
    this.quote.items.splice(index, 1);
    this.calculateTotals();
    this.requestUpdate();
  }

  handleItemChange(index, field, value) {
    this.quote.items[index][field] = value;
    
    // If product selected, populate details
    if (field === 'productId' && value) {
      const product = this.products.find(p => p.id === parseInt(value));
      if (product) {
        this.quote.items[index].sku = product.sku;
        this.quote.items[index].name = product.name;
        this.quote.items[index].description = product.description;
        this.quote.items[index].unitPrice = product.price;
      }
    }
    
    // Calculate item total
    const item = this.quote.items[index];
    item.total = (item.quantity * item.unitPrice) - item.discount;
    
    this.calculateTotals();
    this.requestUpdate();
  }

  calculateTotals() {
    const quoteObj = new Quote(this.quote);
    quoteObj.calculateTotals();
    
    this.quote.subtotal = quoteObj.subtotal;
    this.quote.taxAmount = quoteObj.taxAmount;
    this.quote.total = quoteObj.total;
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    this.calculateTotals();
    
    const quoteObj = new Quote(this.quote);
    const validation = quoteObj.validate();
    
    if (!validation.isValid) {
      this.validationErrors = validation.errors;
      return;
    }
    
    this.validationErrors = [];
    this.saving = true;
    this.error = '';

    try {
      if (!this._quoteService) {
        this._quoteService = await this.getService('quoteService');
      }
      
      const action = this.quoteId ? 'update' : 'create';
      if (!this.can('quotes', action)) {
        alert(`You do not have permission to ${action} quotes`);
        this.saving = false;
        return;
      }
      
      if (this.quoteId) {
        await this._quoteService.updateQuote(this.quoteId, this.quote);
      } else {
        await this._quoteService.createQuote(this.quote);
      }
      
      window.location.pathname = '/website/b2b/quotes';
    } catch (err) {
      this.error = err.message || 'Failed to save quote';
    } finally {
      this.saving = false;
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
            <h2 class="mb-1">${this.quoteId ? 'Edit' : 'Create'} Quote</h2>
            <p class="text-muted mb-0">Create or edit customer quote</p>
          </div>
          <a href="#/website/b2b/quotes" class="btn btn-outline-secondary">
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
              <!-- Quote Information -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Quote Information</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Company *</label>
                      <select 
                        class="form-select"
                        .value=${this.quote.companyId || ''}
                        @change=${this.handleCompanyChange}
                        required
                      >
                        <option value="">Select Company</option>
                        ${this.companies.map(company => html`
                          <option value="${company.id}">${company.name}</option>
                        `)}
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Type</label>
                      <select 
                        class="form-select"
                        .value=${this.quote.type}
                        @change=${(e) => this.handleInputChange('type', e.target.value)}
                      >
                        <option value="standard">Standard</option>
                        <option value="rfq">RFQ</option>
                        <option value="bulk">Bulk</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Contact Name</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.quote.contactName}
                        @input=${(e) => this.handleInputChange('contactName', e.target.value)}
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Contact Email *</label>
                      <input
                        type="email"
                        class="form-control"
                        .value=${this.quote.contactEmail}
                        @input=${(e) => this.handleInputChange('contactEmail', e.target.value)}
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Contact Phone</label>
                      <input
                        type="tel"
                        class="form-control"
                        .value=${this.quote.contactPhone}
                        @input=${(e) => this.handleInputChange('contactPhone', e.target.value)}
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Valid Until</label>
                      <input
                        type="date"
                        class="form-control"
                        .value=${this.quote.validUntil}
                        @input=${(e) => this.handleInputChange('validUntil', e.target.value)}
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Title</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.quote.title}
                        @input=${(e) => this.handleInputChange('title', e.target.value)}
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Description</label>
                      <textarea
                        class="form-control"
                        rows="2"
                        .value=${this.quote.description}
                        @input=${(e) => this.handleInputChange('description', e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Line Items -->
              <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">Line Items</h5>
                  <button type="button" class="btn btn-sm btn-primary" @click=${this.handleAddItem}>
                    <i class="bi bi-plus-circle me-2"></i>Add Item
                  </button>
                </div>
                <div class="card-body">
                  ${this.quote.items.length === 0 ? html`
                    <p class="text-muted text-center mb-0">No items added yet</p>
                  ` : html`
                    <div class="table-responsive">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Discount</th>
                            <th>Total</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          ${this.quote.items.map((item, index) => html`
                            <tr>
                              <td>
                                <select 
                                  class="form-select form-select-sm"
                                  .value=${item.productId || ''}
                                  @change=${(e) => this.handleItemChange(index, 'productId', e.target.value)}
                                >
                                  <option value="">Select Product</option>
                                  ${this.products.map(product => html`
                                    <option value="${product.id}">${product.name}</option>
                                  `)}
                                </select>
                                ${item.name && !item.productId ? html`
                                  <input
                                    type="text"
                                    class="form-control form-control-sm mt-1"
                                    placeholder="Product name"
                                    .value=${item.name}
                                    @input=${(e) => this.handleItemChange(index, 'name', e.target.value)}
                                  />
                                ` : ''}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${item.quantity}
                                  @input=${(e) => this.handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                  min="1"
                                  style="width: 80px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${item.unitPrice}
                                  @input=${(e) => this.handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  step="0.01"
                                  style="width: 100px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${item.discount}
                                  @input=${(e) => this.handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  step="0.01"
                                  style="width: 80px;"
                                />
                              </td>
                              <td>${this.formatCurrency(item.total)}</td>
                              <td>
                                <button
                                  type="button"
                                  class="btn btn-sm btn-outline-danger"
                                  @click=${() => this.handleRemoveItem(index)}
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

              <!-- Terms -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Terms & Conditions</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Terms and Conditions</label>
                    <textarea
                      class="form-control"
                      rows="3"
                      .value=${this.quote.termsAndConditions}
                      @input=${(e) => this.handleInputChange('termsAndConditions', e.target.value)}
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Internal Notes</label>
                    <textarea
                      class="form-control"
                      rows="2"
                      .value=${this.quote.notes}
                      @input=${(e) => this.handleInputChange('notes', e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <!-- Pricing -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Pricing</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Payment Terms</label>
                    <select 
                      class="form-select"
                      .value=${this.quote.paymentTerms}
                      @change=${(e) => this.handleInputChange('paymentTerms', e.target.value)}
                    >
                      <option value="COD">COD</option>
                      <option value="Prepaid">Prepaid</option>
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Net 90">Net 90</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Discount %</label>
                    <input
                      type="number"
                      class="form-control"
                      .value=${this.quote.discountPercent}
                      @input=${(e) => {
                        this.handleInputChange('discountPercent', parseFloat(e.target.value) || 0);
                        this.calculateTotals();
                      }}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Shipping Amount</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.quote.shippingAmount}
                        @input=${(e) => {
                          this.handleInputChange('shippingAmount', parseFloat(e.target.value) || 0);
                          this.calculateTotals();
                        }}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Summary -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Summary</h5>
                </div>
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <strong>${this.formatCurrency(this.quote.subtotal || 0)}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Discount:</span>
                    <strong class="text-danger">-${this.formatCurrency(this.quote.discountAmount || 0)}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <strong>${this.formatCurrency(this.quote.taxAmount || 0)}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <strong>${this.formatCurrency(this.quote.shippingAmount || 0)}</strong>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong class="fs-5 text-primary">${this.formatCurrency(this.quote.total || 0)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-end gap-2">
                <a href="#/website/b2b/quotes" class="btn btn-outline-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary" ?disabled=${this.saving}>
                  ${this.saving ? html`
                    <span class="spinner-border spinner-border-sm me-2"></span>Saving...
                  ` : html`
                    <i class="bi bi-check-circle me-2"></i>${this.quoteId ? 'Update' : 'Create'} Quote
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

customElements.define('quote-form', QuoteForm);
