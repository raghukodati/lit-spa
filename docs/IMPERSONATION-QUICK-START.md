# User Impersonation - Quick Start Guide

## 🎭 What is User Impersonation?

Allows admins to temporarily view the application exactly as another user sees it. Perfect for:
- Troubleshooting user issues
- Testing permission configurations
- Support and training

## 🚀 Quick Start (3 Steps)

### 1. Access Impersonation Page

Navigate to: **`/users/impersonate`**

Or click **"Impersonate User"** in the admin menu (under Users section)

### 2. Select & Impersonate

- Search for the user by name, email, or username
- Click the **"Impersonate"** button next to their name
- Confirm the action

### 3. View as User

You now see exactly what they see:
- ⚠️ **Yellow banner** at top shows you're impersonating
- 🔒 Only their permissions
- 📱 Only their modules
- 🎨 Their UI and menu items

### Stop Impersonating

Click **"Stop Impersonation"** in the yellow banner → Confirm → Done!

---

## 💡 Adding Quick Impersonate to User List

Want to add an "Impersonate" button directly in the user management table? Here's how:

### Option 1: Add to User Actions Column

```javascript
// In user-management.js, add to the actions column

renderUserActions(user) {
  return html`
    <div class="btn-group btn-group-sm" role="group">
      <!-- Existing buttons -->
      <a href="/users/edit/${user.id}" class="btn btn-outline-primary">
        <i class="bi bi-pencil"></i> Edit
      </a>
      
      <!-- NEW: Impersonate button -->
      ${this._canImpersonate() ? html`
        <button 
          class="btn btn-outline-warning"
          @click=${() => this._handleQuickImpersonate(user)}
          ?disabled=${!user.active || this._isCurrentUser(user)}>
          <i class="bi bi-incognito"></i>
        </button>
      ` : ''}
    </div>
  `;
}

_canImpersonate() {
  return impersonationService.canImpersonate();
}

_isCurrentUser(user) {
  const currentUser = getCurrentUser();
  return currentUser.id === user.id;
}

async _handleQuickImpersonate(user) {
  if (!confirm(`Impersonate ${user.name}?`)) return;
  
  try {
    await impersonationService.startImpersonation(user);
    window.location.href = '/';
  } catch (error) {
    alert('Failed to impersonate: ' + error.message);
  }
}
```

### Option 2: Add to User Dropdown Menu

```javascript
// In user-management.js, add to dropdown actions

renderUserDropdown(user) {
  return html`
    <div class="dropdown">
      <button class="btn btn-sm btn-light dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown">
        Actions
      </button>
      <ul class="dropdown-menu">
        <li>
          <a class="dropdown-item" href="/users/edit/${user.id}">
            <i class="bi bi-pencil me-2"></i>Edit
          </a>
        </li>
        <li>
          <a class="dropdown-item" href="/users/${user.id}/assign-roles">
            <i class="bi bi-shield me-2"></i>Assign Roles
          </a>
        </li>
        
        <!-- NEW: Impersonate option -->
        ${this._canImpersonate() && user.active && !this._isCurrentUser(user) ? html`
          <li><hr class="dropdown-divider"></li>
          <li>
            <a class="dropdown-item text-warning" 
               href="#"
               @click=${(e) => { e.preventDefault(); this._handleQuickImpersonate(user); }}>
              <i class="bi bi-incognito me-2"></i>Impersonate
            </a>
          </li>
        ` : ''}
      </ul>
    </div>
  `;
}
```

### Option 3: Add Toolbar Button

```javascript
// In user-management.js, add button to toolbar

renderToolbar() {
  return html`
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">User Management</h4>
      <div class="btn-group" role="group">
        <a href="/users/new" class="btn btn-primary">
          <i class="bi bi-plus-circle me-1"></i>Add User
        </a>
        
        <!-- NEW: Impersonate button -->
        ${this._canImpersonate() ? html`
          <a href="/users/impersonate" class="btn btn-warning">
            <i class="bi bi-incognito me-1"></i>Impersonate User
          </a>
        ` : ''}
      </div>
    </div>
  `;
}
```

