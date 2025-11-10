/**
 * B2B Quick Order - Bulk Order Entry
 */

import { LitElement, html } from 'lit';
import { getProducts } from '../../../services/product.service.js';

class QuickOrder extends LitElement {
  static properties = {
    orderLines: { type: Array },
    products: { type: Array },
    loading: { type: Boolean }
  };

  constructor() {
    super();
    this.orderLines = [
      { sku: '', quantity: 1, product: null, error: '' },
      { sku: '', quantity: 1, product: null, error: '' },
      { sku: '', quantity: 1, product: null, error: '' },
      { sku: '', quantity: 1, product: null, error: '' },
      { sku: '', quantity: 1, product: null, error: '' }
    ];
    this.products = [];
    this.loading = false;
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadProducts();
  }

  async loadProducts() {
    this.loading = true;
    try {
      const result = await getProducts({ status: 'active' });
      this.products = result.data || [];
    } catch (err) {
      console.error('Failed to load products:', err);
      this.products = [];
    } finally {
      this.loading = false;
    }
  }

  handleSkuChange(index, sku) {
    this.orderLines[index].sku = sku.toUpperCase();
    this.orderLines[index].error = '';
    
    // Find product by SKU
    const product = this.products.find(p => p.sku === sku.toUpperCase());
    this.orderLines[index].product = product || null;
    
    if (sku && !product) {
      this.orderLines[index].error = 'Product not found';
    }
    
    this.requestUpdate();
  }

  handleQuantityChange(index, quantity) {
    this.orderLines[index].quantity = parseInt(quantity) || 1;
    this.requestUpdate();
  }

  handleAddLine() {
    this.orderLines.push({ sku: '', quantity: 1, product: null, error: '' });
    this.requestUpdate();
  }

  handleRemoveLine(index) {
    if (this.orderLines.length > 1) {
      this.orderLines.splice(index, 1);
      this.requestUpdate();
    }
  }

  handleClearAll() {
    if (confirm('Clear all lines?')) {
      this.orderLines = [{ sku: '', quantity: 1, product: null, error: '' }];
      this.requestUpdate();
    }
  }

  handleAddToCart() {
    const validLines = this.orderLines.filter(line => line.product && line.quantity > 0);
    
    if (validLines.length === 0) {
      alert('Please add valid products');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('b2b-cart') || '[]');
    
    validLines.forEach(line => {
      const cartItem = {
        productId: line.product.id,
        name: line.product.name,
        sku: line.product.sku,
        price: line.product.price,
        quantity: line.quantity,
        total: line.product.price * line.quantity
      };

      const existingIndex = cart.findIndex(item => item.productId === line.product.id);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += line.quantity;
        cart[existingIndex].total = cart[existingIndex].price * cart[existingIndex].quantity;
      } else {
        cart.push(cartItem);
      }
    });

