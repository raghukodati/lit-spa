import{T as d,N as r}from"./index-D7HSGHDh.js";class n extends d{static properties={keepStockLists:{type:Array},alerts:{type:Array},selectedList:{type:Object},showDetailModal:{type:Boolean},searchTerm:{type:String},filterStatus:{type:String}};constructor(){super(),this.keepStockLists=this.loadKeepStockLists(),this.alerts=this.generateAlerts(),this.selectedList=null,this.showDetailModal=!1,this.searchTerm="",this.filterStatus="all"}createRenderRoot(){return this}loadKeepStockLists(){const t=localStorage.getItem("keepstock-lists");if(t)try{return JSON.parse(t)}catch{}return[{id:1,keepStockNumber:"KS-2024-001",name:"Office Essentials",description:"Daily office supplies",category:"Office Supplies",autoReorder:!0,createdDate:"2024-01-15",lastOrdered:"2025-10-28",items:[{productName:"Office Paper A4",sku:"PAPER-A4-500",currentStock:15,minStock:20,maxStock:50,reorderQuantity:30,unitPrice:4.99,status:"low_stock"},{productName:"Ballpoint Pens (Box)",sku:"PEN-BALL-50",currentStock:8,minStock:15,maxStock:40,reorderQuantity:20,unitPrice:12.99,status:"critical"},{productName:"Sticky Notes",sku:"STICKY-3X3",currentStock:25,minStock:20,maxStock:60,reorderQuantity:30,unitPrice:3.99,status:"optimal"}]},{id:2,keepStockNumber:"KS-2024-002",name:"Printer Supplies",description:"Toner and printer materials",category:"Printer Supplies",autoReorder:!0,createdDate:"2024-02-01",lastOrdered:"2025-10-15",items:[{productName:"Toner Cartridge Black",sku:"TONER-BLK-5000",currentStock:3,minStock:10,maxStock:30,reorderQuantity:15,unitPrice:89.99,status:"critical"},{productName:"Toner Cartridge Color",sku:"TONER-CLR-SET",currentStock:5,minStock:8,maxStock:20,reorderQuantity:10,unitPrice:149.99,status:"low_stock"},{productName:"Printer Paper Legal",sku:"PAPER-LEGAL",currentStock:12,minStock:15,maxStock:40,reorderQuantity:20,unitPrice:5.99,status:"low_stock"}]},{id:3,keepStockNumber:"KS-2024-003",name:"Janitorial Supplies",description:"Cleaning products",category:"Janitorial",autoReorder:!0,createdDate:"2024-01-20",lastOrdered:"2025-09-20",items:[{productName:"Hand Sanitizer (Gallon)",sku:"SANITIZER-GAL",currentStock:45,minStock:20,maxStock:60,reorderQuantity:25,unitPrice:12.5,status:"optimal"},{productName:"Disinfectant Spray",sku:"DISINFECT-CASE",currentStock:32,minStock:15,maxStock:40,reorderQuantity:20,unitPrice:24.99,status:"optimal"},{productName:"Paper Towels (Case)",sku:"TOWEL-CASE",currentStock:28,minStock:20,maxStock:50,reorderQuantity:25,unitPrice:18.99,status:"optimal"}]},{id:4,keepStockNumber:"KS-2024-004",name:"Break Room Supplies",description:"Coffee and disposables",category:"Break Room",autoReorder:!1,createdDate:"2024-03-01",lastOrdered:"2025-10-25",items:[{productName:"Coffee (Ground, 2lb)",sku:"COFFEE-GRD-2LB",currentStock:32,minStock:15,maxStock:40,reorderQuantity:20,unitPrice:15.99,status:"optimal"},{productName:"Disposable Cups",sku:"CUP-DISP-SLEEVE",currentStock:18,minStock:12,maxStock:30,reorderQuantity:15,unitPrice:8.99,status:"optimal"}]},{id:5,keepStockNumber:"KS-2024-005",name:"Safety Equipment",description:"PPE and safety supplies",category:"Safety Equipment",autoReorder:!0,createdDate:"2024-02-15",lastOrdered:"2025-10-01",items:[{productName:"Safety Gloves (Box)",sku:"GLOVE-SAF-100",currentStock:8,minStock:15,maxStock:40,reorderQuantity:20,unitPrice:24.99,status:"low_stock"},{productName:"Face Masks (Box)",sku:"MASK-DISP-50",currentStock:5,minStock:10,maxStock:50,reorderQuantity:30,unitPrice:12.99,status:"critical"}]}]}saveKeepStockLists(){localStorage.setItem("keepstock-lists",JSON.stringify(this.keepStockLists))}generateAlerts(){const t=[];return this.keepStockLists.forEach(e=>{const a=e.items.filter(s=>s.status==="critical").length,i=e.items.filter(s=>s.status==="low_stock").length;a>0?t.push({type:"critical",message:`${e.name} (${e.keepStockNumber}) has ${a} critical item(s)`,list:e}):i>0&&t.push({type:"warning",message:`${e.name} (${e.keepStockNumber}) has ${i} low stock item(s)`,list:e})}),t}getListStatus(t){return t.items.some(e=>e.status==="critical")?"critical":t.items.some(e=>e.status==="low_stock")?"low_stock":"optimal"}handleSearch(t){this.searchTerm=t.target.value.toLowerCase(),this.requestUpdate()}handleFilterChange(t){this.filterStatus=t.target.value,this.requestUpdate()}get filteredLists(){return this.keepStockLists.filter(t=>{const e=this.getListStatus(t);return this.filterStatus!=="all"&&e!==this.filterStatus?!1:this.searchTerm?t.keepStockNumber.toLowerCase().includes(this.searchTerm)||t.name.toLowerCase().includes(this.searchTerm)||t.category.toLowerCase().includes(this.searchTerm):!0})}viewListDetails(t){this.selectedList=t,this.showDetailModal=!0,this.requestUpdate()}closeDetailModal(){this.showDetailModal=!1,this.selectedList=null,this.requestUpdate()}toggleAutoReorder(t){t.autoReorder=!t.autoReorder,this.saveKeepStockLists(),this.requestUpdate()}orderEntireList(t){const e=t.items.reduce((s,c)=>s+c.reorderQuantity,0),a=t.items.reduce((s,c)=>s+c.reorderQuantity*c.unitPrice,0),i=t.items.map(s=>`
• ${s.productName}: ${s.reorderQuantity} units @ ${this.formatCurrency(s.unitPrice)} = ${this.formatCurrency(s.reorderQuantity*s.unitPrice)}`).join("");confirm(`Order entire KeepStock list?

List: ${t.name} (${t.keepStockNumber})
Total Items: ${e} units
Estimated Cost: ${this.formatCurrency(a)}

Items:${i}`)&&(alert(`✓ Creating order for KeepStock ${t.keepStockNumber}

All ${t.items.length} products added to cart.`),t.lastOrdered=new Date().toISOString().split("T")[0],this.saveKeepStockLists(),this.requestUpdate())}getStatusBadge(t){return{optimal:"bg-success",low_stock:"bg-warning text-dark",critical:"bg-danger"}[t]||"bg-secondary"}getStatusText(t){return{optimal:"Optimal",low_stock:"Low Stock",critical:"Critical"}[t]||t}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}formatDate(t){return new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}get criticalCount(){return this.keepStockLists.filter(t=>this.getListStatus(t)==="critical").length}get lowStockCount(){return this.keepStockLists.filter(t=>this.getListStatus(t)==="low_stock").length}get optimalCount(){return this.keepStockLists.filter(t=>this.getListStatus(t)==="optimal").length}get totalValue(){return this.keepStockLists.reduce((t,e)=>t+e.items.reduce((a,i)=>a+i.currentStock*i.unitPrice,0),0)}render(){return r`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2><i class="bi bi-boxes me-2"></i>KeepStock Lists</h2>
                <p class="text-muted">Multi-item inventory groups with search and batch ordering</p>
              </div>
              <button class="btn btn-primary"><i class="bi bi-plus-lg me-2"></i>Create New List</button>
            </div>
          </div>
        </div>

        ${this.alerts.length>0?r`
          <div class="row mb-4">
            <div class="col-12">
              ${this.alerts.map(t=>r`
                <div class="alert alert-${t.type==="critical"?"danger":"warning"} d-flex justify-content-between align-items-center mb-2">
                  <div><i class="bi bi-exclamation-triangle me-2"></i><strong>${t.message}</strong></div>
                  <button class="btn btn-sm btn-${t.type==="critical"?"danger":"warning"}" @click=${()=>this.orderEntireList(t.list)}>
                    <i class="bi bi-cart-plus me-1"></i>Order Entire List
                  </button>
                </div>
              `)}
            </div>
          </div>
        `:""}

        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card border-primary">
              <div class="card-body">
                <h6 class="text-muted">Total Lists</h6>
                <h2 class="mb-0 text-primary">${this.keepStockLists.length}</h2>
                <small class="text-muted">${this.keepStockLists.reduce((t,e)=>t+e.items.length,0)} products</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-danger">
              <div class="card-body">
                <h6 class="text-muted">Critical Lists</h6>
                <h2 class="mb-0 text-danger">${this.criticalCount}</h2>
                <small class="text-muted">Need immediate action</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-warning">
              <div class="card-body">
                <h6 class="text-muted">Low Stock</h6>
                <h2 class="mb-0 text-warning">${this.lowStockCount}</h2>
                <small class="text-muted">Monitor closely</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-success">
              <div class="card-body">
                <h6 class="text-muted">Optimal</h6>
                <h2 class="mb-0 text-success">${this.optimalCount}</h2>
                <small class="text-muted">Well stocked</small>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold"><i class="bi bi-search me-2"></i>Search by KeepStock Number or Name</label>
                <input type="text" class="form-control form-control-lg" placeholder="Try: KS-2024-001, Office Essentials..." @input=${this.handleSearch}>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-bold">Filter by Status</label>
                <select class="form-select form-select-lg" @change=${this.handleFilterChange}>
                  <option value="all">All Statuses</option>
                  <option value="critical">Critical Only</option>
                  <option value="low_stock">Low Stock Only</option>
                  <option value="optimal">Optimal Only</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">&nbsp;</label>
                <div class="text-muted">
                  <small>Showing ${this.filteredLists.length} of ${this.keepStockLists.length} lists</small>
                  ${this.searchTerm?r`<br><small class="text-primary">Search: "${this.searchTerm}"</small>`:""}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>KeepStock #</th>
                    <th>List Name</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Total Value</th>
                    <th>Auto-Reorder</th>
                    <th>Last Ordered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.filteredLists.length>0?this.filteredLists.map(t=>{const e=this.getListStatus(t),a=t.items.reduce((o,l)=>o+l.currentStock*l.unitPrice,0),i=t.items.reduce((o,l)=>o+l.reorderQuantity*l.unitPrice,0),s=t.items.filter(o=>o.status==="critical").length,c=t.items.filter(o=>o.status==="low_stock").length;return r`
                      <tr>
                        <td>
                          <strong class="text-primary fs-5">${t.keepStockNumber}</strong>
                          <br><span class="badge bg-secondary">${t.category}</span>
                        </td>
                        <td>
                          <strong>${t.name}</strong>
                          <br><small class="text-muted">${t.description}</small>
                        </td>
                        <td>
                          <span class="badge bg-info fs-6">${t.items.length} items</span>
                          ${s>0?r`<br><small class="text-danger fw-bold">${s} critical</small>`:""}
                          ${c>0?r`<br><small class="text-warning">${c} low</small>`:""}
                        </td>
                        <td>
                          <span class="badge ${this.getStatusBadge(e)} fs-6">
                            ${this.getStatusText(e)}
                          </span>
                        </td>
                        <td>
                          <strong>${this.formatCurrency(a)}</strong>
                          <br><small class="text-muted">Reorder: ${this.formatCurrency(i)}</small>
                        </td>
                        <td>
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" ?checked=${t.autoReorder} @change=${()=>this.toggleAutoReorder(t)}>
                          </div>
                        </td>
                        <td>${this.formatDate(t.lastOrdered)}</td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" @click=${()=>this.viewListDetails(t)}>
                              <i class="bi bi-eye"></i> Details
                            </button>
                            ${e!=="optimal"?r`
                              <button class="btn btn-success" @click=${()=>this.orderEntireList(t)}>
                                <i class="bi bi-cart-plus"></i> Order List
                              </button>
                            `:""}
                          </div>
                        </td>
                      </tr>
                    `}):r`
                    <tr>
                      <td colspan="8" class="text-center py-5">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <p class="mt-2 mb-0">No KeepStock lists found</p>
                        ${this.searchTerm?r`<button class="btn btn-sm btn-outline-primary mt-2" @click=${()=>{this.searchTerm="",this.requestUpdate()}}>Clear Search</button>`:""}
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        ${this.showDetailModal&&this.selectedList?r`
          <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl">
              <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                  <h5 class="modal-title"><i class="bi bi-boxes me-2"></i>${this.selectedList.name} (${this.selectedList.keepStockNumber})</h5>
                  <button type="button" class="btn-close btn-close-white" @click=${this.closeDetailModal}></button>
                </div>
                <div class="modal-body">
                  <div class="row mb-4">
                    <div class="col-md-8">
                      <h6 class="text-muted">List Information</h6>
                      <p class="mb-1"><strong>KeepStock Number:</strong> <span class="text-primary fs-5">${this.selectedList.keepStockNumber}</span></p>
                      <p class="mb-1"><strong>Description:</strong> ${this.selectedList.description}</p>
                      <p class="mb-1"><strong>Category:</strong> <span class="badge bg-secondary">${this.selectedList.category}</span></p>
                      <p class="mb-1"><strong>Total Products:</strong> ${this.selectedList.items.length}</p>
                    </div>
                    <div class="col-md-4">
                      <div class="card bg-light">
                        <div class="card-body">
                          <h6>Reorder Summary</h6>
                          <p class="mb-1">Total Items: <strong>${this.selectedList.items.reduce((t,e)=>t+e.reorderQuantity,0)}</strong></p>
                          <p class="mb-1">Estimated Cost:</p>
                          <h4 class="text-primary">${this.formatCurrency(this.selectedList.items.reduce((t,e)=>t+e.reorderQuantity*e.unitPrice,0))}</h4>
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" ?checked=${this.selectedList.autoReorder} @change=${()=>this.toggleAutoReorder(this.selectedList)}>
                            <label class="form-check-label">Auto-Reorder</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h6 class="text-muted mb-3">Products in this List</h6>
                  <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                      <thead class="table-light">
                        <tr>
                          <th>Product</th>
                          <th>SKU</th>
                          <th>Current Stock</th>
                          <th>Min/Max</th>
                          <th>Reorder Qty</th>
                          <th>Unit Price</th>
                          <th>Status</th>
                          <th>Line Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.selectedList.items.map(t=>r`
                          <tr>
                            <td><strong>${t.productName}</strong></td>
                            <td><small class="text-muted">${t.sku}</small></td>
                            <td><span class="badge ${this.getStatusBadge(t.status)}">${t.currentStock}</span></td>
                            <td><small>${t.minStock} / ${t.maxStock}</small></td>
                            <td><strong>${t.reorderQuantity}</strong></td>
                            <td>${this.formatCurrency(t.unitPrice)}</td>
                            <td><span class="badge ${this.getStatusBadge(t.status)}">${this.getStatusText(t.status)}</span></td>
                            <td class="fw-bold">${this.formatCurrency(t.reorderQuantity*t.unitPrice)}</td>
                          </tr>
                        `)}
                      </tbody>
                      <tfoot class="table-light">
                        <tr>
                          <td colspan="7" class="text-end"><strong>Total Order Cost:</strong></td>
                          <td class="fw-bold text-primary fs-5">${this.formatCurrency(this.selectedList.items.reduce((t,e)=>t+e.reorderQuantity*e.unitPrice,0))}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-secondary" @click=${this.closeDetailModal}>Close</button>
                  <button class="btn btn-success btn-lg" @click=${()=>this.orderEntireList(this.selectedList)}>
                    <i class="bi bi-cart-plus me-2"></i>Order Entire List (${this.selectedList.items.length} items)
                  </button>
                </div>
              </div>
            </div>
          </div>
        `:""}

        <div class="card mt-4">
          <div class="card-header bg-light">
            <h5 class="mb-0"><i class="bi bi-lightbulb me-2"></i>How KeepStock Lists Work</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <h6><i class="bi bi-1-circle text-primary me-2"></i>Create Lists</h6>
                <p class="small">Group related products into KeepStock lists</p>
              </div>
              <div class="col-md-3">
                <h6><i class="bi bi-2-circle text-primary me-2"></i>Search by Number</h6>
                <p class="small">Find lists quickly by their unique KeepStock number</p>
              </div>
              <div class="col-md-3">
                <h6><i class="bi bi-3-circle text-primary me-2"></i>Monitor Status</h6>
                <p class="small">System tracks all items and alerts when any product runs low</p>
              </div>
              <div class="col-md-3">
                <h6><i class="bi bi-4-circle text-primary me-2"></i>Order Entire List</h6>
                <p class="small">One-click ordering of all items in the list</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("keepstock-dashboard",n);
