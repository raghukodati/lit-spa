/**
 * User Impersonation Service
 * Allows admins to impersonate other users for troubleshooting and support
 */

import { getCurrentUser } from './authService.js';
import { hasModuleAccess, isSuperAdmin } from './dataService.js';
import { initializeAbilities, hasPermission } from './casl-permission.service.js';

const IMPERSONATION_KEY = 'impersonation_state';
const IMPERSONATION_AUDIT_KEY = 'impersonation_audit';

class ImpersonationService {
  constructor() {
    this._originalUser = null;
    this._impersonatedUser = null;
    this._isImpersonating = false;
    this._listeners = new Set();
    
    // Restore impersonation state on page load
    this._restoreState();
  }

  /**
   * Check if current user can impersonate others
   * Synchronous method - returns boolean immediately
   */
  canImpersonate() {
    try {
      // Must have admin module access and users.read permission
      // Using the original user (not impersonated) for this check
      const hasAdminAccess = hasModuleAccess('admin');
      const hasUsersPermission = hasPermission('users', 'read');
      const result = hasAdminAccess && hasUsersPermission;
      
      // Debug logging - only show when false to help troubleshooting
      if (!result) {
        console.log('🎭 canImpersonate check:', {
          hasAdminAccess,
          hasUsersPermission,
          result
        });
      }
      
      return result;
    } catch (error) {
      console.error('🎭 Error in canImpersonate:', error);
      return false;
    }
  }

  /**
   * Start impersonating a user
   */
  async startImpersonation(targetUser) {
    // Security check
    if (!this.canImpersonate()) {
      throw new Error('Permission denied: Only admins can impersonate users');
    }

    // Can't impersonate yourself
    const currentUser = getCurrentUser();
    if (currentUser.id === targetUser.id) {
      throw new Error('Cannot impersonate yourself');
    }

    // Optional: Add additional security checks here if needed
    // For now, any user with admin access can impersonate any other user

    // Store original user if not already impersonating
    if (!this._isImpersonating) {
      this._originalUser = currentUser;
    }

    // Set impersonated user
    this._impersonatedUser = targetUser;
    this._isImpersonating = true;

    // Save state
    this._saveState();

    // Log the impersonation
    this._logImpersonation(currentUser, targetUser, 'START');

    // Update abilities with impersonated user's permissions
    await this._updatePermissions();

    // Notify listeners
    this._notifyListeners();

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('impersonation-started', {
      detail: {
        originalUser: this._originalUser,
        impersonatedUser: this._impersonatedUser
      }
    }));

