# User Impersonation Feature

## Overview

User impersonation allows administrators to temporarily view and interact with the application as another user. This is useful for:
- **Troubleshooting** - Reproduce user-reported issues
- **Support** - Help users with their specific views and permissions
- **Testing** - Verify permission configurations work correctly
- **Training** - Demonstrate features from a user's perspective

## Security Features

### Access Control
- **Admin/Super Admin Only** - Only users with admin privileges can impersonate
- **Can't Impersonate Self** - Prevents accidental confusion
- **Can't Impersonate Super Admins** - Regular admins cannot impersonate super admins
- **Session Persistence** - Impersonation state survives page refreshes (24hr max)

### Audit Logging
- **All Actions Logged** - START and STOP events recorded
- **Detailed Information** - Captures admin, target user, timestamp, user agent
- **Last 100 Entries** - Automatic log rotation
- **Stored Locally** - In `impersonation_audit` localStorage key

### Visual Indicators
- **Prominent Banner** - Yellow warning banner at top of screen
- **Clear Information** - Shows who is impersonating whom
- **Easy Exit** - One-click "Stop Impersonation" button

## Components

### 1. ImpersonationService (`services/impersonation.service.js`)

Core service managing impersonation state and logic.

**Key Methods:**

```javascript
// Check if current user can impersonate
impersonationService.canImpersonate() // boolean

// Start impersonating a user
await impersonationService.startImpersonation(targetUser)

// Stop impersonating
await impersonationService.stopImpersonation()

// Get effective user (impersonated or current)
const user = impersonationService.getEffectiveUser()

// Get original admin user
const admin = impersonationService.getOriginalUser()

// Check if currently impersonating
const isActive = impersonationService.isImpersonating()

// Get status
const status = impersonationService.getStatus()
// Returns: { isImpersonating, originalUser, impersonatedUser }

// Subscribe to changes
const unsubscribe = impersonationService.subscribe((status) => {
  console.log('Impersonation changed:', status);
});

// Get audit log
const log = impersonationService.getAuditLog()
```

### 2. ImpersonationBanner (`components/impersonation-banner`)

Visual indicator showing when admin is impersonating.

**Features:**
- Shows at top of screen (sticky)
- Displays both admin and target user names
- One-click stop button
- Auto-hides when not impersonating

### 3. UserImpersonation (`admin/components/users/user-impersonation.js`)

UI for selecting and starting impersonation.

**Features:**
- Search users by name, email, username
- Shows user roles and status
- Disabled for inactive users
- Security warnings
- One-click impersonate button

## Usage

### As an Administrator

#### 1. Access Impersonation UI

Navigate to: `/users/impersonate`

Or add a button in user management:

```html
<a href="/users/impersonate" class="btn btn-warning">
  <i class="bi bi-incognito"></i> Impersonate User
</a>
```

#### 2. Select User

- Use search to find the target user
- Click "Impersonate" button
- Confirm the action in the dialog

#### 3. While Impersonating

- **Yellow banner** appears at top showing impersonation status
- You see exactly what the user sees
- You have only the permissions the user has
- All module access matches the user's roles
- Menu items filtered by user's permissions

#### 4. Stop Impersonating

Click "Stop Impersonation" button in the banner:
- Confirms action
- Returns to your admin account
- Page reloads to restore full admin permissions

### Integration with Existing Code

The impersonation service hooks into `getCurrentUser()`:

```javascript
// authService.js automatically returns impersonated user
const user = getCurrentUser()
// Returns impersonated user if active, otherwise normal user
```

**All existing code works automatically:**
- Permission checks use impersonated user's permissions
- Module access reflects impersonated user's roles
- UI components see impersonated user
- No code changes needed in components

## Implementation Details

### State Management

Impersonation state stored in localStorage:

```javascript
// Key: 'impersonation_state'
{
  isImpersonating: true,
  originalUser: { id, name, email, ... },
  impersonatedUser: { id, name, email, ... },
  timestamp: 1699234567890
}
```

**Auto-expiration:** Sessions older than 24 hours are automatically cleared.

### Permission Updates

When impersonation starts:
1. Store original user
2. Set impersonated user
3. Call `initializeAbilities()` with impersonated user's roles
4. Dispatch `impersonation-started` event
5. Redirect to home page

When impersonation stops:
1. Clear impersonated user
2. Restore original user
3. Call `initializeAbilities()` with original user's roles
4. Dispatch `impersonation-stopped` event
5. Reload page

### Events

Components can listen for impersonation events:

