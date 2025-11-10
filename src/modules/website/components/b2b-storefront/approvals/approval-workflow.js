/**
 * Order Approval Workflow Component - Multi-level approval process
 */

import { LitElement, html } from 'lit';

class ApprovalWorkflow extends LitElement {
  static properties = {
    pendingApprovals: { type: Array },
    approvalHistory: { type: Array },
    loading: { type: Boolean },
    selectedOrder: { type: Object },
    showDetailModal: { type: Boolean },
    showRejectModal: { type: Boolean },
    activeTab: { type: String }
  };

  constructor() {
    super();
    this.pendingApprovals = this.getMockPendingApprovals();
    this.approvalHistory = this.getMockApprovalHistory();
    this.loading = false;
    this.selectedOrder = null;
    this.showDetailModal = false;
    this.showRejectModal = false;
    this.activeTab = 'pending';
  }

  createRenderRoot() {
    return this;
  }

  getMockPendingApprovals() {
    return [
      {
        id: 1,
        orderNumber: 'PO-12350',
        requester: 'John Smith',
        requesterEmail: 'john.smith@acme.com',
        department: 'Engineering',
        submitDate: '2025-11-03',
        amount: 15250.00,
        itemCount: 12,
        currentLevel: 2,
        maxLevel: 3,
        approvalChain: [
          { level: 1, approver: 'Manager - Sarah Johnson', status: 'approved', date: '2025-11-03', comment: 'Approved for department budget' },
          { level: 2, approver: 'Director - You', status: 'pending', date: null, comment: null },
          { level: 3, approver: 'VP Finance - Robert Lee', status: 'pending', date: null, comment: null }
        ],
        items: [
          { name: 'Professional Laptop', quantity: 10, price: 1299.99 },
          { name: 'Monitor 27"', quantity: 10, price: 449.99 },
          { name: 'Wireless Mouse', quantity: 10, price: 29.99 }
        ],
        justification: 'New equipment for incoming team members',
        urgency: 'high',
        daysWaiting: 1
      },
      {
        id: 2,
        orderNumber: 'PO-12351',
        requester: 'Emily Davis',
        requesterEmail: 'emily.davis@acme.com',
        department: 'Marketing',
        submitDate: '2025-11-02',
        amount: 5680.00,
        itemCount: 5,
        currentLevel: 1,
        maxLevel: 2,
        approvalChain: [
          { level: 1, approver: 'Manager - You', status: 'pending', date: null, comment: null },
          { level: 2, approver: 'Director - Michael Brown', status: 'pending', date: null, comment: null }
        ],
        items: [
          { name: 'Marketing Software License', quantity: 5, price: 999.00 },
          { name: 'Office Supplies Bundle', quantity: 1, price: 685.00 }
        ],
        justification: 'Q1 marketing campaign materials',
        urgency: 'medium',
        daysWaiting: 2
      },
      {
        id: 3,
        orderNumber: 'PO-12352',
        requester: 'David Wilson',
        requesterEmail: 'david.wilson@acme.com',
        department: 'Operations',
        submitDate: '2025-10-30',
        amount: 45000.00,
        itemCount: 3,
        currentLevel: 3,
        maxLevel: 4,
        approvalChain: [
          { level: 1, approver: 'Manager - Lisa Anderson', status: 'approved', date: '2025-10-30', comment: 'Approved' },
          { level: 2, approver: 'Director - James Miller', status: 'approved', date: '2025-10-31', comment: 'Critical for operations' },
          { level: 3, approver: 'VP Operations - You', status: 'pending', date: null, comment: null },
          { level: 4, approver: 'CFO - Patricia Martinez', status: 'pending', date: null, comment: null }
        ],
        items: [
          { name: 'Industrial Equipment', quantity: 1, price: 35000.00 },
          { name: 'Safety Gear Set', quantity: 50, price: 200.00 }
        ],
        justification: 'Critical equipment replacement - safety compliance',
        urgency: 'critical',
        daysWaiting: 5
      }
    ];
  }

