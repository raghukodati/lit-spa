/**
 * B2B Checkout Component
 */

import { LitElement, html } from 'lit';
import { getCompanyById } from '../../../services/company.service.js';
import { createPurchaseOrder } from '../../../services/purchaseorder.service.js';

class Checkout extends LitElement {
  static properties = {
    cart: { type: Array },
    company: { type: Object },
    loading: { type: Boolean },
    processing: { type: Boolean },
    step: { type: Number },
    formData: { type: Object }
  };

  constructor() {
    super();
    this.cart = JSON.parse(localStorage.getItem('b2b-cart') || '[]');
    this.company = null;
    this.loading = false;
    this.processing = false;
    this.step = 1; // 1: Review, 2: Shipping, 3: Confirm
    this.companyId = 1; // Mock: From authentication
    this.formData = {
      shippingAddressId: null,
      customerPONumber: '',
      notes: '',
      paymentMethod: 'account',
      shippingMethod: 'standard'
    };
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    
    if (this.cart.length === 0) {
      window.location.pathname = '/b2b-store/cart';
      return;
    }
    
    await this.loadCompany();
  }

  async loadCompany() {
    this.loading = true;
    try {
      this.company = await getCompanyById(this.companyId);
      if (this.company.shippingAddresses && this.company.shippingAddresses.length > 0) {
        const defaultAddr = this.company.shippingAddresses.find(a => a.isDefault);
        this.formData.shippingAddressId = (defaultAddr || this.company.shippingAddresses[0]).id;
      }
    } catch (err) {
      console.error('Failed to load company:', err);
    } finally {
      this.loading = false;
    }
  }

  handleInputChange(field, value) {
    this.formData[field] = value;
    this.requestUpdate();
  }

  async handleSubmitOrder() {
    if (!confirm('Submit this order?')) return;

    this.processing = true;
    try {
      const orderData = {
        companyId: this.companyId,
        companyName: this.company.name,
        customerPONumber: this.formData.customerPONumber,
        items: this.cart.map(item => ({
          productId: item.productId,
          sku: item.sku,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        })),
        subtotal: this.cartSummary.subtotal,
        taxAmount: this.cartSummary.tax,
        shippingAmount: this.cartSummary.shipping,
        total: this.cartSummary.total,
        paymentTerms: this.company.paymentTerms,
        shippingAddressId: this.formData.shippingAddressId,
        notes: this.formData.notes,
        status: 'submitted',
        requiresApproval: this.cartSummary.total > this.company.approvalLimit
      };

      const result = await createPurchaseOrder(orderData);
      
      // Clear cart
      localStorage.removeItem('b2b-cart');
      
      // Redirect to order confirmation
      alert(`Order submitted successfully! Order #${result.poNumber}`);
      window.location.pathname = `/b2b-store/orders/${result.id}`;
    } catch (err) {
      alert('Failed to submit order: ' + err.message);
    } finally {
      this.processing = false;
    }
  }

