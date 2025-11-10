/**
 * Approval Request Component - Submit orders for approval
 */

import { LitElement, html } from 'lit';

class ApprovalRequest extends LitElement {
  static properties = {
    myRequests: { type: Array },
    loading: { type: Boolean },
    selectedRequest: { type: Object },
    showDetailModal: { type: Boolean }
  };

  constructor() {
    super();
    this.myRequests = this.getMockRequests();
    this.loading = false;
    this.selectedRequest = null;
    this.showDetailModal = false;
  }

  createRenderRoot() {
    return this;
  }

  getMockRequests() {
    return [
      {
        id: 1,
        orderNumber: 'PO-12348',
        submitDate: '2025-11-04',
        amount: 2450.00,
        itemCount: 5,
        status: 'pending',
        currentLevel: 1,
        maxLevel: 2,
        approvalChain: [
          { level: 1, approver: 'Manager - Sarah Johnson', status: 'pending', date: null },
          { level: 2, approver: 'Director - Michael Brown', status: 'pending', date: null }
        ],
        items: [
          { name: 'Office Chair', quantity: 5, price: 299.99 },
          { name: 'Desk Lamp', quantity: 5, price: 89.99 }
        ],
        justification: 'New employee setup',
        daysWaiting: 0
      },
      {
        id: 2,
        orderNumber: 'PO-12349',
        submitDate: '2025-11-01',
        amount: 8900.00,
        itemCount: 3,
        status: 'approved',
        currentLevel: 2,
        maxLevel: 2,
        approvalChain: [
          { level: 1, approver: 'Manager - Sarah Johnson', status: 'approved', date: '2025-11-01', comment: 'Approved' },
          { level: 2, approver: 'Director - Michael Brown', status: 'approved', date: '2025-11-02', comment: 'Approved for Q4 budget' }
        ],
        items: [
          { name: 'Laptop Pro', quantity: 3, price: 1899.99 },
          { name: 'Docking Station', quantity: 3, price: 299.99 }
        ],
        justification: 'Development team equipment',
        finalApprovalDate: '2025-11-02',
        daysWaiting: 1
      },
      {
        id: 3,
        orderNumber: 'PO-12347',
        submitDate: '2025-10-28',
        amount: 1250.00,
        itemCount: 2,
        status: 'rejected',
        currentLevel: 1,
        maxLevel: 1,
        approvalChain: [
          { 
            level: 1, 
            approver: 'Manager - Sarah Johnson', 
            status: 'rejected', 
            date: '2025-10-29', 
            comment: 'Please resubmit with detailed cost breakdown and alternative options' 
          }
        ],
        items: [
          { name: 'Software License', quantity: 2, price: 625.00 }
        ],
        justification: 'Team productivity tools',
        rejectedDate: '2025-10-29',
        daysWaiting: 1
      }
    ];
  }

  viewRequestDetails(request) {
    this.selectedRequest = request;
    this.showDetailModal = true;
    this.requestUpdate();
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedRequest = null;
    this.requestUpdate();
  }

  cancelRequest(request) {
    if (!confirm(`Cancel approval request ${request.orderNumber}?`)) {
      return;
    }

    alert('Approval request cancelled. Order moved back to draft.');
    this.myRequests = this.myRequests.filter(r => r.id !== request.id);
    this.closeDetailModal();
    this.requestUpdate();
  }

