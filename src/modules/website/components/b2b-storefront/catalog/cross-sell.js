/**
 * Cross-Sell Component - Frequently Bought Together
 */

import { LitElement, html } from 'lit';

class CrossSell extends LitElement {
  static properties = {
    currentProduct: { type: Object },
    crossSellProducts: { type: Array },
    loading: { type: Boolean }
  };

  constructor() {
    super();
    this.currentProduct = null;
    this.crossSellProducts = [];
    this.loading = false;
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.currentProduct) {
      await this.loadCrossSellProducts();
    }
  }

  async loadCrossSellProducts() {
    this.loading = true;
    try {
      // Mock cross-sell logic - in real app, this would come from API
      // based on purchase history, category, tags, etc.
      this.crossSellProducts = this.generateCrossSellProducts();
    } catch (err) {
      console.error('Failed to load cross-sell products:', err);
    } finally {
      this.loading = false;
    }
  }

  generateCrossSellProducts() {
    // Mock data - frequently bought together
    const mockProducts = [
      {
        id: 101,
        name: 'Wireless Mouse',
        price: 29.99,
        image: null,
        reason: 'Customers who bought this also bought'
      },
      {
        id: 102,
        name: 'USB-C Cable',
        price: 14.99,
        image: null,
        reason: 'Perfect complement'
      },
      {
        id: 103,
        name: 'Laptop Stand',
        price: 49.99,
        image: null,
        reason: 'Frequently bought together'
      }
    ];
    return mockProducts.slice(0, 3);
  }

  handleAddToCart(product) {
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: { product, quantity: 1 },
      bubbles: true,
      composed: true
    }));
  }

  handleAddToCompare(product) {
    window.dispatchEvent(new CustomEvent('add-to-compare', {
      detail: { product }
    }));
  }

  handleAddAllToCart() {
    const allProducts = [this.currentProduct, ...this.crossSellProducts];
    this.dispatchEvent(new CustomEvent('add-bundle-to-cart', {
      detail: { products: allProducts },
      bubbles: true,
      composed: true
    }));
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  get totalBundlePrice() {
    const currentPrice = this.currentProduct?.price || 0;
    const crossSellTotal = this.crossSellProducts.reduce((sum, p) => sum + p.price, 0);
    return currentPrice + crossSellTotal;
  }

  get bundleSavings() {
    // Mock 10% savings on bundle
    return this.totalBundlePrice * 0.1;
  }

  render() {
    if (!this.currentProduct || this.crossSellProducts.length === 0) {
      return html``;
    }

    return html`
      <div class="card border-success mt-4">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0">
            <i class="bi bi-cart-plus me-2"></i>Frequently Bought Together
          </h5>
        </div>
        <div class="card-body">
          <!-- Bundle Items -->
          <div class="row align-items-center mb-3">
            <!-- Current Product -->
            <div class="col-md-3 text-center mb-3">
              <div class="bg-light rounded p-3 mb-2" style="height: 120px; display: flex; align-items: center; justify-content: center;">
                <i class="bi bi-box" style="font-size: 3rem; color: #0d6efd;"></i>
              </div>
              <h6 class="small fw-bold">${this.currentProduct.name}</h6>
              <p class="text-primary fw-bold mb-0">${this.formatCurrency(this.currentProduct.price)}</p>
              <small class="text-success"><i class="bi bi-check-circle-fill me-1"></i>This item</small>
            </div>

            ${this.crossSellProducts.map((product, index) => html`
              ${index === 0 ? html`
                <div class="col-auto text-center mb-3">
                  <i class="bi bi-plus-lg" style="font-size: 2rem; color: #6c757d;"></i>
                </div>
              ` : html`
                <div class="col-auto text-center mb-3">
                  <i class="bi bi-plus-lg" style="font-size: 2rem; color: #6c757d;"></i>
                </div>
              `}
              
              <div class="col-md-2 text-center mb-3">
                <div class="bg-light rounded p-3 mb-2" style="height: 120px; display: flex; align-items: center; justify-content: center;">
                  <i class="bi bi-box" style="font-size: 2.5rem; color: #6c757d;"></i>
                </div>
                <h6 class="small">${product.name}</h6>
                <p class="text-primary fw-bold mb-0">${this.formatCurrency(product.price)}</p>
                <div class="d-flex gap-1 justify-content-center mt-1">
                  <button class="btn btn-sm btn-outline-primary" 
                          @click=${() => this.handleAddToCart(product)}
                          title="Add to Cart">
                    <i class="bi bi-plus"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-info" 
                          @click=${() => this.handleAddToCompare(product)}
                          title="Add to Compare">
                    <i class="bi bi-clipboard-check"></i>
                  </button>
                </div>
              </div>
            `)}
          </div>

          <!-- Bundle Pricing -->
          <div class="alert alert-info mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>Bundle Price:</strong>
                <span class="text-decoration-line-through text-muted ms-2">
                  ${this.formatCurrency(this.totalBundlePrice)}
                </span>
                <span class="text-success fw-bold fs-5 ms-2">
                  ${this.formatCurrency(this.totalBundlePrice - this.bundleSavings)}
                </span>
              </div>
              <div>
                <span class="badge bg-success fs-6">
                  Save ${this.formatCurrency(this.bundleSavings)}
                </span>
              </div>
            </div>
          </div>

          <!-- Add All to Cart Button -->
          <button class="btn btn-success btn-lg w-100" @click=${this.handleAddAllToCart}>
            <i class="bi bi-cart-check me-2"></i>
            Add All ${this.crossSellProducts.length + 1} Items to Cart
          </button>
          
          <p class="text-center text-muted small mt-2 mb-0">
            <i class="bi bi-info-circle me-1"></i>
            Based on customer purchase patterns
          </p>
        </div>
      </div>
    `;
  }
}

customElements.define('cross-sell', CrossSell);
