import { html } from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';

class IncidentFormPage extends BaseComponent {
  static properties = {
    incidentId: { type: String },
    incident: { type: Object },
    loading: { type: Boolean },
    saving: { type: Boolean },
    partners: { type: Array }
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.incidentId = null;
    this.incident = {
      title: '',
      description: '',
      category: 'problem_resolution',
      priority: 'medium',
      status: 'open',
      severity: 'medium',
      reportedBy: '',
      assignedTo: '',
      dueDate: '',
      slaTarget: 24,
      impactedCustomers: 0
    };
    this.loading = false;
    this.saving = false;
    this._dataService = null;
    this.partners = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    const path = window.location.pathname;
    const match = path.match(/\/sla\/incidents\/edit\/(\d+)/);
    if (match) {
      this.incidentId = match[1];
    }
    await Promise.all([
      this._loadPartners(),
      this.incidentId ? this._loadIncident() : Promise.resolve()
    ]);
  }

  async _loadPartners() {
    try {
      const dataService = await this.getService('dataService');
      this.partners = await dataService.getBusinessPartners({ partnerType: 'customer' });
    } catch (e) {
      this.partners = [];
    }
  }

  async _loadIncident() {
    try {
      this.loading = true;
      if (!this._dataService) {
        this._dataService = await this.getService('dataService');
      }
      const incident = await this._dataService.getIncidentById(this.incidentId);
      if (!incident) {
        alert('Incident not found');
        window.location.href = '/sla/incidents';
        return;
      }
      this.incident = { ...incident };
      // Format dates for input fields
      if (this.incident.dueDate) {
        this.incident.dueDate = new Date(this.incident.dueDate).toISOString().slice(0, 16);
      }
      this.loading = false;
    } catch (error) {
      console.error('Failed to load incident:', error);
      alert('Failed to load incident');
      window.location.href = '/sla/incidents';
    }
  }

  async _handleSubmit(e) {
    e.preventDefault();

    if (!this.incident.title || !this.incident.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      this.saving = true;

      const incidentData = {
        ...this.incident,
        impactedCustomers: parseInt(this.incident.impactedCustomers) || 0,
        slaTarget: parseInt(this.incident.slaTarget) || 24
      };

      if (!this._dataService) {
        this._dataService = await this.getService('dataService');
      }
      
      if (this.incidentId) {
        await this._dataService.updateIncident(this.incidentId, incidentData);
        alert('Incident updated successfully');
      } else {
        await this._dataService.createIncident(incidentData);
        alert('Incident created successfully');
      }

      window.location.href = '/sla/incidents';
    } catch (error) {
      alert('Failed to save incident: ' + error.message);
      this.saving = false;
    }
  }

  _handleCancel() {
    window.location.href = '/sla/incidents';
  }

  _updateIncidentCategory(e) {
    this.incident = { ...this.incident, category: e.target.value };
    // Update SLA target based on category
    const targets = {
      problem_resolution: 24,
      claim_resolution: 72,
      order_confirmation: 12,
      inventory_accuracy: 72,
      sourcing: 12,
      urgent_orders: 4
    };
    this.incident.slaTarget = targets[e.target.value] || 24;
    this.requestUpdate();
  }

