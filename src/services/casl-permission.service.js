/**
 * CASL Permission Service - Bridge between legacy permission system and CASL
 * Provides backward compatibility while leveraging CASL's power
 */

import { abilityService, Actions, Subjects } from './ability.service.js';
import { getCurrentUser } from './authService.js';
import { entities, permissionTypes } from './coreService.js';

// Re-export entities and permissionTypes for backward compatibility
export { entities, permissionTypes };

/**
 * Initialize CASL abilities with user and roles
 */
export async function initializeAbilities(user, roles = []) {
  abilityService.init(user, roles);
  
  // Cache for quick access
  if (typeof window !== 'undefined') {
    window.__ability = abilityService.ability;
  }
}

/**
 * Check if user has permission (CASL-backed)
 * 
 * @param {string} entity - Entity/Subject name
 * @param {string} action - Action to perform
 * @param {Object} conditions - Optional conditions
 * @returns {boolean}
 */
export function hasPermission(entity, action, conditions = null) {
  const subject = mapLegacyEntityToSubject(entity);
  return abilityService.can(action, subject, conditions);
}

/**
 * Check if user has any of the permissions
 */
export function hasAnyPermission(entity, actions) {
  return actions.some(action => hasPermission(entity, action));
}

/**
 * Check if user has all permissions
 */
export function hasAllPermissions(entity, actions) {
  return actions.every(action => hasPermission(entity, action));
}

/**
 * Check if user can access route
 */
export function canAccessRoute(route) {
  return abilityService.canAccessRoute(route);
}

/**
 * Check if user is admin
 */
export function isAdmin() {
  return abilityService.isAdmin();
}

/**
 * Get user's permissions summary
 */
export function getUserPermissionsSummary() {
  return abilityService.getPermissionsSummary();
}

/**
 * Map legacy entity names to CASL subjects
 */
function mapLegacyEntityToSubject(entity) {
  const mapping = {
    'users': Subjects.USER,
    'roles': Subjects.ROLE,
    'permissions': Subjects.PERMISSION,
    'settings': Subjects.SETTINGS,
    'customers': Subjects.CUSTOMER,
    'customer_orgs': Subjects.ORGANIZATION,
    'orders': Subjects.ORDER,
    'products': Subjects.PRODUCT,
    'incidents': Subjects.INCIDENT,
    'reports': Subjects.REPORT,
    'analytics': Subjects.ANALYTICS
  };

  return mapping[entity] || entity;
}

/**
 * Higher-order function to check permissions before executing
 * 
 * @example
 * const deleteUser = requirePermission('users', 'delete')(async (userId) => {
 *   // Delete user logic
 * });
 */
export function requirePermission(entity, action) {
  return function(fn) {
    return function(...args) {
      if (!hasPermission(entity, action)) {
        throw new Error(`Permission denied: ${action} ${entity}`);
      }
      return fn.apply(this, args);
    };
  };
}

/**
 * Decorator for methods that require permissions
 * 
 * @example
 * class UserService {
 *   @RequirePermission('users', 'delete')
 *   async deleteUser(id) { ... }
 * }
 */
export function RequirePermission(entity, action) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args) {
      if (!hasPermission(entity, action)) {
        throw new Error(`Permission denied: ${action} ${entity}`);
      }
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

/**
 * Get current ability instance (advanced usage)
 */
export function getAbility() {
  return abilityService.ability;
}

/**
 * Update abilities (e.g., after role change)
 */
export function updateAbilities(user, roles = []) {
  abilityService.update(user, roles);
}

/**
 * Clear abilities (e.g., on logout)
 */
export function clearAbilities() {
  abilityService.clear();
}

// Re-export Actions and Subjects for convenience
export { Actions, Subjects };

/**
 * Utility: Check multiple permissions at once
 * 
 * @example
 * const perms = checkPermissions({
 *   canEditUsers: ['users', 'update'],
 *   canDeleteUsers: ['users', 'delete'],
 *   canViewReports: ['reports', 'read']
 * });
 * // { canEditUsers: true, canDeleteUsers: false, canViewReports: true }
 */
export function checkPermissions(permissionMap) {
  const result = {};
  
  Object.entries(permissionMap).forEach(([key, [entity, action]]) => {
    result[key] = hasPermission(entity, action);
  });
  
  return result;
}

/**
 * Permission guard for routes
 * Returns true if user can access, or redirects to access denied
 */
export function guardRoute(route, redirectFn = null) {
  const canAccess = canAccessRoute(route);
  
  if (!canAccess && redirectFn) {
    redirectFn('/access-denied');
  }
  
  return canAccess;
}

/**
 * Reactive permission checker (for Lit components)
 * Returns an object that updates when permissions change
 */
export class PermissionChecker {
  constructor() {
    this._listeners = new Set();
  }

  /**
   * Check permission and subscribe to changes
   */
  can(entity, action, callback) {
    const check = () => hasPermission(entity, action);
    
    if (callback) {
      this._listeners.add(callback);
      callback(check());
    }
    
    return check();
  }

  /**
   * Notify all listeners (call when permissions change)
   */
  notifyChange() {
    this._listeners.forEach(callback => callback());
  }

  /**
   * Clear all listeners
   */
  clear() {
    this._listeners.clear();
  }
}

export const permissionChecker = new PermissionChecker();

/**
 * Get user permissions from cached roles (for legacy compatibility)
 * This provides a synchronous way to access permissions
 */
export function getUserPermissions() {
  const user = getCurrentUser();
  if (!user) return {};
  
  // Get user's assigned roles from cache
  const users = JSON.parse(localStorage.getItem('users_cache') || '[]');
  const userFromDb = users.find(u => u.id === user.id);
  if (!userFromDb || !userFromDb.assignedRoles) return {};
  
  // Get roles from cache
  const roles = JSON.parse(localStorage.getItem('roles_cache') || '[]');
  
  // Combine permissions from all assigned roles
  const combinedPermissions = {};
  
  userFromDb.assignedRoles.forEach(roleId => {
    const role = roles.find(r => r.id === roleId);
    if (role && role.permissions) {
      Object.keys(role.permissions).forEach(entity => {
        if (!combinedPermissions[entity]) {
          combinedPermissions[entity] = [];
        }
        // Merge permissions, avoiding duplicates
        role.permissions[entity].forEach(perm => {
          if (!combinedPermissions[entity].includes(perm)) {
            combinedPermissions[entity].push(perm);
          }
        });
      });
    }
  });
  
  return combinedPermissions;
}

/**
 * Initialize permission cache for synchronous access
 * Should be called after roles/users are loaded
 */
export async function initializePermissionCache(users, roles) {
  try {
    // Accept pre-loaded users and roles to avoid circular dependencies
    if (users && roles) {
      localStorage.setItem('users_cache', JSON.stringify(users));
      localStorage.setItem('roles_cache', JSON.stringify(roles));
    }
  } catch (error) {
    console.error('Failed to initialize permission cache:', error);
  }
}
