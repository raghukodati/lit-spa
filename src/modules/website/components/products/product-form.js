import { html } from 'lit';
import { BaseComponent } from '../../../../shared/components/base/BaseComponent.js';
import { Product } from '../../models/product.model.js';

class ProductForm extends BaseComponent {
  static properties = {
    productId: { type: String },
    product: { type: Object },
    categories: { type: Array },
    brands: { type: Array },
    loading: { type: Boolean },
    saving: { type: Boolean },
    errors: { type: Array }
  };

  constructor() {
    super();
    this.productId = null;
    this.product = new Product();
    this.categories = [];
    this.brands = [];
    this.loading = false;
    this.saving = false;
    this.errors = [];
    this._productService = null;
  }

  createRenderRoot() { return this; }

  async connectedCallback() {
    super.connectedCallback();
    if (!this._productService) {
      this._productService = await this.getService('productService');
    }
    // Get product ID from URL
    const pathname = window.location.pathname;
    const match = pathname.match(/\/website\/products\/edit\/(\d+)/);
    if (match) {
      this.productId = match[1];
      await this.loadProduct();
    }
    await this.loadFilters();
  }

  async loadProduct() {
    this.loading = true;
    try {
      if (!this._productService) {
        this._productService = await this.getService('productService');
      }
      this.product = await this._productService.getProductById(this.productId);
      if (!this.product) {
        alert('Product not found');
        window.location.pathname = '/website/products';
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      alert('Failed to load product');
    } finally {
      this.loading = false;
    }
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

  handleInputChange(field, value) {
    this.product = { ...this.product, [field]: value };
  }

  handleCheckboxChange(field, checked) {
    this.product = { ...this.product, [field]: checked };
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.errors = [];
    this.saving = true;

    try {
      const productModel = new Product(this.product);
      const validation = productModel.validate();

      if (!validation.isValid) {
        this.errors = validation.errors;
        this.saving = false;
        return;
      }

      if (!this._productService) {
        this._productService = await this.getService('productService');
      }

      const action = this.productId ? 'update' : 'create';
      if (!this.can('products', action)) {
        alert(`You do not have permission to ${action} products`);
        this.saving = false;
        return;
      }

      if (this.productId) {
        await this._productService.updateProduct(this.productId, this.product);
        alert('Product updated successfully');
      } else {
        await this._productService.createProduct(this.product);
        alert('Product created successfully');
      }

      window.location.pathname = '/website/products';
    } catch (error) {
      console.error('Failed to save product:', error);
      this.errors = [error.message];
    } finally {
      this.saving = false;
    }
  }

  handleCancel() {
    window.location.pathname = '/website/products';
  }

  render() {
    if (this.loading) {
      return html`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border" role="status"></div>
            <p class="mt-2">Loading product...</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>${this.productId ? 'Edit Product' : 'Add New Product'}</h2>
          <button class="btn btn-secondary" @click="${this.handleCancel}">
            <i class="bi bi-arrow-left"></i> Back to Products
          </button>
        </div>

        ${this.errors.length > 0 ? html`
          <div class="alert alert-danger">
            <strong>Please fix the following errors:</strong>
            <ul class="mb-0 mt-2">
              ${this.errors.map(error => html`<li>${error}</li>`)}
            </ul>
          </div>
        ` : ''}

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
                      @input="${e => this.handleInputChange('name', e.target.value)}"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">SKU *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      .value="${this.product.sku}"
                      @input="${e => this.handleInputChange('sku', e.target.value)}"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea 
                      class="form-control" 
                      rows="4"
                      .value="${this.product.description}"
                      @input="${e => this.handleInputChange('description', e.target.value)}"
                    ></textarea>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Short Description</label>
                    <textarea 
                      class="form-control" 
                      rows="2"
                      .value="${this.product.shortDescription}"
                      @input="${e => this.handleInputChange('shortDescription', e.target.value)}"
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
                          @input="${e => this.handleInputChange('price', parseFloat(e.target.value) || 0)}"
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
                          @input="${e => this.handleInputChange('compareAtPrice', parseFloat(e.target.value) || 0)}"
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
                          @input="${e => this.handleInputChange('cost', parseFloat(e.target.value) || 0)}"
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
                          @change="${e => this.handleCheckboxChange('taxable', e.target.checked)}"
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
                      @change="${e => this.handleCheckboxChange('trackInventory', e.target.checked)}"
                    />
                    <label class="form-check-label">Track inventory</label>
                  </div>

                  ${this.product.trackInventory ? html`
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Stock Quantity</label>
                        <input 
                          type="number" 
                          class="form-control" 
                          .value="${this.product.stock}"
                          @input="${e => this.handleInputChange('stock', parseInt(e.target.value) || 0)}"
                        />
                      </div>

                      <div class="col-md-6 mb-3">
                        <label class="form-label">Low Stock Threshold</label>
                        <input 
                          type="number" 
                          class="form-control" 
                          .value="${this.product.lowStockThreshold}"
                          @input="${e => this.handleInputChange('lowStockThreshold', parseInt(e.target.value) || 0)}"
                        />
                      </div>
                    </div>

                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        .checked="${this.product.allowBackorder}"
                        @change="${e => this.handleCheckboxChange('allowBackorder', e.target.checked)}"
                      />
                      <label class="form-check-label">Allow backorders</label>
                    </div>
                  ` : ''}
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
                      @change="${e => this.handleCheckboxChange('requiresShipping', e.target.checked)}"
                    />
                    <label class="form-check-label">This product requires shipping</label>
                  </div>

                  ${this.product.requiresShipping ? html`
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Weight</label>
                        <div class="input-group">
                          <input 
                            type="number" 
                            step="0.01"
                            class="form-control" 
                            .value="${this.product.weight}"
                            @input="${e => this.handleInputChange('weight', parseFloat(e.target.value) || 0)}"
                          />
                          <select 
                            class="form-select"
                            style="max-width: 100px;"
                            .value="${this.product.weightUnit}"
                            @change="${e => this.handleInputChange('weightUnit', e.target.value)}"
                          >
                            <option value="kg">kg</option>
                            <option value="lb">lb</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ` : ''}
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
                      @change="${e => this.handleInputChange('status', e.target.value)}"
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
                      @change="${e => this.handleCheckboxChange('featured', e.target.checked)}"
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
                      @change="${e => this.handleInputChange('category', e.target.value)}"
                    >
                      <option value="">Select category</option>
                      ${this.categories.map(cat => html`
                        <option value="${cat}">${cat}</option>
                      `)}
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Brand</label>
                    <select 
                      class="form-select"
                      .value="${this.product.brand}"
                      @change="${e => this.handleInputChange('brand', e.target.value)}"
                    >
                      <option value="">Select brand</option>
                      ${this.brands.map(brand => html`
                        <option value="${brand}">${brand}</option>
                      `)}
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      .value="${this.product.tags?.join(', ') || ''}"
                      @input="${e => this.handleInputChange('tags', e.target.value.split(',').map(t => t.trim()))}"
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
                      @input="${e => this.handleInputChange('featuredImage', e.target.value)}"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  ${this.product.featuredImage ? html`
                    <img src="${this.product.featuredImage}" 
                         class="img-fluid" 
                         alt="Product preview"
                         style="max-height: 200px;">
                  ` : ''}
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
                  ${this.saving ? html`
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  ` : html`
                    <i class="bi bi-check-lg me-2"></i>
                    ${this.productId ? 'Update' : 'Create'} Product
                  `}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('product-form', ProductForm);
