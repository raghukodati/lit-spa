import {html} from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';
import { eventBus, Events } from '../../../../services/eventBus.js';
import { securityContext } from '../../services/security-context.service.js';

class UserFormPage extends BaseComponent {
  static properties = {
    userId: {type: String},
    user: {type: Object},
    loading: {type: Boolean},
    formData: {type: Object},
    roles: {type: Array}
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.userId = null;
    this.user = null;
    this.loading = false;
    this.formData = {
      name: '',
      email: '',
      username: '',
      role: 'User',
      status: 'Active',
      organizationId: '',
      permissionScope: 'own',
      mfaEnabled: false,
      accountLocked: false,
      passwordExpires: true,
      sessionTimeout: 60,
      assignedRoles: []
    };
    this.roles = [];
    this._dataService = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    const path = window.location.pathname;
    const match = path.match(/\/users\/edit\/(\d+)/);
    if (!this._dataService) {
      this._dataService = await this.getService('dataService');
    }
    try {
      this.roles = await this._dataService.getRoles();
    } catch (e) {}
    if (match) {
      this.userId = match[1];
      this._loadUser();
    }
  }

  async _loadUser() {
    if (!this.userId) return;
    
    this.loading = true;
    if (!this._dataService) {
      this._dataService = await this.getService('dataService');
    }
    this.user = await this._dataService.getUserById(parseInt(this.userId));
    if (this.user) {
      this.formData = {
        name: this.user.name,
        email: this.user.email,
        username: this.user.username || '',
        role: this.user.role,
        status: this.user.status,
        organizationId: this.user.organizationId || '',
        permissionScope: this.user.permissionScope || 'own',
        mfaEnabled: this.user.mfaEnabled || false,
        accountLocked: this.user.accountLocked || false,
        passwordExpires: this.user.passwordExpires !== false,
        sessionTimeout: this.user.sessionTimeout || 60,
        assignedRoles: this.user.assignedRoles || []
      };
    }
    this.loading = false;
  }

  _handleInput(field, e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.formData = {
      ...this.formData,
      [field]: value,
    };
  }

  _handleRoleToggle(roleId, e) {
    const checked = e.target.checked;
    const current = new Set(this.formData.assignedRoles || []);
    if (checked) {
      current.add(roleId);
    } else {
      current.delete(roleId);
    }
    this.formData = {
      ...this.formData,
      assignedRoles: Array.from(current)
    };
  }

  async _handleSubmit(e) {
    e.preventDefault();
    this.loading = true;

    // Emit form submit event
    eventBus.emit(Events.FORM_SUBMIT, { form: 'user-form', data: this.formData });
    eventBus.emit(Events.UI_LOADING_START, { source: 'user-form' });

    try {
      if (!this._dataService) {
        this._dataService = await this.getService('dataService');
      }
      
      let user;
      if (this.userId) {
        user = await this._dataService.updateUser(parseInt(this.userId), this.formData);
        // Emit user updated event
        eventBus.emit(Events.USER_UPDATED, { user, userId: this.userId });
        eventBus.emit(Events.UI_SUCCESS, { message: 'User updated successfully' });
      } else {
        user = await this._dataService.createUser(this.formData);
        // Emit user created event
        eventBus.emit(Events.USER_CREATED, { user });
        eventBus.emit(Events.UI_SUCCESS, { message: 'User created successfully' });
      }
      
      // Navigate back to users list
      window.history.pushState({}, '', '/users');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      console.error('Error saving user:', err);
      // Emit error event
      eventBus.emit(Events.UI_ERROR, { 
        message: `Failed to ${this.userId ? 'update' : 'create'} user`, 
        error: err 
      });
    } finally {
      this.loading = false;
      eventBus.emit(Events.UI_LOADING_END, { source: 'user-form' });
    }
  }

