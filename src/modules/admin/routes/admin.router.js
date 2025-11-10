/**
 * Admin Module Router Configuration
 * Unified routes with slot-based authentication and lazy loading
 */

import { html } from 'lit';
import '../../../shared/components/route-wrapper/route-wrapper.js';
import { authState } from '../../../services/authState.js';
import { hasModuleAccess } from '../../../services/dataService.js';

/**
 * Guard function to check admin module access
 * Returns early if user doesn't have admin access
 */
function guardAdminAccess() {
  if (!authState.authenticated) {
    console.warn('❌ Admin route access denied: Not authenticated');
    return false;
  }
  
  // Check if user has access to 'admin' module
  const hasAccess = hasModuleAccess('admin');
  if (!hasAccess) {
    console.warn('❌ Admin route access denied: User does not have admin module access');
  }
  return hasAccess;
}

/**
 * Wrap a route render function with admin access guard
 * This prevents component loading if user lacks admin access
 */
function withAdminGuard(renderFn) {
  return () => {
    if (!guardAdminAccess()) {
      return html`<access-denied></access-denied>`;
    }
    return renderFn();
  };
}

/**
 * Route metadata for documentation and permission checking
 */
export const adminRouteMetadata = [
  { path: '/module/admin', component: 'admin-dashboard', title: 'Admin Dashboard', permission: 'module.admin' },
  { path: '/admin/security-demo', component: 'security-demo', title: 'Security Demo', permission: 'module.admin' },
  { path: '/users', component: 'user-management', title: 'User Management', permission: 'users.read' },
  { path: '/users/new', component: 'user-form', title: 'Create User', permission: 'users.create' },
  { path: '/users/edit/:id', component: 'user-form', title: 'Edit User', permission: 'users.update' },
  { path: '/users/:id/assign-roles', component: 'user-role-assignment', title: 'Assign Roles', permission: 'users.update' },
  { path: '/users/impersonate', component: 'user-impersonation', title: 'Impersonate User', permission: 'users.impersonate' },
  { path: '/roles', component: 'role-management', title: 'Role Management', permission: 'roles.read' },
  { path: '/roles/new', component: 'role-form', title: 'Create Role', permission: 'roles.create' },
  { path: '/roles/edit/:id', component: 'role-form', title: 'Edit Role', permission: 'roles.update' },
  { path: '/roles/:id/permissions', component: 'role-permissions-view', title: 'Role Permissions', permission: 'roles.read' },
  { path: '/permissions', component: 'permission-browser', title: 'Permission Browser', permission: 'permissions.read' },
  { path: '/security/audit-log', component: 'audit-log-viewer', title: 'Audit Log', permission: 'security.read' },
  { path: '/security/settings', component: 'security-settings', title: 'Security Settings', permission: 'security.manage' },
  { path: '/security/activity', component: 'user-activity-monitor', title: 'User Activity', permission: 'security.read' },
  { path: '/security/sessions', component: 'session-management', title: 'Session Management', permission: 'security.manage' }
];

/**
 * Create admin routes with slot-based authentication and lazy loading
 * @returns {Array} Admin route configuration
 */
export const createAdminRoutes = () => {
  const routes = [
  {
    path: '/module/admin',
    render: () => {
      import('@modules/admin/components/dashboard/admin-dashboard.js');
      return html`
        <route-wrapper requiredModule="/module/admin">
          <module-admin></module-admin>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/users',
    render: () => {
      import('@modules/admin/components/users/user-management.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.read">
          <user-management></user-management>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/users/new',
    render: () => {
      import('@modules/admin/components/users/user-form.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.create">
          <user-form></user-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/users/edit/*',
    render: () => {
      import('@modules/admin/components/users/user-form.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.update">
          <user-form></user-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/users/*/assign-roles',
    render: () => {
      import('@modules/admin/components/users/user-role-assignment.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.update">
          <user-role-assignment></user-role-assignment>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/users/impersonate',
    render: () => {
      import('@modules/admin/components/users/user-impersonation.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.read">
          <div class="container-fluid py-4">
            <div class="mb-4">
              <a href="/users" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left"></i> Back to Users
              </a>
            </div>
            <user-impersonation></user-impersonation>
          </div>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/roles',
    render: () => {
      import('@modules/admin/components/roles/role-management.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.read">
          <role-management></role-management>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/roles/new',
    render: () => {
      import('@modules/admin/components/roles/role-form.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.create">
          <role-form></role-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/roles/edit/*',
    render: () => {
      import('@modules/admin/components/roles/role-form.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.update">
          <role-form></role-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/roles/*/permissions',
    render: () => {
      import('@modules/admin/components/roles/role-permissions-view.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.read">
          <role-permissions-view></role-permissions-view>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/permissions',
    render: () => {
      import('@modules/admin/components/permissions/permission-browser.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="permissions.read">
          <permission-browser></permission-browser>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/permissions/catalog',
    render: () => {
      // Redirect to unified permissions browser
      window.history.replaceState({}, '', '/permissions');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return html`<div></div>`;
    }
  },
  {
    path: '/security/audit-log',
    render: () => {
      import('@modules/admin/components/security/audit-log-viewer.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.read">
          <audit-log-viewer></audit-log-viewer>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/security/settings',
    render: () => {
      import('@modules/admin/components/security/security-settings.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.manage">
          <security-settings></security-settings>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/security/activity',
    render: () => {
      import('@modules/admin/components/security/user-activity-monitor.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.read">
          <user-activity-monitor></user-activity-monitor>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/security/sessions',
    render: () => {
      import('@modules/admin/components/security/session-management.js');
      return html`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.manage">
          <session-management></session-management>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/admin/security-demo',
    render: () => {
      import('@modules/admin/components/security-demo.js');
      return html`
        <route-wrapper requiredModule="/module/admin">
          <div class="container-fluid py-4">
            <div class="mb-4">
              <a href="/module/admin" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left"></i> Back to Admin
              </a>
            </div>
            <security-demo></security-demo>
          </div>
        </route-wrapper>
      `;
    }
  }
  ];

  // Apply admin guard to all routes to prevent unauthorized access
  return routes.map(route => ({
    ...route,
    render: withAdminGuard(route.render)
  }));
};

/**
 * B2B Feature Permissions
 */
export const b2bPermissions = {
  approvals: {
    read: 'b2b.approvals.read',
    create: 'b2b.approvals.create',
    update: 'b2b.approvals.update',
    configure: 'b2b.approvals.configure'
  },
  keepstock: {
    read: 'b2b.keepstock.read',
    create: 'b2b.keepstock.create',
    update: 'b2b.keepstock.update',
    delete: 'b2b.keepstock.delete'
  },
  purchases: {
    read: 'b2b.purchases.read',
    export: 'b2b.purchases.export'
  }
};

/**
 * Get route metadata by path
 */
export const getAdminRoute = (path) => {
  return adminRouteMetadata.find(route => route.path === path);
};

/**
 * Check if user has permission for route
 */
export const canAccessRoute = (route, userPermissions) => {
  if (!route.permission) return true;
  return userPermissions.includes(route.permission);
};

export default createAdminRoutes;
