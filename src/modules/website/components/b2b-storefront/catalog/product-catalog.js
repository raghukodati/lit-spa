/**
 * B2B Product Catalog - Browse Products with B2B Pricing
 */

import { LitElement, html } from 'lit';
import { getProducts } from '../../../../website/services/product.service.js';

class ProductCatalog extends LitElement {
  static properties = {
    products: { type: Array },
    filteredProducts: { type: Array },
    loading: { type: Boolean },
    currentView: { type: String }, // 'categories' or 'products'
    categoryPath: { type: Array }, // Breadcrumb trail [level1, level2, level3]
    searchTerm: { type: String },
    selectedCategories: { type: Array },
    priceRange: { type: Object },
    selectedBrands: { type: Array },
    availabilityFilter: { type: String },
    sortBy: { type: String },
    viewMode: { type: String },
    cart: { type: Array },
    brands: { type: Array },
    categoryHierarchy: { type: Array }
  };

  constructor() {
    super();
    this.products = [];
    this.filteredProducts = [];
    this.loading = false;
    this.currentView = 'categories'; // Start with category browsing
    this.categoryPath = []; // Tracks navigation: [level1, level2, level3]
    this.searchTerm = '';
    this.selectedCategories = [];
    this.priceRange = { min: 0, max: 10000 };
    this.selectedBrands = [];
    this.availabilityFilter = 'all';
    this.sortBy = 'name-asc';
    this.viewMode = 'grid';
    this.cart = JSON.parse(localStorage.getItem('b2b-cart') || '[]');
    this.brands = ['Acme Corp', 'TechPro', 'Industrial Plus', 'SupplyMax', 'Premium Brand'];
    
    // 3-Level Category Hierarchy
    this.categoryHierarchy = [
      {
        id: 'electronics',
        name: 'Electronics',
        icon: 'laptop',
        description: 'Computers, monitors, and electronic devices',
        subcategories: [
          {
            id: 'computers',
            name: 'Computers & Laptops',
            subcategories: [
              { id: 'laptops', name: 'Laptops', category: 'electronics' },
              { id: 'desktops', name: 'Desktop Computers', category: 'electronics' },
              { id: 'workstations', name: 'Workstations', category: 'electronics' }
            ]
          },
          {
            id: 'peripherals',
            name: 'Peripherals',
            subcategories: [
              { id: 'keyboards', name: 'Keyboards', category: 'electronics' },
              { id: 'mice', name: 'Mice & Pointing Devices', category: 'electronics' },
              { id: 'monitors', name: 'Monitors & Displays', category: 'electronics' }
            ]
          },
          {
            id: 'audio',
            name: 'Audio Equipment',
            subcategories: [
              { id: 'headphones', name: 'Headphones', category: 'electronics' },
              { id: 'speakers', name: 'Speakers', category: 'electronics' },
              { id: 'microphones', name: 'Microphones', category: 'electronics' }
            ]
          }
        ]
      },
      {
        id: 'tools',
        name: 'Tools & Equipment',
        icon: 'wrench',
        description: 'Power tools, hand tools, and equipment',
        subcategories: [
          {
            id: 'power-tools',
            name: 'Power Tools',
            subcategories: [
              { id: 'drills', name: 'Drills & Drivers', category: 'tools' },
              { id: 'saws', name: 'Saws & Cutting', category: 'tools' },
              { id: 'sanders', name: 'Sanders & Grinders', category: 'tools' }
            ]
          },
          {
            id: 'hand-tools',
            name: 'Hand Tools',
            subcategories: [
              { id: 'wrenches', name: 'Wrenches', category: 'tools' },
              { id: 'screwdrivers', name: 'Screwdrivers', category: 'tools' },
              { id: 'pliers', name: 'Pliers', category: 'tools' }
            ]
          },
          {
            id: 'tool-sets',
            name: 'Tool Sets',
            subcategories: [
              { id: 'mechanic-sets', name: 'Mechanic Tool Sets', category: 'tools' },
              { id: 'electrician-sets', name: 'Electrician Sets', category: 'tools' },
              { id: 'general-sets', name: 'General Tool Sets', category: 'tools' }
            ]
          }
        ]
      },
      {
        id: 'supplies',
        name: 'Office Supplies',
        icon: 'briefcase',
        description: 'Office furniture, supplies, and stationery',
        subcategories: [
          {
            id: 'furniture',
            name: 'Office Furniture',
            subcategories: [
              { id: 'desks', name: 'Desks & Tables', category: 'supplies' },
              { id: 'chairs', name: 'Office Chairs', category: 'supplies' },
              { id: 'storage', name: 'Storage & Filing', category: 'supplies' }
            ]
          },
          {
            id: 'stationery',
            name: 'Stationery',
            subcategories: [
              { id: 'paper', name: 'Paper Products', category: 'supplies' },
              { id: 'writing', name: 'Writing Instruments', category: 'supplies' },
              { id: 'folders', name: 'Folders & Binders', category: 'supplies' }
            ]
          },
          {
            id: 'supplies-misc',
            name: 'Supplies & Accessories',
            subcategories: [
              { id: 'desk-accessories', name: 'Desk Accessories', category: 'supplies' },
              { id: 'organization', name: 'Organization', category: 'supplies' },
              { id: 'presentation', name: 'Presentation', category: 'supplies' }
            ]
          }
        ]
      },
      {
        id: 'equipment',
        name: 'Heavy Equipment',
        icon: 'truck',
        description: 'Industrial equipment and machinery',
        subcategories: [
          {
            id: 'material-handling',
            name: 'Material Handling',
            subcategories: [
              { id: 'carts', name: 'Carts & Dollies', category: 'equipment' },
              { id: 'lifts', name: 'Lifts & Hoists', category: 'equipment' },
              { id: 'conveyors', name: 'Conveyors', category: 'equipment' }
            ]
          },
          {
            id: 'ladders-scaffolding',
            name: 'Ladders & Scaffolding',
            subcategories: [
              { id: 'ladders', name: 'Ladders', category: 'equipment' },
              { id: 'scaffolding', name: 'Scaffolding', category: 'equipment' },
              { id: 'platforms', name: 'Work Platforms', category: 'equipment' }
            ]
          },
          {
            id: 'shop-equipment',
            name: 'Shop Equipment',
            subcategories: [
              { id: 'workbenches', name: 'Workbenches', category: 'equipment' },
              { id: 'storage-cabinets', name: 'Storage Cabinets', category: 'equipment' },
              { id: 'tool-chests', name: 'Tool Chests', category: 'equipment' }
            ]
          }
        ]
      },
      {
        id: 'safety',
        name: 'Safety Gear',
        icon: 'shield-check',
        description: 'Personal protective equipment and safety supplies',
        subcategories: [
          {
            id: 'head-protection',
            name: 'Head Protection',
            subcategories: [
              { id: 'hard-hats', name: 'Hard Hats', category: 'safety' },
              { id: 'bump-caps', name: 'Bump Caps', category: 'safety' },
              { id: 'face-shields', name: 'Face Shields', category: 'safety' }
            ]
          },
          {
            id: 'hand-protection',
            name: 'Hand Protection',
            subcategories: [
              { id: 'work-gloves', name: 'Work Gloves', category: 'safety' },
              { id: 'cut-resistant', name: 'Cut Resistant Gloves', category: 'safety' },
              { id: 'chemical-gloves', name: 'Chemical Gloves', category: 'safety' }
            ]
          },
          {
            id: 'visibility',
            name: 'High Visibility',
            subcategories: [
              { id: 'safety-vests', name: 'Safety Vests', category: 'safety' },
              { id: 'reflective-tape', name: 'Reflective Tape', category: 'safety' },
              { id: 'hi-vis-clothing', name: 'Hi-Vis Clothing', category: 'safety' }
            ]
          }
        ]
      }
    ];
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.parseCategoryFromURL();
    await this.loadProducts();
  }

