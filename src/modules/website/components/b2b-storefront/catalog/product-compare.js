/**
 * Product Compare Component - Side-by-side product comparison
 */

import { LitElement, html } from 'lit';

class ProductCompare extends LitElement {
  static properties = {
    compareProducts: { type: Array },
    showCompareBar: { type: Boolean },
    showCompareModal: { type: Boolean }
  };

  constructor() {
    super();
    this.compareProducts = this.loadCompareList();
    this.showCompareBar = this.compareProducts.length > 0;
    this.showCompareModal = false;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    // Listen for compare events
    window.addEventListener('add-to-compare', this.handleAddToCompare.bind(this));
    window.addEventListener('remove-from-compare', this.handleRemoveFromCompare.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('add-to-compare', this.handleAddToCompare.bind(this));
    window.removeEventListener('remove-from-compare', this.handleRemoveFromCompare.bind(this));
  }

  loadCompareList() {
    try {
      const stored = localStorage.getItem('product-compare');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveCompareList() {
    localStorage.setItem('product-compare', JSON.stringify(this.compareProducts));
    this.showCompareBar = this.compareProducts.length > 0;
  }

  handleAddToCompare(event) {
    const product = event.detail?.product;
    if (!product) return;

    // Check if already in compare list
    if (this.compareProducts.find(p => p.id === product.id)) {
      alert('Product already in compare list');
      return;
    }

    // Limit to 4 products
    if (this.compareProducts.length >= 4) {
      alert('Maximum 4 products can be compared. Please remove one first.');
      return;
    }

    this.compareProducts = [...this.compareProducts, product];
    this.saveCompareList();
    this.requestUpdate();
  }

  handleRemoveFromCompare(event) {
    const productId = event.detail?.productId;
    if (!productId) return;

    this.compareProducts = this.compareProducts.filter(p => p.id !== productId);
    this.saveCompareList();
    this.requestUpdate();
  }

  removeProduct(productId) {
    this.compareProducts = this.compareProducts.filter(p => p.id !== productId);
    this.saveCompareList();
    if (this.compareProducts.length === 0) {
      this.showCompareModal = false;
    }
    this.requestUpdate();
  }

  clearAll() {
    if (confirm('Remove all products from comparison?')) {
      this.compareProducts = [];
      this.saveCompareList();
      this.showCompareModal = false;
      this.requestUpdate();
    }
  }

  openComparison() {
    if (this.compareProducts.length < 2) {
      alert('Please add at least 2 products to compare');
      return;
    }
    this.showCompareModal = true;
    this.requestUpdate();
  }

  closeComparison() {
    this.showCompareModal = false;
    this.requestUpdate();
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getCommonAttributes() {
    if (this.compareProducts.length === 0) return [];
    
    // Extract common comparison attributes
    return [
      { key: 'name', label: 'Product Name', type: 'text' },
      { key: 'sku', label: 'SKU', type: 'text' },
      { key: 'price', label: 'Price', type: 'currency' },
      { key: 'compareAtPrice', label: 'MSRP', type: 'currency' },
      { key: 'stock', label: 'Stock', type: 'number' },
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'subcategory', label: 'Subcategory', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' }
    ];
  }

  formatValue(value, type) {
    if (!value && value !== 0) return '-';
    
    switch (type) {
      case 'currency':
        return this.formatCurrency(value);
      case 'number':
        return value.toLocaleString();
      case 'boolean':
        return value ? '✓' : '✗';
      default:
        return value;
    }
  }

  getBestValue(attribute) {
    if (attribute.type === 'currency') {
      // For price, lower is better
      const prices = this.compareProducts.map(p => p[attribute.key]).filter(p => p);
      return Math.min(...prices);
    } else if (attribute.type === 'number') {
      // For stock, higher is better
      const values = this.compareProducts.map(p => p[attribute.key]).filter(v => v);
      return Math.max(...values);
    }
    return null;
  }

  isBestValue(product, attribute) {
    const bestValue = this.getBestValue(attribute);
    if (bestValue === null) return false;
    return product[attribute.key] === bestValue;
  }

  handleAddToCart(product) {
    window.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: { product, quantity: 1 }
    }));
  }

  render() {
    return html`
      <!-- Compare Bar (Fixed Bottom) -->
      ${this.showCompareBar && this.compareProducts.length > 0 ? html`
        <div class="compare-bar position-fixed bottom-0 start-0 end-0 bg-dark text-white shadow-lg" 
             style="z-index: 1040; padding: 15px 0;">
          <div class="container-fluid">
            <div class="row align-items-center">
              <div class="col-md-8">
                <div class="d-flex align-items-center gap-3">
                  <h6 class="mb-0">
                    <i class="bi bi-clipboard-check me-2"></i>
                    Compare Products (${this.compareProducts.length}/4)
                  </h6>
                  <div class="d-flex gap-2 flex-wrap">
                    ${this.compareProducts.map(product => html`
                      <div class="badge bg-primary d-flex align-items-center gap-2 py-2 px-3">
                        <span>${product.name}</span>
                        <button class="btn btn-sm btn-link text-white p-0" 
                                @click=${() => this.removeProduct(product.id)}
                                title="Remove">
                          <i class="bi bi-x-lg"></i>
                        </button>
                      </div>
                    `)}
                  </div>
                </div>
              </div>
              <div class="col-md-4 text-end">
                <button class="btn btn-success me-2" 
                        @click=${this.openComparison}
                        ?disabled=${this.compareProducts.length < 2}>
                  <i class="bi bi-columns-gap me-2"></i>
                  Compare Now
                </button>
                <button class="btn btn-outline-light" @click=${this.clearAll}>
                  <i class="bi bi-trash me-2"></i>Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Compare Modal -->
      ${this.showCompareModal ? html`
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header bg-primary text-white">
                <h5 class="modal-title">
                  <i class="bi bi-columns-gap me-2"></i>
                  Product Comparison
                </h5>
                <button type="button" class="btn-close btn-close-white" @click=${this.closeComparison}></button>
              </div>
              <div class="modal-body p-0">
                <div class="table-responsive">
                  <table class="table table-bordered table-hover mb-0">
                    <thead class="table-light sticky-top">
                      <tr>
                        <th style="width: 200px;">Attribute</th>
                        ${this.compareProducts.map(product => html`
                          <th class="text-center" style="width: ${100 / this.compareProducts.length}%;">
                            <div class="d-flex flex-column align-items-center gap-2">
                              <div class="bg-light rounded p-3" style="height: 120px; width: 120px; display: flex; align-items: center; justify-content: center;">
                                <i class="bi bi-box" style="font-size: 3rem; color: #6c757d;"></i>
                              </div>
                              <button class="btn btn-sm btn-outline-danger" 
                                      @click=${() => this.removeProduct(product.id)}
                                      title="Remove from comparison">
                                <i class="bi bi-x-circle me-1"></i>Remove
                              </button>
                            </div>
                          </th>
                        `)}
                      </tr>
                    </thead>
                    <tbody>
                      ${this.getCommonAttributes().map(attribute => html`
                        <tr>
                          <td class="fw-bold bg-light">${attribute.label}</td>
                          ${this.compareProducts.map(product => {
                            const value = product[attribute.key];
                            const isBest = this.isBestValue(product, attribute);
                            return html`
                              <td class="text-center ${isBest ? 'table-success fw-bold' : ''}">
                                ${this.formatValue(value, attribute.type)}
                                ${isBest && (attribute.type === 'currency' || attribute.type === 'number') ? html`
                                  <i class="bi bi-star-fill text-warning ms-2" title="Best value"></i>
                                ` : ''}
                              </td>
                            `;
                          })}
                        </tr>
                      `)}
                      
                      <!-- Savings Row -->
                      <tr class="table-info">
                        <td class="fw-bold">Savings</td>
                        ${this.compareProducts.map(product => html`
                          <td class="text-center fw-bold">
                            ${product.compareAtPrice && product.compareAtPrice > product.price ? html`
                              <span class="text-success">
                                Save ${this.formatCurrency(product.compareAtPrice - product.price)}
                              </span>
                            ` : '-'}
                          </td>
                        `)}
                      </tr>

                      <!-- Availability Row -->
                      <tr>
                        <td class="fw-bold bg-light">Availability</td>
                        ${this.compareProducts.map(product => html`
                          <td class="text-center">
                            ${product.stock > 10 ? html`
                              <span class="badge bg-success">In Stock</span>
                            ` : product.stock > 0 ? html`
                              <span class="badge bg-warning text-dark">Low Stock (${product.stock})</span>
                            ` : html`
                              <span class="badge bg-danger">Out of Stock</span>
                            `}
                          </td>
                        `)}
                      </tr>

                      <!-- Actions Row -->
                      <tr class="table-light">
                        <td class="fw-bold">Actions</td>
                        ${this.compareProducts.map(product => html`
                          <td class="text-center">
                            <div class="d-grid gap-2">
                              <button class="btn btn-primary btn-sm" 
                                      @click=${() => this.handleAddToCart(product)}
                                      ?disabled=${product.stock === 0}>
                                <i class="bi bi-cart-plus me-1"></i>
                                Add to Cart
                              </button>
                              <button class="btn btn-outline-secondary btn-sm" 
                                      @click=${() => window.location.pathname = `/b2b-store/product/${product.id}`}>
                                <i class="bi bi-eye me-1"></i>
                                View Details
                              </button>
                            </div>
                          </td>
                        `)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="modal-footer">
                <div class="d-flex justify-content-between w-100">
                  <button class="btn btn-outline-danger" @click=${this.clearAll}>
                    <i class="bi bi-trash me-2"></i>Clear All
                  </button>
                  <button class="btn btn-secondary" @click=${this.closeComparison}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('product-compare', ProductCompare);
