import{T as a,N as s}from"./index-DfU7H5-o.js";import{getCompanyById as t}from"./company.service-D2dl1Zj8.js";import"./company.model-CKmygYMs.js";class d extends a{static properties={company:{type:Object},loading:{type:Boolean}};constructor(){super(),this.company=null,this.loading=!1,this.companyId=1}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadCompany()}async loadCompany(){this.loading=!0;try{this.company=await t(this.companyId)}catch(i){console.error("Failed to load company:",i)}finally{this.loading=!1}}formatCurrency(i){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(i)}render(){return this.loading?s`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading...</p>
          </div>
        </div>
      `:this.company?s`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="mb-4">
          <h2 class="mb-1">My Account</h2>
          <p class="text-muted mb-0">Manage your company information and settings</p>
        </div>

        <div class="row">
          <!-- Left Column -->
          <div class="col-lg-8">
            <!-- Company Information -->
            <div class="card mb-4">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Company Information</h5>
                <button class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-pencil me-1"></i>Request Update
                </button>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Company Name</div>
                    <div class="fw-bold">${this.company.name}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Account Number</div>
                    <div><code>${this.company.accountNumber||"N/A"}</code></div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Company Type</div>
                    <div class="text-capitalize">${this.company.type}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Industry</div>
                    <div>${this.company.industry||"N/A"}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Tax ID</div>
                    <div>${this.company.taxId||"N/A"}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Website</div>
                    <div>
                      ${this.company.website?s`
                        <a href="${this.company.website}" target="_blank">${this.company.website}</a>
                      `:"N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Primary Contact -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Primary Contact</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Name</div>
                    <div class="fw-bold">${this.company.primaryContact?.name||"N/A"}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Email</div>
                    <div>
                      ${this.company.primaryContact?.email?s`
                        <a href="mailto:${this.company.primaryContact.email}">${this.company.primaryContact.email}</a>
                      `:"N/A"}
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Phone</div>
                    <div>${this.company.primaryContact?.phone||"N/A"}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="text-muted small mb-1">Title</div>
                    <div>${this.company.primaryContact?.title||"N/A"}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Billing Address -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Billing Address</h5>
              </div>
              <div class="card-body">
                ${this.company.billingAddress?s`
                  <address class="mb-0">
                    ${this.company.billingAddress.street}<br>
                    ${this.company.billingAddress.city}, ${this.company.billingAddress.state} ${this.company.billingAddress.postalCode}<br>
                    ${this.company.billingAddress.country}
                  </address>
                `:s`<p class="text-muted mb-0">No billing address on file</p>`}
              </div>
            </div>

            <!-- Shipping Addresses -->
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Shipping Addresses</h5>
                <button class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-plus-circle me-1"></i>Add Address
                </button>
              </div>
              <div class="card-body">
                ${this.company.shippingAddresses&&this.company.shippingAddresses.length>0?s`
                  <div class="row">
                    ${this.company.shippingAddresses.map(i=>s`
                      <div class="col-md-6 mb-3">
                        <div class="card">
                          <div class="card-body">
                            ${i.isDefault?s`
                              <span class="badge bg-primary mb-2">Default</span>
                            `:""}
                            <address class="mb-0 small">
                              <strong>${i.name||"Unnamed Location"}</strong><br>
                              ${i.street}<br>
                              ${i.city}, ${i.state} ${i.postalCode}<br>
                              ${i.country}
                            </address>
                          </div>
                        </div>
                      </div>
                    `)}
                  </div>
                `:s`
                  <p class="text-muted mb-0">No shipping addresses on file</p>
                `}
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-lg-4">
            <!-- Account Status -->
            <div class="card mb-4">
              <div class="card-header bg-${this.company.status==="active"?"success":"warning"} text-white">
                <h5 class="mb-0">Account Status</h5>
              </div>
              <div class="card-body">
                <div class="text-center mb-3">
                  <span class="badge bg-${this.company.status==="active"?"success":"warning"} px-4 py-2 fs-5 text-capitalize">
                    ${this.company.status}
                  </span>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Member Since</div>
                  <div><strong>${new Date(this.company.createdAt).toLocaleDateString()}</strong></div>
                </div>
                ${this.company.accountManager?s`
                  <div class="mb-3">
                    <div class="text-muted small mb-1">Account Manager</div>
                    <div><strong>${this.company.accountManager}</strong></div>
                  </div>
                `:""}
              </div>
            </div>

            <!-- Credit Information -->
            <div class="card mb-4">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Credit Information</h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <div class="text-muted small mb-1">Credit Limit</div>
                  <div class="fw-bold fs-5">${this.formatCurrency(this.company.creditLimit)}</div>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Current Balance</div>
                  <div class="fw-bold">${this.formatCurrency(this.company.currentBalance||0)}</div>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Available Credit</div>
                  <div class="fw-bold text-success fs-5">
                    ${this.formatCurrency(this.company.creditLimit-(this.company.currentBalance||0))}
                  </div>
                </div>
                <div class="progress mb-2" style="height: 10px;">
                  <div class="progress-bar ${(this.company.currentBalance||0)/this.company.creditLimit>.8?"bg-danger":"bg-success"}" 
                       style="width: ${Math.min(100,(this.company.currentBalance||0)/this.company.creditLimit*100)}%">
                  </div>
                </div>
                <small class="text-muted">
                  ${Math.round((this.company.currentBalance||0)/this.company.creditLimit*100)}% utilized
                </small>
              </div>
            </div>

            <!-- Payment Terms -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Payment Terms</h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <div class="text-muted small mb-1">Terms</div>
                  <div class="fw-bold">${this.company.paymentTerms}</div>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Tax Exempt</div>
                  <div>
                    ${this.company.taxExempt?s`
                      <span class="badge bg-success">Yes</span>
                    `:s`
                      <span class="badge bg-secondary">No</span>
                    `}
                  </div>
                </div>
                ${this.company.discountPercent>0?s`
                  <div class="mb-3">
                    <div class="text-muted small mb-1">Account Discount</div>
                    <div class="fw-bold text-success">${this.company.discountPercent}%</div>
                  </div>
                `:""}
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Quick Actions</h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button class="btn btn-primary" @click=${()=>window.location.pathname="/b2b-store/orders"}>
                    <i class="bi bi-receipt me-2"></i>View Orders
                  </button>
                  <button class="btn btn-outline-primary" @click=${()=>window.location.pathname="/b2b-store/invoices"}>
                    <i class="bi bi-file-earmark-pdf me-2"></i>View Invoices
                  </button>
                  <button class="btn btn-outline-secondary">
                    <i class="bi bi-download me-2"></i>Download Statements
                  </button>
                  <button class="btn btn-outline-secondary">
                    <i class="bi bi-envelope me-2"></i>Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `:s`
        <div class="container-fluid mt-4">
          <div class="alert alert-warning">Company information not available</div>
        </div>
      `}}customElements.define("account-dashboard",d);
