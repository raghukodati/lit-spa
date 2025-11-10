import{T as l,N as r}from"./index-DfU7H5-o.js";import{getProducts as o}from"./product.service-iC3Sx6BM.js";import"./product.model-uhuUaOub.js";class c extends l{static properties={orderLines:{type:Array},products:{type:Array},loading:{type:Boolean}};constructor(){super(),this.orderLines=[{sku:"",quantity:1,product:null,error:""},{sku:"",quantity:1,product:null,error:""},{sku:"",quantity:1,product:null,error:""},{sku:"",quantity:1,product:null,error:""},{sku:"",quantity:1,product:null,error:""}],this.products=[],this.loading=!1}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadProducts()}async loadProducts(){this.loading=!0;try{const t=await o({status:"active"});this.products=t.data||[]}catch(t){console.error("Failed to load products:",t),this.products=[]}finally{this.loading=!1}}handleSkuChange(t,s){this.orderLines[t].sku=s.toUpperCase(),this.orderLines[t].error="";const e=this.products.find(a=>a.sku===s.toUpperCase());this.orderLines[t].product=e||null,s&&!e&&(this.orderLines[t].error="Product not found"),this.requestUpdate()}handleQuantityChange(t,s){this.orderLines[t].quantity=parseInt(s)||1,this.requestUpdate()}handleAddLine(){this.orderLines.push({sku:"",quantity:1,product:null,error:""}),this.requestUpdate()}handleRemoveLine(t){this.orderLines.length>1&&(this.orderLines.splice(t,1),this.requestUpdate())}handleClearAll(){confirm("Clear all lines?")&&(this.orderLines=[{sku:"",quantity:1,product:null,error:""}],this.requestUpdate())}handleAddToCart(){const t=this.orderLines.filter(e=>e.product&&e.quantity>0);if(t.length===0){alert("Please add valid products");return}const s=JSON.parse(localStorage.getItem("b2b-cart")||"[]");t.forEach(e=>{const a={productId:e.product.id,name:e.product.name,sku:e.product.sku,price:e.product.price,quantity:e.quantity,total:e.product.price*e.quantity},i=s.findIndex(d=>d.productId===e.product.id);i>-1?(s[i].quantity+=e.quantity,s[i].total=s[i].price*s[i].quantity):s.push(a)}),localStorage.setItem("b2b-cart",JSON.stringify(s)),alert(`Added ${t.length} item(s) to cart`),window.location.pathname="/b2b-store/cart"}handlePasteFromExcel(){const t=prompt("Paste SKU and quantity data from Excel (format: SKU,Quantity per line):");if(!t)return;const s=t.trim().split(`
`);this.orderLines=s.map(e=>{const[a,i]=e.split(/[,\t]/),d=this.products.find(n=>n.sku===a.trim().toUpperCase());return{sku:a.trim().toUpperCase(),quantity:parseInt(i)||1,product:d||null,error:d?"":"Product not found"}}),this.requestUpdate()}get validLines(){return this.orderLines.filter(t=>t.product&&t.quantity>0)}get orderTotal(){return this.validLines.reduce((t,s)=>t+s.product.price*s.quantity,0)}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}render(){return r`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">Quick Order</h2>
            <p class="text-muted mb-0">Enter multiple SKUs for fast bulk ordering</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary" @click=${this.handlePasteFromExcel}>
              <i class="bi bi-file-earmark-spreadsheet me-2"></i>Paste from Excel
            </button>
            <button class="btn btn-outline-secondary" @click=${()=>window.location.pathname="/b2b-store/catalog"}>
              <i class="bi bi-arrow-left me-2"></i>Back to Catalog
            </button>
          </div>
        </div>

        <div class="row">
          <!-- Quick Order Form -->
          <div class="col-lg-8">
            <div class="card mb-4">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Order Lines</h5>
                <div>
                  <button class="btn btn-sm btn-outline-primary me-2" @click=${this.handleAddLine}>
                    <i class="bi bi-plus-circle me-1"></i>Add Line
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click=${this.handleClearAll}>
                    <i class="bi bi-trash me-1"></i>Clear All
                  </button>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="table-light">
                      <tr>
                        <th style="width: 50px;">#</th>
                        <th style="width: 200px;">SKU</th>
                        <th>Product</th>
                        <th style="width: 120px;">Price</th>
                        <th style="width: 120px;">Quantity</th>
                        <th style="width: 120px;">Total</th>
                        <th style="width: 60px;"></th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.orderLines.map((t,s)=>r`
                        <tr class="${t.error?"table-danger":t.product?"table-success":""}">
                          <td class="text-center">${s+1}</td>
                          <td>
                            <input 
                              type="text" 
                              class="form-control form-control-sm ${t.error?"is-invalid":t.product?"is-valid":""}"
                              placeholder="SKU..."
                              .value=${t.sku}
                              @input=${e=>this.handleSkuChange(s,e.target.value)}
                              @blur=${e=>this.handleSkuChange(s,e.target.value)}
                            />
                            ${t.error?r`
                              <div class="invalid-feedback d-block">${t.error}</div>
                            `:""}
                          </td>
                          <td>
                            ${t.product?r`
                              <div>
                                <strong>${t.product.name}</strong><br>
                                <small class="text-muted">${t.product.description?.substring(0,40)||""}</small>
                              </div>
                            `:r`
                              <span class="text-muted">Enter SKU to search</span>
                            `}
                          </td>
                          <td>
                            ${t.product?r`
                              <strong>${this.formatCurrency(t.product.price)}</strong>
                            `:"-"}
                          </td>
                          <td>
                            <input 
                              type="number" 
                              class="form-control form-control-sm"
                              .value=${t.quantity}
                              @input=${e=>this.handleQuantityChange(s,e.target.value)}
                              min="1"
                              ?disabled=${!t.product}
                            />
                          </td>
                          <td>
                            ${t.product?r`
                              <strong class="text-primary">${this.formatCurrency(t.product.price*t.quantity)}</strong>
                            `:"-"}
                          </td>
                          <td>
                            <button 
                              class="btn btn-sm btn-outline-danger"
                              @click=${()=>this.handleRemoveLine(s)}
                              ?disabled=${this.orderLines.length===1}
                            >
                              <i class="bi bi-x"></i>
                            </button>
                          </td>
                        </tr>
                      `)}
                    </tbody>
                    <tfoot class="table-light">
                      <tr>
                        <td colspan="5" class="text-end"><strong>Order Total:</strong></td>
                        <td colspan="2"><strong class="fs-5 text-primary">${this.formatCurrency(this.orderTotal)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div class="card-footer">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <span class="text-muted">${this.validLines.length} of ${this.orderLines.length} lines valid</span>
                  </div>
                  <button 
                    class="btn btn-primary btn-lg"
                    @click=${this.handleAddToCart}
                    ?disabled=${this.validLines.length===0}
                  >
                    <i class="bi bi-cart-plus me-2"></i>Add All to Cart (${this.validLines.length})
                  </button>
                </div>
              </div>
            </div>

            <!-- Tips -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-lightbulb me-2"></i>Quick Order Tips</h5>
              </div>
              <div class="card-body">
                <ul class="mb-0">
                  <li>Type or paste SKU numbers to quickly find products</li>
                  <li>Press Tab to move to the next field</li>
                  <li>Use "Paste from Excel" to import bulk data (format: SKU,Quantity)</li>
                  <li>Invalid SKUs will be highlighted in red</li>
                  <li>Add more lines with the "Add Line" button</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Summary -->
            <div class="card mb-4">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Order Summary</h5>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <span>Valid Lines:</span>
                  <strong>${this.validLines.length}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Total Items:</span>
                  <strong>${this.validLines.reduce((t,s)=>t+s.quantity,0)}</strong>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                  <strong>Subtotal:</strong>
                  <strong class="text-primary fs-5">${this.formatCurrency(this.orderTotal)}</strong>
                </div>
              </div>
            </div>

            <!-- Common SKUs -->
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0">Frequently Ordered</h6>
              </div>
              <div class="list-group list-group-flush">
                ${this.products.slice(0,5).map(t=>r`
                  <button class="list-group-item list-group-item-action" 
                          @click=${()=>{const s=this.orderLines.findIndex(e=>!e.sku);s>-1?this.handleSkuChange(s,t.sku):(this.orderLines.push({sku:t.sku,quantity:1,product:t,error:""}),this.requestUpdate())}}>
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <div class="fw-bold">${t.name}</div>
                        <small class="text-muted">SKU: ${t.sku}</small>
                      </div>
                      <span class="badge bg-primary">${this.formatCurrency(t.price)}</span>
                    </div>
                  </button>
                `)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("quick-order",c);