  parseCategoryFromURL() {
    // Parse URL path like /b2b-store/catalog/electronics/computers/laptops
    const pathname = window.location.pathname;
    const match = pathname.match(/\/b2b-store\/catalog\/(.+)/);
    
    if (match) {
      const categoryPath = match[1].split('/').filter(c => c);
      
      if (categoryPath.length > 0) {
        // Rebuild categoryPath from URL segments
        this.categoryPath = [];
        
        // Level 1 - Main category
        const level1 = this.categoryHierarchy.find(c => c.id === categoryPath[0]);
        if (level1) {
          this.categoryPath.push(level1);
          
          // Check for "all" to show all products at this level
          if (categoryPath.length === 2 && categoryPath[1] === 'all') {
            this.currentView = 'products';
            this.selectedCategories = [level1.id];
            return;
          }
          
          // Level 2 - Subcategory
          if (categoryPath.length > 1 && level1.subcategories) {
            const level2 = level1.subcategories.find(c => c.id === categoryPath[1]);
            if (level2) {
              this.categoryPath.push(level2);
              
              // Check for "all" to show all products at level 2
              if (categoryPath.length === 3 && categoryPath[2] === 'all') {
                this.currentView = 'products';
                this.selectedCategories = [level1.id];
                return;
              }
              
              // Level 3 - Final category (shows products)
              if (categoryPath.length > 2 && level2.subcategories) {
                const level3 = level2.subcategories.find(c => c.id === categoryPath[2]);
                if (level3) {
                  this.categoryPath.push(level3);
                  this.currentView = 'products';
                  this.selectedCategories = [level3.category];
                }
              }
            }
          }
        }
      }
    }
  }