  _handleCancel() {
    // Emit form cancel event
    eventBus.emit(Events.FORM_CANCEL, { form: 'user-form' });
    
    window.history.pushState({}, '', '/users');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    if (this.loading && this.userId) {
      return html`
        <div class="text-center p-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading user...</p>
        </div>
      `;
    }

    return html`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-${this.userId ? 'pencil-square' : 'person-plus'} me-2"></i>
              ${this.userId ? 'Edit User' : 'Create New User'}
            </h1>
            <p class="text-muted">Fill in the details below to ${this.userId ? 'update' : 'create'} a user account</p>
          </div>
          <button @click=${this._handleCancel} class="btn btn-secondary">
            <i class="bi bi-arrow-left me-1"></i>Back to Users
          </button>
        </div>

        <!-- Form Card -->
        <div class="card shadow-sm">
          <div class="card-header bg-white">
            <h5 class="card-title mb-0">
              <i class="bi bi-person-badge me-2"></i>User Information
            </h5>
          </div>
          <div class="card-body">
            <form @submit=${this._handleSubmit}>
              
              <!-- Basic Information -->
              <h6 class="text-primary mb-3"><i class="bi bi-info-circle me-2"></i>Basic Information</h6>
              <div class="row g-3">
              <div class="col-md-6">
                <label for="name" class="form-label">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  class="form-control"
                  .value=${this.formData.name}
                  @input=${(e) => this._handleInput('name', e)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="email" class="form-label">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  .value=${this.formData.email}
                  @input=${(e) => this._handleInput('email', e)}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="username" class="form-label">Username *</label>
                <input
                  type="text"
                  id="username"
                  class="form-control"
                  .value=${this.formData.username}
                  @input=${(e) => this._handleInput('username', e)}
                  placeholder="john.doe"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="role" class="form-label">Role</label>
                <select
                  id="role"
                  class="form-select"
                  .value=${this.formData.role}
                  @change=${(e) => this._handleInput('role', e)}
                >
                  ${this.roles && this.roles.length > 0 ? this.roles.map(r => html`<option value="${r.name}">${r.name}</option>`) : html`
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  `}
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">Assigned Roles</label>
                <div class="border rounded p-2" style="max-height: 180px; overflow: auto;">
                  ${this.roles && this.roles.length > 0 ? this.roles.map(r => html`
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="role-${r.id}"
                        .checked=${(this.formData.assignedRoles || []).includes(r.id)}
                        @change=${(e) => this._handleRoleToggle(r.id, e)}
                      />
                      <label class="form-check-label" for="role-${r.id}">${r.name}</label>
                    </div>
                  `) : html`<div class="text-muted">No roles available</div>`}
                </div>
              </div>

              <div class="col-md-6">
                <label for="status" class="form-label">Status</label>
                <select
                  id="status"
                  class="form-select"
                  .value=${this.formData.status}
                  @change=${(e) => this._handleInput('status', e)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Locked">Locked</option>
                </select>
              </div>
              </div>

              <!-- Organization Hierarchy -->
              <hr class="my-4">
              <h6 class="text-primary mb-3"><i class="bi bi-building me-2"></i>Organization Hierarchy</h6>
              <div class="row g-3">
              <div class="col-md-12">
                <label for="organizationId" class="form-label">Organization</label>
                <input
                  type="text"
                  id="organizationId"
                  class="form-control"
                  .value=${this.formData.organizationId}
                  @input=${(e) => this._handleInput('organizationId', e)}
                  placeholder="org-001"
                />
                <div class="form-text"><i class="bi bi-info-circle"></i> Organization identifier</div>
              </div>
              </div>

              <!-- Security Settings -->
              <hr class="my-4">
              <h6 class="text-primary mb-3"><i class="bi bi-shield-lock me-2"></i>Security Settings</h6>
              <div class="row g-3">
              <div class="col-md-6">
                <label for="permissionScope" class="form-label">Permission Scope *</label>
                <select
                  id="permissionScope"
                  class="form-select"
                  .value=${this.formData.permissionScope}
                  @change=${(e) => this._handleInput('permissionScope', e)}
                  required
                >
                  <option value="own">Own - User can only access their own records</option>
                  <option value="team">Team - User can access team records</option>
                  <option value="department">Department - User can access department records</option>
                  <option value="organization">Organization - User can access org records</option>
                  <option value="global">Global - User can access all records</option>
                </select>
                <div class="form-text"><i class="bi bi-info-circle"></i> Determines data visibility scope</div>
              </div>

              <div class="col-md-6">
                <label for="sessionTimeout" class="form-label">Session Timeout (minutes)</label>
                <input
                  type="number"
                  id="sessionTimeout"
                  class="form-control"
                  .value=${this.formData.sessionTimeout}
                  @input=${(e) => this._handleInput('sessionTimeout', e)}
                  min="5"
                  max="480"
                />
                <div class="form-text"><i class="bi bi-info-circle"></i> Auto-logout after inactivity</div>
              </div>

              <div class="col-md-12">
                <div class="border rounded p-3 bg-light">
                  <h6 class="mb-3">Security Options</h6>
                  <div class="row g-3">
                    <div class="col-md-4">
                      <div class="form-check form-switch">
                        <input
                          type="checkbox"
                          id="mfaEnabled"
                          class="form-check-input"
                          .checked=${this.formData.mfaEnabled}
                          @change=${(e) => this._handleInput('mfaEnabled', e)}
                        />
                        <label class="form-check-label" for="mfaEnabled">
                          <i class="bi bi-shield-check"></i> Enable MFA (Multi-Factor Authentication)
                        </label>
                        <div class="form-text small">Require additional authentication step</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-check form-switch">
                        <input
                          type="checkbox"
                          id="accountLocked"
                          class="form-check-input"
                          .checked=${this.formData.accountLocked}
                          @change=${(e) => this._handleInput('accountLocked', e)}
                        />
                        <label class="form-check-label" for="accountLocked">
                          <i class="bi bi-lock"></i> Lock Account
                        </label>
                        <div class="form-text small">Prevent user from logging in</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-check form-switch">
                        <input
                          type="checkbox"
                          id="passwordExpires"
                          class="form-check-input"
                          .checked=${this.formData.passwordExpires}
                          @change=${(e) => this._handleInput('passwordExpires', e)}
                        />
                        <label class="form-check-label" for="passwordExpires">
                          <i class="bi bi-key"></i> Password Expires
                        </label>
                        <div class="form-text small">Require periodic password changes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              <!-- Form Actions -->
              <div class="col-12">
                <hr class="my-4">
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary btn-lg flex-fill" ?disabled=${this.loading}>
                    ${this.loading 
                      ? html`<span class="spinner-border spinner-border-sm me-2"></span>Saving...` 
                      : html`<i class="bi bi-${this.userId ? 'check-circle' : 'plus-circle'} me-2"></i>${this.userId ? 'Update User' : 'Create User'}`}
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-lg" @click=${this._handleCancel}>
                    <i class="bi bi-x-circle me-1"></i>Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('user-form', UserFormPage);
