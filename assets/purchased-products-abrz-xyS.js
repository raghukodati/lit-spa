import{T as d,N as s}from"./index-tL1z1sM1.js";const o=[{id:1,orderNumber:"ORD-2025-0234",itemNumber:"LAPTOP-PRO-15",productName:'Laptop Pro 15" (16GB RAM)',category:"Electronics",quantity:2,unitPrice:1899.99,totalPrice:3799.98,purchaseDate:"2025-11-01",purchasedBy:"John Smith",department:"Engineering",supplier:"TechSupply Inc.",status:"delivered",deliveryDate:"2025-11-03",invoiceNumber:"INV-2025-0456"},{id:2,orderNumber:"ORD-2025-0235",itemNumber:"DESK-ERGO-ADJ",productName:"Ergonomic Adjustable Desk",category:"Furniture",quantity:5,unitPrice:599.99,totalPrice:2999.95,purchaseDate:"2025-10-28",purchasedBy:"Sarah Johnson",department:"Operations",supplier:"Office Furniture Co.",status:"delivered",deliveryDate:"2025-10-30",invoiceNumber:"INV-2025-0445"},{id:3,orderNumber:"ORD-2025-0232",itemNumber:"PAPER-A4-500",productName:"Office Paper A4 (500 sheets)",category:"Office Supplies",quantity:50,unitPrice:4.99,totalPrice:249.5,purchaseDate:"2025-10-25",purchasedBy:"John Smith",department:"Engineering",supplier:"Supply Express",status:"delivered",deliveryDate:"2025-10-26",invoiceNumber:"INV-2025-0432"},{id:4,orderNumber:"ORD-2025-0228",itemNumber:"MONITOR-27-4K",productName:'Monitor 27" 4K Display',category:"Electronics",quantity:10,unitPrice:449.99,totalPrice:4499.9,purchaseDate:"2025-10-20",purchasedBy:"Emily Davis",department:"Design",supplier:"TechSupply Inc.",status:"delivered",deliveryDate:"2025-10-22",invoiceNumber:"INV-2025-0418"},{id:5,orderNumber:"ORD-2025-0225",itemNumber:"CHAIR-EXEC-MESH",productName:"Executive Mesh Office Chair",category:"Furniture",quantity:15,unitPrice:299.99,totalPrice:4499.85,purchaseDate:"2025-10-15",purchasedBy:"Sarah Johnson",department:"Operations",supplier:"Office Furniture Co.",status:"delivered",deliveryDate:"2025-10-17",invoiceNumber:"INV-2025-0398"},{id:6,orderNumber:"ORD-2025-0220",itemNumber:"TONER-BLK-5000",productName:"Toner Cartridge Black (5000 pages)",category:"Printer Supplies",quantity:20,unitPrice:89.99,totalPrice:1799.8,purchaseDate:"2025-10-10",purchasedBy:"Michael Brown",department:"Marketing",supplier:"Supply Express",status:"delivered",deliveryDate:"2025-10-12",invoiceNumber:"INV-2025-0375"},{id:7,orderNumber:"ORD-2025-0215",itemNumber:"KEYBOARD-MECH",productName:"Mechanical Keyboard (RGB)",category:"Electronics",quantity:8,unitPrice:129.99,totalPrice:1039.92,purchaseDate:"2025-10-05",purchasedBy:"Emily Davis",department:"Design",supplier:"TechSupply Inc.",status:"delivered",deliveryDate:"2025-10-07",invoiceNumber:"INV-2025-0356"},{id:8,orderNumber:"ORD-2025-0212",itemNumber:"SANITIZER-GAL",productName:"Hand Sanitizer (Gallon)",category:"Janitorial",quantity:30,unitPrice:12.5,totalPrice:375,purchaseDate:"2025-09-28",purchasedBy:"John Smith",department:"Engineering",supplier:"CleanPro Supply",status:"delivered",deliveryDate:"2025-09-30",invoiceNumber:"INV-2025-0334"},{id:9,orderNumber:"ORD-2025-0208",itemNumber:"WEBCAM-HD-1080",productName:"HD Webcam 1080p",category:"Electronics",quantity:12,unitPrice:79.99,totalPrice:959.88,purchaseDate:"2025-09-20",purchasedBy:"Sarah Johnson",department:"Operations",supplier:"TechSupply Inc.",status:"delivered",deliveryDate:"2025-09-22",invoiceNumber:"INV-2025-0312"},{id:10,orderNumber:"ORD-2025-0205",itemNumber:"WHITEBOARD-6X4",productName:"Whiteboard 6x4 ft with Stand",category:"Office Supplies",quantity:4,unitPrice:249.99,totalPrice:999.96,purchaseDate:"2025-09-15",purchasedBy:"Michael Brown",department:"Marketing",supplier:"Office Furniture Co.",status:"delivered",deliveryDate:"2025-09-17",invoiceNumber:"INV-2025-0298"},{id:11,orderNumber:"ORD-2025-0201",itemNumber:"COFFEE-GRD-5LB",productName:"Premium Coffee Ground (5lb)",category:"Break Room",quantity:10,unitPrice:24.99,totalPrice:249.9,purchaseDate:"2025-09-10",purchasedBy:"Emily Davis",department:"Design",supplier:"Supply Express",status:"delivered",deliveryDate:"2025-09-11",invoiceNumber:"INV-2025-0285"},{id:12,orderNumber:"ORD-2025-0198",itemNumber:"HEADSET-NOISE-CANCEL",productName:"Noise Cancelling Headset",category:"Electronics",quantity:25,unitPrice:159.99,totalPrice:3999.75,purchaseDate:"2025-09-05",purchasedBy:"John Smith",department:"Engineering",supplier:"TechSupply Inc.",status:"delivered",deliveryDate:"2025-09-07",invoiceNumber:"INV-2025-0271"}];class n extends d{static properties={purchases:{type:Array},filteredPurchases:{type:Array},searchTerm:{type:String},selectedUser:{type:String},startDate:{type:String},endDate:{type:String},sortBy:{type:String},sortOrder:{type:String},showDetailModal:{type:Boolean},selectedPurchase:{type:Object}};constructor(){super(),this.purchases=o,this.filteredPurchases=[...this.purchases],this.searchTerm="",this.selectedUser="all",this.startDate="",this.endDate="",this.sortBy="date",this.sortOrder="desc",this.showDetailModal=!1,this.selectedPurchase=null}createRenderRoot(){return this}applyFilters(){let e=[...this.purchases];if(this.searchTerm){const t=this.searchTerm.toLowerCase();e=e.filter(r=>r.itemNumber.toLowerCase().includes(t)||r.productName.toLowerCase().includes(t)||r.category.toLowerCase().includes(t)||r.orderNumber.toLowerCase().includes(t))}this.selectedUser!=="all"&&(e=e.filter(t=>t.purchasedBy===this.selectedUser)),this.startDate&&(e=e.filter(t=>t.purchaseDate>=this.startDate)),this.endDate&&(e=e.filter(t=>t.purchaseDate<=this.endDate)),e.sort((t,r)=>{let l,i;switch(this.sortBy){case"date":l=new Date(t.purchaseDate),i=new Date(r.purchaseDate);break;case"amount":l=t.totalPrice,i=r.totalPrice;break;case"product":l=t.productName.toLowerCase(),i=r.productName.toLowerCase();break;case"quantity":l=t.quantity,i=r.quantity;break;case"user":l=t.purchasedBy.toLowerCase(),i=r.purchasedBy.toLowerCase();break;default:return 0}return l<i?this.sortOrder==="asc"?-1:1:l>i?this.sortOrder==="asc"?1:-1:0}),this.filteredPurchases=e,this.requestUpdate()}handleSearch(e){this.searchTerm=e.target.value,this.applyFilters()}handleUserFilter(e){this.selectedUser=e.target.value,this.applyFilters()}handleStartDate(e){this.startDate=e.target.value,this.applyFilters()}handleEndDate(e){this.endDate=e.target.value,this.applyFilters()}handleSort(e){this.sortBy=e.target.value,this.applyFilters()}toggleSortOrder(){this.sortOrder=this.sortOrder==="asc"?"desc":"asc",this.applyFilters()}clearFilters(){this.searchTerm="",this.selectedUser="all",this.startDate="",this.endDate="",this.sortBy="date",this.sortOrder="desc",this.filteredPurchases=[...this.purchases];const e=this.querySelector("form");e&&e.reset(),this.requestUpdate()}viewDetails(e){this.selectedPurchase=e,this.showDetailModal=!0,this.requestUpdate()}closeDetailModal(){this.showDetailModal=!1,this.selectedPurchase=null,this.requestUpdate()}reorderProduct(e){alert(`Reordering: ${e.productName}
Item #: ${e.itemNumber}
Quantity: ${e.quantity}`)}exportToCSV(){const e=["Order#","Item#","Product","Quantity","Unit Price","Total","Date","Purchased By","Department","Status"],t=this.filteredPurchases.map(a=>[a.orderNumber,a.itemNumber,a.productName,a.quantity,a.unitPrice,a.totalPrice,a.purchaseDate,a.purchasedBy,a.department,a.status]),r=[e,...t].map(a=>a.join(",")).join(`
`),l=new Blob([r],{type:"text/csv"}),i=window.URL.createObjectURL(l),c=document.createElement("a");c.href=i,c.download=`purchased-products-${new Date().toISOString().split("T")[0]}.csv`,c.click(),window.URL.revokeObjectURL(i)}get uniqueUsers(){return[...new Set(this.purchases.map(t=>t.purchasedBy))].sort()}get totalAmount(){return this.filteredPurchases.reduce((e,t)=>e+t.totalPrice,0)}get totalQuantity(){return this.filteredPurchases.reduce((e,t)=>e+t.quantity,0)}get uniqueProducts(){return new Set(this.filteredPurchases.map(e=>e.productName)).size}formatCurrency(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(e)}formatDate(e){return new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}render(){return s`
      ${this.renderHeader()}
      ${this.renderSummaryCards()}
      ${this.renderFilters()}
      ${this.renderTable()}
      ${this.renderDetailModal()}
    `}renderHeader(){return s`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2><i class="bi bi-cart-check me-2"></i>My Purchased Products</h2>
                <p class="text-muted">View and filter your purchase history</p>
              </div>
              <button class="btn btn-success" @click=${this.exportToCSV}>
                <i class="bi bi-download me-2"></i>Export to CSV
              </button>
            </div>
          </div>
        </div>
    `}renderSummaryCards(){return s`
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card border-primary">
              <div class="card-body">
                <h6 class="text-muted">Total Purchases</h6>
                <h2 class="mb-0 text-primary">${this.filteredPurchases.length}</h2>
                <small class="text-muted">Orders</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-success">
              <div class="card-body">
                <h6 class="text-muted">Total Amount</h6>
                <h2 class="mb-0 text-success">${this.formatCurrency(this.totalAmount)}</h2>
                <small class="text-muted">Spent</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-info">
              <div class="card-body">
                <h6 class="text-muted">Total Items</h6>
                <h2 class="mb-0 text-info">${this.totalQuantity}</h2>
                <small class="text-muted">Units purchased</small>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-warning">
              <div class="card-body">
                <h6 class="text-muted">Unique Products</h6>
                <h2 class="mb-0 text-warning">${this.uniqueProducts}</h2>
                <small class="text-muted">Different items</small>
              </div>
            </div>
          </div>
        </div>
    `}renderFilters(){return s`
        <div class="card mb-4">
          <div class="card-header bg-light">
            <h5 class="mb-0"><i class="bi bi-funnel me-2"></i>Filters & Search</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label fw-bold">
                  <i class="bi bi-search me-2"></i>Search by Item Number or Keyword
                </label>
                <input type="text" 
                       class="form-control" 
                       placeholder="Item number, product name, category..." 
                       .value=${this.searchTerm}
                       @input=${this.handleSearch}>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-bold">
                  <i class="bi bi-person me-2"></i>Filter by User
                </label>
                <select class="form-select" .value=${this.selectedUser} @change=${this.handleUserFilter}>
                  <option value="all">All Users</option>
                  ${this.uniqueUsers.map(e=>s`
                    <option value="${e}">${e}</option>
                  `)}
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label fw-bold">
                  <i class="bi bi-calendar me-2"></i>Start Date
                </label>
                <input type="date" 
                       class="form-control" 
                       .value=${this.startDate}
                       @change=${this.handleStartDate}>
              </div>
              <div class="col-md-2">
                <label class="form-label fw-bold">
                  <i class="bi bi-calendar me-2"></i>End Date
                </label>
                <input type="date" 
                       class="form-control" 
                       .value=${this.endDate}
                       @change=${this.handleEndDate}>
              </div>
              <div class="col-md-1">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" 
                        @click=${this.clearFilters}
                        title="Clear all filters">
                  <i class="bi bi-x-circle"></i>
                </button>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-md-3">
                <label class="form-label fw-bold">
                  <i class="bi bi-sort-down me-2"></i>Sort By
                </label>
                <div class="input-group">
                  <select class="form-select" .value=${this.sortBy} @change=${this.handleSort}>
                    <option value="date">Purchase Date</option>
                    <option value="amount">Total Amount</option>
                    <option value="product">Product Name</option>
                    <option value="quantity">Quantity</option>
                    <option value="user">Purchased By</option>
                  </select>
                  <button class="btn btn-outline-primary" 
                          @click=${this.toggleSortOrder}
                          title="Toggle sort direction">
                    <i class="bi bi-arrow-${this.sortOrder==="asc"?"up":"down"}"></i>
                  </button>
                </div>
              </div>
              <div class="col-md-9">
                <label class="form-label">&nbsp;</label>
                <div class="text-muted">
                  <small>
                    Showing ${this.filteredPurchases.length} of ${this.purchases.length} purchases
                    ${this.searchTerm?s` | Search: "<strong>${this.searchTerm}</strong>"`:""}
                    ${this.selectedUser!=="all"?s` | User: <strong>${this.selectedUser}</strong>`:""}
                    ${this.startDate?s` | From: <strong>${this.formatDate(this.startDate)}</strong>`:""}
                    ${this.endDate?s` | To: <strong>${this.formatDate(this.endDate)}</strong>`:""}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
    `}renderTable(){return s`
        <div class="card">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Item Number</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Purchase Date</th>
                    <th>Purchased By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.filteredPurchases.length>0?this.filteredPurchases.map(e=>s`
                    <tr>
                      <td>
                        <strong class="text-primary">${e.orderNumber}</strong>
                        <br><small class="text-muted">${e.invoiceNumber}</small>
                      </td>
                      <td>
                        <code class="bg-light p-1">${e.itemNumber}</code>
                      </td>
                      <td>
                        <strong>${e.productName}</strong>
                        <br><span class="badge bg-secondary">${e.category}</span>
                      </td>
                      <td>
                        <span class="badge bg-info fs-6">${e.quantity}</span>
                      </td>
                      <td>${this.formatCurrency(e.unitPrice)}</td>
                      <td class="fw-bold text-success">${this.formatCurrency(e.totalPrice)}</td>
                      <td>
                        ${this.formatDate(e.purchaseDate)}
                        <br><small class="text-muted">Delivered: ${this.formatDate(e.deliveryDate)}</small>
                      </td>
                      <td>
                        <strong>${e.purchasedBy}</strong>
                        <br><small class="text-muted">${e.department}</small>
                      </td>
                      <td>
                        <span class="badge bg-success">
                          <i class="bi bi-check-circle me-1"></i>${e.status}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" 
                                  @click=${()=>this.viewDetails(e)}
                                  title="View Details">
                            <i class="bi bi-eye"></i>
                          </button>
                          <button class="btn btn-outline-success" 
                                  @click=${()=>this.reorderProduct(e)}
                                  title="Reorder">
                            <i class="bi bi-arrow-repeat"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `):s`
                    <tr>
                      <td colspan="10" class="text-center py-5">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <p class="mt-2 mb-0">No purchases found</p>
                        <button class="btn btn-sm btn-outline-primary mt-2" @click=${this.clearFilters}>
                          Clear Filters
                        </button>
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `}renderDetailModal(){return!this.showDetailModal||!this.selectedPurchase?"":s`
      <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="bi bi-receipt me-2"></i>
                Purchase Details - ${this.selectedPurchase.orderNumber}
              </h5>
              <button type="button" class="btn-close btn-close-white" @click=${this.closeDetailModal}></button>
            </div>
            <div class="modal-body">
              <div class="row mb-4">
                <div class="col-md-6">
                  <h6 class="text-muted">Order Information</h6>
                  <p class="mb-1"><strong>Order Number:</strong> ${this.selectedPurchase.orderNumber}</p>
                  <p class="mb-1"><strong>Invoice Number:</strong> ${this.selectedPurchase.invoiceNumber}</p>
                  <p class="mb-1"><strong>Purchase Date:</strong> ${this.formatDate(this.selectedPurchase.purchaseDate)}</p>
                  <p class="mb-1"><strong>Delivery Date:</strong> ${this.formatDate(this.selectedPurchase.deliveryDate)}</p>
                  <p class="mb-1">
                    <strong>Status:</strong> 
                    <span class="badge bg-success ms-2">${this.selectedPurchase.status}</span>
                  </p>
                </div>
                <div class="col-md-6">
                  <h6 class="text-muted">Purchaser Information</h6>
                  <p class="mb-1"><strong>Purchased By:</strong> ${this.selectedPurchase.purchasedBy}</p>
                  <p class="mb-1"><strong>Department:</strong> ${this.selectedPurchase.department}</p>
                  <p class="mb-1"><strong>Supplier:</strong> ${this.selectedPurchase.supplier}</p>
                </div>
              </div>

              <div class="card bg-light mb-4">
                <div class="card-body">
                  <h6 class="text-muted mb-3">Product Details</h6>
                  <div class="row">
                    <div class="col-md-6">
                      <p class="mb-1"><strong>Item Number:</strong></p>
                      <p><code class="bg-white p-2">${this.selectedPurchase.itemNumber}</code></p>
                      <p class="mb-1"><strong>Product Name:</strong></p>
                      <p>${this.selectedPurchase.productName}</p>
                      <p class="mb-1"><strong>Category:</strong></p>
                      <p><span class="badge bg-secondary">${this.selectedPurchase.category}</span></p>
                    </div>
                    <div class="col-md-6">
                      <p class="mb-1"><strong>Quantity:</strong></p>
                      <p class="fs-4 text-info">${this.selectedPurchase.quantity} units</p>
                      <p class="mb-1"><strong>Unit Price:</strong></p>
                      <p class="fs-5">${this.formatCurrency(this.selectedPurchase.unitPrice)}</p>
                      <p class="mb-1"><strong>Total Price:</strong></p>
                      <p class="fs-4 text-success fw-bold">${this.formatCurrency(this.selectedPurchase.totalPrice)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                <strong>Note:</strong> This purchase was delivered on ${this.formatDate(this.selectedPurchase.deliveryDate)}.
                For any issues, please contact your supplier directly.
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click=${this.closeDetailModal}>
                Close
              </button>
              <button class="btn btn-success" @click=${()=>this.reorderProduct(this.selectedPurchase)}>
                <i class="bi bi-arrow-repeat me-2"></i>Reorder This Item
              </button>
              <button class="btn btn-primary">
                <i class="bi bi-file-earmark-pdf me-2"></i>Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("purchased-products",n);
