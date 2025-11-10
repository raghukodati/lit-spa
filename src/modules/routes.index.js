/**
 * Central Routes Index
 * Exports all module routes for easy access
 */

import { adminRoutes } from './admin/routes/admin.routes.js';
import { analyticsRoutes } from './analytics/routes/analytics.routes.js';
import { slaRoutes } from './sla/routes/sla.routes.js';
import { salesRoutes } from './sales/routes/sales.routes.js';
import { gdocsRoutes } from './gdocs/routes/gdocs.routes.js';
import { websiteRoutes } from './website/routes/website.routes.js';
import { customersRoutes } from './customers/routes/customers.routes.js';

/**
 * All application routes organized by module
 */
export const allRoutes = {
  admin: adminRoutes,
  analytics: analyticsRoutes,
  sla: slaRoutes,
  sales: salesRoutes,
  gdocs: gdocsRoutes,
  website: websiteRoutes,
  customers: customersRoutes
};

/**
 * Get all routes as flat array
 */
export const getAllRoutesFlat = () => {
  return Object.values(allRoutes).flat();
};

/**
 * Find route by path
 */
export const findRouteByPath = (path) => {
  const allRoutesFlat = getAllRoutesFlat();
  return allRoutesFlat.find(route => route.path === path);
};

/**
 * Get routes for specific module
 */
export const getModuleRoutes = (moduleName) => {
  return allRoutes[moduleName] || [];
};

/**
 * Check if path requires permission
 */
export const getRoutePermission = (path) => {
  const route = findRouteByPath(path);
  return route?.permission || null;
};

export default allRoutes;