  render() {
    if (this.loading) {
      return html`
        <div class="container-fluid py-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted mt-3">Loading incident...</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container-fluid py-4">
        <!-- Page Header -->
        <div class="mb-4">
          <h2 class="mb-1">
            <i class="bi bi-${this.incidentId ? 'pencil' : 'plus-circle'} me-2"></i>
            ${this.incidentId ? 'Edit' : 'Create'} Incident
          </h2>
          <p class="text-muted mb-0">
            ${this.incidentId ? `Editing incident ${this.incident.incidentNumber}` : 'Create a new SLA incident'}
          </p>
        </div>

        <!-- Form -->
        <form @submit=${this._handleSubmit}>
          <div class="row">
            <!-- Left Column -->
            <div class="col-lg-8">
              <!-- Basic Information -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Basic Information</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Title <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      .value=${this.incident.title}
                      @input=${(e) => this.incident = { ...this.incident, title: e.target.value }}
                      required
                      placeholder="Brief description of the incident"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Account</label>
                    <select
                      class="form-select"
                      .value=${this.incident.account || ''}
                      @change=${(e) => this.incident = { ...this.incident, account: e.target.value }}
                    >
                      <option value="">Select account (optional)</option>
                      ${this.partners.map(p => html`<option value="${p.accountNumber}">${p.accountNumber} • ${p.name}</option>`)}
                    </select>
                    <small class="form-text text-muted">Select a customer account (Business Partner)</small>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Description <span class="text-danger">*</span></label>
                    <textarea
                      class="form-control"
                      rows="4"
                      .value=${this.incident.description}
                      @input=${(e) => this.incident = { ...this.incident, description: e.target.value }}
                      required
                      placeholder="Detailed description of the incident"
                    ></textarea>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Category <span class="text-danger">*</span></label>
                      <select
                        class="form-select"
                        .value=${this.incident.category}
                        @change=${this._updateIncidentCategory}
                        required
                      >
                        <option value="problem_resolution">Problem Resolution</option>
                        <option value="claim_resolution">Claim Resolution</option>
                        <option value="order_confirmation">Order Confirmation</option>
                        <option value="inventory_accuracy">Inventory Accuracy</option>
                        <option value="sourcing">Sourcing</option>
                        <option value="urgent_orders">Urgent Orders</option>
                      </select>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label class="form-label">Priority <span class="text-danger">*</span></label>
                      <select
                        class="form-select"
                        .value=${this.incident.priority}
                        @change=${(e) => this.incident = { ...this.incident, priority: e.target.value }}
                        required
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Severity <span class="text-danger">*</span></label>
                      <select
                        class="form-select"
                        .value=${this.incident.severity}
                        @change=${(e) => this.incident = { ...this.incident, severity: e.target.value }}
                        required
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label class="form-label">Status <span class="text-danger">*</span></label>
                      <select
                        class="form-select"
                        .value=${this.incident.status}
                        @change=${(e) => this.incident = { ...this.incident, status: e.target.value }}
                        required
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Assignment -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Assignment</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Reported By <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.incident.reportedBy}
                        @input=${(e) => this.incident = { ...this.incident, reportedBy: e.target.value }}
                        required
                        placeholder="Person reporting the incident"
                      />
                    </div>

                    <div class="col-md-6 mb-3">
                      <label class="form-label">Assigned To <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.incident.assignedTo}
                        @input=${(e) => this.incident = { ...this.incident, assignedTo: e.target.value }}
                        required
                        placeholder="Team or person assigned"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="col-lg-4">
              <!-- SLA Information -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">SLA Information</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Due Date <span class="text-danger">*</span></label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      .value=${this.incident.dueDate}
                      @input=${(e) => this.incident = { ...this.incident, dueDate: e.target.value }}
                      required
                    />
                    <small class="form-text text-muted">When the incident should be resolved</small>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">SLA Target (hours) <span class="text-danger">*</span></label>
                    <input
                      type="number"
                      class="form-control"
                      .value=${this.incident.slaTarget}
                      @input=${(e) => this.incident = { ...this.incident, slaTarget: e.target.value }}
                      required
                      min="1"
                    />
                    <small class="form-text text-muted">
                      Automatically set based on category
                    </small>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Impacted Customers</label>
                    <input
                      type="number"
                      class="form-control"
                      .value=${this.incident.impactedCustomers}
                      @input=${(e) => this.incident = { ...this.incident, impactedCustomers: e.target.value }}
                      min="0"
                    />
                    <small class="form-text text-muted">Number of customers affected</small>
                  </div>
                </div>
              </div>

              <!-- Info Card -->
              <div class="card mb-4 bg-light">
                <div class="card-body">
                  <h6 class="mb-3"><i class="bi bi-info-circle me-2"></i>SLA Targets by Category</h6>
                  <ul class="list-unstyled small mb-0">
                    <li class="mb-2"><strong>Problem Resolution:</strong> 24 hours</li>
                    <li class="mb-2"><strong>Claim Resolution:</strong> 72 hours</li>
                    <li class="mb-2"><strong>Order Confirmation:</strong> 12 hours</li>
                    <li class="mb-2"><strong>Inventory Accuracy:</strong> 72 hours</li>
                    <li class="mb-2"><strong>Sourcing:</strong> 12 hours</li>
                    <li class="mb-2"><strong>Urgent Orders:</strong> 4 hours</li>
                  </ul>
                </div>
              </div>

              <!-- Actions -->
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg"
                  ?disabled=${this.saving}
                >
                  ${this.saving ? html`
                    <span class="spinner-border spinner-border-sm me-2"></span>Saving...
                  ` : html`
                    <i class="bi bi-check-circle me-2"></i>
                    ${this.incidentId ? 'Update' : 'Create'} Incident
                  `}
                </button>
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  @click=${this._handleCancel}
                  ?disabled=${this.saving}
                >
                  <i class="bi bi-x-circle me-2"></i>Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('incident-form', IncidentFormPage);
