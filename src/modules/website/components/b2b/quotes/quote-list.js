/**
 * Quote List Component - B2B Quotes Management
 */

import { html } from 'lit';
import { BaseComponent } from '../../../../../shared/components/base/BaseComponent.js';

class QuoteList extends BaseComponent {
  static properties = {
    quotes: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    searchTerm: { type: String },
    statusFilter: { type: String },
    typeFilter: { type: String }
  };

  constructor() {
    super();
    this.quotes = [];
    this.loading = false;
    this.error = '';
    this.searchTerm = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this._quoteService = null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadQuotes();
  }

  async loadQuotes() {
    this.loading = true;
    this.error = '';

    try {
      const options = {
        search: this.searchTerm,
        status: this.statusFilter,
        type: this.typeFilter
      };

      if (!this._quoteService) {
        this._quoteService = await this.getService('quoteService');
      }
      this.quotes = await this._quoteService.getQuotes(options);
    } catch (err) {
      this.error = err.message || 'Failed to load quotes';
      console.error('Error loading quotes:', err);
    } finally {
      this.loading = false;
    }
  }

  handleSearch(e) {
    this.searchTerm = e.target.value;
    this.loadQuotes();
  }

  handleStatusFilter(e) {
    this.statusFilter = e.target.value;
    this.loadQuotes();
  }

  handleTypeFilter(e) {
    this.typeFilter = e.target.value;
    this.loadQuotes();
  }

  async handleSend(quote) {
    if (!this.can('quotes','update')) return;
    try {
      if (!this._quoteService) {
        this._quoteService = await this.getService('quoteService');
      }
      await this._quoteService.sendQuote(quote.id);
      await this.loadQuotes();
    } catch (err) {
      alert('Failed to send quote: ' + err.message);
    }
  }

  async handleDelete(quote) {
    if (!this.can('quotes','delete')) return;
    if (!confirm(`Are you sure you want to delete quote ${quote.quoteNumber}?`)) {
      return;
    }

    try {
      if (!this._quoteService) {
        this._quoteService = await this.getService('quoteService');
      }
      await this._quoteService.deleteQuote(quote.id);
      await this.loadQuotes();
    } catch (err) {
      alert('Failed to delete quote: ' + err.message);
    }
  }

  getStatusBadgeClass(status) {
    const classes = {
      draft: 'secondary',
      sent: 'primary',
      viewed: 'info',
      accepted: 'success',
      rejected: 'danger',
      expired: 'warning',
      converted: 'success'
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
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">Quotes & RFQ</h2>
            <p class="text-muted mb-0">Manage customer quotes and requests for quote</p>
          </div>
          <a href="#/website/b2b/quotes/new" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>Create Quote
          </a>
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
                  placeholder="Search by quote number, company..."
                  .value=${this.searchTerm}
                  @input=${this.handleSearch}
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">Status</label>
                <select class="form-select" @change=${this.handleStatusFilter}>
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="viewed">Viewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">Type</label>
                <select class="form-select" @change=${this.handleTypeFilter}>
                  <option value="">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="rfq">RFQ</option>
                  <option value="bulk">Bulk</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click=${() => {
                  this.searchTerm = '';
                  this.statusFilter = '';
                  this.typeFilter = '';
                  this.loadQuotes();
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
            <p class="mt-2 text-muted">Loading quotes...</p>
          </div>
        ` : ''}

        <!-- Quotes Table -->
        ${!this.loading && this.quotes.length > 0 ? html`
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Quote #</th>
                      <th>Company</th>
                      <th>Type</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Valid Until</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.quotes.map(quote => html`
                      <tr>
                        <td>
                          <div>
                            <code class="fw-bold">${quote.quoteNumber}</code>
                            ${quote.title ? html`<div class="small text-muted">${quote.title}</div>` : ''}
                          </div>
                        </td>
                        <td>
                          <div>${quote.companyName}</div>
                          <small class="text-muted">${quote.contactEmail}</small>
                        </td>
                        <td>
                          <span class="badge bg-secondary text-capitalize">${quote.type}</span>
                        </td>
                        <td>${quote.itemCount || quote.items?.length || 0}</td>
                        <td>
                          <strong>${this.formatCurrency(quote.total)}</strong>
                        </td>
                        <td>
                          <span class="${quote.isExpired ? 'text-danger' : ''}">
                            ${this.formatDate(quote.validUntil)}
                          </span>
                        </td>
                        <td>
                          <span class="badge bg-${this.getStatusBadgeClass(quote.status)}">
                            ${quote.status}
                          </span>
                          ${quote.viewCount > 0 ? html`
                            <div class="small text-muted">Viewed ${quote.viewCount}x</div>
                          ` : ''}
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            ${quote.status === 'draft' ? html`
                              <button 
                                class="btn btn-outline-success" 
                                @click=${() => this.handleSend(quote)}
                                title="Send Quote">
                                <i class="bi bi-send"></i>
                              </button>
                            ` : ''}
                            <a href="#/website/b2b/quotes/${quote.id}" 
                               class="btn btn-outline-primary" 
                               title="View Details">
                              <i class="bi bi-eye"></i>
                            </a>
                            <a href="#/website/b2b/quotes/edit/${quote.id}" 
                               class="btn btn-outline-secondary"
                               title="Edit">
                              <i class="bi bi-pencil"></i>
                            </a>
                            <button 
                              class="btn btn-outline-danger"
                              @click=${() => this.handleDelete(quote)}
                              title="Delete">
                              <i class="bi bi-trash"></i>
                            </button>
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
            <small>Showing ${this.quotes.length} quote${this.quotes.length === 1 ? '' : 's'}</small>
          </div>
        ` : ''}

        <!-- Empty State -->
        ${!this.loading && this.quotes.length === 0 ? html`
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-file-earmark-text" style="font-size: 3rem; color: #ccc;"></i>
              <h4 class="mt-3">No Quotes Found</h4>
              <p class="text-muted">
                ${this.searchTerm || this.statusFilter || this.typeFilter
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first quote'}
              </p>
              ${!this.searchTerm && !this.statusFilter && !this.typeFilter ? html`
                <a href="#/website/b2b/quotes/new" class="btn btn-primary mt-2">
                  <i class="bi bi-plus-circle me-2"></i>Create Quote
                </a>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('quote-list', QuoteList);