```javascript
window.addEventListener('impersonation-started', (e) => {
  console.log('Impersonating:', e.detail.impersonatedUser);
  console.log('Original user:', e.detail.originalUser);
});

window.addEventListener('impersonation-stopped', (e) => {
  console.log('Stopped impersonating');
});
```

## Audit Log Format

```javascript
{
  id: "1699234567890.abc123",
  timestamp: "2024-11-06T15:30:00.000Z",
  action: "START", // or "STOP"
  adminId: 1,
  adminName: "John Admin",
  adminEmail: "admin@example.com",
  targetUserId: 5,
  targetUserName: "Jane User",
  targetUserEmail: "jane@example.com",
  userAgent: "Mozilla/5.0...",
  ip: "client-side" // Would be server IP in production
}
```

### Viewing Audit Log

```javascript
import { impersonationService } from '@services/impersonation.service.js';

const log = impersonationService.getAuditLog();
console.table(log);
```

### Clearing Audit Log

```javascript
// Admin only
impersonationService.clearAuditLog();
```

## Adding to Menu

Update `menu-config.json` to add impersonation to admin menu:

```json
{
  "id": "impersonate",
  "name": "Impersonate User",
  "path": "/users/impersonate",
  "icon": "incognito",
  "iconColor": "warning",
  "keywords": ["impersonate", "user", "support"],
  "permission": "users.read"
}
```

## Testing Scenarios

### Test 1: Basic Impersonation
1. Login as admin
2. Navigate to `/users/impersonate`
3. Select a sales user
4. Verify you see only sales module
5. Verify admin module is hidden
6. Stop impersonation
7. Verify admin module returns

### Test 2: Permission Verification
1. Impersonate user with `users.read` only
2. Try to access `/users/new`
3. Should see "Access Denied"
4. Navigate to `/users`
5. Should see user list but no edit/create buttons

### Test 3: Session Persistence
1. Start impersonating a user
2. Refresh the page
3. Verify impersonation banner still shows
4. Verify still seeing as impersonated user
5. Stop impersonation

### Test 4: Security Restrictions
1. Login as regular admin
2. Try to impersonate a super admin
3. Should see error message
4. Try to impersonate yourself
5. Should see error message

### Test 5: Audit Logging
1. Impersonate several users
2. Stop impersonation
3. Check audit log
4. Verify all actions logged with correct details

## Production Considerations

### Backend Implementation

In production, implement server-side impersonation:

```javascript
// POST /api/admin/impersonate
{
  targetUserId: 5
}

// Response includes JWT with impersonation claim
{
  token: "eyJ...",
  user: { ... },
  impersonation: {
    originalUserId: 1,
    targetUserId: 5
  }
}
```

### Security Enhancements

1. **Backend Validation**
   - Verify admin permissions on server
   - Log to secure audit system
   - Set session timeout

2. **IP Logging**
   - Capture real IP address server-side
   - Log geographic location

3. **Real-time Notifications**
   - Notify user when impersonated (optional)
   - Alert security team of impersonation events

4. **Rate Limiting**
   - Limit impersonation frequency
   - Alert on suspicious patterns

5. **MFA Verification**
   - Require MFA before impersonation
   - Additional confirmation step

## Troubleshooting

### Impersonation Stuck

If impersonation state is corrupted:

```javascript
// Clear state manually
localStorage.removeItem('impersonation_state');
window.location.reload();
```

### Permissions Not Updating

If permissions don't reflect impersonated user:

```javascript
import { impersonationService } from '@services/impersonation.service.js';

// Force permission update
await impersonationService.stopImpersonation();
await impersonationService.startImpersonation(targetUser);
```

### Banner Not Showing

Verify banner is imported in `app-shell.js`:

```javascript
import '@shared/components/impersonation-banner/impersonation-banner.js';
```

And rendered in template:

```html
<impersonation-banner></impersonation-banner>
```

## Files Created

1. `/src/services/impersonation.service.js` - Core service
2. `/src/shared/components/impersonation-banner/impersonation-banner.js` - Visual banner
3. `/src/modules/admin/components/users/user-impersonation.js` - UI component
4. `/docs/USER-IMPERSONATION.md` - This documentation

## Files Modified

1. `/src/services/authService.js` - Returns impersonated user
2. `/src/app-shell.js` - Imports and renders banner
3. `/src/modules/admin/routes/admin.router.js` - Adds impersonation route

## Future Enhancements

- [ ] Impersonation audit log viewer UI
- [ ] Time-limited impersonation sessions
- [ ] Notification to user being impersonated
- [ ] Impersonation reason field (required)
- [ ] Export audit logs to CSV
- [ ] Real-time impersonation monitoring dashboard
- [ ] Restrict impersonation by user groups
- [ ] Session recording during impersonation
