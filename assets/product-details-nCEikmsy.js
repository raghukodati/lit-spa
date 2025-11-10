import{T as a,N as s}from"./index-MMTwS6vP.js";import{getProductById as l}from"./product.service-DZnpiejv.js";import"./product-compare-B9KusZP2.js";import"./product.model-uhuUaOub.js";class o extends a{static properties={currentProduct:{type:Object},crossSellProducts:{type:Array},loading:{type:Boolean}};constructor(){super(),this.currentProduct=null,this.crossSellProducts=[],this.loading=!1}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),this.currentProduct&&await this.loadCrossSellProducts()}async loadCrossSellProducts(){this.loading=!0;try{this.crossSellProducts=this.generateCrossSellProducts()}catch(t){console.error("Failed to load cross-sell products:",t)}finally{this.loading=!1}}generateCrossSellProducts(){return[{id:101,name:"Wireless Mouse",price:29.99,image:null,reason:"Customers who bought this also bought"},{id:102,name:"USB-C Cable",price:14.99,image:null,reason:"Perfect complement"},{id:103,name:"Laptop Stand",price:49.99,image:null,reason:"Frequently bought together"}].slice(0,3)}handleAddToCart(t){this.dispatchEvent(new CustomEvent("add-to-cart",{detail:{product:t,quantity:1},bubbles:!0,composed:!0}))}handleAddToCompare(t){window.dispatchEvent(new CustomEvent("add-to-compare",{detail:{product:t}}))}handleAddAllToCart(){const t=[this.currentProduct,...this.crossSellProducts];this.dispatchEvent(new CustomEvent("add-bundle-to-cart",{detail:{products:t},bubbles:!0,composed:!0}))}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}get totalBundlePrice(){const t=this.currentProduct?.price||0,e=this.crossSellProducts.reduce((i,c)=>i+c.price,0);return t+e}get bundleSavings(){return this.totalBundlePrice*.1}render(){return!this.currentProduct||this.crossSellProducts.length===0?s``:s`
      <div class="card border-success mt-4">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0">
            <i class="bi bi-cart-plus me-2"></i>Frequently Bought Together
          </h5>
        </div>
        <div class="card-body">
          <!-- Bundle Items -->
          <div class="row align-items-center mb-3">
            <!-- Current Product -->
            <div class="col-md-3 text-center mb-3">
              <div class="bg-light rounded p-3 mb-2" style="height: 120px; display: flex; align-items: center; justify-content: center;">
                <i class="bi bi-box" style="font-size: 3rem; color: #0d6efd;"></i>
              </div>
              <h6 class="small fw-bold">${this.currentProduct.name}</h6>
              <p class="text-primary fw-bold mb-0">${this.formatCurrency(this.currentProduct.price)}</p>
              <small class="text-success"><i class="bi bi-check-circle-fill me-1"></i>This item</small>
            </div>

            ${this.crossSellProducts.map((t,e)=>s`
              ${e===0?s`
                <div class="col-auto text-center mb-3">
                  <i class="bi bi-plus-lg" style="font-size: 2rem; color: #6c757d;"></i>
                </div>
              `:s`
                <div class="col-auto text-center mb-3">
                  <i class="bi bi-plus-lg" style="font-size: 2rem; color: #6c757d;"></i>
                </div>
              `}
              
              <div class="col-md-2 text-center mb-3">
                <div class="bg-light rounded p-3 mb-2" style="height: 120px; display: flex; align-items: center; justify-content: center;">
                  <i class="bi bi-box" style="font-size: 2.5rem; color: #6c757d;"></i>
                </div>
                <h6 class="small">${t.name}</h6>
                <p class="text-primary fw-bold mb-0">${this.formatCurrency(t.price)}</p>
                <div class="d-flex gap-1 justify-content-center mt-1">
                  <button class="btn btn-sm btn-outline-primary" 
                          @click=${()=>this.handleAddToCart(t)}
                          title="Add to Cart">
                    <i class="bi bi-plus"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-info" 
                          @click=${()=>this.handleAddToCompare(t)}
                          title="Add to Compare">
                    <i class="bi bi-clipboard-check"></i>
                  </button>
                </div>
              </div>
            `)}
          </div>

          <!-- Bundle Pricing -->
          <div class="alert alert-info mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>Bundle Price:</strong>
                <span class="text-decoration-line-through text-muted ms-2">
                  ${this.formatCurrency(this.totalBundlePrice)}
                </span>
                <span class="text-success fw-bold fs-5 ms-2">
                  ${this.formatCurrency(this.totalBundlePrice-this.bundleSavings)}
                </span>
              </div>
              <div>
                <span class="badge bg-success fs-6">
                  Save ${this.formatCurrency(this.bundleSavings)}
                </span>
              </div>
            </div>
          </div>

          <!-- Add All to Cart Button -->
          <button class="btn btn-success btn-lg w-100" @click=${this.handleAddAllToCart}>
            <i class="bi bi-cart-check me-2"></i>
            Add All ${this.crossSellProducts.length+1} Items to Cart
          </button>
          
          <p class="text-center text-muted small mt-2 mb-0">
            <i class="bi bi-info-circle me-1"></i>
            Based on customer purchase patterns
          </p>
        </div>
      </div>
    `}}customElements.define("cross-sell",o);class d extends a{static properties={currentProduct:{type:Object},upsellProducts:{type:Array},loading:{type:Boolean}};constructor(){super(),this.currentProduct=null,this.upsellProducts=[],this.loading=!1}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),this.currentProduct&&await this.loadUpsellProducts()}async loadUpsellProducts(){this.loading=!0;try{this.upsellProducts=this.generateUpsellProducts()}catch(t){console.error("Failed to load upsell products:",t)}finally{this.loading=!1}}generateUpsellProducts(){return[{id:201,name:"Professional Laptop Pro",price:1599.99,compareAtPrice:1799.99,features:["16GB RAM","1TB SSD","Intel i9","4K Display"],badge:"Most Popular",badgeColor:"primary",image:null},{id:202,name:"Professional Laptop Premium",price:1899.99,compareAtPrice:2199.99,features:["32GB RAM","2TB SSD","Intel i9","4K OLED"],badge:"Best Value",badgeColor:"success",image:null},{id:203,name:"Professional Laptop Ultimate",price:2299.99,compareAtPrice:2599.99,features:["64GB RAM","4TB SSD","Intel i9","4K OLED Touch"],badge:"Premium",badgeColor:"warning",image:null}]}handleSelectProduct(t){this.dispatchEvent(new CustomEvent("product-selected",{detail:{product:t},bubbles:!0,composed:!0})),window.location.pathname=`/b2b-store/product/${t.id}`}handleAddToCart(t){this.dispatchEvent(new CustomEvent("add-to-cart",{detail:{product:t,quantity:1},bubbles:!0,composed:!0}))}handleAddToCompare(t){window.dispatchEvent(new CustomEvent("add-to-compare",{detail:{product:t}}))}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}calculateSavings(t){return t.compareAtPrice&&t.compareAtPrice>t.price?t.compareAtPrice-t.price:0}render(){return!this.currentProduct||this.upsellProducts.length===0?s``:s`
      <div class="card border-primary mt-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">
            <i class="bi bi-arrow-up-circle me-2"></i>Consider Upgrading
          </h5>
          <small>Better performance, more features, greater value</small>
        </div>
        <div class="card-body">
          <div class="row">
            ${this.upsellProducts.map(t=>s`
              <div class="col-md-4 mb-3">
                <div class="card h-100 border-2 ${t.badge==="Best Value"?"border-success shadow":""}">
                  ${t.badge?s`
                    <div class="card-header bg-${t.badgeColor} text-white text-center py-2">
                      <strong>${t.badge}</strong>
                    </div>
                  `:""}
                  
                  <div class="card-body">
                    <!-- Product Image -->
                    <div class="bg-light rounded mb-3" style="height: 150px; display: flex; align-items: center; justify-content: center;">
                      <i class="bi bi-laptop" style="font-size: 4rem; color: #0d6efd;"></i>
                    </div>

                    <!-- Product Name -->
                    <h6 class="fw-bold mb-2">${t.name}</h6>

                    <!-- Pricing -->
                    <div class="mb-3">
                      <div class="d-flex align-items-baseline gap-2">
                        <span class="h4 text-primary mb-0">${this.formatCurrency(t.price)}</span>
                        ${t.compareAtPrice?s`
                          <span class="text-muted text-decoration-line-through small">
                            ${this.formatCurrency(t.compareAtPrice)}
                          </span>
                        `:""}
                      </div>
                      ${this.calculateSavings(t)>0?s`
                        <span class="badge bg-success">
                          Save ${this.formatCurrency(this.calculateSavings(t))}
                        </span>
                      `:""}
                    </div>

                    <!-- Features -->
                    ${t.features?s`
                      <ul class="list-unstyled small mb-3">
                        ${t.features.map(e=>s`
                          <li class="mb-1">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            ${e}
                          </li>
                        `)}
                      </ul>
                    `:""}

                    <!-- Price Difference -->
                    ${this.currentProduct.price?s`
                      <div class="alert alert-info small mb-3">
                        <i class="bi bi-info-circle me-1"></i>
                        Only <strong>${this.formatCurrency(t.price-this.currentProduct.price)}</strong> more
                      </div>
                    `:""}

                    <!-- Actions -->
                    <div class="d-grid gap-2">
                      <button class="btn btn-primary" @click=${()=>this.handleSelectProduct(t)}>
                        <i class="bi bi-arrow-right-circle me-2"></i>Choose This
                      </button>
                      <button class="btn btn-sm btn-outline-primary" @click=${()=>this.handleAddToCart(t)}>
                        <i class="bi bi-cart-plus me-2"></i>Add to Cart
                      </button>
                      <button class="btn btn-sm btn-outline-info" @click=${()=>this.handleAddToCompare(t)}>
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
            <button class="btn btn-link" @click=${()=>this.dispatchEvent(new CustomEvent("show-comparison"))}>
              <i class="bi bi-columns-gap me-2"></i>
              Compare All Options Side-by-Side
            </button>
          </div>
        </div>
      </div>
    `}}customElements.define("upsell-products",d);class n extends a{static properties={product:{type:Object},loading:{type:Boolean},quantity:{type:Number},cart:{type:Array},selectedImage:{type:String}};constructor(){super(),this.product=null,this.loading=!0,this.quantity=1,this.cart=JSON.parse(localStorage.getItem("b2b-cart")||"[]"),this.selectedImage=null}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadProduct()}async loadProduct(){this.loading=!0;try{const t=window.location.pathname.split("/"),e=t[t.length-1];this.product=await l(e),this.product&&(this.selectedImage=this.product.featuredImage)}catch(t){console.error("Failed to load product:",t)}finally{this.loading=!1}}handleQuantityChange(t){const e=parseInt(t.target.value);this.quantity=e>0?e:1}handleAddToCart(){if(!this.product)return;const t={productId:this.product.id,name:this.product.name,sku:this.product.sku,price:this.product.price,quantity:this.quantity,total:this.product.price*this.quantity},e=this.cart.findIndex(i=>i.productId===this.product.id);e>-1?(this.cart[e].quantity+=this.quantity,this.cart[e].total=this.cart[e].price*this.cart[e].quantity):this.cart.push(t),localStorage.setItem("b2b-cart",JSON.stringify(this.cart)),this.requestUpdate(),alert(`Added ${this.quantity} × ${this.product.name} to cart`)}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}get totalPrice(){return this.product?this.product.price*this.quantity:0}get cartItemCount(){return this.cart.reduce((t,e)=>t+e.quantity,0)}render(){return this.loading?s`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading product...</p>
          </div>
        </div>
      `:this.product?s`
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
          <button class="btn btn-outline-primary position-relative" @click=${()=>window.location.pathname="/b2b-store/cart"}>
            <i class="bi bi-cart3 me-2"></i>Cart
            ${this.cartItemCount>0?s`
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                ${this.cartItemCount}
              </span>
            `:""}
          </button>
        </div>

        <div class="row">
          <!-- Product Image -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <div class="bg-light rounded mb-3" style="height: 400px; display: flex; align-items: center; justify-content: center;">
                  ${this.selectedImage?s`
                    <img src="${this.selectedImage}" alt="${this.product.name}" class="img-fluid" style="max-height: 380px;" />
                  `:s`
                    <i class="bi bi-box" style="font-size: 8rem; color: #ccc;"></i>
                  `}
                </div>
                ${this.product.status==="active"&&this.product.stock>0?s`
                  <div class="d-flex gap-2 justify-content-center">
                    <span class="badge ${this.product.stock>10?"bg-success":"bg-warning text-dark"}">
                      <i class="bi bi-check-circle me-1"></i>
                      ${this.product.stock>10?"In Stock":"Low Stock"} (${this.product.stock} units)
                    </span>
                  </div>
                `:s`
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
                  ${this.product.brand?s`
                    <span class="badge bg-secondary ms-2">${this.product.brand}</span>
                  `:""}
                </div>
                
                <h2 class="mb-3">${this.product.name}</h2>
                
                <div class="mb-3">
                  <p class="text-muted mb-1">SKU: <code>${this.product.sku}</code></p>
                  ${this.product.subcategory?s`
                    <p class="text-muted mb-0">Category: ${this.product.subcategory}</p>
                  `:""}
                </div>

                ${this.product.description?s`
                  <p class="mb-4">${this.product.description}</p>
                `:""}

                <!-- Price -->
                <div class="mb-4 pb-4 border-bottom">
                  <div class="d-flex align-items-baseline gap-3">
                    <h3 class="text-primary mb-0">${this.formatCurrency(this.product.price)}</h3>
                    ${this.product.compareAtPrice&&this.product.compareAtPrice>this.product.price?s`
                      <span class="text-muted text-decoration-line-through">${this.formatCurrency(this.product.compareAtPrice)}</span>
                      <span class="badge bg-success">
                        ${Math.round((1-this.product.price/this.product.compareAtPrice)*100)}% OFF
                      </span>
                    `:""}
                  </div>
                  <small class="text-muted">Price per unit</small>
                </div>

                <!-- Quantity & Add to Cart -->
                ${this.product.stock>0?s`
                  <div class="mb-3">
                    <label class="form-label fw-bold">Quantity</label>
                    <div class="input-group input-group-lg mb-3">
                      <button class="btn btn-outline-secondary" @click=${()=>{this.quantity>1&&this.quantity--}}>
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
                      <button class="btn btn-outline-secondary" @click=${()=>{this.quantity<this.product.stock&&this.quantity++}}>
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
                      <button class="btn btn-outline-info" @click=${()=>{window.dispatchEvent(new CustomEvent("add-to-compare",{detail:{product:this.product}}))}}>
                        <i class="bi bi-clipboard-check me-2"></i>Add to Compare
                      </button>
                    </div>

                    <div class="d-grid gap-2">
                      <button class="btn btn-outline-secondary" @click=${()=>window.location.pathname="/b2b-store/catalog"}>
                        <i class="bi bi-arrow-left me-2"></i>Continue Shopping
                      </button>
                    </div>
                  </div>
                `:s`
                  <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    This product is currently out of stock
                  </div>
                  <button class="btn btn-outline-secondary w-100" @click=${()=>window.location.pathname="/b2b-store/catalog"}>
                    <i class="bi bi-arrow-left me-2"></i>Back to Catalog
                  </button>
                `}
              </div>
            </div>

            <!-- Additional Info -->
            ${this.product.tags&&this.product.tags.length>0?s`
              <div class="card mt-3">
                <div class="card-header">
                  <h6 class="mb-0">Product Tags</h6>
                </div>
                <div class="card-body">
                  ${this.product.tags.map(t=>s`
                    <span class="badge bg-light text-dark me-1 mb-1">#${t}</span>
                  `)}
                </div>
              </div>
            `:""}
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
                        ${this.product.subcategory?s`
                          <tr>
                            <th>Subcategory:</th>
                            <td>${this.product.subcategory}</td>
                          </tr>
                        `:""}
                        ${this.product.brand?s`
                          <tr>
                            <th>Brand:</th>
                            <td>${this.product.brand}</td>
                          </tr>
                        `:""}
                        <tr>
                          <th>Availability:</th>
                          <td>
                            ${this.product.stock>0?s`
                              <span class="badge ${this.product.stock>10?"bg-success":"bg-warning text-dark"}">
                                ${this.product.stock} units available
                              </span>
                            `:s`
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
    `:s`
        <div class="container-fluid mt-4">
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #dc3545;"></i>
              <h3 class="mt-3">Product Not Found</h3>
              <p class="text-muted">The product you're looking for doesn't exist.</p>
              <button class="btn btn-primary mt-3" @click=${()=>window.location.pathname="/b2b-store/catalog"}>
                <i class="bi bi-arrow-left me-2"></i>Back to Catalog
              </button>
            </div>
          </div>
        </div>
      `}}customElements.define("product-details",n);
