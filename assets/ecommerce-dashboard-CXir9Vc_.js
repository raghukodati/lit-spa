import{N as s}from"./index-DfU7H5-o.js";import{B as e}from"./BaseComponent-gTxbGt-p.js";class a extends e{static properties={stats:{type:Object},lowStockProducts:{type:Array},loading:{type:Boolean}};constructor(){super(),this.stats={},this.lowStockProducts=[],this.loading=!1,this._orderService=null,this._productService=null}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadData()}async loadData(){this.loading=!0;try{this._orderService||(this._orderService=await this.getService("orderService")),this._productService||(this._productService=await this.getService("productService")),this.stats=await this._orderService.getOrderStats(),this.lowStockProducts=await this._productService.getLowStockProducts()}catch(t){console.error("Failed to load dashboard data:",t)}finally{this.loading=!1}}render(){return s`
      <div class="container-fluid mt-4">
        <h2 class="mb-4">E-commerce Dashboard</h2>

        ${this.loading?s`
          <div class="text-center py-5"><div class="spinner-border"></div></div>
        `:s`
          <!-- Stats Cards -->
          <div class="row mb-4">
            <div class="col-md-3">
              <div class="card bg-primary text-white">
                <div class="card-body text-center">
                  <h3>${this.stats.totalOrders||0}</h3>
                  <p class="mb-0">Total Orders</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card bg-success text-white">
                <div class="card-body text-center">
                  <h3>$${(this.stats.totalRevenue||0).toFixed(2)}</h3>
                  <p class="mb-0">Total Revenue</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card bg-info text-white">
                <div class="card-body text-center">
                  <h3>$${(this.stats.averageOrderValue||0).toFixed(2)}</h3>
                  <p class="mb-0">Avg Order Value</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card bg-warning text-white">
                <div class="card-body text-center">
                  <h3>${this.stats.ordersByStatus?.pending||0}</h3>
                  <p class="mb-0">Pending Orders</p>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <!-- Low Stock Products -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">Low Stock Products</h5>
                </div>
                <div class="card-body">
                  ${this.lowStockProducts.length===0?s`
                    <p class="text-muted">No low stock products</p>
                  `:s`
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.lowStockProducts.map(t=>s`
                          <tr>
                            <td>${t.name}</td>
                            <td><span class="badge bg-warning">${t.stock}</span></td>
                          </tr>
                        `)}
                      </tbody>
                    </table>
                  `}
                </div>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">Quick Actions</h5>
                </div>
                <div class="card-body">
                  <div class="d-grid gap-2">
                    <a href="#/website/products/new" class="btn btn-primary">
                      <i class="bi bi-plus-lg"></i> Add New Product
                    </a>
                    <a href="#/website/orders" class="btn btn-info">
                      <i class="bi bi-box"></i> View Orders
                    </a>
                    <a href="#/website/discounts" class="btn btn-success">
                      <i class="bi bi-tag"></i> Manage Discounts
                    </a>
                    <a href="#/website/inventory" class="btn btn-warning">
                      <i class="bi bi-boxes"></i> Inventory Management
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `}
      </div>
    `}}customElements.define("ecommerce-dashboard",a);
