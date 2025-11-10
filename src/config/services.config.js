/**
 * Services Configuration - Register all application services
 * Uses ServiceProvider for dependency injection
 */

import { registerServices } from '../providers/ServiceProvider.js';

// Register all application services
registerServices({
  // Auth Services (Singleton - maintain state)
  authState: {
    type: 'singleton',
    value: () => import('../services/authState.js').then(m => m.authState)
  },

  dataService: {
    type: 'lazy',
    value: () => import('../services/dataService.js')
  },

  // API Service (Singleton)
  apiService: {
    type: 'lazy',
    value: () => import('../services/api.js')
  },

  // CASL Ability Service (Singleton - permission management)
  abilityService: {
    type: 'singleton',
    value: () => import('../services/ability.service.js').then(m => m.abilityService)
  },

  caslPermissionService: {
    type: 'lazy',
    value: () => import('../services/casl-permission.service.js')
  },

  // Website/Commerce Services (Lazy loaded)
  cartService: {
    type: 'lazy',
    value: () => import('../modules/website/services/cart.service.js')
  },

  orderService: {
    type: 'lazy',
    value: () => import('../modules/website/services/order.service.js')
  },

  productService: {
    type: 'lazy',
    value: () => import('../modules/website/services/product.service.js')
  },

  companyService: {
    type: 'lazy',
    value: () => import('../modules/companies/services/company.service.js')
  },

  quoteService: {
    type: 'lazy',
    value: () => import('../modules/website/services/quote.service.js')
  },

  contractService: {
    type: 'lazy',
    value: () => import('../modules/website/services/contract.service.js')
  },

  pricelistService: {
    type: 'lazy',
    value: () => import('../modules/website/services/pricelist.service.js')
  },

  purchaseOrderService: {
    type: 'lazy',
    value: () => import('../modules/website/services/purchaseorder.service.js')
  },


  // SLA Services
  incidentService: {
    type: 'lazy',
    value: () => import('../modules/sla/services/incident.service.js')
  },

  // GDocs Services
  gdocsService: {
    type: 'lazy',
    value: () => import('../modules/gdocs/services/gdocs.service.js')
  },

  inboxService: {
    type: 'lazy',
    value: () => import('../modules/gdocs/services/inbox.service.js')
  },

  outboxService: {
    type: 'lazy',
    value: () => import('../modules/gdocs/services/outbox.service.js')
  },

  // Analytics Services
  analyticsService: {
    type: 'lazy',
    value: () => import('../modules/analytics/services/analytics.service.js')
  },

  // Admin Services
  userService: {
    type: 'lazy',
    value: () => import('../modules/admin/services/user.service.js')
  },

  roleService: {
    type: 'lazy',
    value: () => import('../modules/admin/services/role.service.js')
  },

  permissionService: {
    type: 'lazy',
    value: () => import('../services/casl-permission.service.js')
  }
});
