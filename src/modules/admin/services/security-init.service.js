/**
 * Security Initialization Service
 * Handles security context initialization on app startup and user login
 */

import { securityContext } from './security-context.service.js';
import { getRoles } from './role.service.js';
import { getUsers, getUserById } from './user.service.js';
import { getCurrentUser } from '../../../services/authService.js';

/**
 * Initialize security context for the application
 * Call this on app startup or after user login
 */
export async function initializeSecurity() {
  try {
    console.log('[Security Init] Starting security initialization...');
    
    // Get current user
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      console.warn('[Security Init] No authenticated user found');
      return false;
    }

    console.log('[Security Init] Current user:', currentUser.name);

    // Load all roles
    const allRoles = await getRoles();
    console.log('[Security Init] Loaded roles:', allRoles.length);

    // Get user's full profile with assigned roles
    const userProfile = await getUserById(currentUser.id);
    
    if (!userProfile) {
      console.error('[Security Init] User profile not found');
      return false;
    }

    // Get user's assigned roles
    const assignedRoleIds = userProfile.assignedRoles || [];
    const userRoles = allRoles.filter(role => assignedRoleIds.includes(role.id));
    
    console.log('[Security Init] User roles:', userRoles.map(r => r.name));

    // Initialize security context
    await securityContext.initialize(userProfile, userRoles);
    
    console.log('[Security Init] ✓ Security context initialized successfully');
    console.log('[Security Init] User scope:', userProfile.permissionScope);
    console.log('[Security Init] Is Admin:', securityContext.isAdmin());

    // Cache security info
    cacheSecurityInfo(userProfile, userRoles);

    return true;
  } catch (error) {
    console.error('[Security Init] Failed to initialize security:', error);
    return false;
  }
}

/**
 * Refresh security context (e.g., after role change)
 */
export async function refreshSecurity() {
  try {
    console.log('[Security Init] Refreshing security context...');
    await initializeSecurity();
    console.log('[Security Init] ✓ Security context refreshed');
    return true;
  } catch (error) {
    console.error('[Security Init] Failed to refresh security:', error);
    return false;
  }
}

/**
 * Clear security context (on logout)
 */
export function clearSecurity() {
  console.log('[Security Init] Clearing security context...');
  securityContext.clear();
  clearSecurityCache();
  console.log('[Security Init] ✓ Security context cleared');
}

/**
 * Cache security information for quick access
 */
function cacheSecurityInfo(user, roles) {
  try {
    const securityInfo = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      roles: roles.map(r => ({
        id: r.id,
        name: r.name,
        priority: r.priority
      })),
      scope: user.permissionScope,
      organizationId: user.organizationId,
      departmentId: user.departmentId,
      teamId: user.teamId,
      isAdmin: securityContext.isAdmin(),
      cachedAt: new Date().toISOString()
    };

    localStorage.setItem('security_info', JSON.stringify(securityInfo));
  } catch (error) {
    console.error('[Security Init] Failed to cache security info:', error);
  }
}

/**
 * Get cached security info
 */
export function getCachedSecurityInfo() {
  try {
    const cached = localStorage.getItem('security_info');
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('[Security Init] Failed to get cached security info:', error);
    return null;
  }
}

/**
 * Clear security cache
 */
function clearSecurityCache() {
  try {
    localStorage.removeItem('security_info');
  } catch (error) {
    console.error('[Security Init] Failed to clear security cache:', error);
  }
}

/**
 * Check if security context is initialized
 */
export function isSecurityInitialized() {
  return securityContext.isAuthenticated();
}

/**
 * Get security status for debugging
 */
export function getSecurityStatus() {
  const isInitialized = isSecurityInitialized();
  const cached = getCachedSecurityInfo();
  
  return {
    initialized: isInitialized,
    user: securityContext.getUser(),
    roles: securityContext.getRoles(),
    isAdmin: isInitialized ? securityContext.isAdmin() : false,
    cached,
    timestamp: new Date().toISOString()
  };
}

/**
 * Auto-initialize security if user is logged in
 * Call this on app startup
 */
export async function autoInitializeSecurity() {
  console.log('[Security Init] Auto-initialization check...');
  
  const currentUser = getCurrentUser();
  
  if (currentUser && !isSecurityInitialized()) {
    console.log('[Security Init] User logged in, initializing security...');
    return await initializeSecurity();
  }
  
  if (isSecurityInitialized()) {
    console.log('[Security Init] ✓ Security already initialized');
    return true;
  }
  
  console.log('[Security Init] No user logged in, skipping initialization');
  return false;
}

export default {
  initializeSecurity,
  refreshSecurity,
  clearSecurity,
  isSecurityInitialized,
  getSecurityStatus,
  autoInitializeSecurity,
  getCachedSecurityInfo
};
