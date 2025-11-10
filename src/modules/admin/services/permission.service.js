/**
 * Permission Service - Enterprise-Grade Permission Management
 * Implements multi-level security: App, Module, Entity, and Field level
 */

import { get } from '../../../services/api.js';
import { abilityService } from '../../../services/ability.service.js';

// Cache for permissions data
let permissionsCache = [];
let permissionGroupsCache = [];
let scopesCache = [];

/**
 * Permission Scopes - Define data visibility levels
 */
export const PermissionScopes = {
  GLOBAL: 'global',           // Access to all data
  ORGANIZATION: 'organization', // Access to organization data
  DEPARTMENT: 'department',   // Access to department data  
  TEAM: 'team',               // Access to team data
  OWN: 'own',                 // Access to own data only
  CUSTOM: 'custom'            // Custom scope with conditions
};

/**
 * Security Levels
 */
export const SecurityLevels = {
  APP: 'app',           // Application-wide access
  MODULE: 'module',     // Module-level access
  ENTITY: 'entity',     // Entity/Resource-level access
  FIELD: 'field',       // Field-level access
  RECORD: 'record'      // Record/Row-level access
};

/**
 * Permission Categories
 */
export const PermissionCategories = {
  DATA: 'data',
  SYSTEM: 'system',
  SECURITY: 'security',
  REPORTS: 'reports',
  INTEGRATION: 'integration'
};

/**
 * Load permissions from API/mock
 */
async function loadPermissions() {
  if (permissionsCache.length === 0) {
    try {
      permissionsCache = await get('/permissions.json');
    } catch (error) {
      console.error('Failed to load permissions:', error);
      permissionsCache = [];
    }
  }
  return permissionsCache;
}

/**
 * Load permission groups
 */
async function loadPermissionGroups() {
  if (permissionGroupsCache.length === 0) {
    try {
      permissionGroupsCache = await get('/permission-groups.json');
    } catch (error) {
      console.error('Failed to load permission groups:', error);
      permissionGroupsCache = getDefaultPermissionGroups();
    }
  }
  return permissionGroupsCache;
}

/**
 * Load permission scopes
 */
async function loadScopes() {
  if (scopesCache.length === 0) {
    try {
      scopesCache = await get('/permission-scopes.json');
    } catch (error) {
      console.error('Failed to load scopes:', error);
      scopesCache = getDefaultScopes();
    }
  }
  return scopesCache;
}

/**
 * Get all permissions
 */
export async function getPermissions() {
  return await loadPermissions();
}

/**
 * Get permission by ID
 */
export async function getPermissionById(id) {
  const permissions = await loadPermissions();
  return permissions.find(p => p.id === id) || null;
}

/**
 * Get permissions by entity
 */
export async function getPermissionsByEntity(entityId) {
  const permissions = await loadPermissions();
  return permissions.filter(p => p.entity === entityId);
}

/**
 * Get permissions by module
 */
export async function getPermissionsByModule(moduleId) {
  const permissions = await loadPermissions();
  return permissions.filter(p => p.module === moduleId);
}

/**
 * Get permission groups
 */
export async function getPermissionGroups() {
  return await loadPermissionGroups();
}

/**
 * Get scopes
 */
export async function getScopes() {
  return await loadScopes();
}

/**
 * Check app-level permission
 * @param {string} action - Action to check
 * @returns {boolean}
 */
export function checkAppPermission(action) {
  // Check if user has app-level permission
  return abilityService.can(action, 'Application');
}

/**
 * Check module-level permission
 * @param {string} moduleId - Module identifier
 * @param {string} action - Action to check
 * @returns {boolean}
 */
export function checkModulePermission(moduleId, action) {
  // First check app-level access
  if (checkAppPermission('manage')) return true;
  
  // Check module-specific permission
  return abilityService.can(action, `Module:${moduleId}`);
}

/**
 * Check entity-level permission
 * @param {string} entity - Entity type
 * @param {string} action - Action to perform
 * @param {Object} conditions - Optional conditions
 * @returns {boolean}
 */
export function checkEntityPermission(entity, action, conditions = null) {
  return abilityService.can(action, entity, conditions);
}

/**
 * Check field-level permission
 * @param {string} entity - Entity type
 * @param {string} field - Field name
 * @param {string} action - Action (read/write)
 * @param {Object} record - Record data
 * @returns {boolean}
 */
