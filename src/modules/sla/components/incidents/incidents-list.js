import { html } from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';
import '@shared/components/ui/ui-card.js';
import '@shared/components/ui/ui-table.js';

class IncidentsListPage extends BaseComponent {
  static properties = {
    incidents: { type: Array },
    loading: { type: Boolean },
    page: { type: Number },
    pageSize: { type: Number },
    total: { type: Number },
    totalPages: { type: Number },
    search: { type: String },
    filterPriority: { type: String },
    filterStatus: { type: String },
    filterCategory: { type: String },
    filterAccount: { type: String },
    fromDate: { type: String },
    toDate: { type: String },
    sortBy: { type: String },
    sortOrder: { type: String },
    showColumnManager: { type: Boolean },
    visibleColumns: { type: Object },
    partners: { type: Array },
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.incidents = [];
    this.loading = true;
    this.partners = [];
    this.page = 1;
    this.pageSize = 10;
    this.total = 0;
    this.totalPages = 1;
    this.search = '';
    this.filterPriority = '';
    this.filterStatus = '';
    this.filterCategory = '';
    this.filterAccount = '';
    this.fromDate = '';
    this.toDate = '';
    this.sortBy = 'reportedDate';
    this.sortOrder = 'desc';
    this.showColumnManager = false;
    this.visibleColumns = {
      incidentNumber: true,
      inquiryReceived: true,
      initialResponse: true,
      priority: true,
      category: true,
      description: true,
      clientEmail: true,
      account: true,
      status: true
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    await Promise.all([
      this._loadIncidents(),
      this._loadPartners()
    ]);
  }

  async _loadPartners() {
    try {
      const dataService = await this.getService('dataService');
      // Load customer-type business partners for filter options
      this.partners = await dataService.getBusinessPartners({ partnerType: 'customer' });
    } catch (e) {
      this.partners = [];
    }
  }

  async _loadIncidents() {
    this.loading = true;
    try {
      const dataService = await this.getService('dataService');
      let allIncidents = await dataService.getIncidents();

      // Add default values for new fields if missing
      allIncidents = allIncidents.map(inc => ({
        ...inc,
        initialResponseDate: inc.initialResponseDate || new Date(new Date(inc.reportedDate).getTime() + 30 * 60000).toISOString(),
        clientEmail: inc.clientEmail || `client${inc.id}@example.com`,
        account: inc.account || `Account ${inc.id % 5 + 1}`
      }));

      // Apply search filter
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        allIncidents = allIncidents.filter(inc =>
          inc.incidentNumber.toLowerCase().includes(searchLower) ||
          inc.description.toLowerCase().includes(searchLower) ||
          inc.clientEmail.toLowerCase().includes(searchLower) ||
          inc.account.toLowerCase().includes(searchLower)
        );
      }

      // Apply priority filter
      if (this.filterPriority) {
        allIncidents = allIncidents.filter(inc => inc.priority === this.filterPriority);
      }

      // Apply status filter
      if (this.filterStatus) {
        allIncidents = allIncidents.filter(inc => inc.status === this.filterStatus);
      }

      // Apply category filter
      if (this.filterCategory) {
        allIncidents = allIncidents.filter(inc => inc.category === this.filterCategory);
      }

      // Apply account filter
      if (this.filterAccount) {
        allIncidents = allIncidents.filter(inc => inc.account === this.filterAccount);
      }

      // Apply date filters
      if (this.fromDate) {
        allIncidents = allIncidents.filter(inc => 
          new Date(inc.reportedDate) >= new Date(this.fromDate)
        );
      }
      if (this.toDate) {
        const toDateEnd = new Date(this.toDate);
        toDateEnd.setHours(23, 59, 59, 999);
        allIncidents = allIncidents.filter(inc => 
          new Date(inc.reportedDate) <= toDateEnd
        );
      }

      // Apply sorting
      allIncidents.sort((a, b) => {
        let aVal = a[this.sortBy];
        let bVal = b[this.sortBy];

        if (this.sortBy.includes('Date') || this.sortBy === 'inquiryReceived' || this.sortBy === 'initialResponse') {
          aVal = new Date(aVal || 0);
          bVal = new Date(bVal || 0);
        }

        if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      // Calculate pagination
      this.total = allIncidents.length;
      this.totalPages = Math.ceil(this.total / this.pageSize);
      const start = (this.page - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.incidents = allIncidents.slice(start, end);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      this.loading = false;
    }
  }

  _handleSearch(e) {
    this.search = e.target.value;
    this.page = 1;
    this._loadIncidents();
  }

  _handleFilterChange() {
    this.page = 1;
    this._loadIncidents();
  }

  _handleSort(column) {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this._loadIncidents();
  }

  _handlePageChange(newPage) {
    this.page = newPage;
    this._loadIncidents();
  }

  _handlePageSizeChange(e) {
    this.pageSize = parseInt(e.target.value);
    this.page = 1;
    this._loadIncidents();
  }

  _resetFilters() {
    this.search = '';
    this.filterPriority = '';
    this.filterStatus = '';
    this.filterCategory = '';
    this.filterAccount = '';
    this.fromDate = '';
    this.toDate = '';
    this.page = 1;
    this._loadIncidents();
  }

  _navigateToCreate() {
    window.history.pushState({}, '', '/sla/incidents/new');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _navigateToEdit(id) {
    window.history.pushState({}, '', `/sla/incidents/edit/${id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  async _handleDelete(id, incidentNumber) {
    if (!confirm(`Are you sure you want to delete incident ${incidentNumber}?`)) return;

    try {
      const dataService = await this.getService('dataService');
      await dataService.deleteIncident(id);
      await this._loadIncidents();
    } catch (error) {
      alert('Error deleting incident: ' + error.message);
    }
  }

  _toggleColumnManager() {
    this.showColumnManager = !this.showColumnManager;
  }

  _toggleColumn(column) {
    this.visibleColumns = {
      ...this.visibleColumns,
      [column]: !this.visibleColumns[column]
    };
  }

  async _exportData() {
    const dataService = await this.getService('dataService');
    const allIncidents = await dataService.getIncidents();
    const csv = dataService.exportIncidentsToCSV(allIncidents);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidents_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  _getSortIcon(column) {
    if (this.sortBy !== column) return 'bi-arrow-down-up';
    return this.sortOrder === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
  }

  _getCategoryName(category) {
    const names = {
      problem_resolution: 'Problem Resolution',
      claim_resolution: 'Claim Resolution',
      order_confirmation: 'Order Confirmation',
      inventory_accuracy: 'Inventory Accuracy',
      sourcing: 'Sourcing',
      urgent_orders: 'Urgent Orders'
    };
    return names[category] || category;
  }

  _getCategoryBadge(category) {
    const badges = {
      problem_resolution: 'danger',
      claim_resolution: 'info',
      order_confirmation: 'success',
      inventory_accuracy: 'warning',
      sourcing: 'primary',
      urgent_orders: 'danger'
    };
    return badges[category] || 'secondary';
  }

  _getPriorityBadge(priority) {
    const badges = {
      critical: 'danger',
      urgent: 'warning',
      high: 'warning',
      medium: 'info',
      low: 'secondary'
    };
    return badges[priority] || 'secondary';
  }

  _getStatusBadge(status) {
    const badges = {
      open: 'warning',
      in_progress: 'info',
      resolved: 'success'
    };
    return badges[status] || 'secondary';
  }

  _formatDateTime(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  }

  _getUniqueAccounts() {
    const accounts = new Set();
    // Existing incident-derived accounts
    this.incidents.forEach(inc => {
      if (inc.account) accounts.add(inc.account);
    });
    // Also include known partner account numbers if available
    if (Array.isArray(this.partners)) {
      this.partners.forEach(p => {
        if (p.accountNumber) accounts.add(p.accountNumber);
      });
    }
    return Array.from(accounts).sort();
  }

  render() {
    return html`
      <div>
        <!-- Page Header -->
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h2 fw-bold mb-2">
                <i class="bi bi-list-ul text-primary me-2"></i>Incidents Management
              </h1>
              <p class="text-muted mb-0">Manage and track SLA incidents</p>
            </div>
            <button class="btn btn-primary" @click=${this._navigateToCreate}>
              <i class="bi bi-plus-circle me-2"></i>Create Incident
            </button>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row g-3 mb-3">
              <!-- Search -->
              <div class="col-md-3">
                <label class="form-label small text-muted">Search</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search..."
                  .value=${this.search}
                  @input=${this._handleSearch}
                />
              </div>

              <!-- Priority Filter -->
              <div class="col-md-2">
                <label class="form-label small text-muted">Priority</label>
                <select
                  class="form-select"
                  .value=${this.filterPriority}
                  @change=${(e) => { this.filterPriority = e.target.value; this._handleFilterChange(); }}
                >
                  <option value="">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <!-- Status Filter -->
              <div class="col-md-2">
                <label class="form-label small text-muted">Status</label>
                <select
                  class="form-select"
                  .value=${this.filterStatus}
                  @change=${(e) => { this.filterStatus = e.target.value; this._handleFilterChange(); }}
                >
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <!-- Category Filter -->
              <div class="col-md-2">
                <label class="form-label small text-muted">Category</label>
                <select
                  class="form-select"
                  .value=${this.filterCategory}
                  @change=${(e) => { this.filterCategory = e.target.value; this._handleFilterChange(); }}
                >
                  <option value="">All Categories</option>
                  <option value="problem_resolution">Problem Resolution</option>
                  <option value="claim_resolution">Claim Resolution</option>
                  <option value="order_confirmation">Order Confirmation</option>
                  <option value="inventory_accuracy">Inventory Accuracy</option>
                  <option value="sourcing">Sourcing</option>
                  <option value="urgent_orders">Urgent Orders</option>
                </select>
              </div>

              <!-- Account Filter -->
              <div class="col-md-3">
                <label class="form-label small text-muted">Account</label>
                <select
                  class="form-select"
                  .value=${this.filterAccount}
                  @change=${(e) => { this.filterAccount = e.target.value; this._handleFilterChange(); }}
                >
                  <option value="">All Accounts</option>
                  ${this._getUniqueAccounts().map(acc => html`<option value="${acc}">${acc}</option>`)}
                </select>
              </div>
            </div>

            <div class="row g-3">
              <!-- From Date -->
              <div class="col-md-2">
                <label class="form-label small text-muted">From Date</label>
                <input
                  type="date"
                  class="form-control"
                  .value=${this.fromDate}
                  @input=${(e) => { this.fromDate = e.target.value; this._handleFilterChange(); }}
                />
              </div>

              <!-- To Date -->
              <div class="col-md-2">
                <label class="form-label small text-muted">To Date</label>
                <input
                  type="date"
                  class="form-control"
                  .value=${this.toDate}
                  @input=${(e) => { this.toDate = e.target.value; this._handleFilterChange(); }}
                />
              </div>

              <!-- Action Buttons -->
              <div class="col-md-8 d-flex align-items-end justify-content-end">
                <button class="btn btn-outline-secondary me-2" @click=${this._resetFilters} title="Reset Filters">
                  <i class="bi bi-x-circle me-2"></i>Reset
                </button>
                <button class="btn btn-outline-secondary me-2 position-relative" @click=${this._toggleColumnManager} title="Manage Columns">
                  <i class="bi bi-layout-three-columns"></i>
                </button>
                <button class="btn btn-outline-secondary" @click=${this._exportData} title="Export Data">
                  <i class="bi bi-download"></i>
                </button>
              </div>
            </div>

            <!-- Column Manager Popover -->
            ${this.showColumnManager ? html`
              <div class="position-relative mt-3">
                <div class="card position-absolute end-0 shadow" style="z-index: 1060; width: 250px;">
                  <div class="card-header bg-light">
                    <div class="d-flex justify-content-between align-items-center">
                      <strong>Manage Columns</strong>
                      <button class="btn-close btn-sm" @click=${this._toggleColumnManager}></button>
                    </div>
                  </div>
                  <div class="card-body">
                    ${Object.keys(this.visibleColumns).map(col => html`
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="col-${col}"
                          .checked=${this.visibleColumns[col]}
                          @change=${() => this._toggleColumn(col)}
                        />
                        <label class="form-check-label" for="col-${col}">
                          ${col === 'incidentNumber' ? 'Number' :
                            col === 'inquiryReceived' ? 'Inquiry Received' :
                            col === 'initialResponse' ? 'Initial Response' :
                            col === 'clientEmail' ? 'Client Email' :
                            col.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                      </div>
                    `)}
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Data Table -->
        <ui-card>
          <ui-table
            .columns=${[
              this.visibleColumns.incidentNumber && {
                key: 'incidentNumber', label: 'Number', sortable: true,
                render: (i) => html`<strong>${i.incidentNumber}</strong>`
              },
              this.visibleColumns.inquiryReceived && {
                key: 'reportedDate', label: 'Inquiry Received', sortable: true,
                render: (i) => html`<small>${this._formatDateTime(i.reportedDate)}</small>`
              },
              this.visibleColumns.initialResponse && {
                key: 'initialResponseDate', label: 'Initial Response', sortable: true,
                render: (i) => html`<small>${this._formatDateTime(i.initialResponseDate)}</small>`
              },
              this.visibleColumns.priority && {
                key: 'priority', label: 'Priority', sortable: true,
                render: (i) => html`<span class="badge bg-${this._getPriorityBadge(i.priority)}">${i.priority.toUpperCase()}</span>`
              },
              this.visibleColumns.category && {
                key: 'category', label: 'Category', sortable: true,
                render: (i) => html`<span class="badge bg-${this._getCategoryBadge(i.category)}">${this._getCategoryName(i.category)}</span>`
              },
              this.visibleColumns.description && {
                key: 'description', label: 'Description',
                render: (i) => html`<div style="max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${i.description}">${i.description}</div>`
              },
              this.visibleColumns.clientEmail && { key: 'clientEmail', label: 'Client Email' },
              this.visibleColumns.account && { key: 'account', label: 'Account', sortable: true, render: (i) => html`<strong>${i.account}</strong>` },
              this.visibleColumns.status && {
                key: 'status', label: 'Status', sortable: true,
                render: (i) => html`<span class="badge bg-${this._getStatusBadge(i.status)}">${i.status.replace('_',' ').toUpperCase()}</span>`
              },
              { key: 'actions', label: 'Actions', render: (i) => html`
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" @click=${() => this._navigateToEdit(i.id)} title="Edit">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click=${() => this._handleDelete(i.id, i.incidentNumber)} title="Delete">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                `
              }
            ].filter(Boolean)}
            .items=${this.incidents}
            .loading=${this.loading}
            emptyText="No incidents found"
            .page=${this.page}
            .pageSize=${this.pageSize}
            .total=${this.total}
            .sortBy=${this.sortBy}
            .sortOrder=${this.sortOrder}
            @table-sort=${(e) => { this.sortBy = e.detail.sortBy; this.sortOrder = e.detail.sortOrder; this._loadIncidents(); }}
            @table-page=${(e) => { this._handlePageChange(e.detail.page); }}
          ></ui-table>

          <div slot="footer" class="bg-white">
            <div class="row align-items-center">
              <div class="col-md-6">
                <div class="d-flex align-items-center">
                  <span class="me-2">Show:</span>
                  <select class="form-select form-select-sm" style="width: auto;" .value=${this.pageSize} @change=${this._handlePageSizeChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span class="ms-3 text-muted">
                    Showing ${(this.page - 1) * this.pageSize + 1} to ${Math.min(this.page * this.pageSize, this.total)} of ${this.total} entries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ui-card>
      </div>
    `;
  }
}

customElements.define('incidents-list', IncidentsListPage);
