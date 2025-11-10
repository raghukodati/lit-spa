/**
 * Category Browser Component - 3-Level Category Navigation
 */

import { LitElement, html } from 'lit';

class CategoryBrowser extends LitElement {
  static properties = {
    categoryPath: { type: Array },
    categoryHierarchy: { type: Array }
  };

  constructor() {
    super();
    this.categoryPath = [];
    
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

  connectedCallback() {
    super.connectedCallback();
    this.parseCategoryFromURL();
  }

  parseCategoryFromURL() {
    const pathname = window.location.pathname;
    const match = pathname.match(/\/b2b-store\/catalog\/(.+)/);
    
    if (match) {
      const categoryPath = match[1].split('/').filter(c => c && c !== 'all');
      
      if (categoryPath.length > 0) {
        this.categoryPath = [];
        
        // Level 1
        const level1 = this.categoryHierarchy.find(c => c.id === categoryPath[0]);
        if (level1) {
          this.categoryPath.push(level1);
          
          // Level 2
          if (categoryPath.length > 1 && level1.subcategories) {
            const level2 = level1.subcategories.find(c => c.id === categoryPath[1]);
            if (level2) {
              this.categoryPath.push(level2);
              
              // Level 3
              if (categoryPath.length > 2 && level2.subcategories) {
                const level3 = level2.subcategories.find(c => c.id === categoryPath[2]);
                if (level3) {
                  this.categoryPath.push(level3);
                }
              }
            }
          }
        }
      }
    }
  }

  getCurrentCategories() {
    if (this.categoryPath.length === 0) {
      return this.categoryHierarchy;
    } else if (this.categoryPath.length === 1) {
      return this.categoryPath[0].subcategories || [];
    } else if (this.categoryPath.length === 2) {
      return this.categoryPath[1].subcategories || [];
    }
    return [];
  }

  handleCategoryClick(category) {
    window.location.pathname = `/b2b-store/catalog/${category.id}`;
  }

  handleSubcategoryClick(subcategory) {
    const level1 = this.categoryPath[0].id;
    window.location.pathname = `/b2b-store/catalog/${level1}/${subcategory.id}`;
  }

  handleFinalCategoryClick(finalCategory) {
    const level1 = this.categoryPath[0].id;
    const level2 = this.categoryPath[1].id;
    window.location.pathname = `/b2b-store/catalog/${level1}/${level2}/${finalCategory.id}`;
  }

  render() {
    const categories = this.getCurrentCategories();
    const isTopLevel = this.categoryPath.length === 0;
    const isLevel3 = this.categoryPath.length === 2;

    return html`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">
              <i class="bi bi-grid-3x3-gap me-2"></i>Browse Categories
            </h2>
            <p class="text-muted mb-0">Select a category to explore our products</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary" @click=${() => window.location.pathname = '/b2b-store/cart'}>
              <i class="bi bi-cart3 me-2"></i>Cart
            </button>
            <button class="btn btn-primary" @click=${() => window.location.pathname = '/b2b-store/quick-order'}>
              <i class="bi bi-lightning me-2"></i>Quick Order
            </button>
          </div>
        </div>

        <!-- Breadcrumb -->
        ${this.categoryPath.length > 0 ? html`
          <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="/b2b-store/catalog" class="text-decoration-none">
                  <i class="bi bi-house me-1"></i>All Categories
                </a>
              </li>
              ${this.categoryPath.map((cat, index) => {
                const isLast = index === this.categoryPath.length - 1;
                const pathSegments = this.categoryPath.slice(0, index + 1).map(c => c.id);
                const href = `/b2b-store/catalog/${pathSegments.join('/')}`;
                
                return html`
                  <li class="breadcrumb-item ${isLast ? 'active' : ''}">
                    ${isLast ? cat.name : html`
                      <a href="${href}" class="text-decoration-none">${cat.name}</a>
                    `}
                  </li>
                `;
              })}
            </ol>
          </nav>
        ` : ''}

        <!-- Categories -->
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
              <div class="card h-100 shadow-sm" style="cursor: pointer; transition: all 0.3s;"
                   @click=${() => {
                     if (isLevel3) {
                       this.handleFinalCategoryClick(cat);
                     } else if (this.categoryPath.length === 1) {
                       this.handleSubcategoryClick(cat);
                     } else {
                       this.handleCategoryClick(cat);
                     }
                   }}>
                <div class="card-body text-center">
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

        ${this.categoryPath.length > 0 ? html`
          <div class="row mt-3">
            <div class="col-12">
              <button class="btn btn-lg btn-outline-primary w-100" 
                      @click=${() => {
                        const pathSegments = this.categoryPath.map(c => c.id);
                        window.location.pathname = `/b2b-store/catalog/${pathSegments.join('/')}/all`;
                      }}>
                <i class="bi bi-grid-3x3 me-2"></i>
                View All Products in ${this.categoryPath[this.categoryPath.length - 1].name}
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('category-browser', CategoryBrowser);
