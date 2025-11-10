import{N as i}from"./index-e1bWKrj6.js";import{B as l}from"./BaseComponent-C9iYdUKf.js";import{C as n}from"./contract.model-CkFP52sg.js";class r extends l{static properties={contractId:{type:String},contract:{type:Object},companies:{type:Array},priceLists:{type:Array},loading:{type:Boolean},saving:{type:Boolean},error:{type:String},validationErrors:{type:Array}};constructor(){super(),this.contractId=null,this.contract={contractNumber:"",name:"",type:"standard",companyId:null,companyName:"",status:"draft",startDate:"",endDate:"",autoRenew:!1,renewalPeriod:12,renewalNotice:30,totalValue:0,minimumCommitment:0,paymentTerms:"Net 30",currency:"USD",priceListId:null,discountPercent:0,volumeDiscount:!1,volumeTiers:[],creditLimit:0,paymentSchedule:"per_order",includedProducts:[],excludedProducts:[],serviceLevel:"standard",shippingTerms:"FOB",deliverySchedule:"",allowBackorders:!0,minOrderQty:0,maxOrderQty:null,termsAndConditions:"",slaTerms:"",confidentialityClause:"",terminationClause:"",notes:""},this.companies=[],this.priceLists=[],this.loading=!1,this.saving=!1,this.error="",this.validationErrors=[],this._contractService=null,this._companyService=null,this._pricelistService=null}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadData();const a=window.location.pathname.match(/\/website\/b2b\/contracts\/edit\/(\d+)/);a&&(this.contractId=a[1],await this.loadContract());const s=new URLSearchParams(window.location.search).get("companyId");s&&!this.contractId&&this.handleCompanyChange({target:{value:s}})}async loadData(){this.loading=!0;try{this._companyService||(this._companyService=await this.getService("companyService")),this._pricelistService||(this._pricelistService=await this.getService("pricelistService")),[this.companies,this.priceLists]=await Promise.all([this._companyService.getCompanies({status:"active"}),this._pricelistService.getPriceLists({status:"active"})])}catch{this.error="Failed to load data"}finally{this.loading=!1}}async loadContract(){if(this.contractId){this.loading=!0;try{this._contractService||(this._contractService=await this.getService("contractService"));const t=await this._contractService.getContractById(this.contractId);t&&(this.contract=t)}catch{this.error="Failed to load contract"}finally{this.loading=!1}}}handleCompanyChange(t){const a=parseInt(t.target.value),e=this.companies.find(s=>s.id===a);e&&(this.contract={...this.contract,companyId:e.id,companyName:e.name,paymentTerms:e.paymentTerms,creditLimit:e.creditLimit,discountPercent:e.discountPercent},this.requestUpdate())}handleInputChange(t,a){this.contract[t]=a,this.requestUpdate()}handleAddVolumeTier(){this.contract.volumeTiers.push({minQty:0,discount:0}),this.requestUpdate()}handleRemoveVolumeTier(t){this.contract.volumeTiers.splice(t,1),this.requestUpdate()}handleTierChange(t,a,e){this.contract.volumeTiers[t][a]=e,this.requestUpdate()}async handleSubmit(t){t.preventDefault(),this.requestUpdate();const e=new n(this.contract).validate();if(!e.isValid){this.validationErrors=e.errors,this.error="Please fix validation errors before saving",window.scrollTo({top:0,behavior:"smooth"});return}this.validationErrors=[],this.saving=!0,this.error="";try{this._contractService||(this._contractService=await this.getService("contractService"));const s=this.contractId?"update":"create";if(!this.can("contracts",s)){alert(`You do not have permission to ${s} contracts`),this.saving=!1;return}this.contractId?await this._contractService.updateContract(this.contractId,this.contract):await this._contractService.createContract(this.contract),window.location.pathname="/website/b2b/contracts"}catch(s){this.error=s.message||"Failed to save contract",this.saving=!1,window.scrollTo({top:0,behavior:"smooth"})}}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}render(){return this.loading&&!this.companies.length?i`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading...</p>
          </div>
        </div>
      `:i`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">${this.contractId?"Edit":"Create"} Contract</h2>
            <p class="text-muted mb-0">Manage customer contracts & agreements</p>
          </div>
          <a href="#/website/b2b/contracts" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Back
          </a>
        </div>

        ${this.error?i`
          <div class="alert alert-danger alert-dismissible fade show">
            <i class="bi bi-exclamation-triangle me-2"></i>${this.error}
            <button type="button" class="btn-close" @click=${()=>this.error=""}></button>
          </div>
        `:""}

        ${this.validationErrors.length>0?i`
          <div class="alert alert-warning alert-dismissible fade show">
            <strong>Validation Errors:</strong>
            <ul class="mb-0 mt-2">
              ${this.validationErrors.map(t=>i`<li>${t}</li>`)}
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
                  <h5 class="mb-0">Contract Information</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Company *</label>
                      <select 
                        class="form-select"
                        .value=${this.contract.companyId||""}
                        @change=${this.handleCompanyChange}
                        required
                      >
                        <option value="">Select Company</option>
                        ${this.companies.map(t=>i`
                          <option value="${t.id}">${t.name}</option>
                        `)}
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Contract Type</label>
                      <select 
                        class="form-select"
                        .value=${this.contract.type}
                        @change=${t=>this.handleInputChange("type",t.target.value)}
                      >
                        <option value="standard">Standard</option>
                        <option value="master">Master</option>
                        <option value="blanket">Blanket</option>
                        <option value="framework">Framework</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label class="form-label">Contract Name *</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.contract.name}
                        @input=${t=>this.handleInputChange("name",t.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contract Period -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Contract Period</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Start Date *</label>
                      <input
                        type="date"
                        class="form-control"
                        .value=${this.contract.startDate}
                        @input=${t=>this.handleInputChange("startDate",t.target.value)}
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">End Date *</label>
                      <input
                        type="date"
                        class="form-control"
                        .value=${this.contract.endDate}
                        @input=${t=>this.handleInputChange("endDate",t.target.value)}
                        required
                      />
                    </div>
                    <div class="col-12">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          .checked=${this.contract.autoRenew}
                          @change=${t=>this.handleInputChange("autoRenew",t.target.checked)}
                          id="autoRenew"
                        />
                        <label class="form-check-label" for="autoRenew">
                          Auto-Renew
                        </label>
                      </div>
                    </div>
                    ${this.contract.autoRenew?i`
                      <div class="col-md-6">
                        <label class="form-label">Renewal Period (months)</label>
                        <input
                          type="number"
                          class="form-control"
                          .value=${this.contract.renewalPeriod}
                          @input=${t=>this.handleInputChange("renewalPeriod",parseInt(t.target.value))}
                          min="1"
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Renewal Notice (days)</label>
                        <input
                          type="number"
                          class="form-control"
                          .value=${this.contract.renewalNotice}
                          @input=${t=>this.handleInputChange("renewalNotice",parseInt(t.target.value))}
                          min="1"
                        />
                      </div>
                    `:""}
                  </div>
                </div>
              </div>

              <!-- Financial Terms -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Financial Terms</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Total Contract Value</label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                          type="number"
                          class="form-control"
                          .value=${this.contract.totalValue}
                          @input=${t=>this.handleInputChange("totalValue",parseFloat(t.target.value)||0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Minimum Commitment</label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                          type="number"
                          class="form-control"
                          .value=${this.contract.minimumCommitment}
                          @input=${t=>this.handleInputChange("minimumCommitment",parseFloat(t.target.value)||0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Payment Terms</label>
                      <select 
                        class="form-select"
                        .value=${this.contract.paymentTerms}
                        @change=${t=>this.handleInputChange("paymentTerms",t.target.value)}
                      >
                        <option value="COD">COD</option>
                        <option value="Prepaid">Prepaid</option>
                        <option value="Net 15">Net 15</option>
                        <option value="Net 30">Net 30</option>
                        <option value="Net 60">Net 60</option>
                        <option value="Net 90">Net 90</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Payment Schedule</label>
                      <select 
                        class="form-select"
                        .value=${this.contract.paymentSchedule}
                        @change=${t=>this.handleInputChange("paymentSchedule",t.target.value)}
                      >
                        <option value="per_order">Per Order</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Credit Limit</label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                          type="number"
                          class="form-control"
                          .value=${this.contract.creditLimit}
                          @input=${t=>this.handleInputChange("creditLimit",parseFloat(t.target.value)||0)}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pricing & Discounts -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Pricing & Discounts</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Price List</label>
                      <select 
                        class="form-select"
                        .value=${this.contract.priceListId||""}
                        @change=${t=>this.handleInputChange("priceListId",t.target.value?parseInt(t.target.value):null)}
                      >
                        <option value="">None</option>
                        ${this.priceLists.map(t=>i`
                          <option value="${t.id}">${t.name}</option>
                        `)}
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Discount %</label>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.contract.discountPercent}
                        @input=${t=>this.handleInputChange("discountPercent",parseFloat(t.target.value)||0)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div class="col-12">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          .checked=${this.contract.volumeDiscount}
                          @change=${t=>this.handleInputChange("volumeDiscount",t.target.checked)}
                          id="volumeDiscount"
                        />
                        <label class="form-check-label" for="volumeDiscount">
                          Volume Discount Enabled
                        </label>
                      </div>
                    </div>
                  </div>

                  ${this.contract.volumeDiscount?i`
                    <div class="mt-3">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong>Volume Tiers</strong>
                        <button type="button" class="btn btn-sm btn-outline-primary" @click=${this.handleAddVolumeTier}>
                          <i class="bi bi-plus-circle me-1"></i>Add Tier
                        </button>
                      </div>
                      ${this.contract.volumeTiers.length>0?i`
                        <div class="table-responsive">
                          <table class="table table-sm">
                            <thead>
                              <tr>
                                <th>Min Quantity</th>
                                <th>Discount %</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              ${this.contract.volumeTiers.map((t,a)=>i`
                                <tr>
                                  <td>
                                    <input
                                      type="number"
                                      class="form-control form-control-sm"
                                      .value=${t.minQty}
                                      @input=${e=>this.handleTierChange(a,"minQty",parseInt(e.target.value)||0)}
                                      min="0"
                                      style="width: 120px;"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      class="form-control form-control-sm"
                                      .value=${t.discount}
                                      @input=${e=>this.handleTierChange(a,"discount",parseFloat(e.target.value)||0)}
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      style="width: 120px;"
                                    />
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      class="btn btn-sm btn-outline-danger"
                                      @click=${()=>this.handleRemoveVolumeTier(a)}
                                    >
                                      <i class="bi bi-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              `)}
                            </tbody>
                          </table>
                        </div>
                      `:""}
                    </div>
                  `:""}
                </div>
              </div>

              <!-- Terms & Conditions -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Terms & Conditions</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">General Terms</label>
                    <textarea
                      class="form-control"
                      rows="3"
                      .value=${this.contract.termsAndConditions}
                      @input=${t=>this.handleInputChange("termsAndConditions",t.target.value)}
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">SLA Terms</label>
                    <textarea
                      class="form-control"
                      rows="2"
                      .value=${this.contract.slaTerms}
                      @input=${t=>this.handleInputChange("slaTerms",t.target.value)}
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Internal Notes</label>
                    <textarea
                      class="form-control"
                      rows="2"
                      .value=${this.contract.notes}
                      @input=${t=>this.handleInputChange("notes",t.target.value)}
                    ></textarea>
                  </div>
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
                    .value=${this.contract.status}
                    @change=${t=>this.handleInputChange("status",t.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <!-- Delivery Terms -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Delivery Terms</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Service Level</label>
                    <select 
                      class="form-select"
                      .value=${this.contract.serviceLevel}
                      @change=${t=>this.handleInputChange("serviceLevel",t.target.value)}
                    >
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Shipping Terms</label>
                    <input
                      type="text"
                      class="form-control"
                      .value=${this.contract.shippingTerms}
                      @input=${t=>this.handleInputChange("shippingTerms",t.target.value)}
                      placeholder="e.g., FOB, CIF"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Delivery Schedule</label>
                    <input
                      type="text"
                      class="form-control"
                      .value=${this.contract.deliverySchedule}
                      @input=${t=>this.handleInputChange("deliverySchedule",t.target.value)}
                    />
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      .checked=${this.contract.allowBackorders}
                      @change=${t=>this.handleInputChange("allowBackorders",t.target.checked)}
                      id="allowBackorders"
                    />
                    <label class="form-check-label" for="allowBackorders">
                      Allow Backorders
                    </label>
                  </div>
                </div>
              </div>

              <!-- Order Limits -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Order Limits</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Minimum Order Qty</label>
                    <input
                      type="number"
                      class="form-control"
                      .value=${this.contract.minOrderQty}
                      @input=${t=>this.handleInputChange("minOrderQty",parseInt(t.target.value)||0)}
                      min="0"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Maximum Order Qty</label>
                    <input
                      type="number"
                      class="form-control"
                      .value=${this.contract.maxOrderQty||""}
                      @input=${t=>this.handleInputChange("maxOrderQty",t.target.value?parseInt(t.target.value):null)}
                      min="0"
                      placeholder="No limit"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-end gap-2">
                <a href="#/website/b2b/contracts" class="btn btn-outline-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary" ?disabled=${this.saving}>
                  ${this.saving?i`
                    <span class="spinner-border spinner-border-sm me-2"></span>Saving...
                  `:i`
                    <i class="bi bi-check-circle me-2"></i>${this.contractId?"Update":"Create"} Contract
                  `}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `}}customElements.define("contract-form",r);
