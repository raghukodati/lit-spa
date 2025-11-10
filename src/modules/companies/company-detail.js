/**
 * Company Detail Component - View B2B Company Details
 */

import { html } from 'lit';
import { BaseComponent } from '../../shared/components/base/BaseComponent.js';

class CompanyDetail extends BaseComponent {
  static properties = {
    companyId: { type: String },
    company: { type: Object },
    stats: { type: Object },
    loading: { type: Boolean },
    error: { type: String }
  };

  constructor() {
    super();
    this.companyId = null;
    this.company = null;
    this.stats = null;
    this.loading = false;
    this.error = '';
    this._companyService = null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    const pathname = window.location.pathname;
    const match = pathname.match(/\/website\/b2b\/companies\/(\d+)/);
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
      
      const [company, stats] = await Promise.all([
        this._companyService.getCompanyById(this.companyId),
        this._companyService.getCompanyStats(this.companyId)
      ]);

      if (company) {
        this.company = company;
        this.stats = stats;
      } else {
        this.error = 'Company not found';
      }
    } catch (err) {
      this.error = err.message || 'Failed to load company';
    } finally {
      this.loading = false;
    }
  }

  getStatusBadgeClass(status) {
    const classes = {
      active: 'success',
      pending: 'warning',
      suspended: 'danger',
      inactive: 'secondary'
    };
    return classes[status] || 'secondary';
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

    if (this.error || !this.company) {
      return html`
        <div class="container-fluid mt-4">
          <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>${this.error || 'Company not found'}
          </div>
          <a href="#/website/b2b/companies" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Back to List
          </a>
        </div>
      `;
    }

    return html`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-start mb-4">
          <div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <h2 class="mb-0">${this.company.name}</h2>
              <span class="badge bg-${this.getStatusBadgeClass(this.company.status)}">
                ${this.company.status}
              </span>
              <span class="badge bg-info text-capitalize">${this.company.companyType}</span>
            </div>
            <p class="text-muted mb-0">
              <code>${this.company.accountNumber}</code>
              ${this.company.industry ? html` | ${this.company.industry}` : ''}
            </p>
          </div>
          <div class="btn-group">
            ${this.ifCan('companies','update', html`
              <a href="#/website/b2b/companies/edit/${this.company.id}" class="btn btn-primary">
                <i class="bi bi-pencil me-2"></i>Edit
              </a>
            `)}
            <a href="#/website/b2b/companies" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>Back
            </a>
          </div>
        </div>

        <div class="row">
          <!-- Left Column -->
          <div class="col-lg-8">
            <!-- Statistics Cards -->
            ${this.stats ? html`
              <div class="row g-3 mb-4">
                <div class="col-md-3">
                  <div class="card">
                    <div class="card-body">
                      <div class="text-muted small">Total Orders</div>
                      <h4 class="mb-0">${this.stats.totalOrders}</h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card">
                    <div class="card-body">
                      <div class="text-muted small">Total Spent</div>
                      <h4 class="mb-0">${this.formatCurrency(this.stats.totalSpent)}</h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card">
                    <div class="card-body">
                      <div class="text-muted small">Avg Order Value</div>
                      <h4 class="mb-0">${this.formatCurrency(this.stats.averageOrderValue)}</h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card">
                    <div class="card-body">
                      <div class="text-muted small">Payment Score</div>
                      <h4 class="mb-0 ${this.stats.paymentScore >= 80 ? 'text-success' : this.stats.paymentScore >= 60 ? 'text-warning' : 'text-danger'}">
                        ${this.stats.paymentScore}/100
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Credit Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Credit Information</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Credit Limit</div>
                    <h5 class="mb-0">${this.formatCurrency(this.company.creditLimit)}</h5>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Credit Used</div>
                    <h5 class="mb-0">${this.formatCurrency(this.company.creditUsed)}</h5>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Available Credit</div>
                    <h5 class="mb-0 text-success">${this.formatCurrency(this.company.availableCredit)}</h5>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Credit Utilization</div>
                    <div class="d-flex align-items-center gap-2">
                      <div class="progress flex-grow-1" style="height: 20px;">
                        <div 
                          class="progress-bar ${this.company.creditUsed / this.company.creditLimit > 0.8 ? 'bg-danger' : this.company.creditUsed / this.company.creditLimit > 0.5 ? 'bg-warning' : 'bg-success'}" 
                          style="width: ${(this.company.creditUsed / this.company.creditLimit * 100)}%">
                          ${Math.round(this.company.creditUsed / this.company.creditLimit * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Contact Information</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Contact Name</div>
                    <div>${this.company.primaryContact.name || 'N/A'}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Title</div>
                    <div>${this.company.primaryContact.title || 'N/A'}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Email</div>
                    <a href="mailto:${this.company.primaryContact.email}">${this.company.primaryContact.email}</a>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Phone</div>
                    <div>${this.company.primaryContact.phone || 'N/A'}</div>
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
                ${this.company.billingAddress.street1}<br>
                ${this.company.billingAddress.street2 ? html`${this.company.billingAddress.street2}<br>` : ''}
                ${this.company.billingAddress.city}, ${this.company.billingAddress.state} ${this.company.billingAddress.postalCode}<br>
                ${this.company.billingAddress.country}
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-lg-4">
            <!-- Account Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Account Information</h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <div class="text-muted small mb-1">Legal Name</div>
                  <div>${this.company.legalName || 'N/A'}</div>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Tax ID</div>
                  <div>${this.company.taxId || 'N/A'}</div>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Website</div>
                  <div>
                    ${this.company.website ? html`
                      <a href="${this.company.website}" target="_blank">${this.company.website}</a>
                    ` : 'N/A'}
                  </div>
                </div>
                ${this.company.accountManagerName ? html`
                  <div class="mb-3">
                    <div class="text-muted small mb-1">Account Manager</div>
                    <div>${this.company.accountManagerName}</div>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Payment Terms -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Payment Terms</h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <div class="text-muted small mb-1">Terms</div>
                  <div><strong>${this.company.paymentTerms}</strong></div>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Discount</div>
                  <div>${this.company.discountPercent}%</div>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Tax Status</div>
                  <div>
                    ${this.company.taxExempt ? html`
                      <span class="badge bg-info">Tax Exempt</span>
                      ${this.company.taxExemptId ? html`<br><small>${this.company.taxExemptId}</small>` : ''}
                    ` : html`
                      <span class="badge bg-secondary">Taxable</span>
                    `}
                  </div>
                </div>
              </div>
            </div>

            <!-- Purchasing Settings -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Purchasing Settings</h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <div class="text-muted small mb-1">Approval Required</div>
                  <div>
                    ${this.company.requiresApproval ? html`
                      <span class="badge bg-warning">Yes</span>
                      ${this.company.approvalLimit > 0 ? html`
                        <div class="small mt-1">Over ${this.formatCurrency(this.company.approvalLimit)}</div>
                      ` : ''}
                    ` : html`
                      <span class="badge bg-secondary">No</span>
                    `}
                  </div>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Minimum Order</div>
                  <div>${this.formatCurrency(this.company.minimumOrderAmount)}</div>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Backorders</div>
                  <div>
                    ${this.company.allowBackorders ? html`
                      <span class="badge bg-success">Allowed</span>
                    ` : html`
                      <span class="badge bg-danger">Not Allowed</span>
                    `}
                  </div>
                </div>
              </div>
            </div>

            <!-- Contract Information -->
            ${this.company.contractStartDate ? html`
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Contract</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <div class="text-muted small mb-1">Start Date</div>
                    <div>${this.formatDate(this.company.contractStartDate)}</div>
                  </div>
                  <div class="mb-3">
                    <div class="text-muted small mb-1">End Date</div>
                    <div>${this.formatDate(this.company.contractEndDate)}</div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Quick Actions -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Quick Actions</h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button class="btn btn-primary btn-sm" @click=${() => window.location.pathname = `/website/b2b/quotes/new?companyId=${this.company.id}`}>
                    <i class="bi bi-file-earmark-text me-2"></i>Create Quote
                  </button>
                  <button class="btn btn-outline-primary btn-sm" @click=${() => window.location.pathname = `/website/b2b/contracts/new?companyId=${this.company.id}`}>
                    <i class="bi bi-file-earmark-ruled me-2"></i>Create Contract
                  </button>
                  <button class="btn btn-outline-secondary btn-sm" @click=${() => window.location.pathname = '/website/b2b/pricelists/new'}>
                    <i class="bi bi-cash-stack me-2"></i>Create Price List
                  </button>
                  <button class="btn btn-outline-secondary btn-sm" @click=${() => window.location.pathname = `/website/b2b/quotes?companyId=${this.company.id}`}>
                    <i class="bi bi-list-ul me-2"></i>View Quotes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('company-detail', CompanyDetail);
