import{T as r,N as s}from"./index-DZz2m7sH.js";class c extends r{static properties={myRequests:{type:Array},loading:{type:Boolean},selectedRequest:{type:Object},showDetailModal:{type:Boolean}};constructor(){super(),this.myRequests=this.getMockRequests(),this.loading=!1,this.selectedRequest=null,this.showDetailModal=!1}createRenderRoot(){return this}getMockRequests(){return[{id:1,orderNumber:"PO-12348",submitDate:"2025-11-04",amount:2450,itemCount:5,status:"pending",currentLevel:1,maxLevel:2,approvalChain:[{level:1,approver:"Manager - Sarah Johnson",status:"pending",date:null},{level:2,approver:"Director - Michael Brown",status:"pending",date:null}],items:[{name:"Office Chair",quantity:5,price:299.99},{name:"Desk Lamp",quantity:5,price:89.99}],justification:"New employee setup",daysWaiting:0},{id:2,orderNumber:"PO-12349",submitDate:"2025-11-01",amount:8900,itemCount:3,status:"approved",currentLevel:2,maxLevel:2,approvalChain:[{level:1,approver:"Manager - Sarah Johnson",status:"approved",date:"2025-11-01",comment:"Approved"},{level:2,approver:"Director - Michael Brown",status:"approved",date:"2025-11-02",comment:"Approved for Q4 budget"}],items:[{name:"Laptop Pro",quantity:3,price:1899.99},{name:"Docking Station",quantity:3,price:299.99}],justification:"Development team equipment",finalApprovalDate:"2025-11-02",daysWaiting:1},{id:3,orderNumber:"PO-12347",submitDate:"2025-10-28",amount:1250,itemCount:2,status:"rejected",currentLevel:1,maxLevel:1,approvalChain:[{level:1,approver:"Manager - Sarah Johnson",status:"rejected",date:"2025-10-29",comment:"Please resubmit with detailed cost breakdown and alternative options"}],items:[{name:"Software License",quantity:2,price:625}],justification:"Team productivity tools",rejectedDate:"2025-10-29",daysWaiting:1}]}viewRequestDetails(e){this.selectedRequest=e,this.showDetailModal=!0,this.requestUpdate()}closeDetailModal(){this.showDetailModal=!1,this.selectedRequest=null,this.requestUpdate()}cancelRequest(e){confirm(`Cancel approval request ${e.orderNumber}?`)&&(alert("Approval request cancelled. Order moved back to draft."),this.myRequests=this.myRequests.filter(a=>a.id!==e.id),this.closeDetailModal(),this.requestUpdate())}resubmitRequest(e){alert(`Order ${e.orderNumber} resubmitted for approval with updates.`),e.status="pending",e.submitDate=new Date().toISOString().split("T")[0],e.daysWaiting=0,e.approvalChain.forEach(a=>{a.status="pending",a.date=null,a.comment=null}),this.closeDetailModal(),this.requestUpdate()}formatCurrency(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(e)}formatDate(e){return new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}getStatusBadge(e){return{approved:"bg-success",rejected:"bg-danger",pending:"bg-warning text-dark"}[e]||"bg-secondary"}getApprovalProgress(e){return e.approvalChain.filter(t=>t.status==="approved").length/e.maxLevel*100}render(){const e=this.myRequests.filter(t=>t.status==="pending").length,a=this.myRequests.filter(t=>t.status==="approved").length,d=this.myRequests.filter(t=>t.status==="rejected").length;return s`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2><i class="bi bi-send me-2"></i>My Approval Requests</h2>
                <p class="text-muted">Track your submitted orders pending approval</p>
              </div>
              <button class="btn btn-primary" @click=${()=>window.location.pathname="/b2b-store/cart"}>
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
                <h2 class="mb-0 text-warning">${e}</h2>
                <small class="text-muted">Awaiting approval</small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-success">
              <div class="card-body">
                <h6 class="text-muted">Approved</h6>
                <h2 class="mb-0 text-success">${a}</h2>
                <small class="text-muted">Ready for processing</small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-danger">
              <div class="card-body">
                <h6 class="text-muted">Rejected</h6>
                <h2 class="mb-0 text-danger">${d}</h2>
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
                  ${this.myRequests.length>0?s`
                    ${this.myRequests.map(t=>{const i=t.approvalChain.find(l=>l.status==="pending");return s`
                        <tr>
                          <td>
                            <strong>${t.orderNumber}</strong>
                            ${t.daysWaiting>2?s`
                              <br><small class="text-danger">
                                <i class="bi bi-clock"></i> ${t.daysWaiting} days
                              </small>
                            `:""}
                          </td>
                          <td>${this.formatDate(t.submitDate)}</td>
                          <td class="fw-bold">${this.formatCurrency(t.amount)}</td>
                          <td>${t.itemCount}</td>
                          <td>
                            <span class="badge ${this.getStatusBadge(t.status)}">
                              ${t.status}
                            </span>
                          </td>
                          <td>
                            <div class="progress" style="height: 20px;">
                              <div class="progress-bar ${t.status==="approved"?"bg-success":t.status==="rejected"?"bg-danger":"bg-warning"}" 
                                   style="width: ${this.getApprovalProgress(t)}%">
                                ${t.approvalChain.filter(l=>l.status==="approved").length}/${t.maxLevel}
                              </div>
                            </div>
                          </td>
                          <td>
                            ${i?s`
                              <small>${i.approver}</small>
                            `:t.status==="approved"?s`
                              <span class="text-success"><i class="bi bi-check-circle"></i> Complete</span>
                            `:s`
                              <span class="text-danger"><i class="bi bi-x-circle"></i> Rejected</span>
                            `}
                          </td>
                          <td>
                            <div class="btn-group btn-group-sm">
                              <button class="btn btn-outline-primary" 
                                      @click=${()=>this.viewRequestDetails(t)}
                                      title="View Details">
                                <i class="bi bi-eye"></i>
                              </button>
                              ${t.status==="pending"?s`
                                <button class="btn btn-outline-danger" 
                                        @click=${()=>this.cancelRequest(t)}
                                        title="Cancel Request">
                                  <i class="bi bi-x-lg"></i>
                                </button>
                              `:t.status==="rejected"?s`
                                <button class="btn btn-outline-warning" 
                                        @click=${()=>this.resubmitRequest(t)}
                                        title="Resubmit">
                                  <i class="bi bi-arrow-repeat"></i>
                                </button>
                              `:""}
                            </div>
                          </td>
                        </tr>
                      `})}
                  `:s`
                    <tr>
                      <td colspan="8" class="text-center text-muted py-4">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <p class="mt-2">No approval requests found</p>
                        <button class="btn btn-primary" @click=${()=>window.location.pathname="/b2b-store/cart"}>
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
        ${this.showDetailModal&&this.selectedRequest?s`
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
                  ${this.selectedRequest.status==="rejected"?s`
                    <div class="alert alert-danger">
                      <h6><i class="bi bi-x-circle me-2"></i>Order Rejected</h6>
                      <p class="mb-0">This order was rejected. Please review the feedback and resubmit with corrections.</p>
                    </div>
                  `:this.selectedRequest.status==="approved"?s`
                    <div class="alert alert-success">
                      <h6><i class="bi bi-check-circle me-2"></i>Order Approved</h6>
                      <p class="mb-0">This order has been fully approved and forwarded to procurement.</p>
                    </div>
                  `:""}

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
                        ${this.selectedRequest.items.map(t=>s`
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
                          <td class="text-end"><strong>${this.formatCurrency(this.selectedRequest.amount)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <!-- Approval Chain Timeline -->
                  <h6 class="text-muted mb-3">Approval Timeline</h6>
                  <div class="row">
                    ${this.selectedRequest.approvalChain.map((t,i)=>s`
                      <div class="col-md-${12/this.selectedRequest.maxLevel}">
                        <div class="card ${t.status==="approved"?"border-success":t.status==="rejected"?"border-danger":"border-warning"}">
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
                            ${t.date?s`
                              <p class="small text-muted mt-2 mb-0">${this.formatDate(t.date)}</p>
                            `:""}
                            ${t.comment?s`
                              <div class="alert alert-${t.status==="rejected"?"danger":"success"} mt-2 small">
                                "${t.comment}"
                              </div>
                            `:""}
                          </div>
                        </div>
                      </div>
                    `)}
                  </div>
                </div>
                <div class="modal-footer">
                  ${this.selectedRequest.status==="pending"?s`
                    <button class="btn btn-danger" @click=${()=>this.cancelRequest(this.selectedRequest)}>
                      <i class="bi bi-x-lg me-2"></i>Cancel Request
                    </button>
                  `:this.selectedRequest.status==="rejected"?s`
                    <button class="btn btn-warning" @click=${()=>this.resubmitRequest(this.selectedRequest)}>
                      <i class="bi bi-arrow-repeat me-2"></i>Resubmit Order
                    </button>
                  `:""}
                  <button class="btn btn-secondary" @click=${this.closeDetailModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        `:""}
      </div>
    `}}customElements.define("approval-request",c);
