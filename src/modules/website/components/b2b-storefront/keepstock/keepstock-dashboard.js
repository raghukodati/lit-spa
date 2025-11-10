/**
 * Enhanced KeepStock Dashboard - Multi-item lists with search and batch ordering  
 */

import { LitElement, html } from 'lit';

class KeepStockDashboard extends LitElement {
  static properties = {
    keepStockLists: { type: Array },
    alerts: { type: Array },
    selectedList: { type: Object },
    showDetailModal: { type: Boolean },
    searchTerm: { type: String },
    filterStatus: { type: String }
  };

  constructor() {
    super();
    this.keepStockLists = this.loadKeepStockLists();
    this.alerts = this.generateAlerts();
    this.selectedList = null;
    this.showDetailModal = false;
    this.searchTerm = '';
    this.filterStatus = 'all';
  }

  createRenderRoot() {
    return this;
  }

  loadKeepStockLists() {
    const saved = localStorage.getItem('keepstock-lists');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    
    return [
      {
        id: 1,
        keepStockNumber: 'KS-2024-001',
        name: 'Office Essentials',
        description: 'Daily office supplies',
        category: 'Office Supplies',
        autoReorder: true,
        createdDate: '2024-01-15',
        lastOrdered: '2025-10-28',
        items: [
          {productName: 'Office Paper A4', sku: 'PAPER-A4-500', currentStock: 15, minStock: 20, maxStock: 50, reorderQuantity: 30, unitPrice: 4.99, status: 'low_stock'},
          {productName: 'Ballpoint Pens (Box)', sku: 'PEN-BALL-50', currentStock: 8, minStock: 15, maxStock: 40, reorderQuantity: 20, unitPrice: 12.99, status: 'critical'},
          {productName: 'Sticky Notes', sku: 'STICKY-3X3', currentStock: 25, minStock: 20, maxStock: 60, reorderQuantity: 30, unitPrice: 3.99, status: 'optimal'}
        ]
      },
      {
        id: 2,
        keepStockNumber: 'KS-2024-002',
        name: 'Printer Supplies',
        description: 'Toner and printer materials',
        category: 'Printer Supplies',
        autoReorder: true,
        createdDate: '2024-02-01',
        lastOrdered: '2025-10-15',
        items: [
          {productName: 'Toner Cartridge Black', sku: 'TONER-BLK-5000', currentStock: 3, minStock: 10, maxStock: 30, reorderQuantity: 15, unitPrice: 89.99, status: 'critical'},
          {productName: 'Toner Cartridge Color', sku: 'TONER-CLR-SET', currentStock: 5, minStock: 8, maxStock: 20, reorderQuantity: 10, unitPrice: 149.99, status: 'low_stock'},
          {productName: 'Printer Paper Legal', sku: 'PAPER-LEGAL', currentStock: 12, minStock: 15, maxStock: 40, reorderQuantity: 20, unitPrice: 5.99, status: 'low_stock'}
        ]
      },
      {
        id: 3,
        keepStockNumber: 'KS-2024-003',
        name: 'Janitorial Supplies',
        description: 'Cleaning products',
        category: 'Janitorial',
        autoReorder: true,
        createdDate: '2024-01-20',
        lastOrdered: '2025-09-20',
        items: [
          {productName: 'Hand Sanitizer (Gallon)', sku: 'SANITIZER-GAL', currentStock: 45, minStock: 20, maxStock: 60, reorderQuantity: 25, unitPrice: 12.50, status: 'optimal'},
          {productName: 'Disinfectant Spray', sku: 'DISINFECT-CASE', currentStock: 32, minStock: 15, maxStock: 40, reorderQuantity: 20, unitPrice: 24.99, status: 'optimal'},
          {productName: 'Paper Towels (Case)', sku: 'TOWEL-CASE', currentStock: 28, minStock: 20, maxStock: 50, reorderQuantity: 25, unitPrice: 18.99, status: 'optimal'}
        ]
      },
      {
        id: 4,
        keepStockNumber: 'KS-2024-004',
        name: 'Break Room Supplies',
        description: 'Coffee and disposables',
        category: 'Break Room',
        autoReorder: false,
        createdDate: '2024-03-01',
        lastOrdered: '2025-10-25',
        items: [
          {productName: 'Coffee (Ground, 2lb)', sku: 'COFFEE-GRD-2LB', currentStock: 32, minStock: 15, maxStock: 40, reorderQuantity: 20, unitPrice: 15.99, status: 'optimal'},
          {productName: 'Disposable Cups', sku: 'CUP-DISP-SLEEVE', currentStock: 18, minStock: 12, maxStock: 30, reorderQuantity: 15, unitPrice: 8.99, status: 'optimal'}
        ]
      },
      {
        id: 5,
        keepStockNumber: 'KS-2024-005',
        name: 'Safety Equipment',
        description: 'PPE and safety supplies',
        category: 'Safety Equipment',
        autoReorder: true,
        createdDate: '2024-02-15',
        lastOrdered: '2025-10-01',
        items: [
          {productName: 'Safety Gloves (Box)', sku: 'GLOVE-SAF-100', currentStock: 8, minStock: 15, maxStock: 40, reorderQuantity: 20, unitPrice: 24.99, status: 'low_stock'},
          {productName: 'Face Masks (Box)', sku: 'MASK-DISP-50', currentStock: 5, minStock: 10, maxStock: 50, reorderQuantity: 30, unitPrice: 12.99, status: 'critical'}
        ]
      }
    ];
  }

