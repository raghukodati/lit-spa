/**
 * B2B Product Details Page
 */

import { LitElement, html } from 'lit';
import { getProductById } from '../../../../website/services/product.service.js';
import './cross-sell.js';
import './upsell.js';
import './product-compare.js';

class ProductDetails extends LitElement {
  static properties = {
    product: { type: Object },
    loading: { type: Boolean },
    quantity: { type: Number },
    cart: { type: Array },
    selectedImage: { type: String }
  };

  constructor() {
    super();
    this.product = null;
    this.loading = true;
    this.quantity = 1;
    this.cart = JSON.parse(localStorage.getItem('b2b-cart') || '[]');
    this.selectedImage = null;
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadProduct();
  }

  async loadProduct() {
    this.loading = true;
    try {
      // Get product ID from URL
      const pathParts = window.location.pathname.split('/');
      const productId = pathParts[pathParts.length - 1];
      
      this.product = await getProductById(productId);
      if (this.product) {
        this.selectedImage = this.product.featuredImage;
      }
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      this.loading = false;
    }
  }

  handleQuantityChange(e) {
    const value = parseInt(e.target.value);
    this.quantity = value > 0 ? value : 1;
  }

  handleAddToCart() {
    if (!this.product) return;

    const cartItem = {
      productId: this.product.id,
      name: this.product.name,
      sku: this.product.sku,
      price: this.product.price,
      quantity: this.quantity,
      total: this.product.price * this.quantity
    };

    const existingIndex = this.cart.findIndex(item => item.productId === this.product.id);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += this.quantity;
      this.cart[existingIndex].total = this.cart[existingIndex].price * this.cart[existingIndex].quantity;
    } else {
      this.cart.push(cartItem);
    }

    localStorage.setItem('b2b-cart', JSON.stringify(this.cart));
    this.requestUpdate();
    
    // Show success message
    alert(`Added ${this.quantity} × ${this.product.name} to cart`);
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  get totalPrice() {
    return this.product ? this.product.price * this.quantity : 0;
  }

