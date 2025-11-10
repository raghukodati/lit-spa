/**
 * Route Helper Utilities
 * Helpers for creating permission-protected routes
 */

import { html } from 'lit';

/**
 * Create a permission-protected route configuration
 * 
 * @param {Object} config - Route configuration
 * @param {string} config.path - Route path
 * @param {string} config.component - Component import path
 * @param {string} config.tagName - Custom element tag name
 * @param {string} [config.requiredModule] - Required module path (e.g., "/module/admin")
 * @param {string} [config.requiredPermission] - Required permission (e.g., "users.read")
 * @param {Function} [config.wrapper] - Custom wrapper function for the component
 * @returns {Object} Route configuration for @lit-labs/router
 * 
 * @example
 * createProtectedRoute({
 *   path: '/users',
 *   component: '@modules/admin/components/users/user-management.js',
 *   tagName: 'user-management',
 *   requiredModule: '/module/admin',
 *   requiredPermission: 'users.read'
 * })
 */
export function createProtectedRoute(config) {
  const {
    path,
    component,
    tagName,
    requiredModule = '',
    requiredPermission = '',
    wrapper
  } = config;

  return {
    path,
    render: () => {
      // Lazy load the component
      import(component);
      
      // Build route-wrapper attributes
      const attrs = [];
      if (requiredModule) attrs.push(`requiredModule="${requiredModule}"`);
      if (requiredPermission) attrs.push(`requiredPermission="${requiredPermission}"`);
      const attrString = attrs.join(' ');
      
      // Render with wrapper if provided, otherwise just the component
      const content = wrapper 
        ? wrapper(html`<${tagName}></${tagName}>`)
        : html`<${tagName}></${tagName}>`;
      
      return html`
        <route-wrapper ${attrString}>
          ${content}
        </route-wrapper>
      `;
    }
  };
}

/**
 * Create multiple protected routes from metadata array
 * 
 * @param {Array} metadata - Array of route metadata objects
 * @param {string} defaultModule - Default required module for all routes
 * @param {Object} [componentMap] - Map of route IDs to custom configurations
 * @returns {Array} Array of route configurations
 * 
 * @example
 * const routes = createRoutesFromMetadata(adminRouteMetadata, '/module/admin', {
 *   'admin-dashboard': {
 *     component: '@modules/admin/components/dashboard/admin-dashboard.js',
 *     tagName: 'module-admin'
 *   }
 * });
 */
export function createRoutesFromMetadata(metadata, defaultModule, componentMap = {}) {
  return metadata.map(meta => {
    const config = componentMap[meta.component] || {
      component: `@modules/admin/components/${meta.component}.js`,
      tagName: meta.component
    };
    
    return createProtectedRoute({
      path: meta.path,
      component: config.component,
      tagName: config.tagName,
      requiredModule: defaultModule,
      requiredPermission: meta.permission,
      wrapper: config.wrapper
    });
  });
}

/**
 * Create a route with custom permission checking logic
 * 
 * @param {Object} config - Route configuration
 * @param {string} config.path - Route path
 * @param {Function} config.render - Custom render function
 * @param {Function} config.canActivate - Function that returns boolean for access check
 * @returns {Object} Route configuration
 */
export function createGuardedRoute(config) {
  const { path, render, canActivate } = config;
  
  return {
    path,
    render: () => {
      if (!canActivate()) {
        return html`<access-denied></access-denied>`;
      }
      return render();
    }
  };
}

/**
 * Helper to check if routes are properly configured with permissions
 * Logs warnings for routes without permission checks
 * 
 * @param {Array} routes - Array of route configurations
 * @param {string} moduleName - Module name for logging
 */
export function validateRoutePermissions(routes, moduleName) {
  const warnings = [];
  
  routes.forEach(route => {
    // Skip non-protected routes (like redirects)
    if (!route.render) return;
    
    // Check if route has permission protection
    const renderStr = route.render.toString();
    if (!renderStr.includes('requiredPermission') && !renderStr.includes('requiredModule')) {
      warnings.push(`Route ${route.path} in ${moduleName} has no permission protection`);
    }
  });
  
  if (warnings.length > 0) {
    console.warn(`[Route Security] Found ${warnings.length} unprotected routes in ${moduleName}:`, warnings);
  }
  
  return warnings;
}
