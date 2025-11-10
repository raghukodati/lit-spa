import{T as n,N as a}from"./index-YRTalx74.js";class d extends n{static properties={pendingApprovals:{type:Array},approvalHistory:{type:Array},loading:{type:Boolean},selectedOrder:{type:Object},showDetailModal:{type:Boolean},showRejectModal:{type:Boolean},activeTab:{type:String}};constructor(){super(),this.pendingApprovals=this.getMockPendingApprovals(),this.approvalHistory=this.getMockApprovalHistory(),this.loading=!1,this.selectedOrder=null,this.showDetailModal=!1,this.showRejectModal=!1,this.activeTab="pending"}createRenderRoot(){return this}getMockPendingApprovals(){return[{id:1,orderNumber:"PO-12350",requester:"John Smith",requesterEmail:"john.smith@acme.com",department:"Engineering",submitDate:"2025-11-03",amount:15250,itemCount:12,currentLevel:2,maxLevel:3,approvalChain:[{level:1,approver:"Manager - Sarah Johnson",status:"approved",date:"2025-11-03",comment:"Approved for department budget"},{level:2,approver:"Director - You",status:"pending",date:null,comment:null},{level:3,approver:"VP Finance - Robert Lee",status:"pending",date:null,comment:null}],items:[{name:"Professional Laptop",quantity:10,price:1299.99},{name:'Monitor 27"',quantity:10,price:449.99},{name:"Wireless Mouse",quantity:10,price:29.99}],justification:"New equipment for incoming team members",urgency:"high",daysWaiting:1},{id:2,orderNumber:"PO-12351",requester:"Emily Davis",requesterEmail:"emily.davis@acme.com",department:"Marketing",submitDate:"2025-11-02",amount:5680,itemCount:5,currentLevel:1,maxLevel:2,approvalChain:[{level:1,approver:"Manager - You",status:"pending",date:null,comment:null},{level:2,approver:"Director - Michael Brown",status:"pending",date:null,comment:null}],items:[{name:"Marketing Software License",quantity:5,price:999},{name:"Office Supplies Bundle",quantity:1,price:685}],justification:"Q1 marketing campaign materials",urgency:"medium",daysWaiting:2},{id:3,orderNumber:"PO-12352",requester:"David Wilson",requesterEmail:"david.wilson@acme.com",department:"Operations",submitDate:"2025-10-30",amount:45e3,itemCount:3,currentLevel:3,maxLevel:4,approvalChain:[{level:1,approver:"Manager - Lisa Anderson",status:"approved",date:"2025-10-30",comment:"Approved"},{level:2,approver:"Director - James Miller",status:"approved",date:"2025-10-31",comment:"Critical for operations"},{level:3,approver:"VP Operations - You",status:"pending",date:null,comment:null},{level:4,approver:"CFO - Patricia Martinez",status:"pending",date:null,comment:null}],items:[{name:"Industrial Equipment",quantity:1,price:35e3},{name:"Safety Gear Set",quantity:50,price:200}],justification:"Critical equipment replacement - safety compliance",urgency:"critical",daysWaiting:5}]}getMockApprovalHistory(){return[{id:10,orderNumber:"PO-12345",requester:"Alice Cooper",department:"IT",submitDate:"2025-10-25",approvedDate:"2025-10-26",amount:8500,yourAction:"approved",yourLevel:2,finalStatus:"approved",itemCount:8,comment:"Approved for infrastructure upgrade"},{id:11,orderNumber:"PO-12346",requester:"Bob Martinez",department:"Sales",submitDate:"2025-10-20",approvedDate:"2025-10-21",amount:3200,yourAction:"rejected",yourLevel:1,finalStatus:"rejected",itemCount:5,comment:"Over budget for this quarter"},{id:12,orderNumber:"PO-12347",requester:"Carol White",department:"HR",submitDate:"2025-10-15",approvedDate:"2025-10-16",amount:12e3,yourAction:"approved",yourLevel:2,finalStatus:"approved",itemCount:20,comment:"Approved for employee onboarding"}]}viewOrderDetails(t){this.selectedOrder=t,this.showDetailModal=!0,this.requestUpdate()}closeDetailModal(){this.showDetailModal=!1,this.selectedOrder=null,this.requestUpdate()}openRejectModal(t){this.selectedOrder=t,this.showRejectModal=!0,this.requestUpdate()}closeRejectModal(){this.showRejectModal=!1,this.selectedOrder=null,this.requestUpdate()}handleApprove(t){if(!confirm(`Approve order ${t.orderNumber} for ${this.formatCurrency(t.amount)}?`))return;const s=t.approvalChain.findIndex(e=>e.status==="pending");s>=0&&(t.approvalChain[s].status="approved",t.approvalChain[s].date=new Date().toISOString().split("T")[0],t.approvalChain[s].comment="Approved via web portal");const i=t.approvalChain.find((e,r)=>r>s&&e.status==="pending");alert(i?`Order approved! Forwarded to ${i.approver} for next level approval.`:"Order fully approved! Forwarded to procurement for processing."),this.pendingApprovals=this.pendingApprovals.filter(e=>e.id!==t.id),this.approvalHistory.unshift({id:t.id,orderNumber:t.orderNumber,requester:t.requester,department:t.department,submitDate:t.submitDate,approvedDate:new Date().toISOString().split("T")[0],amount:t.amount,yourAction:"approved",yourLevel:t.currentLevel,finalStatus:i?"pending":"approved",itemCount:t.itemCount,comment:"Approved"}),this.closeDetailModal(),this.requestUpdate()}handleReject(t){t.preventDefault();const i=new FormData(t.target).get("rejectComment");if(!i||i.trim().length===0){alert("Please provide a reason for rejection");return}const e=this.selectedOrder,r=e.approvalChain.findIndex(l=>l.status==="pending");r>=0&&(e.approvalChain[r].status="rejected",e.approvalChain[r].date=new Date().toISOString().split("T")[0],e.approvalChain[r].comment=i),alert(`Order ${e.orderNumber} rejected. Requester will be notified.`),this.pendingApprovals=this.pendingApprovals.filter(l=>l.id!==e.id),this.approvalHistory.unshift({id:e.id,orderNumber:e.orderNumber,requester:e.requester,department:e.department,submitDate:e.submitDate,approvedDate:new Date().toISOString().split("T")[0],amount:e.amount,yourAction:"rejected",yourLevel:e.currentLevel,finalStatus:"rejected",itemCount:e.itemCount,comment:i}),this.closeRejectModal(),this.closeDetailModal(),this.requestUpdate()}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}formatDate(t){return new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}getUrgencyBadge(t){return{critical:"bg-danger",high:"bg-warning text-dark",medium:"bg-info",low:"bg-secondary"}[t]||"bg-secondary"}getStatusBadge(t){return{approved:"bg-success",rejected:"bg-danger",pending:"bg-warning text-dark"}[t]||"bg-secondary"}render(){return a`
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
                  ${this.pendingApprovals.reduce((t,s)=>t+s.amount,0)>0?this.formatCurrency(this.pendingApprovals.reduce((t,s)=>t+s.amount,0)):"$0.00"}
                </small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-success">
              <div class="card-body">
                <h6 class="text-muted">Approved This Month</h6>
                <h2 class="mb-0 text-success">
                  ${this.approvalHistory.filter(t=>t.yourAction==="approved").length}
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
            <a class="nav-link ${this.activeTab==="pending"?"active":""}" 
               @click=${()=>this.activeTab="pending"} 
               style="cursor: pointer;">
              Pending Approval
              ${this.pendingApprovals.length>0?a`
                <span class="badge bg-warning text-dark ms-2">${this.pendingApprovals.length}</span>
              `:""}
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${this.activeTab==="history"?"active":""}" 
               @click=${()=>this.activeTab="history"} 
               style="cursor: pointer;">
              Approval History
            </a>
          </li>
        </ul>

        <!-- Pending Approvals Tab -->
        ${this.activeTab==="pending"?a`
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
                    ${this.pendingApprovals.length>0?a`
                      ${this.pendingApprovals.map(t=>a`
                        <tr>
                          <td>
                            <strong>${t.orderNumber}</strong>
                            <br><small class="text-muted">${t.itemCount} items</small>
                          </td>
                          <td>
                            ${t.requester}
                            <br><small class="text-muted">${t.requesterEmail}</small>
                          </td>
                          <td>${t.department}</td>
                          <td>${this.formatDate(t.submitDate)}</td>
                          <td class="fw-bold">${this.formatCurrency(t.amount)}</td>
                          <td>
                            <span class="badge bg-primary">
                              Level ${t.currentLevel} of ${t.maxLevel}
                            </span>
                          </td>
                          <td>
                            <span class="badge ${this.getUrgencyBadge(t.urgency)}">
                              ${t.urgency}
                            </span>
                          </td>
                          <td>
                            <span class="${t.daysWaiting>3?"text-danger fw-bold":""}">
                              ${t.daysWaiting} day${t.daysWaiting!==1?"s":""}
                            </span>
                          </td>
                          <td>
                            <div class="btn-group btn-group-sm">
                              <button class="btn btn-outline-primary" 
                                      @click=${()=>this.viewOrderDetails(t)}
                                      title="View Details">
                                <i class="bi bi-eye"></i>
                              </button>
                              <button class="btn btn-success" 
                                      @click=${()=>this.handleApprove(t)}
                                      title="Approve">
                                <i class="bi bi-check-lg"></i>
                              </button>
                              <button class="btn btn-danger" 
                                      @click=${()=>this.openRejectModal(t)}
                                      title="Reject">
                                <i class="bi bi-x-lg"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      `)}
                    `:a`
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
        `:""}

        <!-- Approval History Tab -->
        ${this.activeTab==="history"?a`
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
                    ${this.approvalHistory.length>0?a`
                      ${this.approvalHistory.map(t=>a`
                        <tr>
                          <td><strong>${t.orderNumber}</strong></td>
                          <td>${t.requester}</td>
                          <td>${t.department}</td>
                          <td>${this.formatDate(t.submitDate)}</td>
                          <td>
                            <span class="badge ${this.getStatusBadge(t.yourAction)}">
                              ${t.yourAction}
                            </span>
                            <br><small class="text-muted">${this.formatDate(t.approvedDate)}</small>
                          </td>
                          <td>${this.formatCurrency(t.amount)}</td>
                          <td>
                            <span class="badge bg-secondary">Level ${t.yourLevel}</span>
                          </td>
                          <td>
                            <span class="badge ${this.getStatusBadge(t.finalStatus)}">
                              ${t.finalStatus}
                            </span>
                          </td>
                          <td>
                            <small class="text-muted">${t.comment||"No comment"}</small>
                          </td>
                        </tr>
                      `)}
                    `:a`
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
        `:""}

        <!-- Order Detail Modal -->
        ${this.showDetailModal&&this.selectedOrder?a`
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
                        ${this.selectedOrder.items.map(t=>a`
                          <tr>
                            <td>${t.name}</td>
                            <td class="text-end">${t.quantity}</td>
                            <td class="text-end">${this.formatCurrency(t.price)}</td>
                            <td class="text-end">${this.formatCurrency(t.quantity*t.price)}</td>
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
                    ${this.selectedOrder.approvalChain.map((t,s)=>a`
                      <div class="col-md-3">
                        <div class="card ${t.status==="approved"?"border-success":t.status==="rejected"?"border-danger":t.status==="pending"&&s===this.selectedOrder.currentLevel-1?"border-warning":""}">
                          <div class="card-body text-center">
                            <div class="mb-2">
                              <i class="bi bi-${t.status==="approved"?"check-circle-fill text-success":t.status==="rejected"?"x-circle-fill text-danger":"hourglass-split text-warning"}" 
                                 style="font-size: 2rem;"></i>
                            </div>
                            <h6 class="mb-1">Level ${t.level}</h6>
                            <p class="small mb-2">${t.approver}</p>
                            <span class="badge ${this.getStatusBadge(t.status)}">
                              ${t.status}
                            </span>
                            ${t.date?a`
                              <p class="small text-muted mt-2 mb-0">${this.formatDate(t.date)}</p>
                            `:""}
                            ${t.comment?a`
                              <p class="small text-muted mt-2 mb-0 fst-italic">"${t.comment}"</p>
                            `:""}
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
                  <button class="btn btn-danger" @click=${()=>this.openRejectModal(this.selectedOrder)}>
                    <i class="bi bi-x-lg me-2"></i>Reject Order
                  </button>
                  <button class="btn btn-success" @click=${()=>this.handleApprove(this.selectedOrder)}>
                    <i class="bi bi-check-lg me-2"></i>Approve Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        `:""}

        <!-- Reject Modal -->
        ${this.showRejectModal&&this.selectedOrder?a`
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
        `:""}
      </div>
    `}}customElements.define("approval-workflow",d);
