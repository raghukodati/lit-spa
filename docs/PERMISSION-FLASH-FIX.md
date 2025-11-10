# Permission Flash Issue Fix

## Problem

When a sales user (without admin permissions) navigated to admin URLs like `/users`:
1. Brief 404 error appeared
2. Then immediately showed user list content
3. User could see restricted content before access was denied

## Root Causes

### 1. Component Rendered Before Permission Check
The `route-wrapper` component was checking permissions in `connectedCallback()`, but the slot content (child component) was already being rendered in the first render cycle before the permission check completed.

### 2. No Early Guard on Routes
Admin routes didn't have an early access check before attempting to load and render components. The route would match, start loading the component, then check permissions.

### 3. Async Component Loading
Components were lazy-loaded with `import()`, which happened after the route matched but before permission checks completed, causing a flash of content.

## Solutions Implemented

### 1. Added Loading State to Route Wrapper

**File:** `src/shared/components/route-wrapper/route-wrapper.js`

Added `isChecking` state to block rendering while permission check is in progress:

```javascript
constructor() {
  super();
  this.isChecking = true; // Block rendering initially
  this.canAccess = false;
}

render() {
  // Block rendering while checking permissions
  if (this.isChecking) {
    return html``; // Return empty to prevent flash of content
  }

  if (!this.canAccess) {
    return html`<access-denied></access-denied>`;
  }

  return html`<slot></slot>`;
}
```

**How it works:**
- Component starts with `isChecking = true`
- Renders empty template (no content, no 404)
- Permission check completes, sets `isChecking = false`
- Re-renders with either access-denied or actual content
- **No flash** of unauthorized content

### 2. Added Early Route Guards

**File:** `src/modules/admin/routes/admin.router.js`

Created guard functions that check access BEFORE loading components:

```javascript
function guardAdminAccess() {
  if (!authState.authenticated) {
    console.warn('❌ Admin route access denied: Not authenticated');
    return false;
  }
  
  const hasAccess = authState.canAccess('/module/admin');
  if (!hasAccess) {
    console.warn('❌ Admin route access denied: User lacks admin module access');
  }
  return hasAccess;
}

function withAdminGuard(renderFn) {
  return () => {
    if (!guardAdminAccess()) {
      return html`<access-denied></access-denied>`;
    }
    return renderFn();
  };
}
```

### 3. Applied Guard to All Admin Routes

Instead of checking on each route individually, wrap ALL admin routes with the guard:

```javascript
export const createAdminRoutes = () => {
  const routes = [
    // ... all route definitions ...
  ];

  // Apply admin guard to ALL routes at once
  return routes.map(route => ({
    ...route,
    render: withAdminGuard(route.render)
  }));
};
```

**Benefits:**
- Single place to enforce access control
- Consistent behavior across all routes
- Easy to maintain and extend
- Prevents component loading for unauthorized users

### 4. Enhanced Permission Check Logging

Added console warnings when permission checks fail:

```javascript
if (!authState.canAccess(this.requiredModule)) {
  this.canAccess = false;
  this.isChecking = false;
  console.warn(`❌ Access denied to module: ${this.requiredModule}`);
  return;
}

if (!hasPermission(entity, action)) {
  console.warn(`❌ Permission denied: ${entity}.${action}`);
}
```

## How It Works Now

### Unauthorized Access Flow

1. **User navigates** to `/users`
2. **Route matches** (admin routes are loaded)
3. **Guard checks** `guardAdminAccess()` immediately
4. **Access denied** because sales user lacks admin module access
5. **Returns** `<access-denied>` immediately
6. **No component loading** - `import()` never executes
7. **No content flash** - user sees access denied right away

### Authorized Access Flow

1. **User navigates** to `/users`
2. **Route matches**
3. **Guard checks** and passes (user has admin access)
4. **Route wrapper renders** with `isChecking = true`
5. **Empty template shown** (no flash)
6. **Permission check runs** in `connectedCallback()`
7. **Check completes**, sets `isChecking = false`
8. **Component loads** via `import()`
9. **Content renders** only after all checks pass

## Defense in Depth

The fix implements multiple layers of security:

1. **Route-level guard** - Checks module access before route renders
2. **Route wrapper check** - Verifies both module and specific permissions
3. **Loading state** - Prevents content flash during checks
4. **Component-level checks** - Individual components can add their own checks
5. **API authorization** - Backend validates (unchanged)

## Testing Checklist

- [x] Sales user navigating to `/users` shows access denied immediately
- [x] No flash of user list content
- [x] No 404 error shown
- [x] Console shows permission denied warning
- [x] Admin user can still access /users normally
- [x] Permission checks log properly
- [x] All admin routes protected consistently

## Files Changed

1. `src/shared/components/route-wrapper/route-wrapper.js` - Added `isChecking` state
2. `src/modules/admin/routes/admin.router.js` - Added guard functions and applied to all routes

## Performance Impact

✅ **Minimal impact** - Guard functions are synchronous and fast  
✅ **Better UX** - No content flash improves perceived performance  
✅ **Fewer loads** - Unauthorized users don't trigger component imports  

## Applying to Other Modules

To apply this pattern to other modules (SLA, Sales, etc.):

```javascript
// In module router file (e.g., sla.router.js)

import { authState } from '../../../services/authState.js';

function guardSLAAccess() {
  if (!authState.authenticated) return false;
  return authState.canAccess('/module/sla');
}

function withSLAGuard(renderFn) {
  return () => {
    if (!guardSLAAccess()) {
      return html`<access-denied></access-denied>`;
    }
    return renderFn();
  };
}

export const createSLARoutes = () => {
  const routes = [ /* ... */ ];
  
  return routes.map(route => ({
    ...route,
    render: withSLAGuard(route.render)
  }));
};
```

## Migration Checklist

- [x] Route wrapper enhanced with loading state
- [x] Admin routes protected with guard
- [ ] Apply same pattern to SLA module
- [ ] Apply same pattern to Sales module
- [ ] Apply same pattern to Commerce module
- [ ] Apply same pattern to GDocs module
- [ ] Test with different user roles
- [ ] Document in module READMEs

## Security Notes

⚠️ **Important**: These are client-side checks only. Always validate permissions on the backend.

✅ **Best Practice**: Use multiple security layers:
- Route guards (prevent route matching)
- Route wrapper (permission verification)
- Component checks (UI element visibility)
- API authorization (server-side validation)
