import{X as a,N as e,Y as i,Z as r,$ as s}from"./index-DCWHXaZV.js";import{B as d}from"./BaseComponent-TlNBBqtl.js";class o extends d{static properties={orders:{type:Array},stats:{type:Object},loading:{type:Boolean},searchTerm:{type:String},filterStatus:{type:String},filterPaymentStatus:{type:String},page:{type:Number},pageSize:{type:Number},total:{type:Number}};constructor(){super(),this.orders=[],this.stats={},this.loading=!1,this.searchTerm="",this.filterStatus="",this.filterPaymentStatus="",this.page=1,this.pageSize=20,this.total=0,this._orderService=null}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),this._orderService||(this._orderService=await this.getService("orderService")),await this.loadOrders(),await this.loadStats()}async loadOrders(){this.loading=!0;try{this._orderService||(this._orderService=await this.getService("orderService"));const t=await this._orderService.getOrders({search:this.searchTerm,status:this.filterStatus,paymentStatus:this.filterPaymentStatus,page:this.page,pageSize:this.pageSize});this.orders=t.data,this.total=t.total}catch(t){console.error("Failed to load orders:",t)}finally{this.loading=!1}}async loadStats(){try{this._orderService||(this._orderService=await this.getService("orderService")),this.stats=await this._orderService.getOrderStats()}catch(t){console.error("Failed to load stats:",t)}}handleSearch(t){this.searchTerm=t.target.value,this.page=1,this.loadOrders()}handleView(t){this.can("orders","read")&&(window.location.pathname=`/website/orders/${t}`)}getStatusBadge(t){return{pending:"bg-warning",processing:"bg-info",shipped:"bg-primary",delivered:"bg-success",cancelled:"bg-danger",refunded:"bg-secondary"}[t]||"bg-secondary"}render(){return e`
      <div class="container-fluid mt-4">
        <h2 class="mb-4">Orders</h2>

        <!-- Stats Cards -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">Total Orders</h5>
                <h3>${this.stats.totalOrders||0}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">Total Revenue</h5>
                <h3>$${(this.stats.totalRevenue||0).toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">Average Order</h5>
                <h3>$${(this.stats.averageOrderValue||0).toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">Pending Orders</h5>
                <h3>${this.stats.ordersByStatus?.pending||0}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by order number or email..."
                  .value="${a(this.searchTerm)}"
                  @input="${this.handleSearch}"
                />
              </div>
              <div class="col-md-3">
                <select class="form-select" @change="${t=>{this.filterStatus=t.target.value,this.loadOrders()}}">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div class="col-md-3">
                <select class="form-select" @change="${t=>{this.filterPaymentStatus=t.target.value,this.loadOrders()}}">
                  <option value="">All Payment Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders Table -->
        ${this.loading?e`
          <div class="text-center py-5">
            <div class="spinner-border"></div>
          </div>
        `:e`
          <div class="card">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${i(this.orders.length===0,()=>e`
                      <tr>
                        <td colspan="8" class="text-center py-4">No orders found</td>
                      </tr>
                    `,()=>r(this.orders,t=>t.id,t=>e`
                        <tr>
                          <td><strong>${t.orderNumber}</strong></td>
                          <td>${t.customerEmail}</td>
                          <td>${new Date(t.createdAt).toLocaleDateString()}</td>
                          <td>${t.getItemCount()} items</td>
                          <td>$${t.total.toFixed(2)}</td>
                          <td>
                            <span class=${s({badge:!0,"bg-success":t.paymentStatus==="paid","bg-warning":t.paymentStatus!=="paid"})}>
                              ${t.paymentStatus}
                            </span>
                          </td>
                          <td>
                            <span class=${s({badge:!0,[this.getStatusBadge(t.status)]:!0})}>
                              ${t.status}
                            </span>
                          </td>
                          <td>
                            ${this.ifCan("orders","read",e`
                              <button 
                                class="btn btn-sm btn-primary"
                                @click="${()=>this.handleView(t.id)}"
                              >
                                View
                              </button>
                            `)}
                          </td>
                        </tr>
                      `))}
                </tbody>
              </table>
            </div>
          </div>
        `}
      </div>
    `}}customElements.define("order-list",o);
