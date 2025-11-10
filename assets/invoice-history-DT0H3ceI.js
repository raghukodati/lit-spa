import{T as a,N as e}from"./index-YRTalx74.js";class i extends a{static properties={invoices:{type:Array},loading:{type:Boolean},searchTerm:{type:String},statusFilter:{type:String},dateRange:{type:String},selectedInvoice:{type:Object},showDetailModal:{type:Boolean}};constructor(){super(),this.invoices=this.getMockInvoices(),this.loading=!1,this.searchTerm="",this.statusFilter="all",this.dateRange="90",this.selectedInvoice=null,this.showDetailModal=!1}createRenderRoot(){return this}getMockInvoices(){return[{id:1001,invoiceNumber:"INV-2025-001",orderNumber:"PO-12345",date:"2025-01-15",dueDate:"2025-02-14",status:"paid",amount:3245.5,paidAmount:3245.5,balance:0,items:[{name:"Professional Laptop",quantity:2,price:1299.99},{name:"Wireless Mouse",quantity:5,price:29.99}],customerPO:"CUST-PO-789",paymentTerms:"NET30",notes:"Paid via ACH"},{id:1002,invoiceNumber:"INV-2025-002",orderNumber:"PO-12346",date:"2025-01-20",dueDate:"2025-02-19",status:"pending",amount:5678.25,paidAmount:0,balance:5678.25,items:[{name:"Office Desk",quantity:3,price:849.99},{name:"Office Chair",quantity:3,price:599.99}],customerPO:"CUST-PO-790",paymentTerms:"NET30",notes:""},{id:1003,invoiceNumber:"INV-2025-003",orderNumber:"PO-12347",date:"2025-01-25",dueDate:"2025-02-24",status:"partial",amount:2450,paidAmount:1e3,balance:1450,items:[{name:'Monitor 27"',quantity:4,price:449.99},{name:"HDMI Cable",quantity:4,price:19.99}],customerPO:"CUST-PO-791",paymentTerms:"NET30",notes:"Partial payment received"},{id:1004,invoiceNumber:"INV-2025-004",orderNumber:"PO-12348",date:"2024-12-10",dueDate:"2025-01-09",status:"overdue",amount:8999.99,paidAmount:0,balance:8999.99,items:[{name:"Heavy Equipment",quantity:1,price:8999.99}],customerPO:"CUST-PO-788",paymentTerms:"NET30",notes:"Payment overdue - please contact billing"}]}handleSearch(t){this.searchTerm=t.target.value.toLowerCase(),this.requestUpdate()}handleStatusFilter(t){this.statusFilter=t.target.value,this.requestUpdate()}handleDateRange(t){this.dateRange=t.target.value,this.requestUpdate()}viewInvoice(t){this.selectedInvoice=t,this.showDetailModal=!0,this.requestUpdate()}closeDetailModal(){this.showDetailModal=!1,this.selectedInvoice=null,this.requestUpdate()}downloadInvoice(t){alert(`Downloading invoice ${t.invoiceNumber}...`)}printInvoice(t){alert(`Printing invoice ${t.invoiceNumber}...`)}payInvoice(t){window.location.pathname=`/b2b-store/invoice/${t.id}/pay`}get filteredInvoices(){return this.invoices.filter(t=>{if(this.statusFilter!=="all"&&t.status!==this.statusFilter)return!1;if(this.searchTerm){const s=this.searchTerm.toLowerCase();return t.invoiceNumber.toLowerCase().includes(s)||t.orderNumber.toLowerCase().includes(s)||t.customerPO?.toLowerCase().includes(s)}return!0})}get totals(){return this.filteredInvoices.reduce((t,s)=>({total:t.total+s.amount,paid:t.paid+s.paidAmount,balance:t.balance+s.balance}),{total:0,paid:0,balance:0})}formatCurrency(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t)}formatDate(t){return new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}getStatusBadge(t){return{paid:"bg-success",pending:"bg-warning text-dark",partial:"bg-info",overdue:"bg-danger"}[t]||"bg-secondary"}render(){return e`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <h2><i class="bi bi-receipt me-2"></i>Invoice History</h2>
            <p class="text-muted">View and manage your invoices</p>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card border-primary">
              <div class="card-body">
                <h6 class="text-muted">Total Invoiced</h6>
                <h3 class="mb-0">${this.formatCurrency(this.totals.total)}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-success">
              <div class="card-body">
                <h6 class="text-muted">Total Paid</h6>
                <h3 class="mb-0 text-success">${this.formatCurrency(this.totals.paid)}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-warning">
              <div class="card-body">
                <h6 class="text-muted">Outstanding Balance</h6>
                <h3 class="mb-0 text-warning">${this.formatCurrency(this.totals.balance)}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Search</label>
                <input type="text" class="form-control" 
                       placeholder="Invoice #, Order #, PO #" 
                       @input=${this.handleSearch}>
              </div>
              <div class="col-md-4">
                <label class="form-label">Status</label>
                <select class="form-select" @change=${this.handleStatusFilter}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partially Paid</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Date Range</label>
                <select class="form-select" @change=${this.handleDateRange}>
                  <option value="30">Last 30 days</option>
                  <option value="90" selected>Last 90 days</option>
                  <option value="180">Last 6 months</option>
                  <option value="365">Last year</option>
                  <option value="all">All time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoices Table -->
        <div class="card">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Due Date</th>
                    <th>Order #</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.filteredInvoices.length>0?e`
                    ${this.filteredInvoices.map(t=>e`
                      <tr>
                        <td>
                          <strong>${t.invoiceNumber}</strong>
                          ${t.customerPO?e`
                            <br><small class="text-muted">PO: ${t.customerPO}</small>
                          `:""}
                        </td>
                        <td>${this.formatDate(t.date)}</td>
                        <td>
                          ${this.formatDate(t.dueDate)}
                          ${t.status==="overdue"?e`
                            <br><small class="text-danger">
                              <i class="bi bi-exclamation-triangle"></i> Overdue
                            </small>
                          `:""}
                        </td>
                        <td>
                          <a href="/b2b-store/orders/${t.orderNumber}">${t.orderNumber}</a>
                        </td>
                        <td class="fw-bold">${this.formatCurrency(t.amount)}</td>
                        <td class="text-success">${this.formatCurrency(t.paidAmount)}</td>
                        <td class="${t.balance>0?"text-warning fw-bold":"text-muted"}">
                          ${this.formatCurrency(t.balance)}
                        </td>
                        <td>
                          <span class="badge ${this.getStatusBadge(t.status)}">
                            ${t.status}
                          </span>
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" 
                                    @click=${()=>this.viewInvoice(t)}
                                    title="View Details">
                              <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-secondary" 
                                    @click=${()=>this.downloadInvoice(t)}
                                    title="Download PDF">
                              <i class="bi bi-download"></i>
                            </button>
                            ${t.balance>0?e`
                              <button class="btn btn-outline-success" 
                                      @click=${()=>this.payInvoice(t)}
                                      title="Pay Now">
                                <i class="bi bi-credit-card"></i>
                              </button>
                            `:""}
                          </div>
                        </td>
                      </tr>
                    `)}
                  `:e`
                    <tr>
                      <td colspan="9" class="text-center text-muted py-4">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <p class="mt-2">No invoices found</p>
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Invoice Detail Modal -->
        ${this.showDetailModal&&this.selectedInvoice?e`
          <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">
                    Invoice ${this.selectedInvoice.invoiceNumber}
                  </h5>
                  <button type="button" class="btn-close" @click=${this.closeDetailModal}></button>
                </div>
                <div class="modal-body">
                  <!-- Invoice Header -->
                  <div class="row mb-4">
                    <div class="col-6">
                      <h6 class="text-muted">Invoice Details</h6>
                      <p class="mb-1"><strong>Invoice #:</strong> ${this.selectedInvoice.invoiceNumber}</p>
                      <p class="mb-1"><strong>Date:</strong> ${this.formatDate(this.selectedInvoice.date)}</p>
                      <p class="mb-1"><strong>Due Date:</strong> ${this.formatDate(this.selectedInvoice.dueDate)}</p>
                      <p class="mb-1"><strong>Terms:</strong> ${this.selectedInvoice.paymentTerms}</p>
                    </div>
                    <div class="col-6">
                      <h6 class="text-muted">Order Information</h6>
                      <p class="mb-1"><strong>Order #:</strong> ${this.selectedInvoice.orderNumber}</p>
                      <p class="mb-1"><strong>Customer PO:</strong> ${this.selectedInvoice.customerPO||"N/A"}</p>
                      <p class="mb-1">
                        <strong>Status:</strong> 
                        <span class="badge ${this.getStatusBadge(this.selectedInvoice.status)} ms-1">
                          ${this.selectedInvoice.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <!-- Line Items -->
                  <h6 class="text-muted mb-3">Line Items</h6>
                  <div class="table-responsive mb-4">
                    <table class="table table-sm">
                      <thead class="table-light">
                        <tr>
                          <th>Item</th>
                          <th class="text-end">Quantity</th>
                          <th class="text-end">Price</th>
                          <th class="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.selectedInvoice.items.map(t=>e`
                          <tr>
                            <td>${t.name}</td>
                            <td class="text-end">${t.quantity}</td>
                            <td class="text-end">${this.formatCurrency(t.price)}</td>
                            <td class="text-end">${this.formatCurrency(t.quantity*t.price)}</td>
                          </tr>
                        `)}
                      </tbody>
                      <tfoot class="table-light">
                        <tr>
                          <td colspan="3" class="text-end"><strong>Subtotal:</strong></td>
                          <td class="text-end"><strong>${this.formatCurrency(this.selectedInvoice.amount)}</strong></td>
                        </tr>
                        <tr class="table-success">
                          <td colspan="3" class="text-end"><strong>Paid:</strong></td>
                          <td class="text-end text-success"><strong>${this.formatCurrency(this.selectedInvoice.paidAmount)}</strong></td>
                        </tr>
                        <tr class="table-warning">
                          <td colspan="3" class="text-end"><strong>Balance Due:</strong></td>
                          <td class="text-end text-warning"><strong>${this.formatCurrency(this.selectedInvoice.balance)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  ${this.selectedInvoice.notes?e`
                    <div class="alert alert-info">
                      <strong>Notes:</strong> ${this.selectedInvoice.notes}
                    </div>
                  `:""}
                </div>
                <div class="modal-footer">
                  <button class="btn btn-outline-secondary" @click=${()=>this.printInvoice(this.selectedInvoice)}>
                    <i class="bi bi-printer me-2"></i>Print
                  </button>
                  <button class="btn btn-outline-primary" @click=${()=>this.downloadInvoice(this.selectedInvoice)}>
                    <i class="bi bi-download me-2"></i>Download PDF
                  </button>
                  ${this.selectedInvoice.balance>0?e`
                    <button class="btn btn-success" @click=${()=>this.payInvoice(this.selectedInvoice)}>
                      <i class="bi bi-credit-card me-2"></i>Pay ${this.formatCurrency(this.selectedInvoice.balance)}
                    </button>
                  `:""}
                </div>
              </div>
            </div>
          </div>
        `:""}
      </div>
    `}}customElements.define("invoice-history",i);
