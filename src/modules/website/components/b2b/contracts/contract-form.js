/**
 * Contract Form Component - Create/Edit B2B Contracts
 */

import { html } from 'lit';
import { BaseComponent } from '../../../../../shared/components/base/BaseComponent.js';
import { Contract } from '../../../models/contract.model.js';

class ContractForm extends BaseComponent {
  static properties = {
    contractId: { type: String },
    contract: { type: Object },
    companies: { type: Array },
    priceLists: { type: Array },
    loading: { type: Boolean },
    saving: { type: Boolean },
    error: { type: String },
    validationErrors: { type: Array }
  };

  constructor() {
    super();
    this.contractId = null;
    this.contract = {
      contractNumber: '',
      name: '',
      type: 'standard',
      companyId: null,
      companyName: '',
      status: 'draft',
      startDate: '',
      endDate: '',
      autoRenew: false,
      renewalPeriod: 12,
      renewalNotice: 30,
      totalValue: 0,
      minimumCommitment: 0,
      paymentTerms: 'Net 30',
      currency: 'USD',
      priceListId: null,
      discountPercent: 0,
      volumeDiscount: false,
      volumeTiers: [],
      creditLimit: 0,
      paymentSchedule: 'per_order',
      includedProducts: [],
      excludedProducts: [],
      serviceLevel: 'standard',
      shippingTerms: 'FOB',
      deliverySchedule: '',
      allowBackorders: true,
      minOrderQty: 0,
      maxOrderQty: null,
      termsAndConditions: '',
      slaTerms: '',
      confidentialityClause: '',
      terminationClause: '',
      notes: ''
    };
    this.companies = [];
    this.priceLists = [];
    this.loading = false;
    this.saving = false;
    this.error = '';
    this.validationErrors = [];
    this._contractService = null;
    this._companyService = null;
    this._pricelistService = null;
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
    
    const pathname = window.location.pathname;
    const match = pathname.match(/\/website\/b2b\/contracts\/edit\/(\d+)/);
    if (match) {
      this.contractId = match[1];
      await this.loadContract();
    }
    
    // Check for companyId in URL
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('companyId');
    if (companyId && !this.contractId) {
      this.handleCompanyChange({ target: { value: companyId } });
    }
  }

  async loadData() {
    this.loading = true;
    try {
      if (!this._companyService) {
        this._companyService = await this.getService('companyService');
      }
      if (!this._pricelistService) {
        this._pricelistService = await this.getService('pricelistService');
      }
      
      [this.companies, this.priceLists] = await Promise.all([
        this._companyService.getCompanies({ status: 'active' }),
        this._pricelistService.getPriceLists({ status: 'active' })
      ]);
    } catch (err) {
      this.error = 'Failed to load data';
    } finally {
      this.loading = false;
    }
  }

  async loadContract() {
    if (!this.contractId) return;

    this.loading = true;
    try {
      if (!this._contractService) {
        this._contractService = await this.getService('contractService');
      }
      const contract = await this._contractService.getContractById(this.contractId);
      if (contract) {
        this.contract = contract;
      }
    } catch (err) {
      this.error = 'Failed to load contract';
    } finally {
      this.loading = false;
    }
  }

  handleCompanyChange(e) {
    const companyId = parseInt(e.target.value);
    const company = this.companies.find(c => c.id === companyId);
    
    if (company) {
      this.contract = {
        ...this.contract,
        companyId: company.id,
        companyName: company.name,
        paymentTerms: company.paymentTerms,
        creditLimit: company.creditLimit,
        discountPercent: company.discountPercent
      };
      this.requestUpdate();
    }
  }

  handleInputChange(field, value) {
    this.contract[field] = value;
    this.requestUpdate();
  }

  handleAddVolumeTier() {
    this.contract.volumeTiers.push({
      minQty: 0,
      discount: 0
    });
    this.requestUpdate();
  }

  handleRemoveVolumeTier(index) {
    this.contract.volumeTiers.splice(index, 1);
    this.requestUpdate();
  }