    localStorage.setItem('b2b-cart', JSON.stringify(cart));
    alert(`Added ${validLines.length} item(s) to cart`);
    window.location.pathname = '/b2b-store/cart';
  }

  handlePasteFromExcel() {
    const text = prompt('Paste SKU and quantity data from Excel (format: SKU,Quantity per line):');
    if (!text) return;

    const lines = text.trim().split('\n');
    this.orderLines = lines.map(line => {
      const [sku, qty] = line.split(/[,\t]/);
      const product = this.products.find(p => p.sku === sku.trim().toUpperCase());
      return {
        sku: sku.trim().toUpperCase(),
        quantity: parseInt(qty) || 1,
        product: product || null,
        error: product ? '' : 'Product not found'
      };
    });

    this.requestUpdate();
  }

  get validLines() {
    return this.orderLines.filter(line => line.product && line.quantity > 0);
  }

  get orderTotal() {
    return this.validLines.reduce((sum, line) => sum + (line.product.price * line.quantity), 0);
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  render() {
    return html`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">Quick Order</h2>
            <p class="text-muted mb-0">Enter multiple SKUs for fast bulk ordering</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary" @click=${this.handlePasteFromExcel}>
              <i class="bi bi-file-earmark-spreadsheet me-2"></i>Paste from Excel
            </button>
            <button class="btn btn-outline-secondary" @click=${() => window.location.pathname = '/b2b-store/catalog'}>
              <i class="bi bi-arrow-left me-2"></i>Back to Catalog
            </button>
          </div>
        </div>

        <div class="row">
          <!-- Quick Order Form -->
          <div class="col-lg-8">
            <div class="card mb-4">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Order Lines</h5>
                <div>
                  <button class="btn btn-sm btn-outline-primary me-2" @click=${this.handleAddLine}>
                    <i class="bi bi-plus-circle me-1"></i>Add Line
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click=${this.handleClearAll}>
                    <i class="bi bi-trash me-1"></i>Clear All
                  </button>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="table-light">
                      <tr>
                        <th style="width: 50px;">#</th>
                        <th style="width: 200px;">SKU</th>
                        <th>Product</th>
                        <th style="width: 120px;">Price</th>
                        <th style="width: 120px;">Quantity</th>
                        <th style="width: 120px;">Total</th>
                        <th style="width: 60px;"></th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.orderLines.map((line, index) => html`
                        <tr class="${line.error ? 'table-danger' : line.product ? 'table-success' : ''}">
                          <td class="text-center">${index + 1}</td>
                          <td>
                            <input 
                              type="text" 
                              class="form-control form-control-sm ${line.error ? 'is-invalid' : line.product ? 'is-valid' : ''}"
                              placeholder="SKU..."
                              .value=${line.sku}
                              @input=${(e) => this.handleSkuChange(index, e.target.value)}
                              @blur=${(e) => this.handleSkuChange(index, e.target.value)}
                            />
                            ${line.error ? html`
                              <div class="invalid-feedback d-block">${line.error}</div>
                            ` : ''}
                          </td>
                          <td>
                            ${line.product ? html`
                              <div>
                                <strong>${line.product.name}</strong><br>
                                <small class="text-muted">${line.product.description?.substring(0, 40) || ''}</small>
                              </div>
                            ` : html`
                              <span class="text-muted">Enter SKU to search</span>
                            `}
                          </td>
                          <td>
                            ${line.product ? html`
                              <strong>${this.formatCurrency(line.product.price)}</strong>
                            ` : '-'}
                          </td>
                          <td>
                            <input 
                              type="number" 
                              class="form-control form-control-sm"
                              .value=${line.quantity}
                              @input=${(e) => this.handleQuantityChange(index, e.target.value)}
                              min="1"
                              ?disabled=${!line.product}
                            />
                          </td>
                          <td>
                            ${line.product ? html`
                              <strong class="text-primary">${this.formatCurrency(line.product.price * line.quantity)}</strong>
                            ` : '-'}
                          </td>
                          <td>
                            <button 
                              class="btn btn-sm btn-outline-danger"
                              @click=${() => this.handleRemoveLine(index)}
                              ?disabled=${this.orderLines.length === 1}
                            >
                              <i class="bi bi-x"></i>
                            </button>
                          </td>
                        </tr>
                      `)}
                    </tbody>
                    <tfoot class="table-light">
                      <tr>
                        <td colspan="5" class="text-end"><strong>Order Total:</strong></td>
                        <td colspan="2"><strong class="fs-5 text-primary">${this.formatCurrency(this.orderTotal)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div class="card-footer">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <span class="text-muted">${this.validLines.length} of ${this.orderLines.length} lines valid</span>
                  </div>
                  <button 
                    class="btn btn-primary btn-lg"
                    @click=${this.handleAddToCart}
                    ?disabled=${this.validLines.length === 0}
                  >
                    <i class="bi bi-cart-plus me-2"></i>Add All to Cart (${this.validLines.length})
                  </button>
                </div>
              </div>
            </div>

            <!-- Tips -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-lightbulb me-2"></i>Quick Order Tips</h5>
              </div>
              <div class="card-body">
                <ul class="mb-0">
                  <li>Type or paste SKU numbers to quickly find products</li>
                  <li>Press Tab to move to the next field</li>
                  <li>Use "Paste from Excel" to import bulk data (format: SKU,Quantity)</li>
                  <li>Invalid SKUs will be highlighted in red</li>
                  <li>Add more lines with the "Add Line" button</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Summary -->
            <div class="card mb-4">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Order Summary</h5>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <span>Valid Lines:</span>
                  <strong>${this.validLines.length}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Total Items:</span>
                  <strong>${this.validLines.reduce((sum, line) => sum + line.quantity, 0)}</strong>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                  <strong>Subtotal:</strong>
                  <strong class="text-primary fs-5">${this.formatCurrency(this.orderTotal)}</strong>
                </div>
              </div>
            </div>

            <!-- Common SKUs -->
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0">Frequently Ordered</h6>
              </div>
              <div class="list-group list-group-flush">
                ${this.products.slice(0, 5).map(product => html`
                  <button class="list-group-item list-group-item-action" 
                          @click=${() => {
                            const emptyLine = this.orderLines.findIndex(line => !line.sku);
                            if (emptyLine > -1) {
                              this.handleSkuChange(emptyLine, product.sku);
                            } else {
                              this.orderLines.push({
                                sku: product.sku,
                                quantity: 1,
                                product: product,
                                error: ''
                              });
                              this.requestUpdate();
                            }
                          }}>
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <div class="fw-bold">${product.name}</div>
                        <small class="text-muted">SKU: ${product.sku}</small>
                      </div>
                      <span class="badge bg-primary">${this.formatCurrency(product.price)}</span>
                    </div>
                  </button>
                `)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('quick-order', QuickOrder);
