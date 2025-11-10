import{N as a}from"./index-DeW_3Z4T.js";import{B as r}from"./BaseComponent-RCMQUWYM.js";import{P as c}from"./product.model-uhuUaOub.js";class l extends r{static properties={productId:{type:String},product:{type:Object},categories:{type:Array},brands:{type:Array},loading:{type:Boolean},saving:{type:Boolean},errors:{type:Array}};constructor(){super(),this.productId=null,this.product=new c,this.categories=[],this.brands=[],this.loading=!1,this.saving=!1,this.errors=[],this._productService=null}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),this._productService||(this._productService=await this.getService("productService"));const e=window.location.pathname.match(/\/website\/products\/edit\/(\d+)/);e&&(this.productId=e[1],await this.loadProduct()),await this.loadFilters()}async loadProduct(){this.loading=!0;try{this._productService||(this._productService=await this.getService("productService")),this.product=await this._productService.getProductById(this.productId),this.product||(alert("Product not found"),window.location.pathname="/website/products")}catch(t){console.error("Failed to load product:",t),alert("Failed to load product")}finally{this.loading=!1}}async loadFilters(){try{this._productService||(this._productService=await this.getService("productService")),this.categories=await this._productService.getProductCategories(),this.brands=await this._productService.getProductBrands()}catch(t){console.error("Failed to load filters:",t)}}handleInputChange(t,e){this.product={...this.product,[t]:e}}handleCheckboxChange(t,e){this.product={...this.product,[t]:e}}async handleSubmit(t){t.preventDefault(),this.errors=[],this.saving=!0;try{const s=new c(this.product).validate();if(!s.isValid){this.errors=s.errors,this.saving=!1;return}this._productService||(this._productService=await this.getService("productService"));const i=this.productId?"update":"create";if(!this.can("products",i)){alert(`You do not have permission to ${i} products`),this.saving=!1;return}this.productId?(await this._productService.updateProduct(this.productId,this.product),alert("Product updated successfully")):(await this._productService.createProduct(this.product),alert("Product created successfully")),window.location.pathname="/website/products"}catch(e){console.error("Failed to save product:",e),this.errors=[e.message]}finally{this.saving=!1}}handleCancel(){window.location.pathname="/website/products"}render(){return this.loading?a`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border" role="status"></div>
            <p class="mt-2">Loading product...</p>
          </div>
        </div>
      `:a`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>${this.productId?"Edit Product":"Add New Product"}</h2>
          <button class="btn btn-secondary" @click="${this.handleCancel}">
            <i class="bi bi-arrow-left"></i> Back to Products
          </button>
        </div>

        ${this.errors.length>0?a`
          <div class="alert alert-danger">
            <strong>Please fix the following errors:</strong>
            <ul class="mb-0 mt-2">
              ${this.errors.map(t=>a`<li>${t}</li>`)}
            </ul>
          </div>
        `:""}

        <form @submit="${this.handleSubmit}">
          <div class="row">
            <!-- Left Column -->
            <div class="col-md-8">
              <!-- Basic Information -->
              <div class="card mb-3">
                <div class="card-header">
                  <h5 class="mb-0">Basic Information</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Product Name *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      .value="${this.product.name}"
                      @input="${t=>this.handleInputChange("name",t.target.value)}"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">SKU *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      .value="${this.product.sku}"
                      @input="${t=>this.handleInputChange("sku",t.target.value)}"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea 
                      class="form-control" 
                      rows="4"
                      .value="${this.product.description}"
                      @input="${t=>this.handleInputChange("description",t.target.value)}"
                    ></textarea>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Short Description</label>
                    <textarea 
                      class="form-control" 
                      rows="2"
                      .value="${this.product.shortDescription}"
                      @input="${t=>this.handleInputChange("shortDescription",t.target.value)}"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Pricing -->
              <div class="card mb-3">
                <div class="card-header">
                  <h5 class="mb-0">Pricing</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <label class="form-label">Price *</label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          class="form-control" 
                          .value="${this.product.price}"
                          @input="${t=>this.handleInputChange("price",parseFloat(t.target.value)||0)}"
                          required
                        />
                      </div>
                    </div>

                    <div class="col-md-4 mb-3">
                      <label class="form-label">Compare At Price</label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          class="form-control" 
                          .value="${this.product.compareAtPrice}"
                          @input="${t=>this.handleInputChange("compareAtPrice",parseFloat(t.target.value)||0)}"
                        />
                      </div>
                    </div>

                    <div class="col-md-4 mb-3">
                      <label class="form-label">Cost</label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          class="form-control" 
                          .value="${this.product.cost}"
                          @input="${t=>this.handleInputChange("cost",parseFloat(t.target.value)||0)}"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-check">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          .checked="${this.product.taxable}"
                          @change="${t=>this.handleCheckboxChange("taxable",t.target.checked)}"
                        />
                        <label class="form-check-label">Taxable</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Inventory -->
              <div class="card mb-3">
                <div class="card-header">
                  <h5 class="mb-0">Inventory</h5>
                </div>
                <div class="card-body">
                  <div class="form-check mb-3">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      .checked="${this.product.trackInventory}"
                      @change="${t=>this.handleCheckboxChange("trackInventory",t.target.checked)}"
                    />
                    <label class="form-check-label">Track inventory</label>
                  </div>

                  ${this.product.trackInventory?a`
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Stock Quantity</label>
                        <input 
                          type="number" 
                          class="form-control" 
                          .value="${this.product.stock}"
                          @input="${t=>this.handleInputChange("stock",parseInt(t.target.value)||0)}"
                        />
                      </div>

                      <div class="col-md-6 mb-3">
                        <label class="form-label">Low Stock Threshold</label>
                        <input 
                          type="number" 
                          class="form-control" 
                          .value="${this.product.lowStockThreshold}"
                          @input="${t=>this.handleInputChange("lowStockThreshold",parseInt(t.target.value)||0)}"
                        />
                      </div>
                    </div>

                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        .checked="${this.product.allowBackorder}"
                        @change="${t=>this.handleCheckboxChange("allowBackorder",t.target.checked)}"
                      />
                      <label class="form-check-label">Allow backorders</label>
                    </div>
                  `:""}
                </div>
              </div>

              <!-- Shipping -->
              <div class="card mb-3">
                <div class="card-header">
                  <h5 class="mb-0">Shipping</h5>
                </div>
                <div class="card-body">
                  <div class="form-check mb-3">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      .checked="${this.product.requiresShipping}"
                      @change="${t=>this.handleCheckboxChange("requiresShipping",t.target.checked)}"
                    />
                    <label class="form-check-label">This product requires shipping</label>
                  </div>

                  ${this.product.requiresShipping?a`
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Weight</label>
                        <div class="input-group">
                          <input 
                            type="number" 
                            step="0.01"
                            class="form-control" 
                            .value="${this.product.weight}"
                            @input="${t=>this.handleInputChange("weight",parseFloat(t.target.value)||0)}"
                          />
                          <select 
                            class="form-select"
                            style="max-width: 100px;"
                            .value="${this.product.weightUnit}"
                            @change="${t=>this.handleInputChange("weightUnit",t.target.value)}"
                          >
                            <option value="kg">kg</option>
                            <option value="lb">lb</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  `:""}
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="col-md-4">
              <!-- Status -->
              <div class="card mb-3">
                <div class="card-header">
                  <h5 class="mb-0">Status</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Product Status</label>
                    <select 
                      class="form-select"
                      .value="${this.product.status}"
                      @change="${t=>this.handleInputChange("status",t.target.value)}"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      .checked="${this.product.featured}"
                      @change="${t=>this.handleCheckboxChange("featured",t.target.checked)}"
                    />
                    <label class="form-check-label">Featured product</label>
                  </div>
                </div>
              </div>

              <!-- Organization -->
              <div class="card mb-3">
                <div class="card-header">
                  <h5 class="mb-0">Organization</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Category</label>
                    <select 
                      class="form-select"
                      .value="${this.product.category}"
                      @change="${t=>this.handleInputChange("category",t.target.value)}"
                    >
                      <option value="">Select category</option>
                      ${this.categories.map(t=>a`
                        <option value="${t}">${t}</option>
                      `)}
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Brand</label>
                    <select 
                      class="form-select"
                      .value="${this.product.brand}"
                      @change="${t=>this.handleInputChange("brand",t.target.value)}"
                    >
                      <option value="">Select brand</option>
                      ${this.brands.map(t=>a`
                        <option value="${t}">${t}</option>
                      `)}
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      .value="${this.product.tags?.join(", ")||""}"
                      @input="${t=>this.handleInputChange("tags",t.target.value.split(",").map(e=>e.trim()))}"
                    />
                  </div>
                </div>
              </div>

              <!-- Images -->
              <div class="card mb-3">
                <div class="card-header">
                  <h5 class="mb-0">Featured Image</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Image URL</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      .value="${this.product.featuredImage}"
                      @input="${t=>this.handleInputChange("featuredImage",t.target.value)}"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  ${this.product.featuredImage?a`
                    <img src="${this.product.featuredImage}" 
                         class="img-fluid" 
                         alt="Product preview"
                         style="max-height: 200px;">
                  `:""}
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  class="btn btn-secondary" 
                  @click="${this.handleCancel}"
                  ?disabled="${this.saving}"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  ?disabled="${this.saving}"
                >
                  ${this.saving?a`
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  `:a`
                    <i class="bi bi-check-lg me-2"></i>
                    ${this.productId?"Update":"Create"} Product
                  `}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `}}customElements.define("product-form",l);
