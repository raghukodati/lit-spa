import{T as i,N as e}from"./index-MMTwS6vP.js";import{getPurchaseOrders as l}from"./purchaseorder.service-tZc0DO7y.js";class r extends i{static properties={orders:{type:Array},loading:{type:Boolean},searchTerm:{type:String},statusFilter:{type:String},dateRange:{type:String}};constructor(){super(),this.orders=[],this.loading=!1,this.searchTerm="",this.statusFilter="",this.dateRange="90",this.companyId=1}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadOrders()}async loadOrders(){this.loading=!0;try{const t={companyId:this.companyId,search:this.searchTerm,status:this.statusFilter};this.orders=await l(t)}catch(t){console.error("Failed to load orders:",t)}finally{this.loading=!1}}handleSearch(t){this.searchTerm=t.target.value,this.loadOrders()}handleStatusFilter(t){this.statusFilter=t.target.value,this.loadOrders()}handleDateRange(t){this.dateRange=t.target.value,this.loadOrders()}handleReorder(t){if(confirm(`Reorder items from ${t.poNumber}?`)){const a=t.items.map(s=>({productId:s.productId,name:s.name,sku:s.sku,price:s.price,quantity:s.quantity,total:s.total}));localStorage.setItem("b2b-cart",JSON.stringify(a)),window.location.pathname="/b2b-store/cart"}}getStatusBadgeClass(t){return{draft:"secondary",submitted:"info",approved:"success",processing:"primary",shipped:"warning",delivered:"success",cancelled:"danger"}[t]||"secondary"}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}formatDate(t){return new Date(t).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}render(){return e`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">Order History</h2>
            <p class="text-muted mb-0">View and manage your past orders</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary">
              <i class="bi bi-download me-2"></i>Export
            </button>
            <button class="btn btn-primary" @click=${()=>window.location.pathname="/b2b-store/catalog"}>
              <i class="bi bi-plus-circle me-2"></i>New Order
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Search</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search by PO number, product..."
                  .value=${this.searchTerm}
                  @input=${this.handleSearch}
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">Status</label>
                <select class="form-select" @change=${this.handleStatusFilter}>
                  <option value="">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Date Range</label>
                <select class="form-select" @change=${this.handleDateRange}>
                  <option value="30">Last 30 days</option>
                  <option value="90" selected>Last 90 days</option>
                  <option value="180">Last 6 months</option>
                  <option value="365">Last year</option>
                  <option value="all">All time</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click=${()=>{this.searchTerm="",this.statusFilter="",this.dateRange="90",this.loadOrders()}}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        ${this.loading?e`
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading orders...</p>
          </div>
        `:""}

        ${!this.loading&&this.orders.length>0?e`
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Tracking</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.orders.map(t=>e`
                      <tr>
                        <td>
                          <div class="fw-bold">${t.poNumber}</div>
                          ${t.customerPONumber?e`
                            <small class="text-muted">Ref: ${t.customerPONumber}</small>
                          `:""}
                        </td>
                        <td>${this.formatDate(t.createdAt)}</td>
                        <td>${t.items?.length||0} items</td>
                        <td><strong>${this.formatCurrency(t.total)}</strong></td>
                        <td>
                          <span class="badge bg-${t.paymentStatus==="paid"?"success":t.paymentStatus==="partial"?"warning":"secondary"}">
                            ${t.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span class="badge bg-${this.getStatusBadgeClass(t.status)}">
                            ${t.status}
                          </span>
                        </td>
                        <td>
                          ${t.trackingNumber?e`
                            <a href="#" class="small">${t.trackingNumber}</a>
                          `:e`
                            <span class="text-muted small">N/A</span>
                          `}
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" 
                                    @click=${()=>window.location.pathname=`/b2b-store/orders/${t.id}`}
                                    title="View Details">
                              <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-secondary" 
                                    @click=${()=>this.handleReorder(t)}
                                    title="Reorder">
                              <i class="bi bi-arrow-repeat"></i>
                            </button>
                            <button class="btn btn-outline-secondary"
                                    title="Download Invoice">
                              <i class="bi bi-download"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            </div>
            <div class="card-footer">
              <div class="d-flex justify-content-between align-items-center">
                <div class="text-muted">
                  Showing ${this.orders.length} order${this.orders.length!==1?"s":""}
                </div>
                <nav>
                  <ul class="pagination pagination-sm mb-0">
                    <li class="page-item disabled">
                      <span class="page-link">Previous</span>
                    </li>
                    <li class="page-item active">
                      <span class="page-link">1</span>
                    </li>
                    <li class="page-item">
                      <a class="page-link" href="#">2</a>
                    </li>
                    <li class="page-item">
                      <a class="page-link" href="#">Next</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        `:""}

        ${!this.loading&&this.orders.length===0?e`
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
              <h4 class="mt-3">No Orders Found</h4>
              <p class="text-muted">
                ${this.searchTerm||this.statusFilter?"Try adjusting your filters":"You haven't placed any orders yet"}
              </p>
              ${!this.searchTerm&&!this.statusFilter?e`
                <button class="btn btn-primary mt-2" @click=${()=>window.location.pathname="/b2b-store/catalog"}>
                  <i class="bi bi-cart me-2"></i>Start Shopping
                </button>
              `:""}
            </div>
          </div>
        `:""}
      </div>
    `}}customElements.define("order-history",r);
