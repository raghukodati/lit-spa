import{N as s}from"./index-DZz2m7sH.js";import{B as i}from"./BaseComponent-Dw4Ny93W.js";class e extends i{createRenderRoot(){return this}render(){return s`
      <div class="container-fluid py-4">
        <div class="row mb-4">
          <div class="col-12">
            <h1 class="h2 mb-3">
              <i class="bi bi-shield-lock text-danger me-2"></i>System Administration
            </h1>
            <p class="text-muted">Manage users, roles, permissions, and system settings</p>
          </div>
        </div>

        <!-- Core Admin Cards -->
        <div class="row g-4">
          <!-- Users Card -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                    <i class="bi bi-people text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Users</h5>
                    <p class="text-muted small mb-0">User account management</p>
                  </div>
                </div>
                <p class="card-text">Create, edit, and manage user accounts and profiles.</p>
                ${this.can("users","read")?s`
                  <a href="/users" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-arrow-right me-1"></i>Manage Users
                  </a>
                `:s`
                  <button class="btn btn-outline-secondary btn-sm" disabled>
                    <i class="bi bi-lock me-1"></i>No Access
                  </button>
                `}
              </div>
            </div>
          </div>

          <!-- Roles Card -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                    <i class="bi bi-shield-check text-success fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Roles</h5>
                    <p class="text-muted small mb-0">Role definitions</p>
                  </div>
                </div>
                <p class="card-text">Define and manage user roles and responsibilities.</p>
                ${this.can("settings","read")?s`
                  <a href="/roles" class="btn btn-outline-success btn-sm">
                    <i class="bi bi-arrow-right me-1"></i>Manage Roles
                  </a>
                `:s`
                  <button class="btn btn-outline-secondary btn-sm" disabled>
                    <i class="bi bi-lock me-1"></i>No Access
                  </button>
                `}
              </div>
            </div>
          </div>

          <!-- Permissions Card -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                    <i class="bi bi-gear-wide-connected text-warning fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Permissions</h5>
                    <p class="text-muted small mb-0">Access control</p>
                  </div>
                </div>
                <p class="card-text">Configure permissions and access control rules.</p>
                <a href="/permissions" class="btn btn-outline-warning btn-sm">
                  <i class="bi bi-arrow-right me-1"></i>Manage Permissions
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- B2B Features Section -->
        <div class="row mt-4">
          <div class="col-12">
            <h4 class="mb-3">
              <i class="bi bi-shop text-info me-2"></i>B2B Storefront Features
            </h4>
          </div>
        </div>

        <div class="row g-4">
          <!-- Order Approvals -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm border-primary">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                    <i class="bi bi-check-circle text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Order Approvals</h5>
                    <p class="text-muted small mb-0">Multi-level workflow</p>
                  </div>
                </div>
                <p class="card-text small">4-level approval chains with configurable thresholds and auto-routing.</p>
                <div class="d-flex gap-2 flex-wrap">
                  <a href="/b2b-store/approvals" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-eye me-1"></i>Pending
                  </a>
                  <a href="/b2b-store/approvals/rules" class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-gear me-1"></i>Rules
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- KeepStock Management -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm border-info">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                    <i class="bi bi-boxes text-info fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">KeepStock</h5>
                    <p class="text-muted small mb-0">Auto-replenishment</p>
                  </div>
                </div>
                <p class="card-text small">Multi-item inventory lists with search and batch ordering capabilities.</p>
                <a href="/b2b-store/keepstock" class="btn btn-outline-info btn-sm">
                  <i class="bi bi-arrow-right me-1"></i>Manage KeepStock
                </a>
              </div>
            </div>
          </div>

          <!-- Purchase History -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm border-success">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                    <i class="bi bi-cart-check text-success fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Purchase History</h5>
                    <p class="text-muted small mb-0">Advanced filtering</p>
                  </div>
                </div>
                <p class="card-text small">Search, filter, and sort purchase history with CSV export functionality.</p>
                <a href="/b2b-store/purchased-products" class="btn btn-outline-success btn-sm">
                  <i class="bi bi-arrow-right me-1"></i>View Purchases
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Row -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-header bg-light">
                <h6 class="mb-0">
                  <i class="bi bi-speedometer2 text-danger me-2"></i>System Statistics
                </h6>
              </div>
              <div class="card-body">
                <div class="row text-center">
                  <div class="col-md-2">
                    <div class="p-3">
                      <i class="bi bi-people fs-1 text-primary mb-2"></i>
                      <h3 class="mb-0">6</h3>
                      <p class="text-muted mb-0 small">Total Users</p>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="p-3">
                      <i class="bi bi-person-check fs-1 text-success mb-2"></i>
                      <h3 class="mb-0">5</h3>
                      <p class="text-muted mb-0 small">Active Users</p>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="p-3">
                      <i class="bi bi-shield-check fs-1 text-warning mb-2"></i>
                      <h3 class="mb-0">4</h3>
                      <p class="text-muted mb-0 small">Roles Defined</p>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="p-3">
                      <i class="bi bi-gear-wide-connected fs-1 text-info mb-2"></i>
                      <h3 class="mb-0">7</h3>
                      <p class="text-muted mb-0 small">Modules</p>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="p-3">
                      <i class="bi bi-shop fs-1 text-primary mb-2"></i>
                      <h3 class="mb-0">15+</h3>
                      <p class="text-muted mb-0 small">B2B Features</p>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="p-3">
                      <i class="bi bi-check-circle fs-1 text-success mb-2"></i>
                      <h3 class="mb-0">3</h3>
                      <p class="text-muted mb-0 small">Approval Levels</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-header bg-light">
                <h6 class="mb-0">
                  <i class="bi bi-clock-history text-primary me-2"></i>Recent System Activity
                </h6>
              </div>
              <div class="card-body">
                <div class="list-group list-group-flush">
                  <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <i class="bi bi-cart-check text-success me-2"></i>
                        <strong>Purchase History:</strong> 12 new purchase records loaded
                      </div>
                      <small class="text-muted">1 hour ago</small>
                    </div>
                  </div>
                  <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <i class="bi bi-boxes text-info me-2"></i>
                        <strong>KeepStock:</strong> 5 inventory lists created with 13 products
                      </div>
                      <small class="text-muted">2 hours ago</small>
                    </div>
                  </div>
                  <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <i class="bi bi-check-circle text-warning me-2"></i>
                        <strong>Approval Workflow:</strong> Multi-level approval system configured
                      </div>
                      <small class="text-muted">3 hours ago</small>
                    </div>
                  </div>
                  <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <i class="bi bi-gear text-primary me-2"></i>
                        <strong>Approval Rules:</strong> 4 approval thresholds configured
                      </div>
                      <small class="text-muted">4 hours ago</small>
                    </div>
                  </div>
                  <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <i class="bi bi-person-plus text-success me-2"></i>
                        <strong>User Management:</strong> New user "CRM Specialist" created
                      </div>
                      <small class="text-muted">5 hours ago</small>
                    </div>
                  </div>
                  <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <i class="bi bi-shield-check text-primary me-2"></i>
                        <strong>Role Permissions:</strong> Manager role permissions updated
                      </div>
                      <small class="text-muted">1 day ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("module-admin",e);