  async loadProducts() {
    this.loading = true;
    try {
      const options = {
        status: 'active'
      };
      const result = await getProducts(options);
      // Handle the {data: [...], total: ...} format from service
      this.products = result?.data || result || [];
      // Ensure products is an array
      if (!Array.isArray(this.products)) {
        this.products = [];
      }
      this.applyFilters();
    } catch (err) {
      console.error('Failed to load products:', err);
      this.products = []; // Ensure products is always an array
      this.filteredProducts = [];
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    // Ensure products is an array before spreading
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
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(p =>
        this.selectedCategories.includes(p.category)
      );
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

  handleCategoryToggle(categoryId) {
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== categoryId);
    } else {
      this.selectedCategories = [...this.selectedCategories, categoryId];
    }
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
    this.selectedCategories = [];
    this.selectedBrands = [];
    this.priceRange = { min: 0, max: 10000 };
    this.availabilityFilter = 'all';
    this.sortBy = 'name-asc';
    this.applyFilters();
  }

  get activeFilterCount() {
    let count = 0;
    if (this.searchTerm) count++;
    if (this.selectedCategories.length > 0) count++;
    if (this.selectedBrands.length > 0) count++;
    if (this.priceRange.max < 10000) count++;
    if (this.availabilityFilter !== 'all') count++;
    return count;
  }

  handleAddToCart(product, quantity = 1) {
    const cartItem = {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: quantity,
      total: product.price * quantity
    };

    const existingIndex = this.cart.findIndex(item => item.productId === product.id);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
      this.cart[existingIndex].total = this.cart[existingIndex].price * this.cart[existingIndex].quantity;
    } else {
      this.cart.push(cartItem);
    }

    localStorage.setItem('b2b-cart', JSON.stringify(this.cart));
    this.requestUpdate();
    
    // Show success message
    alert(`Added ${product.name} to cart`);
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  get cartItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Category Navigation Methods
  handleCategoryClick(category) {
    // Navigate to level 1 category URL
    window.location.pathname = `/b2b-store/catalog/${category.id}`;
  }

  handleSubcategoryClick(subcategory) {
    // Navigate to level 2 subcategory URL
    const level1 = this.categoryPath[0].id;
    window.location.pathname = `/b2b-store/catalog/${level1}/${subcategory.id}`;
  }

  handleFinalCategoryClick(finalCategory) {
    // Navigate to level 3 final category URL (shows products)
    const level1 = this.categoryPath[0].id;
    const level2 = this.categoryPath[1].id;
    window.location.pathname = `/b2b-store/catalog/${level1}/${level2}/${finalCategory.id}`;
  }

  handleBreadcrumbClick(level) {
    if (level === -1) {
      // Go back to all categories
      window.location.pathname = '/b2b-store/catalog';
    } else {
      // Go back to specific level
      const pathSegments = this.categoryPath.slice(0, level + 1).map(c => c.id);
      window.location.pathname = `/b2b-store/catalog/${pathSegments.join('/')}`;
    }
  }

  handleViewAllProducts(category) {
    // View all products in the current category
    const pathSegments = this.categoryPath.map(c => c.id);
    if (pathSegments.length === 1) {
      // Add a special "all" segment to indicate viewing all products
      window.location.pathname = `/b2b-store/catalog/${pathSegments[0]}/all`;
    } else {
      // For deeper levels, construct the full path
      window.location.pathname = `/b2b-store/catalog/${pathSegments.join('/')}/all`;
    }
  }

  getCurrentCategories() {
    if (this.categoryPath.length === 0) {
      // Show top-level categories
      return this.categoryHierarchy;
    } else if (this.categoryPath.length === 1) {
      // Show level 2 subcategories
      return this.categoryPath[0].subcategories || [];
    } else if (this.categoryPath.length === 2) {
      // Show level 3 subcategories
      return this.categoryPath[1].subcategories || [];
    }
    return [];
  }

