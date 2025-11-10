import{N as e}from"./index-YRTalx74.js";import{B as a}from"./BaseComponent-CbMV1jW9.js";class i extends a{static properties={contracts:{type:Array},loading:{type:Boolean},error:{type:String},searchTerm:{type:String},statusFilter:{type:String},typeFilter:{type:String}};constructor(){super(),this.contracts=[],this.loading=!1,this.error="",this.searchTerm="",this.statusFilter="",this.typeFilter="",this._contractService=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.loadContracts()}async loadContracts(){this.loading=!0,this.error="";try{const t={search:this.searchTerm,status:this.statusFilter,type:this.typeFilter};this._contractService||(this._contractService=await this.getService("contractService")),this.contracts=await this._contractService.getContracts(t)}catch(t){this.error=t.message||"Failed to load contracts"}finally{this.loading=!1}}handleSearch(t){this.searchTerm=t.target.value,this.loadContracts()}handleStatusFilter(t){this.statusFilter=t.target.value,this.loadContracts()}handleTypeFilter(t){this.typeFilter=t.target.value,this.loadContracts()}async handleDelete(t){if(this.can("contracts","delete")&&confirm(`Delete contract "${t.name}"?`))try{this._contractService||(this._contractService=await this.getService("contractService")),await this._contractService.deleteContract(t.id),await this.loadContracts()}catch(s){alert("Failed to delete: "+s.message)}}getStatusBadgeClass(t){return{draft:"secondary",pending:"warning",active:"success",expired:"danger",terminated:"dark",renewed:"info"}[t]||"secondary"}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}formatDate(t){return t?new Date(t).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"N/A"}render(){return e`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">Contracts</h2>
            <p class="text-muted mb-0">Manage customer contracts & agreements</p>
          </div>
          ${this.ifCan("contracts","create",e`
            <button class="btn btn-primary" @click=${()=>window.go("/website/b2b/contracts/new")}>
              <i class="bi bi-plus-circle me-2"></i>Create Contract
            </button>
          `)}
        </div>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-5">
                <label class="form-label">Search</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search by name, number, or company..."
                  .value=${this.searchTerm}
                  @input=${this.handleSearch}
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">Status</label>
                <select class="form-select" @change=${this.handleStatusFilter}>
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                  <option value="renewed">Renewed</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">Type</label>
                <select class="form-select" @change=${this.handleTypeFilter}>
                  <option value="">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="master">Master</option>
                  <option value="blanket">Blanket</option>
                  <option value="framework">Framework</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click=${()=>{this.searchTerm="",this.statusFilter="",this.typeFilter="",this.loadContracts()}}>
                  <i class="bi bi-x-circle me-2"></i>Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        ${this.error?e`
          <div class="alert alert-danger alert-dismissible fade show">
            <i class="bi bi-exclamation-triangle me-2"></i>${this.error}
            <button type="button" class="btn-close" @click=${()=>this.error=""}></button>
          </div>
        `:""}

        ${this.loading?e`
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading contracts...</p>
          </div>
        `:""}

        ${!this.loading&&this.contracts.length>0?e`
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Contract</th>
                      <th>Company</th>
                      <th>Type</th>
                      <th>Period</th>
                      <th>Value</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.contracts.map(t=>e`
                      <tr>
                        <td>
                          <div class="fw-bold">${t.name}</div>
                          <code class="small">${t.contractNumber}</code>
                        </td>
                        <td>${t.companyName}</td>
                        <td>
                          <span class="badge bg-secondary text-capitalize">${t.type}</span>
                        </td>
                        <td>
                          <div class="small">
                            ${this.formatDate(t.startDate)}<br>
                            <span class="${t.isExpiringSoon?"text-danger fw-bold":""}">
                              ${this.formatDate(t.endDate)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            <strong>${this.formatCurrency(t.totalValue)}</strong><br>
                            <span class="text-muted">Min: ${this.formatCurrency(t.minimumCommitment)}</span>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            ${this.formatCurrency(t.totalSpent)}
                            <div class="progress mt-1" style="height: 4px;">
                              <div 
                                class="progress-bar ${t.commitmentProgress>=100?"bg-success":t.commitmentProgress>=50?"bg-warning":"bg-danger"}" 
                                style="width: ${Math.min(100,t.commitmentProgress)}%">
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-${this.getStatusBadgeClass(t.status)}">
                            ${t.status}
                          </span>
                          ${t.isExpiringSoon&&t.status==="active"?e`
                            <div><small class="text-danger">⚠️ Expiring soon</small></div>
                          `:""}
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            ${this.ifCan("contracts","update",e`
                              <button class="btn btn-outline-primary"
                                 @click=${()=>window.go(`/website/b2b/contracts/edit/${t.id}`)}
                                 title="Edit Contract">
                                <i class="bi bi-pencil"></i>
                              </button>
                            `)}
                            ${this.ifCan("contracts","delete",e`
                              <button class="btn btn-outline-danger" 
                                      @click=${()=>this.handleDelete(t)}
                                      title="Delete Contract">
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
        `:""}

        ${!this.loading&&this.contracts.length===0?e`
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-file-earmark-ruled" style="font-size: 3rem; color: #ccc;"></i>
              <h4 class="mt-3">No Contracts Found</h4>
              <p class="text-muted">
                ${this.searchTerm||this.statusFilter||this.typeFilter?"Try adjusting your filters":"Create your first customer contract"}
              </p>
              ${!this.searchTerm&&!this.statusFilter&&!this.typeFilter?e`
                <button class="btn btn-primary mt-2" @click=${()=>window.go("/website/b2b/contracts/new")}>
                  <i class="bi bi-plus-circle me-2"></i>Create Contract
                </button>
              `:""}
            </div>
          </div>
        `:""}
      </div>
    `}}customElements.define("contract-list",i);