  saveKeepStockLists() {
    localStorage.setItem('keepstock-lists', JSON.stringify(this.keepStockLists));
  }

  generateAlerts() {
    const alerts = [];
    this.keepStockLists.forEach(list => {
      const criticalItems = list.items.filter(i => i.status === 'critical').length;
      const lowItems = list.items.filter(i => i.status === 'low_stock').length;
      
      if (criticalItems > 0) {
        alerts.push({type: 'critical', message: `${list.name} (${list.keepStockNumber}) has ${criticalItems} critical item(s)`, list: list});
      } else if (lowItems > 0) {
        alerts.push({type: 'warning', message: `${list.name} (${list.keepStockNumber}) has ${lowItems} low stock item(s)`, list: list});
      }
    });
    return alerts;
  }

  getListStatus(list) {
    if (list.items.some(i => i.status === 'critical')) return 'critical';
    if (list.items.some(i => i.status === 'low_stock')) return 'low_stock';
    return 'optimal';
  }

  handleSearch(e) {
    this.searchTerm = e.target.value.toLowerCase();
    this.requestUpdate();
  }

  handleFilterChange(e) {
    this.filterStatus = e.target.value;
    this.requestUpdate();
  }

  get filteredLists() {
    return this.keepStockLists.filter(list => {
      const listStatus = this.getListStatus(list);
      if (this.filterStatus !== 'all' && listStatus !== this.filterStatus) return false;
      if (this.searchTerm) {
        return list.keepStockNumber.toLowerCase().includes(this.searchTerm) ||
               list.name.toLowerCase().includes(this.searchTerm) ||
               list.category.toLowerCase().includes(this.searchTerm);
      }
      return true;
    });
  }

  viewListDetails(list) {
    this.selectedList = list;
    this.showDetailModal = true;
    this.requestUpdate();
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedList = null;
    this.requestUpdate();
  }

  toggleAutoReorder(list) {
    list.autoReorder = !list.autoReorder;
    this.saveKeepStockLists();
    this.requestUpdate();
  }

