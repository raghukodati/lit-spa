import{N as e}from"./index-tL1z1sM1.js";import{B as a}from"./BaseComponent-D2jDfeym.js";import"./ui-table-CGm0E-B3.js";import"./product-compare-CCoJgETc.js";class r extends a{static properties={products:{type:Array},categories:{type:Array},brands:{type:Array},loading:{type:Boolean},searchTerm:{type:String},filterCategory:{type:String},filterBrand:{type:String},filterStatus:{type:String},sortBy:{type:String},sortOrder:{type:String},page:{type:Number},pageSize:{type:Number},total:{type:Number},totalPages:{type:Number}};constructor(){super(),this.products=[],this.categories=[],this.brands=[],this.loading=!1,this.searchTerm="",this.filterCategory="",this.filterBrand="",this.filterStatus="active",this.sortBy="name",this.sortOrder="asc",this.page=1,this.pageSize=20,this.total=0,this.totalPages=0,this._productService=null}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),this._productService||(this._productService=await this.getService("productService")),await this.loadFilters(),await this.loadProducts()}async loadFilters(){try{this._productService||(this._productService=await this.getService("productService")),this.categories=await this._productService.getProductCategories(),this.brands=await this._productService.getProductBrands()}catch(t){console.error("Failed to load filters:",t)}}async loadProducts(){this.loading=!0;try{const t={search:this.searchTerm,category:this.filterCategory,brand:this.filterBrand,status:this.filterStatus,sortBy:this.sortBy,sortOrder:this.sortOrder,page:this.page,pageSize:this.pageSize};this._productService||(this._productService=await this.getService("productService"));const s=await this._productService.getProducts(t);this.products=s.data,this.total=s.total,this.totalPages=s.totalPages}catch(t){console.error("Failed to load products:",t),alert("Failed to load products")}finally{this.loading=!1}}handleSearch(t){this.searchTerm=t.target.value,this.page=1,this.loadProducts()}handleCategoryChange(t){this.filterCategory=t.target.value,this.page=1,this.loadProducts()}handleBrandChange(t){this.filterBrand=t.target.value,this.page=1,this.loadProducts()}handleStatusChange(t){this.filterStatus=t.target.value,this.page=1,this.loadProducts()}handleSortChange(t){this.sortBy=t.target.value,this.loadProducts()}async handleDelete(t){if(this.can("products","delete")&&confirm("Are you sure you want to delete this product?"))try{this._productService||(this._productService=await this.getService("productService")),await this._productService.deleteProduct(t),alert("Product deleted successfully"),await this.loadProducts()}catch(s){console.error("Failed to delete product:",s),alert("Failed to delete product")}}handleEdit(t){this.can("products","update")&&(window.location.pathname=`/website/products/edit/${t}`)}handleView(t){this.can("products","read")&&(window.location.pathname=`/website/products/${t}`)}handleAddToCompare(t){window.dispatchEvent(new CustomEvent("add-to-compare",{detail:{product:t}}))}goToPage(t){this.page=t,this.loadProducts()}render(){return e`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Products</h2>
          ${this.ifCan("products","create",e`
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
                  ${this.categories.map(t=>e`
                    <option value="${t}" ?selected="${this.filterCategory===t}">
                      ${t}
                    </option>
                  `)}
                </select>
              </div>
              <div class="col-md-2">
                <select class="form-select" @change="${this.handleBrandChange}">
                  <option value="">All Brands</option>
                  ${this.brands.map(t=>e`
                    <option value="${t}" ?selected="${this.filterBrand===t}">
                      ${t}
                    </option>
                  `)}
                </select>
              </div>
              <div class="col-md-2">
                <select class="form-select" @change="${this.handleStatusChange}">
                  <option value="">All Status</option>
                  <option value="active" ?selected="${this.filterStatus==="active"}">Active</option>
                  <option value="draft" ?selected="${this.filterStatus==="draft"}">Draft</option>
                  <option value="archived" ?selected="${this.filterStatus==="archived"}">Archived</option>
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
            .columns=${[{key:"image",label:"Image",render:t=>t.featuredImage?e`<img src="${t.featuredImage}" alt="${t.name}" style="width:50px;height:50px;object-fit:cover">`:e`<div class="bg-secondary text-white d-flex align-items-center justify-content-center" style="width:50px;height:50px">N/A</div>`},{key:"sku",label:"SKU",sortable:!0},{key:"name",label:"Name",sortable:!0,render:t=>e`
                  <strong>${t.name}</strong> ${t.featured?e`<span class="badge bg-warning ms-2">Featured</span>`:""}
                `},{key:"category",label:"Category",sortable:!0,render:t=>t.category||"N/A"},{key:"price",label:"Price",sortable:!0,render:t=>e`
                  $${t.price.toFixed(2)}
                  ${t.compareAtPrice>0?e`<br><small class="text-muted text-decoration-line-through">$${t.compareAtPrice.toFixed(2)}</small>`:""}
                `},{key:"stock",label:"Stock",sortable:!0,render:t=>t.trackInventory?e`<span class="badge ${t.stock===0?"bg-danger":t.stock>t.lowStockThreshold?"bg-success":"bg-warning"}">${t.stock}</span>`:e`<span class="text-muted">N/A</span>`},{key:"status",label:"Status",sortable:!0,render:t=>e`
                  <span class="badge ${t.status==="active"?"bg-success":t.status==="draft"?"bg-secondary":"bg-danger"}">
                    ${t.status}
                  </span>`},{key:"actions",label:"Actions",render:t=>e`
                  ${this.ifCan("products","read",e`
                    <button class="btn btn-sm btn-info me-1" @click="${()=>this.handleView(t.id)}" title="View"><i class="bi bi-eye"></i></button>
                  `)}
                  ${this.ifCan("products","update",e`
                    <button class="btn btn-sm btn-warning me-1" @click="${()=>this.handleEdit(t.id)}" title="Edit"><i class="bi bi-pencil"></i></button>
                  `)}
                  <button class="btn btn-sm btn-outline-info me-1" @click="${()=>this.handleAddToCompare(t)}" title="Add to Compare"><i class="bi bi-clipboard-check"></i></button>
                  ${this.ifCan("products","delete",e`
                    <button class="btn btn-sm btn-danger" @click="${()=>this.handleDelete(t.id)}" title="Delete"><i class="bi bi-trash"></i></button>
                  `)}
                `}]}
            .items=${this.products}
            .loading=${this.loading}
            emptyText="No products found"
            .page=${this.page}
            .pageSize=${this.pageSize}
            .total=${this.total}
            .sortBy=${this.sortBy}
            .sortOrder=${this.sortOrder}
            @table-sort=${t=>{this.sortBy=t.detail.sortBy,this.sortOrder=t.detail.sortOrder,this.loadProducts()}}
            @table-page=${t=>{this.goToPage(t.detail.page)}}
          ></ui-table>

          <div slot="footer" class="text-center text-muted mt-2">
            Showing ${this.products.length} of ${this.total} products
          </div>
        </ui-card>
      </div>

      <!-- Product Compare Component -->
      <product-compare></product-compare>
    `}}customElements.define("product-list",r);
