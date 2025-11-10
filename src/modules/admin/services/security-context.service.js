/**
 * Security Context Service
 * Manages security context and provides centralized authorization checks
 */

import { abilityService } from '../../../services/ability.service.js';
import { getCurrentUser } from '../../../services/authService.js';
import {
  checkAppPermission,
  checkModulePermission,
  checkEntityPermission,
  checkFieldPermission,
  checkRecordPermission,
  filterRecordsByScope,
  PermissionScopes
} from './permission.service.js';

/**
 * Security Context
 */
class SecurityContext {
  constructor() {
    this._user = null;
    this._roles = [];
    this._permissions = {};
    this._initialized = false;
    this._auditLog = [];
  }

  /**
   * Initialize security context with user and roles
   */
  async initialize(user = null, roles = []) {
    if (!user) {
      user = getCurrentUser();
    }

    this._user = user;
    this._roles = roles;
    this._initialized = true;

    // Initialize ability service
    abilityService.init(user, roles);

    // Build permission cache
    this._buildPermissionCache();

    this._logAudit('SECURITY_CONTEXT_INITIALIZED', {
      userId: user?.id,
      roleIds: roles.map(r => r.id)
    });
  }

  /**
   * Build permission cache for quick access
   */
  _buildPermissionCache() {
    if (!this._user) return;

    this._permissions = {
      app: {},
      modules: {},
      entities: {}
    };

    // Cache role permissions
    this._roles.forEach(role => {
      // Module permissions
      if (role.moduleAccess) {
        Object.entries(role.moduleAccess).forEach(([module, access]) => {
          this._permissions.modules[module] = access;
        });
      }

      // Entity permissions
      if (role.permissions) {
        Object.entries(role.permissions).forEach(([entity, actions]) => {
          if (!this._permissions.entities[entity]) {
            this._permissions.entities[entity] = new Set();
          }
          actions.forEach(action => this._permissions.entities[entity].add(action));
        });
      }
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this._initialized && this._user !== null;
  }

  /**
   * Get current user
   */
  getUser() {
    return this._user;
  }

  /**
   * Get user roles
   */
  getRoles() {
    return this._roles;
  }

  /**
   * Get user's security context
   */
  getSecurityContext() {
    if (!this._user) return null;

    return {
      userId: this._user.id,
      username: this._user.username,
      roles: this._roles.map(r => r.id),
      roleNames: this._roles.map(r => r.name),
      scope: this._user.permissionScope || PermissionScopes.OWN,
      organizationId: this._user.organizationId,
      departmentId: this._user.departmentId,
      teamId: this._user.teamId,
      attributes: this._user.attributes || {},
      mfaEnabled: this._user.mfaEnabled || false
    };
  }

  /**
   * Check app-level permission
   */
  can(action, subject, conditions = null) {
    this._ensureInitialized();
    const result = abilityService.can(action, subject, conditions);
    
    if (result) {
      this._logAudit('PERMISSION_GRANTED', {
        action,
        subject,
        conditions
      });
    }
    
    return result;
  }

  /**
   * Check if user cannot perform action
   */
  cannot(action, subject, conditions = null) {
    return !this.can(action, subject, conditions);
  }

  /**
   * Check module access
   */
  canAccessModule(moduleId) {
    this._ensureInitialized();
    return checkModulePermission(moduleId, 'read');
  }

  /**
   * Check entity permission
   */
  canAccessEntity(entity, action) {
    this._ensureInitialized();
    return checkEntityPermission(entity, action);
  }

  /**
   * Check field permission
   */
  canAccessField(entity, field, action) {
    this._ensureInitialized();
    return checkFieldPermission(entity, field, action);
  }

  /**
   * Check record permission with scope
   */
  canAccessRecord(entity, action, record) {
    this._ensureInitialized();
    const scope = this._user?.permissionScope || PermissionScopes.OWN;
    return checkRecordPermission(entity, action, record, scope);
  }

  /**
   * Filter records based on user's scope
   */
  filterRecords(records, entity) {
    this._ensureInitialized();
    const scope = this._user?.permissionScope || PermissionScopes.OWN;
    return filterRecordsByScope(records, entity, scope);
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    this._ensureInitialized();
    return abilityService.isAdmin();
  }

  /**
   * Check if user has specific role
   */
  hasRole(roleName) {
    this._ensureInitialized();
    return this._roles.some(r => r.name === roleName);
  }

  /**
   * Check if user has any of the roles
   */
  hasAnyRole(roleNames) {
    this._ensureInitialized();
    return roleNames.some(name => this.hasRole(name));
  }

  /**
   * Check if user has all roles
   */
  hasAllRoles(roleNames) {
    this._ensureInitialized();
    return roleNames.every(name => this.hasRole(name));
  }

  /**
   * Get permission summary
   */
  getPermissionSummary() {
    this._ensureInitialized();
    return abilityService.getPermissionsSummary();
  }

  /**
   * Check if action requires MFA
   */
  requiresMfa(action, subject) {
    this._ensureInitialized();
    
    // High-risk actions require MFA
    const highRiskActions = ['delete', 'manage'];
    const criticalSubjects = ['User', 'Role', 'Permission', 'Settings'];
    
    return highRiskActions.includes(action) || criticalSubjects.includes(subject);
  }

  /**
   * Validate MFA before action
   */
  async validateMfa(action, subject) {
    if (!this.requiresMfa(action, subject)) {
      return true;
    }

    if (!this._user?.mfaEnabled) {
      throw new Error('MFA is required for this action but not enabled for user');
    }

    // In real implementation, this would prompt for MFA
    // For now, return true if MFA is enabled
    return true;
  }

  /**
   * Log security audit event
   */
  _logAudit(event, details = {}) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      event,
      userId: this._user?.id,
      username: this._user?.username,
      details,
      ip: this._user?.lastLoginIp || 'unknown'
    };

    this._auditLog.push(auditEntry);

    // Keep only last 1000 entries
    if (this._auditLog.length > 1000) {
      this._auditLog.shift();
    }

    // In production, send to audit service
    if (process.env.NODE_ENV === 'production') {
      this._sendToAuditService(auditEntry);
    }
  }

