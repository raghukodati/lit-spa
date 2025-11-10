/**
 * Role Model
 * Defines the structure for role entities
 */

export class Role {
  constructor(data = {}) {
    // Basic Information
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || 'custom'; // system, admin, custom
    this.priority = data.priority || 100; // Lower number = higher priority
    
    // Hierarchy & Inheritance
    this.parentRoleId = data.parentRoleId || null; // Role hierarchy
    this.inheritPermissions = data.inheritPermissions !== false; // Inherit from parent
    this.isSystemRole = data.isSystemRole || false; // System roles cannot be deleted
    
    // Permissions - Entity Level
    this.permissions = data.permissions || {}; // { entity: [actions] }
    
    // Module Access
    this.moduleAccess = data.moduleAccess || {}; // { module: 'admin'|'user'|'none' }
    
    // Field-Level Permissions
    this.fieldPermissions = data.fieldPermissions || {}; // { entity: { field: { readable, writable } } }
    
    // Data Scope
    this.dataScope = data.dataScope || 'own'; // global, organization, department, team, own
    this.scopeRules = data.scopeRules || {}; // Custom scope conditions
    
    // Constraints & Limits
    this.constraints = data.constraints || {
      maxRecords: null,        // Max records can create/view
      timeRestrictions: null,  // Time-based access
      ipRestrictions: [],      // IP whitelist
      allowedDays: null        // Days of week allowed
    };
    
    // Metadata
    this.userCount = data.userCount || 0;
    this.isActive = data.isActive !== false;
    this.expiresAt = data.expiresAt || null; // Temporary roles
    
    // Audit Trail
    this.createdAt = data.createdAt || new Date().toISOString();
    this.createdBy = data.createdBy || null;
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.updatedBy = data.updatedBy || null;
  }

  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Role name is required');
    }
    
    if (this.name.length < 3) {
      errors.push('Role name must be at least 3 characters');
    }
    
    if (!this.dataScope) {
      errors.push('Data scope is required');
    }
    
    if (this.parentRoleId === this.id) {
      errors.push('Role cannot be its own parent');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Check if role is active and not expired
   */
  isValidForUse() {
    if (!this.isActive) return false;
    if (this.expiresAt && new Date(this.expiresAt) < new Date()) {
      return false;
    }
    return true;
  }
  
  /**
   * Get effective permissions (including inherited)
   */
  getEffectivePermissions(allRoles = []) {
    const effective = { ...this.permissions };
    
    // If inherit is enabled and has parent
    if (this.inheritPermissions && this.parentRoleId) {
      const parent = allRoles.find(r => r.id === this.parentRoleId);
      if (parent) {
        const parentPerms = parent.getEffectivePermissions(allRoles);
        
        // Merge parent permissions
        Object.keys(parentPerms).forEach(entity => {
          if (!effective[entity]) {
            effective[entity] = [];
          }
          // Merge actions, avoiding duplicates
          parentPerms[entity].forEach(action => {
            if (!effective[entity].includes(action)) {
              effective[entity].push(action);
            }
          });
        });
      }
    }
    
    return effective;
  }
  
  /**
   * Check if role has specific permission
   */
  hasPermission(entity, action) {
    if (!this.permissions[entity]) return false;
    return this.permissions[entity].includes(action) || 
           this.permissions[entity].includes('manage');
  }
  
  /**
   * Add permission to role
   */
  addPermission(entity, action) {
    if (!this.permissions[entity]) {
      this.permissions[entity] = [];
    }
    if (!this.permissions[entity].includes(action)) {
      this.permissions[entity].push(action);
    }
  }
  
  /**
   * Remove permission from role
   */
  removePermission(entity, action) {
    if (this.permissions[entity]) {
      this.permissions[entity] = this.permissions[entity].filter(a => a !== action);
      if (this.permissions[entity].length === 0) {
        delete this.permissions[entity];
      }
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      priority: this.priority,
      parentRoleId: this.parentRoleId,
      inheritPermissions: this.inheritPermissions,
      isSystemRole: this.isSystemRole,
      permissions: this.permissions,
      moduleAccess: this.moduleAccess,
      fieldPermissions: this.fieldPermissions,
      dataScope: this.dataScope,
      scopeRules: this.scopeRules,
      constraints: this.constraints,
      userCount: this.userCount,
      isActive: this.isActive,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromAPI(data) {
    return new Role(data);
  }
}

export default Role;
