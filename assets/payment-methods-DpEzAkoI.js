import{T as r,N as a}from"./index-CDXZUF87.js";class c extends r{static properties={paymentMethods:{type:Array},loading:{type:Boolean},showModal:{type:Boolean},editingMethod:{type:Object},isNew:{type:Boolean}};constructor(){super(),this.paymentMethods=this.loadPaymentMethods(),this.loading=!1,this.showModal=!1,this.editingMethod=null,this.isNew=!1}createRenderRoot(){return this}loadPaymentMethods(){try{const e=localStorage.getItem("customer-payment-methods");return e?JSON.parse(e):this.getDefaultPaymentMethods()}catch{return this.getDefaultPaymentMethods()}}getDefaultPaymentMethods(){return[{id:1,type:"credit_card",isDefault:!0,nickname:"Company Amex",cardType:"American Express",lastFour:"1234",expiryMonth:"12",expiryYear:"2026",cardholderName:"John Doe",billingZip:"10001"},{id:2,type:"credit_card",isDefault:!1,nickname:"Backup Visa",cardType:"Visa",lastFour:"5678",expiryMonth:"08",expiryYear:"2025",cardholderName:"Jane Smith",billingZip:"10001"},{id:3,type:"ach",isDefault:!1,nickname:"Company Checking",bankName:"Chase Bank",accountType:"Checking",lastFour:"9876",routingNumber:"****1234"},{id:4,type:"net_terms",isDefault:!1,nickname:"Net 30",terms:"NET30",creditLimit:5e4,availableCredit:35e3}]}savePaymentMethods(){localStorage.setItem("customer-payment-methods",JSON.stringify(this.paymentMethods))}openNewMethodModal(){this.isNew=!0,this.editingMethod={type:"credit_card",isDefault:!1,nickname:"",cardholderName:"",cardNumber:"",cardType:"Visa",expiryMonth:"",expiryYear:"",cvv:"",billingZip:""},this.showModal=!0,this.requestUpdate()}editMethod(e){this.isNew=!1,this.editingMethod={...e},this.showModal=!0,this.requestUpdate()}closeModal(){this.showModal=!1,this.editingMethod=null,this.requestUpdate()}handleFormSubmit(e){e.preventDefault();const t=new FormData(e.target),l=t.get("type");let s={type:l,nickname:t.get("nickname"),isDefault:t.get("isDefault")==="on"};if(l==="credit_card"){const i=t.get("cardNumber");s={...s,cardType:t.get("cardType"),lastFour:i?i.slice(-4):this.editingMethod.lastFour,expiryMonth:t.get("expiryMonth"),expiryYear:t.get("expiryYear"),cardholderName:t.get("cardholderName"),billingZip:t.get("billingZip")}}else if(l==="ach"){const i=t.get("accountNumber");s={...s,bankName:t.get("bankName"),accountType:t.get("accountType"),lastFour:i?i.slice(-4):this.editingMethod.lastFour,routingNumber:t.get("routingNumber")}}if(this.isNew){const i={...s,id:Date.now()};this.paymentMethods=[...this.paymentMethods,i]}else this.paymentMethods=this.paymentMethods.map(i=>i.id===this.editingMethod.id?{...i,...s}:i);s.isDefault&&(this.paymentMethods=this.paymentMethods.map(i=>({...i,isDefault:i.id===(this.editingMethod?.id||Date.now())}))),this.savePaymentMethods(),this.closeModal()}deleteMethod(e){confirm("Are you sure you want to delete this payment method?")&&(this.paymentMethods=this.paymentMethods.filter(t=>t.id!==e),this.savePaymentMethods(),this.requestUpdate())}setDefaultMethod(e){this.paymentMethods=this.paymentMethods.map(t=>({...t,isDefault:t.id===e})),this.savePaymentMethods(),this.requestUpdate()}getCardIcon(e){return{Visa:"credit-card",Mastercard:"credit-card-2-front","American Express":"credit-card",Discover:"credit-card"}[e]||"credit-card"}formatCurrency(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(e)}renderPaymentCard(e){return a`
      <div class="col-md-6 mb-3">
        <div class="card h-100 ${e.isDefault?"border-primary":""}">
          ${e.isDefault?a`
            <div class="card-header bg-primary text-white py-1">
              <small><i class="bi bi-star-fill me-1"></i>Default Payment Method</small>
            </div>
          `:""}
          <div class="card-body">
            <h6 class="card-title">
              ${e.nickname}
              ${e.type==="credit_card"?a`
                <span class="badge bg-info ms-2">
                  <i class="bi bi-${this.getCardIcon(e.cardType)} me-1"></i>Card
                </span>
              `:e.type==="ach"?a`
                <span class="badge bg-success ms-2">
                  <i class="bi bi-bank me-1"></i>ACH
                </span>
              `:a`
                <span class="badge bg-warning text-dark ms-2">
                  <i class="bi bi-calendar-check me-1"></i>Terms
                </span>
              `}
            </h6>

            ${e.type==="credit_card"?a`
              <div class="text-muted small">
                <p class="mb-1">
                  <i class="bi bi-${this.getCardIcon(e.cardType)} me-2"></i>
                  ${e.cardType} •••• ${e.lastFour}
                </p>
                <p class="mb-1">
                  <i class="bi bi-person me-2"></i>
                  ${e.cardholderName}
                </p>
                <p class="mb-1">
                  <i class="bi bi-calendar me-2"></i>
                  Expires: ${e.expiryMonth}/${e.expiryYear}
                </p>
                <p class="mb-0">
                  <i class="bi bi-geo-alt me-2"></i>
                  ZIP: ${e.billingZip}
                </p>
              </div>
            `:e.type==="ach"?a`
              <div class="text-muted small">
                <p class="mb-1">
                  <i class="bi bi-bank me-2"></i>
                  ${e.bankName}
                </p>
                <p class="mb-1">
                  <i class="bi bi-wallet me-2"></i>
                  ${e.accountType} •••• ${e.lastFour}
                </p>
                <p class="mb-0">
                  <i class="bi bi-hash me-2"></i>
                  Routing: ${e.routingNumber}
                </p>
              </div>
            `:a`
              <div class="text-muted small">
                <p class="mb-1">
                  <i class="bi bi-calendar-check me-2"></i>
                  Terms: ${e.terms}
                </p>
                <p class="mb-1">
                  <i class="bi bi-credit-card-2-back me-2"></i>
                  Credit Limit: ${this.formatCurrency(e.creditLimit)}
                </p>
                <p class="mb-0 text-success">
                  <i class="bi bi-check-circle me-2"></i>
                  Available: ${this.formatCurrency(e.availableCredit)}
                </p>
              </div>
            `}
          </div>
          <div class="card-footer bg-transparent">
            <div class="d-flex gap-2">
              ${e.isDefault?"":a`
                <button class="btn btn-sm btn-outline-primary" 
                        @click=${()=>this.setDefaultMethod(e.id)}
                        title="Set as default">
                  <i class="bi bi-star"></i> Set Default
                </button>
              `}
              ${e.type!=="net_terms"?a`
                <button class="btn btn-sm btn-outline-secondary" 
                        @click=${()=>this.editMethod(e)}>
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" 
                        @click=${()=>this.deleteMethod(e.id)}>
                  <i class="bi bi-trash"></i> Delete
                </button>
              `:a`
                <span class="badge bg-info">Managed by Account Manager</span>
              `}
            </div>
          </div>
        </div>
      </div>
    `}render(){return a`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2><i class="bi bi-credit-card me-2"></i>Payment Methods</h2>
                <p class="text-muted">Manage your saved payment methods for faster checkout</p>
              </div>
              <button class="btn btn-primary" @click=${this.openNewMethodModal}>
                <i class="bi bi-plus-lg me-2"></i>Add Payment Method
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          ${this.paymentMethods.length>0?a`
            ${this.paymentMethods.map(e=>this.renderPaymentCard(e))}
          `:a`
            <div class="col-12">
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                No payment methods found. Add one to get started.
              </div>
            </div>
          `}
        </div>

        <!-- Security Notice -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="alert alert-light border">
              <h6><i class="bi bi-shield-check text-success me-2"></i>Security & Privacy</h6>
              <ul class="mb-0 small">
                <li>All payment information is encrypted and stored securely</li>
                <li>We never store full card numbers or CVV codes</li>
                <li>PCI DSS compliant payment processing</li>
                <li>You can update or remove payment methods at any time</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Payment Method Modal -->
        ${this.showModal?a`
          <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <form @submit=${this.handleFormSubmit}>
                  <div class="modal-header">
                    <h5 class="modal-title">
                      ${this.isNew?"Add New":"Edit"} Payment Method
                    </h5>
                    <button type="button" class="btn-close" @click=${this.closeModal}></button>
                  </div>
                  <div class="modal-body">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Nickname *</label>
                        <input type="text" class="form-control" name="nickname" 
                               .value=${this.editingMethod?.nickname||""} 
                               placeholder="e.g., Company Card" required>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Payment Type *</label>
                        <select class="form-select" name="type" .value=${this.editingMethod?.type||"credit_card"} required>
                          <option value="credit_card">Credit/Debit Card</option>
                          <option value="ach">ACH/Bank Account</option>
                        </select>
                      </div>
                    </div>

                    ${this.editingMethod?.type==="credit_card"?a`
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Card Type *</label>
                          <select class="form-select" name="cardType" .value=${this.editingMethod?.cardType||"Visa"} required>
                            <option value="Visa">Visa</option>
                            <option value="Mastercard">Mastercard</option>
                            <option value="American Express">American Express</option>
                            <option value="Discover">Discover</option>
                          </select>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Cardholder Name *</label>
                          <input type="text" class="form-control" name="cardholderName" 
                                 .value=${this.editingMethod?.cardholderName||""} required>
                        </div>
                      </div>

                      ${this.isNew?a`
                        <div class="mb-3">
                          <label class="form-label">Card Number *</label>
                          <input type="text" class="form-control" name="cardNumber" 
                                 placeholder="1234 5678 9012 3456" 
                                 pattern="[0-9]{13,19}" required>
                          <small class="text-muted">Your card number is encrypted and secure</small>
                        </div>
                      `:a`
                        <div class="mb-3">
                          <label class="form-label">Card Number</label>
                          <input type="text" class="form-control" 
                                 value="•••• •••• •••• ${this.editingMethod?.lastFour}" disabled>
                        </div>
                      `}

                      <div class="row">
                        <div class="col-md-4 mb-3">
                          <label class="form-label">Expiry Month *</label>
                          <select class="form-select" name="expiryMonth" .value=${this.editingMethod?.expiryMonth||""} required>
                            <option value="">Month</option>
                            ${Array.from({length:12},(e,t)=>t+1).map(e=>a`
                              <option value="${e.toString().padStart(2,"0")}">${e.toString().padStart(2,"0")}</option>
                            `)}
                          </select>
                        </div>
                        <div class="col-md-4 mb-3">
                          <label class="form-label">Expiry Year *</label>
                          <select class="form-select" name="expiryYear" .value=${this.editingMethod?.expiryYear||""} required>
                            <option value="">Year</option>
                            ${Array.from({length:10},(e,t)=>new Date().getFullYear()+t).map(e=>a`
                              <option value="${e}">${e}</option>
                            `)}
                          </select>
                        </div>
                        <div class="col-md-4 mb-3">
                          <label class="form-label">CVV ${this.isNew?"*":""}</label>
                          <input type="text" class="form-control" name="cvv" 
                                 placeholder="123" pattern="[0-9]{3,4}" 
                                 ?required=${this.isNew}>
                        </div>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Billing ZIP Code *</label>
                        <input type="text" class="form-control" name="billingZip" 
                               .value=${this.editingMethod?.billingZip||""} required>
                      </div>
                    `:a`
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Bank Name *</label>
                          <input type="text" class="form-control" name="bankName" 
                                 .value=${this.editingMethod?.bankName||""} required>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Account Type *</label>
                          <select class="form-select" name="accountType" .value=${this.editingMethod?.accountType||"Checking"} required>
                            <option value="Checking">Checking</option>
                            <option value="Savings">Savings</option>
                          </select>
                        </div>
                      </div>

                      ${this.isNew?a`
                        <div class="row">
                          <div class="col-md-6 mb-3">
                            <label class="form-label">Routing Number *</label>
                            <input type="text" class="form-control" name="routingNumber" 
                                   pattern="[0-9]{9}" required>
                          </div>
                          <div class="col-md-6 mb-3">
                            <label class="form-label">Account Number *</label>
                            <input type="text" class="form-control" name="accountNumber" required>
                          </div>
                        </div>
                      `:""}
                    `}

                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="isDefault" 
                             id="isDefault" ?checked=${this.editingMethod?.isDefault}>
                      <label class="form-check-label" for="isDefault">
                        Set as default payment method
                      </label>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click=${this.closeModal}>
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                      ${this.isNew?"Add Payment Method":"Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        `:""}
      </div>
    `}}customElements.define("payment-methods",c);
