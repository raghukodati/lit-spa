/**
 * CASL Ability Service - Advanced Permission Management
 * Uses @casl/ability for declarative, flexible permissions
 * 
 * @see https://casl.js.org/v6/en/
 */

import { AbilityBuilder, createMongoAbility } from '@casl/ability';

/**
 * Define all possible actions in the system
 */
export const Actions = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage', // All actions
  EXECUTE: 'execute',
  EXPORT: 'export',
  IMPORT: 'import',
  APPROVE: 'approve',
  REJECT: 'reject',
  PUBLISH: 'publish'
};

/**
 * Define all subjects (resources) in the system
 */
export const Subjects = {
  // Core entities
  USER: 'User',
  ROLE: 'Role',
  PERMISSION: 'Permission',
  
  // Business entities
  CUSTOMER: 'Customer',
  ORGANIZATION: 'Organization',
  ORDER: 'Order',
  PRODUCT: 'Product',
  INVOICE: 'Invoice',
  QUOTE: 'Quote',
  CONTRACT: 'Contract',
  PRICELIST: 'PriceList',
  PURCHASE_ORDER: 'PurchaseOrder',
  
  // SLA entities
  INCIDENT: 'Incident',
  SLA_METRIC: 'SLAMetric',
  
  // Analytics
  REPORT: 'Report',
  DASHBOARD: 'Dashboard',
  ANALYTICS: 'Analytics',
  
  // GDocs
  DOCUMENT: 'Document',
  INBOX: 'Inbox',
  OUTBOX: 'Outbox',
  
  // System
  SETTINGS: 'Settings',
  MODULE: 'Module',
  ALL: 'all' // Special subject for system-wide permissions
};

/**
 * Create ability instance from user permissions
 * 
 * @param {Object} user - Current user object
 * @param {Array} roles - User's roles with permissions
 * @returns {Ability} CASL Ability instance
 */
export function defineAbilityFor(user, roles = []) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (!user) {
    // Anonymous user - very limited permissions
    can(Actions.READ, Subjects.PRODUCT); // Can view products
    return build();
  }

  // Super Admin - can do everything
  if (user.role === 'Super Admin' || user.isSuperAdmin) {
    can(Actions.MANAGE, Subjects.ALL);
    return build();
  }

  // Build permissions from user's roles
  roles.forEach(role => {
    if (!role || !role.permissions) return;

    Object.entries(role.permissions).forEach(([entity, actions]) => {
      const subject = mapEntityToSubject(entity);
      
      actions.forEach(action => {
        if (action === 'manage') {
          can(Actions.MANAGE, subject);
        } else {
          can(action, subject);
        }
      });
    });
  });

  // Add role-specific rules
  switch (user.role) {
    case 'Admin':
      // Admin can manage most things except sensitive settings
      can(Actions.MANAGE, [
        Subjects.USER,
        Subjects.CUSTOMER,
        Subjects.ORDER,
        Subjects.PRODUCT,
        Subjects.INCIDENT
      ]);
      can(Actions.READ, Subjects.SETTINGS);
      break;

    case 'Manager':
      // Manager can read and update, but limited delete
      can([Actions.READ, Actions.UPDATE], [
        Subjects.CUSTOMER,
        Subjects.ORDER,
        Subjects.PRODUCT,
        Subjects.INCIDENT
      ]);
      can(Actions.CREATE, [Subjects.ORDER, Subjects.INCIDENT]);
      can(Actions.APPROVE, Subjects.ORDER);
      break;

    case 'User':
      // Regular user - read-only for most things
      can(Actions.READ, [
        Subjects.CUSTOMER,
        Subjects.ORDER,
        Subjects.PRODUCT,
        Subjects.REPORT
      ]);
      can([Actions.CREATE, Actions.UPDATE], Subjects.INCIDENT);
      break;

    case 'Customer':
      // Customer portal access
      can(Actions.READ, [Subjects.PRODUCT, Subjects.ORDER, Subjects.INVOICE]);
      can(Actions.CREATE, [Subjects.ORDER, Subjects.QUOTE]);
      can(Actions.UPDATE, Subjects.ORDER, { status: 'draft' }); // Only draft orders
      break;
  }

  // Field-level permissions
  // Users can only update their own profile
  can(Actions.UPDATE, Subjects.USER, { id: user.id });
  
  // Users can only read their own incidents unless they have broader permissions
  if (user.role === 'User') {
    can(Actions.READ, Subjects.INCIDENT, { assignedTo: user.id });
    can(Actions.READ, Subjects.INCIDENT, { reportedBy: user.id });
  }

  return build();
}

/**
 * Map legacy entity names to CASL subjects
 */