export function checkFieldPermission(entity, field, action, record = null) {
  // Check entity permission first
  if (!checkEntityPermission(entity, action, record)) {
    return false;
  }
  
  // Check field-specific restrictions
  const user = getCurrentUserFromCache();
  if (!user) return false;
  
  // Get field restrictions from user's roles
  const fieldRestrictions = getFieldRestrictionsForUser(user, entity);
  
  if (fieldRestrictions && fieldRestrictions[field]) {
    const fieldPerm = fieldRestrictions[field];
    
    if (action === 'read') {
      return fieldPerm.readable !== false;
    } else if (action === 'write' || action === 'update') {
      return fieldPerm.writable !== false;
    }
  }
  
  return true;
}

/**
 * Check record-level permission with scope
 * @param {string} entity - Entity type
 * @param {string} action - Action to perform
 * @param {Object} record - Record data
 * @param {string} scope - Permission scope
 * @returns {boolean}
 */
export function checkRecordPermission(entity, action, record, scope = PermissionScopes.GLOBAL) {
  const user = getCurrentUserFromCache();
  if (!user) return false;
  
  // Check basic entity permission
  if (!checkEntityPermission(entity, action)) {
    return false;
  }
  
  // Apply scope-based filtering
  switch (scope) {
    case PermissionScopes.GLOBAL:
      return true;
      
    case PermissionScopes.ORGANIZATION:
      return record.organizationId === user.organizationId;
      
    case PermissionScopes.DEPARTMENT:
      return record.departmentId === user.departmentId;
      
    case PermissionScopes.TEAM:
      return record.teamId === user.teamId;
      
    case PermissionScopes.OWN:
      return record.ownerId === user.id || 
             record.createdBy === user.id ||
             record.assignedTo === user.id;
      
    case PermissionScopes.CUSTOM:
      // Custom scope - evaluate custom conditions
      return evaluateCustomScope(entity, record, user);
      
    default:
      return false;
  }
}

/**
 * Get accessible records based on user's scope
 * @param {Array} records - All records
 * @param {string} entity - Entity type
 * @param {string} scope - Permission scope
 * @returns {Array} Filtered records
 */
export function filterRecordsByScope(records, entity, scope) {
  const user = getCurrentUserFromCache();
  if (!user) return [];
  
  return records.filter(record => 
    checkRecordPermission(entity, 'read', record, scope)
  );
}

/**
 * Get permitted fields for entity
 * @param {string} entity - Entity type
 * @param {string} action - Action (read/write)
 * @returns {Array} List of permitted field names
 */
export function getPermittedFields(entity, action) {
  const user = getCurrentUserFromCache();
  if (!user) return [];
  
  // Get all fields for entity
  const allFields = getEntityFields(entity);
  
  // Filter by permission
  return allFields.filter(field => 
    checkFieldPermission(entity, field, action)
  );
}

/**
 * Evaluate custom scope conditions
 */
function evaluateCustomScope(entity, record, user) {
  // Get custom scope rules for user's roles
  const customRules = getCustomScopeRules(user, entity);
  
  if (!customRules || customRules.length === 0) {
    return false;
  }
  
  // Evaluate all rules (AND logic)
  return customRules.every(rule => {
    return evaluateCondition(record, rule.condition, user);
  });
}

/**
 * Evaluate a single condition
 */
function evaluateCondition(record, condition, user) {
  const { field, operator, value } = condition;
  const recordValue = record[field];
  
  switch (operator) {
    case 'equals':
      return recordValue === value;
    case 'notEquals':
      return recordValue !== value;
    case 'in':
      return Array.isArray(value) && value.includes(recordValue);
    case 'notIn':
      return Array.isArray(value) && !value.includes(recordValue);
    case 'contains':
      return String(recordValue).includes(value);
    case 'startsWith':
      return String(recordValue).startsWith(value);
    case 'endsWith':
      return String(recordValue).endsWith(value);
    case 'greaterThan':
      return recordValue > value;
    case 'lessThan':
      return recordValue < value;
    case 'isCurrentUser':
      return recordValue === user.id;
    case 'isInUserTeam':
      return user.teamMembers && user.teamMembers.includes(recordValue);
    default:
      return false;
  }
}

/**
 * Get field restrictions for user from their roles
 */
function getFieldRestrictionsForUser(user, entity) {
  // Get roles from cache
  const roles = JSON.parse(localStorage.getItem('roles_cache') || '[]');
  const userRoles = roles.filter(r => user.assignedRoles?.includes(r.id));
  
  // Merge field restrictions from all roles
  const restrictions = {};
  
  userRoles.forEach(role => {
    if (role.fieldPermissions && role.fieldPermissions[entity]) {
      Object.assign(restrictions, role.fieldPermissions[entity]);
    }
  });
  
  return restrictions;
}

/**
 * Get custom scope rules for user
 */
