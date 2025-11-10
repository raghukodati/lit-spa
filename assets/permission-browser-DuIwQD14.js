import{N as t}from"./index-B2c558M3.js";import{B as l}from"./BaseComponent-DR8UZD6Q.js";import{p as a}from"./permissions-DYe9rPVQ.js";const r=[{id:"group_user_mgmt",name:"User Management",description:"Permissions for managing user accounts and access",category:"security",icon:"people",color:"primary",displayOrder:10,permissions:["perm_users_create","perm_users_read","perm_users_update","perm_users_delete"]},{id:"group_role_mgmt",name:"Role & Permission Management",description:"Manage roles and permission assignments",category:"security",icon:"shield-lock",color:"danger",displayOrder:11,permissions:["perm_roles_manage","perm_permissions_manage"]},{id:"group_crm",name:"Customer Relationship Management",description:"Manage customer data and relationships",category:"data",icon:"person-badge",color:"success",displayOrder:20,permissions:["perm_customers_create","perm_customers_read","perm_customers_update","perm_customers_delete"]},{id:"group_sales",name:"Sales Operations",description:"Sales order and product management",category:"data",icon:"cart-check",color:"primary",displayOrder:30,permissions:["perm_orders_create","perm_orders_approve","perm_products_manage"]},{id:"group_sla",name:"SLA & Incident Management",description:"Track and manage service incidents",category:"data",icon:"exclamation-triangle",color:"warning",displayOrder:40,permissions:["perm_incidents_create","perm_incidents_assign"]},{id:"group_analytics",name:"Analytics & Reporting",description:"Access to reports and business intelligence",category:"reports",icon:"graph-up",color:"info",displayOrder:50,permissions:["perm_reports_view","perm_reports_export"]},{id:"group_system",name:"System Administration",description:"System configuration and maintenance",category:"system",icon:"gear",color:"secondary",displayOrder:60,permissions:["perm_settings_manage"]}];class o extends l{static properties={permissions:{type:Array},permissionGroups:{type:Array},loading:{type:Boolean},searchTerm:{type:String},filterModule:{type:String},filterCategory:{type:String},filterLevel:{type:String},filterRisk:{type:String},selectedGroup:{type:String},showStatistics:{type:Boolean},viewMode:{type:String}};createRenderRoot(){return this}constructor(){super(),this.permissions=[],this.permissionGroups=[],this.loading=!1,this.filterModule="all",this.filterCategory="all",this.filterLevel="all",this.filterRisk="all",this.searchTerm="",this.selectedGroup="all",this.showStatistics=!0,this.viewMode="detailed"}async connectedCallback(){super.connectedCallback(),await this.loadPermissions(),this._handlePopState=()=>{window.location.pathname==="/permissions"&&(console.log("Route changed to permissions page, reloading data"),this.loadPermissions())},window.addEventListener("popstate",this._handlePopState)}disconnectedCallback(){super.disconnectedCallback(),this._handlePopState&&window.removeEventListener("popstate",this._handlePopState)}async loadPermissions(){this.loading=!0;try{this.permissions=a,this.permissionGroups=r,console.log("Loaded permissions:",this.permissions.length),console.log("Loaded permission groups:",this.permissionGroups.length)}catch(s){console.error("Failed to load permissions:",s)}finally{this.loading=!1}}_getModules(){return[...new Set(this.permissions.map(s=>s.module))].sort()}_getCategories(){return[...new Set(this.permissions.map(s=>s.category))].sort()}_getLevelColor(s){return{app:"danger",module:"warning",entity:"primary",field:"info",record:"success"}[s]||"secondary"}_getRiskColor(s){return{low:"success",medium:"warning",high:"danger",critical:"dark"}[s]||"secondary"}_getCategoryColor(s){return{security:"danger",data:"primary",reports:"info",system:"warning"}[s]||"secondary"}_getFilteredPermissions(){let s=this.permissions;if(this.selectedGroup!=="all"){const e=this.permissionGroups.find(i=>i.id===this.selectedGroup);e&&e.permissions&&(s=s.filter(i=>e.permissions.includes(i.id)))}if(this.filterModule!=="all"&&(s=s.filter(e=>e.module===this.filterModule)),this.filterCategory!=="all"&&(s=s.filter(e=>e.category===this.filterCategory)),this.filterLevel!=="all"&&(s=s.filter(e=>e.level===this.filterLevel)),this.filterRisk!=="all"&&(s=s.filter(e=>e.riskLevel===this.filterRisk)),this.searchTerm){const e=this.searchTerm.toLowerCase();s=s.filter(i=>i.name.toLowerCase().includes(e)||i.code.toLowerCase().includes(e)||i.description.toLowerCase().includes(e)||i.entity.toLowerCase().includes(e))}return s}_getStatistics(){return{total:this.permissions.length,byModule:this._getModules().reduce((s,e)=>(s[e]=this.permissions.filter(i=>i.module===e).length,s),{}),byRisk:{low:this.permissions.filter(s=>s.riskLevel==="low").length,medium:this.permissions.filter(s=>s.riskLevel==="medium").length,high:this.permissions.filter(s=>s.riskLevel==="high").length,critical:this.permissions.filter(s=>s.riskLevel==="critical").length},byLevel:{app:this.permissions.filter(s=>s.level==="app").length,module:this.permissions.filter(s=>s.level==="module").length,entity:this.permissions.filter(s=>s.level==="entity").length,field:this.permissions.filter(s=>s.level==="field").length,record:this.permissions.filter(s=>s.level==="record").length},requireMfa:this.permissions.filter(s=>s.requiresMfa).length,requireApproval:this.permissions.filter(s=>s.requiresApproval).length,auditLogged:this.permissions.filter(s=>s.auditLog).length}}_clearFilters(){this.searchTerm="",this.filterModule="all",this.filterCategory="all",this.filterLevel="all",this.filterRisk="all",this.selectedGroup="all"}_renderStatistics(){const s=this._getStatistics(),e=this._getModules();return t`
      <!-- Top Statistics Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card border-primary h-100">
            <div class="card-body text-center">
              <i class="bi bi-key fs-1 text-primary"></i>
              <h3 class="mt-2">${s.total}</h3>
              <p class="text-muted mb-0">Total Permissions</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-success h-100">
            <div class="card-body text-center">
              <i class="bi bi-shield-check fs-1 text-success"></i>
              <h3 class="mt-2">${s.requireMfa}</h3>
              <p class="text-muted mb-0">Require MFA</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-warning h-100">
            <div class="card-body text-center">
              <i class="bi bi-check-circle fs-1 text-warning"></i>
              <h3 class="mt-2">${s.requireApproval}</h3>
              <p class="text-muted mb-0">Require Approval</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-info h-100">
            <div class="card-body text-center">
              <i class="bi bi-clock-history fs-1 text-info"></i>
              <h3 class="mt-2">${s.auditLogged}</h3>
              <p class="text-muted mb-0">Audit Logged</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h6 class="card-title mb-0">
                <i class="bi bi-exclamation-triangle me-2"></i>Risk Level Distribution
              </h6>
            </div>
            <div class="card-body">
              <div class="row g-2">
                <div class="col-3 text-center">
                  <div class="badge bg-success fs-5">${s.byRisk.low}</div>
                  <div class="small text-muted mt-1">Low</div>
                </div>
                <div class="col-3 text-center">
                  <div class="badge bg-warning fs-5">${s.byRisk.medium}</div>
                  <div class="small text-muted mt-1">Medium</div>
                </div>
                <div class="col-3 text-center">
                  <div class="badge bg-danger fs-5">${s.byRisk.high}</div>
                  <div class="small text-muted mt-1">High</div>
                </div>
                <div class="col-3 text-center">
                  <div class="badge bg-dark fs-5">${s.byRisk.critical}</div>
                  <div class="small text-muted mt-1">Critical</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h6 class="card-title mb-0">
                <i class="bi bi-box me-2"></i>Module Distribution
              </h6>
            </div>
            <div class="card-body">
              <div class="d-flex flex-wrap gap-2">
                ${e.map(i=>t`
                  <span class="badge bg-primary">
                    ${i}: ${s.byModule[i]}
                  </span>
                `)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `}_renderFilters(){const s=this._getModules(),e=this._getCategories();return t`
      <!-- Permission Groups -->
      <div class="card shadow-sm mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-semibold mb-0">
              <i class="bi bi-collection me-2"></i>Permission Groups
            </h6>
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click=${()=>this.selectedGroup="all"}
              ?disabled=${this.selectedGroup==="all"}>
              <i class="bi bi-x-circle me-1"></i>Clear Group
            </button>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <button 
              class="btn btn-sm ${this.selectedGroup==="all"?"btn-primary":"btn-outline-primary"}"
              @click=${()=>this.selectedGroup="all"}>
              <i class="bi bi-grid-3x3"></i> All (${this.permissions.length})
            </button>
            ${this.permissionGroups.map(i=>t`
              <button 
                class="btn btn-sm ${this.selectedGroup===i.id?"btn-primary":"btn-outline-primary"}"
                @click=${()=>this.selectedGroup=i.id}>
                <i class="bi bi-${i.icon||"folder"}"></i> ${i.name} (${i.permissions?.length||0})
              </button>
            `)}
          </div>
        </div>
      </div>

      <!-- Advanced Filters -->
      <div class="card shadow-sm mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-semibold mb-0">
              <i class="bi bi-funnel me-2"></i>Filters
            </h6>
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click=${this._clearFilters}>
              <i class="bi bi-x-circle me-1"></i>Clear All
            </button>
          </div>
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label small fw-semibold">Search</label>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search permissions..."
                .value=${this.searchTerm}
                @input=${i=>this.searchTerm=i.target.value}>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">Module</label>
              <select class="form-select" .value=${this.filterModule} @change=${i=>this.filterModule=i.target.value}>
                <option value="all">All Modules</option>
                ${s.map(i=>t`<option value="${i}">${i}</option>`)}
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">Category</label>
              <select class="form-select" .value=${this.filterCategory} @change=${i=>this.filterCategory=i.target.value}>
                <option value="all">All Categories</option>
                ${e.map(i=>t`<option value="${i}">${i}</option>`)}
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">Security Level</label>
              <select class="form-select" .value=${this.filterLevel} @change=${i=>this.filterLevel=i.target.value}>
                <option value="all">All Levels</option>
                <option value="app">App</option>
                <option value="module">Module</option>
                <option value="entity">Entity</option>
                <option value="field">Field</option>
                <option value="record">Record</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-semibold">Risk Level</label>
              <select class="form-select" .value=${this.filterRisk} @change=${i=>this.filterRisk=i.target.value}>
                <option value="all">All Risk Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div class="col-md-1 d-flex align-items-end">
              <button 
                class="btn btn-outline-secondary w-100"
                @click=${()=>this.showStatistics=!this.showStatistics}
                title="${this.showStatistics?"Hide Statistics":"Show Statistics"}">
                <i class="bi bi-bar-chart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `}_renderTable(s){return t`
      <div class="card shadow-sm">
        <div class="card-header bg-white py-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <i class="bi bi-table me-2"></i>Permissions (${s.length} of ${this.permissions.length})
            </h5>
            <div class="btn-group btn-group-sm">
              <button 
                class="btn ${this.viewMode==="detailed"?"btn-primary":"btn-outline-primary"}"
                @click=${()=>this.viewMode="detailed"}>
                <i class="bi bi-list-ul"></i> Detailed
              </button>
              <button 
                class="btn ${this.viewMode==="compact"?"btn-primary":"btn-outline-primary"}"
                @click=${()=>this.viewMode="compact"}>
                <i class="bi bi-list"></i> Compact
              </button>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          ${s.length===0?t`
            <div class="text-center text-muted py-5">
              <i class="bi bi-inbox fs-1"></i>
              <p class="mt-3">No permissions found matching your filters</p>
              <button class="btn btn-sm btn-outline-primary" @click=${this._clearFilters}>
                Clear Filters
              </button>
            </div>
          `:t`
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: ${this.viewMode==="detailed"?"18%":"20%"}">Permission</th>
                    ${this.viewMode==="detailed"?t`<th style="width: 12%">Code</th>`:""}
                    <th style="width: ${this.viewMode==="detailed"?"15%":"20%"}">Description</th>
                    <th style="width: 10%">Module</th>
                    <th style="width: 10%">Entity</th>
                    <th style="width: 8%">Action</th>
                    <th style="width: 8%">Level</th>
                    ${this.viewMode==="detailed"?t`<th style="width: 8%">Scope</th>`:""}
                    <th style="width: 8%">Risk</th>
                    <th style="width: ${this.viewMode==="detailed"?"13%":"18%"}">Requirements</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.map(e=>t`
                    <tr>
                      <td>
                        <div class="fw-bold">${e.name}</div>
                        ${this.viewMode==="compact"?t`<small class="text-muted"><code>${e.code}</code></small>`:""}
                      </td>
                      ${this.viewMode==="detailed"?t`
                        <td><small class="text-muted"><code>${e.code}</code></small></td>
                      `:""}
                      <td><small class="text-muted">${e.description}</small></td>
                      <td><span class="badge bg-secondary">${e.module}</span></td>
                      <td><span class="badge bg-info">${e.entity}</span></td>
                      <td><span class="badge bg-primary">${e.action}</span></td>
                      <td><span class="badge bg-${this._getLevelColor(e.level)}">${e.level}</span></td>
                      ${this.viewMode==="detailed"?t`
                        <td><span class="badge bg-secondary">${e.scope}</span></td>
                      `:""}
                      <td><span class="badge bg-${this._getRiskColor(e.riskLevel)}">${e.riskLevel}</span></td>
                      <td>
                        <div class="d-flex flex-wrap gap-1">
                          ${e.requiresMfa?t`<span class="badge bg-warning" title="Requires MFA"><i class="bi bi-shield-lock"></i></span>`:""}
                          ${e.requiresApproval?t`<span class="badge bg-info" title="Requires Approval"><i class="bi bi-check-circle"></i></span>`:""}
                          ${e.auditLog?t`<span class="badge bg-secondary" title="Audit Logged"><i class="bi bi-clock-history"></i></span>`:""}
                          ${e.isSystemPermission?t`<span class="badge bg-danger" title="System Permission"><i class="bi bi-gear"></i></span>`:""}
                        </div>
                      </td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `}_renderLegend(){return t`
      <div class="card shadow-sm mt-4">
        <div class="card-header bg-light">
          <h6 class="card-title mb-0">
            <i class="bi bi-info-circle me-2"></i>Legend
          </h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <h6 class="small fw-bold">Security Levels</h6>
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge bg-danger">App</span>
                <span class="badge bg-warning">Module</span>
                <span class="badge bg-primary">Entity</span>
                <span class="badge bg-info">Field</span>
                <span class="badge bg-success">Record</span>
              </div>
            </div>
            <div class="col-md-4">
              <h6 class="small fw-bold">Risk Levels</h6>
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge bg-success">Low</span>
                <span class="badge bg-warning">Medium</span>
                <span class="badge bg-danger">High</span>
                <span class="badge bg-dark">Critical</span>
              </div>
            </div>
            <div class="col-md-4">
              <h6 class="small fw-bold">Requirements</h6>
              <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-warning"><i class="bi bi-shield-lock"></i> MFA</span>
                <span class="badge bg-info"><i class="bi bi-check-circle"></i> Approval</span>
                <span class="badge bg-secondary"><i class="bi bi-clock-history"></i> Audit</span>
                <span class="badge bg-danger"><i class="bi bi-gear"></i> System</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}render(){if(this.loading)return t`
        <div class="text-center p-5">
          <div class="spinner-border text-primary"></div>
          <p class="mt-3">Loading permissions...</p>
        </div>
      `;const s=this._getFilteredPermissions();return t`
      <div>
        <!-- Page Header -->
        <div class="mb-4">
          <h1 class="h2 fw-bold">
            <i class="bi bi-key me-2"></i>Permission Browser
          </h1>
          <p class="text-muted">Comprehensive enterprise permission system overview with advanced filtering and analytics</p>
        </div>

        <!-- Statistics Section (Collapsible) -->
        ${this.showStatistics?this._renderStatistics():""}

        <!-- Filters -->
        ${this._renderFilters()}

        <!-- Table -->
        ${this._renderTable(s)}

        <!-- Legend -->
        ${this._renderLegend()}
      </div>
    `}}customElements.define("permission-browser",o);
