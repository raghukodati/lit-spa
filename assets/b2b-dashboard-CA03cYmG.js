import{T as l,N as s}from"./index-e1bWKrj6.js";import{getCompanies as n}from"./company.service-B6hBs7Uo.js";import{getQuotes as o,getQuoteStats as b}from"./quote.service-Bcv0IhZf.js";import{getContracts as m,getContractStats as v}from"./contract.service-DYEZctVC.js";import{getPurchaseOrders as u,getPOStats as h}from"./purchaseorder.service-CMwQpZ1f.js";import"./company.model-CKmygYMs.js";import"./quote.model-CvL1ADQq.js";import"./contract.model-CkFP52sg.js";class p extends l{static properties={loading:{type:Boolean},companyStats:{type:Object},quoteStats:{type:Object},contractStats:{type:Object},poStats:{type:Object},recentCompanies:{type:Array},recentQuotes:{type:Array},expiringContracts:{type:Array}};constructor(){super(),this.loading=!1,this.companyStats=null,this.quoteStats=null,this.contractStats=null,this.poStats=null,this.recentCompanies=[],this.recentQuotes=[],this.expiringContracts=[]}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.loadDashboard()}async loadDashboard(){this.loading=!0;try{const[t,a,i,y,d,c,r]=await Promise.all([n({sortBy:"createdAt",sortOrder:"desc"}),o({sortBy:"createdAt",sortOrder:"desc"}),m({expiringSoon:!0}),u({approvalStatus:"pending"}),b(),v(),h()]);this.recentCompanies=t.slice(0,5),this.recentQuotes=a.slice(0,5),this.expiringContracts=i,this.companyStats={total:t.length,active:t.filter(e=>e.status==="active").length,pending:t.filter(e=>e.status==="pending").length},this.quoteStats=d,this.contractStats=c,this.poStats=r}catch(t){console.error("Error loading dashboard:",t)}finally{this.loading=!1}}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}formatDate(t){return t?new Date(t).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"N/A"}render(){return this.loading?s`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading dashboard...</p>
          </div>
        </div>
      `:s`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="mb-4">
          <h2 class="mb-1">B2B Dashboard</h2>
          <p class="text-muted mb-0">Business-to-Business operations overview</p>
        </div>

        <!-- Key Metrics -->
        <div class="row g-3 mb-4">
          <!-- Companies -->
          <div class="col-md-3">
            <div class="card border-primary">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <div class="text-muted small mb-1">Companies</div>
                    <h3 class="mb-0">${this.companyStats?.total||0}</h3>
                    <small class="text-success">
                      ${this.companyStats?.active||0} active
                    </small>
                  </div>
                  <div class="bg-primary bg-opacity-10 p-2 rounded">
                    <i class="bi bi-building text-primary fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quotes -->
          <div class="col-md-3">
            <div class="card border-info">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <div class="text-muted small mb-1">Total Quotes</div>
                    <h3 class="mb-0">${this.quoteStats?.total||0}</h3>
                    <small class="text-warning">
                      ${this.quoteStats?.pending||0} pending
                    </small>
                  </div>
                  <div class="bg-info bg-opacity-10 p-2 rounded">
                    <i class="bi bi-file-earmark-text text-info fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contracts -->
          <div class="col-md-3">
            <div class="card border-success">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <div class="text-muted small mb-1">Active Contracts</div>
                    <h3 class="mb-0">${this.contractStats?.active||0}</h3>
                    <small class="text-danger">
                      ${this.contractStats?.expiringSoon||0} expiring soon
                    </small>
                  </div>
                  <div class="bg-success bg-opacity-10 p-2 rounded">
                    <i class="bi bi-file-earmark-ruled text-success fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Purchase Orders -->
          <div class="col-md-3">
            <div class="card border-warning">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <div class="text-muted small mb-1">Purchase Orders</div>
                    <h3 class="mb-0">${this.poStats?.total||0}</h3>
                    <small class="text-warning">
                      ${this.poStats?.pendingApproval||0} need approval
                    </small>
                  </div>
                  <div class="bg-warning bg-opacity-10 p-2 rounded">
                    <i class="bi bi-clipboard-check text-warning fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Overview -->
        ${this.quoteStats&&this.contractStats?s`
          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <div class="text-muted small mb-1">Quote Value</div>
                  <h4 class="mb-0">${this.formatCurrency(this.quoteStats.totalValue||0)}</h4>
                  <small class="text-muted">
                    Avg: ${this.formatCurrency(this.quoteStats.averageValue||0)}
                  </small>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <div class="text-muted small mb-1">Contract Value</div>
                  <h4 class="mb-0">${this.formatCurrency(this.contractStats.totalValue||0)}</h4>
                  <small class="text-muted">
                    Commitment: ${this.formatCurrency(this.contractStats.totalCommitment||0)}
                  </small>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <div class="text-muted small mb-1">Quote Conversion Rate</div>
                  <h4 class="mb-0">${Math.round(this.quoteStats.conversionRate||0)}%</h4>
                  <small class="text-muted">
                    ${this.quoteStats.converted||0} converted
                  </small>
                </div>
              </div>
            </div>
          </div>
        `:""}

        <div class="row">
          <!-- Left Column -->
          <div class="col-lg-8">
            <!-- Recent Quotes -->
            <div class="card mb-4">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Recent Quotes</h5>
                <a href="#/website/b2b/quotes" class="btn btn-sm btn-outline-primary">View All</a>
              </div>
              <div class="card-body">
                ${this.recentQuotes.length>0?s`
                  <div class="table-responsive">
                    <table class="table table-sm table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Quote #</th>
                          <th>Company</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.recentQuotes.map(t=>s`
                          <tr style="cursor: pointer;" @click=${()=>window.go(`/website/b2b/quotes/${t.id}`)}>
                            <td><code class="small">${t.quoteNumber}</code></td>
                            <td>${t.companyName}</td>
                            <td>${this.formatCurrency(t.total)}</td>
                            <td>
                              <span class="badge bg-${t.status==="accepted"?"success":t.status==="sent"?"primary":t.status==="rejected"?"danger":"secondary"}">${t.status}</span>
                            </td>
                            <td>${this.formatDate(t.createdAt)}</td>
                          </tr>
                        `)}
                      </tbody>
                    </table>
                  </div>
                `:s`
                  <p class="text-muted text-center mb-0">No recent quotes</p>
                `}
              </div>
            </div>

            <!-- Recent Companies -->
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Recent Companies</h5>
                <a href="#/website/b2b/companies" class="btn btn-sm btn-outline-primary">View All</a>
              </div>
              <div class="card-body">
                ${this.recentCompanies.length>0?s`
                  <div class="table-responsive">
                    <table class="table table-sm table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Company</th>
                          <th>Type</th>
                          <th>Credit Available</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.recentCompanies.map(t=>s`
                          <tr style="cursor: pointer;" @click=${()=>window.go(`/website/b2b/companies/${t.id}`)}>
                            <td>
                              <div class="fw-bold">${t.name}</div>
                              <small class="text-muted">${t.accountNumber}</small>
                            </td>
                            <td><span class="badge bg-info text-capitalize">${t.companyType}</span></td>
                            <td>${this.formatCurrency(t.availableCredit)}</td>
                            <td>
                              <span class="badge bg-${t.status==="active"?"success":t.status==="pending"?"warning":t.status==="suspended"?"danger":"secondary"}">${t.status}</span>
                            </td>
                          </tr>
                        `)}
                      </tbody>
                    </table>
                  </div>
                `:s`
                  <p class="text-muted text-center mb-0">No companies yet</p>
                `}
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-lg-4">
            <!-- Expiring Contracts -->
            ${this.expiringContracts.length>0?s`
              <div class="card mb-4">
                <div class="card-header bg-warning bg-opacity-10">
                  <h5 class="mb-0">
                    <i class="bi bi-exclamation-triangle text-warning me-2"></i>
                    Expiring Contracts
                  </h5>
                </div>
                <div class="card-body">
                  <div class="list-group list-group-flush">
                    ${this.expiringContracts.slice(0,5).map(t=>s`
                      <a 
                        href="#/website/b2b/contracts/${t.id}" 
                        class="list-group-item list-group-item-action px-0"
                      >
                        <div class="d-flex justify-content-between align-items-start">
                          <div>
                            <div class="fw-bold small">${t.companyName}</div>
                            <small class="text-muted">${t.contractNumber}</small>
                          </div>
                          <small class="text-danger">${this.formatDate(t.endDate)}</small>
                        </div>
                      </a>
                    `)}
                  </div>
                </div>
              </div>
            `:""}

            <!-- Quick Actions -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Quick Actions</h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button class="btn btn-primary" @click=${()=>window.go("/website/b2b/companies/new")}>
                    <i class="bi bi-building me-2"></i>Add Company
                  </button>
                  <button class="btn btn-outline-primary" @click=${()=>window.go("/website/b2b/quotes/new")}>
                    <i class="bi bi-file-earmark-text me-2"></i>Create Quote
                  </button>
                  <button class="btn btn-outline-primary" @click=${()=>window.go("/website/b2b/contracts/new")}>
                    <i class="bi bi-file-earmark-ruled me-2"></i>Create Contract
                  </button>
                  <button class="btn btn-outline-secondary" @click=${()=>window.go("/website/b2b/pricelists/new")}>
                    <i class="bi bi-cash-stack me-2"></i>Create Price List
                  </button>
                  <button class="btn btn-outline-secondary" @click=${()=>window.go("/website/b2b/purchase-orders")}>
                    <i class="bi bi-clipboard-check me-2"></i>View Purchase Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("b2b-dashboard",p);
