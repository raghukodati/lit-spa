import { html } from 'lit';
import { BaseComponent, repeat, classMap, styleMap, live, when } from '../../../../shared/components/base/BaseComponent.js';
import '@shared/components/ui/ui-card.js';
import '@shared/components/ui/ui-table.js';

import '../b2b-storefront/catalog/product-compare.js';

class ProductList extends BaseComponent {
  static properties = {
    products: { type: Array },
    categories: { type: Array },
    brands: { type: Array },
    loading: { type: Boolean },
    searchTerm: { type: String },
    filterCategory: { type: String },
    filterBrand: { type: String },
    filterStatus: { type: String },
    sortBy: { type: String },
    sortOrder: { type: String },
    page: { type: Number },
    pageSize: { type: Number },
    total: { type: Number },
    totalPages: { type: Number }
  };

  constructor() {
    super();
    this.products = [];
    this.categories = [];
    this.brands = [];
    this.loading = false;
    this.searchTerm = '';
    this.filterCategory = '';
    this.filterBrand = '';
    this.filterStatus = 'active';
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    this.page = 1;
    this.pageSize = 20;
    this.total = 0;
    this.totalPages = 0;
    this._productService = null;
  }

  createRenderRoot() { return this; }

  async connectedCallback() {
    super.connectedCallback();
    if (!this._productService) {
      this._productService = await this.getService('productService');
    }
    await this.loadFilters();
    await this.loadProducts();
  }

