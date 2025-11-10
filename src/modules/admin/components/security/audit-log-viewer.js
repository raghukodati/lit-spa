/**
 * Audit Log Viewer Component
 * View and analyze security audit trails
 */

import { html } from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';
import { securityContext } from '../../services/security-context.service.js';

class AuditLogViewer extends BaseComponent {
  static properties = {
    auditLogs: { type: Array },
    loading: { type: Boolean },
    filterEvent: { type: String },
    filterUser: { type: String },
    filterDateFrom: { type: String },
    filterDateTo: { type: String },
    searchTerm: { type: String },
    currentPage: { type: Number },
    pageSize: { type: Number }
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.auditLogs = [];
    this.loading = false;
    this.filterEvent = 'all';
    this.filterUser = 'all';
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.searchTerm = '';
    this.currentPage = 1;
    this.pageSize = 25;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadAuditLogs();
  }

  async loadAuditLogs() {
    this.loading = true;
    try {
      // Get audit logs from security context
      this.auditLogs = securityContext.getAuditLog();
      
      // In production, fetch from API
      // const response = await fetch('/api/admin/audit-logs');
      // this.auditLogs = await response.json();
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      this.loading = false;
    }
  }

  _getEventColor(event) {
    const colors = {
      'permission_check': 'info',
      'login': 'success',
      'logout': 'secondary',
      'failed_login': 'danger',
      'user_created': 'success',
      'user_updated': 'warning',
      'user_deleted': 'danger',
      'role_assigned': 'primary',
      'permission_granted': 'success',
      'permission_denied': 'danger',
      'mfa_enabled': 'success',
      'mfa_disabled': 'warning',
      'account_locked': 'danger',
      'password_changed': 'info',
      'security_violation': 'danger'
    };
    return colors[event] || 'secondary';
  }

  _getEventIcon(event) {
    const icons = {
      'permission_check': 'shield-check',
      'login': 'box-arrow-in-right',
      'logout': 'box-arrow-right',
      'failed_login': 'x-circle',
      'user_created': 'person-plus',
      'user_updated': 'person-gear',
      'user_deleted': 'person-x',
      'role_assigned': 'shield-plus',
      'permission_granted': 'check-circle',
      'permission_denied': 'x-octagon',
      'mfa_enabled': 'shield-lock',
      'mfa_disabled': 'shield-x',
      'account_locked': 'lock',
      'password_changed': 'key',
      'security_violation': 'exclamation-triangle'
    };
    return icons[event] || 'circle';
  }

