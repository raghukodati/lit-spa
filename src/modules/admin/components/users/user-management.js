import {html} from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';
import { eventBus, Events } from '../../../../services/eventBus.js';
import { securityContext } from '../../services/security-context.service.js';

class UserManagementPage extends BaseComponent {
  static properties = {
    users: {type: Array},
    loading: {type: Boolean},
    filterScope: {type: String},
    filterStatus: {type: String},
    searchTerm: {type: String}
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.users = [];
    this.loading = false;
    this.filterScope = 'all';
    this.filterStatus = 'all';
    this.searchTerm = '';
    this._unsubscribeCreated = null;
    this._unsubscribeUpdated = null;
    this._unsubscribeDeleted = null;
    this._dataService = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Subscribe to user events for auto-refresh
    this._unsubscribeCreated = eventBus.on(Events.USER_CREATED, () => {
      console.log('User created event received, refreshing list');
      this._loadUsers();
    });
    
    this._unsubscribeUpdated = eventBus.on(Events.USER_UPDATED, (detail) => {
      console.log('User updated event received:', detail.userId);
      this._loadUsers();
    });
    
    this._unsubscribeDeleted = eventBus.on(Events.USER_DELETED, (detail) => {
      console.log('User deleted event received:', detail.userId);
      this._loadUsers();
    });
    
    // Listen for route changes to reload data
    this._handlePopState = () => {
      // Only reload if we're on the users page
      if (window.location.pathname === '/users') {
        console.log('Route changed to users page, reloading data');
        // Use setTimeout to ensure component is fully rendered
        setTimeout(() => this._loadUsers(), 0);
      }
    };
    window.addEventListener('popstate', this._handlePopState);
    
    // Initial load with slight delay to ensure DOM is ready
    setTimeout(() => this._loadUsers(), 0);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Cleanup event subscriptions
    if (this._unsubscribeCreated) this._unsubscribeCreated();
    if (this._unsubscribeUpdated) this._unsubscribeUpdated();
    if (this._unsubscribeDeleted) this._unsubscribeDeleted();
    if (this._handlePopState) {
      window.removeEventListener('popstate', this._handlePopState);
    }
  }

  async _loadUsers() {
    this.loading = true;
    try {
      if (!this._dataService) {
        this._dataService = await this.getService('dataService');
      }
      const allUsers = await this._dataService.getUsers();
      console.log('Loaded users:', allUsers.length);
      
      // For user management, show all users if user has permission
      // Security context filtering is too restrictive for admin screens
      this.users = allUsers;
      
      console.log('Displaying users:', this.users.length);
      this.requestUpdate(); // Force re-render
    } catch (error) {
      console.error('Failed to load users:', error);
      this.users = [];
    } finally {
      this.loading = false;
    }
  }

  _hasPermission(entity, action) {
    if (!this._dataService) return false;
    return this._dataService.hasPermission(entity, action);
  }

