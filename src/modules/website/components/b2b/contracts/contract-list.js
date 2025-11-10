/**
 * Contract List Component - B2B Customer Contracts
 */

import { html } from 'lit';
import { BaseComponent } from '../../../../../shared/components/base/BaseComponent.js';

class ContractList extends BaseComponent {
  static properties = {
    contracts: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    searchTerm: { type: String },
    statusFilter: { type: String },
    typeFilter: { type: String }
  };

  constructor() {
    super();
    this.contracts = [];
    this.loading = false;
    this.error = '';
    this.searchTerm = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this._contractService = null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadContracts();
  }

  async loadContracts() {
    this.loading = true;
    this.error = '';

    try {
      const options = {
        search: this.searchTerm,
        status: this.statusFilter,
        type: this.typeFilter
      };

      if (!this._contractService) {
        this._contractService = await this.getService('contractService');
      }
      this.contracts = await this._contractService.getContracts(options);
    } catch (err) {
      this.error = err.message || 'Failed to load contracts';
    } finally {
      this.loading = false;
    }
  }

  handleSearch(e) {
    this.searchTerm = e.target.value;
    this.loadContracts();
  }

  handleStatusFilter(e) {
    this.statusFilter = e.target.value;
    this.loadContracts();
  }

  handleTypeFilter(e) {
    this.typeFilter = e.target.value;
    this.loadContracts();
  }

  async handleDelete(contract) {
    if (!this.can('contracts','delete')) return;
    if (!confirm(`Delete contract "${contract.name}"?`)) return;

    try {
      if (!this._contractService) {
        this._contractService = await this.getService('contractService');
      }
      await this._contractService.deleteContract(contract.id);
      await this.loadContracts();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  }

  getStatusBadgeClass(status) {
    const classes = {
      draft: 'secondary',
      pending: 'warning',
      active: 'success',
      expired: 'danger',
      terminated: 'dark',
      renewed: 'info'
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  render() {
    return html`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">Contracts</h2>
            <p class="text-muted mb-0">Manage customer contracts & agreements</p>
          </div>
          ${this.ifCan('contracts','create', html`
            <button class="btn btn-primary" @click=${() => window.location.pathname = '/website/b2b/contracts/new'}>
              <i class="bi bi-plus-circle me-2"></i>Create Contract
            </button>
          `)}
        </div>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-5">
                <label class="form-label">Search</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search by name, number, or company..."
                  .value=${this.searchTerm}
                  @input=${this.handleSearch}
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">Status</label>
                <select class="form-select" @change=${this.handleStatusFilter}>
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                  <option value="renewed">Renewed</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">Type</label>
                <select class="form-select" @change=${this.handleTypeFilter}>
                  <option value="">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="master">Master</option>
                  <option value="blanket">Blanket</option>
                  <option value="framework">Framework</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click=${() => {
                  this.searchTerm = '';
                  this.statusFilter = '';
                  this.typeFilter = '';
                  this.loadContracts();
                }}>
                  <i class="bi bi-x-circle me-2"></i>Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        ${this.error ? html`
          <div class="alert alert-danger alert-dismissible fade show">
            <i class="bi bi-exclamation-triangle me-2"></i>${this.error}
            <button type="button" class="btn-close" @click=${() => this.error = ''}></button>
          </div>
        ` : ''}

        ${this.loading ? html`
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading contracts...</p>
          </div>
        ` : ''}

        ${!this.loading && this.contracts.length > 0 ? html`
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Contract</th>
                      <th>Company</th>
                      <th>Type</th>
                      <th>Period</th>
                      <th>Value</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.contracts.map(contract => html`
                      <tr>
                        <td>
                          <div class="fw-bold">${contract.name}</div>
                          <code class="small">${contract.contractNumber}</code>
                        </td>
                        <td>${contract.companyName}</td>
                        <td>
                          <span class="badge bg-secondary text-capitalize">${contract.type}</span>
                        </td>
                        <td>
                          <div class="small">
                            ${this.formatDate(contract.startDate)}<br>
                            <span class="${contract.isExpiringSoon ? 'text-danger fw-bold' : ''}">
                              ${this.formatDate(contract.endDate)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            <strong>${this.formatCurrency(contract.totalValue)}</strong><br>
                            <span class="text-muted">Min: ${this.formatCurrency(contract.minimumCommitment)}</span>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            ${this.formatCurrency(contract.totalSpent)}
                            <div class="progress mt-1" style="height: 4px;">
                              <div 
                                class="progress-bar ${contract.commitmentProgress >= 100 ? 'bg-success' : contract.commitmentProgress >= 50 ? 'bg-warning' : 'bg-danger'}" 
                                style="width: ${Math.min(100, contract.commitmentProgress)}%">
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-${this.getStatusBadgeClass(contract.status)}">
                            ${contract.status}
                          </span>
                          ${contract.isExpiringSoon && contract.status === 'active' ? html`
                            <div><small class="text-danger">⚠️ Expiring soon</small></div>
                          ` : ''}
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            ${this.ifCan('contracts','update', html`
                              <button class="btn btn-outline-primary"
                                 @click=${() => window.location.pathname = `/website/b2b/contracts/edit/${contract.id}`}
                                 title="Edit Contract">
                                <i class="bi bi-pencil"></i>
                              </button>
                            `)}
                            ${this.ifCan('contracts','delete', html`
                              <button class="btn btn-outline-danger" 
                                      @click=${() => this.handleDelete(contract)}
                                      title="Delete Contract">
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
        ` : ''}

        ${!this.loading && this.contracts.length === 0 ? html`
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-file-earmark-ruled" style="font-size: 3rem; color: #ccc;"></i>
              <h4 class="mt-3">No Contracts Found</h4>
              <p class="text-muted">
                ${this.searchTerm || this.statusFilter || this.typeFilter
                  ? 'Try adjusting your filters'
                  : 'Create your first customer contract'}
              </p>
              ${!this.searchTerm && !this.statusFilter && !this.typeFilter ? html`
                <button class="btn btn-primary mt-2" @click=${() => window.location.pathname = '/website/b2b/contracts/new'}>
                  <i class="bi bi-plus-circle me-2"></i>Create Contract
                </button>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('contract-list', ContractList);