  get cartSummary() {
    const subtotal = this.cart.reduce((sum, item) => sum + item.total, 0);
    const tax = this.company?.taxExempt ? 0 : subtotal * 0.08;
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + tax + shipping;
    
    return { subtotal, tax, shipping, total };
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  render() {
    if (this.loading) {
      return html`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading...</p>
          </div>
        </div>
      `;
    }

    const summary = this.cartSummary;

    return html`
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
              ${[
                { num: 1, label: 'Review Cart', icon: 'cart-check' },
                { num: 2, label: 'Shipping & Info', icon: 'truck' },
                { num: 3, label: 'Confirm Order', icon: 'check-circle' }
              ].map(s => html`
                <div class="text-center flex-fill">
                  <div class="mb-2">
                    <span class="badge ${this.step === s.num ? 'bg-primary' : this.step > s.num ? 'bg-success' : 'bg-secondary'} rounded-circle p-3">
                      <i class="bi bi-${s.icon} fs-5"></i>
                    </span>
                  </div>
                  <div class="small fw-bold">${s.label}</div>
                </div>
                ${s.num < 3 ? html`
                  <div class="align-self-center flex-fill">
                    <hr class="my-0" />
                  </div>
                ` : ''}
              `)}
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Main Content -->
          <div class="col-lg-8">
            ${this.step === 1 ? this.renderStep1() : ''}
            ${this.step === 2 ? this.renderStep2() : ''}
            ${this.step === 3 ? this.renderStep3() : ''}
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
                  <strong>${this.formatCurrency(summary.subtotal)}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <strong>${this.formatCurrency(summary.tax)}</strong>
                </div>
                <div class="d-flex justify-content-between mb-3">
                  <span>Shipping:</span>
                  <strong>${summary.shipping === 0 ? html`<span class="text-success">FREE</span>` : this.formatCurrency(summary.shipping)}</strong>
                </div>
                <hr>
                <div class="d-flex justify-content-between mb-3">
                  <strong class="fs-5">Total:</strong>
                  <strong class="fs-5 text-primary">${this.formatCurrency(summary.total)}</strong>
                </div>

                ${this.company && summary.total > this.company.approvalLimit ? html`
                  <div class="alert alert-warning small mb-0">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    This order requires approval
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderStep1() {
    return html`
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Cart Items</h5>
        </div>
        <div class="card-body">
          ${this.cart.map(item => html`
            <div class="d-flex align-items-center border-bottom pb-3 mb-3">
              <div class="bg-light rounded me-3" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                <i class="bi bi-box" style="font-size: 2rem; color: #ccc;"></i>
              </div>
              <div class="flex-grow-1">
                <h6 class="mb-1">${item.name}</h6>
                <p class="text-muted small mb-0">SKU: ${item.sku} | Qty: ${item.quantity}</p>
              </div>
              <div class="text-end">
                <strong>${this.formatCurrency(item.total)}</strong>
              </div>
            </div>
          `)}
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between">
            <button class="btn btn-outline-secondary" @click=${() => window.location.pathname = '/b2b-store/cart'}>
              <i class="bi bi-arrow-left me-2"></i>Edit Cart
            </button>
            <button class="btn btn-primary" @click=${() => this.step = 2}>
              Continue <i class="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderStep2() {
    return html`
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Shipping & Order Information</h5>
        </div>
        <div class="card-body">
          <!-- Shipping Address -->
          <div class="mb-4">
            <label class="form-label fw-bold">Shipping Address</label>
            ${this.company?.shippingAddresses?.map(addr => html`
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" 
                       name="shippingAddress" 
                       id="addr-${addr.id}"
                       .checked=${this.formData.shippingAddressId === addr.id}
                       @change=${() => this.handleInputChange('shippingAddressId', addr.id)}>
                <label class="form-check-label" for="addr-${addr.id}">
                  <strong>${addr.name || 'Unnamed Location'}</strong>
                  ${addr.isDefault ? html`<span class="badge bg-primary ms-2">Default</span>` : ''}
                  <br>
                  <small>${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}</small>
                </label>
              </div>
            `)}
          </div>

          <!-- PO Number -->
          <div class="mb-3">
            <label class="form-label">Your PO Number (Optional)</label>
            <input type="text" class="form-control"
                   .value=${this.formData.customerPONumber}
                   @input=${(e) => this.handleInputChange('customerPONumber', e.target.value)}
                   placeholder="Enter your purchase order number" />
          </div>

          <!-- Shipping Method -->
          <div class="mb-3">
            <label class="form-label">Shipping Method</label>
            <select class="form-select"
                    .value=${this.formData.shippingMethod}
                    @change=${(e) => this.handleInputChange('shippingMethod', e.target.value)}>
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
                      @input=${(e) => this.handleInputChange('notes', e.target.value)}
                      placeholder="Special instructions..."></textarea>
          </div>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between">
            <button class="btn btn-outline-secondary" @click=${() => this.step = 1}>
              <i class="bi bi-arrow-left me-2"></i>Back
            </button>
            <button class="btn btn-primary" @click=${() => this.step = 3}>
              Continue <i class="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderStep3() {
    const selectedAddress = this.company?.shippingAddresses?.find(a => a.id === this.formData.shippingAddressId);
    
    return html`
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
          ${selectedAddress ? html`
            <address class="mb-4">
              <strong>${selectedAddress.name}</strong><br>
              ${selectedAddress.street}<br>
              ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}<br>
              ${selectedAddress.country}
            </address>
          ` : ''}

          <!-- PO Number -->
          ${this.formData.customerPONumber ? html`
            <h6 class="mb-3">Your PO Number</h6>
            <p class="mb-4"><code>${this.formData.customerPONumber}</code></p>
          ` : ''}

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
                ${this.cart.map(item => html`
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td class="text-end">${this.formatCurrency(item.price)}</td>
                    <td class="text-end">${this.formatCurrency(item.total)}</td>
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
            <button class="btn btn-outline-secondary" @click=${() => this.step = 2}>
              <i class="bi bi-arrow-left me-2"></i>Back
            </button>
            <button class="btn btn-success btn-lg" 
                    @click=${this.handleSubmitOrder}
                    ?disabled=${this.processing}>
              ${this.processing ? html`
                <span class="spinner-border spinner-border-sm me-2"></span>Submitting...
              ` : html`
                <i class="bi bi-check-circle me-2"></i>Submit Order
              `}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('checkout-component', Checkout);
