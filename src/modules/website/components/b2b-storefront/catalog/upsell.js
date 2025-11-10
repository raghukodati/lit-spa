/**
 * Upsell Component - Premium/Better Alternatives
 */

import { LitElement, html } from 'lit';

class Upsell extends LitElement {
  static properties = {
    currentProduct: { type: Object },
    upsellProducts: { type: Array },
    loading: { type: Boolean }
  };

  constructor() {
    super();
    this.currentProduct = null;
    this.upsellProducts = [];
    this.loading = false;
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.currentProduct) {
      await this.loadUpsellProducts();
    }
  }

  async loadUpsellProducts() {
    this.loading = true;
    try {
      // Mock upsell logic - in real app, this would come from API
      // based on category, price range, features, etc.
      this.upsellProducts = this.generateUpsellProducts();
    } catch (err) {
      console.error('Failed to load upsell products:', err);
    } finally {
      this.loading = false;
    }
  }

  generateUpsellProducts() {
    // Mock data - premium alternatives
    const mockProducts = [
      {
        id: 201,
        name: 'Professional Laptop Pro',
        price: 1599.99,
        compareAtPrice: 1799.99,
        features: ['16GB RAM', '1TB SSD', 'Intel i9', '4K Display'],
        badge: 'Most Popular',
        badgeColor: 'primary',
        image: null
      },
      {
        id: 202,
        name: 'Professional Laptop Premium',
        price: 1899.99,
        compareAtPrice: 2199.99,
        features: ['32GB RAM', '2TB SSD', 'Intel i9', '4K OLED'],
        badge: 'Best Value',
        badgeColor: 'success',
        image: null
      },
      {
        id: 203,
        name: 'Professional Laptop Ultimate',
        price: 2299.99,
        compareAtPrice: 2599.99,
        features: ['64GB RAM', '4TB SSD', 'Intel i9', '4K OLED Touch'],
        badge: 'Premium',
        badgeColor: 'warning',
        image: null
      }
    ];
    return mockProducts;
  }

  handleSelectProduct(product) {
    this.dispatchEvent(new CustomEvent('product-selected', {
      detail: { product },
      bubbles: true,
      composed: true
    }));
    
    // Navigate to product details
    window.location.pathname = `/b2b-store/product/${product.id}`;
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

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  calculateSavings(product) {
    if (product.compareAtPrice && product.compareAtPrice > product.price) {
      return product.compareAtPrice - product.price;
    }
    return 0;
  }

  render() {
    if (!this.currentProduct || this.upsellProducts.length === 0) {
      return html``;
    }

    return html`
      <div class="card border-primary mt-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">
            <i class="bi bi-arrow-up-circle me-2"></i>Consider Upgrading
          </h5>
          <small>Better performance, more features, greater value</small>
        </div>
        <div class="card-body">
          <div class="row">
            ${this.upsellProducts.map(product => html`
              <div class="col-md-4 mb-3">
                <div class="card h-100 border-2 ${product.badge === 'Best Value' ? 'border-success shadow' : ''}">
                  ${product.badge ? html`
                    <div class="card-header bg-${product.badgeColor} text-white text-center py-2">
                      <strong>${product.badge}</strong>
                    </div>
                  ` : ''}
                  
                  <div class="card-body">
                    <!-- Product Image -->
                    <div class="bg-light rounded mb-3" style="height: 150px; display: flex; align-items: center; justify-content: center;">
                      <i class="bi bi-laptop" style="font-size: 4rem; color: #0d6efd;"></i>
                    </div>

                    <!-- Product Name -->
                    <h6 class="fw-bold mb-2">${product.name}</h6>

                    <!-- Pricing -->
                    <div class="mb-3">
                      <div class="d-flex align-items-baseline gap-2">
                        <span class="h4 text-primary mb-0">${this.formatCurrency(product.price)}</span>
                        ${product.compareAtPrice ? html`
                          <span class="text-muted text-decoration-line-through small">
                            ${this.formatCurrency(product.compareAtPrice)}
                          </span>
                        ` : ''}
                      </div>
                      ${this.calculateSavings(product) > 0 ? html`
                        <span class="badge bg-success">
                          Save ${this.formatCurrency(this.calculateSavings(product))}
                        </span>
                      ` : ''}
                    </div>

                    <!-- Features -->
                    ${product.features ? html`
                      <ul class="list-unstyled small mb-3">
                        ${product.features.map(feature => html`
                          <li class="mb-1">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            ${feature}
                          </li>
                        `)}
                      </ul>
                    ` : ''}

                    <!-- Price Difference -->
                    ${this.currentProduct.price ? html`
                      <div class="alert alert-info small mb-3">
                        <i class="bi bi-info-circle me-1"></i>
                        Only <strong>${this.formatCurrency(product.price - this.currentProduct.price)}</strong> more
                      </div>
                    ` : ''}

                    <!-- Actions -->
                    <div class="d-grid gap-2">
                      <button class="btn btn-primary" @click=${() => this.handleSelectProduct(product)}>
                        <i class="bi bi-arrow-right-circle me-2"></i>Choose This
                      </button>
                      <button class="btn btn-sm btn-outline-primary" @click=${() => this.handleAddToCart(product)}>
                        <i class="bi bi-cart-plus me-2"></i>Add to Cart
                      </button>
                      <button class="btn btn-sm btn-outline-info" @click=${() => this.handleAddToCompare(product)}>
                        <i class="bi bi-clipboard-check me-2"></i>Add to Compare
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `)}
          </div>

          <!-- Why Upgrade Section -->
          <div class="alert alert-light mt-3">
            <h6 class="fw-bold">
              <i class="bi bi-lightbulb me-2 text-warning"></i>
              Why Consider Upgrading?
            </h6>
            <ul class="mb-0 small">
              <li>Better performance for demanding tasks</li>
              <li>Future-proof your investment</li>
              <li>Enhanced features and capabilities</li>
              <li>Greater long-term value</li>
            </ul>
          </div>

          <!-- Comparison Link -->
          <div class="text-center mt-3">
            <button class="btn btn-link" @click=${() => this.dispatchEvent(new CustomEvent('show-comparison'))}>
              <i class="bi bi-columns-gap me-2"></i>
              Compare All Options Side-by-Side
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('upsell-products', Upsell);
