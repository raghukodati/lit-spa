import{N as s}from"./index-BTuak744.js";import{B as l}from"./BaseComponent-BMsN_Bf9.js";import{P as c}from"./pricelist.model-B2sEL8yC.js";class o extends l{static properties={priceListId:{type:String},priceList:{type:Object},companies:{type:Array},products:{type:Array},loading:{type:Boolean},saving:{type:Boolean},error:{type:String},validationErrors:{type:Array}};constructor(){super(),this.priceListId=null,this.priceList={name:"",code:"",description:"",status:"active",type:"custom",currency:"USD",priceModifier:"percentage",modifierValue:0,items:[],volumeTiers:[],assignedCompanies:[],assignedCategories:[],assignedProducts:[],validFrom:"",validTo:"",priority:5,minimumOrderQty:0,minimumOrderAmount:0},this.companies=[],this.products=[],this.loading=!1,this.saving=!1,this.error="",this.validationErrors=[],this._pricelistService=null,this._companyService=null,this._productService=null}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadData();const e=window.location.pathname.match(/\/website\/b2b\/pricelists\/edit\/(\d+)/);e&&(this.priceListId=e[1],await this.loadPriceList())}async loadData(){this.loading=!0;try{this._companyService||(this._companyService=await this.getService("companyService")),this._productService||(this._productService=await this.getService("productService")),[this.companies,this.products]=await Promise.all([this._companyService.getCompanies({status:"active"}),this._productService.getProducts({status:"active"})])}catch{this.error="Failed to load data"}finally{this.loading=!1}}async loadPriceList(){if(this.priceListId){this.loading=!0;try{this._pricelistService||(this._pricelistService=await this.getService("pricelistService"));const t=await this._pricelistService.getPriceListById(this.priceListId);t&&(this.priceList=t)}catch{this.error="Failed to load price list"}finally{this.loading=!1}}}handleInputChange(t,e){this.priceList[t]=e,this.requestUpdate()}handleAddVolumeTier(){this.priceList.volumeTiers.push({minQty:0,maxQty:null,discount:0,price:0}),this.requestUpdate()}handleRemoveVolumeTier(t){this.priceList.volumeTiers.splice(t,1),this.requestUpdate()}handleTierChange(t,e,i){this.priceList.volumeTiers[t][e]=i,this.requestUpdate()}handleAddProductPrice(){this.priceList.items.push({productId:null,sku:"",price:0,minQty:null,maxQty:null}),this.requestUpdate()}handleRemoveProductPrice(t){this.priceList.items.splice(t,1),this.requestUpdate()}handleProductPriceChange(t,e,i){if(this.priceList.items[t][e]=i,e==="productId"&&i){const a=this.products.find(r=>r.id===parseInt(i));a&&(this.priceList.items[t].sku=a.sku)}this.requestUpdate()}handleCompanyToggle(t){const e=this.priceList.assignedCompanies.indexOf(t);e>-1?this.priceList.assignedCompanies.splice(e,1):this.priceList.assignedCompanies.push(t),this.requestUpdate()}async handleSubmit(t){t.preventDefault(),this.requestUpdate();const i=new c(this.priceList).validate();if(!i.isValid){this.validationErrors=i.errors,this.error="Please fix validation errors before saving",window.scrollTo({top:0,behavior:"smooth"});return}this.validationErrors=[],this.saving=!0,this.error="";try{this._pricelistService||(this._pricelistService=await this.getService("pricelistService"));const a=this.priceListId?"update":"create";if(!this.can("pricelists",a)){alert(`You do not have permission to ${a} price lists`),this.saving=!1;return}this.priceListId?await this._pricelistService.updatePriceList(this.priceListId,this.priceList):await this._pricelistService.createPriceList(this.priceList),window.location.pathname="/website/b2b/pricelists"}catch(a){this.error=a.message||"Failed to save price list",this.saving=!1,window.scrollTo({top:0,behavior:"smooth"})}}render(){return this.loading&&!this.companies.length?s`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading...</p>
          </div>
        </div>
      `:s`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">${this.priceListId?"Edit":"Create"} Price List</h2>
            <p class="text-muted mb-0">Manage custom pricing & volume discounts</p>
          </div>
          <a href="#/website/b2b/pricelists" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Back
          </a>
        </div>

        ${this.error?s`
          <div class="alert alert-danger alert-dismissible fade show">
            <i class="bi bi-exclamation-triangle me-2"></i>${this.error}
            <button type="button" class="btn-close" @click=${()=>this.error=""}></button>
          </div>
        `:""}

        ${this.validationErrors.length>0?s`
          <div class="alert alert-warning alert-dismissible fade show">
            <strong>Validation Errors:</strong>
            <ul class="mb-0 mt-2">
              ${this.validationErrors.map(t=>s`<li>${t}</li>`)}
            </ul>
            <button type="button" class="btn-close" @click=${()=>this.validationErrors=[]}></button>
          </div>
        `:""}

        <form @submit=${this.handleSubmit}>
          <div class="row">
            <div class="col-lg-8">
              <!-- Basic Information -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Basic Information</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Name *</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.priceList.name}
                        @input=${t=>this.handleInputChange("name",t.target.value)}
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Code *</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.priceList.code}
                        @input=${t=>this.handleInputChange("code",t.target.value)}
                        required
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Description</label>
                      <textarea
                        class="form-control"
                        rows="2"
                        .value=${this.priceList.description}
                        @input=${t=>this.handleInputChange("description",t.target.value)}
                      ></textarea>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Type</label>
                      <select 
                        class="form-select"
                        .value=${this.priceList.type}
                        @change=${t=>this.handleInputChange("type",t.target.value)}
                      >
                        <option value="custom">Custom</option>
                        <option value="volume">Volume</option>
                        <option value="promotional">Promotional</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Currency</label>
                      <select 
                        class="form-select"
                        .value=${this.priceList.currency}
                        @change=${t=>this.handleInputChange("currency",t.target.value)}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Priority</label>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.priceList.priority}
                        @input=${t=>this.handleInputChange("priority",parseInt(t.target.value))}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pricing Rules -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Pricing Rules</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Price Modifier</label>
                      <select 
                        class="form-select"
                        .value=${this.priceList.priceModifier}
                        @change=${t=>this.handleInputChange("priceModifier",t.target.value)}
                      >
                        <option value="fixed">Fixed Price</option>
                        <option value="percentage">Percentage Discount</option>
                        <option value="markup">Markup</option>
                        <option value="discount">Discount Amount</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Modifier Value</label>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.priceList.modifierValue}
                        @input=${t=>this.handleInputChange("modifierValue",parseFloat(t.target.value)||0)}
                        min="0"
                        step="0.01"
                      />
                      <small class="text-muted">
                        ${this.priceList.priceModifier==="percentage"?"Percentage (%)":this.priceList.priceModifier==="fixed"?"Fixed amount":"Value"}
                      </small>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Minimum Order Qty</label>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.priceList.minimumOrderQty}
                        @input=${t=>this.handleInputChange("minimumOrderQty",parseInt(t.target.value)||0)}
                        min="0"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Minimum Order Amount</label>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.priceList.minimumOrderAmount}
                        @input=${t=>this.handleInputChange("minimumOrderAmount",parseFloat(t.target.value)||0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Volume Tiers -->
              <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">Volume Tiers</h5>
                  <button type="button" class="btn btn-sm btn-primary" @click=${this.handleAddVolumeTier}>
                    <i class="bi bi-plus-circle me-2"></i>Add Tier
                  </button>
                </div>
                <div class="card-body">
                  ${this.priceList.volumeTiers.length===0?s`
                    <p class="text-muted text-center mb-0">No volume tiers defined</p>
                  `:s`
                    <div class="table-responsive">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Min Qty</th>
                            <th>Max Qty</th>
                            <th>${this.priceList.priceModifier==="fixed"?"Price":"Discount"}</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          ${this.priceList.volumeTiers.map((t,e)=>s`
                            <tr>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${t.minQty}
                                  @input=${i=>this.handleTierChange(e,"minQty",parseInt(i.target.value)||0)}
                                  min="0"
                                  style="width: 100px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${t.maxQty||""}
                                  @input=${i=>this.handleTierChange(e,"maxQty",i.target.value?parseInt(i.target.value):null)}
                                  min="0"
                                  placeholder="No limit"
                                  style="width: 100px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${this.priceList.priceModifier==="fixed"?t.price:t.discount}
                                  @input=${i=>this.handleTierChange(e,this.priceList.priceModifier==="fixed"?"price":"discount",parseFloat(i.target.value)||0)}
                                  min="0"
                                  step="0.01"
                                  style="width: 100px;"
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  class="btn btn-sm btn-outline-danger"
                                  @click=${()=>this.handleRemoveVolumeTier(e)}
                                >
                                  <i class="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          `)}
                        </tbody>
                      </table>
                    </div>
                  `}
                </div>
              </div>

              <!-- Product-Specific Prices -->
              <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">Product-Specific Prices</h5>
                  <button type="button" class="btn btn-sm btn-primary" @click=${this.handleAddProductPrice}>
                    <i class="bi bi-plus-circle me-2"></i>Add Product
                  </button>
                </div>
                <div class="card-body">
                  ${this.priceList.items.length===0?s`
                    <p class="text-muted text-center mb-0">No product-specific prices</p>
                  `:s`
                    <div class="table-responsive">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Min Qty</th>
                            <th>Max Qty</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          ${this.priceList.items.map((t,e)=>s`
                            <tr>
                              <td>
                                <select 
                                  class="form-select form-select-sm"
                                  .value=${t.productId||""}
                                  @change=${i=>this.handleProductPriceChange(e,"productId",parseInt(i.target.value))}
                                >
                                  <option value="">Select Product</option>
                                  ${this.products.map(i=>s`
                                    <option value="${i.id}">${i.name}</option>
                                  `)}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${t.price}
                                  @input=${i=>this.handleProductPriceChange(e,"price",parseFloat(i.target.value)||0)}
                                  min="0"
                                  step="0.01"
                                  style="width: 100px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${t.minQty||""}
                                  @input=${i=>this.handleProductPriceChange(e,"minQty",i.target.value?parseInt(i.target.value):null)}
                                  min="0"
                                  style="width: 80px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${t.maxQty||""}
                                  @input=${i=>this.handleProductPriceChange(e,"maxQty",i.target.value?parseInt(i.target.value):null)}
                                  min="0"
                                  style="width: 80px;"
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  class="btn btn-sm btn-outline-danger"
                                  @click=${()=>this.handleRemoveProductPrice(e)}
                                >
                                  <i class="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          `)}
                        </tbody>
                      </table>
                    </div>
                  `}
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <!-- Status -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Status</h5>
                </div>
                <div class="card-body">
                  <select 
                    class="form-select"
                    .value=${this.priceList.status}
                    @change=${t=>this.handleInputChange("status",t.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <!-- Validity Period -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Validity Period</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Valid From</label>
                    <input
                      type="date"
                      class="form-control"
                      .value=${this.priceList.validFrom}
                      @input=${t=>this.handleInputChange("validFrom",t.target.value)}
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Valid To</label>
                    <input
                      type="date"
                      class="form-control"
                      .value=${this.priceList.validTo}
                      @input=${t=>this.handleInputChange("validTo",t.target.value)}
                    />
                  </div>
                </div>
              </div>

              <!-- Assigned Companies -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Assigned Companies</h5>
                </div>
                <div class="card-body">
                  <div style="max-height: 300px; overflow-y: auto;">
                    ${this.companies.map(t=>s`
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          .checked=${this.priceList.assignedCompanies.includes(t.id)}
                          @change=${()=>this.handleCompanyToggle(t.id)}
                          id="company-${t.id}"
                        />
                        <label class="form-check-label" for="company-${t.id}">
                          ${t.name}
                        </label>
                      </div>
                    `)}
                  </div>
                  ${this.companies.length===0?s`
                    <p class="text-muted small mb-0">No companies available</p>
                  `:""}
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-end gap-2">
                <a href="#/website/b2b/pricelists" class="btn btn-outline-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary" ?disabled=${this.saving}>
                  ${this.saving?s`
                    <span class="spinner-border spinner-border-sm me-2"></span>Saving...
                  `:s`
                    <i class="bi bi-check-circle me-2"></i>${this.priceListId?"Update":"Create"} Price List
                  `}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `}}customElements.define("pricelist-form",o);
