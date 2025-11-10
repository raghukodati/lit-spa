/**
 * Price List Component - B2B Custom Pricing Management
 */

import { html } from 'lit';
import { BaseComponent } from '../../../../../shared/components/base/BaseComponent.js';

class PriceListList extends BaseComponent {
  static properties = {
    priceLists: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    searchTerm: { type: String },
    statusFilter: { type: String },
    typeFilter: { type: String }
  };

  constructor() {
    super();
    this.priceLists = [];
    this.loading = false;
    this.error = '';
    this.searchTerm = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this._pricelistService = null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadPriceLists();
  }

  async loadPriceLists() {
    this.loading = true;
    this.error = '';

    try {
      const options = {
        search: this.searchTerm,
        status: this.statusFilter,
        type: this.typeFilter
      };

      if (!this._pricelistService) {
        this._pricelistService = await this.getService('pricelistService');
      }
      this.priceLists = await this._pricelistService.getPriceLists(options);
    } catch (err) {
      this.error = err.message || 'Failed to load price lists';
    } finally {
      this.loading = false;
    }
  }

  handleSearch(e) {
    this.searchTerm = e.target.value;
    this.loadPriceLists();
  }

  handleStatusFilter(e) {
    this.statusFilter = e.target.value;
    this.loadPriceLists();
  }

  handleTypeFilter(e) {
    this.typeFilter = e.target.value;
    this.loadPriceLists();
  }

  async handleDelete(priceList) {
    if (!this.can('pricelists','delete')) return;
    if (!confirm(`Delete price list "${priceList.name}"?`)) return;

    try {
      if (!this._pricelistService) {
        this._pricelistService = await this.getService('pricelistService');
      }
      await this._pricelistService.deletePriceList(priceList.id);
      await this.loadPriceLists();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
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
            <h2 class="mb-1">Price Lists</h2>
            <p class="text-muted mb-0">Manage custom pricing & volume discounts</p>
          </div>
          ${this.ifCan('pricelists','create', html`
            <button class="btn btn-primary" @click=${() => window.location.pathname = '/website/b2b/pricelists/new'}>
              <i class="bi bi-plus-circle me-2"></i>Create Price List
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
                  placeholder="Search by name or code..."
                  .value=${this.searchTerm}
                  @input=${this.handleSearch}
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">Status</label>
                <select class="form-select" @change=${this.handleStatusFilter}>
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">Type</label>
                <select class="form-select" @change=${this.handleTypeFilter}>
                  <option value="">All Types</option>
                  <option value="custom">Custom</option>
                  <option value="volume">Volume</option>
                  <option value="promotional">Promotional</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click=${() => {
                  this.searchTerm = '';
                  this.statusFilter = '';
                  this.typeFilter = '';
                  this.loadPriceLists();
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
            <p class="mt-2 text-muted">Loading price lists...</p>
          </div>
        ` : ''}

        ${!this.loading && this.priceLists.length > 0 ? html`
          <div class="row">
            ${this.priceLists.map(priceList => html`
              <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 class="mb-1">${priceList.name}</h5>
                        <code class="small">${priceList.code}</code>
                      </div>
                      <span class="badge bg-${priceList.status === 'active' ? 'success' : 'secondary'}">
                        ${priceList.status}
                      </span>
                    </div>

                    ${priceList.description ? html`
                      <p class="text-muted small mb-3">${priceList.description}</p>
                    ` : ''}

                    <div class="mb-3">
                      <div class="d-flex justify-content-between small mb-1">
                        <span class="text-muted">Type:</span>
                        <span class="badge bg-info text-capitalize">${priceList.type}</span>
                      </div>
                      <div class="d-flex justify-content-between small mb-1">
                        <span class="text-muted">Modifier:</span>
                        <strong>${priceList.priceModifier} (${priceList.modifierValue}${priceList.priceModifier === 'percentage' ? '%' : ''})</strong>
                      </div>
                      <div class="d-flex justify-content-between small mb-1">
                        <span class="text-muted">Currency:</span>
                        <strong>${priceList.currency}</strong>
                      </div>
                      ${priceList.volumeTiers && priceList.volumeTiers.length > 0 ? html`
                        <div class="d-flex justify-content-between small mb-1">
                          <span class="text-muted">Volume Tiers:</span>
                          <strong>${priceList.volumeTiers.length}</strong>
                        </div>
                      ` : ''}
                      ${priceList.items && priceList.items.length > 0 ? html`
                        <div class="d-flex justify-content-between small mb-1">
                          <span class="text-muted">Products:</span>
                          <strong>${priceList.items.length}</strong>
                        </div>
                      ` : ''}
                      ${priceList.assignedCompanies && priceList.assignedCompanies.length > 0 ? html`
                        <div class="d-flex justify-content-between small mb-1">
                          <span class="text-muted">Companies:</span>
                          <strong>${priceList.assignedCompanies.length}</strong>
                        </div>
                      ` : ''}
                    </div>

                    ${priceList.validFrom || priceList.validTo ? html`
                      <div class="mb-3">
                        <div class="text-muted small mb-1">Valid Period</div>
                        <small>${this.formatDate(priceList.validFrom)} - ${this.formatDate(priceList.validTo)}</small>
                      </div>
                    ` : ''}

                    <div class="btn-group w-100">
                      ${this.ifCan('pricelists','update', html`
                        <button class="btn btn-sm btn-outline-primary" @click=${() => window.location.pathname = `/website/b2b/pricelists/edit/${priceList.id}`}>
                          <i class="bi bi-pencil me-1"></i>Edit
                        </button>
                      `)}
                      ${this.ifCan('pricelists','delete', html`
                        <button class="btn btn-sm btn-outline-danger" @click=${() => this.handleDelete(priceList)}>
                          <i class="bi bi-trash me-1"></i>Delete
                        </button>
                      `)}
                    </div>
                  </div>
                </div>
              </div>
            `)}
          </div>
        ` : ''}

        ${!this.loading && this.priceLists.length === 0 ? html`
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-cash-stack" style="font-size: 3rem; color: #ccc;"></i>
              <h4 class="mt-3">No Price Lists Found</h4>
              <p class="text-muted">
                ${this.searchTerm || this.statusFilter || this.typeFilter
                  ? 'Try adjusting your filters'
                  : 'Create custom pricing for your B2B customers'}
              </p>
              ${!this.searchTerm && !this.statusFilter && !this.typeFilter ? html`
                <button class="btn btn-primary mt-2" @click=${() => window.location.pathname = '/website/b2b/pricelists/new'}>
                  <i class="bi bi-plus-circle me-2"></i>Create Price List
                </button>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('pricelist-list', PriceListList);