  getMockApprovalHistory() {
    return [
      {
        id: 10,
        orderNumber: 'PO-12345',
        requester: 'Alice Cooper',
        department: 'IT',
        submitDate: '2025-10-25',
        approvedDate: '2025-10-26',
        amount: 8500.00,
        yourAction: 'approved',
        yourLevel: 2,
        finalStatus: 'approved',
        itemCount: 8,
        comment: 'Approved for infrastructure upgrade'
      },
      {
        id: 11,
        orderNumber: 'PO-12346',
        requester: 'Bob Martinez',
        department: 'Sales',
        submitDate: '2025-10-20',
        approvedDate: '2025-10-21',
        amount: 3200.00,
        yourAction: 'rejected',
        yourLevel: 1,
        finalStatus: 'rejected',
        itemCount: 5,
        comment: 'Over budget for this quarter'
      },
      {
        id: 12,
        orderNumber: 'PO-12347',
        requester: 'Carol White',
        department: 'HR',
        submitDate: '2025-10-15',
        approvedDate: '2025-10-16',
        amount: 12000.00,
        yourAction: 'approved',
        yourLevel: 2,
        finalStatus: 'approved',
        itemCount: 20,
        comment: 'Approved for employee onboarding'
      }
    ];
  }

  viewOrderDetails(order) {
    this.selectedOrder = order;
    this.showDetailModal = true;
    this.requestUpdate();
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedOrder = null;
    this.requestUpdate();
  }

  openRejectModal(order) {
    this.selectedOrder = order;
    this.showRejectModal = true;
    this.requestUpdate();
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedOrder = null;
    this.requestUpdate();
  }

  handleApprove(order) {
    if (!confirm(`Approve order ${order.orderNumber} for ${this.formatCurrency(order.amount)}?`)) {
      return;
    }

    // Update approval chain
    const chainIndex = order.approvalChain.findIndex(a => a.status === 'pending');
    if (chainIndex >= 0) {
      order.approvalChain[chainIndex].status = 'approved';
      order.approvalChain[chainIndex].date = new Date().toISOString().split('T')[0];
      order.approvalChain[chainIndex].comment = 'Approved via web portal';
    }

    // Check if more approvals needed
    const nextPending = order.approvalChain.find((a, idx) => idx > chainIndex && a.status === 'pending');
    
    if (nextPending) {
      alert(`Order approved! Forwarded to ${nextPending.approver} for next level approval.`);
    } else {
      alert('Order fully approved! Forwarded to procurement for processing.');
    }

    // Remove from pending
    this.pendingApprovals = this.pendingApprovals.filter(o => o.id !== order.id);
    
    // Add to history
    this.approvalHistory.unshift({
      id: order.id,
      orderNumber: order.orderNumber,
      requester: order.requester,
      department: order.department,
      submitDate: order.submitDate,
      approvedDate: new Date().toISOString().split('T')[0],
      amount: order.amount,
      yourAction: 'approved',
      yourLevel: order.currentLevel,
      finalStatus: nextPending ? 'pending' : 'approved',
      itemCount: order.itemCount,
      comment: 'Approved'
    });

    this.closeDetailModal();
    this.requestUpdate();
  }

