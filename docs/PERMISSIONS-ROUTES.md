# Route-Level Permission Protection

## Problem

Previously, routes were only checking **module access** (`requiredModule="/module/admin"`) but not **specific permissions**. This meant users with access to the admin module could access ALL admin pages, even if they didn't have specific permissions like `users.create` or `roles.update`.

## Solution

The `route-wrapper` component now supports permission checking with three approaches:

### 1. Permission Dot Notation (Recommended)

```javascript
html`
  <route-wrapper requiredModule="/module/admin" requiredPermission="users.read">
    <user-management></user-management>
  </route-wrapper>
`
```

### 2. Entity + Action Format

```javascript
html`
  <route-wrapper permissionEntity="users" permissionAction="read">
    <user-management></user-management>
  </route-wrapper>
`
```

### 3. Automatic Route-Based (Fallback)

If no permission is specified, the wrapper checks permissions based on the current URL path using the `canAccessRoute()` function.

## Route Wrapper Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `requiredModule` | String | Module path (e.g., "/module/admin") |
| `requiredPermission` | String | Permission in dot notation (e.g., "users.read") |
| `permissionEntity` | String | Entity name (e.g., "users") |
| `permissionAction` | String | Action name (e.g., "read") |

## Permission Check Priority

The route-wrapper checks permissions in this order:

1. **Authentication** - User must be logged in
2. **Module Access** - If `requiredModule` is set, check module access
3. **Entity + Action** - If both `permissionEntity` and `permissionAction` are set
4. **Dot Notation** - If `requiredPermission` is set (e.g., "users.read")
5. **Route-Based** - Fallback to checking current pathname via `canAccessRoute()`
6. **Default** - Allow access if no restrictions specified

## Updating Routes

### Before (Only Module Check)

```javascript
{
  path: '/users',
  render: () => {
    import('@modules/admin/components/users/user-management.js');
    return html`
      <route-wrapper requiredModule="/module/admin">
        <user-management></user-management>
      </route-wrapper>
    `;
  }
}
```

### After (Module + Permission Check)

```javascript
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
}
```

## Using Route Helpers

For cleaner route definitions, use the route helper utilities:

```javascript
import { createProtectedRoute } from '@shared/utils/route-helper.js';

const route = createProtectedRoute({
  path: '/users',
  component: '@modules/admin/components/users/user-management.js',
  tagName: 'user-management',
  requiredModule: '/module/admin',
  requiredPermission: 'users.read'
});
```

## Generating Routes from Metadata

Use `createRoutesFromMetadata` to automatically generate routes:

```javascript
import { createRoutesFromMetadata } from '@shared/utils/route-helper.js';
import { adminRouteMetadata } from './admin.router.js';

const routes = createRoutesFromMetadata(adminRouteMetadata, '/module/admin', {
  'admin-dashboard': {
    component: '@modules/admin/components/dashboard/admin-dashboard.js',
    tagName: 'module-admin'
  }
});
```

## Permission Metadata

Routes should define metadata with permissions:

```javascript
export const adminRouteMetadata = [
  { 
    path: '/users', 
    component: 'user-management', 
    title: 'User Management', 
    permission: 'users.read' 
  },
  { 
    path: '/users/new', 
    component: 'user-form', 
    title: 'Create User', 
    permission: 'users.create' 
  }
];
```

## Validating Route Security

Check if all routes have proper permission protection:

```javascript
import { validateRoutePermissions } from '@shared/utils/route-helper.js';

const warnings = validateRoutePermissions(myRoutes, 'Admin Module');
// Logs warnings for any routes without permission checks
```

## Testing Permissions

### Check User Permissions

```javascript
import { hasPermission } from '@services/casl-permission.service.js';

if (hasPermission('users', 'read')) {
  // User can read users
}
```

### Check Route Access

```javascript
import { canAccessRoute } from '@services/casl-permission.service.js';

if (canAccessRoute('/users')) {
  // User can access /users route
}
```

## Common Permission Patterns

### CRUD Permissions

```javascript
users.read    // View user list
users.create  // Create new users
users.update  // Edit existing users
users.delete  // Delete users
users.manage  // Full access (includes all CRUD)
```

### Module-Specific Permissions

```javascript
module.admin     // Access to admin module
security.read    // View security logs
security.manage  // Manage security settings
```

## Access Denied

When a user lacks required permissions, the route-wrapper automatically displays:

```html
<access-denied></access-denied>
```

This component shows a user-friendly message explaining they don't have permission to access the page.

## Best Practices

1. **Always specify both module AND permission** for maximum security
2. **Use permission metadata** to keep route definitions DRY
3. **Validate routes** during development with `validateRoutePermissions()`
4. **Test permission changes** by switching user roles
5. **Document custom permissions** in your module's README
6. **Follow naming conventions**: `entity.action` format

## Migration Checklist

- [ ] Update `route-wrapper` component (✓ Done)
- [ ] Add `requiredPermission` to all protected routes
- [ ] Update route metadata with permission information
- [ ] Test with different user roles
- [ ] Validate all routes with `validateRoutePermissions()`
- [ ] Update other modules (SLA, Sales, Commerce, etc.)
- [ ] Document custom permissions for your module

## Security Notes

⚠️ **Important**: Route-level permissions are the **first line of defense** but should be complemented with:

1. **API-level authorization** - Backend must also check permissions
2. **Component-level checks** - Hide UI elements users can't use
3. **Service-level guards** - Protect sensitive operations

Never rely solely on client-side permission checks for security!
