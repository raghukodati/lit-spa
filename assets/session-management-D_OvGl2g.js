import{N as a}from"./index-tL1z1sM1.js";import{B as o}from"./BaseComponent-D2jDfeym.js";class r extends o{static properties={sessions:{type:Array},loading:{type:Boolean},filterUser:{type:String},filterStatus:{type:String},searchTerm:{type:String}};createRenderRoot(){return this}constructor(){super(),this.sessions=[],this.loading=!1,this.filterUser="all",this.filterStatus="all",this.searchTerm=""}async connectedCallback(){super.connectedCallback(),await this.loadSessions(),this._handlePopState=()=>{window.location.pathname==="/sessions"&&(console.log("Route changed to sessions page, reloading data"),this.loadSessions())},window.addEventListener("popstate",this._handlePopState)}disconnectedCallback(){super.disconnectedCallback(),this._handlePopState&&window.removeEventListener("popstate",this._handlePopState)}async loadSessions(){this.loading=!0;try{this.sessions=this._generateMockSessions()}catch(t){console.error("Failed to load sessions:",t)}finally{this.loading=!1}}_generateMockSessions(){return[{id:"sess_001",userId:1,username:"admin@example.com",userFullName:"Super Admin",ipAddress:"192.168.1.100",userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",browser:"Chrome 120",os:"macOS",device:"Desktop",location:"New York, US",startTime:new Date(Date.now()-2*60*60*1e3),lastActivity:new Date(Date.now()-5*60*1e3),expiresAt:new Date(Date.now()+58*60*1e3),status:"active",mfaVerified:!0},{id:"sess_002",userId:2,username:"manager@example.com",userFullName:"John Manager",ipAddress:"192.168.1.101",userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",browser:"Edge 120",os:"Windows 11",device:"Desktop",location:"London, UK",startTime:new Date(Date.now()-1*60*60*1e3),lastActivity:new Date(Date.now()-2*60*1e3),expiresAt:new Date(Date.now()+59*60*1e3),status:"active",mfaVerified:!0},{id:"sess_003",userId:3,username:"sales@example.com",userFullName:"Jane Sales",ipAddress:"192.168.1.102",userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",browser:"Safari Mobile",os:"iOS 17",device:"Mobile",location:"Tokyo, JP",startTime:new Date(Date.now()-30*60*1e3),lastActivity:new Date(Date.now()-20*60*1e3),expiresAt:new Date(Date.now()+10*60*1e3),status:"idle",mfaVerified:!0},{id:"sess_004",userId:1,username:"admin@example.com",userFullName:"Super Admin",ipAddress:"203.0.113.50",userAgent:"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",browser:"Firefox 121",os:"Linux",device:"Desktop",location:"Unknown",startTime:new Date(Date.now()-5*60*60*1e3),lastActivity:new Date(Date.now()-35*60*1e3),expiresAt:new Date(Date.now()-5*60*1e3),status:"expired",mfaVerified:!1}]}_getStatusColor(t){return{active:"success",idle:"warning",expired:"secondary",terminated:"danger"}[t]||"secondary"}_getDeviceIcon(t){return{Desktop:"pc-display",Mobile:"phone",Tablet:"tablet"}[t]||"device"}_formatDuration(t){const s=Math.floor((Date.now()-t.getTime())/1e3);if(s<60)return`${s}s`;const i=Math.floor(s/60);if(i<60)return`${i}m`;const e=Math.floor(i/60),l=i%60;return`${e}h ${l}m`}_formatTimeRemaining(t){const s=Math.floor((t.getTime()-Date.now())/1e3);return s<0?"Expired":s<60?`${s}s`:`${Math.floor(s/60)}m`}_getFilteredSessions(){let t=this.sessions;if(this.filterUser!=="all"&&(t=t.filter(s=>s.username===this.filterUser)),this.filterStatus!=="all"&&(t=t.filter(s=>s.status===this.filterStatus)),this.searchTerm){const s=this.searchTerm.toLowerCase();t=t.filter(i=>i.username?.toLowerCase().includes(s)||i.userFullName?.toLowerCase().includes(s)||i.ipAddress?.toLowerCase().includes(s)||i.location?.toLowerCase().includes(s))}return t.sort((s,i)=>i.lastActivity-s.lastActivity)}_getUniqueUsers(){return[...new Set(this.sessions.map(t=>t.username))]}async _terminateSession(t){if(confirm(`Terminate session for ${t.userFullName}?`))try{alert("Session terminated successfully"),await this.loadSessions()}catch(s){console.error("Failed to terminate session:",s),alert("Failed to terminate session")}}async _terminateAllUserSessions(t){if(confirm(`Terminate ALL sessions for ${t}?`))try{alert("All sessions terminated successfully"),await this.loadSessions()}catch(s){console.error("Failed to terminate sessions:",s),alert("Failed to terminate sessions")}}async _extendSession(t){try{alert("Session extended by 30 minutes"),await this.loadSessions()}catch(s){console.error("Failed to extend session:",s)}}render(){const t=this._getFilteredSessions(),s=this.sessions.filter(e=>e.status==="active"),i=this.sessions.filter(e=>e.status==="idle");return a`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-pc-display me-2"></i>Session Management
            </h1>
            <p class="text-muted">Monitor and manage active user sessions</p>
          </div>
          <button @click=${()=>this.loadSessions()} class="btn btn-primary">
            <i class="bi bi-arrow-clockwise me-1"></i>Refresh
          </button>
        </div>

        <!-- Statistics -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card border-success">
              <div class="card-body text-center">
                <i class="bi bi-check-circle fs-1 text-success"></i>
                <h3 class="mt-2">${s.length}</h3>
                <p class="text-muted mb-0">Active Sessions</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-warning">
              <div class="card-body text-center">
                <i class="bi bi-clock fs-1 text-warning"></i>
                <h3 class="mt-2">${i.length}</h3>
                <p class="text-muted mb-0">Idle Sessions</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-info">
              <div class="card-body text-center">
                <i class="bi bi-people fs-1 text-info"></i>
                <h3 class="mt-2">${this._getUniqueUsers().length}</h3>
                <p class="text-muted mb-0">Unique Users</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-primary">
              <div class="card-body text-center">
                <i class="bi bi-list-ul fs-1 text-primary"></i>
                <h3 class="mt-2">${this.sessions.length}</h3>
                <p class="text-muted mb-0">Total Sessions</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-5">
                <label class="form-label small fw-semibold">Search</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by user, IP, or location..."
                  .value=${this.searchTerm}
                  @input=${e=>this.searchTerm=e.target.value}>
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-semibold">User</label>
                <select class="form-select" .value=${this.filterUser} @change=${e=>this.filterUser=e.target.value}>
                  <option value="all">All Users</option>
                  ${this._getUniqueUsers().map(e=>a`
                    <option value="${e}">${e}</option>
                  `)}
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Status</label>
                <select class="form-select" .value=${this.filterStatus} @change=${e=>this.filterStatus=e.target.value}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div class="col-md-1">
                <label class="form-label small fw-semibold">&nbsp;</label>
                <button 
                  class="btn btn-outline-secondary w-100"
                  @click=${()=>{this.filterUser="all",this.filterStatus="all",this.searchTerm=""}}>
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sessions Table -->
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0">
              <i class="bi bi-table me-2"></i>Active Sessions (${t.length})
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
                      <th class="fw-semibold">User</th>
                      <th class="fw-semibold">Device & Location</th>
                      <th class="fw-semibold">Session Info</th>
                      <th class="fw-semibold">Status</th>
                      <th class="fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${t.length===0?a`
                      <tr>
                        <td colspan="5" class="text-center text-muted py-4">
                          No sessions found matching your filters
                        </td>
                      </tr>
                    `:t.map(e=>a`
                      <tr>
                        <td>
                          <div class="d-flex align-items-center">
                            <i class="bi bi-person-circle fs-4 text-primary me-2"></i>
                            <div>
                              <div class="fw-bold">${e.userFullName}</div>
                              <div class="small text-muted">${e.username}</div>
                              ${e.mfaVerified?a`
                                <span class="badge bg-success small"><i class="bi bi-shield-check"></i> MFA</span>
                              `:""}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            <div>
                              <i class="bi bi-${this._getDeviceIcon(e.device)}"></i>
                              ${e.browser} on ${e.os}
                            </div>
                            <div class="text-muted">
                              <i class="bi bi-geo-alt"></i> ${e.location}
                            </div>
                            <div class="text-muted">
                              <code>${e.ipAddress}</code>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="small">
                            <div><strong>Started:</strong> ${e.startTime.toLocaleString()}</div>
                            <div><strong>Duration:</strong> ${this._formatDuration(e.startTime)}</div>
                            <div><strong>Last Activity:</strong> ${this._formatDuration(e.lastActivity)} ago</div>
                            <div><strong>Expires:</strong> ${this._formatTimeRemaining(e.expiresAt)}</div>
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-${this._getStatusColor(e.status)}">
                            ${e.status}
                          </span>
                        </td>
                        <td>
                          <div class="d-flex gap-1">
                            ${e.status==="active"||e.status==="idle"?a`
                              <button 
                                @click=${()=>this._extendSession(e)}
                                class="btn btn-sm btn-outline-info"
                                title="Extend session">
                                <i class="bi bi-clock"></i>
                              </button>
                              <button 
                                @click=${()=>this._terminateSession(e)}
                                class="btn btn-sm btn-outline-danger"
                                title="Terminate session">
                                <i class="bi bi-x-circle"></i>
                              </button>
                            `:a`
                              <span class="text-muted small">No actions</span>
                            `}
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

        <!-- Bulk Actions -->
        <div class="card shadow-sm mt-4">
          <div class="card-header bg-warning">
            <h6 class="card-title mb-0">
              <i class="bi bi-exclamation-triangle me-2"></i>Bulk Actions
            </h6>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Terminate all sessions for user:</label>
                <div class="input-group">
                  <select class="form-select" id="bulkUserSelect">
                    ${this._getUniqueUsers().map(e=>a`
                      <option value="${e}">${e}</option>
                    `)}
                  </select>
                  <button 
                    class="btn btn-danger"
                    @click=${()=>{const e=this.renderRoot.querySelector("#bulkUserSelect")||document.getElementById("bulkUserSelect");this._terminateAllUserSessions(e?.value)}}>
                    <i class="bi bi-x-circle me-1"></i>Terminate All
                  </button>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Cleanup expired sessions:</label>
                <button class="btn btn-outline-secondary w-100">
                  <i class="bi bi-trash me-1"></i>Clean Expired Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("session-management",r);
