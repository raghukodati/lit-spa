/**
 * Permission Example Component
 * Demonstrates all CASL permission patterns
 */

import { html, css } from 'lit';
import { BaseComponent } from '../base/BaseComponent.js';
import { Actions, Subjects } from '../../../services/ability.service.js';

export class PermissionExample extends BaseComponent {
  static properties = {
    users: { type: Array },
    orders: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    .section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .permission-result {
      padding: 10px;
      margin: 5px 0;
      border-radius: 4px;
    }
    .allowed {
      background-color: #d4edda;
      color: #155724;
    }
    .denied {
      background-color: #f8d7da;
      color: #721c24;
    }
    button {
      margin: 5px;
      padding: 8px 16px;
    }
  `;

  constructor() {
    super();
    this.users = [
      { id: 1, name: 'John Doe', role: 'Admin' },
      { id: 2, name: 'Jane Smith', role: 'User' }
    ];
    this.orders = [
      { id: 1, customer: 'ACME Corp', status: 'draft', total: 1000 },
      { id: 2, customer: 'Tech Inc', status: 'completed', total: 5000 }
    ];
  }

  /**
   * Example 1: Basic Permission Checks
   */
  renderBasicPermissions() {
    return html`
      <div class="section">
        <h3>1. Basic Permission Checks</h3>
        
        <!-- Method 1: Using this.can() -->
        <div>
          <h4>User Management Actions:</h4>
          ${this.can('users', 'create') ? html`
            <button @click=${this.createUser}>✅ Create User (Allowed)</button>
          ` : html`
            <button disabled>❌ Create User (Denied)</button>
          `}
          
          ${this.can('users', 'update') ? html`
            <button @click=${this.updateUser}>✅ Edit User (Allowed)</button>
          ` : html`
            <button disabled>❌ Edit User (Denied)</button>
          `}
          
          ${this.can('users', 'delete') ? html`
            <button @click=${this.deleteUser}>✅ Delete User (Allowed)</button>
          ` : html`
            <button disabled>❌ Delete User (Denied)</button>
          `}
        </div>

        <!-- Method 2: Using this.ifCan() helper -->
        <div>
          <h4>Using ifCan Helper:</h4>
          ${this.ifCan('users', 'create', 
            html`<p class="permission-result allowed">You can create users</p>`,
            html`<p class="permission-result denied">You cannot create users</p>`
          )}
        </div>
      </div>
    `;
  }

  /**
   * Example 2: Multiple Permission Checks
   */
  renderMultiplePermissions() {
    return html`
      <div class="section">
        <h3>2. Multiple Permission Checks</h3>
        
        <!-- Check if user has ANY of the permissions -->
        ${this.canAny('users', ['create', 'update', 'delete']) ? html`
          <div class="permission-result allowed">
            <strong>User Management Enabled</strong>
            <p>You have at least one user management permission</p>
          </div>
        ` : html`
          <div class="permission-result denied">
            <strong>User Management Disabled</strong>
            <p>You don't have any user management permissions</p>
          </div>
        `}

        <!-- Check if user has ALL permissions -->
        ${this.canAll('users', ['create', 'update', 'delete']) ? html`
          <div class="permission-result allowed">
            <strong>Full User Management Access</strong>
            <p>You have all user management permissions</p>
          </div>
        ` : html`
          <div class="permission-result denied">
            <strong>Limited User Management</strong>
            <p>You don't have all user management permissions</p>
          </div>
        `}
      </div>
    `;
  }

  /**
   * Example 3: Admin-Only Content
   */
  renderAdminContent() {
    return html`
      <div class="section">
        <h3>3. Admin-Only Content</h3>
        
        ${this.ifAdmin(
          html`
            <div class="permission-result allowed">
              <strong>👑 Admin Panel Access</strong>
              <p>You are an administrator</p>
              <button>Access Admin Panel</button>
              <button>Manage System Settings</button>
            </div>
          `,
          html`
            <div class="permission-result denied">
              <strong>🔒 Admin Access Required</strong>
              <p>You need admin privileges to access this section</p>
            </div>
          `
        )}
      </div>
    `;
  }

  /**
   * Example 4: Field-Level Permissions (Conditions)
   */
  renderFieldLevelPermissions() {
    return html`
      <div class="section">
        <h3>4. Field-Level & Conditional Permissions</h3>
        
        <h4>Order List:</h4>
        ${this.orders.map(order => html`
          <div style="margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 4px;">
            <strong>Order #${order.id}</strong> - ${order.customer}
            <br>Status: <span style="color: ${order.status === 'draft' ? 'orange' : 'green'}">${order.status}</span>
            <br>Total: $${order.total}
            <br>
            
            <!-- Can only edit draft orders -->
            ${this.can('orders', 'update', { status: 'draft' }) && order.status === 'draft' ? html`
              <button @click=${() => this.editOrder(order)}>✅ Edit (Draft Only)</button>
            ` : html`
              <button disabled>🔒 Edit (Locked)</button>
            `}
            
            <!-- Can approve orders if manager/admin -->
            ${this.can('orders', 'approve') ? html`
              <button @click=${() => this.approveOrder(order)}>✅ Approve</button>
            ` : ''}
            
            <!-- Can delete completed orders only if admin -->
            ${this.can('orders', 'delete', { status: 'completed' }) && order.status === 'completed' ? html`
              <button @click=${() => this.deleteOrder(order)}>🗑️ Delete</button>
            ` : ''}
          </div>
        `)}
      </div>
    `;
  }

  /**
   * Example 5: Batch Permission Checks
   */
  renderBatchPermissions() {
    // Check multiple permissions at once
    const permissions = this.checkPerms({
      createUsers: ['users', 'create'],
      editUsers: ['users', 'update'],
      deleteUsers: ['users', 'delete'],
      viewReports: ['reports', 'read'],
      manageSettings: ['settings', 'manage'],
      createOrders: ['orders', 'create'],
      approveOrders: ['orders', 'approve']
    });

    return html`
      <div class="section">
        <h3>5. Batch Permission Check Results</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          ${Object.entries(permissions).map(([perm, allowed]) => html`
            <div class="permission-result ${allowed ? 'allowed' : 'denied'}">
              <strong>${perm}:</strong> ${allowed ? '✅ Allowed' : '❌ Denied'}
            </div>
          `)}
        </div>
      </div>
    `;
  }

  /**
   * Example 6: Dynamic Permission Classes
   */
  renderDynamicClasses() {
    return html`
      <div class="section">
        <h3>6. Dynamic CSS Classes Based on Permissions</h3>
        
        <button 
          class=${this.permClass('users', 'delete', 'danger-action', 'disabled-action')}
          ?disabled=${!this.can('users', 'delete')}
        >
          ${this.can('users', 'delete') ? '🗑️ Delete User' : '🔒 Delete (No Permission)'}
        </button>

        <style>
          .danger-action {
            background-color: #dc3545;
            color: white;
            border: none;
            cursor: pointer;
          }
          .disabled-action {
            background-color: #6c757d;
            color: #ccc;
            border: none;
            cursor: not-allowed;
          }
        </style>
      </div>
    `;
  }

  /**
   * Example 7: User List with Per-Item Permissions
   */
  renderUserList() {
    return html`
      <div class="section">
        <h3>7. User List with Individual Permissions</h3>
        
        ${this.users.map(user => html`
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 5px 0; background: #f5f5f5; border-radius: 4px;">
            <div>
              <strong>${user.name}</strong>
              <span style="color: #666; margin-left: 10px;">(${user.role})</span>
            </div>
            
            <div>
              ${this.can('users', 'read') ? html`
                <button @click=${() => this.viewUser(user)}>👁️ View</button>
              ` : ''}
              
              ${this.can('users', 'update') ? html`
                <button @click=${() => this.editUser(user)}>✏️ Edit</button>
              ` : ''}
              
              ${this.can('users', 'delete') ? html`
                <button @click=${() => this.removeUser(user)}>🗑️ Delete</button>
              ` : ''}
              
              ${!this.can('users', 'read') && !this.can('users', 'update') && !this.can('users', 'delete') ? html`
                <span style="color: #999;">No actions available</span>
              ` : ''}
            </div>
          </div>
        `)}
      </div>
    `;
  }

  // Demo action handlers
  createUser() { alert('Creating user...'); }
  updateUser() { alert('Updating user...'); }
  deleteUser() { alert('Deleting user...'); }
  editOrder(order) { alert(`Editing order ${order.id}`); }
  approveOrder(order) { alert(`Approving order ${order.id}`); }
  deleteOrder(order) { alert(`Deleting order ${order.id}`); }
  viewUser(user) { alert(`Viewing ${user.name}`); }
  editUser(user) { alert(`Editing ${user.name}`); }
  removeUser(user) { alert(`Deleting ${user.name}`); }

  render() {
    return html`
      <div>
        <h2>🔐 CASL Permission System Examples</h2>
        <p>This component demonstrates all permission checking patterns.</p>
        
        ${this.renderBasicPermissions()}
        ${this.renderMultiplePermissions()}
        ${this.renderAdminContent()}
        ${this.renderFieldLevelPermissions()}
        ${this.renderBatchPermissions()}
        ${this.renderDynamicClasses()}
        ${this.renderUserList()}
        
        <div class="section">
          <h3>📚 How to Use</h3>
          <p>All components extending <code>BaseComponent</code> automatically have permission methods:</p>
          <ul>
            <li><code>this.can(entity, action)</code> - Check permission</li>
            <li><code>this.cannot(entity, action)</code> - Check no permission</li>
            <li><code>this.canAny(entity, actions)</code> - Check any permission</li>
            <li><code>this.canAll(entity, actions)</code> - Check all permissions</li>
            <li><code>this.ifCan(entity, action, template)</code> - Conditional template</li>
            <li><code>this.ifAdmin(template)</code> - Admin-only template</li>
            <li><code>this.checkPerms(map)</code> - Batch permission check</li>
            <li><code>this.permClass(entity, action, activeClass)</code> - CSS class helper</li>
          </ul>
        </div>
      </div>
    `;
  }
}

customElements.define('permission-example', PermissionExample);