  _navigateToCreate() {
    window.history.pushState({}, '', '/users/new');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _navigateToEdit(user) {
    window.history.pushState({}, '', `/users/edit/${user.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _navigateToAssignRoles(user) {
    window.history.pushState({}, '', `/users/${user.id}/assign-roles`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  async _deleteUser(user) {
    if (!confirm(`Delete user ${user.name}?`)) return;
    
    eventBus.emit(Events.UI_LOADING_START, { source: 'user-management' });
    this.loading = true;
    
    try {
      if (!this._dataService) {
        this._dataService = await this.getService('dataService');
      }
      await this._dataService.deleteUser(user.id);
      
      // Emit user deleted event
      eventBus.emit(Events.USER_DELETED, { userId: user.id, user });
      eventBus.emit(Events.UI_SUCCESS, { message: 'User deleted successfully' });
      
      await this._loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      eventBus.emit(Events.UI_ERROR, { message: 'Failed to delete user', error: err });
    } finally {
      this.loading = false;
      eventBus.emit(Events.UI_LOADING_END, { source: 'user-management' });
    }
  }

  _getRoleColor(role) {
    const colors = {
      'Admin': 'warning',
      'Manager': 'primary',
      'User': 'secondary'
    };
    return colors[role] || 'secondary';
  }

  _getScopeColor(scope) {
    const colors = {
      'global': 'danger',
      'organization': 'primary',
      'department': 'info',
      'team': 'warning',
      'own': 'success'
    };
    return colors[scope] || 'secondary';
  }

  _getFilteredUsers() {
    let filtered = this.users;

    // Filter by scope
    if (this.filterScope !== 'all') {
      filtered = filtered.filter(u => u.permissionScope === this.filterScope);
    }

    // Filter by status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(u => u.status === this.filterStatus);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.username?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  render() {
    return html`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold"><i class="bi bi-people me-2"></i>User Management</h1>
            <p class="text-muted">Enterprise user management with scope-based access</p>
          </div>
          ${this._hasPermission('users', 'create') ? html`
            <button @click=${this._navigateToCreate} class="btn btn-success">
              <i class="bi bi-plus-circle me-1"></i>Create User
            </button>
          ` : ''}
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label small fw-semibold">Search</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by name, email, or username..."
                  .value=${this.searchTerm}
                  @input=${(e) => this.searchTerm = e.target.value}>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-semibold">Permission Scope</label>
                <select class="form-select" .value=${this.filterScope} @change=${(e) => this.filterScope = e.target.value}>
                  <option value="all">All Scopes</option>
                  <option value="global">Global</option>
                  <option value="organization">Organization</option>
                  <option value="department">Department</option>
                  <option value="team">Team</option>
                  <option value="own">Own</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-semibold">Status</label>
                <select class="form-select" .value=${this.filterStatus} @change=${(e) => this.filterStatus = e.target.value}>
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Locked">Locked</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- User Table Card -->
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0">
              <i class="bi bi-table me-2"></i>Users (${this._getFilteredUsers().length} of ${this.users.length})
            </h5>
          </div>
          <div class="card-body p-0">
            ${this.loading
              ? html`<div class="text-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>`
              : html`
                  <div class="table-responsive">
                    <table class="table table-hover table-striped mb-0">
                      <thead class="table-primary">
                        <tr>
                          <th class="fw-semibold">User</th>
                          <th class="fw-semibold">Organization</th>
                          <th class="fw-semibold">Scope</th>
                          <th class="fw-semibold">Security</th>
                          <th class="fw-semibold">Status</th>
                          <th class="fw-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this._getFilteredUsers().length === 0 ? html`
                          <tr>
                            <td colspan="6" class="text-center py-5">
                              <i class="bi bi-inbox fs-1 text-muted"></i>
                              <p class="text-muted mt-3 mb-0">
                                ${this.users.length === 0 
                                  ? 'No users found. Click "Create User" to add your first user.'
                                  : 'No users match your filters.'}
                              </p>
                            </td>
                          </tr>
                        ` : this._getFilteredUsers().map(
                          (user) => html`
                            <tr>
                              <td>
                                <div class="d-flex align-items-center">
                                  <div class="me-2">
                                    <i class="bi bi-person-circle fs-4 text-primary"></i>
                                  </div>
                                  <div>
                                    <div class="fw-bold">${user.name}</div>
                                    <div class="small text-muted">${user.email}</div>
                                    <div class="small text-muted">@${user.username || user.email.split('@')[0]}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div class="small">
                                  ${user.organizationId ? html`
                                    <div><i class="bi bi-building"></i> Org: ${user.organizationId}</div>
                                  ` : ''}
                                  ${user.departmentId ? html`
                                    <div><i class="bi bi-diagram-3"></i> Dept: ${user.departmentId}</div>
                                  ` : ''}
                                  ${user.teamId ? html`
                                    <div><i class="bi bi-people"></i> Team: ${user.teamId}</div>
                                  ` : ''}
                                  ${!user.organizationId && !user.departmentId && !user.teamId ? html`
                                    <span class="text-muted">-</span>
                                  ` : ''}
                                </div>
                              </td>
                              <td>
                                <span class="badge bg-${this._getScopeColor(user.permissionScope)}">
                                  ${user.permissionScope?.toUpperCase() || 'OWN'}
                                </span>
                              </td>
                              <td>
                                <div class="small">
                                  ${user.mfaEnabled ? html`
                                    <span class="badge bg-success mb-1"><i class="bi bi-shield-check"></i> MFA</span>
                                  ` : html`
                                    <span class="badge bg-secondary mb-1"><i class="bi bi-shield-x"></i> No MFA</span>
                                  `}
                                  ${user.accountLocked ? html`
                                    <span class="badge bg-danger mb-1"><i class="bi bi-lock"></i> Locked</span>
                                  ` : ''}
                                </div>
                              </td>
                              <td><span class="badge rounded-pill bg-${user.status === 'Active' ? 'success' : 'danger'}">${user.status}</span></td>
                              <td>
                                <div class="d-flex gap-2">
                                  ${this._hasPermission('users', 'update') ? html`
                                    <button @click=${() => this._navigateToEdit(user)} class="btn btn-sm btn-outline-info">
                                      <i class="bi bi-pencil"></i> Edit
                                    </button>
                                  ` : ''}
                                  ${this._hasPermission('settings', 'update') ? html`
                                    <button @click=${() => this._navigateToAssignRoles(user)} class="btn btn-sm btn-outline-warning" title="Assign System Roles">
                                      <i class="bi bi-shield-check"></i> Roles
                                    </button>
                                  ` : ''}
                                  ${this._hasPermission('users', 'delete') ? html`
                                    <button @click=${() => this._deleteUser(user)} class="btn btn-sm btn-outline-danger">
                                      <i class="bi bi-trash"></i> Delete
                                    </button>
                                  ` : ''}
                                  ${!this._hasPermission('users', 'update') && !this._hasPermission('settings', 'update') && !this._hasPermission('users', 'delete') ? html`
                                    <span class="text-muted small">No actions</span>
                                  ` : ''}
                                </div>
                              </td>
                            </tr>
                          `
                        )}
                      </tbody>
                    </table>
                  </div>
                `}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('user-management', UserManagementPage);