  handleTierChange(index, field, value) {
    this.contract.volumeTiers[index][field] = value;
    this.requestUpdate();
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Make sure we have the latest values
    this.requestUpdate();
    
    const contractObj = new Contract(this.contract);
    const validation = contractObj.validate();
    
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
      if (!this._contractService) {
        this._contractService = await this.getService('contractService');
      }
      
      const action = this.contractId ? 'update' : 'create';
      if (!this.can('contracts', action)) {
        alert(`You do not have permission to ${action} contracts`);
        this.saving = false;
        return;
      }
      
      if (this.contractId) {
        await this._contractService.updateContract(this.contractId, this.contract);
      } else {
        await this._contractService.createContract(this.contract);
      }
      
      // Success - redirect to list
      window.location.pathname = '/website/b2b/contracts';
    } catch (err) {
      this.error = err.message || 'Failed to save contract';
      this.saving = false;
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <h2 class="mb-1">${this.contractId ? 'Edit' : 'Create'} Contract</h2>
            <p class="text-muted mb-0">Manage customer contracts & agreements</p>
          </div>
          <a href="#/website/b2b/contracts" class="btn btn-outline-secondary">
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
                  <h5 class="mb-0">Contract Information</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Company *</label>
                      <select 
                        class="form-select"
                        .value=${this.contract.companyId || ''}
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
                      <label class="form-label">Contract Type</label>
                      <select 
                        class="form-select"
                        .value=${this.contract.type}
                        @change=${(e) => this.handleInputChange('type', e.target.value)}
                      >
                        <option value="standard">Standard</option>
                        <option value="master">Master</option>
                        <option value="blanket">Blanket</option>
                        <option value="framework">Framework</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label class="form-label">Contract Name *</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.contract.name}
                        @input=${(e) => this.handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contract Period -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Contract Period</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Start Date *</label>
                      <input
                        type="date"
                        class="form-control"
                        .value=${this.contract.startDate}
                        @input=${(e) => this.handleInputChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">End Date *</label>
                      <input
                        type="date"
                        class="form-control"
                        .value=${this.contract.endDate}
                        @input=${(e) => this.handleInputChange('endDate', e.target.value)}
                        required
                      />
                    </div>
                    <div class="col-12">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          .checked=${this.contract.autoRenew}
                          @change=${(e) => this.handleInputChange('autoRenew', e.target.checked)}
                          id="autoRenew"
                        />
                        <label class="form-check-label" for="autoRenew">
                          Auto-Renew
                        </label>
                      </div>
                    </div>
                    ${this.contract.autoRenew ? html`
                      <div class="col-md-6">
                        <label class="form-label">Renewal Period (months)</label>
                        <input
                          type="number"
                          class="form-control"
                          .value=${this.contract.renewalPeriod}
                          @input=${(e) => this.handleInputChange('renewalPeriod', parseInt(e.target.value))}
                          min="1"
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Renewal Notice (days)</label>
                        <input
                          type="number"
                          class="form-control"
                          .value=${this.contract.renewalNotice}
                          @input=${(e) => this.handleInputChange('renewalNotice', parseInt(e.target.value))}
                          min="1"
                        />
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>

              <!-- Financial Terms -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Financial Terms</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Total Contract Value</label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                          type="number"
                          class="form-control"
                          .value=${this.contract.totalValue}
                          @input=${(e) => this.handleInputChange('totalValue', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Minimum Commitment</label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                          type="number"
                          class="form-control"
                          .value=${this.contract.minimumCommitment}
                          @input=${(e) => this.handleInputChange('minimumCommitment', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Payment Terms</label>
                      <select 
                        class="form-select"
                        .value=${this.contract.paymentTerms}
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
                    <div class="col-md-4">
                      <label class="form-label">Payment Schedule</label>
                      <select 
                        class="form-select"
                        .value=${this.contract.paymentSchedule}
                        @change=${(e) => this.handleInputChange('paymentSchedule', e.target.value)}
                      >
                        <option value="per_order">Per Order</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Credit Limit</label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                          type="number"
                          class="form-control"
                          .value=${this.contract.creditLimit}
                          @input=${(e) => this.handleInputChange('creditLimit', parseFloat(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pricing & Discounts -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Pricing & Discounts</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Price List</label>
                      <select 
                        class="form-select"
                        .value=${this.contract.priceListId || ''}
                        @change=${(e) => this.handleInputChange('priceListId', e.target.value ? parseInt(e.target.value) : null)}
                      >
                        <option value="">None</option>
                        ${this.priceLists.map(pl => html`
                          <option value="${pl.id}">${pl.name}</option>
                        `)}
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Discount %</label>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.contract.discountPercent}
                        @input=${(e) => this.handleInputChange('discountPercent', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div class="col-12">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          .checked=${this.contract.volumeDiscount}
                          @change=${(e) => this.handleInputChange('volumeDiscount', e.target.checked)}
                          id="volumeDiscount"
                        />
                        <label class="form-check-label" for="volumeDiscount">
                          Volume Discount Enabled
                        </label>
                      </div>
                    </div>
                  </div>

                  ${this.contract.volumeDiscount ? html`
                    <div class="mt-3">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong>Volume Tiers</strong>
                        <button type="button" class="btn btn-sm btn-outline-primary" @click=${this.handleAddVolumeTier}>
                          <i class="bi bi-plus-circle me-1"></i>Add Tier
                        </button>
                      </div>
                      ${this.contract.volumeTiers.length > 0 ? html`
                        <div class="table-responsive">
                          <table class="table table-sm">
                            <thead>
                              <tr>
                                <th>Min Quantity</th>
                                <th>Discount %</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              ${this.contract.volumeTiers.map((tier, index) => html`
                                <tr>
                                  <td>
                                    <input
                                      type="number"
                                      class="form-control form-control-sm"
                                      .value=${tier.minQty}
                                      @input=${(e) => this.handleTierChange(index, 'minQty', parseInt(e.target.value) || 0)}
                                      min="0"
                                      style="width: 120px;"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      class="form-control form-control-sm"
                                      .value=${tier.discount}
                                      @input=${(e) => this.handleTierChange(index, 'discount', parseFloat(e.target.value) || 0)}
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      style="width: 120px;"
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
                      ` : ''}
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Terms & Conditions -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Terms & Conditions</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">General Terms</label>
                    <textarea
                      class="form-control"
                      rows="3"
                      .value=${this.contract.termsAndConditions}
                      @input=${(e) => this.handleInputChange('termsAndConditions', e.target.value)}
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">SLA Terms</label>
                    <textarea
                      class="form-control"
                      rows="2"
                      .value=${this.contract.slaTerms}
                      @input=${(e) => this.handleInputChange('slaTerms', e.target.value)}
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Internal Notes</label>
                    <textarea
                      class="form-control"
                      rows="2"
                      .value=${this.contract.notes}
                      @input=${(e) => this.handleInputChange('notes', e.target.value)}
                    ></textarea>
                  </div>
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
                    .value=${this.contract.status}
                    @change=${(e) => this.handleInputChange('status', e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <!-- Delivery Terms -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Delivery Terms</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Service Level</label>
                    <select 
                      class="form-select"
                      .value=${this.contract.serviceLevel}
                      @change=${(e) => this.handleInputChange('serviceLevel', e.target.value)}
                    >
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Shipping Terms</label>
                    <input
                      type="text"
                      class="form-control"
                      .value=${this.contract.shippingTerms}
                      @input=${(e) => this.handleInputChange('shippingTerms', e.target.value)}
                      placeholder="e.g., FOB, CIF"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Delivery Schedule</label>
                    <input
                      type="text"
                      class="form-control"
                      .value=${this.contract.deliverySchedule}
                      @input=${(e) => this.handleInputChange('deliverySchedule', e.target.value)}
                    />
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      .checked=${this.contract.allowBackorders}
                      @change=${(e) => this.handleInputChange('allowBackorders', e.target.checked)}
                      id="allowBackorders"
                    />
                    <label class="form-check-label" for="allowBackorders">
                      Allow Backorders
                    </label>
                  </div>
                </div>
              </div>

              <!-- Order Limits -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Order Limits</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Minimum Order Qty</label>
                    <input
                      type="number"
                      class="form-control"
                      .value=${this.contract.minOrderQty}
                      @input=${(e) => this.handleInputChange('minOrderQty', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Maximum Order Qty</label>
                    <input
                      type="number"
                      class="form-control"
                      .value=${this.contract.maxOrderQty || ''}
                      @input=${(e) => this.handleInputChange('maxOrderQty', e.target.value ? parseInt(e.target.value) : null)}
                      min="0"
                      placeholder="No limit"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-end gap-2">
                <a href="#/website/b2b/contracts" class="btn btn-outline-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary" ?disabled=${this.saving}>
                  ${this.saving ? html`
                    <span class="spinner-border spinner-border-sm me-2"></span>Saving...
                  ` : html`
                    <i class="bi bi-check-circle me-2"></i>${this.contractId ? 'Update' : 'Create'} Contract
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

customElements.define('contract-form', ContractForm);
