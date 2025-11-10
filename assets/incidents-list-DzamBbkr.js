import{N as s}from"./index-e1bWKrj6.js";import{B as c}from"./BaseComponent-C9iYdUKf.js";import"./ui-table-dER-Dcdj.js";class d extends c{static properties={incidents:{type:Array},loading:{type:Boolean},page:{type:Number},pageSize:{type:Number},total:{type:Number},totalPages:{type:Number},search:{type:String},filterPriority:{type:String},filterStatus:{type:String},filterCategory:{type:String},filterAccount:{type:String},fromDate:{type:String},toDate:{type:String},sortBy:{type:String},sortOrder:{type:String},showColumnManager:{type:Boolean},visibleColumns:{type:Object},partners:{type:Array}};createRenderRoot(){return this}constructor(){super(),this.incidents=[],this.loading=!0,this.partners=[],this.page=1,this.pageSize=10,this.total=0,this.totalPages=1,this.search="",this.filterPriority="",this.filterStatus="",this.filterCategory="",this.filterAccount="",this.fromDate="",this.toDate="",this.sortBy="reportedDate",this.sortOrder="desc",this.showColumnManager=!1,this.visibleColumns={incidentNumber:!0,inquiryReceived:!0,initialResponse:!0,priority:!0,category:!0,description:!0,clientEmail:!0,account:!0,status:!0}}async connectedCallback(){super.connectedCallback(),await Promise.all([this._loadIncidents(),this._loadPartners()])}async _loadPartners(){try{const t=await this.getService("dataService");this.partners=await t.getBusinessPartners({partnerType:"customer"})}catch{this.partners=[]}}async _loadIncidents(){this.loading=!0;try{let e=await(await this.getService("dataService")).getIncidents();if(e=e.map(i=>({...i,initialResponseDate:i.initialResponseDate||new Date(new Date(i.reportedDate).getTime()+30*6e4).toISOString(),clientEmail:i.clientEmail||`client${i.id}@example.com`,account:i.account||`Account ${i.id%5+1}`})),this.search){const i=this.search.toLowerCase();e=e.filter(a=>a.incidentNumber.toLowerCase().includes(i)||a.description.toLowerCase().includes(i)||a.clientEmail.toLowerCase().includes(i)||a.account.toLowerCase().includes(i))}if(this.filterPriority&&(e=e.filter(i=>i.priority===this.filterPriority)),this.filterStatus&&(e=e.filter(i=>i.status===this.filterStatus)),this.filterCategory&&(e=e.filter(i=>i.category===this.filterCategory)),this.filterAccount&&(e=e.filter(i=>i.account===this.filterAccount)),this.fromDate&&(e=e.filter(i=>new Date(i.reportedDate)>=new Date(this.fromDate))),this.toDate){const i=new Date(this.toDate);i.setHours(23,59,59,999),e=e.filter(a=>new Date(a.reportedDate)<=i)}e.sort((i,a)=>{let o=i[this.sortBy],n=a[this.sortBy];return(this.sortBy.includes("Date")||this.sortBy==="inquiryReceived"||this.sortBy==="initialResponse")&&(o=new Date(o||0),n=new Date(n||0)),o<n?this.sortOrder==="asc"?-1:1:o>n?this.sortOrder==="asc"?1:-1:0}),this.total=e.length,this.totalPages=Math.ceil(this.total/this.pageSize);const r=(this.page-1)*this.pageSize,l=r+this.pageSize;this.incidents=e.slice(r,l)}catch(t){console.error("Error loading incidents:",t)}finally{this.loading=!1}}_handleSearch(t){this.search=t.target.value,this.page=1,this._loadIncidents()}_handleFilterChange(){this.page=1,this._loadIncidents()}_handleSort(t){this.sortBy===t?this.sortOrder=this.sortOrder==="asc"?"desc":"asc":(this.sortBy=t,this.sortOrder="asc"),this._loadIncidents()}_handlePageChange(t){this.page=t,this._loadIncidents()}_handlePageSizeChange(t){this.pageSize=parseInt(t.target.value),this.page=1,this._loadIncidents()}_resetFilters(){this.search="",this.filterPriority="",this.filterStatus="",this.filterCategory="",this.filterAccount="",this.fromDate="",this.toDate="",this.page=1,this._loadIncidents()}_navigateToCreate(){window.history.pushState({},"","/sla/incidents/new"),window.dispatchEvent(new PopStateEvent("popstate"))}_navigateToEdit(t){window.history.pushState({},"",`/sla/incidents/edit/${t}`),window.dispatchEvent(new PopStateEvent("popstate"))}async _handleDelete(t,e){if(confirm(`Are you sure you want to delete incident ${e}?`))try{await(await this.getService("dataService")).deleteIncident(t),await this._loadIncidents()}catch(r){alert("Error deleting incident: "+r.message)}}_toggleColumnManager(){this.showColumnManager=!this.showColumnManager}_toggleColumn(t){this.visibleColumns={...this.visibleColumns,[t]:!this.visibleColumns[t]}}async _exportData(){const t=await this.getService("dataService"),e=await t.getIncidents(),r=t.exportIncidentsToCSV(e),l=new Blob([r],{type:"text/csv"}),i=window.URL.createObjectURL(l),a=document.createElement("a");a.href=i,a.download=`incidents_${new Date().toISOString().split("T")[0]}.csv`,a.click(),window.URL.revokeObjectURL(i)}_getSortIcon(t){return this.sortBy!==t?"bi-arrow-down-up":this.sortOrder==="asc"?"bi-sort-up":"bi-sort-down"}_getCategoryName(t){return{problem_resolution:"Problem Resolution",claim_resolution:"Claim Resolution",order_confirmation:"Order Confirmation",inventory_accuracy:"Inventory Accuracy",sourcing:"Sourcing",urgent_orders:"Urgent Orders"}[t]||t}_getCategoryBadge(t){return{problem_resolution:"danger",claim_resolution:"info",order_confirmation:"success",inventory_accuracy:"warning",sourcing:"primary",urgent_orders:"danger"}[t]||"secondary"}_getPriorityBadge(t){return{critical:"danger",urgent:"warning",high:"warning",medium:"info",low:"secondary"}[t]||"secondary"}_getStatusBadge(t){return{open:"warning",in_progress:"info",resolved:"success"}[t]||"secondary"}_formatDateTime(t){return t?new Date(t).toLocaleString():"N/A"}_getUniqueAccounts(){const t=new Set;return this.incidents.forEach(e=>{e.account&&t.add(e.account)}),Array.isArray(this.partners)&&this.partners.forEach(e=>{e.accountNumber&&t.add(e.accountNumber)}),Array.from(t).sort()}render(){return s`
      <div>
        <!-- Page Header -->
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h2 fw-bold mb-2">
                <i class="bi bi-list-ul text-primary me-2"></i>Incidents Management
              </h1>
              <p class="text-muted mb-0">Manage and track SLA incidents</p>
            </div>
            <button class="btn btn-primary" @click=${this._navigateToCreate}>
              <i class="bi bi-plus-circle me-2"></i>Create Incident
            </button>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row g-3 mb-3">
              <!-- Search -->
              <div class="col-md-3">
                <label class="form-label small text-muted">Search</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search..."
                  .value=${this.search}
                  @input=${this._handleSearch}
                />
              </div>

              <!-- Priority Filter -->
              <div class="col-md-2">
                <label class="form-label small text-muted">Priority</label>
                <select
                  class="form-select"
                  .value=${this.filterPriority}
                  @change=${t=>{this.filterPriority=t.target.value,this._handleFilterChange()}}
                >
                  <option value="">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <!-- Status Filter -->
              <div class="col-md-2">
                <label class="form-label small text-muted">Status</label>
                <select
                  class="form-select"
                  .value=${this.filterStatus}
                  @change=${t=>{this.filterStatus=t.target.value,this._handleFilterChange()}}
                >
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <!-- Category Filter -->
              <div class="col-md-2">
                <label class="form-label small text-muted">Category</label>
                <select
                  class="form-select"
                  .value=${this.filterCategory}
                  @change=${t=>{this.filterCategory=t.target.value,this._handleFilterChange()}}
                >
                  <option value="">All Categories</option>
                  <option value="problem_resolution">Problem Resolution</option>
                  <option value="claim_resolution">Claim Resolution</option>
                  <option value="order_confirmation">Order Confirmation</option>
                  <option value="inventory_accuracy">Inventory Accuracy</option>
                  <option value="sourcing">Sourcing</option>
                  <option value="urgent_orders">Urgent Orders</option>
                </select>
              </div>

              <!-- Account Filter -->
              <div class="col-md-3">
                <label class="form-label small text-muted">Account</label>
                <select
                  class="form-select"
                  .value=${this.filterAccount}
                  @change=${t=>{this.filterAccount=t.target.value,this._handleFilterChange()}}
                >
                  <option value="">All Accounts</option>
                  ${this._getUniqueAccounts().map(t=>s`<option value="${t}">${t}</option>`)}
                </select>
              </div>
            </div>

            <div class="row g-3">
              <!-- From Date -->
              <div class="col-md-2">
                <label class="form-label small text-muted">From Date</label>
                <input
                  type="date"
                  class="form-control"
                  .value=${this.fromDate}
                  @input=${t=>{this.fromDate=t.target.value,this._handleFilterChange()}}
                />
              </div>

              <!-- To Date -->
              <div class="col-md-2">
                <label class="form-label small text-muted">To Date</label>
                <input
                  type="date"
                  class="form-control"
                  .value=${this.toDate}
                  @input=${t=>{this.toDate=t.target.value,this._handleFilterChange()}}
                />
              </div>

              <!-- Action Buttons -->
              <div class="col-md-8 d-flex align-items-end justify-content-end">
                <button class="btn btn-outline-secondary me-2" @click=${this._resetFilters} title="Reset Filters">
                  <i class="bi bi-x-circle me-2"></i>Reset
                </button>
                <button class="btn btn-outline-secondary me-2 position-relative" @click=${this._toggleColumnManager} title="Manage Columns">
                  <i class="bi bi-layout-three-columns"></i>
                </button>
                <button class="btn btn-outline-secondary" @click=${this._exportData} title="Export Data">
                  <i class="bi bi-download"></i>
                </button>
              </div>
            </div>

            <!-- Column Manager Popover -->
            ${this.showColumnManager?s`
              <div class="position-relative mt-3">
                <div class="card position-absolute end-0 shadow" style="z-index: 1060; width: 250px;">
                  <div class="card-header bg-light">
                    <div class="d-flex justify-content-between align-items-center">
                      <strong>Manage Columns</strong>
                      <button class="btn-close btn-sm" @click=${this._toggleColumnManager}></button>
                    </div>
                  </div>
                  <div class="card-body">
                    ${Object.keys(this.visibleColumns).map(t=>s`
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="col-${t}"
                          .checked=${this.visibleColumns[t]}
                          @change=${()=>this._toggleColumn(t)}
                        />
                        <label class="form-check-label" for="col-${t}">
                          ${t==="incidentNumber"?"Number":t==="inquiryReceived"?"Inquiry Received":t==="initialResponse"?"Initial Response":t==="clientEmail"?"Client Email":t.replace(/([A-Z])/g," $1").trim()}
                        </label>
                      </div>
                    `)}
                  </div>
                </div>
              </div>
            `:""}
          </div>
        </div>

        <!-- Data Table -->
        <ui-card>
          <ui-table
            .columns=${[this.visibleColumns.incidentNumber&&{key:"incidentNumber",label:"Number",sortable:!0,render:t=>s`<strong>${t.incidentNumber}</strong>`},this.visibleColumns.inquiryReceived&&{key:"reportedDate",label:"Inquiry Received",sortable:!0,render:t=>s`<small>${this._formatDateTime(t.reportedDate)}</small>`},this.visibleColumns.initialResponse&&{key:"initialResponseDate",label:"Initial Response",sortable:!0,render:t=>s`<small>${this._formatDateTime(t.initialResponseDate)}</small>`},this.visibleColumns.priority&&{key:"priority",label:"Priority",sortable:!0,render:t=>s`<span class="badge bg-${this._getPriorityBadge(t.priority)}">${t.priority.toUpperCase()}</span>`},this.visibleColumns.category&&{key:"category",label:"Category",sortable:!0,render:t=>s`<span class="badge bg-${this._getCategoryBadge(t.category)}">${this._getCategoryName(t.category)}</span>`},this.visibleColumns.description&&{key:"description",label:"Description",render:t=>s`<div style="max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${t.description}">${t.description}</div>`},this.visibleColumns.clientEmail&&{key:"clientEmail",label:"Client Email"},this.visibleColumns.account&&{key:"account",label:"Account",sortable:!0,render:t=>s`<strong>${t.account}</strong>`},this.visibleColumns.status&&{key:"status",label:"Status",sortable:!0,render:t=>s`<span class="badge bg-${this._getStatusBadge(t.status)}">${t.status.replace("_"," ").toUpperCase()}</span>`},{key:"actions",label:"Actions",render:t=>s`
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" @click=${()=>this._navigateToEdit(t.id)} title="Edit">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click=${()=>this._handleDelete(t.id,t.incidentNumber)} title="Delete">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                `}].filter(Boolean)}
            .items=${this.incidents}
            .loading=${this.loading}
            emptyText="No incidents found"
            .page=${this.page}
            .pageSize=${this.pageSize}
            .total=${this.total}
            .sortBy=${this.sortBy}
            .sortOrder=${this.sortOrder}
            @table-sort=${t=>{this.sortBy=t.detail.sortBy,this.sortOrder=t.detail.sortOrder,this._loadIncidents()}}
            @table-page=${t=>{this._handlePageChange(t.detail.page)}}
          ></ui-table>

          <div slot="footer" class="bg-white">
            <div class="row align-items-center">
              <div class="col-md-6">
                <div class="d-flex align-items-center">
                  <span class="me-2">Show:</span>
                  <select class="form-select form-select-sm" style="width: auto;" .value=${this.pageSize} @change=${this._handlePageSizeChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span class="ms-3 text-muted">
                    Showing ${(this.page-1)*this.pageSize+1} to ${Math.min(this.page*this.pageSize,this.total)} of ${this.total} entries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ui-card>
      </div>
    `}}customElements.define("incidents-list",d);
