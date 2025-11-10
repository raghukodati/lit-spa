/**
 * Approval Rules Component - Configure approval thresholds and rules
 */

import { LitElement, html } from 'lit';

class ApprovalRules extends LitElement {
  static properties = {
    rules: { type: Array },
    loading: { type: Boolean },
    showModal: { type: Boolean },
    editingRule: { type: Object },
    isNew: { type: Boolean }
  };

  constructor() {
    super();
    this.rules = this.loadRules();
    this.loading = false;
    this.showModal = false;
    this.editingRule = null;
    this.isNew = false;
  }

  createRenderRoot() {
    return this;
  }

  loadRules() {
    return [
      {
        id: 1,
        name: 'Standard Purchase',
        description: 'Orders under $5,000',
        minAmount: 0,
        maxAmount: 5000,
        requiredLevels: 1,
        approvers: [
          { level: 1, role: 'Department Manager', users: ['Sarah Johnson', 'Michael Brown'] }
        ],
        active: true
      },
      {
        id: 2,
        name: 'Medium Purchase',
        description: 'Orders between $5,000 and $25,000',
        minAmount: 5000,
        maxAmount: 25000,
        requiredLevels: 2,
        approvers: [
          { level: 1, role: 'Department Manager', users: ['Sarah Johnson', 'Michael Brown'] },
          { level: 2, role: 'Director', users: ['You', 'James Miller'] }
        ],
        active: true
      },
      {
        id: 3,
        name: 'Large Purchase',
        description: 'Orders between $25,000 and $100,000',
        minAmount: 25000,
        maxAmount: 100000,
        requiredLevels: 3,
        approvers: [
          { level: 1, role: 'Department Manager', users: ['Sarah Johnson', 'Michael Brown'] },
          { level: 2, role: 'Director', users: ['You', 'James Miller'] },
          { level: 3, role: 'VP/C-Level', users: ['Robert Lee', 'Patricia Martinez'] }
        ],
        active: true
      },
      {
        id: 4,
        name: 'Executive Purchase',
        description: 'Orders over $100,000',
        minAmount: 100000,
        maxAmount: null,
        requiredLevels: 4,
        approvers: [
          { level: 1, role: 'Department Manager', users: ['Sarah Johnson', 'Michael Brown'] },
          { level: 2, role: 'Director', users: ['You', 'James Miller'] },
          { level: 3, role: 'VP/C-Level', users: ['Robert Lee', 'Patricia Martinez'] },
          { level: 4, role: 'CFO/CEO', users: ['Patricia Martinez', 'CEO'] }
        ],
        active: true
      }
    ];
  }

  saveRules() {
    localStorage.setItem('approval-rules', JSON.stringify(this.rules));
  }

  openNewRuleModal() {
    this.isNew = true;
    this.editingRule = {
      name: '',
      description: '',
      minAmount: 0,
      maxAmount: null,
      requiredLevels: 1,
      approvers: [
        { level: 1, role: '', users: [] }
      ],
      active: true
    };
    this.showModal = true;
    this.requestUpdate();
  }

  editRule(rule) {
    this.isNew = false;
    this.editingRule = JSON.parse(JSON.stringify(rule));
    this.showModal = true;
    this.requestUpdate();
  }

  closeModal() {
    this.showModal = false;
    this.editingRule = null;
    this.requestUpdate();
  }

  toggleRuleStatus(rule) {
    rule.active = !rule.active;
    this.saveRules();
    this.requestUpdate();
  }

  formatCurrency(amount) {
    if (amount === null) return '∞';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  render() {
    return html`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2><i class="bi bi-gear me-2"></i>Approval Rules</h2>
                <p class="text-muted">Configure approval thresholds and workflows</p>
              </div>
              <button class="btn btn-primary" @click=${this.openNewRuleModal}>
                <i class="bi bi-plus-lg me-2"></i>Add Rule
              </button>
            </div>
          </div>
        </div>

        <!-- Info Alert -->
        <div class="alert alert-info mb-4">
          <h6><i class="bi bi-info-circle me-2"></i>About Approval Rules</h6>
          <p class="mb-0">
            Approval rules automatically determine how many approvals are required based on order amount. 
            Orders are routed to the appropriate approvers based on these thresholds.
          </p>
        </div>

        <!-- Rules Cards -->
        <div class="row">
          ${this.rules.map(rule => html`
            <div class="col-md-6 mb-4">
              <div class="card h-100 ${!rule.active ? 'opacity-50' : ''}">
                <div class="card-header ${rule.active ? 'bg-primary text-white' : 'bg-secondary text-white'}">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">${rule.name}</h5>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" 
                             ?checked=${rule.active}
                             @change=${() => this.toggleRuleStatus(rule)}
                             style="cursor: pointer;">
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <p class="text-muted mb-3">${rule.description}</p>
                  
                  <!-- Amount Range -->
                  <div class="alert alert-light mb-3">
                    <h6 class="mb-2">Amount Range</h6>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="badge bg-success fs-6">${this.formatCurrency(rule.minAmount)}</span>
                      <i class="bi bi-arrow-right"></i>
                      <span class="badge bg-success fs-6">${this.formatCurrency(rule.maxAmount)}</span>
                    </div>
                  </div>

                  <!-- Approval Levels -->
                  <h6 class="mb-2">
                    <i class="bi bi-check-circle me-2"></i>
                    Requires ${rule.requiredLevels} Level${rule.requiredLevels > 1 ? 's' : ''}
                  </h6>
                  
                  <div class="approval-chain">
                    ${rule.approvers.map((approver, index) => html`
                      <div class="d-flex align-items-start mb-2">
                        <span class="badge bg-primary me-2">${approver.level}</span>
                        <div class="flex-grow-1">
                          <div class="fw-bold">${approver.role}</div>
                          <div class="small text-muted">
                            ${approver.users.map((user, userIndex) => html`
                              <span class="badge bg-light text-dark me-1">${user}</span>
                            `)}
                          </div>
                        </div>
                      </div>
                      ${index < rule.approvers.length - 1 ? html`
                        <div class="text-center text-muted my-1">
                          <i class="bi bi-arrow-down"></i>
                        </div>
                      ` : ''}
                    `)}
                  </div>
                </div>
                <div class="card-footer bg-transparent">
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" 
                            @click=${() => this.editRule(rule)}>
                      <i class="bi bi-pencil me-1"></i>Edit
                    </button>
                    <button class="btn btn-sm btn-outline-secondary">
                      <i class="bi bi-eye me-1"></i>View Orders
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `)}
        </div>

        <!-- How It Works -->
        <div class="card mt-4">
          <div class="card-header bg-light">
            <h5 class="mb-0"><i class="bi bi-lightbulb me-2"></i>How Approval Rules Work</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <h6><i class="bi bi-1-circle text-primary me-2"></i>Order Submitted</h6>
                <p class="small">Employee submits a purchase order with total amount</p>
              </div>
              <div class="col-md-4">
                <h6><i class="bi bi-2-circle text-primary me-2"></i>Rule Matched</h6>
                <p class="small">System finds the matching rule based on order amount</p>
              </div>
              <div class="col-md-4">
                <h6><i class="bi bi-3-circle text-primary me-2"></i>Approval Chain</h6>
                <p class="small">Order routed through required approval levels sequentially</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('approval-rules', ApprovalRules);
