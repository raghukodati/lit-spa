/**
 * Permission Context - Manages CASL abilities across the application
 */

import { createContext } from './Context.js';
import { abilityService } from '../../services/ability.service.js';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  canAccessRoute,
  isAdmin,
  getUserPermissionsSummary
} from '../../services/casl-permission.service.js';

/**
 * Permission Context Definition
 */
export const PermissionContext = createContext('permission-context', {
  ability: null,
  isInitialized: false,
  summary: null
});

/**
 * Permission Context Provider Class
 * Use this to provide permission context in app root
 */
export class PermissionContextProvider {
  constructor() {
    this._context = PermissionContext;
    this._updateContext();
  }

  /**
   * Get the context instance
   */
  get context() {
    return this._context;
  }

  /**
   * Update context with current ability state
   */
  _updateContext() {
    this._context.value = {
      ability: abilityService.ability,
      isInitialized: !!abilityService.ability,
      summary: abilityService.ability ? getUserPermissionsSummary() : null
    };
  }

  /**
   * Initialize abilities with user and roles
   */
  async initialize(user, roles = []) {
    try {
      abilityService.init(user, roles);
      this._updateContext();
    } catch (error) {
      console.error('Failed to initialize permissions:', error);
    }
  }

  /**
   * Update abilities (e.g., after role change)
   */
  update(user, roles = []) {
    abilityService.update(user, roles);
    this._updateContext();
  }

  /**
   * Clear abilities (e.g., on logout)
   */
  clear() {
    abilityService.clear();
    this._context.value = {
      ability: null,
      isInitialized: false,
      summary: null
    };
  }

  /**
   * Refresh permission summary
   */
  refresh() {
    this._updateContext();
  }

  /**
   * Check if user can perform action
   */
  can(entity, action, conditions = null) {
    return hasPermission(entity, action, conditions);
  }

  /**
   * Check if user has any of the permissions
   */
  canAny(entity, actions) {
    return hasAnyPermission(entity, actions);
  }

  /**
   * Check if user has all permissions
   */
  canAll(entity, actions) {
    return hasAllPermissions(entity, actions);
  }

  /**
   * Check if user can access route
   */
  canAccessRoute(route) {
    return canAccessRoute(route);
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return isAdmin();
  }
}

// Singleton instance
export const permissionContextProvider = new PermissionContextProvider();

// Convenience exports
export default PermissionContext;
