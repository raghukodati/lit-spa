/**
 * Security Demo Component
 * Demonstrates all security features of the enterprise admin module
 */

import { LitElement, html, css } from 'lit';
import { securityContext } from '../services/security-context.service.js';

class SecurityDemo extends LitElement {
  static properties = {
    user: { type: Object },
    permissions: { type: Object },
    auditLog: { type: Array }
  };

  static styles = css`
    .demo-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .section h3 {
      margin-top: 0;
      color: #333;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }
    .permission-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-top: 15px;
    }
    .permission-item {
      padding: 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .permission-item.granted {
      background: #d4edda;
      border: 1px solid #c3e6cb;
    }
    .permission-item.denied {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
    }
    .permission-item i {
      font-size: 18px;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      margin: 2px;
    }
    .badge.scope-global { background: #dc3545; color: white; }
    .badge.scope-organization { background: #007bff; color: white; }
    .badge.scope-department { background: #17a2b8; color: white; }
    .badge.scope-team { background: #ffc107; color: black; }
    .badge.scope-own { background: #28a745; color: white; }
    .audit-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .audit-table th,
    .audit-table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }
    .audit-table th {
      background: #f8f9fa;
      font-weight: bold;
    }
    .audit-table tr:hover {
      background: #f8f9fa;
    }
    .info-card {
      background: #e7f3ff;
      border-left: 4px solid #007bff;
      padding: 15px;
      margin: 10px 0;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin: 4px;
    }
    .btn-primary { background: #007bff; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn:hover { opacity: 0.9; }
    .btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
    }
  `;

  constructor() {
    super();
    this.user = null;
    this.permissions = {};
    this.auditLog = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadSecurityInfo();
  }

  loadSecurityInfo() {
    if (!securityContext.isAuthenticated()) {
      console.warn('Security context not initialized');
      return;
    }

    this.user = securityContext.getUser();
    this.permissions = this.checkAllPermissions();
    this.auditLog = securityContext.getAuditLog(10);
  }

  checkAllPermissions() {
    const entities = ['User', 'Role', 'Permission', 'Customer', 'Order', 'Product', 'Incident'];
    const actions = ['create', 'read', 'update', 'delete'];
    
    const results = {};
    
    entities.forEach(entity => {
      results[entity] = {};
      actions.forEach(action => {
        results[entity][action] = securityContext.can(action, entity);
      });
    });

    return results;
  }

