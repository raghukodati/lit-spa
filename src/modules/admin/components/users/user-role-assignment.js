import {html} from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';

class UserRoleAssignmentPage extends BaseComponent {
  static properties = {
    userId: {type: String},
    user: {type: Object},
    roles: {type: Array},
    selectedRoles: {type: Array},
    loading: {type: Boolean},
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.userId = null;
    this.user = null;
    this.roles = [];
    this.selectedRoles = [];
    this.loading = false;
    this._dataService = null;
  }

  connectedCallback() {
    super.connectedCallback();
    // Extract userId from URL
    const path = window.location.pathname;
    const match = path.match(/\/users\/(\d+)\/assign-roles/);
    if (match) {
      this.userId = match[1];
      this._loadData();
    }
  }

  async _loadData() {
    this.loading = true;
    
    if (!this._dataService) {
      this._dataService = await this.getService('dataService');
    }
    
    // Load user and roles in parallel
    const [user, roles] = await Promise.all([
      this._dataService.getUserById(parseInt(this.userId)),
      this._dataService.getRoles()
    ]);
    
    this.user = user;
    this.roles = roles;
    this.selectedRoles = user?.assignedRoles || [];
    
    this.loading = false;
  }

  _toggleRole(roleId) {
    if (this.selectedRoles.includes(roleId)) {
      this.selectedRoles = this.selectedRoles.filter(id => id !== roleId);
    } else {
      this.selectedRoles = [...this.selectedRoles, roleId];
    }
  }

  _getPermissionSummary(permissions) {
    if (!permissions || typeof permissions !== 'object') {
      return html`<span class="text-muted small">No permissions</span>`;
    }
    
    const totalPerms = Object.values(permissions).reduce((sum, perms) => sum + perms.length, 0);
    const entityCount = Object.keys(permissions).filter(key => permissions[key].length > 0).length;
    
    return html`
      <div class="d-flex flex-wrap gap-1">
        <span class="badge bg-primary">${totalPerms} permissions</span>
        <span class="badge bg-info">${entityCount} entities</span>
      </div>
    `;
  }

  async _handleSave() {
    // Check permission
    if (!this.can('settings', 'update')) {
      alert('You do not have permission to assign roles');
      return;
    }
    
    this.loading = true;
    
    try {
      if (!this._dataService) {
        this._dataService = await this.getService('dataService');
      }
      await this._dataService.assignRolesToUser(parseInt(this.userId), this.selectedRoles);
      
      // Navigate back to users list
      window.history.pushState({}, '', '/users');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      console.error('Error assigning roles:', err);
    } finally {
      this.loading = false;
    }
  }

  _handleCancel() {
    window.history.pushState({}, '', '/users');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    if (this.loading && !this.user) {
      return html`
        <div class="text-center p-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading user and roles...</p>
        </div>
      `;
    }

    if (!this.user) {
      return html`
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          User not found
        </div>
      `;
    }

    return html`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-shield-check me-2"></i>Assign Roles to User
            </h1>
            <p class="text-muted">
              Assigning roles for: <strong>${this.user.name}</strong> (${this.user.email})
            </p>
          </div>
          <button @click=${this._handleCancel} class="btn btn-secondary">
            <i class="bi bi-arrow-left me-1"></i>Back to Users
          </button>
        </div>

        <!-- User Info Card -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <small class="text-muted">User Name</small>
                <p class="mb-0 fw-bold">${this.user.name}</p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Email</small>
                <p class="mb-0">${this.user.email}</p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Primary Role</small>
                <p class="mb-0"><span class="badge bg-${this._getRoleColor(this.user.role)}">${this.user.role}</span></p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Status</small>
                <p class="mb-0"><span class="badge bg-${this.user.status === 'Active' ? 'success' : 'danger'}">${this.user.status}</span></p>
              </div>
            </div>
          </div>
        </div>

        <!-- Role Assignment Card -->
        <div class="card shadow-sm">
          <div class="card-header bg-white">
            <h5 class="card-title mb-0">
              <i class="bi bi-shield-lock me-2"></i>Available Roles
            </h5>
          </div>
          <div class="card-body">
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              Select one or more roles to assign to this user. Users can have multiple roles with combined permissions.
            </div>
            
            <div class="row g-3">
              ${this.roles.map(role => html`
                <div class="col-md-6">
                  <div class="card h-100 ${this.selectedRoles.includes(role.id) ? 'border-warning border-2 bg-light' : ''}">
                    <div class="card-body">
                      <div class="form-check">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="role-${role.id}"
                          .checked=${this.selectedRoles.includes(role.id)}
                          @change=${() => this._toggleRole(role.id)}
                        >
                        <label class="form-check-label w-100" for="role-${role.id}">
                          <div class="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 class="mb-1">
                                <i class="bi bi-shield-check me-1 text-warning"></i>${role.name}
                              </h6>
                              <p class="text-muted small mb-2">${role.description}</p>
                            </div>
                            ${this.selectedRoles.includes(role.id) ? html`
                              <span class="badge bg-success">
                                <i class="bi bi-check-lg"></i> Assigned
                              </span>
                            ` : ''}
                          </div>
                          <div class="mt-2">
                            ${this._getPermissionSummary(role.permissions)}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              `)}
            </div>

            <!-- Summary -->
            <div class="mt-4 p-3 bg-light rounded">
              <h6 class="mb-2">
                <i class="bi bi-list-check me-2"></i>Assignment Summary
              </h6>
              <p class="mb-2">
                <strong>${this.selectedRoles.length}</strong> role(s) selected
              </p>
              ${this.selectedRoles.length > 0 ? html`
                <div class="d-flex flex-wrap gap-2">
                  ${this.selectedRoles.map(roleId => {
                    const role = this.roles.find(r => r.id === roleId);
                    return role ? html`
                      <span class="badge bg-warning text-dark">
                        <i class="bi bi-shield-check me-1"></i>${role.name}
                      </span>
                    ` : '';
                  })}
                </div>
              ` : html`
                <p class="text-muted mb-0">No roles selected</p>
              `}
            </div>

            <!-- Action Buttons -->
            <div class="d-flex gap-2 mt-4 pt-3 border-top">
              <button 
                @click=${this._handleSave} 
                class="btn btn-warning btn-lg flex-fill" 
                ?disabled=${this.loading}
              >
                ${this.loading 
                  ? html`<span class="spinner-border spinner-border-sm me-2"></span>Saving...` 
                  : html`<i class="bi bi-check-circle me-2"></i>Save Role Assignment`}
              </button>
              <button 
                type="button" 
                class="btn btn-outline-secondary btn-lg" 
                @click=${this._handleCancel}
              >
                <i class="bi bi-x-circle me-1"></i>Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _getRoleColor(role) {
    const colors = {
      'Admin': 'warning',
      'Manager': 'primary',
      'User': 'secondary'
    };
    return colors[role] || 'secondary';
  }
}

customElements.define('user-role-assignment', UserRoleAssignmentPage);
