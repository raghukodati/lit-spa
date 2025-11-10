/**
 * Company Form Component - Create/Edit B2B Companies
 */

import { html } from 'lit';
import { BaseComponent } from '../../shared/components/base/BaseComponent.js';
import { Company } from './models/company.model.js';

class CompanyForm extends BaseComponent {
  static properties = {
    companyId: { type: String },
    company: { type: Object },
    loading: { type: Boolean },
    saving: { type: Boolean },
    error: { type: String },
    validationErrors: { type: Array }
  };

  constructor() {
    super();
    this.companyId = null;
    this.company = {
      name: '',
      legalName: '',
      taxId: '',
      companyType: 'business',
      industry: '',
      website: '',
      status: 'active',
      primaryContact: {
        name: '',
        email: '',
        phone: '',
        title: ''
      },
      billingAddress: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'USA'
      },
      creditLimit: 0,
      paymentTerms: 'Net 30',
      discountPercent: 0,
      taxExempt: false,
      taxExemptId: '',
      requiresApproval: false,
      approvalLimit: 0,
      allowBackorders: true,
      minimumOrderAmount: 0
    };
    this.loading = false;
    this.saving = false;
    this.error = '';
    this.validationErrors = [];
    this._companyService = null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    const pathname = window.location.pathname;
    let match = pathname.match(/\/website\/b2b\/companies\/edit\/(\d+)/);
    if (!match) {
      match = pathname.match(/\/organizations\/edit\/(\d+)/);
    }
    if (match) {
      this.companyId = match[1];
      this.loadCompany();
    }
  }

  async loadCompany() {
    if (!this.companyId) return;

    this.loading = true;
    this.error = '';

    try {
      if (!this._companyService) {
        this._companyService = await this.getService('companyService');
      }
      const company = await this._companyService.getCompanyById(this.companyId);
      if (company) {
        this.company = company;
      } else {
        this.error = 'Company not found';
      }
    } catch (err) {
      this.error = err.message || 'Failed to load company';
    } finally {
      this.loading = false;
    }
  }

  handleInputChange(path, value) {
    const pathParts = path.split('.');
    let obj = this.company;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      obj = obj[pathParts[i]];
    }
    
    obj[pathParts[pathParts.length - 1]] = value;
    this.requestUpdate();
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate
    const companyModel = new Company(this.company);
    const validation = companyModel.validate();
    
    if (!validation.isValid) {
      this.validationErrors = validation.errors;
      return;
    }
    
    this.validationErrors = [];
    this.saving = true;
    this.error = '';

    try {
      if (!this._companyService) {
        this._companyService = await this.getService('companyService');
      }
      
      const action = this.companyId ? 'update' : 'create';
      if (!this.can('companies', action)) {
        alert(`You do not have permission to ${action} companies`);
        this.saving = false;
        return;
      }
      
      if (this.companyId) {
        await this._companyService.updateCompany(this.companyId, this.company);
      } else {
        await this._companyService.createCompany(this.company);
      }
      
      // Redirect to unified Organizations list
      window.location.pathname = '/organizations';
    } catch (err) {
      this.error = err.message || 'Failed to save company';
    } finally {
      this.saving = false;
    }
  }

  handleCancel() {
    window.location.pathname = '/organizations';
  }

  render() {
    if (this.loading) {
      return html`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading company...</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">${this.companyId ? 'Edit Organization' : 'Add Organization'}</h2>
            <p class="text-muted mb-0">Manage organization account details</p>
          </div>
          <div class="d-flex gap-2">
            ${this.companyId ? html`
              <a class="btn btn-outline-primary" href="/organizations/${this.companyId}/users">
                <i class="bi bi-people me-2"></i>Users
              </a>
            ` : ''}
            <button class="btn btn-outline-secondary" @click=${this.handleCancel}>
              <i class="bi bi-arrow-left me-2"></i>Back to List
            </button>
          </div>
        </div>

        <!-- Error Messages -->
        ${this.error ? html`
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>${this.error}
            <button type="button" class="btn-close" @click=${() => this.error = ''}></button>
          </div>
        ` : ''}

        ${this.validationErrors.length > 0 ? html`
          <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Validation Errors:</strong>
            <ul class="mb-0 mt-2">
              ${this.validationErrors.map(err => html`<li>${err}</li>`)}
            </ul>
            <button type="button" class="btn-close" @click=${() => this.validationErrors = []}></button>
          </div>
        ` : ''}

        <form @submit=${this.handleSubmit}>
          <div class="row">
            <!-- Left Column -->
            <div class="col-lg-8">
              <!-- Basic Information -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Basic Information</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Company Name *</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.name}
                        @input=${(e) => this.handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Legal Name</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.legalName}
                        @input=${(e) => this.handleInputChange('legalName', e.target.value)}
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Tax ID</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.taxId}
                        @input=${(e) => this.handleInputChange('taxId', e.target.value)}
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Company Type</label>
                      <select 
                        class="form-select"
                        .value=${this.company.companyType}
                        @change=${(e) => this.handleInputChange('companyType', e.target.value)}
                      >
                        <option value="business">Business</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="distributor">Distributor</option>
                        <option value="reseller">Reseller</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Industry</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.industry}
                        @input=${(e) => this.handleInputChange('industry', e.target.value)}
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Website</label>
                      <input
                        type="url"
                        class="form-control"
                        .value=${this.company.website}
                        @input=${(e) => this.handleInputChange('website', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Primary Contact -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Primary Contact</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Contact Name</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.primaryContact.name}
                        @input=${(e) => this.handleInputChange('primaryContact.name', e.target.value)}
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Email *</label>
                      <input
                        type="email"
                        class="form-control"
                        .value=${this.company.primaryContact.email}
                        @input=${(e) => this.handleInputChange('primaryContact.email', e.target.value)}
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Phone</label>
                      <input
                        type="tel"
                        class="form-control"
                        .value=${this.company.primaryContact.phone}
                        @input=${(e) => this.handleInputChange('primaryContact.phone', e.target.value)}
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Title</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.primaryContact.title}
                        @input=${(e) => this.handleInputChange('primaryContact.title', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Billing Address -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Billing Address</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-12">
                      <label class="form-label">Street Address</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.billingAddress.street1}
                        @input=${(e) => this.handleInputChange('billingAddress.street1', e.target.value)}
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Address Line 2</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.billingAddress.street2}
                        @input=${(e) => this.handleInputChange('billingAddress.street2', e.target.value)}
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">City</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.billingAddress.city}
                        @input=${(e) => this.handleInputChange('billingAddress.city', e.target.value)}
                      />
                    </div>
                    <div class="col-md-3">
                      <label class="form-label">State</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.billingAddress.state}
                        @input=${(e) => this.handleInputChange('billingAddress.state', e.target.value)}
                      />
                    </div>
                    <div class="col-md-3">
                      <label class="form-label">Postal Code</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.billingAddress.postalCode}
                        @input=${(e) => this.handleInputChange('billingAddress.postalCode', e.target.value)}
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Country</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.billingAddress.country}
                        @input=${(e) => this.handleInputChange('billingAddress.country', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="col-lg-4">
              <!-- Status -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Status</h5>
                </div>
                <div class="card-body">
                  <select 
                    class="form-select"
                    .value=${this.company.status}
                    @change=${(e) => this.handleInputChange('status', e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <!-- Financial Terms -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Financial Terms</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Credit Limit</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.company.creditLimit}
                        @input=${(e) => this.handleInputChange('creditLimit', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Payment Terms</label>
                    <select 
                      class="form-select"
                      .value=${this.company.paymentTerms}
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
                      .value=${this.company.discountPercent}
                      @input=${(e) => this.handleInputChange('discountPercent', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              <!-- Customer Tier & Settings -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Customer Settings</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Tier</label>
                    <select 
                      class="form-select"
                      .value=${this.company.tier}
                      @change=${(e) => this.handleInputChange('tier', e.target.value)}
                    >
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div class="form-check form-switch mb-2">
                    <input class="form-check-input" type="checkbox" id="allowSelfRegistration" 
                      .checked=${this.company.settings?.allowSelfRegistration}
                      @change=${(e) => this.handleInputChange('settings.allowSelfRegistration', e.target.checked)} />
                    <label class="form-check-label" for="allowSelfRegistration">Allow Self Registration</label>
                  </div>
                  <div class="form-check form-switch mb-2">
                    <input class="form-check-input" type="checkbox" id="requireMFA" 
                      .checked=${this.company.settings?.requireMFA}
                      @change=${(e) => this.handleInputChange('settings.requireMFA', e.target.checked)} />
                    <label class="form-check-label" for="requireMFA">Require MFA</label>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Session Timeout (seconds)</label>
                    <input type="number" class="form-control" min="300" step="60"
                      .value=${this.company.settings?.sessionTimeout}
                      @input=${(e) => this.handleInputChange('settings.sessionTimeout', parseInt(e.target.value, 10) || 0)} />
                  </div>
                </div>
              </div>

              <!-- Tax Settings -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Tax Settings</h5>
                </div>
                <div class="card-body">
                  <div class="form-check mb-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      .checked=${this.company.taxExempt}
                      @change=${(e) => this.handleInputChange('taxExempt', e.target.checked)}
                      id="taxExempt"
                    />
                    <label class="form-check-label" for="taxExempt">
                      Tax Exempt
                    </label>
                  </div>
                  ${this.company.taxExempt ? html`
                    <div class="mb-3">
                      <label class="form-label">Tax Exempt ID</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.company.taxExemptId}
                        @input=${(e) => this.handleInputChange('taxExemptId', e.target.value)}
                      />
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Purchasing Settings -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Purchasing Settings</h5>
                </div>
                <div class="card-body">
                  <div class="form-check mb-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      .checked=${this.company.requiresApproval}
                      @change=${(e) => this.handleInputChange('requiresApproval', e.target.checked)}
                      id="requiresApproval"
                    />
                    <label class="form-check-label" for="requiresApproval">
                      Requires Approval
                    </label>
                  </div>
                  ${this.company.requiresApproval ? html`
                    <div class="mb-3">
                      <label class="form-label">Approval Limit</label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                          type="number"
                          class="form-control"
                          .value=${this.company.approvalLimit}
                          @input=${(e) => this.handleInputChange('approvalLimit', parseFloat(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                    </div>
                  ` : ''}
                  <div class="mb-3">
                    <label class="form-label">Minimum Order</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.company.minimumOrderAmount}
                        @input=${(e) => this.handleInputChange('minimumOrderAmount', parseFloat(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      .checked=${this.company.allowBackorders}
                      @change=${(e) => this.handleInputChange('allowBackorders', e.target.checked)}
                      id="allowBackorders"
                    />
                    <label class="form-check-label" for="allowBackorders">
                      Allow Backorders
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  @click=${this.handleCancel}
                  ?disabled=${this.saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  ?disabled=${this.saving}
                >
                  ${this.saving ? html`
                    <span class="spinner-border spinner-border-sm me-2"></span>Saving...
                  ` : html`
                    <i class="bi bi-check-circle me-2"></i>${this.companyId ? 'Update' : 'Create'} Company
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

customElements.define('company-form', CompanyForm);
