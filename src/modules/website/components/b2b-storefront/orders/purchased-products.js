/**
 * My Purchased Products - Purchase history with advanced filtering
 */

import { LitElement, html } from 'lit';
import { mockPurchases } from './purchase-data.js';

class PurchasedProducts extends LitElement {
  static properties = {
    purchases: { type: Array },
    filteredPurchases: { type: Array },
    searchTerm: { type: String },
    selectedUser: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    sortBy: { type: String },
    sortOrder: { type: String },
    showDetailModal: { type: Boolean },
    selectedPurchase: { type: Object }
  };

  constructor() {
    super();
    this.purchases = mockPurchases;
    this.filteredPurchases = [...this.purchases];
    this.searchTerm = '';
    this.selectedUser = 'all';
    this.startDate = '';
    this.endDate = '';
    this.sortBy = 'date';
    this.sortOrder = 'desc';
    this.showDetailModal = false;
    this.selectedPurchase = null;
  }

  createRenderRoot() {
    return this;
  }

  applyFilters() {
    let filtered = [...this.purchases];

    // Search filter (item number or keyword)
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.itemNumber.toLowerCase().includes(search) ||
        p.productName.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.orderNumber.toLowerCase().includes(search)
      );
    }

    // User filter
    if (this.selectedUser !== 'all') {
      filtered = filtered.filter(p => p.purchasedBy === this.selectedUser);
    }

    // Date range filter
    if (this.startDate) {
      filtered = filtered.filter(p => p.purchaseDate >= this.startDate);
    }
    if (this.endDate) {
      filtered = filtered.filter(p => p.purchaseDate <= this.endDate);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch(this.sortBy) {
        case 'date':
          aVal = new Date(a.purchaseDate);
          bVal = new Date(b.purchaseDate);
          break;
        case 'amount':
          aVal = a.totalPrice;
          bVal = b.totalPrice;
          break;
        case 'product':
          aVal = a.productName.toLowerCase();
          bVal = b.productName.toLowerCase();
          break;
        case 'quantity':
          aVal = a.quantity;
          bVal = b.quantity;
          break;
        case 'user':
          aVal = a.purchasedBy.toLowerCase();
          bVal = b.purchasedBy.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredPurchases = filtered;
    this.requestUpdate();
  }

  handleSearch(e) {
    this.searchTerm = e.target.value;
    this.applyFilters();
  }

  handleUserFilter(e) {
    this.selectedUser = e.target.value;
    this.applyFilters();
  }

  handleStartDate(e) {
    this.startDate = e.target.value;
    this.applyFilters();
  }

  handleEndDate(e) {
    this.endDate = e.target.value;
    this.applyFilters();
  }

  handleSort(e) {
    this.sortBy = e.target.value;
    this.applyFilters();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedUser = 'all';
    this.startDate = '';
    this.endDate = '';
    this.sortBy = 'date';
    this.sortOrder = 'desc';
    this.filteredPurchases = [...this.purchases];
    
    // Reset form fields
    const form = this.querySelector('form');
    if (form) form.reset();
    
    this.requestUpdate();
  }

  viewDetails(purchase) {
    this.selectedPurchase = purchase;
    this.showDetailModal = true;
    this.requestUpdate();
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedPurchase = null;
    this.requestUpdate();
  }

  reorderProduct(purchase) {
    alert(`Reordering: ${purchase.productName}\nItem #: ${purchase.itemNumber}\nQuantity: ${purchase.quantity}`);
    // In real app: Add to cart
  }

  exportToCSV() {
    const headers = ['Order#', 'Item#', 'Product', 'Quantity', 'Unit Price', 'Total', 'Date', 'Purchased By', 'Department', 'Status'];
    const rows = this.filteredPurchases.map(p => [
      p.orderNumber,
      p.itemNumber,
      p.productName,
      p.quantity,
      p.unitPrice,
      p.totalPrice,
      p.purchaseDate,
      p.purchasedBy,
      p.department,
      p.status
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchased-products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  get uniqueUsers() {
    const users = [...new Set(this.purchases.map(p => p.purchasedBy))];
    return users.sort();
  }

  get totalAmount() {
    return this.filteredPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
  }

  get totalQuantity() {
    return this.filteredPurchases.reduce((sum, p) => sum + p.quantity, 0);
  }

  get uniqueProducts() {
    return new Set(this.filteredPurchases.map(p => p.productName)).size;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  render() {
    return html`
      ${this.renderHeader()}
      ${this.renderSummaryCards()}
      ${this.renderFilters()}
      ${this.renderTable()}
      ${this.renderDetailModal()}
    `;
  }

  renderHeader() {
    return html`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2><i class="bi bi-cart-check me-2"></i>My Purchased Products</h2>
                <p class="text-muted">View and filter your purchase history</p>
              </div>
              <button class="btn btn-success" @click=${this.exportToCSV}>
                <i class="bi bi-download me-2"></i>Export to CSV
              </button>
            </div>
          </div>
        </div>
    `;
  }

  renderSummaryCards() {
    return html`
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card border-primary">
              <div class="card-body">
                <h6 class="text-muted">Total Purchases</h6>
                <h2 class="mb-0 text-primary">${this.filteredPurchases.length}</h2>
                <small class="text-muted">Orders</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-success">
              <div class="card-body">
                <h6 class="text-muted">Total Amount</h6>
                <h2 class="mb-0 text-success">${this.formatCurrency(this.totalAmount)}</h2>
                <small class="text-muted">Spent</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-info">
              <div class="card-body">
                <h6 class="text-muted">Total Items</h6>
                <h2 class="mb-0 text-info">${this.totalQuantity}</h2>
                <small class="text-muted">Units purchased</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-warning">
              <div class="card-body">
                <h6 class="text-muted">Unique Products</h6>
                <h2 class="mb-0 text-warning">${this.uniqueProducts}</h2>
                <small class="text-muted">Different items</small>
              </div>
            </div>
          </div>
        </div>
    `;
  }

  renderFilters() {
    return html`
        <div class="card mb-4">
          <div class="card-header bg-light">
            <h5 class="mb-0"><i class="bi bi-funnel me-2"></i>Filters & Search</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label fw-bold">
                  <i class="bi bi-search me-2"></i>Search by Item Number or Keyword
                </label>
                <input type="text" 
                       class="form-control" 
                       placeholder="Item number, product name, category..." 
                       .value=${this.searchTerm}
                       @input=${this.handleSearch}>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-bold">
                  <i class="bi bi-person me-2"></i>Filter by User
                </label>
                <select class="form-select" .value=${this.selectedUser} @change=${this.handleUserFilter}>
                  <option value="all">All Users</option>
                  ${this.uniqueUsers.map(user => html`
                    <option value="${user}">${user}</option>
                  `)}
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label fw-bold">
                  <i class="bi bi-calendar me-2"></i>Start Date
                </label>
                <input type="date" 
                       class="form-control" 
                       .value=${this.startDate}
                       @change=${this.handleStartDate}>
              </div>
              <div class="col-md-2">
                <label class="form-label fw-bold">
                  <i class="bi bi-calendar me-2"></i>End Date
                </label>
                <input type="date" 
                       class="form-control" 
                       .value=${this.endDate}
                       @change=${this.handleEndDate}>
              </div>
              <div class="col-md-1">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" 
                        @click=${this.clearFilters}
                        title="Clear all filters">
                  <i class="bi bi-x-circle"></i>
                </button>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-md-3">
                <label class="form-label fw-bold">
                  <i class="bi bi-sort-down me-2"></i>Sort By
                </label>
                <div class="input-group">
                  <select class="form-select" .value=${this.sortBy} @change=${this.handleSort}>
                    <option value="date">Purchase Date</option>
                    <option value="amount">Total Amount</option>
                    <option value="product">Product Name</option>
                    <option value="quantity">Quantity</option>
                    <option value="user">Purchased By</option>
                  </select>
                  <button class="btn btn-outline-primary" 
                          @click=${this.toggleSortOrder}
                          title="Toggle sort direction">
                    <i class="bi bi-arrow-${this.sortOrder === 'asc' ? 'up' : 'down'}"></i>
                  </button>
                </div>
              </div>
              <div class="col-md-9">
                <label class="form-label">&nbsp;</label>
                <div class="text-muted">
                  <small>
                    Showing ${this.filteredPurchases.length} of ${this.purchases.length} purchases
                    ${this.searchTerm ? html` | Search: "<strong>${this.searchTerm}</strong>"` : ''}
                    ${this.selectedUser !== 'all' ? html` | User: <strong>${this.selectedUser}</strong>` : ''}
                    ${this.startDate ? html` | From: <strong>${this.formatDate(this.startDate)}</strong>` : ''}
                    ${this.endDate ? html` | To: <strong>${this.formatDate(this.endDate)}</strong>` : ''}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
    `;
  }

  renderTable() {
    return html`
        <div class="card">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Item Number</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Purchase Date</th>
                    <th>Purchased By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.filteredPurchases.length > 0 ? this.filteredPurchases.map(purchase => html`
                    <tr>
                      <td>
                        <strong class="text-primary">${purchase.orderNumber}</strong>
                        <br><small class="text-muted">${purchase.invoiceNumber}</small>
                      </td>
                      <td>
                        <code class="bg-light p-1">${purchase.itemNumber}</code>
                      </td>
                      <td>
                        <strong>${purchase.productName}</strong>
                        <br><span class="badge bg-secondary">${purchase.category}</span>
                      </td>
                      <td>
                        <span class="badge bg-info fs-6">${purchase.quantity}</span>
                      </td>
                      <td>${this.formatCurrency(purchase.unitPrice)}</td>
                      <td class="fw-bold text-success">${this.formatCurrency(purchase.totalPrice)}</td>
                      <td>
                        ${this.formatDate(purchase.purchaseDate)}
                        <br><small class="text-muted">Delivered: ${this.formatDate(purchase.deliveryDate)}</small>
                      </td>
                      <td>
                        <strong>${purchase.purchasedBy}</strong>
                        <br><small class="text-muted">${purchase.department}</small>
                      </td>
                      <td>
                        <span class="badge bg-success">
                          <i class="bi bi-check-circle me-1"></i>${purchase.status}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" 
                                  @click=${() => this.viewDetails(purchase)}
                                  title="View Details">
                            <i class="bi bi-eye"></i>
                          </button>
                          <button class="btn btn-outline-success" 
                                  @click=${() => this.reorderProduct(purchase)}
                                  title="Reorder">
                            <i class="bi bi-arrow-repeat"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `) : html`
                    <tr>
                      <td colspan="10" class="text-center py-5">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <p class="mt-2 mb-0">No purchases found</p>
                        <button class="btn btn-sm btn-outline-primary mt-2" @click=${this.clearFilters}>
                          Clear Filters
                        </button>
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderDetailModal() {
    if (!this.showDetailModal || !this.selectedPurchase) return '';

    return html`
      <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="bi bi-receipt me-2"></i>
                Purchase Details - ${this.selectedPurchase.orderNumber}
              </h5>
              <button type="button" class="btn-close btn-close-white" @click=${this.closeDetailModal}></button>
            </div>
            <div class="modal-body">
              <div class="row mb-4">
                <div class="col-md-6">
                  <h6 class="text-muted">Order Information</h6>
                  <p class="mb-1"><strong>Order Number:</strong> ${this.selectedPurchase.orderNumber}</p>
                  <p class="mb-1"><strong>Invoice Number:</strong> ${this.selectedPurchase.invoiceNumber}</p>
                  <p class="mb-1"><strong>Purchase Date:</strong> ${this.formatDate(this.selectedPurchase.purchaseDate)}</p>
                  <p class="mb-1"><strong>Delivery Date:</strong> ${this.formatDate(this.selectedPurchase.deliveryDate)}</p>
                  <p class="mb-1">
                    <strong>Status:</strong> 
                    <span class="badge bg-success ms-2">${this.selectedPurchase.status}</span>
                  </p>
                </div>
                <div class="col-md-6">
                  <h6 class="text-muted">Purchaser Information</h6>
                  <p class="mb-1"><strong>Purchased By:</strong> ${this.selectedPurchase.purchasedBy}</p>
                  <p class="mb-1"><strong>Department:</strong> ${this.selectedPurchase.department}</p>
                  <p class="mb-1"><strong>Supplier:</strong> ${this.selectedPurchase.supplier}</p>
                </div>
              </div>

              <div class="card bg-light mb-4">
                <div class="card-body">
                  <h6 class="text-muted mb-3">Product Details</h6>
                  <div class="row">
                    <div class="col-md-6">
                      <p class="mb-1"><strong>Item Number:</strong></p>
                      <p><code class="bg-white p-2">${this.selectedPurchase.itemNumber}</code></p>
                      <p class="mb-1"><strong>Product Name:</strong></p>
                      <p>${this.selectedPurchase.productName}</p>
                      <p class="mb-1"><strong>Category:</strong></p>
                      <p><span class="badge bg-secondary">${this.selectedPurchase.category}</span></p>
                    </div>
                    <div class="col-md-6">
                      <p class="mb-1"><strong>Quantity:</strong></p>
                      <p class="fs-4 text-info">${this.selectedPurchase.quantity} units</p>
                      <p class="mb-1"><strong>Unit Price:</strong></p>
                      <p class="fs-5">${this.formatCurrency(this.selectedPurchase.unitPrice)}</p>
                      <p class="mb-1"><strong>Total Price:</strong></p>
                      <p class="fs-4 text-success fw-bold">${this.formatCurrency(this.selectedPurchase.totalPrice)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                <strong>Note:</strong> This purchase was delivered on ${this.formatDate(this.selectedPurchase.deliveryDate)}.
                For any issues, please contact your supplier directly.
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click=${this.closeDetailModal}>
                Close
              </button>
              <button class="btn btn-success" @click=${() => this.reorderProduct(this.selectedPurchase)}>
                <i class="bi bi-arrow-repeat me-2"></i>Reorder This Item
              </button>
              <button class="btn btn-primary">
                <i class="bi bi-file-earmark-pdf me-2"></i>Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('purchased-products', PurchasedProducts);