  get cartItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  render() {
    if (this.loading) {
      return html`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading product...</p>
          </div>
        </div>
      `;
    }

    if (!this.product) {
      return html`
        <div class="container-fluid mt-4">
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #dc3545;"></i>
              <h3 class="mt-3">Product Not Found</h3>
              <p class="text-muted">The product you're looking for doesn't exist.</p>
              <button class="btn btn-primary mt-3" @click=${() => window.location.pathname = '/b2b-store/catalog'}>
                <i class="bi bi-arrow-left me-2"></i>Back to Catalog
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container-fluid mt-4">
        <!-- Breadcrumb & Cart -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="/b2b-store" class="text-decoration-none">B2B Store</a></li>
              <li class="breadcrumb-item"><a href="/b2b-store/catalog" class="text-decoration-none">Catalog</a></li>
              <li class="breadcrumb-item active" aria-current="page">${this.product.name}</li>
            </ol>
          </nav>
          <button class="btn btn-outline-primary position-relative" @click=${() => window.location.pathname = '/b2b-store/cart'}>
            <i class="bi bi-cart3 me-2"></i>Cart
            ${this.cartItemCount > 0 ? html`
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                ${this.cartItemCount}
              </span>
            ` : ''}
          </button>
        </div>

        <div class="row">
          <!-- Product Image -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <div class="bg-light rounded mb-3" style="height: 400px; display: flex; align-items: center; justify-content: center;">
                  ${this.selectedImage ? html`
                    <img src="${this.selectedImage}" alt="${this.product.name}" class="img-fluid" style="max-height: 380px;" />
                  ` : html`
                    <i class="bi bi-box" style="font-size: 8rem; color: #ccc;"></i>
                  `}
                </div>
                ${this.product.status === 'active' && this.product.stock > 0 ? html`
                  <div class="d-flex gap-2 justify-content-center">
                    <span class="badge ${this.product.stock > 10 ? 'bg-success' : 'bg-warning text-dark'}">
                      <i class="bi bi-check-circle me-1"></i>
                      ${this.product.stock > 10 ? 'In Stock' : 'Low Stock'} (${this.product.stock} units)
                    </span>
                  </div>
                ` : html`
                  <div class="text-center">
                    <span class="badge bg-danger">Out of Stock</span>
                  </div>
                `}
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <div class="mb-2">
                  <span class="badge bg-primary">${this.product.category}</span>
                  ${this.product.brand ? html`
                    <span class="badge bg-secondary ms-2">${this.product.brand}</span>
                  ` : ''}
                </div>
                
                <h2 class="mb-3">${this.product.name}</h2>
                
                <div class="mb-3">
                  <p class="text-muted mb-1">SKU: <code>${this.product.sku}</code></p>
                  ${this.product.subcategory ? html`
                    <p class="text-muted mb-0">Category: ${this.product.subcategory}</p>
                  ` : ''}
                </div>

                ${this.product.description ? html`
                  <p class="mb-4">${this.product.description}</p>
                ` : ''}

                <!-- Price -->
                <div class="mb-4 pb-4 border-bottom">
                  <div class="d-flex align-items-baseline gap-3">
                    <h3 class="text-primary mb-0">${this.formatCurrency(this.product.price)}</h3>
                    ${this.product.compareAtPrice && this.product.compareAtPrice > this.product.price ? html`
                      <span class="text-muted text-decoration-line-through">${this.formatCurrency(this.product.compareAtPrice)}</span>
                      <span class="badge bg-success">
                        ${Math.round((1 - this.product.price / this.product.compareAtPrice) * 100)}% OFF
                      </span>
                    ` : ''}
                  </div>
                  <small class="text-muted">Price per unit</small>
                </div>

                <!-- Quantity & Add to Cart -->
                ${this.product.stock > 0 ? html`
                  <div class="mb-3">
                    <label class="form-label fw-bold">Quantity</label>
                    <div class="input-group input-group-lg mb-3">
                      <button class="btn btn-outline-secondary" @click=${() => {
                        if (this.quantity > 1) this.quantity--;
                      }}>
                        <i class="bi bi-dash"></i>
                      </button>
                      <input 
                        type="number" 
                        class="form-control text-center" 
                        .value=${this.quantity}
                        min="1"
                        max="${this.product.stock}"
                        @input=${this.handleQuantityChange}
                      >
                      <button class="btn btn-outline-secondary" @click=${() => {
                        if (this.quantity < this.product.stock) this.quantity++;
                      }}>
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                    
                    <div class="alert alert-info d-flex justify-content-between align-items-center">
                      <span><strong>Total:</strong></span>
                      <span class="h4 mb-0">${this.formatCurrency(this.totalPrice)}</span>
                    </div>

                    <button class="btn btn-primary btn-lg w-100 mb-2" @click=${this.handleAddToCart}>
                      <i class="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>

                    <div class="d-grid gap-2 mb-3">
                      <button class="btn btn-outline-info" @click=${() => {
                        window.dispatchEvent(new CustomEvent('add-to-compare', {
                          detail: { product: this.product }
                        }));
                      }}>
                        <i class="bi bi-clipboard-check me-2"></i>Add to Compare
                      </button>
                    </div>

                    <div class="d-grid gap-2">
                      <button class="btn btn-outline-secondary" @click=${() => window.location.pathname = '/b2b-store/catalog'}>
                        <i class="bi bi-arrow-left me-2"></i>Continue Shopping
                      </button>
                    </div>
                  </div>
                ` : html`
                  <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    This product is currently out of stock
                  </div>
                  <button class="btn btn-outline-secondary w-100" @click=${() => window.location.pathname = '/b2b-store/catalog'}>
                    <i class="bi bi-arrow-left me-2"></i>Back to Catalog
                  </button>
                `}
              </div>
            </div>

            <!-- Additional Info -->
            ${this.product.tags && this.product.tags.length > 0 ? html`
              <div class="card mt-3">
                <div class="card-header">
                  <h6 class="mb-0">Product Tags</h6>
                </div>
                <div class="card-body">
                  ${this.product.tags.map(tag => html`
                    <span class="badge bg-light text-dark me-1 mb-1">#${tag}</span>
                  `)}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Product Features -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Product Details</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <h6>Product Information</h6>
                    <table class="table table-sm">
                      <tbody>
                        <tr>
                          <th>SKU:</th>
                          <td><code>${this.product.sku}</code></td>
                        </tr>
                        <tr>
                          <th>Category:</th>
                          <td>${this.product.category}</td>
                        </tr>
                        ${this.product.subcategory ? html`
                          <tr>
                            <th>Subcategory:</th>
                            <td>${this.product.subcategory}</td>
                          </tr>
                        ` : ''}
                        ${this.product.brand ? html`
                          <tr>
                            <th>Brand:</th>
                            <td>${this.product.brand}</td>
                          </tr>
                        ` : ''}
                        <tr>
                          <th>Availability:</th>
                          <td>
                            ${this.product.stock > 0 ? html`
                              <span class="badge ${this.product.stock > 10 ? 'bg-success' : 'bg-warning text-dark'}">
                                ${this.product.stock} units available
                              </span>
                            ` : html`
                              <span class="badge bg-danger">Out of Stock</span>
                            `}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="col-md-6">
                    <h6>Shipping & Returns</h6>
                    <ul class="list-unstyled">
                      <li class="mb-2"><i class="bi bi-truck text-success me-2"></i>Free shipping on orders over $500</li>
                      <li class="mb-2"><i class="bi bi-arrow-clockwise text-primary me-2"></i>30-day return policy</li>
                      <li class="mb-2"><i class="bi bi-shield-check text-info me-2"></i>1-year warranty included</li>
                      <li class="mb-2"><i class="bi bi-headset text-warning me-2"></i>24/7 customer support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cross-Sell: Frequently Bought Together -->
        <div class="row mt-4">
          <div class="col-12">
            <cross-sell .currentProduct=${this.product}></cross-sell>
          </div>
        </div>

        <!-- Upsell: Consider Upgrading -->
        <div class="row mt-4">
          <div class="col-12">
            <upsell-products .currentProduct=${this.product}></upsell-products>
          </div>
        </div>
      </div>

      <!-- Product Compare Component -->
      <product-compare></product-compare>
    `;
  }
}

customElements.define('product-details', ProductDetails);