  resubmitRequest(request) {
    alert(`Order ${request.orderNumber} resubmitted for approval with updates.`);
    request.status = 'pending';
    request.submitDate = new Date().toISOString().split('T')[0];
    request.daysWaiting = 0;
    request.approvalChain.forEach(a => {
      a.status = 'pending';
      a.date = null;
      a.comment = null;
    });
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

  getStatusBadge(status) {
    const badges = {
      approved: 'bg-success',
      rejected: 'bg-danger',
      pending: 'bg-warning text-dark'
    };
    return badges[status] || 'bg-secondary';
  }

  getApprovalProgress(request) {
    const approvedCount = request.approvalChain.filter(a => a.status === 'approved').length;
    const percentage = (approvedCount / request.maxLevel) * 100;
    return percentage;
  }

  render() {
    const pendingCount = this.myRequests.filter(r => r.status === 'pending').length;
    const approvedCount = this.myRequests.filter(r => r.status === 'approved').length;
    const rejectedCount = this.myRequests.filter(r => r.status === 'rejected').length;

    return html`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2><i class="bi bi-send me-2"></i>My Approval Requests</h2>
                <p class="text-muted">Track your submitted orders pending approval</p>
              </div>
              <button class="btn btn-primary" @click=${() => window.location.pathname = '/b2b-store/cart'}>
                <i class="bi bi-plus-lg me-2"></i>Submit New Order
              </button>
            </div>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card border-warning">
              <div class="card-body">
                <h6 class="text-muted">Pending Approval</h6>
                <h2 class="mb-0 text-warning">${pendingCount}</h2>
                <small class="text-muted">Awaiting approval</small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-success">
              <div class="card-body">
                <h6 class="text-muted">Approved</h6>
                <h2 class="mb-0 text-success">${approvedCount}</h2>
                <small class="text-muted">Ready for processing</small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-danger">
              <div class="card-body">
                <h6 class="text-muted">Rejected</h6>
                <h2 class="mb-0 text-danger">${rejectedCount}</h2>
                <small class="text-muted">Needs revision</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Requests Table -->
        <div class="card">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Submit Date</th>
                    <th>Amount</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Current Approver</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.myRequests.length > 0 ? html`
                    ${this.myRequests.map(request => {
                      const currentApprover = request.approvalChain.find(a => a.status === 'pending');
                      return html`
                        <tr>
                          <td>
                            <strong>${request.orderNumber}</strong>
                            ${request.daysWaiting > 2 ? html`
                              <br><small class="text-danger">
                                <i class="bi bi-clock"></i> ${request.daysWaiting} days
                              </small>
                            ` : ''}
                          </td>
                          <td>${this.formatDate(request.submitDate)}</td>
                          <td class="fw-bold">${this.formatCurrency(request.amount)}</td>
                          <td>${request.itemCount}</td>
                          <td>
                            <span class="badge ${this.getStatusBadge(request.status)}">
                              ${request.status}
                            </span>
                          </td>
                          <td>
                            <div class="progress" style="height: 20px;">
                              <div class="progress-bar ${request.status === 'approved' ? 'bg-success' : request.status === 'rejected' ? 'bg-danger' : 'bg-warning'}" 
                                   style="width: ${this.getApprovalProgress(request)}%">
                                ${request.approvalChain.filter(a => a.status === 'approved').length}/${request.maxLevel}
                              </div>
                            </div>
                          </td>
                          <td>
                            ${currentApprover ? html`
                              <small>${currentApprover.approver}</small>
                            ` : request.status === 'approved' ? html`
                              <span class="text-success"><i class="bi bi-check-circle"></i> Complete</span>
                            ` : html`
                              <span class="text-danger"><i class="bi bi-x-circle"></i> Rejected</span>
                            `}
                          </td>
                          <td>
                            <div class="btn-group btn-group-sm">
                              <button class="btn btn-outline-primary" 
                                      @click=${() => this.viewRequestDetails(request)}
                                      title="View Details">
                                <i class="bi bi-eye"></i>
                              </button>
                              ${request.status === 'pending' ? html`
                                <button class="btn btn-outline-danger" 
                                        @click=${() => this.cancelRequest(request)}
                                        title="Cancel Request">
                                  <i class="bi bi-x-lg"></i>
                                </button>
                              ` : request.status === 'rejected' ? html`
                                <button class="btn btn-outline-warning" 
                                        @click=${() => this.resubmitRequest(request)}
                                        title="Resubmit">
                                  <i class="bi bi-arrow-repeat"></i>
                                </button>
                              ` : ''}
                            </div>
                          </td>
                        </tr>
                      `;
                    })}
                  ` : html`
                    <tr>
                      <td colspan="8" class="text-center text-muted py-4">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <p class="mt-2">No approval requests found</p>
                        <button class="btn btn-primary" @click=${() => window.location.pathname = '/b2b-store/cart'}>
                          Submit Your First Order
                        </button>
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Request Detail Modal -->
        ${this.showDetailModal && this.selectedRequest ? html`
          <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">
                    Approval Request - ${this.selectedRequest.orderNumber}
                  </h5>
                  <button type="button" class="btn-close" @click=${this.closeDetailModal}></button>
                </div>
                <div class="modal-body">
                  <!-- Status Alert -->
                  ${this.selectedRequest.status === 'rejected' ? html`
                    <div class="alert alert-danger">
                      <h6><i class="bi bi-x-circle me-2"></i>Order Rejected</h6>
                      <p class="mb-0">This order was rejected. Please review the feedback and resubmit with corrections.</p>
                    </div>
                  ` : this.selectedRequest.status === 'approved' ? html`
                    <div class="alert alert-success">
                      <h6><i class="bi bi-check-circle me-2"></i>Order Approved</h6>
                      <p class="mb-0">This order has been fully approved and forwarded to procurement.</p>
                    </div>
                  ` : ''}

                  <!-- Order Info -->
                  <div class="row mb-4">
                    <div class="col-md-6">
                      <h6 class="text-muted">Order Information</h6>
                      <p class="mb-1"><strong>Order #:</strong> ${this.selectedRequest.orderNumber}</p>
                      <p class="mb-1"><strong>Submit Date:</strong> ${this.formatDate(this.selectedRequest.submitDate)}</p>
                      <p class="mb-1"><strong>Total Amount:</strong> <span class="text-primary fs-5">${this.formatCurrency(this.selectedRequest.amount)}</span></p>
                      <p class="mb-1"><strong>Items:</strong> ${this.selectedRequest.itemCount}</p>
                    </div>
                    <div class="col-md-6">
                      <h6 class="text-muted">Approval Status</h6>
                      <p class="mb-1">
                        <strong>Status:</strong> 
                        <span class="badge ${this.getStatusBadge(this.selectedRequest.status)} ms-1">
                          ${this.selectedRequest.status}
                        </span>
                      </p>
                      <p class="mb-1"><strong>Approval Level:</strong> ${this.selectedRequest.currentLevel} of ${this.selectedRequest.maxLevel}</p>
                      <p class="mb-1"><strong>Days in Process:</strong> ${this.selectedRequest.daysWaiting} days</p>
                    </div>
                  </div>

                  <!-- Justification -->
                  <div class="alert alert-info">
                    <h6 class="mb-2"><i class="bi bi-info-circle me-2"></i>Business Justification</h6>
                    <p class="mb-0">${this.selectedRequest.justification}</p>
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
                        ${this.selectedRequest.items.map(item => html`
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
                          <td class="text-end"><strong>${this.formatCurrency(this.selectedRequest.amount)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <!-- Approval Chain Timeline -->
                  <h6 class="text-muted mb-3">Approval Timeline</h6>
                  <div class="row">
                    ${this.selectedRequest.approvalChain.map((approver, index) => html`
                      <div class="col-md-${12 / this.selectedRequest.maxLevel}">
                        <div class="card ${approver.status === 'approved' ? 'border-success' : approver.status === 'rejected' ? 'border-danger' : 'border-warning'}">
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
                              <div class="alert alert-${approver.status === 'rejected' ? 'danger' : 'success'} mt-2 small">
                                "${approver.comment}"
                              </div>
                            ` : ''}
                          </div>
                        </div>
                      </div>
                    `)}
                  </div>
                </div>
                <div class="modal-footer">
                  ${this.selectedRequest.status === 'pending' ? html`
                    <button class="btn btn-danger" @click=${() => this.cancelRequest(this.selectedRequest)}>
                      <i class="bi bi-x-lg me-2"></i>Cancel Request
                    </button>
                  ` : this.selectedRequest.status === 'rejected' ? html`
                    <button class="btn btn-warning" @click=${() => this.resubmitRequest(this.selectedRequest)}>
                      <i class="bi bi-arrow-repeat me-2"></i>Resubmit Order
                    </button>
                  ` : ''}
                  <button class="btn btn-secondary" @click=${this.closeDetailModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('approval-request', ApprovalRequest);