  handleReject(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const comment = formData.get('rejectComment');

    if (!comment || comment.trim().length === 0) {
      alert('Please provide a reason for rejection');
      return;
    }

    const order = this.selectedOrder;

    // Update approval chain
    const chainIndex = order.approvalChain.findIndex(a => a.status === 'pending');
    if (chainIndex >= 0) {
      order.approvalChain[chainIndex].status = 'rejected';
      order.approvalChain[chainIndex].date = new Date().toISOString().split('T')[0];
      order.approvalChain[chainIndex].comment = comment;
    }

    alert(`Order ${order.orderNumber} rejected. Requester will be notified.`);

    // Remove from pending
    this.pendingApprovals = this.pendingApprovals.filter(o => o.id !== order.id);
    
    // Add to history
    this.approvalHistory.unshift({
      id: order.id,
      orderNumber: order.orderNumber,
      requester: order.requester,
      department: order.department,
      submitDate: order.submitDate,
      approvedDate: new Date().toISOString().split('T')[0],
      amount: order.amount,
      yourAction: 'rejected',
      yourLevel: order.currentLevel,
      finalStatus: 'rejected',
      itemCount: order.itemCount,
      comment: comment
    });

    this.closeRejectModal();
    this.closeDetailModal();
    this.requestUpdate();
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getUrgencyBadge(urgency) {
    const badges = {
      critical: 'bg-danger',
      high: 'bg-warning text-dark',
      medium: 'bg-info',
      low: 'bg-secondary'
    };
    return badges[urgency] || 'bg-secondary';
  }

  getStatusBadge(status) {
    const badges = {
      approved: 'bg-success',
      rejected: 'bg-danger',
      pending: 'bg-warning text-dark'
    };
    return badges[status] || 'bg-secondary';
  }

  render() {
    return html`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <h2><i class="bi bi-check-circle me-2"></i>Order Approvals</h2>
            <p class="text-muted">Review and approve purchase orders</p>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card border-warning">
              <div class="card-body">
                <h6 class="text-muted">Pending My Approval</h6>
                <h2 class="mb-0 text-warning">${this.pendingApprovals.length}</h2>
                <small class="text-muted">
                  ${this.pendingApprovals.reduce((sum, o) => sum + o.amount, 0) > 0 ? 
                    this.formatCurrency(this.pendingApprovals.reduce((sum, o) => sum + o.amount, 0)) : 
                    '$0.00'}
                </small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-success">
              <div class="card-body">
                <h6 class="text-muted">Approved This Month</h6>
                <h2 class="mb-0 text-success">
                  ${this.approvalHistory.filter(h => h.yourAction === 'approved').length}
                </h2>
                <small class="text-muted">Orders approved</small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-info">
              <div class="card-body">
                <h6 class="text-muted">Average Approval Time</h6>
                <h2 class="mb-0 text-info">1.5 <small class="fs-6">days</small></h2>
                <small class="text-muted">Response time</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <a class="nav-link ${this.activeTab === 'pending' ? 'active' : ''}" 
               @click=${() => this.activeTab = 'pending'} 
               style="cursor: pointer;">
              Pending Approval
              ${this.pendingApprovals.length > 0 ? html`
                <span class="badge bg-warning text-dark ms-2">${this.pendingApprovals.length}</span>
              ` : ''}
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${this.activeTab === 'history' ? 'active' : ''}" 
               @click=${() => this.activeTab = 'history'} 
               style="cursor: pointer;">
              Approval History
            </a>
          </li>
        </ul>

        <!-- Pending Approvals Tab -->
        ${this.activeTab === 'pending' ? html`
          <div class="card">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Order #</th>
                      <th>Requester</th>
                      <th>Department</th>
                      <th>Submit Date</th>
                      <th>Amount</th>
                      <th>Level</th>
                      <th>Urgency</th>
                      <th>Days Waiting</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.pendingApprovals.length > 0 ? html`
                      ${this.pendingApprovals.map(order => html`
                        <tr>
                          <td>
                            <strong>${order.orderNumber}</strong>
                            <br><small class="text-muted">${order.itemCount} items</small>
                          </td>
                          <td>
                            ${order.requester}
                            <br><small class="text-muted">${order.requesterEmail}</small>
                          </td>
                          <td>${order.department}</td>
                          <td>${this.formatDate(order.submitDate)}</td>
                          <td class="fw-bold">${this.formatCurrency(order.amount)}</td>
                          <td>
                            <span class="badge bg-primary">
                              Level ${order.currentLevel} of ${order.maxLevel}
                            </span>
                          </td>
                          <td>
                            <span class="badge ${this.getUrgencyBadge(order.urgency)}">
                              ${order.urgency}
                            </span>
                          </td>
                          <td>
                            <span class="${order.daysWaiting > 3 ? 'text-danger fw-bold' : ''}">
                              ${order.daysWaiting} day${order.daysWaiting !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td>
                            <div class="btn-group btn-group-sm">
                              <button class="btn btn-outline-primary" 
                                      @click=${() => this.viewOrderDetails(order)}
                                      title="View Details">
                                <i class="bi bi-eye"></i>
                              </button>
                              <button class="btn btn-success" 
                                      @click=${() => this.handleApprove(order)}
                                      title="Approve">
                                <i class="bi bi-check-lg"></i>
                              </button>
                              <button class="btn btn-danger" 
                                      @click=${() => this.openRejectModal(order)}
                                      title="Reject">
                                <i class="bi bi-x-lg"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      `)}
                    ` : html`
                      <tr>
                        <td colspan="9" class="text-center text-muted py-4">
                          <i class="bi bi-check-circle" style="font-size: 3rem;"></i>
                          <p class="mt-2">No pending approvals</p>
                        </td>
                      </tr>
                    `}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Approval History Tab -->
        ${this.activeTab === 'history' ? html`
          <div class="card">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Order #</th>
                      <th>Requester</th>
                      <th>Department</th>
                      <th>Submit Date</th>
                      <th>Your Action</th>
                      <th>Amount</th>
                      <th>Your Level</th>
                      <th>Final Status</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.approvalHistory.length > 0 ? html`
                      ${this.approvalHistory.map(record => html`
                        <tr>
                          <td><strong>${record.orderNumber}</strong></td>
                          <td>${record.requester}</td>
                          <td>${record.department}</td>
                          <td>${this.formatDate(record.submitDate)}</td>
                          <td>
                            <span class="badge ${this.getStatusBadge(record.yourAction)}">
                              ${record.yourAction}
                            </span>
                            <br><small class="text-muted">${this.formatDate(record.approvedDate)}</small>
                          </td>
                          <td>${this.formatCurrency(record.amount)}</td>
                          <td>
                            <span class="badge bg-secondary">Level ${record.yourLevel}</span>
                          </td>
                          <td>
                            <span class="badge ${this.getStatusBadge(record.finalStatus)}">
                              ${record.finalStatus}
                            </span>
                          </td>
                          <td>
                            <small class="text-muted">${record.comment || 'No comment'}</small>
                          </td>
                        </tr>
                      `)}
                    ` : html`
                      <tr>
                        <td colspan="9" class="text-center text-muted py-4">
                          <p class="mt-2">No approval history</p>
                        </td>
                      </tr>
                    `}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Order Detail Modal -->
        ${this.showDetailModal && this.selectedOrder ? html`
          <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">
                    Order Approval - ${this.selectedOrder.orderNumber}
                  </h5>
                  <button type="button" class="btn-close" @click=${this.closeDetailModal}></button>
                </div>
                <div class="modal-body">
                  <!-- Order Info -->
                  <div class="row mb-4">
                    <div class="col-md-6">
                      <h6 class="text-muted">Requester Information</h6>
                      <p class="mb-1"><strong>Name:</strong> ${this.selectedOrder.requester}</p>
                      <p class="mb-1"><strong>Email:</strong> ${this.selectedOrder.requesterEmail}</p>
                      <p class="mb-1"><strong>Department:</strong> ${this.selectedOrder.department}</p>
                      <p class="mb-1"><strong>Submit Date:</strong> ${this.formatDate(this.selectedOrder.submitDate)}</p>
                    </div>
                    <div class="col-md-6">
                      <h6 class="text-muted">Order Summary</h6>
                      <p class="mb-1"><strong>Total Amount:</strong> <span class="text-primary fs-5">${this.formatCurrency(this.selectedOrder.amount)}</span></p>
                      <p class="mb-1"><strong>Items:</strong> ${this.selectedOrder.itemCount}</p>
                      <p class="mb-1"><strong>Urgency:</strong> 
                        <span class="badge ${this.getUrgencyBadge(this.selectedOrder.urgency)}">
                          ${this.selectedOrder.urgency}
                        </span>
                      </p>
                      <p class="mb-1"><strong>Days Waiting:</strong> ${this.selectedOrder.daysWaiting} days</p>
                    </div>
                  </div>

                  <!-- Justification -->
                  <div class="alert alert-info">
                    <h6 class="mb-2"><i class="bi bi-info-circle me-2"></i>Business Justification</h6>
                    <p class="mb-0">${this.selectedOrder.justification}</p>
                  </div>

                  <!-- Line Items -->
                  <h6 class="text-muted mb-3">Order Items</h6>
                  <div class="table-responsive mb-4">
                    <table class="table table-sm table-bordered">
                      <thead class="table-light">
                        <tr>
                          <th>Item</th>
                          <th class="text-end">Quantity</th>
                          <th class="text-end">Unit Price</th>
                          <th class="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.selectedOrder.items.map(item => html`
                          <tr>
                            <td>${item.name}</td>
                            <td class="text-end">${item.quantity}</td>
                            <td class="text-end">${this.formatCurrency(item.price)}</td>
                            <td class="text-end">${this.formatCurrency(item.quantity * item.price)}</td>
                          </tr>
                        `)}
                      </tbody>
                      <tfoot class="table-light">
                        <tr>
                          <td colspan="3" class="text-end"><strong>Total:</strong></td>
                          <td class="text-end"><strong>${this.formatCurrency(this.selectedOrder.amount)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <!-- Approval Chain -->
                  <h6 class="text-muted mb-3">Approval Chain</h6>
                  <div class="row">
                    ${this.selectedOrder.approvalChain.map((approver, index) => html`
                      <div class="col-md-3">
                        <div class="card ${approver.status === 'approved' ? 'border-success' : approver.status === 'rejected' ? 'border-danger' : approver.status === 'pending' && index === this.selectedOrder.currentLevel - 1 ? 'border-warning' : ''}">
                          <div class="card-body text-center">
                            <div class="mb-2">
                              <i class="bi bi-${approver.status === 'approved' ? 'check-circle-fill text-success' : approver.status === 'rejected' ? 'x-circle-fill text-danger' : 'hourglass-split text-warning'}" 
                                 style="font-size: 2rem;"></i>
                            </div>
                            <h6 class="mb-1">Level ${approver.level}</h6>
                            <p class="small mb-2">${approver.approver}</p>
                            <span class="badge ${this.getStatusBadge(approver.status)}">
                              ${approver.status}
                            </span>
                            ${approver.date ? html`
                              <p class="small text-muted mt-2 mb-0">${this.formatDate(approver.date)}</p>
                            ` : ''}
                            ${approver.comment ? html`
                              <p class="small text-muted mt-2 mb-0 fst-italic">"${approver.comment}"</p>
                            ` : ''}
                          </div>
                        </div>
                      </div>
                    `)}
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-secondary" @click=${this.closeDetailModal}>
                    Close
                  </button>
                  <button class="btn btn-danger" @click=${() => this.openRejectModal(this.selectedOrder)}>
                    <i class="bi bi-x-lg me-2"></i>Reject Order
                  </button>
                  <button class="btn btn-success" @click=${() => this.handleApprove(this.selectedOrder)}>
                    <i class="bi bi-check-lg me-2"></i>Approve Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Reject Modal -->
        ${this.showRejectModal && this.selectedOrder ? html`
          <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.7); z-index: 1060;">
            <div class="modal-dialog">
              <div class="modal-content">
                <form @submit=${this.handleReject}>
                  <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">Reject Order ${this.selectedOrder.orderNumber}</h5>
                    <button type="button" class="btn-close btn-close-white" @click=${this.closeRejectModal}></button>
                  </div>
                  <div class="modal-body">
                    <div class="alert alert-warning">
                      <i class="bi bi-exclamation-triangle me-2"></i>
                      <strong>Warning:</strong> Rejecting this order will stop the approval process and notify the requester.
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Reason for Rejection *</label>
                      <textarea class="form-control" name="rejectComment" rows="4" 
                                placeholder="Please provide a detailed reason for rejection..." required></textarea>
                      <small class="text-muted">This comment will be sent to the requester.</small>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click=${this.closeRejectModal}>
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-danger">
                      <i class="bi bi-x-lg me-2"></i>Confirm Rejection
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('approval-workflow', ApprovalWorkflow);