function mapEntityToSubject(entity) {
  const mapping = {
    'users': Subjects.USER,
    'roles': Subjects.ROLE,
    'permissions': Subjects.PERMISSION,
    'settings': Subjects.SETTINGS,
    'customers': Subjects.CUSTOMER,
    'customer_orgs': Subjects.ORGANIZATION,
    'orders': Subjects.ORDER,
    'products': Subjects.PRODUCT,
    'incidents': Subjects.INCIDENT,
    'reports': Subjects.REPORT,
    'analytics': Subjects.ANALYTICS,
    'documents': Subjects.DOCUMENT,
    'invoices': Subjects.INVOICE,
    'quotes': Subjects.QUOTE,
    'contracts': Subjects.CONTRACT,
    'pricelists': Subjects.PRICELIST,
    'purchase_orders': Subjects.PURCHASE_ORDER,
    'sla_metrics': Subjects.SLA_METRIC,
    'inbox': Subjects.INBOX,
    'outbox': Subjects.OUTBOX,
    'dashboards': Subjects.DASHBOARD,
    'modules': Subjects.MODULE
  };

  return mapping[entity] || entity;
}

/**
 * Ability Service - Manages permission checking
 */
class AbilityService {
  constructor() {
    this._ability = null;
    this._user = null;
  }

  /**
   * Initialize ability with user and roles
   */
  init(user, roles = []) {
    this._user = user;
    this._ability = defineAbilityFor(user, roles);
  }

  /**
   * Get current ability instance
   */
  get ability() {
    if (!this._ability) {
      // Initialize with empty ability if not set
      this._ability = defineAbilityFor(null);
    }
    return this._ability;
  }

  /**
   * Check if user can perform action on subject
   * 
   * @example
   * abilityService.can('read', 'User')
   * abilityService.can('update', 'Order', { status: 'draft' })
   */
  can(action, subject, field) {
    return this.ability.can(action, subject, field);
  }

  /**
   * Check if user cannot perform action on subject
   */
  cannot(action, subject, field) {
    return this.ability.cannot(action, subject, field);
  }

  /**
   * Update ability with new permissions
   */
  update(user, roles = []) {
    this.init(user, roles);
  }

  /**
   * Clear ability (logout)
   */
  clear() {
    this._ability = null;
    this._user = null;
  }

  /**
   * Get all rules
   */
  getRules() {
    return this.ability.rules;
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.can(Actions.MANAGE, Subjects.ALL);
  }

  /**
   * Check if user can access route
   */
  canAccessRoute(route) {
    const routeMap = {
      '/users': { action: Actions.READ, subject: Subjects.USER },
      '/users/new': { action: Actions.CREATE, subject: Subjects.USER },
      '/users/edit': { action: Actions.UPDATE, subject: Subjects.USER },
      '/roles': { action: Actions.READ, subject: Subjects.ROLE },
      '/roles/new': { action: Actions.CREATE, subject: Subjects.ROLE },
      '/roles/edit': { action: Actions.UPDATE, subject: Subjects.ROLE },
      '/customers': { action: Actions.READ, subject: Subjects.CUSTOMER },
      '/customers/new': { action: Actions.CREATE, subject: Subjects.CUSTOMER },
      '/customers/edit': { action: Actions.UPDATE, subject: Subjects.CUSTOMER },
      '/orders': { action: Actions.READ, subject: Subjects.ORDER },
      '/orders/new': { action: Actions.CREATE, subject: Subjects.ORDER },
      '/products': { action: Actions.READ, subject: Subjects.PRODUCT },
      '/sla/incidents': { action: Actions.READ, subject: Subjects.INCIDENT },
      '/sla/incidents/new': { action: Actions.CREATE, subject: Subjects.INCIDENT },
      '/reports': { action: Actions.READ, subject: Subjects.REPORT },
      '/analytics': { action: Actions.READ, subject: Subjects.ANALYTICS }
    };

    // Find matching route
    const routeKey = Object.keys(routeMap).find(key => route.startsWith(key));
    
    if (!routeKey) {
      return true; // Allow access to unmapped routes
    }

    const { action, subject } = routeMap[routeKey];
    return this.can(action, subject);
  }

  /**
   * Get user's permissions summary
   */
  getPermissionsSummary() {
    const summary = {
      canManageUsers: this.can(Actions.MANAGE, Subjects.USER),
      canManageRoles: this.can(Actions.MANAGE, Subjects.ROLE),
      canManageCustomers: this.can(Actions.MANAGE, Subjects.CUSTOMER),
      canManageOrders: this.can(Actions.MANAGE, Subjects.ORDER),
      canManageProducts: this.can(Actions.MANAGE, Subjects.PRODUCT),
      canManageIncidents: this.can(Actions.MANAGE, Subjects.INCIDENT),
      canViewReports: this.can(Actions.READ, Subjects.REPORT),
      canViewAnalytics: this.can(Actions.READ, Subjects.ANALYTICS),
      isAdmin: this.isAdmin()
    };

    return summary;
  }
}

// Export singleton instance
export const abilityService = new AbilityService();

// Export for testing
export { defineAbilityFor as _defineAbilityFor };
