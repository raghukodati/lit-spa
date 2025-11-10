import{T as c,N as e}from"./index-CDXZUF87.js";import{getCompanyById as d}from"./company.service-KQ_H_V7B.js";import{createPurchaseOrder as l}from"./purchaseorder.service-DhxrXw6P.js";import"./company.model-CKmygYMs.js";class o extends c{static properties={cart:{type:Array},company:{type:Object},loading:{type:Boolean},processing:{type:Boolean},step:{type:Number},formData:{type:Object}};constructor(){super(),this.cart=JSON.parse(localStorage.getItem("b2b-cart")||"[]"),this.company=null,this.loading=!1,this.processing=!1,this.step=1,this.companyId=1,this.formData={shippingAddressId:null,customerPONumber:"",notes:"",paymentMethod:"account",shippingMethod:"standard"}}createRenderRoot(){return this}async connectedCallback(){if(super.connectedCallback(),this.cart.length===0){window.location.pathname="/b2b-store/cart";return}await this.loadCompany()}async loadCompany(){this.loading=!0;try{if(this.company=await d(this.companyId),this.company.shippingAddresses&&this.company.shippingAddresses.length>0){const t=this.company.shippingAddresses.find(s=>s.isDefault);this.formData.shippingAddressId=(t||this.company.shippingAddresses[0]).id}}catch(t){console.error("Failed to load company:",t)}finally{this.loading=!1}}handleInputChange(t,s){this.formData[t]=s,this.requestUpdate()}async handleSubmitOrder(){if(confirm("Submit this order?")){this.processing=!0;try{const t={companyId:this.companyId,companyName:this.company.name,customerPONumber:this.formData.customerPONumber,items:this.cart.map(a=>({productId:a.productId,sku:a.sku,name:a.name,quantity:a.quantity,price:a.price,total:a.total})),subtotal:this.cartSummary.subtotal,taxAmount:this.cartSummary.tax,shippingAmount:this.cartSummary.shipping,total:this.cartSummary.total,paymentTerms:this.company.paymentTerms,shippingAddressId:this.formData.shippingAddressId,notes:this.formData.notes,status:"submitted",requiresApproval:this.cartSummary.total>this.company.approvalLimit},s=await l(t);localStorage.removeItem("b2b-cart"),alert(`Order submitted successfully! Order #${s.poNumber}`),window.location.pathname=`/b2b-store/orders/${s.id}`}catch(t){alert("Failed to submit order: "+t.message)}finally{this.processing=!1}}}get cartSummary(){const t=this.cart.reduce((r,n)=>r+n.total,0),s=this.company?.taxExempt?0:t*.08,a=t>500?0:50,i=t+s+a;return{subtotal:t,tax:s,shipping:a,total:i}}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}render(){if(this.loading)return e`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading...</p>
          </div>
        </div>
      `;const t=this.cartSummary;return e`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="mb-4">
          <h2 class="mb-1">Checkout</h2>
          <p class="text-muted mb-0">Review and submit your order</p>
        </div>

        <!-- Progress Steps -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              ${[{num:1,label:"Review Cart",icon:"cart-check"},{num:2,label:"Shipping & Info",icon:"truck"},{num:3,label:"Confirm Order",icon:"check-circle"}].map(s=>e`
                <div class="text-center flex-fill">
                  <div class="mb-2">
                    <span class="badge ${this.step===s.num?"bg-primary":this.step>s.num?"bg-success":"bg-secondary"} rounded-circle p-3">
                      <i class="bi bi-${s.icon} fs-5"></i>
                    </span>
                  </div>
                  <div class="small fw-bold">${s.label}</div>
                </div>
                ${s.num<3?e`
                  <div class="align-self-center flex-fill">
                    <hr class="my-0" />
                  </div>
                `:""}
              `)}
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Main Content -->
          <div class="col-lg-8">
            ${this.step===1?this.renderStep1():""}
            ${this.step===2?this.renderStep2():""}
            ${this.step===3?this.renderStep3():""}
          </div>

          <!-- Order Summary Sidebar -->
          <div class="col-lg-4">
            <div class="card sticky-top" style="top: 20px;">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Order Summary</h5>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <span>Items (${this.cart.length}):</span>
                  <strong>${this.formatCurrency(t.subtotal)}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <strong>${this.formatCurrency(t.tax)}</strong>
                </div>
                <div class="d-flex justify-content-between mb-3">
                  <span>Shipping:</span>
                  <strong>${t.shipping===0?e`<span class="text-success">FREE</span>`:this.formatCurrency(t.shipping)}</strong>
                </div>
                <hr>
                <div class="d-flex justify-content-between mb-3">
                  <strong class="fs-5">Total:</strong>
                  <strong class="fs-5 text-primary">${this.formatCurrency(t.total)}</strong>
                </div>

                ${this.company&&t.total>this.company.approvalLimit?e`
                  <div class="alert alert-warning small mb-0">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    This order requires approval
                  </div>
                `:""}
              </div>
            </div>
          </div>
        </div>
      </div>
    `}renderStep1(){return e`
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Cart Items</h5>
        </div>
        <div class="card-body">
          ${this.cart.map(t=>e`
            <div class="d-flex align-items-center border-bottom pb-3 mb-3">
              <div class="bg-light rounded me-3" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                <i class="bi bi-box" style="font-size: 2rem; color: #ccc;"></i>
              </div>
              <div class="flex-grow-1">
                <h6 class="mb-1">${t.name}</h6>
                <p class="text-muted small mb-0">SKU: ${t.sku} | Qty: ${t.quantity}</p>
              </div>
              <div class="text-end">
                <strong>${this.formatCurrency(t.total)}</strong>
              </div>
            </div>
          `)}
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between">
            <button class="btn btn-outline-secondary" @click=${()=>window.location.pathname="/b2b-store/cart"}>
              <i class="bi bi-arrow-left me-2"></i>Edit Cart
            </button>
            <button class="btn btn-primary" @click=${()=>this.step=2}>
              Continue <i class="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    `}renderStep2(){return e`
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Shipping & Order Information</h5>
        </div>
        <div class="card-body">
          <!-- Shipping Address -->
          <div class="mb-4">
            <label class="form-label fw-bold">Shipping Address</label>
            ${this.company?.shippingAddresses?.map(t=>e`
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" 
                       name="shippingAddress" 
                       id="addr-${t.id}"
                       .checked=${this.formData.shippingAddressId===t.id}
                       @change=${()=>this.handleInputChange("shippingAddressId",t.id)}>
                <label class="form-check-label" for="addr-${t.id}">
                  <strong>${t.name||"Unnamed Location"}</strong>
                  ${t.isDefault?e`<span class="badge bg-primary ms-2">Default</span>`:""}
                  <br>
                  <small>${t.street}, ${t.city}, ${t.state} ${t.postalCode}</small>
                </label>
              </div>
            `)}
          </div>

          <!-- PO Number -->
          <div class="mb-3">
            <label class="form-label">Your PO Number (Optional)</label>
            <input type="text" class="form-control"
                   .value=${this.formData.customerPONumber}
                   @input=${t=>this.handleInputChange("customerPONumber",t.target.value)}
                   placeholder="Enter your purchase order number" />
          </div>

          <!-- Shipping Method -->
          <div class="mb-3">
            <label class="form-label">Shipping Method</label>
            <select class="form-select"
                    .value=${this.formData.shippingMethod}
                    @change=${t=>this.handleInputChange("shippingMethod",t.target.value)}>
              <option value="standard">Standard (5-7 business days) - FREE over $500</option>
              <option value="express">Express (2-3 business days) - $25</option>
              <option value="overnight">Overnight - $50</option>
            </select>
          </div>

          <!-- Order Notes -->
          <div class="mb-3">
            <label class="form-label">Order Notes</label>
            <textarea class="form-control" rows="3"
                      .value=${this.formData.notes}
                      @input=${t=>this.handleInputChange("notes",t.target.value)}
                      placeholder="Special instructions..."></textarea>
          </div>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between">
            <button class="btn btn-outline-secondary" @click=${()=>this.step=1}>
              <i class="bi bi-arrow-left me-2"></i>Back
            </button>
            <button class="btn btn-primary" @click=${()=>this.step=3}>
              Continue <i class="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    `}renderStep3(){const t=this.company?.shippingAddresses?.find(s=>s.id===this.formData.shippingAddressId);return e`
      <div class="card mb-4">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0">Review & Confirm Order</h5>
        </div>
        <div class="card-body">
          <!-- Order Details -->
          <h6 class="mb-3">Order Details</h6>
          <div class="row mb-4">
            <div class="col-md-6">
              <div class="text-muted small mb-1">Company</div>
              <div class="fw-bold">${this.company?.name}</div>
            </div>
            <div class="col-md-6">
              <div class="text-muted small mb-1">Payment Terms</div>
              <div class="fw-bold">${this.company?.paymentTerms}</div>
            </div>
          </div>

          <!-- Shipping Address -->
          <h6 class="mb-3">Shipping To</h6>
          ${t?e`
            <address class="mb-4">
              <strong>${t.name}</strong><br>
              ${t.street}<br>
              ${t.city}, ${t.state} ${t.postalCode}<br>
              ${t.country}
            </address>
          `:""}

          <!-- PO Number -->
          ${this.formData.customerPONumber?e`
            <h6 class="mb-3">Your PO Number</h6>
            <p class="mb-4"><code>${this.formData.customerPONumber}</code></p>
          `:""}

          <!-- Order Items Summary -->
          <h6 class="mb-3">Order Items (${this.cart.length})</h6>
          <div class="table-responsive mb-4">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th class="text-end">Price</th>
                  <th class="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                ${this.cart.map(s=>e`
                  <tr>
                    <td>${s.name}</td>
                    <td>${s.quantity}</td>
                    <td class="text-end">${this.formatCurrency(s.price)}</td>
                    <td class="text-end">${this.formatCurrency(s.total)}</td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>

          <!-- Terms Agreement -->
          <div class="alert alert-info">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="termsAgree" required>
              <label class="form-check-label" for="termsAgree">
                I agree to the terms and conditions and authorize this purchase
              </label>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between">
            <button class="btn btn-outline-secondary" @click=${()=>this.step=2}>
              <i class="bi bi-arrow-left me-2"></i>Back
            </button>
            <button class="btn btn-success btn-lg" 
                    @click=${this.handleSubmitOrder}
                    ?disabled=${this.processing}>
              ${this.processing?e`
                <span class="spinner-border spinner-border-sm me-2"></span>Submitting...
              `:e`
                <i class="bi bi-check-circle me-2"></i>Submit Order
              `}
            </button>
          </div>
        </div>
      </div>
    `}}customElements.define("checkout-component",o);
