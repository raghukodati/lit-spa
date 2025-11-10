import{N as i}from"./index-B2c558M3.js";import{B as a}from"./BaseComponent-DR8UZD6Q.js";class r extends a{static properties={activeUsers:{type:Array},recentActivities:{type:Array},loading:{type:Boolean},autoRefresh:{type:Boolean},refreshInterval:{type:Number}};createRenderRoot(){return this}constructor(){super(),this.activeUsers=[],this.recentActivities=[],this.loading=!1,this.autoRefresh=!0,this.refreshInterval=3e4,this._refreshTimer=null}async connectedCallback(){super.connectedCallback(),await this.loadData(),this._startAutoRefresh()}disconnectedCallback(){super.disconnectedCallback(),this._stopAutoRefresh()}async loadData(){this.loading=!0;try{this.activeUsers=this._generateMockActiveUsers(),this.recentActivities=this._generateMockActivities()}catch(e){console.error("Failed to load activity data:",e)}finally{this.loading=!1}}_generateMockActiveUsers(){return[{id:1,name:"Super Admin",email:"admin@example.com",ipAddress:"192.168.1.100",lastActivity:new Date(Date.now()-2*60*1e3),sessionDuration:"2h 15m",activeTab:"Users",location:"New York, US"},{id:2,name:"John Manager",email:"manager@example.com",ipAddress:"192.168.1.101",lastActivity:new Date(Date.now()-5*60*1e3),sessionDuration:"45m",activeTab:"Dashboard",location:"London, UK"},{id:3,name:"Jane Sales",email:"sales@example.com",ipAddress:"192.168.1.102",lastActivity:new Date(Date.now()-1*60*1e3),sessionDuration:"1h 30m",activeTab:"Reports",location:"Tokyo, JP"},{id:4,name:"Bob Analyst",email:"analyst@example.com",ipAddress:"192.168.1.103",lastActivity:new Date(Date.now()-10*60*1e3),sessionDuration:"3h 5m",activeTab:"Analytics",location:"Sydney, AU"}]}_generateMockActivities(){return[{username:"Super Admin",action:"Updated user",details:"Modified John Manager permissions",timestamp:new Date(Date.now()-5*60*1e3),severity:"medium"},{username:"John Manager",action:"Viewed report",details:"Sales Q4 Report",timestamp:new Date(Date.now()-8*60*1e3),severity:"low"},{username:"Jane Sales",action:"Created customer",details:"New customer: Acme Corp",timestamp:new Date(Date.now()-12*60*1e3),severity:"low"},{username:"Super Admin",action:"Changed security settings",details:"Updated password policy",timestamp:new Date(Date.now()-15*60*1e3),severity:"high"},{username:"Bob Analyst",action:"Exported data",details:"Customer database export",timestamp:new Date(Date.now()-20*60*1e3),severity:"high"},{username:"Jane Sales",action:"Login",details:"Successful login from 192.168.1.102",timestamp:new Date(Date.now()-90*60*1e3),severity:"low"}]}_startAutoRefresh(){this.autoRefresh&&(this._refreshTimer=setInterval(()=>{this.loadData()},this.refreshInterval))}_stopAutoRefresh(){this._refreshTimer&&(clearInterval(this._refreshTimer),this._refreshTimer=null)}_toggleAutoRefresh(){this.autoRefresh=!this.autoRefresh,this.autoRefresh?this._startAutoRefresh():this._stopAutoRefresh()}_getActivityColor(e){const t=(Date.now()-e.getTime())/6e4;return t<5?"success":t<15?"warning":"danger"}_getSeverityColor(e){return{low:"info",medium:"warning",high:"danger",critical:"dark"}[e]||"secondary"}_formatTimeAgo(e){const t=Math.floor((Date.now()-e.getTime())/1e3);if(t<60)return`${t}s ago`;const s=Math.floor(t/60);return s<60?`${s}m ago`:`${Math.floor(s/60)}h ago`}async _killSession(e){if(confirm(`Terminate session for ${e.name}?`))try{alert("Session terminated"),await this.loadData()}catch(t){console.error("Failed to terminate session:",t)}}render(){return i`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-activity me-2"></i>User Activity Monitor
            </h1>
            <p class="text-muted">Real-time monitoring of active users and recent activities</p>
          </div>
          <div class="d-flex gap-2">
            <button @click=${this._toggleAutoRefresh} class="btn btn-outline-${this.autoRefresh?"success":"secondary"}">
              <i class="bi bi-${this.autoRefresh?"pause":"play"}-circle me-1"></i>
              ${this.autoRefresh?"Auto-Refresh ON":"Auto-Refresh OFF"}
            </button>
            <button @click=${()=>this.loadData()} class="btn btn-primary">
              <i class="bi bi-arrow-clockwise me-1"></i>Refresh Now
            </button>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card border-success">
              <div class="card-body text-center">
                <i class="bi bi-people fs-1 text-success"></i>
                <h3 class="mt-2">${this.activeUsers.length}</h3>
                <p class="text-muted mb-0">Active Users</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-info">
              <div class="card-body text-center">
                <i class="bi bi-activity fs-1 text-info"></i>
                <h3 class="mt-2">${this.recentActivities.length}</h3>
                <p class="text-muted mb-0">Recent Activities</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-warning">
              <div class="card-body text-center">
                <i class="bi bi-clock fs-1 text-warning"></i>
                <h3 class="mt-2">${this.activeUsers.filter(e=>(Date.now()-e.lastActivity.getTime())/6e4>15).length}</h3>
                <p class="text-muted mb-0">Idle Users</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-danger">
              <div class="card-body text-center">
                <i class="bi bi-exclamation-triangle fs-1 text-danger"></i>
                <h3 class="mt-2">${this.recentActivities.filter(e=>e.severity==="high"||e.severity==="critical").length}</h3>
                <p class="text-muted mb-0">High-Risk Actions</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Active Users -->
          <div class="col-lg-7 mb-4">
            <div class="card shadow-sm">
              <div class="card-header bg-white">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-people me-2"></i>Active Users (${this.activeUsers.length})
                  </h5>
                  <span class="badge bg-success">
                    <i class="bi bi-circle-fill"></i> Live
                  </span>
                </div>
              </div>
              <div class="card-body p-0">
                ${this.loading?i`
                  <div class="text-center p-5">
                    <div class="spinner-border text-primary"></div>
                  </div>
                `:i`
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <thead class="table-light">
                        <tr>
                          <th>User</th>
                          <th>Activity</th>
                          <th>Location</th>
                          <th>Session</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.activeUsers.length===0?i`
                          <tr>
                            <td colspan="5" class="text-center text-muted py-4">
                              No active users
                            </td>
                          </tr>
                        `:this.activeUsers.map(e=>i`
                          <tr>
                            <td>
                              <div class="d-flex align-items-center">
                                <div class="position-relative me-2">
                                  <i class="bi bi-person-circle fs-4 text-primary"></i>
                                  <span class="position-absolute top-0 start-100 translate-middle p-1 bg-${this._getActivityColor(e.lastActivity)} border border-light rounded-circle">
                                    <span class="visually-hidden">Active</span>
                                  </span>
                                </div>
                                <div>
                                  <div class="fw-bold">${e.name}</div>
                                  <div class="small text-muted">${e.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="small">
                                <div><i class="bi bi-window"></i> ${e.activeTab}</div>
                                <div class="text-muted">
                                  <i class="bi bi-clock"></i> ${this._formatTimeAgo(e.lastActivity)}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="small">
                                <div><i class="bi bi-geo-alt"></i> ${e.location}</div>
                                <div class="text-muted"><code>${e.ipAddress}</code></div>
                              </div>
                            </td>
                            <td>
                              <span class="badge bg-info">${e.sessionDuration}</span>
                            </td>
                            <td>
                              <button 
                                @click=${()=>this._killSession(e)}
                                class="btn btn-sm btn-outline-danger"
                                title="Terminate session">
                                <i class="bi bi-x-circle"></i>
                              </button>
                            </td>
                          </tr>
                        `)}
                      </tbody>
                    </table>
                  </div>
                `}
              </div>
            </div>
          </div>

          <!-- Recent Activities -->
          <div class="col-lg-5 mb-4">
            <div class="card shadow-sm">
              <div class="card-header bg-white">
                <h5 class="card-title mb-0">
                  <i class="bi bi-list-ul me-2"></i>Recent Activities
                </h5>
              </div>
              <div class="card-body p-0">
                ${this.loading?i`
                  <div class="text-center p-5">
                    <div class="spinner-border text-primary"></div>
                  </div>
                `:i`
                  <div class="list-group list-group-flush" style="max-height: 600px; overflow-y: auto;">
                    ${this.recentActivities.length===0?i`
                      <div class="text-center text-muted py-4">
                        No recent activities
                      </div>
                    `:this.recentActivities.map(e=>i`
                      <div class="list-group-item">
                        <div class="d-flex w-100 justify-content-between align-items-start">
                          <div class="flex-grow-1">
                            <div class="d-flex align-items-center mb-1">
                              <i class="bi bi-person-circle me-2 text-primary"></i>
                              <strong>${e.username}</strong>
                              <span class="badge bg-${this._getSeverityColor(e.severity)} ms-2">
                                ${e.severity}
                              </span>
                            </div>
                            <div class="fw-bold text-dark mb-1">${e.action}</div>
                            <div class="small text-muted">${e.details}</div>
                          </div>
                        </div>
                        <div class="small text-muted mt-2">
                          <i class="bi bi-clock"></i> ${this._formatTimeAgo(e.timestamp)}
                        </div>
                      </div>
                    `)}
                  </div>
                `}
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Timeline (Optional Enhancement) -->
        <div class="card shadow-sm">
          <div class="card-header bg-white">
            <h5 class="card-title mb-0">
              <i class="bi bi-graph-up me-2"></i>Activity Timeline
            </h5>
          </div>
          <div class="card-body">
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              Activity timeline chart would be displayed here (requires charting library)
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("user-activity-monitor",r);
