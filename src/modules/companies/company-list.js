/**
 * Company List Component - B2B Customer Management
 */

import { html } from 'lit';
import { BaseComponent } from '../../shared/components/base/BaseComponent.js';

class CompanyList extends BaseComponent {
  static properties = {
    companies: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    searchTerm: { type: String },
    statusFilter: { type: String },
    typeFilter: { type: String },
    sortBy: { type: String },
    sortOrder: { type: String }
  };

  constructor() {
    super();
    this.companies = [];
    this.loading = false;
    this.error = '';
    this.searchTerm = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    this._companyService = null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadCompanies();
  }

  async loadCompanies() {
    this.loading = true;
    this.error = '';

    try {
      const options = {
        search: this.searchTerm,
        status: this.statusFilter,
        companyType: this.typeFilter,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder
      };

      if (!this._companyService) {
        this._companyService = await this.getService('companyService');
      }
      this.companies = await this._companyService.getCompanies(options);
    } catch (err) {
      this.error = err.message || 'Failed to load companies';
      console.error('Error loading companies:', err);
    } finally {
      this.loading = false;
    }
  }

  handleSearch(e) {
    this.searchTerm = e.target.value;
    this.loadCompanies();
  }

  handleStatusFilter(e) {
    this.statusFilter = e.target.value;
    this.loadCompanies();
  }

  handleTypeFilter(e) {
    this.typeFilter = e.target.value;
    this.loadCompanies();
  }

  async handleDelete(company) {
    if (!this.can('companies','delete')) return;
    if (!confirm(`Are you sure you want to delete ${company.name}?`)) {
      return;
    }

    try {
      if (!this._companyService) {
        this._companyService = await this.getService('companyService');
      }
      await this._companyService.deleteCompany(company.id);
      await this.loadCompanies();
    } catch (err) {
      alert('Failed to delete company: ' + err.message);
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

  render() {
    return html`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">Companies</h2>
            <p class="text-muted mb-0">Manage your business partners and customer accounts</p>
          </div>
          ${this.ifCan('companies','create', html`
            <a href="/companies/new" class="btn btn-primary">
              <i class="bi bi-plus-circle me-2"></i>Add Company
            </a>
          `)}
        </div>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Search</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search by name, account number, email..."
                  .value=${this.searchTerm}
                  @input=${this.handleSearch}
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">Status</label>
                <select class="form-select" @change=${this.handleStatusFilter}>
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Company Type</label>
                <select class="form-select" @change=${this.handleTypeFilter}>
                  <option value="">All Types</option>
                  <option value="business">Business</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="distributor">Distributor</option>
                  <option value="reseller">Reseller</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click=${() => {
                  this.searchTerm = '';
                  this.statusFilter = '';
                  this.typeFilter = '';
                  this.loadCompanies();
                }}>
                  <i class="bi bi-x-circle me-2"></i>Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        ${this.error ? html`
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>${this.error}
            <button type="button" class="btn-close" @click=${() => this.error = ''}></button>
          </div>
        ` : ''}

        <!-- Loading State -->
        ${this.loading ? html`
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading companies...</p>
          </div>
        ` : ''}

        <!-- Companies Table -->
        ${!this.loading && this.companies.length > 0 ? html`
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Account #</th>
                      <th>Type</th>
                      <th>Contact</th>
                      <th>Credit</th>
                      <th>Payment Terms</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.companies.map(company => html`
                      <tr>
                        <td>
                          <div class="fw-bold">${company.name}</div>
                          <small class="text-muted">${company.industry || 'N/A'}</small>
                        </td>
                        <td>
                          <code class="small">${company.accountNumber}</code>
                        </td>
                        <td>
                          <span class="badge bg-info text-capitalize">
                            ${company.companyType}
                          </span>
                        </td>
                        <td>
                          <div class="small">
                            ${company.primaryContact.name}<br>
                            <a href="mailto:${company.primaryContact.email}">
                              ${company.primaryContact.email}
                            </a>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            <strong>${this.formatCurrency(company.availableCredit)}</strong>
                            <span class="text-muted">/ ${this.formatCurrency(company.creditLimit)}</span>
                            <div class="progress mt-1" style="height: 4px;">
                              <div 
                                class="progress-bar ${company.creditUsed / company.creditLimit > 0.8 ? 'bg-danger' : 'bg-success'}" 
                                style="width: ${(company.creditUsed / company.creditLimit * 100)}%">
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-secondary">${company.paymentTerms}</span>
                        </td>
                        <td>
                          <span class="badge bg-${this.getStatusBadgeClass(company.status)}">
                            ${company.status}
                          </span>
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            ${this.ifCan('companies','read', html`
                              <a href="/companies/${company.id}" 
                                 class="btn btn-outline-primary" 
                                 title="View Details">
                                <i class="bi bi-eye"></i>
                              </a>
                            `)}
                            ${this.ifCan('companies','update', html`
                              <a href="/companies/edit/${company.id}" 
                                 class="btn btn-outline-secondary"
                                 title="Edit">
                                <i class="bi bi-pencil"></i>
                              </a>
                            `)}
                            ${this.ifCan('companies','delete', html`
                              <button 
                                class="btn btn-outline-danger"
                                @click=${() => this.handleDelete(company)}
                                title="Delete">
                                <i class="bi bi-trash"></i>
                              </button>
                            `)}
                          </div>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="mt-3 text-muted">
            <small>Showing ${this.companies.length} compan${this.companies.length === 1 ? 'y' : 'ies'}</small>
          </div>
        ` : ''}

        <!-- Empty State -->
        ${!this.loading && this.companies.length === 0 ? html`
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-building" style="font-size: 3rem; color: #ccc;"></i>
              <h4 class="mt-3">No Companies Found</h4>
              <p class="text-muted">
                ${this.searchTerm || this.statusFilter || this.typeFilter
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first organization'}
              </p>
              ${!this.searchTerm && !this.statusFilter && !this.typeFilter ? html`
                <a href="/companies/new" class="btn btn-primary mt-2">
                  <i class="bi bi-plus-circle me-2"></i>Add Company
                </a>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('company-list', CompanyList);