  renderCategoryBrowsing() {
    const categories = this.getCurrentCategories();
    const isTopLevel = this.categoryPath.length === 0;
    const isLevel3 = this.categoryPath.length === 2;

    return html`
      <div class="row">
        ${isTopLevel ? html`
          <div class="col-12 mb-4">
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              <strong>Browse by Category:</strong> Select a category to explore our products
            </div>
          </div>
        ` : ''}

        ${categories.map(cat => html`
          <div class="col-md-${isTopLevel ? '4' : '6'} col-lg-${isTopLevel ? '3' : '4'} mb-4">
            <div class="card h-100 shadow-sm hover-shadow" style="cursor: pointer; transition: all 0.3s;">
              <div class="card-body text-center" @click=${() => {
                if (isLevel3) {
                  this.handleFinalCategoryClick(cat);
                } else if (this.categoryPath.length === 1) {
                  this.handleSubcategoryClick(cat);
                } else {
                  this.handleCategoryClick(cat);
                }
              }}>
                ${isTopLevel && cat.icon ? html`
                  <i class="bi bi-${cat.icon}" style="font-size: 3rem; color: #0d6efd;"></i>
                ` : html`
                  <i class="bi bi-folder" style="font-size: 2.5rem; color: #6c757d;"></i>
                `}
                <h5 class="mt-3 mb-2">${cat.name}</h5>
                ${cat.description ? html`
                  <p class="text-muted small mb-0">${cat.description}</p>
                ` : ''}
                ${cat.subcategories ? html`
                  <p class="text-muted small mt-2 mb-0">
                    <i class="bi bi-arrow-right-circle me-1"></i>
                    ${cat.subcategories.length} subcategories
                  </p>
                ` : ''}
              </div>
              ${isLevel3 ? html`
                <div class="card-footer bg-primary text-white text-center">
                  <i class="bi bi-box-seam me-2"></i>View Products
                </div>
              ` : ''}
            </div>
          </div>
        `)}
      </div>

      ${this.categoryPath.length > 0 && this.categoryPath[this.categoryPath.length - 1].id ? html`
        <div class="row mt-3">
          <div class="col-12">
            <button class="btn btn-lg btn-outline-primary w-100" 
                    @click=${() => this.handleViewAllProducts(this.categoryPath[this.categoryPath.length - 1])}>
              <i class="bi bi-grid-3x3 me-2"></i>
              View All Products in ${this.categoryPath[this.categoryPath.length - 1].name}
            </button>
          </div>
        </div>
      ` : ''}
    `;
  }

  renderProductsView() {
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
                <button class="btn btn-primary" @click=${() => this.handleBreadcrumbClick(-1)}>
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
                      <button class="btn btn-sm btn-outline-secondary w-100" 
                              @click=${() => window.location.pathname = `/b2b-store/product/${product.id}`}>
                        View Details
                      </button>
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
                          <button class="btn btn-sm btn-primary" @click=${() => {
                            const qty = parseInt(document.getElementById(`qty-list-${product.id}`).value) || 1;
                            this.handleAddToCart(product, qty);
                          }}>
                            <i class="bi bi-cart-plus me-1"></i>Add to Cart
                          </button>
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

  render() {
    return html`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">
              <i class="bi bi-grid-3x3-gap me-2"></i>Product Catalog
            </h2>
            <p class="text-muted mb-0">Browse by category or search for specific products</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary position-relative" @click=${() => window.location.pathname = '/b2b-store/cart'}>
              <i class="bi bi-cart3 me-2"></i>Cart
              ${this.cartItemCount > 0 ? html`
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  ${this.cartItemCount}
                </span>
              ` : ''}
            </button>
            <button class="btn btn-primary" @click=${() => window.location.pathname = '/b2b-store/quick-order'}>
              <i class="bi bi-lightning me-2"></i>Quick Order
            </button>
          </div>
        </div>

        <!-- Breadcrumb Navigation -->
        ${this.categoryPath.length > 0 || this.currentView === 'products' ? html`
          <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="/b2b-store/catalog" class="text-decoration-none">
                  <i class="bi bi-house me-1"></i>All Categories
                </a>
              </li>
              ${this.categoryPath.map((cat, index) => {
                const isLast = index === this.categoryPath.length - 1 && this.currentView !== 'products';
                const pathSegments = this.categoryPath.slice(0, index + 1).map(c => c.id);
                const href = `/b2b-store/catalog/${pathSegments.join('/')}`;
                
                return html`
                  <li class="breadcrumb-item ${isLast ? 'active' : ''}">
                    ${isLast ? html`
                      ${cat.name}
                    ` : html`
                      <a href="${href}" class="text-decoration-none">
                        ${cat.name}
                      </a>
                    `}
                  </li>
                `;
              })}
              ${this.currentView === 'products' ? html`
                <li class="breadcrumb-item active">Products</li>
              ` : ''}
            </ol>
          </nav>
        ` : ''}

        <!-- Category Browsing View -->
        ${this.currentView === 'categories' ? this.renderCategoryBrowsing() : ''}

        <!-- Products View -->
        ${this.currentView === 'products' ? this.renderProductsView() : ''}
      </div>

      <!-- Product Compare Component -->
      <product-compare></product-compare>
    `;
  }
}

customElements.define('product-catalog', ProductCatalog);
