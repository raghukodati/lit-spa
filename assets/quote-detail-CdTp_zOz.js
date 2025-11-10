import{N as e}from"./index-YRTalx74.js";import{B as i}from"./BaseComponent-CbMV1jW9.js";class a extends i{static properties={quoteId:{type:String},quote:{type:Object},loading:{type:Boolean},error:{type:String},processing:{type:Boolean}};constructor(){super(),this.quoteId=null,this.quote=null,this.loading=!1,this.error="",this.processing=!1,this._quoteService=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback();const s=window.location.pathname.match(/\/website\/b2b\/quotes\/(\d+)/);s&&(this.quoteId=s[1],this.loadQuote())}async loadQuote(){if(this.quoteId){this.loading=!0,this.error="";try{this._quoteService||(this._quoteService=await this.getService("quoteService")),this.quote=await this._quoteService.getQuoteById(this.quoteId),this.quote||(this.error="Quote not found")}catch(t){this.error=t.message||"Failed to load quote"}finally{this.loading=!1}}}async handleSend(){if(this.can("quotes","update")&&confirm("Send this quote to the customer?")){this.processing=!0;try{this._quoteService||(this._quoteService=await this.getService("quoteService")),await this._quoteService.sendQuote(this.quoteId),await this.loadQuote()}catch(t){alert("Failed to send quote: "+t.message)}finally{this.processing=!1}}}async handleAccept(){if(this.can("quotes","approve")&&confirm("Accept this quote?")){this.processing=!0;try{this._quoteService||(this._quoteService=await this.getService("quoteService")),await this._quoteService.acceptQuote(this.quoteId),await this.loadQuote()}catch(t){alert("Failed to accept quote: "+t.message)}finally{this.processing=!1}}}async handleReject(){if(!this.can("quotes","reject"))return;const t=prompt("Reason for rejection:");if(t){this.processing=!0;try{this._quoteService||(this._quoteService=await this.getService("quoteService")),await this._quoteService.rejectQuote(this.quoteId,t),await this.loadQuote()}catch(s){alert("Failed to reject quote: "+s.message)}finally{this.processing=!1}}}async handleConvert(){if(this.can("quotes","update")&&confirm("Convert this quote to an order?")){this.processing=!0;try{this._quoteService||(this._quoteService=await this.getService("quoteService"));const t=await this._quoteService.convertQuoteToOrder(this.quoteId);alert(`Order created successfully! Order ID: ${t.orderId}`),window.location.pathname=`/website/orders/${t.orderId}`}catch(t){alert("Failed to convert quote: "+t.message)}finally{this.processing=!1}}}getStatusBadgeClass(t){return{draft:"secondary",sent:"primary",viewed:"info",accepted:"success",rejected:"danger",expired:"warning",converted:"success"}[t]||"secondary"}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}formatDate(t){return t?new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"N/A"}render(){return this.loading?e`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading quote...</p>
          </div>
        </div>
      `:this.error||!this.quote?e`
        <div class="container-fluid mt-4">
          <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>${this.error||"Quote not found"}
          </div>
          <a href="#/website/b2b/quotes" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Back to Quotes
          </a>
        </div>
      `:e`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-start mb-4">
          <div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <h2 class="mb-0">${this.quote.quoteNumber}</h2>
              <span class="badge bg-${this.getStatusBadgeClass(this.quote.status)}">
                ${this.quote.status}
              </span>
              <span class="badge bg-secondary text-capitalize">${this.quote.type}</span>
            </div>
            ${this.quote.title?e`<p class="text-muted mb-0">${this.quote.title}</p>`:""}
          </div>
          <div class="btn-group">
            ${this.quote.status==="draft"?e`
              <button class="btn btn-success" @click=${this.handleSend} ?disabled=${this.processing}>
                <i class="bi bi-send me-2"></i>Send Quote
              </button>
            `:""}
            ${this.quote.status==="accepted"&&!this.quote.convertedToOrderId?e`
              <button class="btn btn-primary" @click=${this.handleConvert} ?disabled=${this.processing}>
                <i class="bi bi-arrow-right-circle me-2"></i>Convert to Order
              </button>
            `:""}
            <a href="#/website/b2b/quotes/edit/${this.quote.id}" class="btn btn-outline-secondary">
              <i class="bi bi-pencil me-2"></i>Edit
            </a>
            <a href="#/website/b2b/quotes" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>Back
            </a>
          </div>
        </div>

        <div class="row">
          <!-- Left Column -->
          <div class="col-lg-8">
            <!-- Customer Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Customer Information</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <div class="text-muted small mb-1">Company</div>
                      <div class="fw-bold">${this.quote.companyName}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <div class="text-muted small mb-1">Contact Name</div>
                      <div>${this.quote.contactName||"N/A"}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <div class="text-muted small mb-1">Email</div>
                      <a href="mailto:${this.quote.contactEmail}">${this.quote.contactEmail}</a>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <div class="text-muted small mb-1">Phone</div>
                      <div>${this.quote.contactPhone||"N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Line Items -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Line Items</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th class="text-end">Quantity</th>
                        <th class="text-end">Unit Price</th>
                        <th class="text-end">Discount</th>
                        <th class="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.quote.items.map(t=>e`
                        <tr>
                          <td>
                            <div class="fw-bold">${t.name}</div>
                            ${t.description?e`<small class="text-muted">${t.description}</small>`:""}
                          </td>
                          <td><code class="small">${t.sku||"N/A"}</code></td>
                          <td class="text-end">${t.quantity}</td>
                          <td class="text-end">${this.formatCurrency(t.unitPrice)}</td>
                          <td class="text-end text-danger">${t.discount>0?"-"+this.formatCurrency(t.discount):"-"}</td>
                          <td class="text-end fw-bold">${this.formatCurrency(t.total)}</td>
                        </tr>
                      `)}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="5" class="text-end"><strong>Subtotal:</strong></td>
                        <td class="text-end fw-bold">${this.formatCurrency(this.quote.subtotal)}</td>
                      </tr>
                      ${this.quote.discountAmount>0?e`
                        <tr>
                          <td colspan="5" class="text-end">Discount (${this.quote.discountPercent}%):</td>
                          <td class="text-end text-danger">-${this.formatCurrency(this.quote.discountAmount)}</td>
                        </tr>
                      `:""}
                      <tr>
                        <td colspan="5" class="text-end">Tax:</td>
                        <td class="text-end">${this.formatCurrency(this.quote.taxAmount)}</td>
                      </tr>
                      <tr>
                        <td colspan="5" class="text-end">Shipping:</td>
                        <td class="text-end">${this.formatCurrency(this.quote.shippingAmount)}</td>
                      </tr>
                      <tr class="table-active">
                        <td colspan="5" class="text-end"><strong>Total:</strong></td>
                        <td class="text-end fw-bold fs-5 text-primary">${this.formatCurrency(this.quote.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <!-- Terms & Conditions -->
            ${this.quote.termsAndConditions?e`
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Terms & Conditions</h5>
                </div>
                <div class="card-body">
                  <p class="mb-0" style="white-space: pre-wrap;">${this.quote.termsAndConditions}</p>
                </div>
              </div>
            `:""}

            <!-- Notes -->
            ${this.quote.notes?e`
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Internal Notes</h5>
                </div>
                <div class="card-body">
                  <p class="mb-0" style="white-space: pre-wrap;">${this.quote.notes}</p>
                </div>
              </div>
            `:""}
          </div>

          <!-- Right Column -->
          <div class="col-lg-4">
            <!-- Quote Details -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Quote Details</h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <div class="text-muted small mb-1">Payment Terms</div>
                  <div><strong>${this.quote.paymentTerms}</strong></div>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Valid Until</div>
                  <div class="${this.quote.isExpired?"text-danger":""}">
                    ${this.formatDate(this.quote.validUntil)}
                    ${this.quote.isExpired?e`<span class="badge bg-danger ms-2">Expired</span>`:""}
                  </div>
                </div>
                <div class="mb-3">
                  <div class="text-muted small mb-1">Created</div>
                  <div>${this.formatDate(this.quote.createdAt)}</div>
                </div>
                ${this.quote.sentAt?e`
                  <div class="mb-3">
                    <div class="text-muted small mb-1">Sent</div>
                    <div>${this.formatDate(this.quote.sentAt)}</div>
                  </div>
                `:""}
                ${this.quote.viewedAt?e`
                  <div class="mb-3">
                    <div class="text-muted small mb-1">Viewed</div>
                    <div>
                      ${this.formatDate(this.quote.viewedAt)}
                      <span class="badge bg-info ms-2">${this.quote.viewCount}x</span>
                    </div>
                  </div>
                `:""}
                ${this.quote.salesRepName?e`
                  <div class="mb-3">
                    <div class="text-muted small mb-1">Sales Rep</div>
                    <div>${this.quote.salesRepName}</div>
                  </div>
                `:""}
              </div>
            </div>

            <!-- Actions -->
            ${["sent","viewed"].includes(this.quote.status)?e`
              <div class="card mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0">Customer Actions</h5>
                </div>
                <div class="card-body">
                  <div class="d-grid gap-2">
                    <button class="btn btn-success" @click=${this.handleAccept} ?disabled=${this.processing}>
                      <i class="bi bi-check-circle me-2"></i>Accept Quote
                    </button>
                    <button class="btn btn-outline-danger" @click=${this.handleReject} ?disabled=${this.processing}>
                      <i class="bi bi-x-circle me-2"></i>Reject Quote
                    </button>
                  </div>
                </div>
              </div>
            `:""}

            <!-- Conversion Info -->
            ${this.quote.convertedToOrderId?e`
              <div class="card border-success mb-4">
                <div class="card-header bg-success text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-check-circle me-2"></i>Converted
                  </h5>
                </div>
                <div class="card-body">
                  <p class="mb-2">This quote has been converted to an order.</p>
                  <div class="text-muted small mb-1">Order ID</div>
                  <div class="mb-3">
                    <strong>#${this.quote.convertedToOrderId}</strong>
                  </div>
                  <div class="text-muted small mb-1">Converted On</div>
                  <div>${this.formatDate(this.quote.convertedAt)}</div>
                </div>
              </div>
            `:""}

            <!-- Rejection Info -->
            ${this.quote.status==="rejected"&&this.quote.rejectionReason?e`
              <div class="card border-danger">
                <div class="card-header bg-danger text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-x-circle me-2"></i>Rejected
                  </h5>
                </div>
                <div class="card-body">
                  <div class="text-muted small mb-1">Reason</div>
                  <p class="mb-0">${this.quote.rejectionReason}</p>
                </div>
              </div>
            `:""}
          </div>
        </div>
      </div>
    `}}customElements.define("quote-detail",a);
