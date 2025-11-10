import{T as d,j as t,N as s}from"./index-FS5dr0kl.js";class e extends d{createRenderRoot(){return this}render(){return s`
      <div>
        <!-- Page Header -->
        <div class="mb-4">
          <h1 class="h2 fw-bold">
            <i class="bi bi-cart-check text-success me-2"></i>Sales Module
          </h1>
          <p class="text-muted">Manage orders, customers, and sales operations</p>
        </div>

        <!-- Quick Stats -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card border-success shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-cart-check fs-1 text-success"></i>
                <h3 class="mt-2">156</h3>
                <p class="text-muted mb-0">Total Orders</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-primary shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-people fs-1 text-primary"></i>
                <h3 class="mt-2">89</h3>
                <p class="text-muted mb-0">Customers</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-warning shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-currency-dollar fs-1 text-warning"></i>
                <h3 class="mt-2">$45,230</h3>
                <p class="text-muted mb-0">Revenue</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-info shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-box fs-1 text-info"></i>
                <h3 class="mt-2">342</h3>
                <p class="text-muted mb-0">Products</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        ${t("orders","read")?s`
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">
                <i class="bi bi-cart me-2"></i>Recent Orders
              </h5>
              ${t("orders","create")?s`
                <button class="btn btn-sm btn-success">
                  <i class="bi bi-plus-circle me-1"></i>New Order
                </button>
              `:""}
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>#ORD-1001</strong></td>
                      <td>John Doe</td>
                      <td>2024-10-28</td>
                      <td>$1,250.00</td>
                      <td><span class="badge bg-success">Completed</span></td>
                      <td>
                        ${t("orders","read")?s`
                          <button class="btn btn-sm btn-outline-info">View</button>
                        `:""}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>#ORD-1002</strong></td>
                      <td>Jane Smith</td>
                      <td>2024-10-29</td>
                      <td>$2,450.00</td>
                      <td><span class="badge bg-warning">Pending</span></td>
                      <td>
                        ${t("orders","read")?s`
                          <button class="btn btn-sm btn-outline-info">View</button>
                        `:""}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>#ORD-1003</strong></td>
                      <td>Bob Johnson</td>
                      <td>2024-10-29</td>
                      <td>$890.00</td>
                      <td><span class="badge bg-info">Processing</span></td>
                      <td>
                        ${t("orders","read")?s`
                          <button class="btn btn-sm btn-outline-info">View</button>
                        `:""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `:""}

        <!-- Top Customers -->
        ${t("customers","read")?s`
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-star me-2"></i>Top Customers
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="d-flex align-items-center mb-3 p-3 border rounded">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                      <i class="bi bi-person fs-4"></i>
                    </div>
                    <div>
                      <h6 class="mb-0">John Doe</h6>
                      <small class="text-muted">Total Orders: 24 • $12,450</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center mb-3 p-3 border rounded">
                    <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                      <i class="bi bi-person fs-4"></i>
                    </div>
                    <div>
                      <h6 class="mb-0">Jane Smith</h6>
                      <small class="text-muted">Total Orders: 18 • $8,920</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `:""}
      </div>
    `}}customElements.define("module-sales",e);
