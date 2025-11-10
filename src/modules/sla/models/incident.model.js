/**
 * Incident Model
 */

export class Incident {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.severity = data.severity || 'Medium'; // Low, Medium, High, Critical
    this.status = data.status || 'Open'; // Open, In Progress, Resolved, Closed
    this.assignedTo = data.assignedTo || '';
    this.reportedBy = data.reportedBy || '';
    this.customer = data.customer || '';
    this.slaDeadline = data.slaDeadline || null;
    this.resolvedAt = data.resolvedAt || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    const errors = [];
    
    if (!this.title || this.title.trim() === '') {
      errors.push('Title is required');
    }
    
    if (!this.description || this.description.trim() === '') {
      errors.push('Description is required');
    }
    
    if (!['Low', 'Medium', 'High', 'Critical'].includes(this.severity)) {
      errors.push('Invalid severity level');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isSLABreached() {
    if (!this.slaDeadline || this.status === 'Resolved' || this.status === 'Closed') {
      return false;
    }
    return new Date() > new Date(this.slaDeadline);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      severity: this.severity,
      status: this.status,
      assignedTo: this.assignedTo,
      reportedBy: this.reportedBy,
      customer: this.customer,
      slaDeadline: this.slaDeadline,
      resolvedAt: this.resolvedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromAPI(data) {
    return new Incident(data);
  }
}

export default Incident;
