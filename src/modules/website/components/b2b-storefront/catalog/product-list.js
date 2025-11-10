/**
 * Product List Component - Product display with filters and sorting
 */

import { LitElement, html } from 'lit';
import { getProducts } from '../../../../website/services/product.service.js';

class ProductList extends LitElement {
  static properties = {
    products: { type: Array },
    filteredProducts: { type: Array },
    loading: { type: Boolean },
    searchTerm: { type: String },
    selectedCategory: { type: String },
    selectedBrands: { type: Array },
    priceRange: { type: Object },
    availabilityFilter: { type: String },
    sortBy: { type: String },
    viewMode: { type: String },
    brands: { type: Array }
  };

  constructor() {
    super();
    this.products = [];
    this.filteredProducts = [];
    this.loading = false;
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedBrands = [];
    this.priceRange = { min: 0, max: 10000 };
    this.availabilityFilter = 'all';
    this.sortBy = 'name-asc';
    this.viewMode = 'grid';
    this.brands = ['Acme Corp', 'TechPro', 'Industrial Plus', 'SupplyMax', 'Premium Brand'];
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
      const options = { status: 'active' };
      const result = await getProducts(options);
      this.products = result?.data || result || [];
      if (!Array.isArray(this.products)) {
        this.products = [];
      }
      this.applyFilters();
    } catch (err) {
      console.error('Failed to load products:', err);
      this.products = [];
      this.filteredProducts = [];
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    if (!Array.isArray(this.products)) {
      this.products = [];
    }
    let filtered = [...this.products];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        (p.description || '').toLowerCase().includes(search)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Brand filter
    if (this.selectedBrands.length > 0) {
      filtered = filtered.filter(p =>
        this.selectedBrands.includes(p.brand || 'Unknown')
      );
    }

    // Price range filter
    filtered = filtered.filter(p =>
      p.price >= this.priceRange.min && p.price <= this.priceRange.max
    );

    // Availability filter
    if (this.availabilityFilter === 'inStock') {
      filtered = filtered.filter(p => p.stock > 10);
    } else if (this.availabilityFilter === 'lowStock') {
      filtered = filtered.filter(p => p.stock > 0 && p.stock <= 10);
    }

    // Sorting
    filtered = this.sortProducts(filtered);

    this.filteredProducts = filtered;
    
    // Dispatch event with filtered products for parent components
    this.dispatchEvent(new CustomEvent('products-filtered', {
      detail: { products: this.filteredProducts },
      bubbles: true,
      composed: true
    }));
  }

  sortProducts(products) {
    const sorted = [...products];
    switch (this.sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'stock-asc':
        return sorted.sort((a, b) => a.stock - b.stock);
      case 'stock-desc':
        return sorted.sort((a, b) => b.stock - a.stock);
      default:
        return sorted;
    }
  }

  handleSearch(e) {
    this.searchTerm = e.target.value;
    this.applyFilters();
  }

  handleBrandToggle(brand) {
    if (this.selectedBrands.includes(brand)) {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
    } else {
      this.selectedBrands = [...this.selectedBrands, brand];
    }
    this.applyFilters();
  }

  handlePriceRangeChange(e) {
    this.priceRange.max = parseInt(e.target.value);
    this.applyFilters();
  }

  handleAvailabilityFilter(filter) {
    this.availabilityFilter = filter;
    this.applyFilters();
  }

  handleSortChange(e) {
    this.sortBy = e.target.value;
    this.applyFilters();
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.selectedBrands = [];
    this.priceRange = { min: 0, max: 10000 };
    this.availabilityFilter = 'all';
    this.applyFilters();
  }

  get activeFilterCount() {
    let count = 0;
    if (this.searchTerm) count++;
    if (this.selectedBrands.length > 0) count++;
    if (this.priceRange.max < 10000) count++;
    if (this.availabilityFilter !== 'all') count++;
    return count;
  }