  render() {
    if (!securityContext.isAuthenticated()) {
      return html`
        <div class="demo-container">
          <div class="section">
            <h3>⚠️ Security Context Not Initialized</h3>
            <p>Please initialize the security context first.</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="demo-container">
        <!-- User Information -->
        <div class="section">
          <h3>👤 Current User</h3>
          <div class="info-card">
            <strong>${this.user?.name}</strong> (${this.user?.username})<br>
            Email: ${this.user?.email}<br>
            Role: ${this.user?.role}<br>
            Scope: <span class="badge scope-${this.user?.permissionScope}">${this.user?.permissionScope?.toUpperCase()}</span><br>
            MFA: ${this.user?.mfaEnabled ? '✅ Enabled' : '❌ Disabled'}<br>
            Organization: ${this.user?.organizationId} | Department: ${this.user?.departmentId} | Team: ${this.user?.teamId || 'None'}
          </div>
        </div>

        <!-- Assigned Roles -->
        <div class="section">
          <h3>🛡️ Assigned Roles</h3>
          ${securityContext.getRoles().map(role => html`
            <div class="info-card">
              <strong>${role.name}</strong> - ${role.description}<br>
              <span class="badge">Priority: ${role.priority}</span>
              <span class="badge">Category: ${role.category}</span>
              <span class="badge scope-${role.dataScope}">${role.dataScope}</span>
              ${role.isSystemRole ? html`<span class="badge" style="background: #6c757d; color: white;">System Role</span>` : ''}
            </div>
          `)}
        </div>

        <!-- Permission Matrix -->
        <div class="section">
          <h3>🔐 Permission Matrix</h3>
          ${Object.entries(this.permissions).map(([entity, actions]) => html`
            <h4>${entity}</h4>
            <div class="permission-grid">
              ${Object.entries(actions).map(([action, granted]) => html`
                <div class="permission-item ${granted ? 'granted' : 'denied'}">
                  <i class="bi bi-${granted ? 'check-circle-fill' : 'x-circle-fill'}"></i>
                  <span>${action.toUpperCase()}</span>
                </div>
              `)}
            </div>
          `)}
        </div>

        <!-- Security Context Features -->
        <div class="section">
          <h3>🔍 Security Features</h3>
          
          <h4>App-Level Checks</h4>
          <div class="permission-grid">
            <div class="permission-item ${securityContext.isAdmin() ? 'granted' : 'denied'}">
              <i class="bi bi-${securityContext.isAdmin() ? 'check' : 'x'}-circle-fill"></i>
              <span>Is Admin</span>
            </div>
            <div class="permission-item ${securityContext.canAccessModule('admin') ? 'granted' : 'denied'}">
              <i class="bi bi-${securityContext.canAccessModule('admin') ? 'check' : 'x'}-circle-fill"></i>
              <span>Admin Module</span>
            </div>
            <div class="permission-item ${securityContext.canAccessModule('sales') ? 'granted' : 'denied'}">
              <i class="bi bi-${securityContext.canAccessModule('sales') ? 'check' : 'x'}-circle-fill"></i>
              <span>Sales Module</span>
            </div>
            <div class="permission-item ${securityContext.canAccessModule('analytics') ? 'granted' : 'denied'}">
              <i class="bi bi-${securityContext.canAccessModule('analytics') ? 'check' : 'x'}-circle-fill"></i>
              <span>Analytics Module</span>
            </div>
          </div>

          <h4>Field-Level Permissions</h4>
          <div class="permission-grid">
            <div class="permission-item ${securityContext.canAccessField('User', 'salary', 'read') ? 'granted' : 'denied'}">
              <i class="bi bi-${securityContext.canAccessField('User', 'salary', 'read') ? 'check' : 'x'}-circle-fill"></i>
              <span>Read User.salary</span>
            </div>
            <div class="permission-item ${securityContext.canAccessField('User', 'email', 'read') ? 'granted' : 'denied'}">
              <i class="bi bi-${securityContext.canAccessField('User', 'email', 'read') ? 'check' : 'x'}-circle-fill"></i>
              <span>Read User.email</span>
            </div>
            <div class="permission-item ${securityContext.canAccessField('Customer', 'creditLimit', 'read') ? 'granted' : 'denied'}">
              <i class="bi bi-${securityContext.canAccessField('Customer', 'creditLimit', 'read') ? 'check' : 'x'}-circle-fill"></i>
              <span>Read Customer.creditLimit</span>
            </div>
            <div class="permission-item ${securityContext.canAccessField('Customer', 'creditLimit', 'write') ? 'granted' : 'denied'}">
              <i class="bi bi-${securityContext.canAccessField('Customer', 'creditLimit', 'write') ? 'check' : 'x'}-circle-fill"></i>
              <span>Write Customer.creditLimit</span>
            </div>
          </div>

          <h4>MFA Requirements</h4>
          <div class="permission-grid">
            <div class="permission-item ${securityContext.requiresMfa('delete', 'User') ? 'denied' : 'granted'}">
              <i class="bi bi-shield-${securityContext.requiresMfa('delete', 'User') ? 'lock' : 'check'}-fill"></i>
              <span>Delete User (${securityContext.requiresMfa('delete', 'User') ? 'MFA Required' : 'No MFA'})</span>
            </div>
            <div class="permission-item ${securityContext.requiresMfa('manage', 'Settings') ? 'denied' : 'granted'}">
              <i class="bi bi-shield-${securityContext.requiresMfa('manage', 'Settings') ? 'lock' : 'check'}-fill"></i>
              <span>Manage Settings (${securityContext.requiresMfa('manage', 'Settings') ? 'MFA Required' : 'No MFA'})</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="section">
          <h3>🎯 Action Buttons (Permission-Based)</h3>
          <button 
            class="btn btn-primary"
            ?disabled=${!securityContext.can('create', 'User')}
            @click=${() => alert('Create User')}>
            <i class="bi bi-plus-circle"></i> Create User
          </button>
          <button 
            class="btn btn-danger"
            ?disabled=${!securityContext.can('delete', 'User')}
            @click=${() => alert('Delete User (MFA Required)')}>
            <i class="bi bi-trash"></i> Delete User
          </button>
          <button 
            class="btn btn-success"
            ?disabled=${!securityContext.can('export', 'Report')}
            @click=${() => alert('Export Report')}>
            <i class="bi bi-download"></i> Export Report
          </button>
          <button 
            class="btn btn-primary"
            ?disabled=${!securityContext.can('manage', 'Settings')}
            @click=${() => alert('Manage Settings (MFA Required)')}>
            <i class="bi bi-gear"></i> System Settings
          </button>
        </div>

        <!-- Audit Log -->
        <div class="section">
          <h3>📋 Recent Audit Log</h3>
          <table class="audit-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event</th>
                <th>User</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${this.auditLog.map(entry => html`
                <tr>
                  <td>${new Date(entry.timestamp).toLocaleString()}</td>
                  <td><strong>${entry.event}</strong></td>
                  <td>${entry.username || 'System'}</td>
                  <td><small>${JSON.stringify(entry.details)}</small></td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>

        <!-- Permission Summary -->
        <div class="section">
          <h3>📊 Permission Summary</h3>
          ${this.renderPermissionSummary()}
        </div>
      </div>
    `;
  }

  renderPermissionSummary() {
    const summary = securityContext.getPermissionSummary();
    
    return html`
      <div class="permission-grid">
        <div class="permission-item ${summary.canManageUsers ? 'granted' : 'denied'}">
          <i class="bi bi-${summary.canManageUsers ? 'check' : 'x'}-circle-fill"></i>
          <span>Manage Users</span>
        </div>
        <div class="permission-item ${summary.canManageRoles ? 'granted' : 'denied'}">
          <i class="bi bi-${summary.canManageRoles ? 'check' : 'x'}-circle-fill"></i>
          <span>Manage Roles</span>
        </div>
        <div class="permission-item ${summary.canManageCustomers ? 'granted' : 'denied'}">
          <i class="bi bi-${summary.canManageCustomers ? 'check' : 'x'}-circle-fill"></i>
          <span>Manage Customers</span>
        </div>
        <div class="permission-item ${summary.canManageOrders ? 'granted' : 'denied'}">
          <i class="bi bi-${summary.canManageOrders ? 'check' : 'x'}-circle-fill"></i>
          <span>Manage Orders</span>
        </div>
        <div class="permission-item ${summary.canManageProducts ? 'granted' : 'denied'}">
          <i class="bi bi-${summary.canManageProducts ? 'check' : 'x'}-circle-fill"></i>
          <span>Manage Products</span>
        </div>
        <div class="permission-item ${summary.canManageIncidents ? 'granted' : 'denied'}">
          <i class="bi bi-${summary.canManageIncidents ? 'check' : 'x'}-circle-fill"></i>
          <span>Manage Incidents</span>
        </div>
        <div class="permission-item ${summary.canViewReports ? 'granted' : 'denied'}">
          <i class="bi bi-${summary.canViewReports ? 'check' : 'x'}-circle-fill"></i>
          <span>View Reports</span>
        </div>
        <div class="permission-item ${summary.canViewAnalytics ? 'granted' : 'denied'}">
          <i class="bi bi-${summary.canViewAnalytics ? 'check' : 'x'}-circle-fill"></i>
          <span>View Analytics</span>
        </div>
      </div>
    `;
  }
}

customElements.define('security-demo', SecurityDemo);