  _getFilteredLogs() {
    let filtered = this.auditLogs;

    // Filter by event type
    if (this.filterEvent !== 'all') {
      filtered = filtered.filter(log => log.event === this.filterEvent);
    }

    // Filter by user
    if (this.filterUser !== 'all') {
      filtered = filtered.filter(log => log.username === this.filterUser);
    }

    // Filter by date range
    if (this.filterDateFrom) {
      const fromDate = new Date(this.filterDateFrom);
      filtered = filtered.filter(log => new Date(log.timestamp) >= fromDate);
    }
    if (this.filterDateTo) {
      const toDate = new Date(this.filterDateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(log => new Date(log.timestamp) <= toDate);
    }

    // Search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.event?.toLowerCase().includes(term) ||
        log.username?.toLowerCase().includes(term) ||
        JSON.stringify(log.details)?.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  _getPaginatedLogs() {
    const filtered = this._getFilteredLogs();
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  }

  _getTotalPages() {
    return Math.ceil(this._getFilteredLogs().length / this.pageSize);
  }

  _getUniqueEvents() {
    return [...new Set(this.auditLogs.map(log => log.event))].filter(Boolean);
  }

  _getUniqueUsers() {
    return [...new Set(this.auditLogs.map(log => log.username))].filter(Boolean);
  }

  _exportToCSV() {
    const logs = this._getFilteredLogs();
    const headers = ['Timestamp', 'Event', 'User', 'Details', 'IP Address'];
    const rows = logs.map(log => [
      new Date(log.timestamp).toISOString(),
      log.event,
      log.username || 'System',
      JSON.stringify(log.details),
      log.ipAddress || 'N/A'
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  render() {
    const filteredLogs = this._getFilteredLogs();
    const paginatedLogs = this._getPaginatedLogs();
    const totalPages = this._getTotalPages();

    return html`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-clock-history me-2"></i>Security Audit Log
            </h1>
            <p class="text-muted">View and analyze security events and user activities</p>
          </div>
          <button @click=${this._exportToCSV} class="btn btn-outline-primary">
            <i class="bi bi-download me-1"></i>Export CSV
          </button>
        </div>

        <!-- Statistics Cards -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card border-primary">
              <div class="card-body text-center">
                <i class="bi bi-list-ul fs-1 text-primary"></i>
                <h3 class="mt-2">${this.auditLogs.length}</h3>
                <p class="text-muted mb-0">Total Events</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-success">
              <div class="card-body text-center">
                <i class="bi bi-check-circle fs-1 text-success"></i>
                <h3 class="mt-2">${this.auditLogs.filter(l => l.event.includes('success') || l.event.includes('granted')).length}</h3>
                <p class="text-muted mb-0">Successful Actions</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-danger">
              <div class="card-body text-center">
                <i class="bi bi-x-circle fs-1 text-danger"></i>
                <h3 class="mt-2">${this.auditLogs.filter(l => l.event.includes('failed') || l.event.includes('denied')).length}</h3>
                <p class="text-muted mb-0">Failed Actions</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-info">
              <div class="card-body text-center">
                <i class="bi bi-people fs-1 text-info"></i>
                <h3 class="mt-2">${this._getUniqueUsers().length}</h3>
                <p class="text-muted mb-0">Active Users</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Search</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search logs..."
                  .value=${this.searchTerm}
                  @input=${(e) => this.searchTerm = e.target.value}>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-semibold">Event Type</label>
                <select class="form-select" .value=${this.filterEvent} @change=${(e) => this.filterEvent = e.target.value}>
                  <option value="all">All Events</option>
                  ${this._getUniqueEvents().map(event => html`
                    <option value="${event}">${event}</option>
                  `)}
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-semibold">User</label>
                <select class="form-select" .value=${this.filterUser} @change=${(e) => this.filterUser = e.target.value}>
                  <option value="all">All Users</option>
                  ${this._getUniqueUsers().map(user => html`
                    <option value="${user}">${user}</option>
                  `)}
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-semibold">From Date</label>
                <input 
                  type="date" 
                  class="form-control"
                  .value=${this.filterDateFrom}
                  @input=${(e) => this.filterDateFrom = e.target.value}>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-semibold">To Date</label>
                <input 
                  type="date" 
                  class="form-control"
                  .value=${this.filterDateTo}
                  @input=${(e) => this.filterDateTo = e.target.value}>
              </div>
              <div class="col-md-1">
                <label class="form-label small fw-semibold">&nbsp;</label>
                <button 
                  class="btn btn-outline-secondary w-100"
                  @click=${() => {
                    this.filterEvent = 'all';
                    this.filterUser = 'all';
                    this.filterDateFrom = '';
                    this.filterDateTo = '';
                    this.searchTerm = '';
                  }}>
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Audit Log Table -->
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0">
              <i class="bi bi-table me-2"></i>Audit Entries (${filteredLogs.length})
            </h5>
          </div>
          <div class="card-body p-0">
            ${this.loading ? html`
              <div class="text-center p-5">
                <div class="spinner-border text-primary"></div>
              </div>
            ` : html`
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="fw-semibold">Timestamp</th>
                      <th class="fw-semibold">Event</th>
                      <th class="fw-semibold">User</th>
                      <th class="fw-semibold">Details</th>
                      <th class="fw-semibold">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${paginatedLogs.length === 0 ? html`
                      <tr>
                        <td colspan="5" class="text-center text-muted py-4">
                          No audit logs found matching your filters
                        </td>
                      </tr>
                    ` : paginatedLogs.map(log => html`
                      <tr>
                        <td>
                          <div class="small">
                            <div class="fw-bold">${new Date(log.timestamp).toLocaleString()}</div>
                            <div class="text-muted">${new Date(log.timestamp).toRelativeTimeString?.() || 'Just now'}</div>
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-${this._getEventColor(log.event)}">
                            <i class="bi bi-${this._getEventIcon(log.event)}"></i> ${log.event}
                          </span>
                        </td>
                        <td>
                          <div class="d-flex align-items-center">
                            <i class="bi bi-person-circle me-2 text-primary"></i>
                            <span>${log.username || 'System'}</span>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            ${Object.entries(log.details || {}).map(([key, value]) => html`
                              <div><strong>${key}:</strong> ${value}</div>
                            `)}
                          </div>
                        </td>
                        <td>
                          <code class="small">${log.ipAddress || 'N/A'}</code>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              ${totalPages > 1 ? html`
                <div class="card-footer bg-white border-top">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="text-muted small">
                      Showing ${(this.currentPage - 1) * this.pageSize + 1} - ${Math.min(this.currentPage * this.pageSize, filteredLogs.length)} of ${filteredLogs.length}
                    </div>
                    <nav>
                      <ul class="pagination pagination-sm mb-0">
                        <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                          <button class="page-link" @click=${() => this.currentPage = 1}>First</button>
                        </li>
                        <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                          <button class="page-link" @click=${() => this.currentPage--}>Previous</button>
                        </li>
                        ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = Math.max(1, this.currentPage - 2) + i;
                          return page <= totalPages ? html`
                            <li class="page-item ${this.currentPage === page ? 'active' : ''}">
                              <button class="page-link" @click=${() => this.currentPage = page}>${page}</button>
                            </li>
                          ` : '';
                        })}
                        <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                          <button class="page-link" @click=${() => this.currentPage++}>Next</button>
                        </li>
                        <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                          <button class="page-link" @click=${() => this.currentPage = totalPages}>Last</button>
                        </li>
                      </ul>
                    </nav>
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

customElements.define('audit-log-viewer', AuditLogViewer);
