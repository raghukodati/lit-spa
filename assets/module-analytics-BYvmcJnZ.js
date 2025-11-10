import{T as l,N as e}from"./index-BTuak744.js";import{getSalesByMonth as i,getSalesByCustomer as r,getCustomerList as o,getMonthList as c,getForecastData as d}from"./analytics.service-zvIzSqTK.js";class n extends l{static properties={salesByMonth:{type:Array},salesByCustomer:{type:Array},forecastData:{type:Array},top5Customers:{type:Array},loading:{type:Boolean},selectedYear:{type:String},filterCustomer:{type:String},filterMonth:{type:String},filterStatus:{type:String},customers:{type:Array},months:{type:Array},availableYears:{type:Array}};createRenderRoot(){return this}constructor(){super(),this.salesByMonth=[],this.salesByCustomer=[],this.forecastData=[],this.top5Customers=[],this.loading=!0,this.selectedYear="2024",this.filterCustomer="",this.filterMonth="",this.filterStatus="",this.customers=[],this.months=[],this.availableYears=["2024","2023","2022"],this.lineChart=null,this.barChart=null}async connectedCallback(){super.connectedCallback(),await this._loadData()}disconnectedCallback(){super.disconnectedCallback(),this.lineChart&&this.lineChart.destroy(),this.barChart&&this.barChart.destroy()}async _loadData(){this.loading=!0;try{this.salesByMonth=await i(),this.salesByCustomer=await r(),this.top5Customers=[...this.salesByCustomer].sort((t,a)=>a.sales-t.sales).slice(0,5),this.customers=o(),this.months=c(),await this._loadForecastData()}finally{this.loading=!1}}async _handleYearChange(t){this.selectedYear=t.target.value,await this._loadData()}async _loadForecastData(){const t={};this.filterCustomer&&(t.customer=this.filterCustomer),this.filterMonth&&(t.month=this.filterMonth),this.filterStatus&&(t.status=this.filterStatus),this.forecastData=await d(t)}async updated(t){super.updated(t),t.has("salesByMonth")&&this.salesByMonth.length>0&&this._renderLineChart(),t.has("salesByCustomer")&&this.salesByCustomer.length>0&&this._renderBarChart()}_renderLineChart(){const t=this.querySelector("#salesLineChart");if(!t)return;this.lineChart&&this.lineChart.destroy();const a=t.getContext("2d");this.lineChart=new Chart(a,{type:"line",data:{labels:this.salesByMonth.map(s=>s.month),datasets:[{label:"Actual Sales",data:this.salesByMonth.map(s=>s.sales),borderColor:"rgb(13, 110, 253)",backgroundColor:"rgba(13, 110, 253, 0.1)",tension:.4,fill:!0,pointRadius:5,pointHoverRadius:7},{label:"Target",data:this.salesByMonth.map(s=>s.target),borderColor:"rgb(220, 53, 69)",backgroundColor:"rgba(220, 53, 69, 0.1)",borderDash:[5,5],tension:.4,fill:!1,pointRadius:3}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"top"},title:{display:!1},tooltip:{callbacks:{label:function(s){return s.dataset.label+": $"+s.parsed.y.toLocaleString()}}}},scales:{y:{beginAtZero:!0,ticks:{callback:function(s){return"$"+s/1e3+"K"}}}}}})}_renderBarChart(){const t=this.querySelector("#salesBarChart");if(!t)return;this.barChart&&this.barChart.destroy();const a=t.getContext("2d");this.barChart=new Chart(a,{type:"bar",data:{labels:this.salesByCustomer.map(s=>s.customer),datasets:[{label:"Sales Amount",data:this.salesByCustomer.map(s=>s.sales),backgroundColor:["rgba(13, 110, 253, 0.8)","rgba(25, 135, 84, 0.8)","rgba(255, 193, 7, 0.8)","rgba(220, 53, 69, 0.8)","rgba(13, 202, 240, 0.8)","rgba(111, 66, 193, 0.8)","rgba(255, 143, 0, 0.8)","rgba(108, 117, 125, 0.8)"],borderColor:["rgb(13, 110, 253)","rgb(25, 135, 84)","rgb(255, 193, 7)","rgb(220, 53, 69)","rgb(13, 202, 240)","rgb(111, 66, 193)","rgb(255, 143, 0)","rgb(108, 117, 125)"],borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:function(s){return"Sales: $"+s.parsed.y.toLocaleString()}}}},scales:{y:{beginAtZero:!0,ticks:{callback:function(s){return"$"+s/1e3+"K"}}}}}})}async _handleFilterChange(){await this._loadForecastData()}_resetFilters(){this.filterCustomer="",this.filterMonth="",this.filterStatus="",this._loadForecastData()}_getStatusBadgeClass(t){switch(t){case"Exceeded":return"bg-success";case"Met":return"bg-primary";case"Below":return"bg-warning";case"Pending":return"bg-secondary";default:return"bg-secondary"}}_getPerformanceColor(t){return t===0?"text-muted":t>=100?"text-success":t>=95?"text-primary":"text-warning"}render(){return e`
      <div>
        <!-- Page Header with Year Filter -->
        <div class="mb-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="h2 fw-bold mb-2">
                <i class="bi bi-graph-up text-info me-2"></i>Analytics Module
              </h1>
              <p class="text-muted mb-0">Business intelligence and reporting dashboard</p>
            </div>
            <div class="col-md-4 text-end">
              <label class="form-label fw-semibold mb-1 d-block">
                <i class="bi bi-calendar3 me-1"></i>Select Year
              </label>
              <select 
                class="form-select form-select-lg"
                .value=${this.selectedYear}
                @change=${this._handleYearChange}
                style="max-width: 200px; margin-left: auto;"
              >
                ${this.availableYears.map(t=>e`
                  <option value="${t}" ?selected=${this.selectedYear===t}>
                    ${t}
                  </option>
                `)}
              </select>
            </div>
          </div>
        </div>

        <!-- Revenue KPI & Top 5 Leading Customers - Side by Side -->
        <div class="row g-3 mb-4">
          <!-- Total Revenue Card -->
          <div class="col-lg-3 col-md-4">
            <div class="card border-success shadow-sm h-100">
              <div class="card-body d-flex flex-column justify-content-center align-items-center text-center p-4">
                <i class="bi bi-currency-dollar fs-1 text-success mb-3"></i>
                <p class="text-muted mb-2 fw-semibold">Total Revenue</p>
                <h2 class="mb-2 fw-bold">$156.2K</h2>
                <span class="badge bg-success px-3 py-2">
                  <i class="bi bi-arrow-up"></i> 12.5%
                </span>
              </div>
            </div>
          </div>

          <!-- Top 5 Leading Customers -->
          <div class="col-lg-9 col-md-8">
            <div class="card shadow-sm border-0 h-100" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <div class="card-body p-3">
                <h6 class="text-white mb-3 fw-bold">
                  <i class="bi bi-trophy me-2"></i>Top 5 Leading Customers by Revenue
                </h6>
                <div class="row g-2">
                  ${this.top5Customers.map((t,a)=>e`
                    <div class="col">
                      <div class="card h-100 shadow-sm border-0">
                        <div class="card-body text-center p-2">
                          <div class="mb-1">
                            <span class="badge ${a===0?"bg-warning":a===1?"bg-secondary":"bg-info"}">
                              ${a===0?"🥇":a===1?"🥈":a===2?"🥉":"#"+(a+1)}
                            </span>
                          </div>
                          <div class="mb-1 small fw-bold text-truncate" title="${t.customer}" style="font-size: 0.85rem;">
                            ${t.customer}
                          </div>
                          <div class="border-top pt-1 mt-1">
                            <div class="text-success fw-bold" style="font-size: 0.95rem;">
                              $${(t.sales/1e3).toFixed(1)}K
                            </div>
                            <div class="text-muted" style="font-size: 0.7rem;">
                              ${t.orders} orders
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  `)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="row mb-4">
          <!-- Sales by Month Line Chart -->
          <div class="col-lg-7 mb-4">
            <div class="card shadow-sm h-100">
              <div class="card-header bg-white">
                <h5 class="card-title mb-0">
                  <i class="bi bi-graph-up me-2"></i>Sales by Month - Line Chart
                </h5>
              </div>
              <div class="card-body">
                <div style="height: 350px; position: relative;">
                  <canvas id="salesLineChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- Sales by Customer Bar Chart -->
          <div class="col-lg-5 mb-4">
            <div class="card shadow-sm h-100">
              <div class="card-header bg-white">
                <h5 class="card-title mb-0">
                  <i class="bi bi-bar-chart me-2"></i>Sales by Customer - Bar Chart
                </h5>
              </div>
              <div class="card-body">
                <div style="height: 350px; position: relative;">
                  <canvas id="salesBarChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Forecast Table -->
        <div class="card shadow-sm">
          <div class="card-header bg-white">
            <div class="row align-items-center">
              <div class="col-md-6">
                <h5 class="card-title mb-0">
                  <i class="bi bi-table me-2"></i>Sales Forecast by Customer & Month
                </h5>
              </div>
              <div class="col-md-6">
                <div class="d-flex justify-content-end gap-2 flex-wrap">
                  <select 
                    class="form-select form-select-sm" 
                    style="width: auto;"
                    .value=${this.selectedYear}
                    @change=${this._handleYearChange}
                  >
                    ${this.availableYears.map(t=>e`
                      <option value="${t}" ?selected=${this.selectedYear===t}>
                        ${t}
                      </option>
                    `)}
                  </select>
                  
                  <select 
                    class="form-select form-select-sm" 
                    style="width: auto;"
                    .value=${this.filterCustomer}
                    @change=${t=>{this.filterCustomer=t.target.value,this._handleFilterChange()}}
                  >
                    <option value="">All Customers</option>
                    ${this.customers.map(t=>e`
                      <option value="${t}">${t}</option>
                    `)}
                  </select>
                  
                  <select 
                    class="form-select form-select-sm" 
                    style="width: auto;"
                    .value=${this.filterMonth}
                    @change=${t=>{this.filterMonth=t.target.value,this._handleFilterChange()}}
                  >
                    <option value="">All Months</option>
                    ${this.months.map(t=>e`
                      <option value="${t}">${t}</option>
                    `)}
                  </select>
                  
                  <select 
                    class="form-select form-select-sm" 
                    style="width: auto;"
                    .value=${this.filterStatus}
                    @change=${t=>{this.filterStatus=t.target.value,this._handleFilterChange()}}
                  >
                    <option value="">All Status</option>
                    <option value="Exceeded">Exceeded</option>
                    <option value="Met">Met</option>
                    <option value="Below">Below</option>
                    <option value="Pending">Pending</option>
                  </select>
                  
                  ${this.filterCustomer||this.filterMonth||this.filterStatus?e`
                    <button 
                      class="btn btn-sm btn-outline-secondary"
                      @click=${this._resetFilters}
                      title="Reset Filters"
                    >
                      <i class="bi bi-x-circle"></i>
                    </button>
                  `:""}
                </div>
              </div>
            </div>
          </div>
          <div class="card-body p-0">
            ${this.loading?e`
              <div class="text-center p-5">
                <div class="spinner-border text-secondary"></div>
                <p class="mt-3 text-muted">Loading data...</p>
              </div>
            `:e`
              <div class="table-responsive">
                <table class="table table-hover table-striped mb-0">
                  <thead class="table-light sticky-top">
                    <tr>
                      <th>Customer</th>
                      <th>Month</th>
                      <th class="text-end">Forecast Value</th>
                      <th class="text-end">Actual Revenue</th>
                      <th class="text-end">Performance %</th>
                      <th class="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.forecastData.length>0?this.forecastData.map(t=>e`
                      <tr>
                        <td>
                          <strong>${t.customer}</strong>
                        </td>
                        <td>${t.month}</td>
                        <td class="text-end">
                          <strong>$${t.forecastValue.toLocaleString()}</strong>
                        </td>
                        <td class="text-end">
                          ${t.actualRevenue>0?e`
                            $${t.actualRevenue.toLocaleString()}
                          `:e`
                            <span class="text-muted">-</span>
                          `}
                        </td>
                        <td class="text-end ${this._getPerformanceColor(t.performance)}">
                          ${t.performance>0?e`
                            <strong>${t.performance.toFixed(1)}%</strong>
                            ${t.performance>=100?e`
                              <i class="bi bi-arrow-up-circle-fill ms-1"></i>
                            `:t.performance>=95?e`
                              <i class="bi bi-check-circle-fill ms-1"></i>
                            `:e`
                              <i class="bi bi-arrow-down-circle-fill ms-1"></i>
                            `}
                          `:e`
                            <span class="text-muted">-</span>
                          `}
                        </td>
                        <td class="text-center">
                          <span class="badge ${this._getStatusBadgeClass(t.status)}">
                            ${t.status}
                          </span>
                        </td>
                      </tr>
                    `):e`
                      <tr>
                        <td colspan="6" class="text-center text-muted py-5">
                          <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                          No forecast data available for the selected filters
                        </td>
                      </tr>
                    `}
                  </tbody>
                </table>
              </div>
              
              ${this.forecastData.length>0?e`
                <div class="card-footer bg-white">
                  <div class="row text-center">
                    <div class="col-md-3">
                      <small class="text-muted d-block">Total Records</small>
                      <strong class="fs-5">${this.forecastData.length}</strong>
                    </div>
                    <div class="col-md-3">
                      <small class="text-muted d-block">Exceeded Target</small>
                      <strong class="fs-5 text-success">
                        ${this.forecastData.filter(t=>t.status==="Exceeded").length}
                      </strong>
                    </div>
                    <div class="col-md-3">
                      <small class="text-muted d-block">Met Target</small>
                      <strong class="fs-5 text-primary">
                        ${this.forecastData.filter(t=>t.status==="Met").length}
                      </strong>
                    </div>
                    <div class="col-md-3">
                      <small class="text-muted d-block">Below Target</small>
                      <strong class="fs-5 text-warning">
                        ${this.forecastData.filter(t=>t.status==="Below").length}
                      </strong>
                    </div>
                  </div>
                </div>
              `:""}
            `}
          </div>
        </div>
      </div>
    `}}customElements.define("module-analytics",n);
