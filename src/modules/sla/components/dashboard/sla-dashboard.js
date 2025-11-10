import { html } from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';

class SLADashboardPage extends BaseComponent {
  static properties = {
    metrics: { type: Object },
    dashboardStats: { type: Object },
    loading: { type: Boolean },
    fromDate: { type: String },
    toDate: { type: String },
    filterCustomer: { type: String },
    quickFilter: { type: String }
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.metrics = {};
    this.dashboardStats = {};
    this.loading = true;
    this.fromDate = '';
    this.toDate = '';
    this.filterCustomer = '';
    this.quickFilter = '';
    this._dataService = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadData();
  }

  async _loadData() {
    try {
      this.loading = true;
      if (!this._dataService) {
        this._dataService = await this.getService('dataService');
      }
      [this.metrics, this.dashboardStats] = await Promise.all([
        this._dataService.getSLAMetrics(),
        this._dataService.getSLADashboardStats()
      ]);
      this.loading = false;
    } catch (error) {
      console.error('Failed to load SLA metrics:', error);
      alert('Failed to load SLA metrics');
      this.loading = false;
    }
  }

  _handleQuickFilter(e) {
    const filter = e.target.value;
    this.quickFilter = filter;
    const today = new Date();
    
    if (filter === 'custom') {
      // Enable date pickers for custom selection
      return;
    }
    
    if (filter === 'today') {
      this.fromDate = today.toISOString().split('T')[0];
      this.toDate = today.toISOString().split('T')[0];
    } else if (filter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      this.fromDate = yesterday.toISOString().split('T')[0];
      this.toDate = yesterday.toISOString().split('T')[0];
    } else if (filter === 'this_week') {
      const day = today.getDay();
      const firstDay = new Date(today);
      firstDay.setDate(today.getDate() - day);
      const lastDay = new Date(today);
      lastDay.setDate(today.getDate() + (6 - day));
      this.fromDate = firstDay.toISOString().split('T')[0];
      this.toDate = lastDay.toISOString().split('T')[0];
    } else if (filter === 'last_week') {
      const day = today.getDay();
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - day - 7);
      const lastWeekEnd = new Date(today);
      lastWeekEnd.setDate(today.getDate() - day - 1);
      this.fromDate = lastWeekStart.toISOString().split('T')[0];
      this.toDate = lastWeekEnd.toISOString().split('T')[0];
    } else if (filter === 'this_month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      this.fromDate = firstDay.toISOString().split('T')[0];
      this.toDate = lastDay.toISOString().split('T')[0];
    } else if (filter === 'last_month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
      this.fromDate = firstDay.toISOString().split('T')[0];
      this.toDate = lastDay.toISOString().split('T')[0];
    } else if (filter === 'last_7_days') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      this.fromDate = sevenDaysAgo.toISOString().split('T')[0];
      this.toDate = today.toISOString().split('T')[0];
    } else if (filter === 'last_30_days') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      this.fromDate = thirtyDaysAgo.toISOString().split('T')[0];
      this.toDate = today.toISOString().split('T')[0];
    } else if (filter === 'last_90_days') {
      const ninetyDaysAgo = new Date(today);
      ninetyDaysAgo.setDate(today.getDate() - 90);
      this.fromDate = ninetyDaysAgo.toISOString().split('T')[0];
      this.toDate = today.toISOString().split('T')[0];
    } else if (filter === 'this_quarter') {
      const quarter = Math.floor(today.getMonth() / 3);
      const firstDay = new Date(today.getFullYear(), quarter * 3, 1);
      const lastDay = new Date(today.getFullYear(), quarter * 3 + 3, 0);
      this.fromDate = firstDay.toISOString().split('T')[0];
      this.toDate = lastDay.toISOString().split('T')[0];
    } else if (filter === 'this_year') {
      const firstDay = new Date(today.getFullYear(), 0, 1);
      const lastDay = new Date(today.getFullYear(), 11, 31);
      this.fromDate = firstDay.toISOString().split('T')[0];
      this.toDate = lastDay.toISOString().split('T')[0];
    }
    
    this._loadData();
  }

  _resetFilters() {
    this.fromDate = '';
    this.toDate = '';
    this.filterCustomer = '';
    this.quickFilter = '';
    this._loadData();
  }

  _renderKPICard(title, category, icon, color) {
    const metric = this.metrics[category];
    if (!metric) return '';

    const slaPercentage = metric.slaPercentage;
    const statusColor = slaPercentage >= 95 ? 'success' : slaPercentage >= 80 ? 'warning' : 'danger';
    const targetKPI = 95; // Target is 95%

    return html`
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 border-${color}">
          <div class="card-header bg-${color} text-white">
            <h6 class="mb-0">
              <i class="bi bi-${icon} me-2"></i>${title}
            </h6>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-6 mb-3">
                <div class="text-muted small mb-1">KPI Met</div>
                <div class="h2 mb-0 text-success">${metric.slaMet}</div>
              </div>
              <div class="col-6 mb-3">
                <div class="text-muted small mb-1">KPI Total</div>
                <div class="h2 mb-0">${metric.total}</div>
              </div>
              <div class="col-6">
                <div class="text-muted small mb-1">KPI %</div>
                <div class="h2 mb-0 text-${statusColor}">${slaPercentage}%</div>
              </div>
              <div class="col-6">
                <div class="text-muted small mb-1">Target KPI %</div>
                <div class="h2 mb-0">${targetKPI}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="container-fluid py-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted mt-3">Loading SLA dashboard...</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container-fluid py-4">
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">
              <i class="bi bi-speedometer2 me-2"></i>SLA Dashboard
            </h2>
            <p class="text-muted mb-0">Service Level Agreement Performance Metrics</p>
          </div>
          <div>
            <button class="btn btn-outline-primary me-2" @click=${this._loadData}>
              <i class="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
            <a href="/sla/incidents" class="btn btn-primary">
              <i class="bi bi-list-ul me-2"></i>View All Incidents
            </a>
          </div>
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row g-3">
              <!-- Quick Filter Dropdown -->
              <div class="col-md-3">
                <label class="form-label small text-muted">Quick Filter</label>
                <select
                  class="form-select"
                  .value=${this.quickFilter}
                  @change=${this._handleQuickFilter}
                >
                  <option value="">Select Period</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_week">This Week</option>
                  <option value="last_week">Last Week</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="last_90_days">Last 90 Days</option>
                  <option value="this_quarter">This Quarter</option>
                  <option value="this_year">This Year</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>

              <!-- From Date -->
              <div class="col-md-2">
                <label class="form-label small text-muted">From Date</label>
                <input
                  type="date"
                  class="form-control"
                  .value=${this.fromDate}
                  ?disabled=${this.quickFilter !== 'custom'}
                  @input=${(e) => { this.fromDate = e.target.value; this._loadData(); }}
                />
              </div>

              <!-- To Date -->
              <div class="col-md-2">
                <label class="form-label small text-muted">To Date</label>
                <input
                  type="date"
                  class="form-control"
                  .value=${this.toDate}
                  ?disabled=${this.quickFilter !== 'custom'}
                  @input=${(e) => { this.toDate = e.target.value; this._loadData(); }}
                />
              </div>

              <!-- Customer Filter -->
              <div class="col-md-3">
                <label class="form-label small text-muted">Customer</label>
                <select
                  class="form-select"
                  .value=${this.filterCustomer}
                  @change=${(e) => { this.filterCustomer = e.target.value; this._loadData(); }}
                >
                  <option value="">All Customers</option>
                  <option value="Customer A">Customer A</option>
                  <option value="Customer B">Customer B</option>
                  <option value="Customer C">Customer C</option>
                  <option value="VIP Customer">VIP Customer</option>
                </select>
              </div>

              <!-- Reset Button -->
              <div class="col-md-2">
                <label class="form-label small text-muted">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click=${this._resetFilters} title="Reset Filters">
                  <i class="bi bi-x-circle me-2"></i>Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Category-wise KPI Cards -->
        <h4 class="mb-3">
          <i class="bi bi-bar-chart-line me-2"></i>Category-wise Performance
        </h4>
        <div class="row">
          ${this._renderKPICard('Problem Resolution', 'problem_resolution', 'tools', 'danger')}
          ${this._renderKPICard('Claim Resolution', 'claim_resolution', 'file-earmark-text', 'info')}
          ${this._renderKPICard('Order Confirmation', 'order_confirmation', 'cart-check', 'success')}
          ${this._renderKPICard('Inventory Accuracy', 'inventory_accuracy', 'box-seam', 'warning')}
          ${this._renderKPICard('Sourcing', 'sourcing', 'truck', 'primary')}
          ${this._renderKPICard('Urgent Orders', 'urgent_orders', 'lightning', 'danger')}
        </div>
      </div>
    `;
  }
}

customElements.define('sla-dashboard', SLADashboardPage);
