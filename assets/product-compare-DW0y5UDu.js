import{T as r,N as a}from"./index-BTuak744.js";class i extends r{static properties={compareProducts:{type:Array},showCompareBar:{type:Boolean},showCompareModal:{type:Boolean}};constructor(){super(),this.compareProducts=this.loadCompareList(),this.showCompareBar=this.compareProducts.length>0,this.showCompareModal=!1}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),window.addEventListener("add-to-compare",this.handleAddToCompare.bind(this)),window.addEventListener("remove-from-compare",this.handleRemoveFromCompare.bind(this))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("add-to-compare",this.handleAddToCompare.bind(this)),window.removeEventListener("remove-from-compare",this.handleRemoveFromCompare.bind(this))}loadCompareList(){try{const t=localStorage.getItem("product-compare");return t?JSON.parse(t):[]}catch{return[]}}saveCompareList(){localStorage.setItem("product-compare",JSON.stringify(this.compareProducts)),this.showCompareBar=this.compareProducts.length>0}handleAddToCompare(t){const e=t.detail?.product;if(e){if(this.compareProducts.find(s=>s.id===e.id)){alert("Product already in compare list");return}if(this.compareProducts.length>=4){alert("Maximum 4 products can be compared. Please remove one first.");return}this.compareProducts=[...this.compareProducts,e],this.saveCompareList(),this.requestUpdate()}}handleRemoveFromCompare(t){const e=t.detail?.productId;e&&(this.compareProducts=this.compareProducts.filter(s=>s.id!==e),this.saveCompareList(),this.requestUpdate())}removeProduct(t){this.compareProducts=this.compareProducts.filter(e=>e.id!==t),this.saveCompareList(),this.compareProducts.length===0&&(this.showCompareModal=!1),this.requestUpdate()}clearAll(){confirm("Remove all products from comparison?")&&(this.compareProducts=[],this.saveCompareList(),this.showCompareModal=!1,this.requestUpdate())}openComparison(){if(this.compareProducts.length<2){alert("Please add at least 2 products to compare");return}this.showCompareModal=!0,this.requestUpdate()}closeComparison(){this.showCompareModal=!1,this.requestUpdate()}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}getCommonAttributes(){return this.compareProducts.length===0?[]:[{key:"name",label:"Product Name",type:"text"},{key:"sku",label:"SKU",type:"text"},{key:"price",label:"Price",type:"currency"},{key:"compareAtPrice",label:"MSRP",type:"currency"},{key:"stock",label:"Stock",type:"number"},{key:"brand",label:"Brand",type:"text"},{key:"category",label:"Category",type:"text"},{key:"subcategory",label:"Subcategory",type:"text"},{key:"description",label:"Description",type:"text"}]}formatValue(t,e){if(!t&&t!==0)return"-";switch(e){case"currency":return this.formatCurrency(t);case"number":return t.toLocaleString();case"boolean":return t?"✓":"✗";default:return t}}getBestValue(t){if(t.type==="currency"){const e=this.compareProducts.map(s=>s[t.key]).filter(s=>s);return Math.min(...e)}else if(t.type==="number"){const e=this.compareProducts.map(s=>s[t.key]).filter(s=>s);return Math.max(...e)}return null}isBestValue(t,e){const s=this.getBestValue(e);return s===null?!1:t[e.key]===s}handleAddToCart(t){window.dispatchEvent(new CustomEvent("add-to-cart",{detail:{product:t,quantity:1}}))}render(){return a`
      <!-- Compare Bar (Fixed Bottom) -->
      ${this.showCompareBar&&this.compareProducts.length>0?a`
        <div class="compare-bar position-fixed bottom-0 start-0 end-0 bg-dark text-white shadow-lg" 
             style="z-index: 1040; padding: 15px 0;">
          <div class="container-fluid">
            <div class="row align-items-center">
              <div class="col-md-8">
                <div class="d-flex align-items-center gap-3">
                  <h6 class="mb-0">
                    <i class="bi bi-clipboard-check me-2"></i>
                    Compare Products (${this.compareProducts.length}/4)
                  </h6>
                  <div class="d-flex gap-2 flex-wrap">
                    ${this.compareProducts.map(t=>a`
                      <div class="badge bg-primary d-flex align-items-center gap-2 py-2 px-3">
                        <span>${t.name}</span>
                        <button class="btn btn-sm btn-link text-white p-0" 
                                @click=${()=>this.removeProduct(t.id)}
                                title="Remove">
                          <i class="bi bi-x-lg"></i>
                        </button>
                      </div>
                    `)}
                  </div>
                </div>
              </div>
              <div class="col-md-4 text-end">
                <button class="btn btn-success me-2" 
                        @click=${this.openComparison}
                        ?disabled=${this.compareProducts.length<2}>
                  <i class="bi bi-columns-gap me-2"></i>
                  Compare Now
                </button>
                <button class="btn btn-outline-light" @click=${this.clearAll}>
                  <i class="bi bi-trash me-2"></i>Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      `:""}

      <!-- Compare Modal -->
      ${this.showCompareModal?a`
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header bg-primary text-white">
                <h5 class="modal-title">
                  <i class="bi bi-columns-gap me-2"></i>
                  Product Comparison
                </h5>
                <button type="button" class="btn-close btn-close-white" @click=${this.closeComparison}></button>
              </div>
              <div class="modal-body p-0">
                <div class="table-responsive">
                  <table class="table table-bordered table-hover mb-0">
                    <thead class="table-light sticky-top">
                      <tr>
                        <th style="width: 200px;">Attribute</th>
                        ${this.compareProducts.map(t=>a`
                          <th class="text-center" style="width: ${100/this.compareProducts.length}%;">
                            <div class="d-flex flex-column align-items-center gap-2">
                              <div class="bg-light rounded p-3" style="height: 120px; width: 120px; display: flex; align-items: center; justify-content: center;">
                                <i class="bi bi-box" style="font-size: 3rem; color: #6c757d;"></i>
                              </div>
                              <button class="btn btn-sm btn-outline-danger" 
                                      @click=${()=>this.removeProduct(t.id)}
                                      title="Remove from comparison">
                                <i class="bi bi-x-circle me-1"></i>Remove
                              </button>
                            </div>
                          </th>
                        `)}
                      </tr>
                    </thead>
                    <tbody>
                      ${this.getCommonAttributes().map(t=>a`
                        <tr>
                          <td class="fw-bold bg-light">${t.label}</td>
                          ${this.compareProducts.map(e=>{const s=e[t.key],o=this.isBestValue(e,t);return a`
                              <td class="text-center ${o?"table-success fw-bold":""}">
                                ${this.formatValue(s,t.type)}
                                ${o&&(t.type==="currency"||t.type==="number")?a`
                                  <i class="bi bi-star-fill text-warning ms-2" title="Best value"></i>
                                `:""}
                              </td>
                            `})}
                        </tr>
                      `)}
                      
                      <!-- Savings Row -->
                      <tr class="table-info">
                        <td class="fw-bold">Savings</td>
                        ${this.compareProducts.map(t=>a`
                          <td class="text-center fw-bold">
                            ${t.compareAtPrice&&t.compareAtPrice>t.price?a`
                              <span class="text-success">
                                Save ${this.formatCurrency(t.compareAtPrice-t.price)}
                              </span>
                            `:"-"}
                          </td>
                        `)}
                      </tr>

                      <!-- Availability Row -->
                      <tr>
                        <td class="fw-bold bg-light">Availability</td>
                        ${this.compareProducts.map(t=>a`
                          <td class="text-center">
                            ${t.stock>10?a`
                              <span class="badge bg-success">In Stock</span>
                            `:t.stock>0?a`
                              <span class="badge bg-warning text-dark">Low Stock (${t.stock})</span>
                            `:a`
                              <span class="badge bg-danger">Out of Stock</span>
                            `}
                          </td>
                        `)}
                      </tr>

                      <!-- Actions Row -->
                      <tr class="table-light">
                        <td class="fw-bold">Actions</td>
                        ${this.compareProducts.map(t=>a`
                          <td class="text-center">
                            <div class="d-grid gap-2">
                              <button class="btn btn-primary btn-sm" 
                                      @click=${()=>this.handleAddToCart(t)}
                                      ?disabled=${t.stock===0}>
                                <i class="bi bi-cart-plus me-1"></i>
                                Add to Cart
                              </button>
                              <button class="btn btn-outline-secondary btn-sm" 
                                      @click=${()=>window.location.pathname=`/b2b-store/product/${t.id}`}>
                                <i class="bi bi-eye me-1"></i>
                                View Details
                              </button>
                            </div>
                          </td>
                        `)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="modal-footer">
                <div class="d-flex justify-content-between w-100">
                  <button class="btn btn-outline-danger" @click=${this.clearAll}>
                    <i class="bi bi-trash me-2"></i>Clear All
                  </button>
                  <button class="btn btn-secondary" @click=${this.closeComparison}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `:""}
    `}}customElements.define("product-compare",i);
