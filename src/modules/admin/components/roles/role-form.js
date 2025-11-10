import {html} from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';

class RoleFormPage extends BaseComponent {
  static properties = {
    roleId: {type: String},
    role: {type: Object},
    loading: {type: Boolean},
    formData: {type: Object},
    availablePermissions: {type: Array},
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.roleId = null;
    this.role = null;
    this.loading = false;
    this._dataService = null;
    this.entities = [];
    this.permissionTypes = [];
    this.formData = {
      name: '',
      description: '',
      permissions: {},
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    
    // Always initialize dataService for entities and permissionTypes
    if (!this._dataService) {
      this._dataService = await this.getService('dataService');
      this.entities = this._dataService.entities || [];
      this.permissionTypes = this._dataService.permissionTypes || [];
      
      // Initialize empty permissions for all entities
      this.entities.forEach(entity => {
        if (!this.formData.permissions[entity.id]) {
          this.formData.permissions[entity.id] = [];
        }
      });
      this.requestUpdate();
    }
    
    // Extract roleId from URL if in edit mode
    const path = window.location.pathname;
    const match = path.match(/\/roles\/edit\/(\d+)/);
    if (match) {
      this.roleId = match[1];
      this._loadRole();
    }
  }

  async _loadRole() {
    if (!this.roleId) return;
    
    this.loading = true;
    
    try {
      this.role = await this._dataService.getRoleById(parseInt(this.roleId));
      if (this.role) {
        this.formData = {
          name: this.role.name,
          description: this.role.description,
          permissions: this.role.permissions || {},
        };
        // Ensure all entities have permission arrays
        this.entities.forEach(entity => {
          if (!this.formData.permissions[entity.id]) {
            this.formData.permissions[entity.id] = [];
          }
        });
      }
    } catch (error) {
      console.error('Failed to load role:', error);
      alert('Failed to load role');
    } finally {
      this.loading = false;
    }
  }

  _handleInput(field, e) {
    this.formData = {
      ...this.formData,
      [field]: e.target.value,
    };
  }

  _togglePermission(entityId, permissionId) {
    const entityPerms = this.formData.permissions[entityId] || [];
    if (entityPerms.includes(permissionId)) {
      this.formData.permissions[entityId] = entityPerms.filter(p => p !== permissionId);
    } else {
      this.formData.permissions[entityId] = [...entityPerms, permissionId];
    }
    this.requestUpdate();
  }

  _toggleAllForEntity(entityId) {
    const entityPerms = this.formData.permissions[entityId] || [];
    if (entityPerms.length === permissionTypes.length) {
      // All selected, deselect all
      this.formData.permissions[entityId] = [];
    } else {
      // Select all
      this.formData.permissions[entityId] = permissionTypes.map(p => p.id);
    }
    this.requestUpdate();
  }

  _hasPermission(entityId, permissionId) {
    return (this.formData.permissions[entityId] || []).includes(permissionId);
  }

  _getTotalPermissions() {
    return Object.values(this.formData.permissions).reduce((sum, perms) => sum + perms.length, 0);
  }

  async _handleSubmit(e) {
    e.preventDefault();
    this.loading = true;

    try {
      if (!this._dataService) {
        this._dataService = await this.getService('dataService');
      }
      
      // Check permissions
      const action = this.roleId ? 'update' : 'create';
      if (!this.can('settings', action)) {
        alert(`You do not have permission to ${action} roles`);
        return;
      }
      
      if (this.roleId) {
        await this._dataService.updateRole(parseInt(this.roleId), this.formData);
      } else {
        await this._dataService.createRole(this.formData);
      }
      
      // Navigate back to roles list
      window.history.pushState({}, '', '/roles');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      console.error('Error saving role:', err);
    } finally {
      this.loading = false;
    }
  }

  _handleCancel() {
    window.history.pushState({}, '', '/roles');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    if (this.loading && this.roleId) {
      return html`
        <div class="text-center p-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading role...</p>
        </div>
      `;
    }

    return html`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-${this.roleId ? 'pencil-square' : 'shield-plus'} me-2"></i>
              ${this.roleId ? 'Edit Role' : 'Create New Role'}
            </h1>
            <p class="text-muted">Define role permissions and access levels</p>
          </div>
          <button @click=${this._handleCancel} class="btn btn-secondary">
            <i class="bi bi-arrow-left me-1"></i>Back to Roles
          </button>
        </div>

        <!-- Form Card -->
        <div class="card shadow-sm">
          <div class="card-header bg-white">
            <h5 class="card-title mb-0">
              <i class="bi bi-shield-check me-2"></i>Role Information
            </h5>
          </div>
          <div class="card-body">
            <form @submit=${this._handleSubmit}>
              <div class="row g-3">
                <!-- Role Name -->
                <div class="col-md-6">
                  <label for="name" class="form-label fw-semibold">Role Name *</label>
                  <input
                    type="text"
                    id="name"
                    class="form-control"
                    .value=${this.formData.name}
                    @input=${(e) => this._handleInput('name', e)}
                    placeholder="e.g., Administrator, Editor"
                    required
                  />
                  <div class="form-text">Choose a descriptive name for this role</div>
                </div>

                <!-- Description -->
                <div class="col-12">
                  <label for="description" class="form-label fw-semibold">Description</label>
                  <textarea
                    id="description"
                    class="form-control"
                    rows="3"
                    .value=${this.formData.description}
                    @input=${(e) => this._handleInput('description', e)}
                    placeholder="Brief description of this role's purpose and responsibilities"
                  ></textarea>
                  <div class="form-text">Explain what this role is used for</div>
                </div>

                <!-- Permissions Section -->
                <div class="col-12">
                  <hr class="my-4">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-0">
                      <i class="bi bi-key me-2"></i>Entity Permissions Matrix
                    </h6>
                    <span class="badge bg-primary">${this._getTotalPermissions()} total permissions</span>
                  </div>
                  <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    Define CRUD permissions for each entity. Check boxes to grant specific access rights.
                  </div>
                </div>

                <!-- Permission Matrix Table -->
                <div class="col-12">
                  <div class="table-responsive">
                    <table class="table table-bordered table-hover align-middle">
                      <thead class="table-primary">
                        <tr>
                          <th style="width: 25%">Entity</th>
                          ${this.permissionTypes.map(perm => html`
                            <th class="text-center" style="width: ${75 / this.permissionTypes.length}%">
                              <i class="bi bi-${perm.icon} me-1"></i>${perm.name}
                            </th>
                          `)}
                          <th class="text-center">All</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.entities.map(entity => html`
                          <tr>
                            <td>
                              <div class="d-flex align-items-center">
                                <i class="bi bi-${entity.icon} me-2 fs-5 text-primary"></i>
                                <div>
                                  <div class="fw-bold">${entity.name}</div>
                                  <small class="text-muted">${entity.description}</small>
                                </div>
                              </div>
                            </td>
                            ${this.permissionTypes.map(perm => html`
                              <td class="text-center">
                                <div class="form-check d-flex justify-content-center mb-0">
                                  <input 
                                    class="form-check-input" 
                                    type="checkbox" 
                                    id="perm-${entity.id}-${perm.id}"
                                    .checked=${this._hasPermission(entity.id, perm.id)}
                                    @change=${() => this._togglePermission(entity.id, perm.id)}
                                  >
                                </div>
                              </td>
                            `)}
                            <td class="text-center">
                              <button 
                                type="button"
                                class="btn btn-sm btn-outline-primary"
                                @click=${() => this._toggleAllForEntity(entity.id)}
                              >
                                ${(this.formData.permissions[entity.id] || []).length === this.permissionTypes.length 
                                  ? html`<i class="bi bi-check-square"></i>` 
                                  : html`<i class="bi bi-square"></i>`}
                              </button>
                            </td>
                          </tr>
                        `)}
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="col-12">
                  <hr class="my-4">
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary btn-lg flex-fill" ?disabled=${this.loading}>
                      ${this.loading 
                        ? html`<span class="spinner-border spinner-border-sm me-2"></span>Saving...` 
                        : html`<i class="bi bi-${this.roleId ? 'check-circle' : 'plus-circle'} me-2"></i>${this.roleId ? 'Update Role' : 'Create Role'}`}
                    </button>
                    <button type="button" class="btn btn-outline-secondary btn-lg" @click=${this._handleCancel}>
                      <i class="bi bi-x-circle me-1"></i>Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('role-form', RoleFormPage);
