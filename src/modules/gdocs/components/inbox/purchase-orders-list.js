import {LitElement, html} from 'lit';
import {
  getForecasts,
  getForecastById,
  deleteForecast,
  getForecastYears,
  getForecastMonths,
  getForecastCustomers
} from '../../../../services/dataService.js';

class ForecastListPage extends LitElement {
  static properties = {
    forecasts: {type: Array},
    loading: {type: Boolean},
    page: {type: Number},
    pageSize: {type: Number},
    total: {type: Number},
    totalPages: {type: Number},
    search: {type: String},
    filterCustomer: {type: String},
    filterYear: {type: String},
    filterMonth: {type: String},
    sortBy: {type: String},
    sortOrder: {type: String},
    customers: {type: Array},
    years: {type: Array},
    months: {type: Array},
    showColumnManager: {type: Boolean},
    visibleColumns: {type: Object},
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.forecasts = [];
    this.loading = true;
    this.page = 1;
    this.pageSize = 10;
    this.total = 0;
    this.totalPages = 1;
    this.search = '';
    this.filterCustomer = '';
    this.filterYear = '';
    this.filterMonth = '';
    this.sortBy = 'id';
    this.sortOrder = 'asc';
    this.customers = [];
    this.years = [];
    this.months = [];
    this.showColumnManager = false;
    this.visibleColumns = {
      customerName: true,
      year: true,
      month: true,
      forecastValue: true,
      commissionPercent: true,
      commissionDollar: true,
      createdDate: true
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    this.customers = getForecastCustomers();
    this.years = getForecastYears();
    this.months = getForecastMonths();
    await this._loadForecasts();
  }

  async _loadForecasts() {
    this.loading = true;
    try {
      const result = await getForecasts({
        page: this.page,
        pageSize: this.pageSize,
        search: this.search,
        customerName: this.filterCustomer,
        year: this.filterYear,
        month: this.filterMonth,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder
      });
      
      this.forecasts = result.data;
      this.total = result.total;
      this.totalPages = result.totalPages;
    } catch (error) {
      console.error('Error loading forecasts:', error);
    } finally {
      this.loading = false;
    }
  }

  _handleSearch(e) {
    this.search = e.target.value;
    this.page = 1;
    this._loadForecasts();
  }

  _handleFilterChange() {
    this.page = 1;
    this._loadForecasts();
  }

  _handleSort(column) {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this._loadForecasts();
  }

  _handlePageChange(newPage) {
    this.page = newPage;
    this._loadForecasts();
  }

  _handlePageSizeChange(e) {
    this.pageSize = parseInt(e.target.value);
    this.page = 1;
    this._loadForecasts();
  }

  _resetFilters() {
    this.search = '';
    this.filterCustomer = '';
    this.filterYear = '';
    this.filterMonth = '';
    this.page = 1;
    this._loadForecasts();
  }

  _navigateToCreate() {
    window.history.pushState({}, '', '/module/analytics/forecast/create');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _navigateToEdit(id) {
    window.history.pushState({}, '', `/module/analytics/forecast/edit/${id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  async _handleDelete(id) {
    if (!confirm('Are you sure you want to delete this forecast?')) return;
    
    try {
      await deleteForecast(id);
      await this._loadForecasts();
    } catch (error) {
      alert('Error deleting forecast: ' + error.message);
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

  _exportData() {
    const headers = Object.keys(this.visibleColumns)
      .filter(col => this.visibleColumns[col])
      .map(col => col.replace(/([A-Z])/g, ' $1').trim());
    
    const rows = this.forecasts.map(forecast => 
      Object.keys(this.visibleColumns)
        .filter(col => this.visibleColumns[col])
        .map(col => forecast[col])
    );
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecasts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  _getSortIcon(column) {
    if (this.sortBy !== column) return 'bi-arrow-down-up';
    return this.sortOrder === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
  }

  render() {
    return html`
      <div>
        <!-- Page Header -->
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h2 fw-bold mb-2">
                <i class="bi bi-bar-chart-line text-primary me-2"></i>Forecast Management
              </h1>
              <p class="text-muted mb-0">Manage customer forecasts and commissions</p>
            </div>
            <button class="btn btn-primary" @click=${this._navigateToCreate}>
              <i class="bi bi-plus-circle me-2"></i>Create Forecast
            </button>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row g-3">
              <!-- Search -->
              <div class="col-md-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search..."
                  .value=${this.search}
                  @input=${this._handleSearch}
                />
              </div>

              <!-- Customer Filter -->
              <div class="col-md-3">
                <select
                  class="form-select"
                  .value=${this.filterCustomer}
                  @change=${(e) => { this.filterCustomer = e.target.value; this._handleFilterChange(); }}
                >
                  <option value="">All Customers</option>
                  ${this.customers.map(customer => html`
                    <option value="${customer}">${customer}</option>
                  `)}
                </select>
              </div>

              <!-- Year Filter -->
              <div class="col-md-2">
                <select
                  class="form-select"
                  .value=${this.filterYear}
                  @change=${(e) => { this.filterYear = e.target.value; this._handleFilterChange(); }}
                >
                  <option value="">All Years</option>
                  ${this.years.map(year => html`
                    <option value="${year}">${year}</option>
                  `)}
                </select>
              </div>

              <!-- Month Filter -->
              <div class="col-md-2">
                <select
                  class="form-select"
                  .value=${this.filterMonth}
                  @change=${(e) => { this.filterMonth = e.target.value; this._handleFilterChange(); }}
                >
                  <option value="">All Months</option>
                  ${this.months.map(month => html`
                    <option value="${month}">${month}</option>
                  `)}
                </select>
              </div>

              <!-- Action Buttons -->
              <div class="col-md-2">
                <div class="btn-group w-100">
                  <button class="btn btn-outline-secondary" @click=${this._resetFilters} title="Reset Filters">
                    <i class="bi bi-x-circle"></i>
                  </button>
                  <button class="btn btn-outline-secondary position-relative" @click=${this._toggleColumnManager} title="Manage Columns">
                    <i class="bi bi-layout-three-columns"></i>
                  </button>
                  <button class="btn btn-outline-secondary" @click=${this._exportData} title="Export Data">
                    <i class="bi bi-download"></i>
                  </button>
                </div>
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
                          ${col.replace(/([A-Z])/g, ' $1').trim()}
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
        <div class="card shadow-sm">
          <div class="card-body p-0">
            ${this.loading ? html`
              <div class="text-center p-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-3 text-muted">Loading forecasts...</p>
              </div>
            ` : html`
              <div class="table-responsive">
                <table class="table table-hover table-striped mb-0">
                  <thead class="table-light sticky-top">
                    <tr>
                      ${this.visibleColumns.customerName ? html`
                        <th @click=${() => this._handleSort('customerName')} style="cursor: pointer;">
                          Customer Name <i class="bi ${this._getSortIcon('customerName')}"></i>
                        </th>
                      ` : ''}
                      ${this.visibleColumns.year ? html`
                        <th @click=${() => this._handleSort('year')} style="cursor: pointer;">
                          Year <i class="bi ${this._getSortIcon('year')}"></i>
                        </th>
                      ` : ''}
                      ${this.visibleColumns.month ? html`
                        <th @click=${() => this._handleSort('month')} style="cursor: pointer;">
                          Month <i class="bi ${this._getSortIcon('month')}"></i>
                        </th>
                      ` : ''}
                      ${this.visibleColumns.forecastValue ? html`
                        <th class="text-end" @click=${() => this._handleSort('forecastValue')} style="cursor: pointer;">
                          Forecast Value <i class="bi ${this._getSortIcon('forecastValue')}"></i>
                        </th>
                      ` : ''}
                      ${this.visibleColumns.commissionPercent ? html`
                        <th class="text-end" @click=${() => this._handleSort('commissionPercent')} style="cursor: pointer;">
                          Commission % <i class="bi ${this._getSortIcon('commissionPercent')}"></i>
                        </th>
                      ` : ''}
                      ${this.visibleColumns.commissionDollar ? html`
                        <th class="text-end" @click=${() => this._handleSort('commissionDollar')} style="cursor: pointer;">
                          Commission $ <i class="bi ${this._getSortIcon('commissionDollar')}"></i>
                        </th>
                      ` : ''}
                      ${this.visibleColumns.createdDate ? html`
                        <th @click=${() => this._handleSort('createdDate')} style="cursor: pointer;">
                          Created Date <i class="bi ${this._getSortIcon('createdDate')}"></i>
                        </th>
                      ` : ''}
                      <th class="text-center" style="width: 150px;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.forecasts.length > 0 ? this.forecasts.map(forecast => html`
                      <tr>
                        ${this.visibleColumns.customerName ? html`<td><strong>${forecast.customerName}</strong></td>` : ''}
                        ${this.visibleColumns.year ? html`<td>${forecast.year}</td>` : ''}
                        ${this.visibleColumns.month ? html`<td>${forecast.month}</td>` : ''}
                        ${this.visibleColumns.forecastValue ? html`<td class="text-end">$${forecast.forecastValue.toLocaleString()}</td>` : ''}
                        ${this.visibleColumns.commissionPercent ? html`<td class="text-end">${forecast.commissionPercent}%</td>` : ''}
                        ${this.visibleColumns.commissionDollar ? html`<td class="text-end text-success fw-bold">$${forecast.commissionDollar.toLocaleString()}</td>` : ''}
                        ${this.visibleColumns.createdDate ? html`<td>${forecast.createdDate}</td>` : ''}
                        <td class="text-center">
                          <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" @click=${() => this._navigateToEdit(forecast.id)} title="Edit">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" @click=${() => this._handleDelete(forecast.id)} title="Delete">
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    `) : html`
                      <tr>
                        <td colspan="8" class="text-center text-muted py-5">
                          <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                          No forecasts found
                        </td>
                      </tr>
                    `}
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              ${this.totalPages > 1 ? html`
                <div class="card-footer bg-white">
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
                    <div class="col-md-6">
                      <nav>
                        <ul class="pagination pagination-sm justify-content-end mb-0">
                          <li class="page-item ${this.page === 1 ? 'disabled' : ''}">
                            <a class="page-link" @click=${() => this._handlePageChange(1)}>First</a>
                          </li>
                          <li class="page-item ${this.page === 1 ? 'disabled' : ''}">
                            <a class="page-link" @click=${() => this._handlePageChange(this.page - 1)}>Previous</a>
                          </li>
                          ${Array.from({length: Math.min(5, this.totalPages)}, (_, i) => {
                            let pageNum;
                            if (this.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (this.page <= 3) {
                              pageNum = i + 1;
                            } else if (this.page >= this.totalPages - 2) {
                              pageNum = this.totalPages - 4 + i;
                            } else {
                              pageNum = this.page - 2 + i;
                            }
                            return html`
                              <li class="page-item ${this.page === pageNum ? 'active' : ''}">
                                <a class="page-link" @click=${() => this._handlePageChange(pageNum)}>${pageNum}</a>
                              </li>
                            `;
                          })}
                          <li class="page-item ${this.page === this.totalPages ? 'disabled' : ''}">
                            <a class="page-link" @click=${() => this._handlePageChange(this.page + 1)}>Next</a>
                          </li>
                          <li class="page-item ${this.page === this.totalPages ? 'disabled' : ''}">
                            <a class="page-link" @click=${() => this._handlePageChange(this.totalPages)}>Last</a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              ` : ''}
            `}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('inbox-purchase-orders-list', ForecastListPage);