  /**
   * Send audit entry to backend (stub)
   */
  _sendToAuditService(entry) {
    // Implement actual audit service integration
    console.log('[AUDIT]', entry);
  }

  /**
   * Get audit log
   */
  getAuditLog(limit = 100) {
    return this._auditLog.slice(-limit);
  }

  /**
   * Ensure context is initialized
   */
  _ensureInitialized() {
    if (!this._initialized) {
      throw new Error('Security context not initialized. Call initialize() first.');
    }
  }

  /**
   * Clear security context (logout)
   */
  clear() {
    this._logAudit('SECURITY_CONTEXT_CLEARED', {
      userId: this._user?.id
    });

    this._user = null;
    this._roles = [];
    this._permissions = {};
    this._initialized = false;
    
    abilityService.clear();
  }

  /**
   * Refresh context (e.g., after role change)
   */
  async refresh() {
    if (this._user) {
      await this.initialize(this._user);
    }
  }
}

// Export singleton instance
export const securityContext = new SecurityContext();

/**
 * Security Guard - Higher-order function for protecting operations
 */
export function requirePermission(action, subject, options = {}) {
  return async function(fn) {
    return async function(...args) {
      // Check permission
      if (!securityContext.can(action, subject)) {
        const error = new Error(`Permission denied: ${action} ${subject}`);
        error.code = 'PERMISSION_DENIED';
        throw error;
      }

      // Check MFA if required
      if (options.requireMfa || securityContext.requiresMfa(action, subject)) {
        try {
          await securityContext.validateMfa(action, subject);
        } catch (error) {
          error.code = 'MFA_REQUIRED';
          throw error;
        }
      }

      // Execute function
      return await fn.apply(this, args);
    };
  };
}

/**
 * Decorator for protecting class methods
 */
export function Protected(action, subject, options = {}) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args) {
      if (!securityContext.can(action, subject)) {
        throw new Error(`Permission denied: ${action} ${subject}`);
      }

      if (options.requireMfa || securityContext.requiresMfa(action, subject)) {
        await securityContext.validateMfa(action, subject);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Route guard function
 */
export function canActivateRoute(route, metadata = {}) {
  if (!securityContext.isAuthenticated()) {
    return {
      allowed: false,
      redirect: '/login',
      reason: 'Not authenticated'
    };
  }

  // Check required permissions
  if (metadata.permissions) {
    const { action, subject } = metadata.permissions;
    if (!securityContext.can(action, subject)) {
      return {
        allowed: false,
        redirect: '/access-denied',
        reason: 'Insufficient permissions'
      };
    }
  }

  // Check required roles
  if (metadata.roles) {
    if (!securityContext.hasAnyRole(metadata.roles)) {
      return {
        allowed: false,
        redirect: '/access-denied',
        reason: 'Insufficient role'
      };
    }
  }

  return {
    allowed: true
  };
}

/**
 * Component guard - Use in Lit components
 */
export function guardComponent(permissions = {}) {
  const { action, subject } = permissions;
  
  return function(targetClass) {
    const originalConnectedCallback = targetClass.prototype.connectedCallback;
    
    targetClass.prototype.connectedCallback = function() {
      if (!securityContext.can(action, subject)) {
        this.innerHTML = '<div class="alert alert-danger">Access Denied</div>';
        return;
      }
      
      if (originalConnectedCallback) {
        originalConnectedCallback.call(this);
      }
    };
    
    return targetClass;
  };
}

export default securityContext;
