/**
 * Routes Configuration - Centralized route registration using RouterProvider
 */

import { registerRoutes } from '../providers/RouterProvider.js';

// Register all route loaders
registerRoutes({
  // Public routes (always loaded)
  public: async () => {
    const { publicRoutes } = await import('../routes/public.routes.js');
    return publicRoutes;
  },

  // Protected routes
  protected: async () => {
    const { protectedRoutes } = await import('../routes/protected.routes.js');
    return protectedRoutes;
  },

  // Admin module routes
  admin: async () => {
    const { createAdminRoutes } = await import('../modules/admin/routes/admin.router.js');
    return createAdminRoutes();
  },


  // SLA module routes
  sla: async () => {
    const { createSLARoutes } = await import('../modules/sla/routes/sla.router.js');
    return createSLARoutes();
  },

  // Sales module routes
  sales: async () => {
    const { createSalesRoutes } = await import('../modules/sales/routes/sales.router.js');
    return createSalesRoutes();
  },

  // Analytics module routes
  analytics: async () => {
    const { createAnalyticsRoutes } = await import('../modules/analytics/routes/analytics.router.js');
    return createAnalyticsRoutes();
  },

  // Commerce module routes
  commerce: async () => {
    const { createCommerceRoutes } = await import('../modules/website/routes/commerce.router.js');
    return createCommerceRoutes();
  },

  // B2B Management routes
  b2bManagement: async () => {
    const { createB2BManagementRoutes } = await import('../modules/website/routes/b2b-management.router.js');
    return createB2BManagementRoutes();
  },

  // B2B Storefront routes
  b2bStorefront: async () => {
    const { createB2BStorefrontRoutes } = await import('../modules/website/routes/b2b-storefront.router.js');
    return createB2BStorefrontRoutes();
  },

  // GDocs module routes
  gdocs: async () => {
    const { createGDocsRoutes } = await import('../modules/gdocs/routes/gdocs.router.js');
    return createGDocsRoutes();
  },

  // Fallback routes (404, etc.)
  fallback: async () => {
    const { html } = await import('lit');
    return [
      { path: '/*', render: () => html`<not-found></not-found>` }
    ];
  }
});
