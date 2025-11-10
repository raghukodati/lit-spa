import{N as s}from"./index-DCWHXaZV.js";import{B as e}from"./BaseComponent-TlNBBqtl.js";class c extends e{static properties={products:{type:Array},lowStockProducts:{type:Array},outOfStockProducts:{type:Array},loading:{type:Boolean},view:{type:String}};constructor(){super(),this.products=[],this.lowStockProducts=[],this.outOfStockProducts=[],this.loading=!1,this.view="all",this._productService=null}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadData()}async loadData(){this.loading=!0;try{this._productService||(this._productService=await this.getService("productService"));const t=await this._productService.getProducts({trackInventory:!0,sortBy:"stock",sortOrder:"asc"});this.products=t.data,this.lowStockProducts=await this._productService.getLowStockProducts(),this.outOfStockProducts=await this._productService.getOutOfStockProducts()}catch(t){console.error("Failed to load inventory:",t)}finally{this.loading=!1}}async handleStockUpdate(t,a){if(this.can("products","update"))try{this._productService||(this._productService=await this.getService("productService")),await this._productService.updateProductStock(t,parseInt(a)),await this.loadData()}catch{alert("Failed to update stock")}}getDisplayProducts(){return this.view==="low"?this.lowStockProducts:this.view==="out"?this.outOfStockProducts:this.products}render(){return s`
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
                <h3>${this.products.filter(t=>t.isInStock()&&!t.isLowStock()).length}</h3>
                <p class="mb-0">In Stock</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <a class="nav-link ${this.view==="all"?"active":""}" 
               @click="${()=>this.view="all"}">
              All Products
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${this.view==="low"?"active":""}" 
               @click="${()=>this.view="low"}">
              Low Stock
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${this.view==="out"?"active":""}" 
               @click="${()=>this.view="out"}">
              Out of Stock
            </a>
          </li>
        </ul>

        ${this.loading?s`
          <div class="text-center py-5"><div class="spinner-border"></div></div>
        `:s`
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
                ${this.getDisplayProducts().map(t=>s`
                  <tr>
                    <td><strong>${t.name}</strong></td>
                    <td>${t.sku}</td>
                    <td>
                      <span class="badge ${t.stock>t.lowStockThreshold?"bg-success":t.stock>0?"bg-warning":"bg-danger"}">
                        ${t.stock}
                      </span>
                    </td>
                    <td>
                      ${this.ifCan("products","update",s`
                        <div class="input-group" style="width: 150px;">
                          <input 
                            type="number" 
                            class="form-control form-control-sm" 
                            value="${t.stock}"
                            @change="${a=>this.handleStockUpdate(t.id,a.target.value)}"
                          />
                        </div>
                      `,s`<span>${t.stock}</span>`)}
                    </td>
                    <td>
                      ${t.isLowStock()?s`
                        <span class="badge bg-warning">Low Stock</span>
                      `:t.stock===0?s`
                        <span class="badge bg-danger">Out of Stock</span>
                      `:s`
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
    `}}customElements.define("inventory-management",c);