  orderEntireList(list) {
    const totalItems = list.items.reduce((sum, item) => sum + item.reorderQuantity, 0);
    const totalCost = list.items.reduce((sum, item) => sum + (item.reorderQuantity * item.unitPrice), 0);
    const itemsList = list.items.map(item => `\n• ${item.productName}: ${item.reorderQuantity} units @ ${this.formatCurrency(item.unitPrice)} = ${this.formatCurrency(item.reorderQuantity * item.unitPrice)}`).join('');
    
    if (confirm(`Order entire KeepStock list?\n\nList: ${list.name} (${list.keepStockNumber})\nTotal Items: ${totalItems} units\nEstimated Cost: ${this.formatCurrency(totalCost)}\n\nItems:${itemsList}`)) {
      alert(`✓ Creating order for KeepStock ${list.keepStockNumber}\n\nAll ${list.items.length} products added to cart.`);
      list.lastOrdered = new Date().toISOString().split('T')[0];
      this.saveKeepStockLists();
      this.requestUpdate();
    }
  }

  getStatusBadge(status) {
    return {optimal: 'bg-success', low_stock: 'bg-warning text-dark', critical: 'bg-danger'}[status] || 'bg-secondary';
  }

  getStatusText(status) {
    return {optimal: 'Optimal', low_stock: 'Low Stock', critical: 'Critical'}[status] || status;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(amount);
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});
  }

  get criticalCount() {
    return this.keepStockLists.filter(l => this.getListStatus(l) === 'critical').length;
  }

  get lowStockCount() {
    return this.keepStockLists.filter(l => this.getListStatus(l) === 'low_stock').length;
  }

  get optimalCount() {
    return this.keepStockLists.filter(l => this.getListStatus(l) === 'optimal').length;
  }

  get totalValue() {
    return this.keepStockLists.reduce((sum, list) => sum + list.items.reduce((itemSum, item) => itemSum + (item.currentStock * item.unitPrice), 0), 0);
  }

  render() {
    return html`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2><i class="bi bi-boxes me-2"></i>KeepStock Lists</h2>
                <p class="text-muted">Multi-item inventory groups with search and batch ordering</p>
              </div>
              <button class="btn btn-primary"><i class="bi bi-plus-lg me-2"></i>Create New List</button>
            </div>
          </div>
        </div>

        ${this.alerts.length > 0 ? html`
          <div class="row mb-4">
            <div class="col-12">
              ${this.alerts.map(alert => html`
                <div class="alert alert-${alert.type === 'critical' ? 'danger' : 'warning'} d-flex justify-content-between align-items-center mb-2">
                  <div><i class="bi bi-exclamation-triangle me-2"></i><strong>${alert.message}</strong></div>
                  <button class="btn btn-sm btn-${alert.type === 'critical' ? 'danger' : 'warning'}" @click=${() => this.orderEntireList(alert.list)}>
                    <i class="bi bi-cart-plus me-1"></i>Order Entire List
                  </button>
                </div>
              `)}
            </div>
          </div>
        ` : ''}

        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card border-primary">
              <div class="card-body">
                <h6 class="text-muted">Total Lists</h6>
                <h2 class="mb-0 text-primary">${this.keepStockLists.length}</h2>
                <small class="text-muted">${this.keepStockLists.reduce((sum, l) => sum + l.items.length, 0)} products</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-danger">
              <div class="card-body">
                <h6 class="text-muted">Critical Lists</h6>
                <h2 class="mb-0 text-danger">${this.criticalCount}</h2>
                <small class="text-muted">Need immediate action</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-warning">
              <div class="card-body">
                <h6 class="text-muted">Low Stock</h6>
                <h2 class="mb-0 text-warning">${this.lowStockCount}</h2>
                <small class="text-muted">Monitor closely</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-success">
              <div class="card-body">
                <h6 class="text-muted">Optimal</h6>
                <h2 class="mb-0 text-success">${this.optimalCount}</h2>
                <small class="text-muted">Well stocked</small>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold"><i class="bi bi-search me-2"></i>Search by KeepStock Number or Name</label>
                <input type="text" class="form-control form-control-lg" placeholder="Try: KS-2024-001, Office Essentials..." @input=${this.handleSearch}>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-bold">Filter by Status</label>
                <select class="form-select form-select-lg" @change=${this.handleFilterChange}>
                  <option value="all">All Statuses</option>
                  <option value="critical">Critical Only</option>
                  <option value="low_stock">Low Stock Only</option>
                  <option value="optimal">Optimal Only</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">&nbsp;</label>
                <div class="text-muted">
                  <small>Showing ${this.filteredLists.length} of ${this.keepStockLists.length} lists</small>
                  ${this.searchTerm ? html`<br><small class="text-primary">Search: "${this.searchTerm}"</small>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>KeepStock #</th>
                    <th>List Name</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Total Value</th>
                    <th>Auto-Reorder</th>
                    <th>Last Ordered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.filteredLists.length > 0 ? this.filteredLists.map(list => {
                    const listStatus = this.getListStatus(list);
                    const listValue = list.items.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
                    const orderCost = list.items.reduce((sum, item) => sum + (item.reorderQuantity * item.unitPrice), 0);
                    const criticalItems = list.items.filter(i => i.status === 'critical').length;
                    const lowItems = list.items.filter(i => i.status === 'low_stock').length;
                    
                    return html`
                      <tr>
                        <td>
                          <strong class="text-primary fs-5">${list.keepStockNumber}</strong>
                          <br><span class="badge bg-secondary">${list.category}</span>
                        </td>
                        <td>
                          <strong>${list.name}</strong>
                          <br><small class="text-muted">${list.description}</small>
                        </td>
                        <td>
                          <span class="badge bg-info fs-6">${list.items.length} items</span>
                          ${criticalItems > 0 ? html`<br><small class="text-danger fw-bold">${criticalItems} critical</small>` : ''}
                          ${lowItems > 0 ? html`<br><small class="text-warning">${lowItems} low</small>` : ''}
                        </td>
                        <td>
                          <span class="badge ${this.getStatusBadge(listStatus)} fs-6">
                            ${this.getStatusText(listStatus)}
                          </span>
                        </td>
                        <td>
                          <strong>${this.formatCurrency(listValue)}</strong>
                          <br><small class="text-muted">Reorder: ${this.formatCurrency(orderCost)}</small>
                        </td>
                        <td>
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" ?checked=${list.autoReorder} @change=${() => this.toggleAutoReorder(list)}>
                          </div>
                        </td>
                        <td>${this.formatDate(list.lastOrdered)}</td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" @click=${() => this.viewListDetails(list)}>
                              <i class="bi bi-eye"></i> Details
                            </button>
                            ${listStatus !== 'optimal' ? html`
                              <button class="btn btn-success" @click=${() => this.orderEntireList(list)}>
                                <i class="bi bi-cart-plus"></i> Order List
                              </button>
                            ` : ''}
                          </div>
                        </td>
                      </tr>
                    `;
                  }) : html`
                    <tr>
                      <td colspan="8" class="text-center py-5">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <p class="mt-2 mb-0">No KeepStock lists found</p>
                        ${this.searchTerm ? html`<button class="btn btn-sm btn-outline-primary mt-2" @click=${() => { this.searchTerm = ''; this.requestUpdate(); }}>Clear Search</button>` : ''}
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        ${this.showDetailModal && this.selectedList ? html`
          <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl">
              <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                  <h5 class="modal-title"><i class="bi bi-boxes me-2"></i>${this.selectedList.name} (${this.selectedList.keepStockNumber})</h5>
                  <button type="button" class="btn-close btn-close-white" @click=${this.closeDetailModal}></button>
                </div>
                <div class="modal-body">
                  <div class="row mb-4">
                    <div class="col-md-8">
                      <h6 class="text-muted">List Information</h6>
                      <p class="mb-1"><strong>KeepStock Number:</strong> <span class="text-primary fs-5">${this.selectedList.keepStockNumber}</span></p>
                      <p class="mb-1"><strong>Description:</strong> ${this.selectedList.description}</p>
                      <p class="mb-1"><strong>Category:</strong> <span class="badge bg-secondary">${this.selectedList.category}</span></p>
                      <p class="mb-1"><strong>Total Products:</strong> ${this.selectedList.items.length}</p>
                    </div>
                    <div class="col-md-4">
                      <div class="card bg-light">
                        <div class="card-body">
                          <h6>Reorder Summary</h6>
                          <p class="mb-1">Total Items: <strong>${this.selectedList.items.reduce((sum, i) => sum + i.reorderQuantity, 0)}</strong></p>
                          <p class="mb-1">Estimated Cost:</p>
                          <h4 class="text-primary">${this.formatCurrency(this.selectedList.items.reduce((sum, i) => sum + (i.reorderQuantity * i.unitPrice), 0))}</h4>
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" ?checked=${this.selectedList.autoReorder} @change=${() => this.toggleAutoReorder(this.selectedList)}>
                            <label class="form-check-label">Auto-Reorder</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h6 class="text-muted mb-3">Products in this List</h6>
                  <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                      <thead class="table-light">
                        <tr>
                          <th>Product</th>
                          <th>SKU</th>
                          <th>Current Stock</th>
                          <th>Min/Max</th>
                          <th>Reorder Qty</th>
                          <th>Unit Price</th>
                          <th>Status</th>
                          <th>Line Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.selectedList.items.map(item => html`
                          <tr>
                            <td><strong>${item.productName}</strong></td>
                            <td><small class="text-muted">${item.sku}</small></td>
                            <td><span class="badge ${this.getStatusBadge(item.status)}">${item.currentStock}</span></td>
                            <td><small>${item.minStock} / ${item.maxStock}</small></td>
                            <td><strong>${item.reorderQuantity}</strong></td>
                            <td>${this.formatCurrency(item.unitPrice)}</td>
                            <td><span class="badge ${this.getStatusBadge(item.status)}">${this.getStatusText(item.status)}</span></td>
                            <td class="fw-bold">${this.formatCurrency(item.reorderQuantity * item.unitPrice)}</td>
                          </tr>
                        `)}
                      </tbody>
                      <tfoot class="table-light">
                        <tr>
                          <td colspan="7" class="text-end"><strong>Total Order Cost:</strong></td>
                          <td class="fw-bold text-primary fs-5">${this.formatCurrency(this.selectedList.items.reduce((sum, i) => sum + (i.reorderQuantity * i.unitPrice), 0))}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-secondary" @click=${this.closeDetailModal}>Close</button>
                  <button class="btn btn-success btn-lg" @click=${() => this.orderEntireList(this.selectedList)}>
                    <i class="bi bi-cart-plus me-2"></i>Order Entire List (${this.selectedList.items.length} items)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="card mt-4">
          <div class="card-header bg-light">
            <h5 class="mb-0"><i class="bi bi-lightbulb me-2"></i>How KeepStock Lists Work</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <h6><i class="bi bi-1-circle text-primary me-2"></i>Create Lists</h6>
                <p class="small">Group related products into KeepStock lists</p>
              </div>
              <div class="col-md-3">
                <h6><i class="bi bi-2-circle text-primary me-2"></i>Search by Number</h6>
                <p class="small">Find lists quickly by their unique KeepStock number</p>
              </div>
              <div class="col-md-3">
                <h6><i class="bi bi-3-circle text-primary me-2"></i>Monitor Status</h6>
                <p class="small">System tracks all items and alerts when any product runs low</p>
              </div>
              <div class="col-md-3">
                <h6><i class="bi bi-4-circle text-primary me-2"></i>Order Entire List</h6>
                <p class="small">One-click ordering of all items in the list</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('keepstock-dashboard', KeepStockDashboard);
