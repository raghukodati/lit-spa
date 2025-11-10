/**
 * Data Service - Facade Pattern
 * 
 * This file serves as a backward-compatible facade that re-exports
 * all functions from the split service modules. This allows existing
 * code to continue using `import { ... } from './services/dataService.js'`
 * without any changes.
 * 
 * The actual implementations are now in separate service files:
 * - authService.js - Authentication & session management
 * - permissionService.js - Permission checking & authorization
 * - coreService.js - Modules, entities, utilities
 * - moduleService.js - Module management
 * - roleService.js - Role CRUD operations
 * - userService.js - User CRUD operations
 * 
 * To migrate to real APIs, just update api.js configuration.
 */

// Re-export all authentication functions
export {
  login,
  logout,
  getAuthToken,
  getCurrentUser,
  getCurrentUserAsync,
  isAuthenticated,
  isAuthenticatedAsync,
  checkAuth,
  initAuth
} from './authService.js';

// Re-export all permission functions (now from CASL service)
export {
  getUserPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessRoute,
  isAdmin,
  initializePermissionCache
} from './casl-permission.service.js';

// Re-export all core functions and constants
export {
  delay,
  modules,
  entities,
  permissionTypes,
  getHomeData,
  getAboutData
} from './coreService.js';

// Re-export all module management functions
export {
  getUserModules,
  getCurrentModule,
  setCurrentModule,
  hasModuleAccess,
  isSuperAdmin,
  getUserAccessibleModules
} from './moduleService.js';

// Re-export all role functions
export {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} from '../modules/admin/services/role.service.js';


// Business Partner unified APIs (delegating to Company service for now)
export {
  getCompanies as getBusinessPartners,
  getCompanyById as getBusinessPartnerById,
  getCompanyByAccountNumber as getBusinessPartnerByAccountNumber,
  createCompany as createBusinessPartner,
  updateCompany as updateBusinessPartner,
  deleteCompany as deleteBusinessPartner,
  getCompanyStats as getBusinessPartnerStats,
  updateCompanyCredit as updateBusinessPartnerCredit,
  addShippingAddress as addBusinessPartnerShippingAddress,
  updateShippingAddress as updateBusinessPartnerShippingAddress,
  deleteShippingAddress as deleteBusinessPartnerShippingAddress,
  getCompanyLabelById as getBusinessPartnerLabelById,
  getCompanyLabelByAccountNumber as getBusinessPartnerLabelByAccountNumber,
} from '../modules/companies/services/company.service.js';


// Re-export all user functions
export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  assignRolesToUser,
  deleteUser
} from '../modules/admin/services/user.service.js';

// Re-export analytics functions
export {
  getSalesByMonth,
  getSalesByCustomer,
  getForecastData,
  getCustomerList,
  getMonthList,
  getForecastYears,
  getForecastMonths,
  getForecastCustomers,
  getForecasts,
  getForecastById,
  createForecast,
  updateForecast,
  deleteForecast
} from '../modules/analytics/services/analytics.service.js';

// Re-export gdocs functions
export {
  getGdocs,
  getGdocById,
  createGdoc,
  updateGdoc,
  deleteGdoc,
  getGdocCategories,
  getGdocAuthors,
  getGdocStatuses,
  getAuthors,
  getAuthorById,
  getDocumentMetadata,
  updateDocumentMetadata,
  getDocumentVersions,
  getVersionById,
  createDocumentVersion,
  getDocumentComments,
  createDocumentComment,
  updateDocumentComment,
  deleteDocumentComment,
  getDocumentAttachments,
  createDocumentAttachment,
  deleteDocumentAttachment,
  getDocumentCollaborators,
  addDocumentCollaborator,
  updateCollaboratorPermission,
  removeDocumentCollaborator,
  getGdocWithRelationships
} from '../modules/gdocs/services/gdocs.service.js';

// Re-export incident functions
export {
  getIncidents,
  getIncidentById,
  getIncidentByNumber,
  createIncident,
  updateIncident,
  deleteIncident,
  getIncidentsByCategory,
  getIncidentsByStatus,
  getSLAMetrics,
  getSLADashboardStats,
  initializeIncidentsCache,
  exportIncidentsToCSV
} from '../modules/sla/services/incident.service.js';

// Re-export Gdocs Inbox functions
export {
  getInboxPurchaseOrders,
  getInboxPurchaseOrderById,
  createInboxPurchaseOrder,
  updateInboxPurchaseOrder,
  deleteInboxPurchaseOrder,
  getInboxPOVendors,
  getInboxPOAccounts,
  getInboxPOStatuses,
  getInboxInvoices,
  getInboxInvoiceById,
  createInboxInvoice,
  updateInboxInvoice,
  deleteInboxInvoice,
  getInboxAcknowledgements,
  getInboxAcknowledgementById,
  createInboxAcknowledgement,
  updateInboxAcknowledgement,
  deleteInboxAcknowledgement
} from '../modules/gdocs/services/inbox.service.js';

// Re-export Gdocs Outbox functions
export {
  getOutboxPurchaseOrders,
  getOutboxPurchaseOrderById,
  createOutboxPurchaseOrder,
  updateOutboxPurchaseOrder,
  deleteOutboxPurchaseOrder,
  getOpenOutboxPurchaseOrders,
  getOutboxInvoices,
  getOutboxInvoiceById,
  createOutboxInvoice,
  updateOutboxInvoice,
  deleteOutboxInvoice,
  getOpenOutboxInvoices
} from '../modules/gdocs/services/outbox.service.js';
