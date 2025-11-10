import{T as l,N as a}from"./index-MMTwS6vP.js";import{getProducts as n}from"./product.service-DZnpiejv.js";import"./product.model-uhuUaOub.js";class d extends l{static properties={products:{type:Array},filteredProducts:{type:Array},loading:{type:Boolean},currentView:{type:String},categoryPath:{type:Array},searchTerm:{type:String},selectedCategories:{type:Array},priceRange:{type:Object},selectedBrands:{type:Array},availabilityFilter:{type:String},sortBy:{type:String},viewMode:{type:String},cart:{type:Array},brands:{type:Array},categoryHierarchy:{type:Array}};constructor(){super(),this.products=[],this.filteredProducts=[],this.loading=!1,this.currentView="categories",this.categoryPath=[],this.searchTerm="",this.selectedCategories=[],this.priceRange={min:0,max:1e4},this.selectedBrands=[],this.availabilityFilter="all",this.sortBy="name-asc",this.viewMode="grid",this.cart=JSON.parse(localStorage.getItem("b2b-cart")||"[]"),this.brands=["Acme Corp","TechPro","Industrial Plus","SupplyMax","Premium Brand"],this.categoryHierarchy=[{id:"electronics",name:"Electronics",icon:"laptop",description:"Computers, monitors, and electronic devices",subcategories:[{id:"computers",name:"Computers & Laptops",subcategories:[{id:"laptops",name:"Laptops",category:"electronics"},{id:"desktops",name:"Desktop Computers",category:"electronics"},{id:"workstations",name:"Workstations",category:"electronics"}]},{id:"peripherals",name:"Peripherals",subcategories:[{id:"keyboards",name:"Keyboards",category:"electronics"},{id:"mice",name:"Mice & Pointing Devices",category:"electronics"},{id:"monitors",name:"Monitors & Displays",category:"electronics"}]},{id:"audio",name:"Audio Equipment",subcategories:[{id:"headphones",name:"Headphones",category:"electronics"},{id:"speakers",name:"Speakers",category:"electronics"},{id:"microphones",name:"Microphones",category:"electronics"}]}]},{id:"tools",name:"Tools & Equipment",icon:"wrench",description:"Power tools, hand tools, and equipment",subcategories:[{id:"power-tools",name:"Power Tools",subcategories:[{id:"drills",name:"Drills & Drivers",category:"tools"},{id:"saws",name:"Saws & Cutting",category:"tools"},{id:"sanders",name:"Sanders & Grinders",category:"tools"}]},{id:"hand-tools",name:"Hand Tools",subcategories:[{id:"wrenches",name:"Wrenches",category:"tools"},{id:"screwdrivers",name:"Screwdrivers",category:"tools"},{id:"pliers",name:"Pliers",category:"tools"}]},{id:"tool-sets",name:"Tool Sets",subcategories:[{id:"mechanic-sets",name:"Mechanic Tool Sets",category:"tools"},{id:"electrician-sets",name:"Electrician Sets",category:"tools"},{id:"general-sets",name:"General Tool Sets",category:"tools"}]}]},{id:"supplies",name:"Office Supplies",icon:"briefcase",description:"Office furniture, supplies, and stationery",subcategories:[{id:"furniture",name:"Office Furniture",subcategories:[{id:"desks",name:"Desks & Tables",category:"supplies"},{id:"chairs",name:"Office Chairs",category:"supplies"},{id:"storage",name:"Storage & Filing",category:"supplies"}]},{id:"stationery",name:"Stationery",subcategories:[{id:"paper",name:"Paper Products",category:"supplies"},{id:"writing",name:"Writing Instruments",category:"supplies"},{id:"folders",name:"Folders & Binders",category:"supplies"}]},{id:"supplies-misc",name:"Supplies & Accessories",subcategories:[{id:"desk-accessories",name:"Desk Accessories",category:"supplies"},{id:"organization",name:"Organization",category:"supplies"},{id:"presentation",name:"Presentation",category:"supplies"}]}]},{id:"equipment",name:"Heavy Equipment",icon:"truck",description:"Industrial equipment and machinery",subcategories:[{id:"material-handling",name:"Material Handling",subcategories:[{id:"carts",name:"Carts & Dollies",category:"equipment"},{id:"lifts",name:"Lifts & Hoists",category:"equipment"},{id:"conveyors",name:"Conveyors",category:"equipment"}]},{id:"ladders-scaffolding",name:"Ladders & Scaffolding",subcategories:[{id:"ladders",name:"Ladders",category:"equipment"},{id:"scaffolding",name:"Scaffolding",category:"equipment"},{id:"platforms",name:"Work Platforms",category:"equipment"}]},{id:"shop-equipment",name:"Shop Equipment",subcategories:[{id:"workbenches",name:"Workbenches",category:"equipment"},{id:"storage-cabinets",name:"Storage Cabinets",category:"equipment"},{id:"tool-chests",name:"Tool Chests",category:"equipment"}]}]},{id:"safety",name:"Safety Gear",icon:"shield-check",description:"Personal protective equipment and safety supplies",subcategories:[{id:"head-protection",name:"Head Protection",subcategories:[{id:"hard-hats",name:"Hard Hats",category:"safety"},{id:"bump-caps",name:"Bump Caps",category:"safety"},{id:"face-shields",name:"Face Shields",category:"safety"}]},{id:"hand-protection",name:"Hand Protection",subcategories:[{id:"work-gloves",name:"Work Gloves",category:"safety"},{id:"cut-resistant",name:"Cut Resistant Gloves",category:"safety"},{id:"chemical-gloves",name:"Chemical Gloves",category:"safety"}]},{id:"visibility",name:"High Visibility",subcategories:[{id:"safety-vests",name:"Safety Vests",category:"safety"},{id:"reflective-tape",name:"Reflective Tape",category:"safety"},{id:"hi-vis-clothing",name:"Hi-Vis Clothing",category:"safety"}]}]}]}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),this.parseCategoryFromURL(),await this.loadProducts()}parseCategoryFromURL(){const t=window.location.pathname.match(/\/b2b-store\/catalog\/(.+)/);if(t){const i=t[1].split("/").filter(s=>s);if(i.length>0){this.categoryPath=[];const s=this.categoryHierarchy.find(r=>r.id===i[0]);if(s){if(this.categoryPath.push(s),i.length===2&&i[1]==="all"){this.currentView="products",this.selectedCategories=[s.id];return}if(i.length>1&&s.subcategories){const r=s.subcategories.find(c=>c.id===i[1]);if(r){if(this.categoryPath.push(r),i.length===3&&i[2]==="all"){this.currentView="products",this.selectedCategories=[s.id];return}if(i.length>2&&r.subcategories){const c=r.subcategories.find(o=>o.id===i[2]);c&&(this.categoryPath.push(c),this.currentView="products",this.selectedCategories=[c.category])}}}}}}}async loadProducts(){this.loading=!0;try{const t=await n({status:"active"});this.products=t?.data||t||[],Array.isArray(this.products)||(this.products=[]),this.applyFilters()}catch(e){console.error("Failed to load products:",e),this.products=[],this.filteredProducts=[]}finally{this.loading=!1}}applyFilters(){Array.isArray(this.products)||(this.products=[]);let e=[...this.products];if(this.searchTerm){const t=this.searchTerm.toLowerCase();e=e.filter(i=>i.name.toLowerCase().includes(t)||i.sku.toLowerCase().includes(t)||(i.description||"").toLowerCase().includes(t))}this.selectedCategories.length>0&&(e=e.filter(t=>this.selectedCategories.includes(t.category))),this.selectedBrands.length>0&&(e=e.filter(t=>this.selectedBrands.includes(t.brand||"Unknown"))),e=e.filter(t=>t.price>=this.priceRange.min&&t.price<=this.priceRange.max),this.availabilityFilter==="inStock"?e=e.filter(t=>t.stock>10):this.availabilityFilter==="lowStock"&&(e=e.filter(t=>t.stock>0&&t.stock<=10)),e=this.sortProducts(e),this.filteredProducts=e}sortProducts(e){const t=[...e];switch(this.sortBy){case"name-asc":return t.sort((i,s)=>i.name.localeCompare(s.name));case"name-desc":return t.sort((i,s)=>s.name.localeCompare(i.name));case"price-asc":return t.sort((i,s)=>i.price-s.price);case"price-desc":return t.sort((i,s)=>s.price-i.price);case"stock-asc":return t.sort((i,s)=>i.stock-s.stock);case"stock-desc":return t.sort((i,s)=>s.stock-i.stock);default:return t}}handleSearch(e){this.searchTerm=e.target.value,this.applyFilters()}handleCategoryToggle(e){this.selectedCategories.includes(e)?this.selectedCategories=this.selectedCategories.filter(t=>t!==e):this.selectedCategories=[...this.selectedCategories,e],this.applyFilters()}handleBrandToggle(e){this.selectedBrands.includes(e)?this.selectedBrands=this.selectedBrands.filter(t=>t!==e):this.selectedBrands=[...this.selectedBrands,e],this.applyFilters()}handlePriceRangeChange(e){this.priceRange.max=parseInt(e.target.value),this.applyFilters()}handleAvailabilityFilter(e){this.availabilityFilter=e,this.applyFilters()}handleSortChange(e){this.sortBy=e.target.value,this.applyFilters()}clearAllFilters(){this.searchTerm="",this.selectedCategories=[],this.selectedBrands=[],this.priceRange={min:0,max:1e4},this.availabilityFilter="all",this.sortBy="name-asc",this.applyFilters()}get activeFilterCount(){let e=0;return this.searchTerm&&e++,this.selectedCategories.length>0&&e++,this.selectedBrands.length>0&&e++,this.priceRange.max<1e4&&e++,this.availabilityFilter!=="all"&&e++,e}handleAddToCart(e,t=1){const i={productId:e.id,name:e.name,sku:e.sku,price:e.price,quantity:t,total:e.price*t},s=this.cart.findIndex(r=>r.productId===e.id);s>-1?(this.cart[s].quantity+=t,this.cart[s].total=this.cart[s].price*this.cart[s].quantity):this.cart.push(i),localStorage.setItem("b2b-cart",JSON.stringify(this.cart)),this.requestUpdate(),alert(`Added ${e.name} to cart`)}formatCurrency(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(e)}get cartItemCount(){return this.cart.reduce((e,t)=>e+t.quantity,0)}handleCategoryClick(e){window.location.pathname=`/b2b-store/catalog/${e.id}`}handleSubcategoryClick(e){const t=this.categoryPath[0].id;window.location.pathname=`/b2b-store/catalog/${t}/${e.id}`}handleFinalCategoryClick(e){const t=this.categoryPath[0].id,i=this.categoryPath[1].id;window.location.pathname=`/b2b-store/catalog/${t}/${i}/${e.id}`}handleBreadcrumbClick(e){if(e===-1)window.location.pathname="/b2b-store/catalog";else{const t=this.categoryPath.slice(0,e+1).map(i=>i.id);window.location.pathname=`/b2b-store/catalog/${t.join("/")}`}}handleViewAllProducts(e){const t=this.categoryPath.map(i=>i.id);t.length===1?window.location.pathname=`/b2b-store/catalog/${t[0]}/all`:window.location.pathname=`/b2b-store/catalog/${t.join("/")}/all`}getCurrentCategories(){return this.categoryPath.length===0?this.categoryHierarchy:this.categoryPath.length===1?this.categoryPath[0].subcategories||[]:this.categoryPath.length===2?this.categoryPath[1].subcategories||[]:[]}renderCategoryBrowsing(){const e=this.getCurrentCategories(),t=this.categoryPath.length===0,i=this.categoryPath.length===2;return a`
      <div class="row">
        ${t?a`
          <div class="col-12 mb-4">
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              <strong>Browse by Category:</strong> Select a category to explore our products
            </div>
          </div>
        `:""}

        ${e.map(s=>a`
          <div class="col-md-${t?"4":"6"} col-lg-${t?"3":"4"} mb-4">
            <div class="card h-100 shadow-sm hover-shadow" style="cursor: pointer; transition: all 0.3s;">
              <div class="card-body text-center" @click=${()=>{i?this.handleFinalCategoryClick(s):this.categoryPath.length===1?this.handleSubcategoryClick(s):this.handleCategoryClick(s)}}>
                ${t&&s.icon?a`
                  <i class="bi bi-${s.icon}" style="font-size: 3rem; color: #0d6efd;"></i>
                `:a`
                  <i class="bi bi-folder" style="font-size: 2.5rem; color: #6c757d;"></i>
                `}
                <h5 class="mt-3 mb-2">${s.name}</h5>
                ${s.description?a`
                  <p class="text-muted small mb-0">${s.description}</p>
                `:""}
                ${s.subcategories?a`
                  <p class="text-muted small mt-2 mb-0">
                    <i class="bi bi-arrow-right-circle me-1"></i>
                    ${s.subcategories.length} subcategories
                  </p>
                `:""}
              </div>
              ${i?a`
                <div class="card-footer bg-primary text-white text-center">
                  <i class="bi bi-box-seam me-2"></i>View Products
                </div>
              `:""}
            </div>
          </div>
        `)}
      </div>

      ${this.categoryPath.length>0&&this.categoryPath[this.categoryPath.length-1].id?a`
        <div class="row mt-3">
          <div class="col-12">
            <button class="btn btn-lg btn-outline-primary w-100" 
                    @click=${()=>this.handleViewAllProducts(this.categoryPath[this.categoryPath.length-1])}>
              <i class="bi bi-grid-3x3 me-2"></i>
              View All Products in ${this.categoryPath[this.categoryPath.length-1].name}
            </button>
          </div>
        </div>
      `:""}
    `}renderProductsView(){return a`
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
              ${this.brands.map(e=>a`
                <div class="form-check mb-2">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="brand-${e.replace(/\s/g,"-")}"
                    ?checked=${this.selectedBrands.includes(e)}
                    @change=${()=>this.handleBrandToggle(e)}
                  >
                  <label class="form-check-label" for="brand-${e.replace(/\s/g,"-")}">
                    ${e}
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
                  ?checked=${this.availabilityFilter==="all"}
                  @change=${()=>this.handleAvailabilityFilter("all")}
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
                  ?checked=${this.availabilityFilter==="inStock"}
                  @change=${()=>this.handleAvailabilityFilter("inStock")}
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
                  ?checked=${this.availabilityFilter==="lowStock"}
                  @change=${()=>this.handleAvailabilityFilter("lowStock")}
                >
                <label class="form-check-label" for="avail-lowstock">
                  <span class="badge bg-warning text-dark">Low Stock</span> (1-10 units)
                </label>
              </div>
            </div>
          </div>

          ${this.activeFilterCount>0?a`
            <button class="btn btn-outline-secondary w-100" @click=${this.clearAllFilters}>
              <i class="bi bi-x-circle me-2"></i>Clear All Filters
            </button>
          `:""}
        </div>

        <!-- Products Grid -->
        <div class="col-md-9">
          <!-- Toolbar -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <strong>${this.filteredProducts.length}</strong> of <strong>${this.products.length}</strong> products
                  ${this.activeFilterCount>0?a`
                    <span class="badge bg-primary ms-2">${this.activeFilterCount} filter(s)</span>
                  `:""}
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
                    <button class="btn ${this.viewMode==="grid"?"btn-primary":"btn-outline-secondary"}"
                            @click=${()=>this.viewMode="grid"}
                            title="Grid View">
                      <i class="bi bi-grid"></i>
                    </button>
                    <button class="btn ${this.viewMode==="list"?"btn-primary":"btn-outline-secondary"}"
                            @click=${()=>this.viewMode="list"}
                            title="List View">
                      <i class="bi bi-list"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          ${this.loading?a`
            <div class="text-center py-5">
              <div class="spinner-border text-primary"></div>
              <p class="mt-2 text-muted">Loading products...</p>
            </div>
          `:""}

          ${!this.loading&&this.filteredProducts.length===0?a`
            <div class="card">
              <div class="card-body text-center py-5">
                <i class="bi bi-search" style="font-size: 3rem; color: #ccc;"></i>
                <h4 class="mt-3">No Products Found</h4>
                <p class="text-muted mb-3">Try adjusting your filters or browse other categories</p>
                <button class="btn btn-primary" @click=${()=>this.handleBreadcrumbClick(-1)}>
                  <i class="bi bi-arrow-left me-2"></i>Back to Categories
                </button>
              </div>
            </div>
          `:""}

          <!-- Grid View -->
          ${!this.loading&&this.viewMode==="grid"&&this.filteredProducts.length>0?a`
            <div class="row g-3">
              ${this.filteredProducts.map(e=>a`
                <div class="col-md-4">
                  <div class="card h-100">
                    <div class="card-body">
                      <div class="bg-light rounded mb-3 position-relative" style="height: 200px; display: flex; align-items: center; justify-content: center;">
                        ${e.imageUrl?a`
                          <img src="${e.imageUrl}" alt="${e.name}" class="img-fluid" />
                        `:a`
                          <i class="bi bi-box" style="font-size: 4rem; color: #ccc;"></i>
                        `}
                        ${e.stock<10?a`
                          <span class="position-absolute top-0 end-0 m-2 badge bg-warning text-dark">
                            Low Stock
                          </span>
                        `:""}
                      </div>
                      <h6 class="mb-2">${e.name}</h6>
                      <p class="text-muted small mb-2">SKU: ${e.sku}</p>
                      ${e.description?a`
                        <p class="small text-muted mb-3">${e.description.substring(0,80)}...</p>
                      `:""}
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div class="fw-bold text-primary fs-5">${this.formatCurrency(e.price)}</div>
                          <small class="text-muted">In Stock: ${e.stock}</small>
                        </div>
                      </div>
                      <div class="input-group input-group-sm mb-2">
                        <input type="number" class="form-control" value="1" min="1" id="qty-${e.id}">
                        <button class="btn btn-primary" @click=${()=>{const t=parseInt(document.getElementById(`qty-${e.id}`).value)||1;this.handleAddToCart(e,t)}}>
                          <i class="bi bi-cart-plus me-1"></i>Add
                        </button>
                      </div>
                      <button class="btn btn-sm btn-outline-secondary w-100" 
                              @click=${()=>window.location.pathname=`/b2b-store/product/${e.id}`}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              `)}
            </div>
          `:""}

          <!-- List View -->
          ${!this.loading&&this.viewMode==="list"&&this.filteredProducts.length>0?a`
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
                    ${this.filteredProducts.map(e=>a`
                      <tr>
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="bg-light rounded me-3" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                              <i class="bi bi-box" style="font-size: 2rem; color: #ccc;"></i>
                            </div>
                            <div>
                              <div class="fw-bold">${e.name}</div>
                              <small class="text-muted">${e.description?.substring(0,50)||""}</small>
                            </div>
                          </div>
                        </td>
                        <td><code>${e.sku}</code></td>
                        <td class="fw-bold text-primary">${this.formatCurrency(e.price)}</td>
                        <td>
                          <span class="badge ${e.stock>10?"bg-success":"bg-warning text-dark"}">
                            ${e.stock}
                          </span>
                        </td>
                        <td>
                          <input type="number" class="form-control form-control-sm" 
                                 style="width: 80px;" value="1" min="1" id="qty-list-${e.id}">
                        </td>
                        <td>
                          <button class="btn btn-sm btn-primary" @click=${()=>{const t=parseInt(document.getElementById(`qty-list-${e.id}`).value)||1;this.handleAddToCart(e,t)}}>
                            <i class="bi bi-cart-plus me-1"></i>Add to Cart
                          </button>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            </div>
          `:""}
        </div>
      </div>
    `}render(){return a`
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
            <button class="btn btn-outline-primary position-relative" @click=${()=>window.location.pathname="/b2b-store/cart"}>
              <i class="bi bi-cart3 me-2"></i>Cart
              ${this.cartItemCount>0?a`
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  ${this.cartItemCount}
                </span>
              `:""}
            </button>
            <button class="btn btn-primary" @click=${()=>window.location.pathname="/b2b-store/quick-order"}>
              <i class="bi bi-lightning me-2"></i>Quick Order
            </button>
          </div>
        </div>

        <!-- Breadcrumb Navigation -->
        ${this.categoryPath.length>0||this.currentView==="products"?a`
          <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="/b2b-store/catalog" class="text-decoration-none">
                  <i class="bi bi-house me-1"></i>All Categories
                </a>
              </li>
              ${this.categoryPath.map((e,t)=>{const i=t===this.categoryPath.length-1&&this.currentView!=="products",r=`/b2b-store/catalog/${this.categoryPath.slice(0,t+1).map(c=>c.id).join("/")}`;return a`
                  <li class="breadcrumb-item ${i?"active":""}">
                    ${i?a`
                      ${e.name}
                    `:a`
                      <a href="${r}" class="text-decoration-none">
                        ${e.name}
                      </a>
                    `}
                  </li>
                `})}
              ${this.currentView==="products"?a`
                <li class="breadcrumb-item active">Products</li>
              `:""}
            </ol>
          </nav>
        `:""}

        <!-- Category Browsing View -->
        ${this.currentView==="categories"?this.renderCategoryBrowsing():""}

        <!-- Products View -->
        ${this.currentView==="products"?this.renderProductsView():""}
      </div>

      <!-- Product Compare Component -->
      <product-compare></product-compare>
    `}}customElements.define("product-catalog",d);
