/**
 * User Impersonation Component
 * Allows admins to select and impersonate users
 */

import { LitElement, html } from 'lit';
import { impersonationService } from '@services/impersonation.service.js';
import { getUsers } from '../../services/user.service.js';

class UserImpersonation extends LitElement {
  static properties = {
    users: { type: Array, state: true },
    filteredUsers: { type: Array, state: true },
    searchTerm: { type: String, state: true },
    loading: { type: Boolean, state: true },
    canImpersonate: { type: Boolean, state: true }
  };

  constructor() {
    super();
    this.users = [];
    this.filteredUsers = [];
    this.searchTerm = '';
    this.loading = false;
    this.canImpersonate = false;
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.canImpersonate = impersonationService.canImpersonate();
    if (this.canImpersonate) {
      await this._loadUsers();
    }
  }

  async _loadUsers() {
    this.loading = true;
    try {
      const all = await getUsers();
      this.users = all.map(u => ({ ...u, active: true }));
      this.filteredUsers = [...this.users];
    } catch (error) {
      console.error('Failed to load users:', error);
      alert('Failed to load users: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  _handleSearch(e) {
    this.searchTerm = e.target.value.toLowerCase();
    
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(this.searchTerm) ||
      user.email.toLowerCase().includes(this.searchTerm) ||
      user.username?.toLowerCase().includes(this.searchTerm)
    );
  }

  async _handleImpersonate(user) {
    const confirmMessage = `Are you sure you want to impersonate:\n\n${user.name} (${user.email})?\n\nThis will allow you to see and do what this user can do.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.loading = true;
    try {
      await impersonationService.startImpersonation(user);
      
      // Close modal if using Bootstrap
      const modal = document.querySelector('#impersonationModal');
      if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
        }
      }

      // Reload to apply new permissions
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to start impersonation:', error);
      alert('Failed to impersonate user: ' + error.message);
      this.loading = false;
    }
  }

  _getUserRoleNames(user) {
    const roles = JSON.parse(localStorage.getItem('roles_cache') || '[]');
    const userRoles = (user.assignedRoles || [])
      .map(roleId => roles.find(r => r.id === roleId))
      .filter(Boolean)
      .map(r => r.name);
    return userRoles.length > 0 ? userRoles.join(', ') : 'No roles';
  }

  render() {
    if (!this.canImpersonate) {
      return html`
        <div class="alert alert-danger">
          <i class="bi bi-shield-x me-2"></i>
          You don't have permission to impersonate users.
        </div>
      `;
    }

    if (this.loading && this.users.length === 0) {
      return html`
        <div class="text-center p-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading users...</p>
        </div>
      `;
    }

    return html`
      <div class="container-fluid">
        <div class="row mb-3">
          <div class="col">
            <h5 class="mb-0">
              <i class="bi bi-incognito me-2 text-warning"></i>
              User Impersonation
            </h5>
            <p class="text-muted small mb-0">Select a user to view the application as them</p>
          </div>
        </div>

        <!-- Search -->
        <div class="row mb-3">
          <div class="col">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search by name, email, or username..."
                .value=${this.searchTerm}
                @input=${this._handleSearch}
              />
            </div>
          </div>
        </div>

        <!-- User List -->
        <div class="row">
          <div class="col">
            ${this.filteredUsers.length === 0 ? html`
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                ${this.searchTerm ? 'No users found matching your search.' : 'No users available.'}
              </div>
            ` : html`
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Roles</th>
                      <th>Status</th>
                      <th class="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.filteredUsers.map(user => html`
                      <tr>
                        <td>
                          <div class="d-flex align-items-center gap-2">
                            <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                 style="width: 32px; height: 32px; font-size: 14px;">
                              ${user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong>${user.name}</strong>
                              ${user.isSuperAdmin ? html`
                                <span class="badge bg-danger ms-1">Super Admin</span>
                              ` : ''}
                            </div>
                          </div>
                        </td>
                        <td class="text-muted">${user.email}</td>
                        <td>
                          <span class="badge bg-secondary">${this._getUserRoleNames(user)}</span>
                        </td>
                        <td>
                          ${user.active ? html`
                            <span class="badge bg-success">Active</span>
                          ` : html`
                            <span class="badge bg-secondary">Inactive</span>
                          `}
                        </td>
                        <td class="text-end">
                          <button 
                            class="btn btn-sm btn-outline-primary"
                            @click=${() => this._handleImpersonate(user)}
                            ?disabled=${this.loading || !user.active}>
                            <i class="bi bi-person-fill-check me-1"></i>
                            Impersonate
                          </button>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>

        <!-- Warning -->
        <div class="row mt-3">
          <div class="col">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>
              <strong>Security Notice:</strong> Impersonation actions are logged. 
              You will have the same permissions and see the same data as the impersonated user.
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('user-impersonation', UserImpersonation);

export default UserImpersonation;
