import {html} from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';
import { securityContext } from '../../services/security-context.service.js';

class RoleManagementPage extends BaseComponent {
  static properties = {
    roles: {type: Array},
    loading: {type: Boolean},
    filterCategory: {type: String},
    searchTerm: {type: String}
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.roles = [];
    this.loading = false;
    this.filterCategory = 'all';
    this.searchTerm = '';
    this._dataService = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadRoles();
    
    // Listen for route changes to reload data
    this._handlePopState = () => {
      if (window.location.pathname === '/roles') {
        console.log('Route changed to roles page, reloading data');
        this._loadRoles();
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

  async _loadRoles() {
    this.loading = true;
    if (!this._dataService) {
      this._dataService = await this.getService('dataService');
    }
    this.roles = await this._dataService.getRoles();
    this.loading = false;
  }

  _hasPermission(entity, action) {
    if (!this._dataService) return false;
    return this._dataService.hasPermission(entity, action);
  }

  _navigateToCreate() {
    window.history.pushState({}, '', '/roles/new');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _navigateToEdit(role) {
    window.history.pushState({}, '', `/roles/edit/${role.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  async _deleteRole(role) {
    if (role.isSystemRole) {
      alert('Cannot delete system roles');
      return;
    }
    
    if (!confirm(`Delete role ${role.name}?`)) return;
    
    this.loading = true;
    if (!this._dataService) {
      this._dataService = await this.getService('dataService');
    }
    await this._dataService.deleteRole(role.id);
    await this._loadRoles();
    this.loading = false;
  }

  _getPermissionSummary(role) {
    if (!role.permissions || typeof role.permissions !== 'object') {
      return html`<span class="text-muted">No permissions</span>`;
    }
    
    const totalPerms = Object.values(role.permissions).reduce((sum, perms) => sum + perms.length, 0);
    const entityCount = Object.keys(role.permissions).filter(key => role.permissions[key].length > 0).length;
    
    return html`
      <div class="d-flex flex-wrap gap-1">
        <span class="badge bg-primary">${totalPerms} permissions</span>
        <span class="badge bg-info">${entityCount} entities</span>
        ${role.inheritPermissions ? html`<span class="badge bg-warning"><i class="bi bi-arrow-down"></i> Inherits</span>` : ''}
      </div>
    `;
  }

  _getCategoryColor(category) {
    const colors = {
      'system': 'danger',
      'admin': 'warning',
      'custom': 'info'
    };
    return colors[category] || 'secondary';
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

  _getFilteredRoles() {
    let filtered = this.roles;

    // Filter by category
    if (this.filterCategory !== 'all') {
      filtered = filtered.filter(r => r.category === this.filterCategory);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.name?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term)
      );
    }

    // Sort by priority
    return filtered.sort((a, b) => (a.priority || 999) - (b.priority || 999));
  }

  _getParentRoleName(parentId) {
    const parent = this.roles.find(r => r.id === parentId);
    return parent ? parent.name : 'Unknown';
  }

  _navigateToViewPermissions(role) {
    window.history.pushState({}, '', `/roles/${role.id}/permissions`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    return html`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold"><i class="bi bi-shield-check me-2"></i>Role Management</h1>
            <p class="text-muted">Enterprise role management with hierarchy and scopes</p>
          </div>
          ${this._hasPermission('settings', 'create') ? html`
            <button @click=${this._navigateToCreate} class="btn btn-success">
              <i class="bi bi-plus-circle me-1"></i>Create Role
            </button>
          ` : ''}
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Search</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by role name or description..."
                  .value=${this.searchTerm}
                  @input=${(e) => this.searchTerm = e.target.value}>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Category</label>
                <select class="form-select" .value=${this.filterCategory} @change=${(e) => this.filterCategory = e.target.value}>
                  <option value="all">All Categories</option>
                  <option value="system">System</option>
                  <option value="admin">Admin</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Roles Table Card -->
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0">
              <i class="bi bi-table me-2"></i>Roles (${this._getFilteredRoles().length} of ${this.roles.length})
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
                          <th class="fw-semibold">Role</th>
                          <th class="fw-semibold">Hierarchy</th>
                          <th class="fw-semibold">Scope & Security</th>
                          <th class="fw-semibold">Permissions</th>
                          <th class="fw-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this._getFilteredRoles().map(
                          (role) => html`
                            <tr>
                              <td>
                                <div class="d-flex align-items-center">
                                  <div class="me-2">
                                    <i class="bi bi-shield-${role.isSystemRole ? 'lock' : 'check'} fs-4 text-${role.isSystemRole ? 'danger' : 'primary'}"></i>
                                  </div>
                                  <div>
                                    <div class="fw-bold">${role.name}</div>
                                    <div class="small text-muted">${role.description}</div>
                                    <div class="mt-1">
                                      <span class="badge bg-${this._getCategoryColor(role.category)}">${role.category}</span>
                                      ${role.isSystemRole ? html`<span class="badge bg-danger"><i class="bi bi-lock"></i> System</span>` : ''}
                                      <span class="badge bg-secondary">Priority: ${role.priority}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div class="small">
                                  ${role.parentRoleId ? html`
                                    <div class="mb-1">
                                      <i class="bi bi-arrow-up-circle text-primary"></i>
                                      <span class="text-muted">Parent:</span>
                                      <strong>${this._getParentRoleName(role.parentRoleId)}</strong>
                                    </div>
                                  ` : html`
                                    <div class="text-muted"><i class="bi bi-circle"></i> Root Role</div>
                                  `}
                                  ${Object.keys(role.fieldPermissions || {}).length > 0 ? html`
                                    <div><span class="badge bg-info"><i class="bi bi-eye"></i> Field Perms</span></div>
                                  ` : ''}
                                </div>
                              </td>
                              <td>
                                <div class="small">
                                  <div class="mb-1">
                                    <span class="badge bg-${this._getScopeColor(role.dataScope)}">
                                      ${role.dataScope?.toUpperCase() || 'OWN'}
                                    </span>
                                  </div>
                                  ${role.constraints?.maxRecords ? html`
                                    <div><i class="bi bi-graph-down"></i> Max: ${role.constraints.maxRecords}</div>
                                  ` : ''}
                                  ${role.constraints?.ipRestrictions?.length ? html`
                                    <div><i class="bi bi-shield-lock"></i> IP Restricted</div>
                                  ` : ''}
                                  ${role.expiresAt ? html`
                                    <div><i class="bi bi-clock"></i> Expires: ${new Date(role.expiresAt).toLocaleDateString()}</div>
                                  ` : ''}
                                </div>
                              </td>
                              <td>${this._getPermissionSummary(role)}</td>
                              <td>
                                <div class="d-flex gap-1">
                                  ${this._hasPermission('settings', 'read') ? html`
                                    <button @click=${() => this._navigateToViewPermissions(role)} class="btn btn-sm btn-outline-secondary" title="View Permissions">
                                      <i class="bi bi-eye"></i>
                                    </button>
                                  ` : ''}
                                  ${this._hasPermission('settings', 'update') ? html`
                                    <button @click=${() => this._navigateToEdit(role)} class="btn btn-sm btn-outline-info" title="Edit Role">
                                      <i class="bi bi-pencil"></i>
                                    </button>
                                  ` : ''}
                                  ${this._hasPermission('settings', 'delete') && !role.isSystemRole ? html`
                                    <button @click=${() => this._deleteRole(role)} class="btn btn-sm btn-outline-danger" title="Delete Role">
                                      <i class="bi bi-trash"></i>
                                    </button>
                                  ` : ''}
                                  ${role.isSystemRole ? html`
                                    <span class="badge bg-secondary" title="System role cannot be deleted">
                                      <i class="bi bi-lock"></i> Protected
                                    </span>
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

customElements.define('role-management', RoleManagementPage);
