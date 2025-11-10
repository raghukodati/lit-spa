import{R as i,S as a,N as s}from"./index-MMTwS6vP.js";import{B as o}from"./BaseComponent-CSYJIZBK.js";class r extends o{static properties={users:{type:Array},loading:{type:Boolean},filterScope:{type:String},filterStatus:{type:String},searchTerm:{type:String}};createRenderRoot(){return this}constructor(){super(),this.users=[],this.loading=!1,this.filterScope="all",this.filterStatus="all",this.searchTerm="",this._unsubscribeCreated=null,this._unsubscribeUpdated=null,this._unsubscribeDeleted=null,this._dataService=null}connectedCallback(){super.connectedCallback(),this._unsubscribeCreated=i.on(a.USER_CREATED,()=>{console.log("User created event received, refreshing list"),this._loadUsers()}),this._unsubscribeUpdated=i.on(a.USER_UPDATED,e=>{console.log("User updated event received:",e.userId),this._loadUsers()}),this._unsubscribeDeleted=i.on(a.USER_DELETED,e=>{console.log("User deleted event received:",e.userId),this._loadUsers()}),this._handlePopState=()=>{window.location.pathname==="/users"&&(console.log("Route changed to users page, reloading data"),setTimeout(()=>this._loadUsers(),0))},window.addEventListener("popstate",this._handlePopState),setTimeout(()=>this._loadUsers(),0)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeCreated&&this._unsubscribeCreated(),this._unsubscribeUpdated&&this._unsubscribeUpdated(),this._unsubscribeDeleted&&this._unsubscribeDeleted(),this._handlePopState&&window.removeEventListener("popstate",this._handlePopState)}async _loadUsers(){this.loading=!0;try{this._dataService||(this._dataService=await this.getService("dataService"));const e=await this._dataService.getUsers();console.log("Loaded users:",e.length),this.users=e,console.log("Displaying users:",this.users.length),this.requestUpdate()}catch(e){console.error("Failed to load users:",e),this.users=[]}finally{this.loading=!1}}_hasPermission(e,t){return this._dataService?this._dataService.hasPermission(e,t):!1}_navigateToCreate(){window.history.pushState({},"","/users/new"),window.dispatchEvent(new PopStateEvent("popstate"))}_navigateToEdit(e){window.history.pushState({},"",`/users/edit/${e.id}`),window.dispatchEvent(new PopStateEvent("popstate"))}_navigateToAssignRoles(e){window.history.pushState({},"",`/users/${e.id}/assign-roles`),window.dispatchEvent(new PopStateEvent("popstate"))}async _deleteUser(e){if(confirm(`Delete user ${e.name}?`)){i.emit(a.UI_LOADING_START,{source:"user-management"}),this.loading=!0;try{this._dataService||(this._dataService=await this.getService("dataService")),await this._dataService.deleteUser(e.id),i.emit(a.USER_DELETED,{userId:e.id,user:e}),i.emit(a.UI_SUCCESS,{message:"User deleted successfully"}),await this._loadUsers()}catch(t){console.error("Error deleting user:",t),i.emit(a.UI_ERROR,{message:"Failed to delete user",error:t})}finally{this.loading=!1,i.emit(a.UI_LOADING_END,{source:"user-management"})}}}_getRoleColor(e){return{Admin:"warning",Manager:"primary",User:"secondary"}[e]||"secondary"}_getScopeColor(e){return{global:"danger",organization:"primary",department:"info",team:"warning",own:"success"}[e]||"secondary"}_getFilteredUsers(){let e=this.users;if(this.filterScope!=="all"&&(e=e.filter(t=>t.permissionScope===this.filterScope)),this.filterStatus!=="all"&&(e=e.filter(t=>t.status===this.filterStatus)),this.searchTerm){const t=this.searchTerm.toLowerCase();e=e.filter(l=>l.name?.toLowerCase().includes(t)||l.email?.toLowerCase().includes(t)||l.username?.toLowerCase().includes(t))}return e}render(){return s`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold"><i class="bi bi-people me-2"></i>User Management</h1>
            <p class="text-muted">Enterprise user management with scope-based access</p>
          </div>
          ${this._hasPermission("users","create")?s`
            <button @click=${this._navigateToCreate} class="btn btn-success">
              <i class="bi bi-plus-circle me-1"></i>Create User
            </button>
          `:""}
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label small fw-semibold">Search</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by name, email, or username..."
                  .value=${this.searchTerm}
                  @input=${e=>this.searchTerm=e.target.value}>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-semibold">Permission Scope</label>
                <select class="form-select" .value=${this.filterScope} @change=${e=>this.filterScope=e.target.value}>
                  <option value="all">All Scopes</option>
                  <option value="global">Global</option>
                  <option value="organization">Organization</option>
                  <option value="department">Department</option>
                  <option value="team">Team</option>
                  <option value="own">Own</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-semibold">Status</label>
                <select class="form-select" .value=${this.filterStatus} @change=${e=>this.filterStatus=e.target.value}>
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Locked">Locked</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- User Table Card -->
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0">
              <i class="bi bi-table me-2"></i>Users (${this._getFilteredUsers().length} of ${this.users.length})
            </h5>
          </div>
          <div class="card-body p-0">
            ${this.loading?s`<div class="text-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>`:s`
                  <div class="table-responsive">
                    <table class="table table-hover table-striped mb-0">
                      <thead class="table-primary">
                        <tr>
                          <th class="fw-semibold">User</th>
                          <th class="fw-semibold">Organization</th>
                          <th class="fw-semibold">Scope</th>
                          <th class="fw-semibold">Security</th>
                          <th class="fw-semibold">Status</th>
                          <th class="fw-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this._getFilteredUsers().length===0?s`
                          <tr>
                            <td colspan="6" class="text-center py-5">
                              <i class="bi bi-inbox fs-1 text-muted"></i>
                              <p class="text-muted mt-3 mb-0">
                                ${this.users.length===0?'No users found. Click "Create User" to add your first user.':"No users match your filters."}
                              </p>
                            </td>
                          </tr>
                        `:this._getFilteredUsers().map(e=>s`
                            <tr>
                              <td>
                                <div class="d-flex align-items-center">
                                  <div class="me-2">
                                    <i class="bi bi-person-circle fs-4 text-primary"></i>
                                  </div>
                                  <div>
                                    <div class="fw-bold">${e.name}</div>
                                    <div class="small text-muted">${e.email}</div>
                                    <div class="small text-muted">@${e.username||e.email.split("@")[0]}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div class="small">
                                  ${e.organizationId?s`
                                    <div><i class="bi bi-building"></i> Org: ${e.organizationId}</div>
                                  `:""}
                                  ${e.departmentId?s`
                                    <div><i class="bi bi-diagram-3"></i> Dept: ${e.departmentId}</div>
                                  `:""}
                                  ${e.teamId?s`
                                    <div><i class="bi bi-people"></i> Team: ${e.teamId}</div>
                                  `:""}
                                  ${!e.organizationId&&!e.departmentId&&!e.teamId?s`
                                    <span class="text-muted">-</span>
                                  `:""}
                                </div>
                              </td>
                              <td>
                                <span class="badge bg-${this._getScopeColor(e.permissionScope)}">
                                  ${e.permissionScope?.toUpperCase()||"OWN"}
                                </span>
                              </td>
                              <td>
                                <div class="small">
                                  ${e.mfaEnabled?s`
                                    <span class="badge bg-success mb-1"><i class="bi bi-shield-check"></i> MFA</span>
                                  `:s`
                                    <span class="badge bg-secondary mb-1"><i class="bi bi-shield-x"></i> No MFA</span>
                                  `}
                                  ${e.accountLocked?s`
                                    <span class="badge bg-danger mb-1"><i class="bi bi-lock"></i> Locked</span>
                                  `:""}
                                </div>
                              </td>
                              <td><span class="badge rounded-pill bg-${e.status==="Active"?"success":"danger"}">${e.status}</span></td>
                              <td>
                                <div class="d-flex gap-2">
                                  ${this._hasPermission("users","update")?s`
                                    <button @click=${()=>this._navigateToEdit(e)} class="btn btn-sm btn-outline-info">
                                      <i class="bi bi-pencil"></i> Edit
                                    </button>
                                  `:""}
                                  ${this._hasPermission("settings","update")?s`
                                    <button @click=${()=>this._navigateToAssignRoles(e)} class="btn btn-sm btn-outline-warning" title="Assign System Roles">
                                      <i class="bi bi-shield-check"></i> Roles
                                    </button>
                                  `:""}
                                  ${this._hasPermission("users","delete")?s`
                                    <button @click=${()=>this._deleteUser(e)} class="btn btn-sm btn-outline-danger">
                                      <i class="bi bi-trash"></i> Delete
                                    </button>
                                  `:""}
                                  ${!this._hasPermission("users","update")&&!this._hasPermission("settings","update")&&!this._hasPermission("users","delete")?s`
                                    <span class="text-muted small">No actions</span>
                                  `:""}
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
      </div>
    `}}customElements.define("user-management",r);
