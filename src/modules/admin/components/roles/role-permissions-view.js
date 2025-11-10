/**
 * Role Permissions View Component (V2)
 * Synced with new permission catalog structure
 */

import { html } from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';
import permissionsData from '../../../../mocks/permissions.json';

class RolePermissionsViewPage extends BaseComponent {
  static properties = {
    roleId: { type: String },
    role: { type: Object },
    permissions: { type: Array },
    loading: { type: Boolean },
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.roleId = null;
    this.role = null;
    this.permissions = [];
    this.loading = false;
    this._dataService = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    const path = window.location.pathname;
    const match = path.match(/\/roles\/(\d+)\/permissions/);
    if (match) {
      this.roleId = match[1];
      await this._loadData();
    }
  }

  async _loadData() {
    if (!this.can('settings', 'read')) {
      alert('You do not have permission to view role details');
      this._handleBack();
      return;
    }
    
    this.loading = true;
    
    try {
      // Load role and permissions
      this._dataService = await this.getService('dataService');
      this.role = await this._dataService.getRoleById(parseInt(this.roleId));
      this.permissions = permissionsData;  // Use imported data
      console.log('Loaded permissions:', this.permissions.length);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      this.loading = false;
    }
  }

  _handleBack() {
    window.history.pushState({}, '', '/roles');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _handleEdit() {
    if (!this.can('settings', 'update')) {
      alert('You do not have permission to edit roles');
      return;
    }
    
    window.history.pushState({}, '', `/roles/edit/${this.roleId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _getRolePermissions() {
    if (!this.role?.permissions) return [];
    
    const rolePerms = [];
    
    // Map role permissions to actual permission objects
    Object.entries(this.role.permissions).forEach(([entity, actions]) => {
      actions.forEach(action => {
        // Find matching permissions in catalog
        const matches = this.permissions.filter(p => 
          p.entity === entity && (p.action === action || action === 'manage')
        );
        rolePerms.push(...matches);
      });
    });
    
    return rolePerms;
  }

  _getPermissionsByModule() {
    const rolePerms = this._getRolePermissions();
    const byModule = {};
    
    rolePerms.forEach(perm => {
      if (!byModule[perm.module]) {
        byModule[perm.module] = [];
      }
      byModule[perm.module].push(perm);
    });
    
    return byModule;
  }

  _getModules() {
    const byModule = this._getPermissionsByModule();
    return Object.keys(byModule).sort();
  }

  _getLevelColor(level) {
    const colors = {
      'app': 'danger',
      'module': 'warning',
      'entity': 'primary',
      'field': 'info',
      'record': 'success'
    };
    return colors[level] || 'secondary';
  }

  _getRiskColor(risk) {
    const colors = {
      'low': 'success',
      'medium': 'warning',
      'high': 'danger',
      'critical': 'dark'
    };
    return colors[risk] || 'secondary';
  }

  render() {
    if (this.loading) {
      return html`
        <div class="text-center p-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading role permissions...</p>
        </div>
      `;
    }

    if (!this.role) {
      return html`
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Role not found
        </div>
      `;
    }

    const rolePerms = this._getRolePermissions();
    const byModule = this._getPermissionsByModule();
    const modules = this._getModules();

    return html`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-shield-lock me-2"></i>Role Permissions
            </h1>
            <p class="text-muted">Viewing permissions for: <strong>${this.role.name}</strong></p>
          </div>
          <div class="d-flex gap-2">
            <button @click=${this._handleEdit} class="btn btn-primary">
              <i class="bi bi-pencil me-1"></i>Edit Role
            </button>
            <button @click=${this._handleBack} class="btn btn-secondary">
              <i class="bi bi-arrow-left me-1"></i>Back to Roles
            </button>
          </div>
        </div>

        <!-- Role Info Card -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <small class="text-muted">Role Name</small>
                <p class="mb-0 fw-bold fs-5">${this.role.name}</p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Category</small>
                <p class="mb-0">
                  <span class="badge bg-${this.role.category === 'system' ? 'danger' : 'primary'}">${this.role.category}</span>
                </p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Data Scope</small>
                <p class="mb-0">
                  <span class="badge bg-info">${this.role.dataScope || 'global'}</span>
                </p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Total Permissions</small>
                <p class="mb-0">
                  <span class="badge bg-success fs-6">${rolePerms.length}</span>
                </p>
              </div>
            </div>
            <hr class="my-3">
            <small class="text-muted">Description</small>
            <p class="mb-0">${this.role.description}</p>
          </div>
        </div>

        <!-- Module Statistics -->
        <div class="row mb-4">
          ${modules.map(module => html`
            <div class="col-md-3 mb-3">
              <div class="card border-primary h-100">
                <div class="card-body text-center">
                  <h6 class="text-uppercase text-muted small">${module}</h6>
                  <h3 class="mb-0 text-primary">${byModule[module].length}</h3>
                  <small class="text-muted">permissions</small>
                </div>
              </div>
            </div>
          `)}
        </div>

        <!-- Permissions by Module -->
        ${modules.map(module => html`
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-box me-2"></i>${module.toUpperCase()} Module Permissions
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th style="width: 25%">Permission</th>
                      <th style="width: 15%">Entity</th>
                      <th style="width: 10%">Action</th>
                      <th style="width: 10%">Level</th>
                      <th style="width: 10%">Scope</th>
                      <th style="width: 10%">Risk</th>
                      <th style="width: 20%">Requirements</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${byModule[module].map(perm => html`
                      <tr>
                        <td>
                          <div class="fw-bold">${perm.name}</div>
                          <small class="text-muted"><code>${perm.code}</code></small>
                        </td>
                        <td>
                          <span class="badge bg-secondary">${perm.entity}</span>
                        </td>
                        <td>
                          <span class="badge bg-info">${perm.action}</span>
                        </td>
                        <td>
                          <span class="badge bg-${this._getLevelColor(perm.level)}">${perm.level}</span>
                        </td>
                        <td>
                          <span class="badge bg-primary">${perm.scope}</span>
                        </td>
                        <td>
                          <span class="badge bg-${this._getRiskColor(perm.riskLevel)}">${perm.riskLevel}</span>
                        </td>
                        <td>
                          <div class="d-flex flex-wrap gap-1">
                            ${perm.requiresMfa ? html`<span class="badge bg-warning" title="Requires MFA"><i class="bi bi-shield-lock"></i></span>` : ''}
                            ${perm.requiresApproval ? html`<span class="badge bg-info" title="Requires Approval"><i class="bi bi-check-circle"></i></span>` : ''}
                            ${perm.auditLog ? html`<span class="badge bg-secondary" title="Audit Logged"><i class="bi bi-clock-history"></i></span>` : ''}
                          </div>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `)}

        <!-- Raw Role Permissions (Debug) -->
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h6 class="card-title mb-0">
              <i class="bi bi-code-square me-2"></i>Role Permission Structure
            </h6>
          </div>
          <div class="card-body">
            <pre class="mb-0 small bg-light p-3 rounded"><code>${JSON.stringify(this.role.permissions, null, 2)}</code></pre>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('role-permissions-view', RolePermissionsViewPage);
