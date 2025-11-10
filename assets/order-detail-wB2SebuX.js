import{N as r}from"./index-D7HSGHDh.js";import{B as s}from"./BaseComponent-CD8EqlKR.js";class d extends s{static properties={orderId:{type:String},order:{type:Object},loading:{type:Boolean},trackingNumber:{type:String},carrier:{type:String}};constructor(){super(),this.orderId=null,this.order=null,this.loading=!1,this.trackingNumber="",this.carrier="",this._orderService=null}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),this._orderService||(this._orderService=await this.getService("orderService"));const t=window.location.pathname.match(/\/website\/orders\/(\d+)/);t&&(this.orderId=t[1],await this.loadOrder())}async loadOrder(){this.loading=!0;try{this._orderService||(this._orderService=await this.getService("orderService")),this.order=await this._orderService.getOrderById(this.orderId),this.order||(alert("Order not found"),window.go("/website/orders"))}catch(e){console.error("Failed to load order:",e)}finally{this.loading=!1}}async handleUpdateStatus(e){if(this.can("orders","update")&&confirm(`Change order status to ${e}?`))try{await this._orderService.updateOrderStatus(this.orderId,e),alert("Order status updated"),await this.loadOrder()}catch(t){alert("Failed to update status: "+t.message)}}async handleMarkPaid(){if(this.can("orders","update"))try{await this._orderService.updatePaymentStatus(this.orderId,"paid","manual_"+Date.now()),alert("Order marked as paid"),await this.loadOrder()}catch(e){alert("Failed to update payment: "+e.message)}}async handleFulfill(){if(this.can("orders","update")){if(!this.trackingNumber){alert("Please enter tracking number");return}try{await this._orderService.updateFulfillmentStatus(this.orderId,"fulfilled",{trackingNumber:this.trackingNumber,carrier:this.carrier}),alert("Order marked as fulfilled"),await this.loadOrder()}catch(e){alert("Failed to fulfill order: "+e.message)}}}async handleCancel(){if(!this.can("orders","update"))return;const e=prompt("Cancellation reason:");if(e)try{await this._orderService.cancelOrder(this.orderId,e),alert("Order cancelled"),await this.loadOrder()}catch(t){alert("Failed to cancel order: "+t.message)}}async handleRefund(){if(!this.can("orders","update"))return;const e=prompt("Refund reason:");if(e)try{await this._orderService.refundOrder(this.orderId,e),alert("Order refunded"),await this.loadOrder()}catch(t){alert("Failed to refund order: "+t.message)}}render(){return this.loading||!this.order?r`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border"></div>
          </div>
        </div>
      `:r`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Order ${this.order.orderNumber}</h2>
            <p class="text-muted mb-0">
              Placed on ${new Date(this.order.createdAt).toLocaleString()}
            </p>
          </div>
          <a href="#/website/orders" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Back to Orders
          </a>
        </div>

        <div class="row">
          <!-- Left Column -->
          <div class="col-md-8">
            <!-- Items -->
            <div class="card mb-3">
              <div class="card-header">
                <h5 class="mb-0">Order Items</h5>
              </div>
              <div class="card-body">
                <table class="table mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.order.items.map(e=>r`
                      <tr>
                        <td><strong>${e.name}</strong></td>
                        <td>${e.sku}</td>
                        <td>${e.quantity}</td>
                        <td>$${e.price.toFixed(2)}</td>
                        <td>$${e.total.toFixed(2)}</td>
                      </tr>
                    `)}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4" class="text-end"><strong>Subtotal:</strong></td>
                      <td><strong>$${this.order.subtotal.toFixed(2)}</strong></td>
                    </tr>
                    <tr>
                      <td colspan="4" class="text-end">Tax:</td>
                      <td>$${this.order.tax.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="text-end">Shipping:</td>
                      <td>$${this.order.shipping.toFixed(2)}</td>
                    </tr>
                    ${this.order.discount>0?r`
                      <tr>
                        <td colspan="4" class="text-end">
                          Discount ${this.order.discountCode?r`(${this.order.discountCode})`:""}:
                        </td>
                        <td class="text-danger">-$${this.order.discount.toFixed(2)}</td>
                      </tr>
                    `:""}
                    <tr class="table-active">
                      <td colspan="4" class="text-end"><strong>Total:</strong></td>
                      <td><strong>$${this.order.total.toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Addresses -->
            <div class="row">
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h6 class="mb-0">Shipping Address</h6>
                  </div>
                  <div class="card-body">
                    <p class="mb-1">
                      ${this.order.shippingAddress.firstName} ${this.order.shippingAddress.lastName}
                    </p>
                    ${this.order.shippingAddress.company?r`
                      <p class="mb-1">${this.order.shippingAddress.company}</p>
                    `:""}
                    <p class="mb-1">${this.order.shippingAddress.address1}</p>
                    ${this.order.shippingAddress.address2?r`
                      <p class="mb-1">${this.order.shippingAddress.address2}</p>
                    `:""}
                    <p class="mb-0">
                      ${this.order.shippingAddress.city}, ${this.order.shippingAddress.state} 
                      ${this.order.shippingAddress.zipCode}
                    </p>
                    <p class="mb-0">${this.order.shippingAddress.country}</p>
                    ${this.order.shippingAddress.phone?r`
                      <p class="mb-0 mt-2">Phone: ${this.order.shippingAddress.phone}</p>
                    `:""}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h6 class="mb-0">Billing Address</h6>
                  </div>
                  <div class="card-body">
                    ${this.order.billingSameAsShipping?r`
                      <p class="text-muted">Same as shipping address</p>
                    `:r`
                      <p class="mb-1">
                        ${this.order.billingAddress.firstName} ${this.order.billingAddress.lastName}
                      </p>
                      <p class="mb-1">${this.order.billingAddress.address1}</p>
                      <p class="mb-0">
                        ${this.order.billingAddress.city}, ${this.order.billingAddress.state} 
                        ${this.order.billingAddress.zipCode}
                      </p>
                    `}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-md-4">
            <!-- Status -->
            <div class="card mb-3">
              <div class="card-header">
                <h5 class="mb-0">Order Status</h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label class="form-label">Order Status</label>
                  <select 
                    class="form-select"
                    .value="${this.order.status}"
                    @change="${e=>this.handleUpdateStatus(e.target.value)}"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Payment Status</label>
                  <div>
                    <span class="badge ${this.order.paymentStatus==="paid"?"bg-success":"bg-warning"}">
                      ${this.order.paymentStatus}
                    </span>
                  </div>
                  ${this.order.paymentStatus!=="paid"&&this.can("orders","update")?r`
                    <button 
                      class="btn btn-sm btn-success mt-2"
                      @click="${this.handleMarkPaid}"
                    >
                      Mark as Paid
                    </button>
                  `:""}
                </div>

                <div class="mb-3">
                  <label class="form-label">Fulfillment Status</label>
                  <div>
                    <span class="badge ${this.order.fulfillmentStatus==="fulfilled"?"bg-success":"bg-warning"}">
                      ${this.order.fulfillmentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fulfillment -->
            ${this.order.fulfillmentStatus!=="fulfilled"&&this.order.status!=="cancelled"&&this.can("orders","update")?r`
              <div class="card mb-3">
                <div class="card-header">
                  <h5 class="mb-0">Fulfill Order</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Tracking Number</label>
                    <input 
                      type="text" 
                      class="form-control"
                      .value="${this.trackingNumber}"
                      @input="${e=>this.trackingNumber=e.target.value}"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Carrier</label>
                    <select 
                      class="form-select"
                      .value="${this.carrier}"
                      @change="${e=>this.carrier=e.target.value}"
                    >
                      <option value="">Select carrier</option>
                      <option value="UPS">UPS</option>
                      <option value="FedEx">FedEx</option>
                      <option value="USPS">USPS</option>
                      <option value="DHL">DHL</option>
                    </select>
                  </div>
                  <button 
                    class="btn btn-primary w-100"
                    @click="${this.handleFulfill}"
                  >
                    Mark as Fulfilled
                  </button>
                </div>
              </div>
            `:""}

            ${this.order.trackingNumber?r`
              <div class="card mb-3">
                <div class="card-header">
                  <h6 class="mb-0">Tracking Information</h6>
                </div>
                <div class="card-body">
                  <p class="mb-1"><strong>Carrier:</strong> ${this.order.carrier}</p>
                  <p class="mb-0"><strong>Tracking #:</strong> ${this.order.trackingNumber}</p>
                </div>
              </div>
            `:""}

            <!-- Actions -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Actions</h5>
              </div>
              <div class="card-body">
                ${this.order.canCancel()&&this.can("orders","update")?r`
                  <button 
                    class="btn btn-warning w-100 mb-2"
                    @click="${this.handleCancel}"
                  >
                    Cancel Order
                  </button>
                `:""}
                ${this.order.canRefund()&&this.can("orders","update")?r`
                  <button 
                    class="btn btn-danger w-100"
                    @click="${this.handleRefund}"
                  >
                    Refund Order
                  </button>
                `:""}
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("order-detail",d);
