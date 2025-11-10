# Debug Impersonation Menu Visibility

## Quick Diagnostics

If the "Impersonate User" menu item is not showing up, run this in your browser console:

```javascript
// Check impersonation service
import { impersonationService } from './src/services/impersonation.service.js';
import { hasModuleAccess } from './src/services/dataService.js';
import { hasPermission } from './src/services/casl-permission.service.js';
import { getCurrentUser } from './src/services/authService.js';

console.log('=== Impersonation Menu Debug ===');
console.log('Current User:', getCurrentUser());
console.log('Has Admin Module Access:', hasModuleAccess('admin'));
console.log('Has users.read Permission:', hasPermission('users', 'read'));
console.log('Can Impersonate:', impersonationService.canImpersonate());
console.log('================================');
```

## Alternative Quick Check (paste in console)

```javascript
(async () => {
  const { getCurrentUser } = await import('./src/services/authService.js');
  const { hasModuleAccess } = await import('./src/services/dataService.js');
  const { hasPermission } = await import('./src/services/casl-permission.service.js');
  const { impersonationService } = await import('./src/services/impersonation.service.js');

  console.log('=== Impersonation Menu Debug ===');
  const user = getCurrentUser();
  console.log('Current User:', user?.name, user?.email);
  console.log('User ID:', user?.id);
  console.log('Assigned Roles:', user?.assignedRoles);
  
  const hasAdmin = hasModuleAccess('admin');
  console.log('Has Admin Module:', hasAdmin);
  
  const hasUsers = hasPermission('users', 'read');
  console.log('Has users.read:', hasUsers);
  
  const canImp = impersonationService.canImpersonate();
  console.log('Can Impersonate:', canImp);
  
  if (!canImp) {
    console.log('❌ User cannot impersonate because:');
    if (!hasAdmin) console.log('  - Missing admin module access');
    if (!hasUsers) console.log('  - Missing users.read permission');
  } else {
    console.log('✅ User CAN impersonate!');
    console.log('Menu item should be visible in Admin submenu');
  }
  console.log('================================');
})();
```

## Manual Fix

If the menu still doesn't show, force a refresh:

```javascript
// Clear caches
localStorage.removeItem('users_cache');
localStorage.removeItem('roles_cache');

// Reload page
window.location.reload();
```

## Check Menu Config

Verify the menu item exists:

```javascript
(async () => {
  const response = await fetch('/src/shared/components/side-nav/menu-config.json');
  const config = await response.json();
  
  const adminItems = config.moduleSubmenus.admin.items;
  const impersonateItem = adminItems.find(item => item.id === 'impersonate');
  
  console.log('Impersonate menu item:', impersonateItem);
  
  if (!impersonateItem) {
    console.error('❌ Impersonate menu item not found in config!');
  } else {
    console.log('✅ Menu item exists in config');
    console.log('Required permission:', impersonateItem.permission);
  }
})();
```

## Expected Output (Working State)

```
=== Impersonation Menu Debug ===
Current User: John Admin john@example.com
User ID: 1
Assigned Roles: [1]
Has Admin Module: true
Has users.read: true
Can Impersonate: true
✅ User CAN impersonate!
Menu item should be visible in Admin submenu
================================
```

## Common Issues

### Issue 1: User doesn't have admin module
**Symptom:** `Has Admin Module: false`

**Fix:** Assign a role with admin permissions
```javascript
// Check user's roles and their permissions
const users = JSON.parse(localStorage.getItem('users_cache') || '[]');
const roles = JSON.parse(localStorage.getItem('roles_cache') || '[]');
const user = getCurrentUser();
const userRoles = user.assignedRoles.map(id => 
  roles.find(r => r.id === id)
);
console.log('User roles:', userRoles);
```

### Issue 2: User doesn't have users.read permission
**Symptom:** `Has users.read: false`

**Fix:** Add `users.read` permission to user's role

### Issue 3: Menu not rendering
**Symptom:** Everything shows `true` but menu not visible

**Fix:** 
1. Check browser console for errors
2. Clear browser cache
3. Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
4. Check if side-nav component is rendering properly

### Issue 4: Old cached data
**Symptom:** Permissions changed but menu still doesn't show

**Fix:**
```javascript
// Clear all caches
localStorage.clear();
window.location.reload();
```

## Direct Navigation

Even if menu doesn't show, try navigating directly:

```
http://localhost:5173/users/impersonate
```

If the page loads and shows the impersonation UI, the route works but menu filtering is the issue.
