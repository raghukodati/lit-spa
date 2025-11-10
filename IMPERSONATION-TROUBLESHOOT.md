# Impersonation Menu Not Showing - Troubleshooting

## Immediate Steps

### Step 1: Check Browser Console

1. Open browser developer tools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Look for messages starting with 🎭
4. You should see:
   ```
   🎭 canImpersonate check: { hasAdminAccess: true, hasUsersPermission: true, result: true }
   🎭 Impersonation check: true
   🎭 Showing impersonate menu item
   ```

If you see error messages or `false` values, that's the problem!

### Step 2: Run Diagnostic Script

Copy and paste the entire contents of `CONSOLE-DEBUG.js` into your browser console.

It will check:
- ✅ Current user and roles
- ✅ Admin module access
- ✅ users.read permission
- ✅ canImpersonate() result
- ✅ Menu configuration

### Step 3: Quick Permission Check

Paste this in console:
```javascript
(async () => {
  const { hasModuleAccess } = await import('./src/services/dataService.js');
  const { hasPermission } = await import('./src/services/casl-permission.service.js');
  console.log('Has admin module:', hasModuleAccess('admin'));
  console.log('Has users.read:', hasPermission('users', 'read'));
})();
```

**Both must be `true`** for menu to show!

### Step 4: Clear Cache and Refresh

```javascript
// Paste in console
localStorage.removeItem('users_cache');
localStorage.removeItem('roles_cache');
location.reload();
```

Then hard refresh:
- **Mac**: Cmd + Shift + R
- **Windows/Linux**: Ctrl + Shift + F5

## Common Issues and Fixes

### Issue 1: `hasAdminAccess: false`

**Cause**: User doesn't have admin module access

**Fix**: 
1. Check user's assigned roles
2. Ensure at least one role has admin-related permissions (users, roles, permissions, etc.)

**Check roles:**
```javascript
const user = JSON.parse(localStorage.getItem('auth_user'));
const users = JSON.parse(localStorage.getItem('users_cache'));
const roles = JSON.parse(localStorage.getItem('roles_cache'));
const userDb = users.find(u => u.id === user.id);
const userRoles = userDb.assignedRoles.map(id => roles.find(r => r.id === id));
console.table(userRoles);
```

### Issue 2: `hasUsersPermission: false`

**Cause**: User's roles don't have `users.read` permission

**Fix**: Add `users.read` to user's role permissions

**Check permissions:**
```javascript
const user = JSON.parse(localStorage.getItem('auth_user'));
const users = JSON.parse(localStorage.getItem('users_cache'));
const roles = JSON.parse(localStorage.getItem('roles_cache'));
const userDb = users.find(u => u.id === user.id);
const userRoles = userDb.assignedRoles.map(id => roles.find(r => r.id === id));

userRoles.forEach(role => {
  console.log(`Role: ${role.name}`);
  console.log('Permissions:', role.permissions);
  console.log('Has users permissions:', role.permissions.users);
});
```

### Issue 3: Menu item not in config

**Verify config:**
```javascript
fetch('/src/shared/components/side-nav/menu-config.json')
  .then(r => r.json())
  .then(config => {
    const item = config.moduleSubmenus.admin.items.find(i => i.id === 'impersonate');
    console.log('Impersonate item:', item);
  });
```

Should show:
```json
{
  "id": "impersonate",
  "name": "Impersonate User",
  "path": "/users/impersonate",
  "icon": "incognito",
  "iconColor": "warning",
  "keywords": ["impersonate", "support", "troubleshoot"]
}
```

### Issue 4: JavaScript Errors

Check console for red error messages like:
- `Cannot read property 'canImpersonate' of undefined`
- `Module not found`
- `Unexpected token`

These indicate import/syntax errors.

## Manual Verification

### Test 1: Direct Navigation

Try navigating directly to:
```
http://localhost:5173/users/impersonate
```

- **If page loads**: Route works, menu filtering is the issue
- **If 404 error**: Route not configured
- **If access denied**: Permission check working but user lacks access

### Test 2: Force Show Menu Item

Temporarily disable the check:

1. Open `src/shared/components/side-nav/side-nav.js`
2. Find line ~269: `if (item.id === 'impersonate') {`
3. Comment out the entire block
4. Refresh

If menu appears, the canImpersonate() check is returning false.

## Expected Console Output (Working)

When menu is working correctly, you should see:

```
🎭 canImpersonate check: {
  hasAdminAccess: true,
  hasUsersPermission: true,
  result: true
}
🎭 Impersonation check: true
🎭 Showing impersonate menu item
```

## Expected Console Output (Not Working)

If menu isn't showing:

```
🎭 canImpersonate check: {
  hasAdminAccess: false,    ← Problem here!
  hasUsersPermission: true,
  result: false
}
🎭 Impersonation check: false
🎭 Hiding impersonate menu item - user lacks permission
```

or

```
🎭 canImpersonate check: {
  hasAdminAccess: true,
  hasUsersPermission: false,  ← Problem here!
  result: false
}
🎭 Impersonation check: false
🎭 Hiding impersonate menu item - user lacks permission
```

## Need More Help?

1. Run `CONSOLE-DEBUG.js` and share the output
2. Check what user roles are assigned
3. Check what permissions those roles have
4. Verify users_cache and roles_cache are populated in localStorage

## Quick Fix for Testing

To test the feature immediately with current user:

```javascript
// Temporarily grant yourself admin access
(async () => {
  const users = JSON.parse(localStorage.getItem('users_cache') || '[]');
  const roles = JSON.parse(localStorage.getItem('roles_cache') || '[]');
  const user = JSON.parse(localStorage.getItem('auth_user'));
  
  // Find admin role (usually ID 1)
  const adminRole = roles.find(r => r.name.includes('Admin'));
  
  // Find your user
  const userDb = users.find(u => u.id === user.id);
  
  if (userDb && adminRole) {
    // Add admin role
    if (!userDb.assignedRoles.includes(adminRole.id)) {
      userDb.assignedRoles.push(adminRole.id);
      localStorage.setItem('users_cache', JSON.stringify(users));
      console.log('✅ Added admin role, reloading...');
      location.reload();
    }
  }
})();
```

**⚠️ This is temporary! Changes only in browser cache.**
