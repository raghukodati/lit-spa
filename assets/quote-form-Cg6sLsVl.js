import{N as i}from"./index-B2c558M3.js";import{B as r}from"./BaseComponent-DR8UZD6Q.js";import{Q as n}from"./quote.model-CvL1ADQq.js";class c extends r{static properties={quoteId:{type:String},quote:{type:Object},companies:{type:Array},products:{type:Array},loading:{type:Boolean},saving:{type:Boolean},error:{type:String},validationErrors:{type:Array}};constructor(){super(),this.quoteId=null,this.quote={type:"standard",companyId:null,companyName:"",contactName:"",contactEmail:"",contactPhone:"",title:"",description:"",items:[],discountPercent:0,discountAmount:0,shippingAmount:0,paymentTerms:"Net 30",validUntil:"",termsAndConditions:"",notes:""},this.companies=[],this.products=[],this.loading=!1,this.saving=!1,this.error="",this.validationErrors=[],this._quoteService=null,this._companyService=null,this._productService=null}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadData();const a=window.location.pathname.match(/\/website\/b2b\/quotes\/edit\/(\d+)/);a&&(this.quoteId=a[1],await this.loadQuote());const s=new URLSearchParams(window.location.search).get("companyId");s&&!this.quoteId&&this.handleCompanyChange({target:{value:s}})}async loadData(){this.loading=!0;try{this._companyService||(this._companyService=await this.getService("companyService")),this._productService||(this._productService=await this.getService("productService")),[this.companies,this.products]=await Promise.all([this._companyService.getCompanies({status:"active"}),this._productService.getProducts({status:"active"})])}catch{this.error="Failed to load data"}finally{this.loading=!1}}async loadQuote(){if(this.quoteId){this.loading=!0;try{this._quoteService||(this._quoteService=await this.getService("quoteService"));const t=await this._quoteService.getQuoteById(this.quoteId);t&&(this.quote=t)}catch{this.error="Failed to load quote"}finally{this.loading=!1}}}handleCompanyChange(t){const a=parseInt(t.target.value),e=this.companies.find(s=>s.id===a);e&&(this.quote={...this.quote,companyId:e.id,companyName:e.name,contactName:e.primaryContact.name,contactEmail:e.primaryContact.email,contactPhone:e.primaryContact.phone,paymentTerms:e.paymentTerms,discountPercent:e.discountPercent},this.requestUpdate())}handleInputChange(t,a){this.quote[t]=a,this.requestUpdate()}handleAddItem(){this.quote.items.push({productId:null,sku:"",name:"",description:"",quantity:1,unitPrice:0,discount:0,total:0}),this.requestUpdate()}handleRemoveItem(t){this.quote.items.splice(t,1),this.calculateTotals(),this.requestUpdate()}handleItemChange(t,a,e){if(this.quote.items[t][a]=e,a==="productId"&&e){const o=this.products.find(l=>l.id===parseInt(e));o&&(this.quote.items[t].sku=o.sku,this.quote.items[t].name=o.name,this.quote.items[t].description=o.description,this.quote.items[t].unitPrice=o.price)}const s=this.quote.items[t];s.total=s.quantity*s.unitPrice-s.discount,this.calculateTotals(),this.requestUpdate()}calculateTotals(){const t=new n(this.quote);t.calculateTotals(),this.quote.subtotal=t.subtotal,this.quote.taxAmount=t.taxAmount,this.quote.total=t.total}async handleSubmit(t){t.preventDefault(),this.calculateTotals();const e=new n(this.quote).validate();if(!e.isValid){this.validationErrors=e.errors;return}this.validationErrors=[],this.saving=!0,this.error="";try{this._quoteService||(this._quoteService=await this.getService("quoteService"));const s=this.quoteId?"update":"create";if(!this.can("quotes",s)){alert(`You do not have permission to ${s} quotes`),this.saving=!1;return}this.quoteId?await this._quoteService.updateQuote(this.quoteId,this.quote):await this._quoteService.createQuote(this.quote),window.location.pathname="/website/b2b/quotes"}catch(s){this.error=s.message||"Failed to save quote"}finally{this.saving=!1}}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}render(){return this.loading&&!this.companies.length?i`
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
            <h2 class="mb-1">${this.quoteId?"Edit":"Create"} Quote</h2>
            <p class="text-muted mb-0">Create or edit customer quote</p>
          </div>
          <a href="#/website/b2b/quotes" class="btn btn-outline-secondary">
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
              <!-- Quote Information -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Quote Information</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Company *</label>
                      <select 
                        class="form-select"
                        .value=${this.quote.companyId||""}
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
                      <label class="form-label">Type</label>
                      <select 
                        class="form-select"
                        .value=${this.quote.type}
                        @change=${t=>this.handleInputChange("type",t.target.value)}
                      >
                        <option value="standard">Standard</option>
                        <option value="rfq">RFQ</option>
                        <option value="bulk">Bulk</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Contact Name</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.quote.contactName}
                        @input=${t=>this.handleInputChange("contactName",t.target.value)}
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Contact Email *</label>
                      <input
                        type="email"
                        class="form-control"
                        .value=${this.quote.contactEmail}
                        @input=${t=>this.handleInputChange("contactEmail",t.target.value)}
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Contact Phone</label>
                      <input
                        type="tel"
                        class="form-control"
                        .value=${this.quote.contactPhone}
                        @input=${t=>this.handleInputChange("contactPhone",t.target.value)}
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Valid Until</label>
                      <input
                        type="date"
                        class="form-control"
                        .value=${this.quote.validUntil}
                        @input=${t=>this.handleInputChange("validUntil",t.target.value)}
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Title</label>
                      <input
                        type="text"
                        class="form-control"
                        .value=${this.quote.title}
                        @input=${t=>this.handleInputChange("title",t.target.value)}
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Description</label>
                      <textarea
                        class="form-control"
                        rows="2"
                        .value=${this.quote.description}
                        @input=${t=>this.handleInputChange("description",t.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Line Items -->
              <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">Line Items</h5>
                  <button type="button" class="btn btn-sm btn-primary" @click=${this.handleAddItem}>
                    <i class="bi bi-plus-circle me-2"></i>Add Item
                  </button>
                </div>
                <div class="card-body">
                  ${this.quote.items.length===0?i`
                    <p class="text-muted text-center mb-0">No items added yet</p>
                  `:i`
                    <div class="table-responsive">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Discount</th>
                            <th>Total</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          ${this.quote.items.map((t,a)=>i`
                            <tr>
                              <td>
                                <select 
                                  class="form-select form-select-sm"
                                  .value=${t.productId||""}
                                  @change=${e=>this.handleItemChange(a,"productId",e.target.value)}
                                >
                                  <option value="">Select Product</option>
                                  ${this.products.map(e=>i`
                                    <option value="${e.id}">${e.name}</option>
                                  `)}
                                </select>
                                ${t.name&&!t.productId?i`
                                  <input
                                    type="text"
                                    class="form-control form-control-sm mt-1"
                                    placeholder="Product name"
                                    .value=${t.name}
                                    @input=${e=>this.handleItemChange(a,"name",e.target.value)}
                                  />
                                `:""}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${t.quantity}
                                  @input=${e=>this.handleItemChange(a,"quantity",parseFloat(e.target.value)||0)}
                                  min="1"
                                  style="width: 80px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${t.unitPrice}
                                  @input=${e=>this.handleItemChange(a,"unitPrice",parseFloat(e.target.value)||0)}
                                  min="0"
                                  step="0.01"
                                  style="width: 100px;"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  class="form-control form-control-sm"
                                  .value=${t.discount}
                                  @input=${e=>this.handleItemChange(a,"discount",parseFloat(e.target.value)||0)}
                                  min="0"
                                  step="0.01"
                                  style="width: 80px;"
                                />
                              </td>
                              <td>${this.formatCurrency(t.total)}</td>
                              <td>
                                <button
                                  type="button"
                                  class="btn btn-sm btn-outline-danger"
                                  @click=${()=>this.handleRemoveItem(a)}
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

              <!-- Terms -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Terms & Conditions</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Terms and Conditions</label>
                    <textarea
                      class="form-control"
                      rows="3"
                      .value=${this.quote.termsAndConditions}
                      @input=${t=>this.handleInputChange("termsAndConditions",t.target.value)}
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Internal Notes</label>
                    <textarea
                      class="form-control"
                      rows="2"
                      .value=${this.quote.notes}
                      @input=${t=>this.handleInputChange("notes",t.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <!-- Pricing -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Pricing</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Payment Terms</label>
                    <select 
                      class="form-select"
                      .value=${this.quote.paymentTerms}
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
                  <div class="mb-3">
                    <label class="form-label">Discount %</label>
                    <input
                      type="number"
                      class="form-control"
                      .value=${this.quote.discountPercent}
                      @input=${t=>{this.handleInputChange("discountPercent",parseFloat(t.target.value)||0),this.calculateTotals()}}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Shipping Amount</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input
                        type="number"
                        class="form-control"
                        .value=${this.quote.shippingAmount}
                        @input=${t=>{this.handleInputChange("shippingAmount",parseFloat(t.target.value)||0),this.calculateTotals()}}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Summary -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Summary</h5>
                </div>
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <strong>${this.formatCurrency(this.quote.subtotal||0)}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Discount:</span>
                    <strong class="text-danger">-${this.formatCurrency(this.quote.discountAmount||0)}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <strong>${this.formatCurrency(this.quote.taxAmount||0)}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <strong>${this.formatCurrency(this.quote.shippingAmount||0)}</strong>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong class="fs-5 text-primary">${this.formatCurrency(this.quote.total||0)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-end gap-2">
                <a href="#/website/b2b/quotes" class="btn btn-outline-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary" ?disabled=${this.saving}>
                  ${this.saving?i`
                    <span class="spinner-border spinner-border-sm me-2"></span>Saving...
                  `:i`
                    <i class="bi bi-check-circle me-2"></i>${this.quoteId?"Update":"Create"} Quote
                  `}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `}}customElements.define("quote-form",c);
