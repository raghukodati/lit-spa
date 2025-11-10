/**
 * B2B Shopping Cart Component
 */

import { LitElement, html } from 'lit';

class ShoppingCart extends LitElement {
  static properties = {
    cart: { type: Array },
    loading: { type: Boolean }
  };

  constructor() {
    super();
    this.cart = JSON.parse(localStorage.getItem('b2b-cart') || '[]');
    this.loading = false;
  }

  createRenderRoot() {
    return this;
  }

  handleUpdateQuantity(index, quantity) {
    if (quantity <= 0) {
      this.handleRemoveItem(index);
      return;
    }
    
    this.cart[index].quantity = quantity;
    this.cart[index].total = this.cart[index].price * quantity;
    this.saveCart();
  }

  handleRemoveItem(index) {
    if (confirm('Remove this item from cart?')) {
      this.cart.splice(index, 1);
      this.saveCart();
    }
  }

  handleClearCart() {
    if (confirm('Clear entire cart?')) {
      this.cart = [];
      this.saveCart();
    }
  }

  saveCart() {
    localStorage.setItem('b2b-cart', JSON.stringify(this.cart));
    this.requestUpdate();
  }

  get cartSummary() {
    const subtotal = this.cart.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over $500
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
    const summary = this.cartSummary;

    return html`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">Shopping Cart</h2>
            <p class="text-muted mb-0">${this.cart.length} item${this.cart.length !== 1 ? 's' : ''} in cart</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary" @click=${() => window.location.pathname = '/b2b-store/catalog'}>
              <i class="bi bi-arrow-left me-2"></i>Continue Shopping
            </button>
            ${this.cart.length > 0 ? html`
              <button class="btn btn-outline-danger" @click=${this.handleClearCart}>
                <i class="bi bi-trash me-2"></i>Clear Cart
              </button>
            ` : ''}
          </div>
        </div>

        ${this.cart.length === 0 ? html`
          <!-- Empty Cart -->
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-cart-x" style="font-size: 4rem; color: #ccc;"></i>
              <h4 class="mt-3">Your Cart is Empty</h4>
              <p class="text-muted">Start adding products to your cart</p>
              <div class="mt-4">
                <button class="btn btn-primary me-2" @click=${() => window.location.pathname = '/b2b-store/catalog'}>
                  Browse Catalog
                </button>
                <button class="btn btn-outline-primary" @click=${() => window.location.pathname = '/b2b-store/quick-order'}>
                  Quick Order
                </button>
              </div>
            </div>
          </div>
        ` : html`
          <div class="row">
            <!-- Cart Items -->
            <div class="col-lg-8">
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Cart Items</h5>
                </div>
                <div class="card-body">
                  ${this.cart.map((item, index) => html`
                    <div class="d-flex align-items-center border-bottom pb-3 mb-3">
                      <div class="bg-light rounded me-3" style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                        <i class="bi bi-box" style="font-size: 2.5rem; color: #ccc;"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="text-muted small mb-1">SKU: ${item.sku}</p>
                        <p class="mb-0"><strong>${this.formatCurrency(item.price)}</strong> each</p>
                      </div>
                      <div class="d-flex align-items-center gap-3">
                        <div class="input-group" style="width: 140px;">
                          <button class="btn btn-outline-secondary btn-sm" 
                                  @click=${() => this.handleUpdateQuantity(index, item.quantity - 1)}>
                            <i class="bi bi-dash"></i>
                          </button>
                          <input type="number" class="form-control form-control-sm text-center" 
                                 .value=${item.quantity}
                                 @change=${(e) => this.handleUpdateQuantity(index, parseInt(e.target.value) || 1)}
                                 min="1" />
                          <button class="btn btn-outline-secondary btn-sm"
                                  @click=${() => this.handleUpdateQuantity(index, item.quantity + 1)}>
                            <i class="bi bi-plus"></i>
                          </button>
                        </div>
                        <div style="width: 100px;" class="text-end">
                          <strong>${this.formatCurrency(item.total)}</strong>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" @click=${() => this.handleRemoveItem(index)}>
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  `)}
                </div>
              </div>

              <!-- Additional Options -->
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">Order Options</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">PO Number (Optional)</label>
                    <input type="text" class="form-control" placeholder="Enter your PO number" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Order Notes</label>
                    <textarea class="form-control" rows="3" placeholder="Special instructions for this order..."></textarea>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="saveForLater">
                    <label class="form-check-label" for="saveForLater">
                      Save this order as a template for future orders
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="col-lg-4">
              <div class="card sticky-top" style="top: 20px;">
                <div class="card-header bg-primary text-white">
                  <h5 class="mb-0">Order Summary</h5>
                </div>
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <strong>${this.formatCurrency(summary.subtotal)}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Tax (8%):</span>
                    <strong>${this.formatCurrency(summary.tax)}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-3">
                    <span>Shipping:</span>
                    <strong>${summary.shipping === 0 ? html`<span class="text-success">FREE</span>` : this.formatCurrency(summary.shipping)}</strong>
                  </div>
                  ${summary.subtotal < 500 ? html`
                    <div class="alert alert-info small mb-3">
                      <i class="bi bi-info-circle me-1"></i>
                      Add ${this.formatCurrency(500 - summary.subtotal)} more for free shipping
                    </div>
                  ` : ''}
                  <hr>
                  <div class="d-flex justify-content-between mb-3">
                    <strong class="fs-5">Total:</strong>
                    <strong class="fs-5 text-primary">${this.formatCurrency(summary.total)}</strong>
                  </div>
                  
                  <div class="d-grid gap-2">
                    <button class="btn btn-primary btn-lg" @click=${() => window.location.pathname = '/b2b-store/checkout'}>
                      <i class="bi bi-check-circle me-2"></i>Proceed to Checkout
                    </button>
                    <button class="btn btn-outline-secondary" @click=${() => window.location.pathname = '/b2b-store/quotes/request'}>
                      <i class="bi bi-file-earmark-text me-2"></i>Request Quote Instead
                    </button>
                  </div>
                </div>
                
                <div class="card-footer bg-light">
                  <div class="small">
                    <div class="mb-2">
                      <i class="bi bi-shield-check text-success me-2"></i>
                      <strong>Secure Checkout</strong>
                    </div>
                    <div class="mb-2">
                      <i class="bi bi-truck text-primary me-2"></i>
                      <strong>Fast Delivery</strong>
                    </div>
                    <div>
                      <i class="bi bi-arrow-repeat text-info me-2"></i>
                      <strong>Easy Returns</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `}
      </div>
    `;
  }
}

customElements.define('b2b-shopping-cart', ShoppingCart);
