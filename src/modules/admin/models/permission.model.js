/**
 * Permission Model
 */

export class Permission {
  constructor(data = {}) {
    // Identification
    this.id = data.id || null;
    this.code = data.code || ''; // Unique code like 'users.create'
    this.name = data.name || '';
    this.description = data.description || '';
    
    // Categorization
    this.module = data.module || ''; // Module this permission belongs to
    this.entity = data.entity || ''; // Entity/Resource type
    this.action = data.action || ''; // read, create, update, delete, manage
    this.category = data.category || 'data'; // data, system, security, reports, integration
    
    // Security Level
    this.level = data.level || 'entity'; // app, module, entity, field, record
    this.scope = data.scope || 'own'; // global, organization, department, team, own
    
    // Conditions & Constraints
    this.conditions = data.conditions || {}; // Additional conditions for access
    this.fields = data.fields || []; // Specific fields if field-level permission
    this.dependencies = data.dependencies || []; // Other permissions required
    
    // Risk & Compliance
    this.riskLevel = data.riskLevel || 'low'; // low, medium, high, critical
    this.requiresApproval = data.requiresApproval || false;
    this.requiresMfa = data.requiresMfa || false;
    this.auditLog = data.auditLog !== false; // Log usage of this permission
    
    // Metadata
    this.isSystemPermission = data.isSystemPermission || false;
    this.isActive = data.isActive !== false;
    this.tags = data.tags || [];
    
    // Display
    this.icon = data.icon || '';
    this.color = data.color || '';
    this.displayOrder = data.displayOrder || 100;
  }

  /**
   * Get full permission code
   */
  getFullCode() {
    return this.code || `${this.module}.${this.entity}.${this.action}`;
  }
  
  /**
   * Check if permission is high risk
   */
  isHighRisk() {
    return ['high', 'critical'].includes(this.riskLevel);
  }
  
  /**
   * Check if permission requires special handling
   */
  requiresSpecialHandling() {
    return this.requiresApproval || this.requiresMfa || this.isHighRisk();
  }
  
  /**
   * Validate permission data
   */
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Permission name is required');
    }
    
    if (!this.action || this.action.trim() === '') {
      errors.push('Action is required');
    }
    
    if (!this.entity || this.entity.trim() === '') {
      errors.push('Entity is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      description: this.description,
      module: this.module,
      entity: this.entity,
      action: this.action,
      category: this.category,
      level: this.level,
      scope: this.scope,
      conditions: this.conditions,
      fields: this.fields,
      dependencies: this.dependencies,
      riskLevel: this.riskLevel,
      requiresApproval: this.requiresApproval,
      requiresMfa: this.requiresMfa,
      auditLog: this.auditLog,
      isSystemPermission: this.isSystemPermission,
      isActive: this.isActive,
      tags: this.tags,
      icon: this.icon,
      color: this.color,
      displayOrder: this.displayOrder
    };
  }

  static fromAPI(data) {
    return new Permission(data);
  }
}

export default Permission;
