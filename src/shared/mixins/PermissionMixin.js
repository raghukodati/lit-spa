/**
 * Permission Mixin - Add permission checking to Lit components
 * Integrates CASL ability service with Lit's reactive properties
 */

import { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, canAccessRoute } from '../../services/casl-permission.service.js';
import { Actions, Subjects } from '../../services/ability.service.js';

/**
 * Mixin that adds permission checking capabilities to Lit components
 * 
 * @example
 * class MyComponent extends PermissionMixin(LitElement) {
 *   render() {
 *     return html`
 *       ${this.can('users', 'create') ? html`<button>Create User</button>` : ''}
 *     `;
 *   }
 * }
 */
export const PermissionMixin = (superClass) => {
  return class extends superClass {
    /**
     * Check if user can perform action on entity
     * 
     * @param {string} entity - Entity name
     * @param {string} action - Action to perform
     * @param {Object} conditions - Optional conditions
     * @returns {boolean}
     */
    can(entity, action, conditions = null) {
      return hasPermission(entity, action, conditions);
    }

    /**
     * Check if user cannot perform action
     */
    cannot(entity, action, conditions = null) {
      return !this.can(entity, action, conditions);
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
     * Check if user is admin
     */
    isAdmin() {
      return isAdmin();
    }

    /**
     * Check if user can access route
     */
    canAccessRoute(route) {
      return canAccessRoute(route);
    }

    /**
     * Guard: Show element only if permission exists
     * 
     * @example
     * ${this.ifCan('users', 'create', html`<button>Create</button>`)}
     */
    ifCan(entity, action, template, fallback = null) {
      return this.can(entity, action) ? template : (fallback || '');
    }

    /**
     * Guard: Show element only if user is admin
     */
    ifAdmin(template, fallback = null) {
      return this.isAdmin() ? template : (fallback || '');
    }

    /**
     * Permission-based CSS classes
     * 
     * @example
     * class=${this.permClass('users', 'delete', 'show-delete', 'hide-delete')}
     */
    permClass(entity, action, activeClass, inactiveClass = '') {
      return this.can(entity, action) ? activeClass : inactiveClass;
    }

    /**
     * Batch permission check
     * 
     * @example
     * const perms = this.checkPerms({
     *   create: ['users', 'create'],
     *   edit: ['users', 'update'],
     *   delete: ['users', 'delete']
     * });
     */
    checkPerms(permMap) {
      const result = {};
      Object.entries(permMap).forEach(([key, [entity, action]]) => {
        result[key] = this.can(entity, action);
      });
      return result;
    }
  };
};

/**
 * Permission directive for Lit templates
 * More declarative approach
 * 
 * @example
 * import { ifPermission } from './PermissionMixin.js';
 * 
 * render() {
 *   return html`
 *     ${ifPermission('users', 'create', html`<button>Create</button>`)}
 *   `;
 * }
 */
export function ifPermission(entity, action, template, fallback = null) {
  return hasPermission(entity, action) ? template : (fallback || '');
}

/**
 * Multiple permissions check directive
 * 
 * @example
 * ${ifAnyPermission('users', ['create', 'update'], html`<button>Edit</button>`)}
 */
export function ifAnyPermission(entity, actions, template, fallback = null) {
  return hasAnyPermission(entity, actions) ? template : (fallback || '');
}

/**
 * Admin-only directive
 * 
 * @example
 * ${ifAdmin(html`<button>Admin Panel</button>`)}
 */
export function ifAdmin(template, fallback = null) {
  return isAdmin() ? template : (fallback || '');
}

// Re-export Actions and Subjects for convenience
export { Actions, Subjects };
