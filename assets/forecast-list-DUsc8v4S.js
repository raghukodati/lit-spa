import{T as c,N as e}from"./index-YRTalx74.js";import{getForecastCustomers as h,getForecastYears as d,getForecastMonths as m,getForecasts as u,deleteForecast as g}from"./analytics.service-lxJDbI_y.js";class p extends c{static properties={forecasts:{type:Array},loading:{type:Boolean},page:{type:Number},pageSize:{type:Number},total:{type:Number},totalPages:{type:Number},search:{type:String},filterCustomer:{type:String},filterYear:{type:String},filterMonth:{type:String},sortBy:{type:String},sortOrder:{type:String},customers:{type:Array},years:{type:Array},months:{type:Array},showColumnManager:{type:Boolean},visibleColumns:{type:Object}};createRenderRoot(){return this}constructor(){super(),this.forecasts=[],this.loading=!0,this.page=1,this.pageSize=10,this.total=0,this.totalPages=1,this.search="",this.filterCustomer="",this.filterYear="",this.filterMonth="",this.sortBy="id",this.sortOrder="asc",this.customers=[],this.years=[],this.months=[],this.showColumnManager=!1,this.visibleColumns={customerName:!0,year:!0,month:!0,forecastValue:!0,commissionPercent:!0,commissionDollar:!0,createdDate:!0}}async connectedCallback(){super.connectedCallback(),this.customers=h(),this.years=d(),this.months=m(),await this._loadForecasts()}async _loadForecasts(){this.loading=!0;try{const t=await u({page:this.page,pageSize:this.pageSize,search:this.search,customerName:this.filterCustomer,year:this.filterYear,month:this.filterMonth,sortBy:this.sortBy,sortOrder:this.sortOrder});this.forecasts=t.data,this.total=t.total,this.totalPages=t.totalPages}catch(t){console.error("Error loading forecasts:",t)}finally{this.loading=!1}}_handleSearch(t){this.search=t.target.value,this.page=1,this._loadForecasts()}_handleFilterChange(){this.page=1,this._loadForecasts()}_handleSort(t){this.sortBy===t?this.sortOrder=this.sortOrder==="asc"?"desc":"asc":(this.sortBy=t,this.sortOrder="asc"),this._loadForecasts()}_handlePageChange(t){this.page=t,this._loadForecasts()}_handlePageSizeChange(t){this.pageSize=parseInt(t.target.value),this.page=1,this._loadForecasts()}_resetFilters(){this.search="",this.filterCustomer="",this.filterYear="",this.filterMonth="",this.page=1,this._loadForecasts()}_navigateToCreate(){window.history.pushState({},"","/module/analytics/forecast/create"),window.dispatchEvent(new PopStateEvent("popstate"))}_navigateToEdit(t){window.history.pushState({},"",`/module/analytics/forecast/edit/${t}`),window.dispatchEvent(new PopStateEvent("popstate"))}async _handleDelete(t){if(confirm("Are you sure you want to delete this forecast?"))try{await g(t),await this._loadForecasts()}catch(i){alert("Error deleting forecast: "+i.message)}}_toggleColumnManager(){this.showColumnManager=!this.showColumnManager}_toggleColumn(t){this.visibleColumns={...this.visibleColumns,[t]:!this.visibleColumns[t]}}_exportData(){const t=Object.keys(this.visibleColumns).filter(a=>this.visibleColumns[a]).map(a=>a.replace(/([A-Z])/g," $1").trim()),i=this.forecasts.map(a=>Object.keys(this.visibleColumns).filter(l=>this.visibleColumns[l]).map(l=>a[l]));let s=t.join(",")+`
`;i.forEach(a=>{s+=a.join(",")+`
`});const n=new Blob([s],{type:"text/csv"}),r=window.URL.createObjectURL(n),o=document.createElement("a");o.href=r,o.download=`forecasts_${new Date().toISOString().split("T")[0]}.csv`,o.click(),window.URL.revokeObjectURL(r)}_getSortIcon(t){return this.sortBy!==t?"bi-arrow-down-up":this.sortOrder==="asc"?"bi-sort-up":"bi-sort-down"}render(){return e`
      <div>
        <!-- Page Header -->
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h2 fw-bold mb-2">
                <i class="bi bi-bar-chart-line text-primary me-2"></i>Forecast Management
              </h1>
              <p class="text-muted mb-0">Manage customer forecasts and commissions</p>
            </div>
            <button class="btn btn-primary" @click=${this._navigateToCreate}>
              <i class="bi bi-plus-circle me-2"></i>Create Forecast
            </button>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row g-3">
              <!-- Search -->
              <div class="col-md-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search..."
                  .value=${this.search}
                  @input=${this._handleSearch}
                />
              </div>

              <!-- Customer Filter -->
              <div class="col-md-3">
                <select
                  class="form-select"
                  .value=${this.filterCustomer}
                  @change=${t=>{this.filterCustomer=t.target.value,this._handleFilterChange()}}
                >
                  <option value="">All Customers</option>
                  ${this.customers.map(t=>e`
                    <option value="${t}">${t}</option>
                  `)}
                </select>
              </div>

              <!-- Year Filter -->
              <div class="col-md-2">
                <select
                  class="form-select"
                  .value=${this.filterYear}
                  @change=${t=>{this.filterYear=t.target.value,this._handleFilterChange()}}
                >
                  <option value="">All Years</option>
                  ${this.years.map(t=>e`
                    <option value="${t}">${t}</option>
                  `)}
                </select>
              </div>

              <!-- Month Filter -->
              <div class="col-md-2">
                <select
                  class="form-select"
                  .value=${this.filterMonth}
                  @change=${t=>{this.filterMonth=t.target.value,this._handleFilterChange()}}
                >
                  <option value="">All Months</option>
                  ${this.months.map(t=>e`
                    <option value="${t}">${t}</option>
                  `)}
                </select>
              </div>

              <!-- Action Buttons -->
              <div class="col-md-2">
                <div class="btn-group w-100">
                  <button class="btn btn-outline-secondary" @click=${this._resetFilters} title="Reset Filters">
                    <i class="bi bi-x-circle"></i>
                  </button>
                  <button class="btn btn-outline-secondary position-relative" @click=${this._toggleColumnManager} title="Manage Columns">
                    <i class="bi bi-layout-three-columns"></i>
                  </button>
                  <button class="btn btn-outline-secondary" @click=${this._exportData} title="Export Data">
                    <i class="bi bi-download"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Column Manager Popover -->
            ${this.showColumnManager?e`
              <div class="position-relative mt-3">
                <div class="card position-absolute end-0 shadow" style="z-index: 1060; width: 250px;">
                  <div class="card-header bg-light">
                    <div class="d-flex justify-content-between align-items-center">
                      <strong>Manage Columns</strong>
                      <button class="btn-close btn-sm" @click=${this._toggleColumnManager}></button>
                    </div>
                  </div>
                  <div class="card-body">
                    ${Object.keys(this.visibleColumns).map(t=>e`
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="col-${t}"
                          .checked=${this.visibleColumns[t]}
                          @change=${()=>this._toggleColumn(t)}
                        />
                        <label class="form-check-label" for="col-${t}">
                          ${t.replace(/([A-Z])/g," $1").trim()}
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
        <div class="card shadow-sm">
          <div class="card-body p-0">
            ${this.loading?e`
              <div class="text-center p-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-3 text-muted">Loading forecasts...</p>
              </div>
            `:e`
              <div class="table-responsive">
                <table class="table table-hover table-striped mb-0">
                  <thead class="table-light sticky-top">
                    <tr>
                      ${this.visibleColumns.customerName?e`
                        <th @click=${()=>this._handleSort("customerName")} style="cursor: pointer;">
                          Customer Name <i class="bi ${this._getSortIcon("customerName")}"></i>
                        </th>
                      `:""}
                      ${this.visibleColumns.year?e`
                        <th @click=${()=>this._handleSort("year")} style="cursor: pointer;">
                          Year <i class="bi ${this._getSortIcon("year")}"></i>
                        </th>
                      `:""}
                      ${this.visibleColumns.month?e`
                        <th @click=${()=>this._handleSort("month")} style="cursor: pointer;">
                          Month <i class="bi ${this._getSortIcon("month")}"></i>
                        </th>
                      `:""}
                      ${this.visibleColumns.forecastValue?e`
                        <th class="text-end" @click=${()=>this._handleSort("forecastValue")} style="cursor: pointer;">
                          Forecast Value <i class="bi ${this._getSortIcon("forecastValue")}"></i>
                        </th>
                      `:""}
                      ${this.visibleColumns.commissionPercent?e`
                        <th class="text-end" @click=${()=>this._handleSort("commissionPercent")} style="cursor: pointer;">
                          Commission % <i class="bi ${this._getSortIcon("commissionPercent")}"></i>
                        </th>
                      `:""}
                      ${this.visibleColumns.commissionDollar?e`
                        <th class="text-end" @click=${()=>this._handleSort("commissionDollar")} style="cursor: pointer;">
                          Commission $ <i class="bi ${this._getSortIcon("commissionDollar")}"></i>
                        </th>
                      `:""}
                      ${this.visibleColumns.createdDate?e`
                        <th @click=${()=>this._handleSort("createdDate")} style="cursor: pointer;">
                          Created Date <i class="bi ${this._getSortIcon("createdDate")}"></i>
                        </th>
                      `:""}
                      <th class="text-center" style="width: 150px;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.forecasts.length>0?this.forecasts.map(t=>e`
                      <tr>
                        ${this.visibleColumns.customerName?e`<td><strong>${t.customerName}</strong></td>`:""}
                        ${this.visibleColumns.year?e`<td>${t.year}</td>`:""}
                        ${this.visibleColumns.month?e`<td>${t.month}</td>`:""}
                        ${this.visibleColumns.forecastValue?e`<td class="text-end">$${t.forecastValue.toLocaleString()}</td>`:""}
                        ${this.visibleColumns.commissionPercent?e`<td class="text-end">${t.commissionPercent}%</td>`:""}
                        ${this.visibleColumns.commissionDollar?e`<td class="text-end text-success fw-bold">$${t.commissionDollar.toLocaleString()}</td>`:""}
                        ${this.visibleColumns.createdDate?e`<td>${t.createdDate}</td>`:""}
                        <td class="text-center">
                          <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" @click=${()=>this._navigateToEdit(t.id)} title="Edit">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" @click=${()=>this._handleDelete(t.id)} title="Delete">
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    `):e`
                      <tr>
                        <td colspan="8" class="text-center text-muted py-5">
                          <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                          No forecasts found
                        </td>
                      </tr>
                    `}
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              ${this.totalPages>1?e`
                <div class="card-footer bg-white">
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
                    <div class="col-md-6">
                      <nav>
                        <ul class="pagination pagination-sm justify-content-end mb-0">
                          <li class="page-item ${this.page===1?"disabled":""}">
                            <a class="page-link" @click=${()=>this._handlePageChange(1)}>First</a>
                          </li>
                          <li class="page-item ${this.page===1?"disabled":""}">
                            <a class="page-link" @click=${()=>this._handlePageChange(this.page-1)}>Previous</a>
                          </li>
                          ${Array.from({length:Math.min(5,this.totalPages)},(t,i)=>{let s;return this.totalPages<=5||this.page<=3?s=i+1:this.page>=this.totalPages-2?s=this.totalPages-4+i:s=this.page-2+i,e`
                              <li class="page-item ${this.page===s?"active":""}">
                                <a class="page-link" @click=${()=>this._handlePageChange(s)}>${s}</a>
                              </li>
                            `})}
                          <li class="page-item ${this.page===this.totalPages?"disabled":""}">
                            <a class="page-link" @click=${()=>this._handlePageChange(this.page+1)}>Next</a>
                          </li>
                          <li class="page-item ${this.page===this.totalPages?"disabled":""}">
                            <a class="page-link" @click=${()=>this._handlePageChange(this.totalPages)}>Last</a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              `:""}
            `}
          </div>
        </div>
      </div>
    `}}customElements.define("forecast-list",p);