---

## 🔒 Security Features

### Automatic Restrictions
- ✅ Only admins can impersonate
- ✅ Can't impersonate yourself
- ✅ Can't impersonate super admins (unless you're one)
- ✅ Can't impersonate inactive users
- ✅ All actions are logged

### Visual Indicators
- ⚠️ **Yellow warning banner** always visible while impersonating
- 🔴 Shows who you're impersonating
- 🛑 Easy one-click stop button

### Audit Trail
Every impersonation is logged with:
- Who impersonated
- Who was impersonated
- When it started/stopped
- User agent/browser info

---

## 📝 Common Use Cases

### 1. Troubleshoot User Issue
```
User reports: "I can't see the Sales dashboard"

Admin actions:
1. Navigate to /users/impersonate
2. Search for the user
3. Click Impersonate
4. Verify: Sales module not in menu
5. Check: User's role assignments
6. Stop impersonation
7. Fix: Assign correct role
```

### 2. Test New Permissions
```
Created new role: "Sales Manager"

Admin actions:
1. Assign role to test user
2. Impersonate test user
3. Verify: All required features visible
4. Verify: Restricted features hidden
5. Stop impersonation
6. Adjust role permissions if needed
```

### 3. Provide Support
```
User needs help: "How do I create an order?"

Admin actions:
1. Impersonate user
2. See exactly what they see
3. Guide them step-by-step
4. Identify any permission issues
5. Stop impersonation
```

---

## ⚙️ Advanced Usage

### Check Impersonation State in Code

```javascript
import { impersonationService } from '@services/impersonation.service.js';

// Check if currently impersonating
if (impersonationService.isImpersonating()) {
  const status = impersonationService.getStatus();
  console.log('Impersonating:', status.impersonatedUser.name);
  console.log('Original admin:', status.originalUser.name);
}
```

### Subscribe to Impersonation Events

```javascript
// Listen for impersonation changes
window.addEventListener('impersonation-started', (e) => {
  console.log('Started impersonating:', e.detail.impersonatedUser);
  // Custom logic here
});

window.addEventListener('impersonation-stopped', (e) => {
  console.log('Stopped impersonating');
  // Custom logic here
});
```

### View Audit Log

```javascript
import { impersonationService } from '@services/impersonation.service.js';

// Get all impersonation events
const log = impersonationService.getAuditLog();

// Display in console table
console.table(log);

// Filter by admin
const myActions = log.filter(entry => entry.adminId === currentUser.id);
```

---

## 🐛 Troubleshooting

### Stuck in Impersonation?

```javascript
// Clear state manually
localStorage.removeItem('impersonation_state');
window.location.reload();
```

### Banner Not Showing?

Check that banner is imported in `app-shell.js`:
```javascript
import '@shared/components/impersonation-banner/impersonation-banner.js';
```

### Permissions Not Working?

Stop and restart impersonation to refresh:
```javascript
await impersonationService.stopImpersonation();
await impersonationService.startImpersonation(user);
```

---

## 📚 More Information

- **Full Documentation**: `/docs/USER-IMPERSONATION.md`
- **Implementation Details**: `/docs/IMPERSONATION-IMPLEMENTATION-SUMMARY.md`

---

## ⚡ Quick Reference

| Action | How To |
|--------|--------|
| **Start** | Go to `/users/impersonate` → Select user → Click Impersonate |
| **Stop** | Click "Stop Impersonation" in yellow banner |
| **Check Status** | `impersonationService.isImpersonating()` |
| **View Log** | `impersonationService.getAuditLog()` |
| **Clear State** | `localStorage.removeItem('impersonation_state')` |

---

## ✅ Success Indicators

When impersonation is working correctly:

✅ Yellow banner visible at top  
✅ Banner shows both admin and impersonated user names  
✅ Menu only shows impersonated user's modules  
✅ Routes respect impersonated user's permissions  
✅ "Stop Impersonation" button works  
✅ Audit log records events  

---

**Need Help?** Check the full documentation or console logs for errors.
