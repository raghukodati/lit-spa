# Module Access Bug Fix

## Problem

Sales users could still access admin pages like `/users` and see the user list, even though they should see "Access Denied".

## Root Cause

The guard function was using `authState.canAccess('/module/admin')`, which internally calls `canAccessRoute('/module/admin', user)`. 

The bug was in `ability.service.js`:

```javascript
canAccessRoute(route) {
  const routeMap = {
    '/users': { action: Actions.READ, subject: Subjects.USER },
    '/roles': { action: Actions.READ, subject: Subjects.ROLE },
    // ... other routes ...
    // ❌ '/module/admin' was NOT in this map
  };

  const routeKey = Object.keys(routeMap).find(key => route.startsWith(key));
  
  if (!routeKey) {
    return true; // ❌ BUG: Defaults to TRUE for unmapped routes!
  }
  
  const { action, subject } = routeMap[routeKey];
  return this.can(action, subject);
}
```

When checking `'/module/admin'`:
- Not found in routeMap
- Falls through to `return true`
- **Guard allowed access incorrectly**

## Solution

Use the proper module access function instead:

### Before (Broken)
```javascript
// ❌ Wrong: Uses canAccessRoute which doesn't handle module paths
const hasAccess = authState.canAccess('/module/admin');
```

### After (Fixed)
```javascript
// ✅ Correct: Uses hasModuleAccess which checks user's accessible modules
import { hasModuleAccess } from '../../../services/dataService.js';

const hasAccess = hasModuleAccess('admin');
```

## Changes Made

### 1. Admin Router Guard (`admin.router.js`)

```javascript
import { hasModuleAccess } from '../../../services/dataService.js';

function guardAdminAccess() {
  if (!authState.authenticated) {
    return false;
  }
  
  // ✅ Now correctly checks module access
  const hasAccess = hasModuleAccess('admin');
  if (!hasAccess) {
    console.warn('❌ Admin route access denied: User does not have admin module access');
  }
  return hasAccess;
}
```

### 2. Route Wrapper (`route-wrapper.js`)

```javascript
import { hasModuleAccess } from '@services/dataService.js';

_checkAccess() {
  // ... auth check ...
  
  if (this.requiredModule) {
    // Extract module ID from path: "/module/admin" -> "admin"
    const moduleId = this.requiredModule.split('/').pop();
    
    // ✅ Use hasModuleAccess instead of authState.canAccess
    const hasAccess = hasModuleAccess(moduleId);
    
    if (!hasAccess) {
      this.canAccess = false;
      this.isChecking = false;
      console.warn(`❌ Access denied to module: ${this.requiredModule} (${moduleId})`);
      return;
    }
  }
  // ... rest of checks ...
}
```

## How Module Access Works

The `hasModuleAccess()` function:

1. Gets user's assigned roles
2. Collects all permissions from those roles
3. Maps permission entities to modules:
   ```javascript
   const entityToModule = {
     'users': 'admin',      // If user has 'users' permissions
     'roles': 'admin',      // or 'roles' permissions
     'permissions': 'admin', // or 'permissions' permissions
     'orders': 'sales',     // -> they get 'admin' module access
     'incidents': 'sla',
     // ...
   };
   ```
4. Returns `true` only if the module is in user's accessible modules

## Testing

### Sales User (No Admin Access)
```javascript
// Sales user has:
// - Role: "Sales Manager"  
// - Permissions: { "orders": ["read", "create"], "products": ["read"] }

hasModuleAccess('admin')  // ❌ false - no admin permissions
hasModuleAccess('sales')  // ✅ true - has order/product permissions
```

### Admin User (Has Admin Access)
```javascript
// Admin user has:
// - Role: "Admin"
// - Permissions: { "users": ["read", "create", "update"], "roles": ["read"] }

hasModuleAccess('admin')  // ✅ true - has users/roles permissions
hasModuleAccess('sales')  // ❌ false - no sales permissions
```

## Result

Now when a sales user tries to access `/users`:

1. **Route matches** → `/users` route in admin router
2. **Guard executes** → `guardAdminAccess()`
3. **Module check** → `hasModuleAccess('admin')` returns `false`
4. **Guard fails** → Returns `<access-denied>`
5. **Component never loads** → `import('@modules/admin/...')` never runs
6. **User sees** → Access Denied page

✅ **No user list content**  
✅ **No flash of content**  
✅ **Clear access denied message**

## Files Changed

1. `src/modules/admin/routes/admin.router.js`
   - Added import of `hasModuleAccess`
   - Fixed `guardAdminAccess()` to use `hasModuleAccess('admin')`

2. `src/shared/components/route-wrapper/route-wrapper.js`
   - Added import of `hasModuleAccess`
   - Fixed module check to extract module ID and use `hasModuleAccess()`

## Key Takeaway

**Always use the right function for the right check:**

- `hasModuleAccess(moduleId)` → Check if user can access a module
- `hasPermission(entity, action)` → Check if user has specific permission
- `canAccessRoute(path)` → Check if user can access a specific route path

Don't mix them up! Each has a specific purpose and behavior.
