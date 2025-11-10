/**
 * User Model
 * Defines the structure and validation for user entities
 */

export class User {
  constructor(data = {}) {
    // Basic Information
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.username = data.username || '';
    this.phone = data.phone || '';
    this.avatar = data.avatar || '';
    
    // Role & Permission
    this.role = data.role || ''; // Primary role for display
    this.assignedRoles = data.assignedRoles || []; // Multiple role IDs
    this.permissionScope = data.permissionScope || 'own'; // global, organization, department, team, own
    
    // Organization Context
    this.organizationId = data.organizationId || null;
    this.departmentId = data.departmentId || null;
    this.teamId = data.teamId || null;
    this.managerId = data.managerId || null;
    this.teamMembers = data.teamMembers || []; // IDs of team members for managers
    
    // Status & Security
    this.status = data.status || 'Active'; // Active, Inactive, Suspended, Locked
    this.accountLocked = data.accountLocked || false;
    this.lockReason = data.lockReason || '';
    this.mustChangePassword = data.mustChangePassword || false;
    this.mfaEnabled = data.mfaEnabled || false;
    this.lastLoginAt = data.lastLoginAt || null;
    this.lastLoginIp = data.lastLoginIp || null;
    this.failedLoginAttempts = data.failedLoginAttempts || 0;
    this.passwordExpiresAt = data.passwordExpiresAt || null;
    
    // Attributes for fine-grained access control
    this.attributes = data.attributes || {}; // Custom attributes for ABAC
    this.tags = data.tags || []; // Tags for grouping/filtering
    
    // Audit Trail
    this.createdAt = data.createdAt || new Date().toISOString();
    this.createdBy = data.createdBy || null;
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.updatedBy = data.updatedBy || null;
    this.deletedAt = data.deletedAt || null;
    this.deletedBy = data.deletedBy || null;
  }

  /**
   * Validate user data
   */
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Name is required');
    }
    
    if (!this.email || this.email.trim() === '') {
      errors.push('Email is required');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Email format is invalid');
    }
    
    if (!this.username || this.username.trim() === '') {
      errors.push('Username is required');
    }
    
    if (this.assignedRoles.length === 0) {
      errors.push('At least one role must be assigned');
    }
    
    if (!this.permissionScope) {
      errors.push('Permission scope is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email format is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if user is active
   */
  isActive() {
    return this.status === 'Active' && !this.accountLocked;
  }
  
  /**
   * Check if user needs password change
   */
  needsPasswordChange() {
    if (this.mustChangePassword) return true;
    if (this.passwordExpiresAt && new Date(this.passwordExpiresAt) < new Date()) {
      return true;
    }
    return false;
  }
  
  /**
   * Check if user belongs to organization
   */
  belongsToOrganization(orgId) {
    return this.organizationId === orgId;
  }
  
  /**
   * Check if user belongs to department
   */
  belongsToDepartment(deptId) {
    return this.departmentId === deptId;
  }
  
  /**
   * Check if user belongs to team
   */
  belongsToTeam(teamId) {
    return this.teamId === teamId;
  }
  
  /**
   * Get security context for authorization
   */
  getSecurityContext() {
    return {
      userId: this.id,
      roles: this.assignedRoles,
      scope: this.permissionScope,
      organizationId: this.organizationId,
      departmentId: this.departmentId,
      teamId: this.teamId,
      attributes: this.attributes
    };
  }

  /**
   * Convert to plain object for API calls
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      username: this.username,
      phone: this.phone,
      avatar: this.avatar,
      role: this.role,
      assignedRoles: this.assignedRoles,
      permissionScope: this.permissionScope,
      organizationId: this.organizationId,
      departmentId: this.departmentId,
      teamId: this.teamId,
      managerId: this.managerId,
      teamMembers: this.teamMembers,
      status: this.status,
      accountLocked: this.accountLocked,
      mfaEnabled: this.mfaEnabled,
      attributes: this.attributes,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create User instance from API response
   */
  static fromAPI(data) {
    return new User(data);
  }
}

export default User;
