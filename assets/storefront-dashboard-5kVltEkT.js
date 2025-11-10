import{T as i,N as s}from"./index-BTuak744.js";import{getCompanyById as a}from"./company.service-Cm4CCELN.js";import{getPurchaseOrders as e}from"./purchaseorder.service-CKGPskG3.js";import"./company.model-CKmygYMs.js";class c extends i{static properties={company:{type:Object},recentOrders:{type:Array},loading:{type:Boolean}};constructor(){super(),this.company=null,this.recentOrders=[],this.loading=!1,this.companyId=1}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadData()}async loadData(){this.loading=!0;try{[this.company,this.recentOrders]=await Promise.all([a(this.companyId),e({companyId:this.companyId,limit:5})])}catch(t){console.error("Failed to load data:",t)}finally{this.loading=!1}}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}render(){return this.loading?s`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading...</p>
          </div>
        </div>
      `:s`
      <div class="container-fluid mt-4">
        <!-- Welcome Header -->
        <div class="mb-4">
          <h1 class="mb-2">Welcome, ${this.company?.name||"Valued Customer"}</h1>
          <p class="text-muted">Manage your orders, browse products, and track shipments</p>
        </div>

        <div class="row">
          <!-- Left Column -->
          <div class="col-lg-8">
            <!-- Quick Actions -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Quick Actions</h5>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-4">
                    <button class="btn btn-primary w-100" @click=${()=>window.location.pathname="/b2b-store/catalog"}>
                      <i class="bi bi-grid me-2"></i>Browse Catalog
                    </button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn btn-outline-primary w-100" @click=${()=>window.location.pathname="/b2b-store/quick-order"}>
                      <i class="bi bi-lightning me-2"></i>Quick Order
                    </button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn btn-outline-primary w-100" @click=${()=>window.location.pathname="/b2b-store/orders"}>
                      <i class="bi bi-receipt me-2"></i>Order History
                    </button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn btn-outline-secondary w-100" @click=${()=>window.location.pathname="/b2b-store/quotes"}>
                      <i class="bi bi-file-earmark-text me-2"></i>Request Quote
                    </button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn btn-outline-secondary w-100" @click=${()=>window.location.pathname="/b2b-store/invoices"}>
                      <i class="bi bi-file-earmark-pdf me-2"></i>Invoices
                    </button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn btn-outline-secondary w-100" @click=${()=>window.location.pathname="/b2b-store/account"}>
                      <i class="bi bi-person me-2"></i>My Account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Orders -->
            <div class="card mb-4">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Recent Orders</h5>
                <button class="btn btn-sm btn-outline-primary" @click=${()=>window.location.pathname="/b2b-store/orders"}>
                  View All
                </button>
              </div>
              <div class="card-body">
                ${this.recentOrders&&this.recentOrders.length>0?s`
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.recentOrders.slice(0,5).map(t=>s`
                          <tr style="cursor: pointer;" @click=${()=>window.location.pathname=`/b2b-store/orders/${t.id}`}>
                            <td><strong>${t.poNumber}</strong></td>
                            <td>${new Date(t.createdAt).toLocaleDateString()}</td>
                            <td>${t.items?.length||0}</td>
                            <td>${this.formatCurrency(t.total)}</td>
                            <td>
                              <span class="badge bg-${t.status==="delivered"?"success":t.status==="shipped"?"primary":"warning"}">
                                ${t.status}
                              </span>
                            </td>
                          </tr>
                        `)}
                      </tbody>
                    </table>
                  </div>
                `:s`
                  <div class="text-center py-4">
                    <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
                    <p class="text-muted mt-2">No recent orders</p>
                    <button class="btn btn-primary mt-2" @click=${()=>window.location.pathname="/b2b-store/catalog"}>
                      Start Shopping
                    </button>
                  </div>
                `}
              </div>
            </div>

            <!-- Featured Products -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Featured Products</h5>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  ${[1,2,3].map(()=>s`
                    <div class="col-md-4">
                      <div class="card h-100">
                        <div class="card-body text-center">
                          <div class="bg-light rounded mb-3" style="height: 120px; display: flex; align-items: center; justify-content: center;">
                            <i class="bi bi-box" style="font-size: 3rem; color: #ccc;"></i>
                          </div>
                          <h6 class="mb-2">Product Name</h6>
                          <p class="text-muted small mb-2">SKU: ABC-123</p>
                          <p class="fw-bold text-primary mb-2">$99.99</p>
                          <button class="btn btn-sm btn-primary w-100">
                            <i class="bi bi-cart-plus me-1"></i>Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  `)}
                </div>
                <div class="text-center mt-3">
                  <button class="btn btn-outline-primary" @click=${()=>window.location.pathname="/b2b-store/catalog"}>
                    View All Products
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-lg-4">
            <!-- Account Summary -->
            ${this.company?s`
              <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                  <h5 class="mb-0">Account Summary</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <div class="text-muted small mb-1">Company</div>
                    <div class="fw-bold">${this.company.name}</div>
                  </div>
                  <div class="mb-3">
                    <div class="text-muted small mb-1">Account Number</div>
                    <div><code>${this.company.accountNumber||"N/A"}</code></div>
                  </div>
                  <div class="mb-3">
                    <div class="text-muted small mb-1">Credit Available</div>
                    <div class="fs-4 fw-bold text-success">
                      ${this.formatCurrency(this.company.creditLimit-(this.company.currentBalance||0))}
                    </div>
                    <div class="progress" style="height: 8px;">
                      <div class="progress-bar ${(this.company.currentBalance||0)/this.company.creditLimit>.8?"bg-danger":"bg-success"}" 
                           style="width: ${Math.min(100,(this.company.currentBalance||0)/this.company.creditLimit*100)}%">
                      </div>
                    </div>
                    <small class="text-muted">
                      ${this.formatCurrency(this.company.currentBalance||0)} of ${this.formatCurrency(this.company.creditLimit)} used
                    </small>
                  </div>
                  <div class="mb-3">
                    <div class="text-muted small mb-1">Payment Terms</div>
                    <div><strong>${this.company.paymentTerms}</strong></div>
                  </div>
                  <button class="btn btn-outline-primary w-100" @click=${()=>window.location.pathname="/b2b-store/account"}>
                    View Full Account
                  </button>
                </div>
              </div>
            `:""}

            <!-- Pending Approvals -->
            <div class="card mb-4">
              <div class="card-header bg-warning text-dark">
                <h5 class="mb-0">
                  <i class="bi bi-exclamation-circle me-2"></i>Pending Approvals
                </h5>
              </div>
              <div class="card-body">
                <p class="text-muted small mb-3">Orders requiring approval</p>
                <div class="alert alert-info mb-0">
                  <i class="bi bi-info-circle me-2"></i>
                  No orders pending approval
                </div>
              </div>
            </div>

            <!-- Support -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Need Help?</h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <a href="tel:1-800-123-4567" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-telephone me-2"></i>1-800-123-4567
                  </a>
                  <a href="mailto:support@company.com" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-envelope me-2"></i>support@company.com
                  </a>
                  <button class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-chat-dots me-2"></i>Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("storefront-dashboard",c);
