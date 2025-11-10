import { LitElement, html } from 'lit';
import { securityContext } from './services/security-context.service.js';
import { initializeSecurity } from './services/security-init.service.js';
import { getUsers } from './services/user.service.js';
import { getRoles } from './services/role.service.js';
import './components/security-demo.js';

class ModuleAdmin extends LitElement {
  static properties = {
    stats: { type: Object },
    securityInitialized: { type: Boolean }
  };

  constructor() {
    super();
    this.stats = {
      totalUsers: 0,
      activeUsers: 0,
      totalRoles: 0,
      totalModules: 7
    };
    this.securityInitialized = false;
  }

  createRenderRoot() { return this; }

  async connectedCallback() {
    super.connectedCallback();
    await this.initializeData();
  }

  async initializeData() {
    try {
      // Initialize security if not already done
      if (!securityContext.isAuthenticated()) {
        this.securityInitialized = await initializeSecurity();
      } else {
        this.securityInitialized = true;
      }

      // Load statistics
      await this.loadStats();
    } catch (error) {
      console.error('Failed to initialize admin module:', error);
    }
  }

  async loadStats() {
    try {
      const users = await getUsers();
      const roles = await getRoles();
      
      this.stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'Active').length,
        totalRoles: roles.length,
        totalModules: 7
      };
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  render() {
    return html`
      <div class="container-fluid py-4">
        <div class="row mb-4">
          <div class="col-12">
            <h1 class="h2 mb-3">
              <i class="bi bi-shield-lock text-danger me-2"></i>System Administration
            </h1>
            <p class="text-muted">Manage users, roles, permissions, and system settings</p>
          </div>
        </div>

        <!-- Security Status Alert -->
        ${this.securityInitialized ? html`
          <div class="row mb-3">
            <div class="col-12">
              <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-shield-check me-2"></i>
                <strong>Security Active:</strong> Enterprise security initialized for ${securityContext.getUser()?.name}
                <span class="badge bg-success ms-2">${securityContext.getUser()?.permissionScope?.toUpperCase()}</span>
                ${securityContext.isAdmin() ? html`<span class="badge bg-danger ms-1">ADMIN</span>` : ''}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
              </div>
            </div>
          </div>
        ` : html`
          <div class="row mb-3">
            <div class="col-12">
              <div class="alert alert-warning" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Security context not initialized. Some features may be restricted.
              </div>
            </div>
          </div>
        `}

        <div class="row g-4">
          <!-- Users Card -->
          <div class="col-md-3">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                    <i class="bi bi-people text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Users</h5>
                    <p class="text-muted small mb-0">User account management</p>
                  </div>
                </div>
                <p class="card-text">Create, edit, and manage user accounts and profiles.</p>
                ${securityContext.can('read', 'User') ? html`
                  <a href="/users" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-arrow-right me-1"></i>Manage Users
                  </a>
                ` : html`
                  <button class="btn btn-outline-secondary btn-sm" disabled>
                    <i class="bi bi-lock me-1"></i>No Access
                  </button>
                `}
              </div>
            </div>
          </div>

          <!-- Roles Card -->
          <div class="col-md-3">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                    <i class="bi bi-shield-check text-success fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Roles</h5>
                    <p class="text-muted small mb-0">Role definitions</p>
                  </div>
                </div>
                <p class="card-text">Define and manage user roles and responsibilities.</p>
                ${securityContext.can('read', 'Role') ? html`
                  <a href="/roles" class="btn btn-outline-success btn-sm">
                    <i class="bi bi-arrow-right me-1"></i>Manage Roles
                  </a>
                ` : html`
                  <button class="btn btn-outline-secondary btn-sm" disabled>
                    <i class="bi bi-lock me-1"></i>No Access
                  </button>
                `}
              </div>
            </div>
          </div>

          <!-- Permissions Card -->
          <div class="col-md-3">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                    <i class="bi bi-gear-wide-connected text-warning fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Permissions</h5>
                    <p class="text-muted small mb-0">Access control</p>
                  </div>
                </div>
                <p class="card-text">Configure permissions and access control rules.</p>
                ${securityContext.can('read', 'Permission') ? html`
                  <div class="d-flex gap-2 flex-wrap">
                    <a href="/permissions" class="btn btn-outline-warning btn-sm">
                      <i class="bi bi-gear me-1"></i>Configure
                    </a>
                    <a href="/permissions/catalog" class="btn btn-outline-primary btn-sm">
                      <i class="bi bi-key me-1"></i>Catalog
                    </a>
                  </div>
                ` : html`
                  <button class="btn btn-outline-secondary btn-sm" disabled>
                    <i class="bi bi-lock me-1"></i>No Access
                  </button>
                `}
              </div>
            </div>
          </div>

          <!-- Security Demo Card -->
          <div class="col-md-3">
            <div class="card h-100 shadow-sm border-info">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                    <i class="bi bi-shield-lock-fill text-info fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Security Demo</h5>
                    <p class="text-muted small mb-0">Test security features</p>
                  </div>
                </div>
                <p class="card-text">Interactive demo of enterprise security features.</p>
                <a href="/admin/security-demo" class="btn btn-outline-info btn-sm">
                  <i class="bi bi-play-circle me-1"></i>View Demo
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Management Section -->
        ${this.securityInitialized ? html`
          <div class="row mt-4">
            <div class="col-12 mb-3">
              <h5 class="fw-bold">
                <i class="bi bi-shield-lock me-2 text-danger"></i>Security Management
              </h5>
            </div>

            <!-- Audit Log Card -->
            <div class="col-md-3">
              <div class="card h-100 shadow-sm border-danger">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                      <i class="bi bi-clock-history text-danger fs-4"></i>
                    </div>
                    <div>
                      <h5 class="card-title mb-0">Audit Log</h5>
                      <p class="text-muted small mb-0">Security trail</p>
                    </div>
                  </div>
                  <p class="card-text">View complete audit trail of all security events.</p>
                  ${securityContext.can('read', 'SecurityLog') ? html`
                    <a href="/security/audit-log" class="btn btn-outline-danger btn-sm">
                      <i class="bi bi-search me-1"></i>View Logs
                    </a>
                  ` : html`
                    <button class="btn btn-outline-secondary btn-sm" disabled>
                      <i class="bi bi-lock me-1"></i>No Access
                    </button>
                  `}
                </div>
              </div>
            </div>

            <!-- Security Settings Card -->
            <div class="col-md-3">
              <div class="card h-100 shadow-sm border-warning">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                      <i class="bi bi-gear-wide-connected text-warning fs-4"></i>
                    </div>
                    <div>
                      <h5 class="card-title mb-0">Settings</h5>
                      <p class="text-muted small mb-0">Security config</p>
                    </div>
                  </div>
                  <p class="card-text">Configure password policy, MFA, and security rules.</p>
                  ${securityContext.isAdmin() ? html`
                    <a href="/security/settings" class="btn btn-outline-warning btn-sm">
                      <i class="bi bi-gear me-1"></i>Configure
                    </a>
                  ` : html`
                    <button class="btn btn-outline-secondary btn-sm" disabled>
                      <i class="bi bi-lock me-1"></i>Admin Only
                    </button>
                  `}
                </div>
              </div>
            </div>

            <!-- User Activity Card -->
            <div class="col-md-3">
              <div class="card h-100 shadow-sm border-info">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                      <i class="bi bi-activity text-info fs-4"></i>
                    </div>
                    <div>
                      <h5 class="card-title mb-0">Activity</h5>
                      <p class="text-muted small mb-0">Live monitoring</p>
                    </div>
                  </div>
                  <p class="card-text">Monitor real-time user activities and actions.</p>
                  ${securityContext.can('read', 'UserActivity') ? html`
                    <a href="/security/activity" class="btn btn-outline-info btn-sm">
                      <i class="bi bi-eye me-1"></i>Monitor
                    </a>
                  ` : html`
                    <button class="btn btn-outline-secondary btn-sm" disabled>
                      <i class="bi bi-lock me-1"></i>No Access
                    </button>
                  `}
                </div>
              </div>
            </div>

            <!-- Session Management Card -->
            <div class="col-md-3">
              <div class="card h-100 shadow-sm border-success">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                      <i class="bi bi-pc-display text-success fs-4"></i>
                    </div>
                    <div>
                      <h5 class="card-title mb-0">Sessions</h5>
                      <p class="text-muted small mb-0">Active users</p>
                    </div>
                  </div>
                  <p class="card-text">Manage active user sessions and force logout.</p>
                  ${securityContext.isAdmin() ? html`
                    <a href="/security/sessions" class="btn btn-outline-success btn-sm">
                      <i class="bi bi-people me-1"></i>Manage
                    </a>
                  ` : html`
                    <button class="btn btn-outline-secondary btn-sm" disabled>
                      <i class="bi bi-lock me-1"></i>Admin Only
                    </button>
                  `}
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Quick Stats Row -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-header bg-light">
                <h6 class="mb-0">
                  <i class="bi bi-speedometer2 text-danger me-2"></i>System Statistics
                </h6>
              </div>
              <div class="card-body">
                <div class="row text-center">
                  <div class="col-md-3">
                    <div class="p-3">
                      <i class="bi bi-people fs-1 text-primary mb-2"></i>
                      <h3 class="mb-0">${this.stats.totalUsers}</h3>
                      <p class="text-muted mb-0">Total Users</p>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="p-3">
                      <i class="bi bi-person-check fs-1 text-success mb-2"></i>
                      <h3 class="mb-0">${this.stats.activeUsers}</h3>
                      <p class="text-muted mb-0">Active Users</p>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="p-3">
                      <i class="bi bi-shield-check fs-1 text-warning mb-2"></i>
                      <h3 class="mb-0">${this.stats.totalRoles}</h3>
                      <p class="text-muted mb-0">Roles Defined</p>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="p-3">
                      <i class="bi bi-key fs-1 text-danger mb-2"></i>
                      <h3 class="mb-0">${securityContext.isAuthenticated() ? '18' : '0'}</h3>
                      <p class="text-muted mb-0">Permissions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Audit Log -->
        ${this.securityInitialized ? html`
          <div class="row mt-4">
            <div class="col-12">
              <div class="card shadow-sm border-info">
                <div class="card-header bg-light">
                  <div class="d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">
                      <i class="bi bi-shield-lock text-info me-2"></i>Security Audit Log (Last 5)
                    </h6>
                    <a href="/admin/security-demo" class="btn btn-sm btn-outline-info">
                      View Full Demo <i class="bi bi-arrow-right"></i>
                    </a>
                  </div>
                </div>
                <div class="card-body">
                  ${this.renderAuditLog()}
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Recent Activity -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-header bg-light">
                <h6 class="mb-0">
                  <i class="bi bi-clock-history text-primary me-2"></i>Recent Activity
                </h6>
              </div>
              <div class="card-body">
                <div class="list-group list-group-flush">
                  <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <i class="bi bi-person-plus text-success me-2"></i>
                        <strong>New user created:</strong> CRM Specialist
                      </div>
                      <small class="text-muted">2 hours ago</small>
                    </div>
                  </div>
                  <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <i class="bi bi-shield-check text-primary me-2"></i>
                        <strong>Role updated:</strong> Manager permissions modified
                      </div>
                      <small class="text-muted">5 hours ago</small>
                    </div>
                  </div>
                  <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <i class="bi bi-person-dash text-warning me-2"></i>
                        <strong>User status changed:</strong> User deactivated
                      </div>
                      <small class="text-muted">1 day ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAuditLog() {
    if (!securityContext.isAuthenticated()) {
      return html`<p class="text-muted">Security not initialized</p>`;
    }

    const auditLog = securityContext.getAuditLog(5);

    if (auditLog.length === 0) {
      return html`<p class="text-muted">No audit entries yet</p>`;
    }

    return html`
      <div class="table-responsive">
        <table class="table table-sm table-hover mb-0">
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
              <th>User</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${auditLog.map(entry => html`
              <tr>
                <td><small>${new Date(entry.timestamp).toLocaleTimeString()}</small></td>
                <td><span class="badge bg-info">${entry.event}</span></td>
                <td>${entry.username || 'System'}</td>
                <td><small class="text-muted">${JSON.stringify(entry.details).substring(0, 50)}...</small></td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }
}

customElements.define('module-admin', ModuleAdmin);