  async loadFilters() {
    try {
      if (!this._productService) {
        this._productService = await this.getService('productService');
      }
      this.categories = await this._productService.getProductCategories();
      this.brands = await this._productService.getProductBrands();
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  }

  async loadProducts() {
    this.loading = true;
    try {
      const options = {
        search: this.searchTerm,
        category: this.filterCategory,
        brand: this.filterBrand,
        status: this.filterStatus,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        page: this.page,
        pageSize: this.pageSize
      };
      
      if (!this._productService) {
        this._productService = await this.getService('productService');
      }
      const result = await this._productService.getProducts(options);
      this.products = result.data;
      this.total = result.total;
      this.totalPages = result.totalPages;
    } catch (error) {
      console.error('Failed to load products:', error);
      alert('Failed to load products');
    } finally {
      this.loading = false;
    }
  }

  handleSearch(e) {
    this.searchTerm = e.target.value;
    this.page = 1;
    this.loadProducts();
  }

  handleCategoryChange(e) {
    this.filterCategory = e.target.value;
    this.page = 1;
    this.loadProducts();
  }

  handleBrandChange(e) {
    this.filterBrand = e.target.value;
    this.page = 1;
    this.loadProducts();
  }

  handleStatusChange(e) {
    this.filterStatus = e.target.value;
    this.page = 1;
    this.loadProducts();
  }

  handleSortChange(e) {
    this.sortBy = e.target.value;
    this.loadProducts();
  }

  async handleDelete(productId) {
    if (!this.can('products', 'delete')) return;
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      if (!this._productService) {
        this._productService = await this.getService('productService');
      }
      await this._productService.deleteProduct(productId);
      alert('Product deleted successfully');
      await this.loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  }

  handleEdit(productId) {
    if (!this.can('products', 'update')) return;
    window.location.pathname = `/website/products/edit/${productId}`;
  }

  handleView(productId) {
    if (!this.can('products', 'read')) return;
    window.location.pathname = `/website/products/${productId}`;
  }

  handleAddToCompare(product) {
    window.dispatchEvent(new CustomEvent('add-to-compare', {
      detail: { product }
    }));
  }

  goToPage(page) {
    this.page = page;
    this.loadProducts();
  }

  render() {
    return html`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Products</h2>
          ${this.ifCan('products','create', html`
            <a href="#/website/products/new" class="btn btn-primary">
              <i class="bi bi-plus-lg"></i> Add Product
            </a>
          `)}
        </div>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-3">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search products..."
                  .value="${this.searchTerm}"
                  @input="${this.handleSearch}"
                />
              </div>
              <div class="col-md-2">
                <select class="form-select" @change="${this.handleCategoryChange}">
                  <option value="">All Categories</option>
                  ${this.categories.map(cat => html`
                    <option value="${cat}" ?selected="${this.filterCategory === cat}">
                      ${cat}
                    </option>
                  `)}
                </select>
              </div>
              <div class="col-md-2">
                <select class="form-select" @change="${this.handleBrandChange}">
                  <option value="">All Brands</option>
                  ${this.brands.map(brand => html`
                    <option value="${brand}" ?selected="${this.filterBrand === brand}">
                      ${brand}
                    </option>
                  `)}
                </select>
              </div>
              <div class="col-md-2">
                <select class="form-select" @change="${this.handleStatusChange}">
                  <option value="">All Status</option>
                  <option value="active" ?selected="${this.filterStatus === 'active'}">Active</option>
                  <option value="draft" ?selected="${this.filterStatus === 'draft'}">Draft</option>
                  <option value="archived" ?selected="${this.filterStatus === 'archived'}">Archived</option>
                </select>
              </div>
              <div class="col-md-3">
                <select class="form-select" @change="${this.handleSortChange}">
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="stock">Sort by Stock</option>
                  <option value="createdAt">Sort by Date</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Table -->
        <ui-card>
          <ui-table
            .columns=${[
              { key: 'image', label: 'Image', render: (p) => p.featuredImage
                ? html`<img src="${p.featuredImage}" alt="${p.name}" style="width:50px;height:50px;object-fit:cover">`
                : html`<div class="bg-secondary text-white d-flex align-items-center justify-content-center" style="width:50px;height:50px">N/A</div>`
              },
              { key: 'sku', label: 'SKU', sortable: true },
              { key: 'name', label: 'Name', sortable: true, render: (p) => html`
                  <strong>${p.name}</strong> ${p.featured ? html`<span class="badge bg-warning ms-2">Featured</span>` : ''}
                ` 
              },
              { key: 'category', label: 'Category', sortable: true, render: (p) => p.category || 'N/A' },
              { key: 'price', label: 'Price', sortable: true, render: (p) => html`
                  $${p.price.toFixed(2)}
                  ${p.compareAtPrice > 0 ? html`<br><small class="text-muted text-decoration-line-through">$${p.compareAtPrice.toFixed(2)}</small>` : ''}
                `
              },
              { key: 'stock', label: 'Stock', sortable: true, render: (p) => p.trackInventory
                  ? html`<span class="badge ${p.stock === 0 ? 'bg-danger' : (p.stock > p.lowStockThreshold ? 'bg-success': 'bg-warning')}">${p.stock}</span>`
                  : html`<span class="text-muted">N/A</span>`
              },
              { key: 'status', label: 'Status', sortable: true, render: (p) => html`
                  <span class="badge ${p.status === 'active' ? 'bg-success' : (p.status === 'draft' ? 'bg-secondary' : 'bg-danger')}">
                    ${p.status}
                  </span>`
              },
              { key: 'actions', label: 'Actions', render: (p) => html`
                  ${this.ifCan('products','read', html`
                    <button class="btn btn-sm btn-info me-1" @click="${() => this.handleView(p.id)}" title="View"><i class="bi bi-eye"></i></button>
                  `)}
                  ${this.ifCan('products','update', html`
                    <button class="btn btn-sm btn-warning me-1" @click="${() => this.handleEdit(p.id)}" title="Edit"><i class="bi bi-pencil"></i></button>
                  `)}
                  <button class="btn btn-sm btn-outline-info me-1" @click="${() => this.handleAddToCompare(p)}" title="Add to Compare"><i class="bi bi-clipboard-check"></i></button>
                  ${this.ifCan('products','delete', html`
                    <button class="btn btn-sm btn-danger" @click="${() => this.handleDelete(p.id)}" title="Delete"><i class="bi bi-trash"></i></button>
                  `)}
                `
              }
            ]}
            .items=${this.products}
            .loading=${this.loading}
            emptyText="No products found"
            .page=${this.page}
            .pageSize=${this.pageSize}
            .total=${this.total}
            .sortBy=${this.sortBy}
            .sortOrder=${this.sortOrder}
            @table-sort=${(e) => { this.sortBy = e.detail.sortBy; this.sortOrder = e.detail.sortOrder; this.loadProducts(); }}
            @table-page=${(e) => { this.goToPage(e.detail.page); }}
          ></ui-table>

          <div slot="footer" class="text-center text-muted mt-2">
            Showing ${this.products.length} of ${this.total} products
          </div>
        </ui-card>
      </div>

      <!-- Product Compare Component -->
      <product-compare></product-compare>
    `;
  }
}

customElements.define('product-list', ProductList);
