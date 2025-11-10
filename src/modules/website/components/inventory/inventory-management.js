import { html } from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';

class InventoryManagement extends BaseComponent {
  static properties = {
    products: { type: Array },
    lowStockProducts: { type: Array },
    outOfStockProducts: { type: Array },
    loading: { type: Boolean },
    view: { type: String }
  };

  constructor() {
    super();
    this.products = [];
    this.lowStockProducts = [];
    this.outOfStockProducts = [];
    this.loading = false;
    this.view = 'all';
    this._productService = null;
  }

  createRenderRoot() { return this; }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      if (!this._productService) {
        this._productService = await this.getService('productService');
      }
      const result = await this._productService.getProducts({ trackInventory: true, sortBy: 'stock', sortOrder: 'asc' });
      this.products = result.data;
      this.lowStockProducts = await this._productService.getLowStockProducts();
      this.outOfStockProducts = await this._productService.getOutOfStockProducts();
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      this.loading = false;
    }
  }

  async handleStockUpdate(productId, newStock) {
    if (!this.can('products', 'update')) return;
    try {
      if (!this._productService) {
        this._productService = await this.getService('productService');
      }
      await this._productService.updateProductStock(productId, parseInt(newStock));
      await this.loadData();
    } catch (error) {
      alert('Failed to update stock');
    }
  }

  getDisplayProducts() {
    if (this.view === 'low') return this.lowStockProducts;
    if (this.view === 'out') return this.outOfStockProducts;
    return this.products;
  }

  render() {
    return html`
      <div class="container-fluid mt-4">
        <h2 class="mb-4">Inventory Management</h2>

        <!-- Stats -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card bg-warning text-white">
              <div class="card-body text-center">
                <h3>${this.lowStockProducts.length}</h3>
                <p class="mb-0">Low Stock Products</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-danger text-white">
              <div class="card-body text-center">
                <h3>${this.outOfStockProducts.length}</h3>
                <p class="mb-0">Out of Stock</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-success text-white">
              <div class="card-body text-center">
                <h3>${this.products.filter(p => p.isInStock() && !p.isLowStock()).length}</h3>
                <p class="mb-0">In Stock</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <a class="nav-link ${this.view === 'all' ? 'active' : ''}" 
               @click="${() => this.view = 'all'}">
              All Products
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${this.view === 'low' ? 'active' : ''}" 
               @click="${() => this.view = 'low'}">
              Low Stock
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${this.view === 'out' ? 'active' : ''}" 
               @click="${() => this.view = 'out'}">
              Out of Stock
            </a>
          </li>
        </ul>

        ${this.loading ? html`
          <div class="text-center py-5"><div class="spinner-border"></div></div>
        ` : html`
          <div class="card">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Current Stock</th>
                  <th>Update Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${this.getDisplayProducts().map(product => html`
                  <tr>
                    <td><strong>${product.name}</strong></td>
                    <td>${product.sku}</td>
                    <td>
                      <span class="badge ${product.stock > product.lowStockThreshold ? 'bg-success' : 
                                           product.stock > 0 ? 'bg-warning' : 'bg-danger'}">
                        ${product.stock}
                      </span>
                    </td>
                    <td>
                      ${this.ifCan('products', 'update', html`
                        <div class="input-group" style="width: 150px;">
                          <input 
                            type="number" 
                            class="form-control form-control-sm" 
                            value="${product.stock}"
                            @change="${e => this.handleStockUpdate(product.id, e.target.value)}"
                          />
                        </div>
                      `, html`<span>${product.stock}</span>`)}
                    </td>
                    <td>
                      ${product.isLowStock() ? html`
                        <span class="badge bg-warning">Low Stock</span>
                      ` : product.stock === 0 ? html`
                        <span class="badge bg-danger">Out of Stock</span>
                      ` : html`
                        <span class="badge bg-success">In Stock</span>
                      `}
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  }
}

customElements.define('inventory-management', InventoryManagement);
