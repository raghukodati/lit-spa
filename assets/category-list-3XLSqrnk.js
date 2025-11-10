import{T as i,N as e}from"./index-YRTalx74.js";import{getProductCategories as s}from"./product.service-CxkNPT-C.js";import"./product.model-uhuUaOub.js";class a extends i{static properties={categories:{type:Array},loading:{type:Boolean}};constructor(){super(),this.categories=[],this.loading=!1}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadCategories()}async loadCategories(){this.loading=!0;try{this.categories=await s()}catch(t){console.error("Failed to load categories:",t)}finally{this.loading=!1}}render(){return e`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Product Categories</h2>
          <a href="#/website/categories/new" class="btn btn-primary">
            <i class="bi bi-plus-lg"></i> Add Category
          </a>
        </div>

        ${this.loading?e`
          <div class="text-center py-5"><div class="spinner-border"></div></div>
        `:e`
          <div class="row">
            ${this.categories.map(t=>e`
              <div class="col-md-4 mb-3">
                <div class="card">
                  <div class="card-body">
                    <h5>${t}</h5>
                    <button class="btn btn-sm btn-primary">Edit</button>
                  </div>
                </div>
              </div>
            `)}
          </div>
        `}
      </div>
    `}}customElements.define("category-list",a);
