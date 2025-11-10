import{N as e}from"./index-FS5dr0kl.js";import{B as i}from"./BaseComponent-BWzIoCRW.js";class a extends i{static properties={companies:{type:Array},loading:{type:Boolean},error:{type:String},searchTerm:{type:String},statusFilter:{type:String},typeFilter:{type:String},sortBy:{type:String},sortOrder:{type:String}};constructor(){super(),this.companies=[],this.loading=!1,this.error="",this.searchTerm="",this.statusFilter="",this.typeFilter="",this.sortBy="name",this.sortOrder="asc",this._companyService=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.loadCompanies()}async loadCompanies(){this.loading=!0,this.error="";try{const t={search:this.searchTerm,status:this.statusFilter,companyType:this.typeFilter,sortBy:this.sortBy,sortOrder:this.sortOrder};this._companyService||(this._companyService=await this.getService("companyService")),this.companies=await this._companyService.getCompanies(t)}catch(t){this.error=t.message||"Failed to load companies",console.error("Error loading companies:",t)}finally{this.loading=!1}}handleSearch(t){this.searchTerm=t.target.value,this.loadCompanies()}handleStatusFilter(t){this.statusFilter=t.target.value,this.loadCompanies()}handleTypeFilter(t){this.typeFilter=t.target.value,this.loadCompanies()}async handleDelete(t){if(this.can("companies","delete")&&confirm(`Are you sure you want to delete ${t.name}?`))try{this._companyService||(this._companyService=await this.getService("companyService")),await this._companyService.deleteCompany(t.id),await this.loadCompanies()}catch(s){alert("Failed to delete company: "+s.message)}}getStatusBadgeClass(t){return{active:"success",pending:"warning",suspended:"danger",inactive:"secondary"}[t]||"secondary"}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}render(){return e`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">Companies</h2>
            <p class="text-muted mb-0">Manage your business partners and customer accounts</p>
          </div>
          ${this.ifCan("companies","create",e`
            <a href="/companies/new" class="btn btn-primary">
              <i class="bi bi-plus-circle me-2"></i>Add Company
            </a>
          `)}
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
                  placeholder="Search by name, account number, email..."
                  .value=${this.searchTerm}
                  @input=${this.handleSearch}
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">Status</label>
                <select class="form-select" @change=${this.handleStatusFilter}>
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Company Type</label>
                <select class="form-select" @change=${this.handleTypeFilter}>
                  <option value="">All Types</option>
                  <option value="business">Business</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="distributor">Distributor</option>
                  <option value="reseller">Reseller</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click=${()=>{this.searchTerm="",this.statusFilter="",this.typeFilter="",this.loadCompanies()}}>
                  <i class="bi bi-x-circle me-2"></i>Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        ${this.error?e`
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>${this.error}
            <button type="button" class="btn-close" @click=${()=>this.error=""}></button>
          </div>
        `:""}

        <!-- Loading State -->
        ${this.loading?e`
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading companies...</p>
          </div>
        `:""}

        <!-- Companies Table -->
        ${!this.loading&&this.companies.length>0?e`
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Account #</th>
                      <th>Type</th>
                      <th>Contact</th>
                      <th>Credit</th>
                      <th>Payment Terms</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.companies.map(t=>e`
                      <tr>
                        <td>
                          <div class="fw-bold">${t.name}</div>
                          <small class="text-muted">${t.industry||"N/A"}</small>
                        </td>
                        <td>
                          <code class="small">${t.accountNumber}</code>
                        </td>
                        <td>
                          <span class="badge bg-info text-capitalize">
                            ${t.companyType}
                          </span>
                        </td>
                        <td>
                          <div class="small">
                            ${t.primaryContact.name}<br>
                            <a href="mailto:${t.primaryContact.email}">
                              ${t.primaryContact.email}
                            </a>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            <strong>${this.formatCurrency(t.availableCredit)}</strong>
                            <span class="text-muted">/ ${this.formatCurrency(t.creditLimit)}</span>
                            <div class="progress mt-1" style="height: 4px;">
                              <div 
                                class="progress-bar ${t.creditUsed/t.creditLimit>.8?"bg-danger":"bg-success"}" 
                                style="width: ${t.creditUsed/t.creditLimit*100}%">
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-secondary">${t.paymentTerms}</span>
                        </td>
                        <td>
                          <span class="badge bg-${this.getStatusBadgeClass(t.status)}">
                            ${t.status}
                          </span>
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            ${this.ifCan("companies","read",e`
                              <a href="/companies/${t.id}" 
                                 class="btn btn-outline-primary" 
                                 title="View Details">
                                <i class="bi bi-eye"></i>
                              </a>
                            `)}
                            ${this.ifCan("companies","update",e`
                              <a href="/companies/edit/${t.id}" 
                                 class="btn btn-outline-secondary"
                                 title="Edit">
                                <i class="bi bi-pencil"></i>
                              </a>
                            `)}
                            ${this.ifCan("companies","delete",e`
                              <button 
                                class="btn btn-outline-danger"
                                @click=${()=>this.handleDelete(t)}
                                title="Delete">
                                <i class="bi bi-trash"></i>
                              </button>
                            `)}
                          </div>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="mt-3 text-muted">
            <small>Showing ${this.companies.length} compan${this.companies.length===1?"y":"ies"}</small>
          </div>
        `:""}

        <!-- Empty State -->
        ${!this.loading&&this.companies.length===0?e`
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-building" style="font-size: 3rem; color: #ccc;"></i>
              <h4 class="mt-3">No Companies Found</h4>
              <p class="text-muted">
                ${this.searchTerm||this.statusFilter||this.typeFilter?"Try adjusting your filters":"Get started by adding your first organization"}
              </p>
              ${!this.searchTerm&&!this.statusFilter&&!this.typeFilter?e`
                <a href="/companies/new" class="btn btn-primary mt-2">
                  <i class="bi bi-plus-circle me-2"></i>Add Company
                </a>
              `:""}
            </div>
          </div>
        `:""}
      </div>
    `}}customElements.define("company-list",a);
