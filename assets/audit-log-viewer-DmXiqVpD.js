import{V as o,N as a}from"./index-e1bWKrj6.js";import{B as m}from"./BaseComponent-C9iYdUKf.js";class g extends m{static properties={auditLogs:{type:Array},loading:{type:Boolean},filterEvent:{type:String},filterUser:{type:String},filterDateFrom:{type:String},filterDateTo:{type:String},searchTerm:{type:String},currentPage:{type:Number},pageSize:{type:Number}};createRenderRoot(){return this}constructor(){super(),this.auditLogs=[],this.loading=!1,this.filterEvent="all",this.filterUser="all",this.filterDateFrom="",this.filterDateTo="",this.searchTerm="",this.currentPage=1,this.pageSize=25}async connectedCallback(){super.connectedCallback(),await this.loadAuditLogs()}async loadAuditLogs(){this.loading=!0;try{this.auditLogs=o.getAuditLog()}catch(t){console.error("Failed to load audit logs:",t)}finally{this.loading=!1}}_getEventColor(t){return{permission_check:"info",login:"success",logout:"secondary",failed_login:"danger",user_created:"success",user_updated:"warning",user_deleted:"danger",role_assigned:"primary",permission_granted:"success",permission_denied:"danger",mfa_enabled:"success",mfa_disabled:"warning",account_locked:"danger",password_changed:"info",security_violation:"danger"}[t]||"secondary"}_getEventIcon(t){return{permission_check:"shield-check",login:"box-arrow-in-right",logout:"box-arrow-right",failed_login:"x-circle",user_created:"person-plus",user_updated:"person-gear",user_deleted:"person-x",role_assigned:"shield-plus",permission_granted:"check-circle",permission_denied:"x-octagon",mfa_enabled:"shield-lock",mfa_disabled:"shield-x",account_locked:"lock",password_changed:"key",security_violation:"exclamation-triangle"}[t]||"circle"}_getFilteredLogs(){let t=this.auditLogs;if(this.filterEvent!=="all"&&(t=t.filter(s=>s.event===this.filterEvent)),this.filterUser!=="all"&&(t=t.filter(s=>s.username===this.filterUser)),this.filterDateFrom){const s=new Date(this.filterDateFrom);t=t.filter(i=>new Date(i.timestamp)>=s)}if(this.filterDateTo){const s=new Date(this.filterDateTo);s.setHours(23,59,59,999),t=t.filter(i=>new Date(i.timestamp)<=s)}if(this.searchTerm){const s=this.searchTerm.toLowerCase();t=t.filter(i=>i.event?.toLowerCase().includes(s)||i.username?.toLowerCase().includes(s)||JSON.stringify(i.details)?.toLowerCase().includes(s))}return t.sort((s,i)=>new Date(i.timestamp)-new Date(s.timestamp))}_getPaginatedLogs(){const t=this._getFilteredLogs(),s=(this.currentPage-1)*this.pageSize,i=s+this.pageSize;return t.slice(s,i)}_getTotalPages(){return Math.ceil(this._getFilteredLogs().length/this.pageSize)}_getUniqueEvents(){return[...new Set(this.auditLogs.map(t=>t.event))].filter(Boolean)}_getUniqueUsers(){return[...new Set(this.auditLogs.map(t=>t.username))].filter(Boolean)}_exportToCSV(){const t=this._getFilteredLogs(),s=["Timestamp","Event","User","Details","IP Address"],i=t.map(r=>[new Date(r.timestamp).toISOString(),r.event,r.username||"System",JSON.stringify(r.details),r.ipAddress||"N/A"]),e=[s,...i].map(r=>r.map(d=>`"${d}"`).join(",")).join(`
`),c=new Blob([e],{type:"text/csv"}),l=URL.createObjectURL(c),n=document.createElement("a");n.href=l,n.download=`audit-log-${new Date().toISOString().split("T")[0]}.csv`,n.click()}render(){const t=this._getFilteredLogs(),s=this._getPaginatedLogs(),i=this._getTotalPages();return a`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-clock-history me-2"></i>Security Audit Log
            </h1>
            <p class="text-muted">View and analyze security events and user activities</p>
          </div>
          <button @click=${this._exportToCSV} class="btn btn-outline-primary">
            <i class="bi bi-download me-1"></i>Export CSV
          </button>
        </div>

        <!-- Statistics Cards -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card border-primary">
              <div class="card-body text-center">
                <i class="bi bi-list-ul fs-1 text-primary"></i>
                <h3 class="mt-2">${this.auditLogs.length}</h3>
                <p class="text-muted mb-0">Total Events</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-success">
              <div class="card-body text-center">
                <i class="bi bi-check-circle fs-1 text-success"></i>
                <h3 class="mt-2">${this.auditLogs.filter(e=>e.event.includes("success")||e.event.includes("granted")).length}</h3>
                <p class="text-muted mb-0">Successful Actions</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-danger">
              <div class="card-body text-center">
                <i class="bi bi-x-circle fs-1 text-danger"></i>
                <h3 class="mt-2">${this.auditLogs.filter(e=>e.event.includes("failed")||e.event.includes("denied")).length}</h3>
                <p class="text-muted mb-0">Failed Actions</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-info">
              <div class="card-body text-center">
                <i class="bi bi-people fs-1 text-info"></i>
                <h3 class="mt-2">${this._getUniqueUsers().length}</h3>
                <p class="text-muted mb-0">Active Users</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Search</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search logs..."
                  .value=${this.searchTerm}
                  @input=${e=>this.searchTerm=e.target.value}>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-semibold">Event Type</label>
                <select class="form-select" .value=${this.filterEvent} @change=${e=>this.filterEvent=e.target.value}>
                  <option value="all">All Events</option>
                  ${this._getUniqueEvents().map(e=>a`
                    <option value="${e}">${e}</option>
                  `)}
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-semibold">User</label>
                <select class="form-select" .value=${this.filterUser} @change=${e=>this.filterUser=e.target.value}>
                  <option value="all">All Users</option>
                  ${this._getUniqueUsers().map(e=>a`
                    <option value="${e}">${e}</option>
                  `)}
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-semibold">From Date</label>
                <input 
                  type="date" 
                  class="form-control"
                  .value=${this.filterDateFrom}
                  @input=${e=>this.filterDateFrom=e.target.value}>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-semibold">To Date</label>
                <input 
                  type="date" 
                  class="form-control"
                  .value=${this.filterDateTo}
                  @input=${e=>this.filterDateTo=e.target.value}>
              </div>
              <div class="col-md-1">
                <label class="form-label small fw-semibold">&nbsp;</label>
                <button 
                  class="btn btn-outline-secondary w-100"
                  @click=${()=>{this.filterEvent="all",this.filterUser="all",this.filterDateFrom="",this.filterDateTo="",this.searchTerm=""}}>
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Audit Log Table -->
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0">
              <i class="bi bi-table me-2"></i>Audit Entries (${t.length})
            </h5>
          </div>
          <div class="card-body p-0">
            ${this.loading?a`
              <div class="text-center p-5">
                <div class="spinner-border text-primary"></div>
              </div>
            `:a`
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="fw-semibold">Timestamp</th>
                      <th class="fw-semibold">Event</th>
                      <th class="fw-semibold">User</th>
                      <th class="fw-semibold">Details</th>
                      <th class="fw-semibold">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${s.length===0?a`
                      <tr>
                        <td colspan="5" class="text-center text-muted py-4">
                          No audit logs found matching your filters
                        </td>
                      </tr>
                    `:s.map(e=>a`
                      <tr>
                        <td>
                          <div class="small">
                            <div class="fw-bold">${new Date(e.timestamp).toLocaleString()}</div>
                            <div class="text-muted">${new Date(e.timestamp).toRelativeTimeString?.()||"Just now"}</div>
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-${this._getEventColor(e.event)}">
                            <i class="bi bi-${this._getEventIcon(e.event)}"></i> ${e.event}
                          </span>
                        </td>
                        <td>
                          <div class="d-flex align-items-center">
                            <i class="bi bi-person-circle me-2 text-primary"></i>
                            <span>${e.username||"System"}</span>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            ${Object.entries(e.details||{}).map(([c,l])=>a`
                              <div><strong>${c}:</strong> ${l}</div>
                            `)}
                          </div>
                        </td>
                        <td>
                          <code class="small">${e.ipAddress||"N/A"}</code>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              ${i>1?a`
                <div class="card-footer bg-white border-top">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="text-muted small">
                      Showing ${(this.currentPage-1)*this.pageSize+1} - ${Math.min(this.currentPage*this.pageSize,t.length)} of ${t.length}
                    </div>
                    <nav>
                      <ul class="pagination pagination-sm mb-0">
                        <li class="page-item ${this.currentPage===1?"disabled":""}">
                          <button class="page-link" @click=${()=>this.currentPage=1}>First</button>
                        </li>
                        <li class="page-item ${this.currentPage===1?"disabled":""}">
                          <button class="page-link" @click=${()=>this.currentPage--}>Previous</button>
                        </li>
                        ${Array.from({length:Math.min(5,i)},(e,c)=>{const l=Math.max(1,this.currentPage-2)+c;return l<=i?a`
                            <li class="page-item ${this.currentPage===l?"active":""}">
                              <button class="page-link" @click=${()=>this.currentPage=l}>${l}</button>
                            </li>
                          `:""})}
                        <li class="page-item ${this.currentPage===i?"disabled":""}">
                          <button class="page-link" @click=${()=>this.currentPage++}>Next</button>
                        </li>
                        <li class="page-item ${this.currentPage===i?"disabled":""}">
                          <button class="page-link" @click=${()=>this.currentPage=i}>Last</button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              `:""}
            `}
          </div>
        </div>
      </div>
    `}}customElements.define("audit-log-viewer",g);
