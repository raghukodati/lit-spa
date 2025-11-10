/**
 * Purchase Order List Component - B2B PO Management
 */

import { html } from 'lit';
import { BaseComponent } from '../../../../../shared/components/base/BaseComponent.js';

class POList extends BaseComponent {
  static properties = {
    purchaseOrders: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    searchTerm: { type: String },
    statusFilter: { type: String },
    approvalFilter: { type: String },
    processing: { type: Boolean }
  };

  constructor() {
    super();
    this.purchaseOrders = [];
    this.loading = false;
    this.error = '';
    this.searchTerm = '';
    this.statusFilter = '';
    this.approvalFilter = '';
    this.processing = false;
    this._poService = null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadPurchaseOrders();
  }

  async loadPurchaseOrders() {
    this.loading = true;
    this.error = '';

    try {
      const options = {
        search: this.searchTerm,
        status: this.statusFilter,
        approvalStatus: this.approvalFilter
      };

      if (!this._poService) {
        this._poService = await this.getService('purchaseOrderService');
      }
      this.purchaseOrders = await this._poService.getPurchaseOrders(options);
    } catch (err) {
      this.error = err.message || 'Failed to load purchase orders';
    } finally {
      this.loading = false;
    }
  }

  handleSearch(e) {
    this.searchTerm = e.target.value;
    this.loadPurchaseOrders();
  }

  handleStatusFilter(e) {
    this.statusFilter = e.target.value;
    this.loadPurchaseOrders();
  }

  handleApprovalFilter(e) {
    this.approvalFilter = e.target.value;
    this.loadPurchaseOrders();
  }

  async handleApprove(po) {
    if (!this.can('purchase_orders','approve')) return;
    if (!confirm(`Approve purchase order ${po.poNumber}?`)) return;

    this.processing = true;
    try {
      if (!this._poService) {
        this._poService = await this.getService('purchaseOrderService');
      }
      // Mock user ID and name for now
      await this._poService.approvePurchaseOrder(po.id, 1, 'Current User');
      await this.loadPurchaseOrders();
    } catch (err) {
      alert('Failed to approve: ' + err.message);
    } finally {
      this.processing = false;
    }
  }

  async handleReject(po) {
    if (!this.can('purchase_orders','reject')) return;
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    this.processing = true;
    try {
      if (!this._poService) {
        this._poService = await this.getService('purchaseOrderService');
      }
      await this._poService.rejectPurchaseOrder(po.id, 1, reason);
      await this.loadPurchaseOrders();
    } catch (err) {
      alert('Failed to reject: ' + err.message);
    } finally {
      this.processing = false;
    }
  }

  getStatusBadgeClass(status) {
    const classes = {
      draft: 'secondary',
      submitted: 'info',
      approved: 'success',
      processing: 'primary',
      shipped: 'warning',
      delivered: 'success',
      cancelled: 'danger'
    };
    return classes[status] || 'secondary';
  }

  getApprovalBadgeClass(status) {
    const classes = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger'
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
            <h2 class="mb-1">Purchase Orders</h2>
            <p class="text-muted mb-0">Manage B2B purchase orders & approvals</p>
          </div>
          ${this.ifCan('purchase_orders','create', html`
            <a href="#/website/b2b/purchase-orders/new" class="btn btn-primary">
              <i class="bi bi-plus-circle me-2"></i>Create PO
            </a>
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
                  placeholder="Search by PO number, company..."
                  .value=${this.searchTerm}
                  @input=${this.handleSearch}
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">Status</label>
                <select class="form-select" @change=${this.handleStatusFilter}>
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">Approval</label>
                <select class="form-select" @change=${this.handleApprovalFilter}>
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click=${() => {
                  this.searchTerm = '';
                  this.statusFilter = '';
                  this.approvalFilter = '';
                  this.loadPurchaseOrders();
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
            <p class="mt-2 text-muted">Loading purchase orders...</p>
          </div>
        ` : ''}

        ${!this.loading && this.purchaseOrders.length > 0 ? html`
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>PO Number</th>
                      <th>Company</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Approval</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.purchaseOrders.map(po => html`
                      <tr>
                        <td>
                          <div class="fw-bold">${po.poNumber}</div>
                          <small class="text-muted">${po.customerPONumber}</small>
                        </td>
                        <td>${po.companyName}</td>
                        <td>${po.itemCount || po.items?.length || 0}</td>
                        <td><strong>${this.formatCurrency(po.total)}</strong></td>
                        <td>
                          <div class="small">
                            <span class="badge bg-${
                              po.paymentStatus === 'paid' ? 'success' :
                              po.paymentStatus === 'partial' ? 'warning' :
                              'secondary'
                            }">${po.paymentStatus}</span>
                            <div class="text-muted">${po.paymentTerms}</div>
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-${this.getStatusBadgeClass(po.status)}">
                            ${po.status}
                          </span>
                        </td>
                        <td>
                          ${po.requiresApproval ? html`
                            <span class="badge bg-${this.getApprovalBadgeClass(po.approvalStatus)}">
                              ${po.approvalStatus}
                            </span>
                          ` : html`
                            <span class="text-muted small">N/A</span>
                          `}
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            ${po.approvalStatus === 'pending' && po.requiresApproval ? html`
                              ${this.ifCan('purchase_orders','approve', html`
                                <button 
                                  class="btn btn-outline-success" 
                                  @click=${() => this.handleApprove(po)}
                                  ?disabled=${this.processing}
                                  title="Approve">
                                  <i class="bi bi-check-circle"></i>
                                </button>
                              `)}
                              ${this.ifCan('purchase_orders','reject', html`
                                <button 
                                  class="btn btn-outline-danger" 
                                  @click=${() => this.handleReject(po)}
                                  ?disabled=${this.processing}
                                  title="Reject">
                                  <i class="bi bi-x-circle"></i>
                                </button>
                              `)}
                            ` : ''}
                            ${this.ifCan('purchase_orders','read', html`
                              <a href="#/website/b2b/purchase-orders/${po.id}" 
                                 class="btn btn-outline-primary"
                                 title="View Details">
                                <i class="bi bi-eye"></i>
                              </a>
                            `)}
                            ${this.ifCan('purchase_orders','update', html`
                              <a href="#/website/b2b/purchase-orders/edit/${po.id}" 
                                 class="btn btn-outline-secondary"
                                 title="Edit">
                                <i class="bi bi-pencil"></i>
                              </a>
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

          <div class="mt-3 text-muted">
            <small>Showing ${this.purchaseOrders.length} purchase order${this.purchaseOrders.length === 1 ? '' : 's'}</small>
          </div>
        ` : ''}

        ${!this.loading && this.purchaseOrders.length === 0 ? html`
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-clipboard-check" style="font-size: 3rem; color: #ccc;"></i>
              <h4 class="mt-3">No Purchase Orders Found</h4>
              <p class="text-muted">
                ${this.searchTerm || this.statusFilter || this.approvalFilter
                  ? 'Try adjusting your filters'
                  : 'No purchase orders created yet'}
              </p>
              ${!this.searchTerm && !this.statusFilter && !this.approvalFilter ? html`
                <a href="#/website/b2b/purchase-orders/new" class="btn btn-primary mt-2">
                  <i class="bi bi-plus-circle me-2"></i>Create Purchase Order
                </a>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('po-list', POList);
