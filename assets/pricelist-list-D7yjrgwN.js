import{N as e}from"./index-DeW_3Z4T.js";import{B as i}from"./BaseComponent-RCMQUWYM.js";class a extends i{static properties={priceLists:{type:Array},loading:{type:Boolean},error:{type:String},searchTerm:{type:String},statusFilter:{type:String},typeFilter:{type:String}};constructor(){super(),this.priceLists=[],this.loading=!1,this.error="",this.searchTerm="",this.statusFilter="",this.typeFilter="",this._pricelistService=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.loadPriceLists()}async loadPriceLists(){this.loading=!0,this.error="";try{const t={search:this.searchTerm,status:this.statusFilter,type:this.typeFilter};this._pricelistService||(this._pricelistService=await this.getService("pricelistService")),this.priceLists=await this._pricelistService.getPriceLists(t)}catch(t){this.error=t.message||"Failed to load price lists"}finally{this.loading=!1}}handleSearch(t){this.searchTerm=t.target.value,this.loadPriceLists()}handleStatusFilter(t){this.statusFilter=t.target.value,this.loadPriceLists()}handleTypeFilter(t){this.typeFilter=t.target.value,this.loadPriceLists()}async handleDelete(t){if(this.can("pricelists","delete")&&confirm(`Delete price list "${t.name}"?`))try{this._pricelistService||(this._pricelistService=await this.getService("pricelistService")),await this._pricelistService.deletePriceList(t.id),await this.loadPriceLists()}catch(s){alert("Failed to delete: "+s.message)}}formatDate(t){return t?new Date(t).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"N/A"}render(){return e`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">Price Lists</h2>
            <p class="text-muted mb-0">Manage custom pricing & volume discounts</p>
          </div>
          ${this.ifCan("pricelists","create",e`
            <button class="btn btn-primary" @click=${()=>window.location.pathname="/website/b2b/pricelists/new"}>
              <i class="bi bi-plus-circle me-2"></i>Create Price List
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
                  placeholder="Search by name or code..."
                  .value=${this.searchTerm}
                  @input=${this.handleSearch}
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">Status</label>
                <select class="form-select" @change=${this.handleStatusFilter}>
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">Type</label>
                <select class="form-select" @change=${this.handleTypeFilter}>
                  <option value="">All Types</option>
                  <option value="custom">Custom</option>
                  <option value="volume">Volume</option>
                  <option value="promotional">Promotional</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click=${()=>{this.searchTerm="",this.statusFilter="",this.typeFilter="",this.loadPriceLists()}}>
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
            <p class="mt-2 text-muted">Loading price lists...</p>
          </div>
        `:""}

        ${!this.loading&&this.priceLists.length>0?e`
          <div class="row">
            ${this.priceLists.map(t=>e`
              <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 class="mb-1">${t.name}</h5>
                        <code class="small">${t.code}</code>
                      </div>
                      <span class="badge bg-${t.status==="active"?"success":"secondary"}">
                        ${t.status}
                      </span>
                    </div>

                    ${t.description?e`
                      <p class="text-muted small mb-3">${t.description}</p>
                    `:""}

                    <div class="mb-3">
                      <div class="d-flex justify-content-between small mb-1">
                        <span class="text-muted">Type:</span>
                        <span class="badge bg-info text-capitalize">${t.type}</span>
                      </div>
                      <div class="d-flex justify-content-between small mb-1">
                        <span class="text-muted">Modifier:</span>
                        <strong>${t.priceModifier} (${t.modifierValue}${t.priceModifier==="percentage"?"%":""})</strong>
                      </div>
                      <div class="d-flex justify-content-between small mb-1">
                        <span class="text-muted">Currency:</span>
                        <strong>${t.currency}</strong>
                      </div>
                      ${t.volumeTiers&&t.volumeTiers.length>0?e`
                        <div class="d-flex justify-content-between small mb-1">
                          <span class="text-muted">Volume Tiers:</span>
                          <strong>${t.volumeTiers.length}</strong>
                        </div>
                      `:""}
                      ${t.items&&t.items.length>0?e`
                        <div class="d-flex justify-content-between small mb-1">
                          <span class="text-muted">Products:</span>
                          <strong>${t.items.length}</strong>
                        </div>
                      `:""}
                      ${t.assignedCompanies&&t.assignedCompanies.length>0?e`
                        <div class="d-flex justify-content-between small mb-1">
                          <span class="text-muted">Companies:</span>
                          <strong>${t.assignedCompanies.length}</strong>
                        </div>
                      `:""}
                    </div>

                    ${t.validFrom||t.validTo?e`
                      <div class="mb-3">
                        <div class="text-muted small mb-1">Valid Period</div>
                        <small>${this.formatDate(t.validFrom)} - ${this.formatDate(t.validTo)}</small>
                      </div>
                    `:""}

                    <div class="btn-group w-100">
                      ${this.ifCan("pricelists","update",e`
                        <button class="btn btn-sm btn-outline-primary" @click=${()=>window.location.pathname=`/website/b2b/pricelists/edit/${t.id}`}>
                          <i class="bi bi-pencil me-1"></i>Edit
                        </button>
                      `)}
                      ${this.ifCan("pricelists","delete",e`
                        <button class="btn btn-sm btn-outline-danger" @click=${()=>this.handleDelete(t)}>
                          <i class="bi bi-trash me-1"></i>Delete
                        </button>
                      `)}
                    </div>
                  </div>
                </div>
              </div>
            `)}
          </div>
        `:""}

        ${!this.loading&&this.priceLists.length===0?e`
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-cash-stack" style="font-size: 3rem; color: #ccc;"></i>
              <h4 class="mt-3">No Price Lists Found</h4>
              <p class="text-muted">
                ${this.searchTerm||this.statusFilter||this.typeFilter?"Try adjusting your filters":"Create custom pricing for your B2B customers"}
              </p>
              ${!this.searchTerm&&!this.statusFilter&&!this.typeFilter?e`
                <button class="btn btn-primary mt-2" @click=${()=>window.location.pathname="/website/b2b/pricelists/new"}>
                  <i class="bi bi-plus-circle me-2"></i>Create Price List
                </button>
              `:""}
            </div>
          </div>
        `:""}
      </div>
    `}}customElements.define("pricelist-list",a);
