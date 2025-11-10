/**
 * Session Management Component
 * Manage active user sessions, view session details, and force logouts
 */

import { html } from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';
import { securityContext } from '../../services/security-context.service.js';

class SessionManagement extends BaseComponent {
  static properties = {
    sessions: { type: Array },
    loading: { type: Boolean },
    filterUser: { type: String },
    filterStatus: { type: String },
    searchTerm: { type: String }
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.sessions = [];
    this.loading = false;
    this.filterUser = 'all';
    this.filterStatus = 'all';
    this.searchTerm = '';
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadSessions();
    
    // Listen for route changes to reload data
    this._handlePopState = () => {
      if (window.location.pathname === '/sessions') {
        console.log('Route changed to sessions page, reloading data');
        this.loadSessions();
      }
    };
    window.addEventListener('popstate', this._handlePopState);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._handlePopState) {
      window.removeEventListener('popstate', this._handlePopState);
    }
  }

  async loadSessions() {
    this.loading = true;
    try {
      // In production, fetch from API
      // const response = await fetch('/api/admin/sessions');
      // this.sessions = await response.json();

      // Mock data
      this.sessions = this._generateMockSessions();
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      this.loading = false;
    }
  }

  _generateMockSessions() {
    return [
      { 
        id: 'sess_001', 
        userId: 1, 
        username: 'admin@example.com', 
        userFullName: 'Super Admin',
        ipAddress: '192.168.1.100', 
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        browser: 'Chrome 120',
        os: 'macOS',
        device: 'Desktop',
        location: 'New York, US',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), 
        lastActivity: new Date(Date.now() - 5 * 60 * 1000),
        expiresAt: new Date(Date.now() + 58 * 60 * 1000),
        status: 'active',
        mfaVerified: true
      },
      { 
        id: 'sess_002', 
        userId: 2, 
        username: 'manager@example.com', 
        userFullName: 'John Manager',
        ipAddress: '192.168.1.101', 
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        browser: 'Edge 120',
        os: 'Windows 11',
        device: 'Desktop',
        location: 'London, UK',
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), 
        lastActivity: new Date(Date.now() - 2 * 60 * 1000),
        expiresAt: new Date(Date.now() + 59 * 60 * 1000),
        status: 'active',
        mfaVerified: true
      },
      { 
        id: 'sess_003', 
        userId: 3, 
        username: 'sales@example.com', 
        userFullName: 'Jane Sales',
        ipAddress: '192.168.1.102', 
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        browser: 'Safari Mobile',
        os: 'iOS 17',
        device: 'Mobile',
        location: 'Tokyo, JP',
        startTime: new Date(Date.now() - 30 * 60 * 1000), 
        lastActivity: new Date(Date.now() - 20 * 60 * 1000),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        status: 'idle',
        mfaVerified: true
      },
      { 
        id: 'sess_004', 
        userId: 1, 
        username: 'admin@example.com', 
        userFullName: 'Super Admin',
        ipAddress: '203.0.113.50', 
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        browser: 'Firefox 121',
        os: 'Linux',
        device: 'Desktop',
        location: 'Unknown',
        startTime: new Date(Date.now() - 5 * 60 * 60 * 1000), 
        lastActivity: new Date(Date.now() - 35 * 60 * 1000),
        expiresAt: new Date(Date.now() - 5 * 60 * 1000),
        status: 'expired',
        mfaVerified: false
      }
    ];
  }

  _getStatusColor(status) {
    const colors = {
      'active': 'success',
      'idle': 'warning',
      'expired': 'secondary',
      'terminated': 'danger'
    };
    return colors[status] || 'secondary';
  }

  _getDeviceIcon(device) {
    const icons = {
      'Desktop': 'pc-display',
      'Mobile': 'phone',
      'Tablet': 'tablet'
    };
    return icons[device] || 'device';
  }

  _formatDuration(startTime) {
    const seconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  _formatTimeRemaining(expiresAt) {
    const seconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    if (seconds < 0) return 'Expired';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  }

  _getFilteredSessions() {
    let filtered = this.sessions;

    // Filter by user
    if (this.filterUser !== 'all') {
      filtered = filtered.filter(s => s.username === this.filterUser);
    }

    // Filter by status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === this.filterStatus);
    }

    // Search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.username?.toLowerCase().includes(term) ||
        s.userFullName?.toLowerCase().includes(term) ||
        s.ipAddress?.toLowerCase().includes(term) ||
        s.location?.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => b.lastActivity - a.lastActivity);
  }

  _getUniqueUsers() {
    return [...new Set(this.sessions.map(s => s.username))];
  }

  async _terminateSession(session) {
    if (confirm(`Terminate session for ${session.userFullName}?`)) {
      try {
        // await fetch(`/api/admin/sessions/${session.id}/terminate`, { method: 'POST' });
        alert('Session terminated successfully');
        await this.loadSessions();
      } catch (error) {
        console.error('Failed to terminate session:', error);
        alert('Failed to terminate session');
      }
    }
  }

  async _terminateAllUserSessions(username) {
    if (confirm(`Terminate ALL sessions for ${username}?`)) {
      try {
        // await fetch(`/api/admin/sessions/user/${username}/terminate-all`, { method: 'POST' });
        alert('All sessions terminated successfully');
        await this.loadSessions();
      } catch (error) {
        console.error('Failed to terminate sessions:', error);
        alert('Failed to terminate sessions');
      }
    }
  }

  async _extendSession(session) {
    try {
      // await fetch(`/api/admin/sessions/${session.id}/extend`, { method: 'POST' });
      alert('Session extended by 30 minutes');
      await this.loadSessions();
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  }

  render() {
    const filteredSessions = this._getFilteredSessions();
    const activeSessions = this.sessions.filter(s => s.status === 'active');
    const idleSessions = this.sessions.filter(s => s.status === 'idle');

    return html`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-pc-display me-2"></i>Session Management
            </h1>
            <p class="text-muted">Monitor and manage active user sessions</p>
          </div>
          <button @click=${() => this.loadSessions()} class="btn btn-primary">
            <i class="bi bi-arrow-clockwise me-1"></i>Refresh
          </button>
        </div>

        <!-- Statistics -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card border-success">
              <div class="card-body text-center">
                <i class="bi bi-check-circle fs-1 text-success"></i>
                <h3 class="mt-2">${activeSessions.length}</h3>
                <p class="text-muted mb-0">Active Sessions</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-warning">
              <div class="card-body text-center">
                <i class="bi bi-clock fs-1 text-warning"></i>
                <h3 class="mt-2">${idleSessions.length}</h3>
                <p class="text-muted mb-0">Idle Sessions</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-info">
              <div class="card-body text-center">
                <i class="bi bi-people fs-1 text-info"></i>
                <h3 class="mt-2">${this._getUniqueUsers().length}</h3>
                <p class="text-muted mb-0">Unique Users</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-primary">
              <div class="card-body text-center">
                <i class="bi bi-list-ul fs-1 text-primary"></i>
                <h3 class="mt-2">${this.sessions.length}</h3>
                <p class="text-muted mb-0">Total Sessions</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-5">
                <label class="form-label small fw-semibold">Search</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by user, IP, or location..."
                  .value=${this.searchTerm}
                  @input=${(e) => this.searchTerm = e.target.value}>
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-semibold">User</label>
                <select class="form-select" .value=${this.filterUser} @change=${(e) => this.filterUser = e.target.value}>
                  <option value="all">All Users</option>
                  ${this._getUniqueUsers().map(user => html`
                    <option value="${user}">${user}</option>
                  `)}
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Status</label>
                <select class="form-select" .value=${this.filterStatus} @change=${(e) => this.filterStatus = e.target.value}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div class="col-md-1">
                <label class="form-label small fw-semibold">&nbsp;</label>
                <button 
                  class="btn btn-outline-secondary w-100"
                  @click=${() => {
                    this.filterUser = 'all';
                    this.filterStatus = 'all';
                    this.searchTerm = '';
                  }}>
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sessions Table -->
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0">
              <i class="bi bi-table me-2"></i>Active Sessions (${filteredSessions.length})
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
                      <th class="fw-semibold">User</th>
                      <th class="fw-semibold">Device & Location</th>
                      <th class="fw-semibold">Session Info</th>
                      <th class="fw-semibold">Status</th>
                      <th class="fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredSessions.length === 0 ? html`
                      <tr>
                        <td colspan="5" class="text-center text-muted py-4">
                          No sessions found matching your filters
                        </td>
                      </tr>
                    ` : filteredSessions.map(session => html`
                      <tr>
                        <td>
                          <div class="d-flex align-items-center">
                            <i class="bi bi-person-circle fs-4 text-primary me-2"></i>
                            <div>
                              <div class="fw-bold">${session.userFullName}</div>
                              <div class="small text-muted">${session.username}</div>
                              ${session.mfaVerified ? html`
                                <span class="badge bg-success small"><i class="bi bi-shield-check"></i> MFA</span>
                              ` : ''}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            <div>
                              <i class="bi bi-${this._getDeviceIcon(session.device)}"></i>
                              ${session.browser} on ${session.os}
                            </div>
                            <div class="text-muted">
                              <i class="bi bi-geo-alt"></i> ${session.location}
                            </div>
                            <div class="text-muted">
                              <code>${session.ipAddress}</code>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            <div><strong>Started:</strong> ${session.startTime.toLocaleString()}</div>
                            <div><strong>Duration:</strong> ${this._formatDuration(session.startTime)}</div>
                            <div><strong>Last Activity:</strong> ${this._formatDuration(session.lastActivity)} ago</div>
                            <div><strong>Expires:</strong> ${this._formatTimeRemaining(session.expiresAt)}</div>
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-${this._getStatusColor(session.status)}">
                            ${session.status}
                          </span>
                        </td>
                        <td>
                          <div class="d-flex gap-1">
                            ${session.status === 'active' || session.status === 'idle' ? html`
                              <button 
                                @click=${() => this._extendSession(session)}
                                class="btn btn-sm btn-outline-info"
                                title="Extend session">
                                <i class="bi bi-clock"></i>
                              </button>
                              <button 
                                @click=${() => this._terminateSession(session)}
                                class="btn btn-sm btn-outline-danger"
                                title="Terminate session">
                                <i class="bi bi-x-circle"></i>
                              </button>
                            ` : html`
                              <span class="text-muted small">No actions</span>
                            `}
                          </div>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>

        <!-- Bulk Actions -->
        <div class="card shadow-sm mt-4">
          <div class="card-header bg-warning">
            <h6 class="card-title mb-0">
              <i class="bi bi-exclamation-triangle me-2"></i>Bulk Actions
            </h6>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Terminate all sessions for user:</label>
                <div class="input-group">
                  <select class="form-select" id="bulkUserSelect">
                    ${this._getUniqueUsers().map(user => html`
                      <option value="${user}">${user}</option>
                    `)}
                  </select>
                  <button 
                    class="btn btn-danger"
                    @click=${() => {
                      const select = this.renderRoot.querySelector('#bulkUserSelect') || document.getElementById('bulkUserSelect');
                      this._terminateAllUserSessions(select?.value);
                    }}>
                    <i class="bi bi-x-circle me-1"></i>Terminate All
                  </button>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Cleanup expired sessions:</label>
                <button class="btn btn-outline-secondary w-100">
                  <i class="bi bi-trash me-1"></i>Clean Expired Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('session-management', SessionManagement);