  handleAddToCart(product, quantity) {
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: { product, quantity },
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

  render() {
    return html`
      <div class="row">
        <!-- Filters Sidebar -->
        <div class="col-md-3">
          <!-- Search -->
          <div class="card mb-3">
            <div class="card-header">
              <h6 class="mb-0"><i class="bi bi-search me-2"></i>Search</h6>
            </div>
            <div class="card-body">
              <input
                type="text"
                class="form-control"
                placeholder="Search products..."
                .value=${this.searchTerm}
                @input=${this.handleSearch}
              />
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="card mb-3">
            <div class="card-header">
              <h6 class="mb-0"><i class="bi bi-tag me-2"></i>Brand</h6>
            </div>
            <div class="card-body">
              ${this.brands.map(brand => html`
                <div class="form-check mb-2">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="brand-${brand.replace(/\s/g, '-')}"
                    ?checked=${this.selectedBrands.includes(brand)}
                    @change=${() => this.handleBrandToggle(brand)}
                  >
                  <label class="form-check-label" for="brand-${brand.replace(/\s/g, '-')}">
                    ${brand}
                  </label>
                </div>
              `)}
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="card mb-3">
            <div class="card-header">
              <h6 class="mb-0"><i class="bi bi-cash me-2"></i>Price Range</h6>
            </div>
            <div class="card-body">
              <label class="form-label">Max Price: ${this.formatCurrency(this.priceRange.max)}</label>
              <input 
                type="range" 
                class="form-range" 
                min="0" 
                max="10000" 
                step="100"
                .value=${this.priceRange.max}
                @input=${this.handlePriceRangeChange}
              />
              <div class="d-flex justify-content-between small text-muted">
                <span>$0</span>
                <span>$10,000+</span>
              </div>
            </div>
          </div>

          <!-- Availability Filter -->
          <div class="card mb-3">
            <div class="card-header">
              <h6 class="mb-0"><i class="bi bi-box-seam me-2"></i>Availability</h6>
            </div>
            <div class="card-body">
              <div class="form-check mb-2">
                <input 
                  class="form-check-input" 
                  type="radio" 
                  name="availability" 
                  id="avail-all"
                  ?checked=${this.availabilityFilter === 'all'}
                  @change=${() => this.handleAvailabilityFilter('all')}
                >
                <label class="form-check-label" for="avail-all">
                  All Products
                </label>
              </div>
              <div class="form-check mb-2">
                <input 
                  class="form-check-input" 
                  type="radio" 
                  name="availability" 
                  id="avail-instock"
                  ?checked=${this.availabilityFilter === 'inStock'}
                  @change=${() => this.handleAvailabilityFilter('inStock')}
                >
                <label class="form-check-label" for="avail-instock">
                  <span class="badge bg-success">In Stock</span> (10+ units)
                </label>
              </div>
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="radio" 
                  name="availability" 
                  id="avail-lowstock"
                  ?checked=${this.availabilityFilter === 'lowStock'}
                  @change=${() => this.handleAvailabilityFilter('lowStock')}
                >
                <label class="form-check-label" for="avail-lowstock">
                  <span class="badge bg-warning text-dark">Low Stock</span> (1-10 units)
                </label>
              </div>
            </div>
          </div>

          ${this.activeFilterCount > 0 ? html`
            <button class="btn btn-outline-secondary w-100" @click=${this.clearAllFilters}>
              <i class="bi bi-x-circle me-2"></i>Clear All Filters
            </button>
          ` : ''}
        </div>

        <!-- Products Grid -->
        <div class="col-md-9">
          <!-- Toolbar -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <strong>${this.filteredProducts.length}</strong> of <strong>${this.products.length}</strong> products
                  ${this.activeFilterCount > 0 ? html`
                    <span class="badge bg-primary ms-2">${this.activeFilterCount} filter(s)</span>
                  ` : ''}
                </div>
                <div class="d-flex gap-2 align-items-center">
                  <label class="mb-0 me-2 text-nowrap">Sort by:</label>
                  <select class="form-select form-select-sm" style="width: auto;" 
                          .value=${this.sortBy}
                          @change=${this.handleSortChange}>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-asc">Price (Low-High)</option>
                    <option value="price-desc">Price (High-Low)</option>
                    <option value="stock-asc">Stock (Low-High)</option>
                    <option value="stock-desc">Stock (High-Low)</option>
                  </select>
                  <div class="btn-group btn-group-sm ms-2">
                    <button class="btn ${this.viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}"
                            @click=${() => this.viewMode = 'grid'}
                            title="Grid View">
                      <i class="bi bi-grid"></i>
                    </button>
                    <button class="btn ${this.viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}"
                            @click=${() => this.viewMode = 'list'}
                            title="List View">
                      <i class="bi bi-list"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          ${this.loading ? html`
            <div class="text-center py-5">
              <div class="spinner-border text-primary"></div>
              <p class="mt-2 text-muted">Loading products...</p>
            </div>
          ` : ''}

          ${!this.loading && this.filteredProducts.length === 0 ? html`
            <div class="card">
              <div class="card-body text-center py-5">
                <i class="bi bi-search" style="font-size: 3rem; color: #ccc;"></i>
                <h4 class="mt-3">No Products Found</h4>
                <p class="text-muted mb-3">Try adjusting your filters or browse other categories</p>
                <button class="btn btn-primary" @click=${() => window.location.pathname = '/b2b-store/catalog'}>
                  <i class="bi bi-arrow-left me-2"></i>Back to Categories
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Grid View -->
          ${!this.loading && this.viewMode === 'grid' && this.filteredProducts.length > 0 ? html`
            <div class="row g-3">
              ${this.filteredProducts.map(product => html`
                <div class="col-md-4">
                  <div class="card h-100">
                    <div class="card-body">
                      <div class="bg-light rounded mb-3 position-relative" style="height: 200px; display: flex; align-items: center; justify-content: center;">
                        ${product.imageUrl ? html`
                          <img src="${product.imageUrl}" alt="${product.name}" class="img-fluid" />
                        ` : html`
                          <i class="bi bi-box" style="font-size: 4rem; color: #ccc;"></i>
                        `}
                        ${product.stock < 10 ? html`
                          <span class="position-absolute top-0 end-0 m-2 badge bg-warning text-dark">
                            Low Stock
                          </span>
                        ` : ''}
                      </div>
                      <h6 class="mb-2">${product.name}</h6>
                      <p class="text-muted small mb-2">SKU: ${product.sku}</p>
                      ${product.description ? html`
                        <p class="small text-muted mb-3">${product.description.substring(0, 80)}...</p>
                      ` : ''}
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div class="fw-bold text-primary fs-5">${this.formatCurrency(product.price)}</div>
                          <small class="text-muted">In Stock: ${product.stock}</small>
                        </div>
                      </div>
                      <div class="input-group input-group-sm mb-2">
                        <input type="number" class="form-control" value="1" min="1" id="qty-${product.id}">
                        <button class="btn btn-primary" @click=${() => {
                          const qty = parseInt(document.getElementById(`qty-${product.id}`).value) || 1;
                          this.handleAddToCart(product, qty);
                        }}>
                          <i class="bi bi-cart-plus me-1"></i>Add
                        </button>
                      </div>
                      <div class="d-grid gap-2">
                        <button class="btn btn-sm btn-outline-secondary" 
                                @click=${() => window.location.pathname = `/b2b-store/product/${product.id}`}>
                          <i class="bi bi-eye me-1"></i>View Details
                        </button>
                        <button class="btn btn-sm btn-outline-info" 
                                @click=${() => this.handleAddToCompare(product)}>
                          <i class="bi bi-clipboard-check me-1"></i>Compare
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `)}
            </div>
          ` : ''}

          <!-- List View -->
          ${!this.loading && this.viewMode === 'list' && this.filteredProducts.length > 0 ? html`
            <div class="card">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.filteredProducts.map(product => html`
                      <tr>
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="bg-light rounded me-3" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                              <i class="bi bi-box" style="font-size: 2rem; color: #ccc;"></i>
                            </div>
                            <div>
                              <div class="fw-bold">${product.name}</div>
                              <small class="text-muted">${product.description?.substring(0, 50) || ''}</small>
                            </div>
                          </div>
                        </td>
                        <td><code>${product.sku}</code></td>
                        <td class="fw-bold text-primary">${this.formatCurrency(product.price)}</td>
                        <td>
                          <span class="badge ${product.stock > 10 ? 'bg-success' : 'bg-warning text-dark'}">
                            ${product.stock}
                          </span>
                        </td>
                        <td>
                          <input type="number" class="form-control form-control-sm" 
                                 style="width: 80px;" value="1" min="1" id="qty-list-${product.id}">
                        </td>
                        <td>
                          <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-primary" @click=${() => {
                              const qty = parseInt(document.getElementById(`qty-list-${product.id}`).value) || 1;
                              this.handleAddToCart(product, qty);
                            }}>
                              <i class="bi bi-cart-plus me-1"></i>Add to Cart
                            </button>
                            <button class="btn btn-sm btn-outline-info" 
                                    @click=${() => this.handleAddToCompare(product)}
                                    title="Add to Compare">
                              <i class="bi bi-clipboard-check"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('catalog-product-list', ProductList);