    console.log(`🎭 Impersonation started: ${currentUser.name} -> ${targetUser.name}`);
  }

  /**
   * Stop impersonating and return to original user
   */
  async stopImpersonation() {
    if (!this._isImpersonating) {
      return;
    }

    const originalUser = this._originalUser;
    const impersonatedUser = this._impersonatedUser;

    // Reset state
    this._isImpersonating = false;
    this._impersonatedUser = null;
    this._originalUser = null;

    // Clear stored state
    this._clearState();

    // Log the end of impersonation
    this._logImpersonation(originalUser, impersonatedUser, 'STOP');

    // Restore original user's permissions
    await this._updatePermissions();

    // Notify listeners
    this._notifyListeners();

    // Dispatch event
    window.dispatchEvent(new CustomEvent('impersonation-stopped', {
      detail: { originalUser, impersonatedUser }
    }));

    console.log(`🎭 Impersonation stopped: ${originalUser.name} resumed control`);

    // Reload to refresh all state
    window.location.reload();
  }

  /**
   * Get the effective user (impersonated if active, otherwise current)
   */
  getEffectiveUser() {
    if (this._isImpersonating && this._impersonatedUser) {
      return this._impersonatedUser;
    }
    return getCurrentUser();
  }

  /**
   * Get the original user (admin who started impersonation)
   */
  getOriginalUser() {
    return this._originalUser;
  }

  /**
   * Check if currently impersonating
   */
  isImpersonating() {
    return this._isImpersonating;
  }

  /**
   * Get impersonation status
   */
  getStatus() {
    return {
      isImpersonating: this._isImpersonating,
      originalUser: this._originalUser,
      impersonatedUser: this._impersonatedUser
    };
  }

  /**
   * Subscribe to impersonation changes
   */
  subscribe(callback) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  /**
   * Get impersonation audit log
   */
  getAuditLog() {
    try {
      return JSON.parse(localStorage.getItem(IMPERSONATION_AUDIT_KEY) || '[]');
    } catch (error) {
      console.error('Failed to load impersonation audit log:', error);
      return [];
    }
  }

  /**
   * Clear impersonation audit log (admin only)
   */
  clearAuditLog() {
    if (!this.canImpersonate()) {
      throw new Error('Permission denied');
    }
    localStorage.removeItem(IMPERSONATION_AUDIT_KEY);
  }

  // Private methods

  _saveState() {
    try {
      const state = {
        isImpersonating: this._isImpersonating,
        originalUser: this._originalUser,
        impersonatedUser: this._impersonatedUser,
        timestamp: Date.now()
      };
      localStorage.setItem(IMPERSONATION_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save impersonation state:', error);
    }
  }

  _restoreState() {
    try {
      const stored = localStorage.getItem(IMPERSONATION_KEY);
      if (!stored) return;

      const state = JSON.parse(stored);
      
      // Check if state is not too old (max 24 hours)
      const maxAge = 24 * 60 * 60 * 1000;
      if (Date.now() - state.timestamp > maxAge) {
        this._clearState();
        return;
      }

      this._isImpersonating = state.isImpersonating;
      this._originalUser = state.originalUser;
      this._impersonatedUser = state.impersonatedUser;

      if (this._isImpersonating) {
        console.log('🎭 Restored impersonation session');
        this._updatePermissions();
      }
    } catch (error) {
      console.error('Failed to restore impersonation state:', error);
      this._clearState();
    }
  }

  _clearState() {
    localStorage.removeItem(IMPERSONATION_KEY);
  }

  _logImpersonation(fromUser, toUser, action) {
    try {
      const log = this.getAuditLog();
      const entry = {
        id: Date.now() + Math.random().toString(36),
        timestamp: new Date().toISOString(),
        action,
        adminId: fromUser.id,
        adminName: fromUser.name,
        adminEmail: fromUser.email,
        targetUserId: toUser.id,
        targetUserName: toUser.name,
        targetUserEmail: toUser.email,
        userAgent: navigator.userAgent,
        ip: 'client-side' // Would be set by backend in real implementation
      };

      log.unshift(entry);

      // Keep only last 100 entries
      const trimmedLog = log.slice(0, 100);
      localStorage.setItem(IMPERSONATION_AUDIT_KEY, JSON.stringify(trimmedLog));
    } catch (error) {
      console.error('Failed to log impersonation:', error);
    }
  }

  async _updatePermissions() {
    const effectiveUser = this.getEffectiveUser();
    
    // Get user's roles
    const users = JSON.parse(localStorage.getItem('users_cache') || '[]');
    const userFromDb = users.find(u => u.id === effectiveUser.id);
    const roles = JSON.parse(localStorage.getItem('roles_cache') || '[]');
    
    const userRoles = (userFromDb?.assignedRoles || [])
      .map(roleId => roles.find(r => r.id === roleId))
      .filter(Boolean);

    // Reinitialize abilities with impersonated user's permissions
    await initializeAbilities(effectiveUser, userRoles);
    
    console.log(`🔐 Permissions updated for: ${effectiveUser.name}`);
  }

  _notifyListeners() {
    const status = this.getStatus();
    this._listeners.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in impersonation listener:', error);
      }
    });
  }
}

// Export singleton instance
export const impersonationService = new ImpersonationService();

export default impersonationService;
