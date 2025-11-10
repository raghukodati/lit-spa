import{N as l}from"./index-D7HSGHDh.js";import{B as n}from"./BaseComponent-CD8EqlKR.js";class c extends n{static properties={metrics:{type:Object},dashboardStats:{type:Object},loading:{type:Boolean},fromDate:{type:String},toDate:{type:String},filterCustomer:{type:String},quickFilter:{type:String}};createRenderRoot(){return this}constructor(){super(),this.metrics={},this.dashboardStats={},this.loading=!0,this.fromDate="",this.toDate="",this.filterCustomer="",this.quickFilter="",this._dataService=null}connectedCallback(){super.connectedCallback(),this._loadData()}async _loadData(){try{this.loading=!0,this._dataService||(this._dataService=await this.getService("dataService")),[this.metrics,this.dashboardStats]=await Promise.all([this._dataService.getSLAMetrics(),this._dataService.getSLADashboardStats()]),this.loading=!1}catch(i){console.error("Failed to load SLA metrics:",i),alert("Failed to load SLA metrics"),this.loading=!1}}_handleQuickFilter(i){const a=i.target.value;this.quickFilter=a;const t=new Date;if(a!=="custom"){if(a==="today")this.fromDate=t.toISOString().split("T")[0],this.toDate=t.toISOString().split("T")[0];else if(a==="yesterday"){const e=new Date(t);e.setDate(e.getDate()-1),this.fromDate=e.toISOString().split("T")[0],this.toDate=e.toISOString().split("T")[0]}else if(a==="this_week"){const e=t.getDay(),s=new Date(t);s.setDate(t.getDate()-e);const o=new Date(t);o.setDate(t.getDate()+(6-e)),this.fromDate=s.toISOString().split("T")[0],this.toDate=o.toISOString().split("T")[0]}else if(a==="last_week"){const e=t.getDay(),s=new Date(t);s.setDate(t.getDate()-e-7);const o=new Date(t);o.setDate(t.getDate()-e-1),this.fromDate=s.toISOString().split("T")[0],this.toDate=o.toISOString().split("T")[0]}else if(a==="this_month"){const e=new Date(t.getFullYear(),t.getMonth(),1),s=new Date(t.getFullYear(),t.getMonth()+1,0);this.fromDate=e.toISOString().split("T")[0],this.toDate=s.toISOString().split("T")[0]}else if(a==="last_month"){const e=new Date(t.getFullYear(),t.getMonth()-1,1),s=new Date(t.getFullYear(),t.getMonth(),0);this.fromDate=e.toISOString().split("T")[0],this.toDate=s.toISOString().split("T")[0]}else if(a==="last_7_days"){const e=new Date(t);e.setDate(t.getDate()-7),this.fromDate=e.toISOString().split("T")[0],this.toDate=t.toISOString().split("T")[0]}else if(a==="last_30_days"){const e=new Date(t);e.setDate(t.getDate()-30),this.fromDate=e.toISOString().split("T")[0],this.toDate=t.toISOString().split("T")[0]}else if(a==="last_90_days"){const e=new Date(t);e.setDate(t.getDate()-90),this.fromDate=e.toISOString().split("T")[0],this.toDate=t.toISOString().split("T")[0]}else if(a==="this_quarter"){const e=Math.floor(t.getMonth()/3),s=new Date(t.getFullYear(),e*3,1),o=new Date(t.getFullYear(),e*3+3,0);this.fromDate=s.toISOString().split("T")[0],this.toDate=o.toISOString().split("T")[0]}else if(a==="this_year"){const e=new Date(t.getFullYear(),0,1),s=new Date(t.getFullYear(),11,31);this.fromDate=e.toISOString().split("T")[0],this.toDate=s.toISOString().split("T")[0]}this._loadData()}}_resetFilters(){this.fromDate="",this.toDate="",this.filterCustomer="",this.quickFilter="",this._loadData()}_renderKPICard(i,a,t,e){const s=this.metrics[a];if(!s)return"";const o=s.slaPercentage,r=o>=95?"success":o>=80?"warning":"danger";return l`
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 border-${e}">
          <div class="card-header bg-${e} text-white">
            <h6 class="mb-0">
              <i class="bi bi-${t} me-2"></i>${i}
            </h6>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-6 mb-3">
                <div class="text-muted small mb-1">KPI Met</div>
                <div class="h2 mb-0 text-success">${s.slaMet}</div>
              </div>
              <div class="col-6 mb-3">
                <div class="text-muted small mb-1">KPI Total</div>
                <div class="h2 mb-0">${s.total}</div>
              </div>
              <div class="col-6">
                <div class="text-muted small mb-1">KPI %</div>
                <div class="h2 mb-0 text-${r}">${o}%</div>
              </div>
              <div class="col-6">
                <div class="text-muted small mb-1">Target KPI %</div>
                <div class="h2 mb-0">${95}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}render(){return this.loading?l`
        <div class="container-fluid py-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted mt-3">Loading SLA dashboard...</p>
          </div>
        </div>
      `:l`
      <div class="container-fluid py-4">
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">
              <i class="bi bi-speedometer2 me-2"></i>SLA Dashboard
            </h2>
            <p class="text-muted mb-0">Service Level Agreement Performance Metrics</p>
          </div>
          <div>
            <button class="btn btn-outline-primary me-2" @click=${this._loadData}>
              <i class="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
            <a href="/sla/incidents" class="btn btn-primary">
              <i class="bi bi-list-ul me-2"></i>View All Incidents
            </a>
          </div>
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row g-3">
              <!-- Quick Filter Dropdown -->
              <div class="col-md-3">
                <label class="form-label small text-muted">Quick Filter</label>
                <select
                  class="form-select"
                  .value=${this.quickFilter}
                  @change=${this._handleQuickFilter}
                >
                  <option value="">Select Period</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_week">This Week</option>
                  <option value="last_week">Last Week</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="last_90_days">Last 90 Days</option>
                  <option value="this_quarter">This Quarter</option>
                  <option value="this_year">This Year</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>

              <!-- From Date -->
              <div class="col-md-2">
                <label class="form-label small text-muted">From Date</label>
                <input
                  type="date"
                  class="form-control"
                  .value=${this.fromDate}
                  ?disabled=${this.quickFilter!=="custom"}
                  @input=${i=>{this.fromDate=i.target.value,this._loadData()}}
                />
              </div>

              <!-- To Date -->
              <div class="col-md-2">
                <label class="form-label small text-muted">To Date</label>
                <input
                  type="date"
                  class="form-control"
                  .value=${this.toDate}
                  ?disabled=${this.quickFilter!=="custom"}
                  @input=${i=>{this.toDate=i.target.value,this._loadData()}}
                />
              </div>

              <!-- Customer Filter -->
              <div class="col-md-3">
                <label class="form-label small text-muted">Customer</label>
                <select
                  class="form-select"
                  .value=${this.filterCustomer}
                  @change=${i=>{this.filterCustomer=i.target.value,this._loadData()}}
                >
                  <option value="">All Customers</option>
                  <option value="Customer A">Customer A</option>
                  <option value="Customer B">Customer B</option>
                  <option value="Customer C">Customer C</option>
                  <option value="VIP Customer">VIP Customer</option>
                </select>
              </div>

              <!-- Reset Button -->
              <div class="col-md-2">
                <label class="form-label small text-muted">&nbsp;</label>
                <button class="btn btn-outline-secondary w-100" @click=${this._resetFilters} title="Reset Filters">
                  <i class="bi bi-x-circle me-2"></i>Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Category-wise KPI Cards -->
        <h4 class="mb-3">
          <i class="bi bi-bar-chart-line me-2"></i>Category-wise Performance
        </h4>
        <div class="row">
          ${this._renderKPICard("Problem Resolution","problem_resolution","tools","danger")}
          ${this._renderKPICard("Claim Resolution","claim_resolution","file-earmark-text","info")}
          ${this._renderKPICard("Order Confirmation","order_confirmation","cart-check","success")}
          ${this._renderKPICard("Inventory Accuracy","inventory_accuracy","box-seam","warning")}
          ${this._renderKPICard("Sourcing","sourcing","truck","primary")}
          ${this._renderKPICard("Urgent Orders","urgent_orders","lightning","danger")}
        </div>
      </div>
    `}}customElements.define("sla-dashboard",c);