function getCustomScopeRules(user, entity) {
  const roles = JSON.parse(localStorage.getItem('roles_cache') || '[]');
  const userRoles = roles.filter(r => user.assignedRoles?.includes(r.id));
  
  const rules = [];
  
  userRoles.forEach(role => {
    if (role.scopeRules && role.scopeRules[entity]) {
      rules.push(...role.scopeRules[entity]);
    }
  });
  
  return rules;
}

/**
 * Get entity fields definition
 */
function getEntityFields(entity) {
  // This should come from entity metadata/schema
  const entityFieldMap = {
    'User': ['id', 'name', 'email', 'role', 'status', 'department', 'organizationId', 'salary', 'ssn'],
    'Customer': ['id', 'name', 'email', 'phone', 'address', 'creditLimit', 'accountBalance'],
    'Order': ['id', 'customerId', 'orderDate', 'status', 'total', 'discount', 'notes'],
    'Product': ['id', 'name', 'description', 'price', 'cost', 'stock', 'category'],
    'Incident': ['id', 'title', 'description', 'priority', 'status', 'assignedTo', 'reportedBy']
  };
  
  return entityFieldMap[entity] || [];
}

/**
 * Get current user from cache
 */
function getCurrentUserFromCache() {
  try {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Get default permission groups if API fails
 */
function getDefaultPermissionGroups() {
  return [
    {
      id: 'user_management',
      name: 'User Management',
      category: PermissionCategories.SECURITY,
      description: 'Permissions for managing users, roles, and access',
      permissions: []
    },
    {
      id: 'data_management',
      name: 'Data Management',
      category: PermissionCategories.DATA,
      description: 'Permissions for managing business data',
      permissions: []
    },
    {
      id: 'system_admin',
      name: 'System Administration',
      category: PermissionCategories.SYSTEM,
      description: 'System configuration and maintenance',
      permissions: []
    },
    {
      id: 'reporting',
      name: 'Reporting & Analytics',
      category: PermissionCategories.REPORTS,
      description: 'Access to reports and analytics',
      permissions: []
    }
  ];
}

/**
 * Get default scopes if API fails
 */
function getDefaultScopes() {
  return [
    {
      id: PermissionScopes.GLOBAL,
      name: 'Global Access',
      description: 'Access to all data across the organization',
      level: 1
    },
    {
      id: PermissionScopes.ORGANIZATION,
      name: 'Organization Access',
      description: 'Access to data within the organization',
      level: 2
    },
    {
      id: PermissionScopes.DEPARTMENT,
      name: 'Department Access',
      description: 'Access to data within the department',
      level: 3
    },
    {
      id: PermissionScopes.TEAM,
      name: 'Team Access',
      description: 'Access to data within the team',
      level: 4
    },
    {
      id: PermissionScopes.OWN,
      name: 'Own Data Only',
      description: 'Access to own data only',
      level: 5
    }
  ];
}

/**
 * Create permission matrix for a role
 * @param {Object} role - Role object
 * @returns {Object} Permission matrix
 */
export function createPermissionMatrix(role) {
  const matrix = {
    app: {},
    modules: {},
    entities: {},
    fields: {}
  };
  
  // Parse role permissions into matrix
  if (role.permissions) {
    Object.entries(role.permissions).forEach(([entity, actions]) => {
      matrix.entities[entity] = actions;
    });
  }
  
  if (role.moduleAccess) {
    matrix.modules = role.moduleAccess;
  }
  
  if (role.fieldPermissions) {
    matrix.fields = role.fieldPermissions;
  }
  
  return matrix;
}

/**
 * Export permission report for audit
 */
export async function exportPermissionReport(roleId) {
  const roles = JSON.parse(localStorage.getItem('roles_cache') || '[]');
  const role = roles.find(r => r.id === roleId);
  
  if (!role) return null;
  
  const matrix = createPermissionMatrix(role);
  
  return {
    role: {
      id: role.id,
      name: role.name,
      description: role.description
    },
    permissions: matrix,
    users: await getUsersWithRole(roleId),
    exportedAt: new Date().toISOString(),
    exportedBy: getCurrentUserFromCache()?.name || 'Unknown'
  };
}

/**
 * Get users with specific role
 */
async function getUsersWithRole(roleId) {
  const users = JSON.parse(localStorage.getItem('users_cache') || '[]');
  return users.filter(u => u.assignedRoles?.includes(roleId));
}

export default {
  getPermissions,
  getPermissionById,
  getPermissionsByEntity,
  getPermissionsByModule,
  getPermissionGroups,
  getScopes,
  checkAppPermission,
  checkModulePermission,
  checkEntityPermission,
  checkFieldPermission,
  checkRecordPermission,
  filterRecordsByScope,
  getPermittedFields,
  createPermissionMatrix,
  exportPermissionReport,
  PermissionScopes,
  SecurityLevels,
  PermissionCategories
};
