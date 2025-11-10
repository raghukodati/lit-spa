/**
 * Permission Browser Component (Unified)
 * Combines the best features from Permission Management and Permission Catalog
 * - Statistics dashboard
 * - Permission groups
 * - Advanced filtering
 * - Comprehensive table view
 */

import { html } from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';
import { securityContext } from '../../services/security-context.service.js';
import permissionsData from '../../../../mocks/permissions.json';
import permissionGroupsData from '../../../../mocks/permission-groups.json';

class PermissionBrowser extends BaseComponent {
  static properties = {
    permissions: { type: Array },
    permissionGroups: { type: Array },
    loading: { type: Boolean },
    
    // Filters
    searchTerm: { type: String },
    filterModule: { type: String },
    filterCategory: { type: String },
    filterLevel: { type: String },
    filterRisk: { type: String },
    selectedGroup: { type: String },
    
    // View options
    showStatistics: { type: Boolean },
    viewMode: { type: String }
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.permissions = [];
    this.permissionGroups = [];
    this.loading = false;
    this.filterModule = 'all';
    this.filterCategory = 'all';
    this.filterLevel = 'all';
    this.filterRisk = 'all';
    this.searchTerm = '';
    this.selectedGroup = 'all';
    this.showStatistics = true;
    this.viewMode = 'detailed'; // 'compact' | 'detailed'
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadPermissions();
    
    // Listen for route changes to reload data
    this._handlePopState = () => {
      if (window.location.pathname === '/permissions') {
        console.log('Route changed to permissions page, reloading data');
        this.loadPermissions();
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

  async loadPermissions() {
    this.loading = true;
    try {
      this.permissions = permissionsData;
      this.permissionGroups = permissionGroupsData;
      console.log('Loaded permissions:', this.permissions.length);
      console.log('Loaded permission groups:', this.permissionGroups.length);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    } finally {
      this.loading = false;
    }
  }

  _getModules() {
    return [...new Set(this.permissions.map(p => p.module))].sort();
  }

  _getCategories() {
    return [...new Set(this.permissions.map(p => p.category))].sort();
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

  _getCategoryColor(category) {
    const colors = {
      'security': 'danger',
      'data': 'primary',
      'reports': 'info',
      'system': 'warning'
    };
    return colors[category] || 'secondary';
  }

  _getFilteredPermissions() {
    let filtered = this.permissions;

    // Filter by group
    if (this.selectedGroup !== 'all') {
      const group = this.permissionGroups.find(g => g.id === this.selectedGroup);
      if (group && group.permissions) {
        filtered = filtered.filter(p => group.permissions.includes(p.id));
      }
    }

    // Filter by module
    if (this.filterModule !== 'all') {
      filtered = filtered.filter(p => p.module === this.filterModule);
    }

    // Filter by category
    if (this.filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.filterCategory);
    }

    // Filter by level
    if (this.filterLevel !== 'all') {
      filtered = filtered.filter(p => p.level === this.filterLevel);
    }

    // Filter by risk
    if (this.filterRisk !== 'all') {
      filtered = filtered.filter(p => p.riskLevel === this.filterRisk);
    }

    // Search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.entity.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  _getStatistics() {
    return {
      total: this.permissions.length,
      byModule: this._getModules().reduce((acc, module) => {
        acc[module] = this.permissions.filter(p => p.module === module).length;
        return acc;
      }, {}),
      byRisk: {
        low: this.permissions.filter(p => p.riskLevel === 'low').length,
        medium: this.permissions.filter(p => p.riskLevel === 'medium').length,
        high: this.permissions.filter(p => p.riskLevel === 'high').length,
        critical: this.permissions.filter(p => p.riskLevel === 'critical').length
      },
      byLevel: {
        app: this.permissions.filter(p => p.level === 'app').length,
        module: this.permissions.filter(p => p.level === 'module').length,
        entity: this.permissions.filter(p => p.level === 'entity').length,
        field: this.permissions.filter(p => p.level === 'field').length,
        record: this.permissions.filter(p => p.level === 'record').length
      },
      requireMfa: this.permissions.filter(p => p.requiresMfa).length,
      requireApproval: this.permissions.filter(p => p.requiresApproval).length,
      auditLogged: this.permissions.filter(p => p.auditLog).length
    };
  }

  _clearFilters() {
    this.searchTerm = '';
    this.filterModule = 'all';
    this.filterCategory = 'all';
    this.filterLevel = 'all';
    this.filterRisk = 'all';
    this.selectedGroup = 'all';
  }

  _renderStatistics() {
    const stats = this._getStatistics();
    const modules = this._getModules();

    return html`
      <!-- Top Statistics Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card border-primary h-100">
            <div class="card-body text-center">
              <i class="bi bi-key fs-1 text-primary"></i>
              <h3 class="mt-2">${stats.total}</h3>
              <p class="text-muted mb-0">Total Permissions</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-success h-100">
            <div class="card-body text-center">
              <i class="bi bi-shield-check fs-1 text-success"></i>
              <h3 class="mt-2">${stats.requireMfa}</h3>
              <p class="text-muted mb-0">Require MFA</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-warning h-100">
            <div class="card-body text-center">
              <i class="bi bi-check-circle fs-1 text-warning"></i>
              <h3 class="mt-2">${stats.requireApproval}</h3>
              <p class="text-muted mb-0">Require Approval</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-info h-100">
            <div class="card-body text-center">
              <i class="bi bi-clock-history fs-1 text-info"></i>
              <h3 class="mt-2">${stats.auditLogged}</h3>
              <p class="text-muted mb-0">Audit Logged</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h6 class="card-title mb-0">
                <i class="bi bi-exclamation-triangle me-2"></i>Risk Level Distribution
              </h6>
            </div>
            <div class="card-body">
              <div class="row g-2">
                <div class="col-3 text-center">
                  <div class="badge bg-success fs-5">${stats.byRisk.low}</div>
                  <div class="small text-muted mt-1">Low</div>
                </div>
                <div class="col-3 text-center">
                  <div class="badge bg-warning fs-5">${stats.byRisk.medium}</div>
                  <div class="small text-muted mt-1">Medium</div>
                </div>
                <div class="col-3 text-center">
                  <div class="badge bg-danger fs-5">${stats.byRisk.high}</div>
                  <div class="small text-muted mt-1">High</div>
                </div>
                <div class="col-3 text-center">
                  <div class="badge bg-dark fs-5">${stats.byRisk.critical}</div>
                  <div class="small text-muted mt-1">Critical</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h6 class="card-title mb-0">
                <i class="bi bi-box me-2"></i>Module Distribution
              </h6>
            </div>
            <div class="card-body">
              <div class="d-flex flex-wrap gap-2">
                ${modules.map(module => html`
                  <span class="badge bg-primary">
                    ${module}: ${stats.byModule[module]}
                  </span>
                `)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _renderFilters() {
    const modules = this._getModules();
    const categories = this._getCategories();

    return html`
      <!-- Permission Groups -->
      <div class="card shadow-sm mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-semibold mb-0">
              <i class="bi bi-collection me-2"></i>Permission Groups
            </h6>
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click=${() => this.selectedGroup = 'all'}
              ?disabled=${this.selectedGroup === 'all'}>
              <i class="bi bi-x-circle me-1"></i>Clear Group
            </button>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <button 
              class="btn btn-sm ${this.selectedGroup === 'all' ? 'btn-primary' : 'btn-outline-primary'}"
              @click=${() => this.selectedGroup = 'all'}>
              <i class="bi bi-grid-3x3"></i> All (${this.permissions.length})
            </button>
            ${this.permissionGroups.map(group => html`
              <button 
                class="btn btn-sm ${this.selectedGroup === group.id ? 'btn-primary' : 'btn-outline-primary'}"
                @click=${() => this.selectedGroup = group.id}>
                <i class="bi bi-${group.icon || 'folder'}"></i> ${group.name} (${group.permissions?.length || 0})
              </button>
            `)}
          </div>
        </div>
      </div>

      <!-- Advanced Filters -->
      <div class="card shadow-sm mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-semibold mb-0">
              <i class="bi bi-funnel me-2"></i>Filters
            </h6>
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click=${this._clearFilters}>
              <i class="bi bi-x-circle me-1"></i>Clear All
            </button>
          </div>
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label small fw-semibold">Search</label>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search permissions..."
                .value=${this.searchTerm}
                @input=${(e) => this.searchTerm = e.target.value}>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">Module</label>
              <select class="form-select" .value=${this.filterModule} @change=${(e) => this.filterModule = e.target.value}>
                <option value="all">All Modules</option>
                ${modules.map(m => html`<option value="${m}">${m}</option>`)}
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">Category</label>
              <select class="form-select" .value=${this.filterCategory} @change=${(e) => this.filterCategory = e.target.value}>
                <option value="all">All Categories</option>
                ${categories.map(c => html`<option value="${c}">${c}</option>`)}
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">Security Level</label>
              <select class="form-select" .value=${this.filterLevel} @change=${(e) => this.filterLevel = e.target.value}>
                <option value="all">All Levels</option>
                <option value="app">App</option>
                <option value="module">Module</option>
                <option value="entity">Entity</option>
                <option value="field">Field</option>
                <option value="record">Record</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">Risk Level</label>
              <select class="form-select" .value=${this.filterRisk} @change=${(e) => this.filterRisk = e.target.value}>
                <option value="all">All Risk Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div class="col-md-1 d-flex align-items-end">
              <button 
                class="btn btn-outline-secondary w-100"
                @click=${() => this.showStatistics = !this.showStatistics}
                title="${this.showStatistics ? 'Hide Statistics' : 'Show Statistics'}">
                <i class="bi bi-bar-chart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _renderTable(filteredPermissions) {
    return html`
      <div class="card shadow-sm">
        <div class="card-header bg-white py-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <i class="bi bi-table me-2"></i>Permissions (${filteredPermissions.length} of ${this.permissions.length})
            </h5>
            <div class="btn-group btn-group-sm">
              <button 
                class="btn ${this.viewMode === 'detailed' ? 'btn-primary' : 'btn-outline-primary'}"
                @click=${() => this.viewMode = 'detailed'}>
                <i class="bi bi-list-ul"></i> Detailed
              </button>
              <button 
                class="btn ${this.viewMode === 'compact' ? 'btn-primary' : 'btn-outline-primary'}"
                @click=${() => this.viewMode = 'compact'}>
                <i class="bi bi-list"></i> Compact
              </button>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          ${filteredPermissions.length === 0 ? html`
            <div class="text-center text-muted py-5">
              <i class="bi bi-inbox fs-1"></i>
              <p class="mt-3">No permissions found matching your filters</p>
              <button class="btn btn-sm btn-outline-primary" @click=${this._clearFilters}>
                Clear Filters
              </button>
            </div>
          ` : html`
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: ${this.viewMode === 'detailed' ? '18%' : '20%'}">Permission</th>
                    ${this.viewMode === 'detailed' ? html`<th style="width: 12%">Code</th>` : ''}
                    <th style="width: ${this.viewMode === 'detailed' ? '15%' : '20%'}">Description</th>
                    <th style="width: 10%">Module</th>
                    <th style="width: 10%">Entity</th>
                    <th style="width: 8%">Action</th>
                    <th style="width: 8%">Level</th>
                    ${this.viewMode === 'detailed' ? html`<th style="width: 8%">Scope</th>` : ''}
                    <th style="width: 8%">Risk</th>
                    <th style="width: ${this.viewMode === 'detailed' ? '13%' : '18%'}">Requirements</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredPermissions.map(perm => html`
                    <tr>
                      <td>
                        <div class="fw-bold">${perm.name}</div>
                        ${this.viewMode === 'compact' ? html`<small class="text-muted"><code>${perm.code}</code></small>` : ''}
                      </td>
                      ${this.viewMode === 'detailed' ? html`
                        <td><small class="text-muted"><code>${perm.code}</code></small></td>
                      ` : ''}
                      <td><small class="text-muted">${perm.description}</small></td>
                      <td><span class="badge bg-secondary">${perm.module}</span></td>
                      <td><span class="badge bg-info">${perm.entity}</span></td>
                      <td><span class="badge bg-primary">${perm.action}</span></td>
                      <td><span class="badge bg-${this._getLevelColor(perm.level)}">${perm.level}</span></td>
                      ${this.viewMode === 'detailed' ? html`
                        <td><span class="badge bg-secondary">${perm.scope}</span></td>
                      ` : ''}
                      <td><span class="badge bg-${this._getRiskColor(perm.riskLevel)}">${perm.riskLevel}</span></td>
                      <td>
                        <div class="d-flex flex-wrap gap-1">
                          ${perm.requiresMfa ? html`<span class="badge bg-warning" title="Requires MFA"><i class="bi bi-shield-lock"></i></span>` : ''}
                          ${perm.requiresApproval ? html`<span class="badge bg-info" title="Requires Approval"><i class="bi bi-check-circle"></i></span>` : ''}
                          ${perm.auditLog ? html`<span class="badge bg-secondary" title="Audit Logged"><i class="bi bi-clock-history"></i></span>` : ''}
                          ${perm.isSystemPermission ? html`<span class="badge bg-danger" title="System Permission"><i class="bi bi-gear"></i></span>` : ''}
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
    `;
  }

  _renderLegend() {
    return html`
      <div class="card shadow-sm mt-4">
        <div class="card-header bg-light">
          <h6 class="card-title mb-0">
            <i class="bi bi-info-circle me-2"></i>Legend
          </h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <h6 class="small fw-bold">Security Levels</h6>
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge bg-danger">App</span>
                <span class="badge bg-warning">Module</span>
                <span class="badge bg-primary">Entity</span>
                <span class="badge bg-info">Field</span>
                <span class="badge bg-success">Record</span>
              </div>
            </div>
            <div class="col-md-4">
              <h6 class="small fw-bold">Risk Levels</h6>
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge bg-success">Low</span>
                <span class="badge bg-warning">Medium</span>
                <span class="badge bg-danger">High</span>
                <span class="badge bg-dark">Critical</span>
              </div>
            </div>
            <div class="col-md-4">
              <h6 class="small fw-bold">Requirements</h6>
              <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-warning"><i class="bi bi-shield-lock"></i> MFA</span>
                <span class="badge bg-info"><i class="bi bi-check-circle"></i> Approval</span>
                <span class="badge bg-secondary"><i class="bi bi-clock-history"></i> Audit</span>
                <span class="badge bg-danger"><i class="bi bi-gear"></i> System</span>
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
        <div class="text-center p-5">
          <div class="spinner-border text-primary"></div>
          <p class="mt-3">Loading permissions...</p>
        </div>
      `;
    }

    const filteredPermissions = this._getFilteredPermissions();

    return html`
      <div>
        <!-- Page Header -->
        <div class="mb-4">
          <h1 class="h2 fw-bold">
            <i class="bi bi-key me-2"></i>Permission Browser
          </h1>
          <p class="text-muted">Comprehensive enterprise permission system overview with advanced filtering and analytics</p>
        </div>

        <!-- Statistics Section (Collapsible) -->
        ${this.showStatistics ? this._renderStatistics() : ''}

        <!-- Filters -->
        ${this._renderFilters()}

        <!-- Table -->
        ${this._renderTable(filteredPermissions)}

        <!-- Legend -->
        ${this._renderLegend()}
      </div>
    `;
  }
}

customElements.define('permission-browser', PermissionBrowser);
