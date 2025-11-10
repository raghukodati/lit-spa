// Module Management Service
import { getCurrentUser } from './authService.js';
import { modules } from './coreService.js';

export { modules };

// Module Management
const CURRENT_MODULE_KEY = 'current_module';

/**
 * Get user's accessible modules based on role permissions
 * A user has access to a module if they have ANY permission in that module
 */
export function getUserModules() {
  const user = getCurrentUser();
  if (!user) return [];
  
  // Get cached users for sync access
  const users = JSON.parse(localStorage.getItem('users_cache') || '[]');
  const userFromDb = users.find(u => u.id === user.id);
  
  // If no user data, return empty
  if (!userFromDb) return [];
  
  // Get user's assigned roles
  const assignedRoles = userFromDb.assignedRoles || [];
  if (assignedRoles.length === 0) return [];
  
  // Get roles data
  const roles = JSON.parse(localStorage.getItem('roles_cache') || '[]');
  
  // Collect all permissions from user's roles
  const userPermissions = {};
  assignedRoles.forEach(roleId => {
    const role = roles.find(r => r.id === roleId);
    if (role && role.permissions) {
      // Merge role permissions (permissions is JSONB object like {"users": ["create", "read"]})
      Object.assign(userPermissions, role.permissions);
    }
  });
  
  // Map module IDs to which modules user can access
  const accessibleModuleIds = new Set();
  
  // Always add core module
  accessibleModuleIds.add('core');
  
  // Determine module access from permissions
  // Permission entity names map to modules (e.g., "users" -> "admin", "incidents" -> "sla")
  const entityToModule = {
    'users': 'admin',
    'roles': 'admin',
    'permissions': 'admin',
    'audit': 'admin',
    'security': 'admin',
    'sessions': 'admin',
    'incidents': 'sla',
    'orders': 'sales',
    'products': 'sales',
    // Legacy entities map to Commerce for backward compatibility
    'customers': 'commerce',
    'customer_orgs': 'commerce',
    'companies': 'companies',
    'quotes': 'commerce',
    'purchase_orders': 'commerce',
    'reports': 'analytics',
    'analytics': 'analytics',
    'gdocs': 'gdocs',
    'commerce': 'commerce',
    'inventory': 'commerce'
  };
  
  // Add modules based on permissions
  Object.keys(userPermissions).forEach(entity => {
    const moduleId = entityToModule[entity];
    if (moduleId) {
      accessibleModuleIds.add(moduleId);
    }
  });
  
  // Filter modules list to only accessible ones
  const result = modules.filter(module => accessibleModuleIds.has(module.id));
  console.log('🧭 getUserModules accessibleModuleIds:', Array.from(accessibleModuleIds));
  console.log('🧭 getUserModules result:', result.map(m => m.id));
  return result;
}

export function getCurrentModule() {
  const moduleId = localStorage.getItem(CURRENT_MODULE_KEY);
  if (!moduleId) return modules.find(m => m.id === 'core');
  
  const userModules = getUserModules();
  const module = userModules.find(m => m.id === moduleId);
  
  // If stored module is not accessible, return core
  return module || modules.find(m => m.id === 'core');
}

export function setCurrentModule(moduleId) {
  const userModules = getUserModules();
  const module = userModules.find(m => m.id === moduleId);
  
  if (module) {
    localStorage.setItem(CURRENT_MODULE_KEY, moduleId);
    return true;
  }
  return false;
}

export function hasModuleAccess(moduleId) {
  const userModules = getUserModules();
  return userModules.some(m => m.id === moduleId);
}

/**
 * Check if user is super admin (has admin role)
 */
export function isSuperAdmin() {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Get cached users and roles
  const users = JSON.parse(localStorage.getItem('users_cache') || '[]');
  const roles = JSON.parse(localStorage.getItem('roles_cache') || '[]');
  
  const userFromDb = users.find(u => u.id === user.id);
  if (!userFromDb || !userFromDb.assignedRoles) return false;
  
  // Check if user has a role with category 'system' or name contains 'Super Admin'
  return userFromDb.assignedRoles.some(roleId => {
    const role = roles.find(r => r.id === roleId);
    return role && (role.category === 'system' || role.name.includes('Super Admin'));
  });
}

/**
 * Get user's accessible modules (alias for getUserModules)
 */
export function getUserAccessibleModules() {
  return getUserModules();
}
