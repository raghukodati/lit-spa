import{N as s}from"./index-MMTwS6vP.js";import{B as o}from"./BaseComponent-CSYJIZBK.js";class l extends o{static properties={roles:{type:Array},loading:{type:Boolean},filterCategory:{type:String},searchTerm:{type:String}};createRenderRoot(){return this}constructor(){super(),this.roles=[],this.loading=!1,this.filterCategory="all",this.searchTerm="",this._dataService=null}connectedCallback(){super.connectedCallback(),this._loadRoles(),this._handlePopState=()=>{window.location.pathname==="/roles"&&(console.log("Route changed to roles page, reloading data"),this._loadRoles())},window.addEventListener("popstate",this._handlePopState)}disconnectedCallback(){super.disconnectedCallback(),this._handlePopState&&window.removeEventListener("popstate",this._handlePopState)}async _loadRoles(){this.loading=!0,this._dataService||(this._dataService=await this.getService("dataService")),this.roles=await this._dataService.getRoles(),this.loading=!1}_hasPermission(e,t){return this._dataService?this._dataService.hasPermission(e,t):!1}_navigateToCreate(){window.history.pushState({},"","/roles/new"),window.dispatchEvent(new PopStateEvent("popstate"))}_navigateToEdit(e){window.history.pushState({},"",`/roles/edit/${e.id}`),window.dispatchEvent(new PopStateEvent("popstate"))}async _deleteRole(e){if(e.isSystemRole){alert("Cannot delete system roles");return}confirm(`Delete role ${e.name}?`)&&(this.loading=!0,this._dataService||(this._dataService=await this.getService("dataService")),await this._dataService.deleteRole(e.id),await this._loadRoles(),this.loading=!1)}_getPermissionSummary(e){if(!e.permissions||typeof e.permissions!="object")return s`<span class="text-muted">No permissions</span>`;const t=Object.values(e.permissions).reduce((a,n)=>a+n.length,0),i=Object.keys(e.permissions).filter(a=>e.permissions[a].length>0).length;return s`
      <div class="d-flex flex-wrap gap-1">
        <span class="badge bg-primary">${t} permissions</span>
        <span class="badge bg-info">${i} entities</span>
        ${e.inheritPermissions?s`<span class="badge bg-warning"><i class="bi bi-arrow-down"></i> Inherits</span>`:""}
      </div>
    `}_getCategoryColor(e){return{system:"danger",admin:"warning",custom:"info"}[e]||"secondary"}_getScopeColor(e){return{global:"danger",organization:"primary",department:"info",team:"warning",own:"success"}[e]||"secondary"}_getFilteredRoles(){let e=this.roles;if(this.filterCategory!=="all"&&(e=e.filter(t=>t.category===this.filterCategory)),this.searchTerm){const t=this.searchTerm.toLowerCase();e=e.filter(i=>i.name?.toLowerCase().includes(t)||i.description?.toLowerCase().includes(t))}return e.sort((t,i)=>(t.priority||999)-(i.priority||999))}_getParentRoleName(e){const t=this.roles.find(i=>i.id===e);return t?t.name:"Unknown"}_navigateToViewPermissions(e){window.history.pushState({},"",`/roles/${e.id}/permissions`),window.dispatchEvent(new PopStateEvent("popstate"))}render(){return s`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold"><i class="bi bi-shield-check me-2"></i>Role Management</h1>
            <p class="text-muted">Enterprise role management with hierarchy and scopes</p>
          </div>
          ${this._hasPermission("settings","create")?s`
            <button @click=${this._navigateToCreate} class="btn btn-success">
              <i class="bi bi-plus-circle me-1"></i>Create Role
            </button>
          `:""}
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Search</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by role name or description..."
                  .value=${this.searchTerm}
                  @input=${e=>this.searchTerm=e.target.value}>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Category</label>
                <select class="form-select" .value=${this.filterCategory} @change=${e=>this.filterCategory=e.target.value}>
                  <option value="all">All Categories</option>
                  <option value="system">System</option>
                  <option value="admin">Admin</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Roles Table Card -->
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0">
              <i class="bi bi-table me-2"></i>Roles (${this._getFilteredRoles().length} of ${this.roles.length})
            </h5>
          </div>
          <div class="card-body p-0">
            ${this.loading?s`<div class="text-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>`:s`
                  <div class="table-responsive">
                    <table class="table table-hover table-striped mb-0">
                      <thead class="table-primary">
                        <tr>
                          <th class="fw-semibold">Role</th>
                          <th class="fw-semibold">Hierarchy</th>
                          <th class="fw-semibold">Scope & Security</th>
                          <th class="fw-semibold">Permissions</th>
                          <th class="fw-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this._getFilteredRoles().map(e=>s`
                            <tr>
                              <td>
                                <div class="d-flex align-items-center">
                                  <div class="me-2">
                                    <i class="bi bi-shield-${e.isSystemRole?"lock":"check"} fs-4 text-${e.isSystemRole?"danger":"primary"}"></i>
                                  </div>
                                  <div>
                                    <div class="fw-bold">${e.name}</div>
                                    <div class="small text-muted">${e.description}</div>
                                    <div class="mt-1">
                                      <span class="badge bg-${this._getCategoryColor(e.category)}">${e.category}</span>
                                      ${e.isSystemRole?s`<span class="badge bg-danger"><i class="bi bi-lock"></i> System</span>`:""}
                                      <span class="badge bg-secondary">Priority: ${e.priority}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div class="small">
                                  ${e.parentRoleId?s`
                                    <div class="mb-1">
                                      <i class="bi bi-arrow-up-circle text-primary"></i>
                                      <span class="text-muted">Parent:</span>
                                      <strong>${this._getParentRoleName(e.parentRoleId)}</strong>
                                    </div>
                                  `:s`
                                    <div class="text-muted"><i class="bi bi-circle"></i> Root Role</div>
                                  `}
                                  ${Object.keys(e.fieldPermissions||{}).length>0?s`
                                    <div><span class="badge bg-info"><i class="bi bi-eye"></i> Field Perms</span></div>
                                  `:""}
                                </div>
                              </td>
                              <td>
                                <div class="small">
                                  <div class="mb-1">
                                    <span class="badge bg-${this._getScopeColor(e.dataScope)}">
                                      ${e.dataScope?.toUpperCase()||"OWN"}
                                    </span>
                                  </div>
                                  ${e.constraints?.maxRecords?s`
                                    <div><i class="bi bi-graph-down"></i> Max: ${e.constraints.maxRecords}</div>
                                  `:""}
                                  ${e.constraints?.ipRestrictions?.length?s`
                                    <div><i class="bi bi-shield-lock"></i> IP Restricted</div>
                                  `:""}
                                  ${e.expiresAt?s`
                                    <div><i class="bi bi-clock"></i> Expires: ${new Date(e.expiresAt).toLocaleDateString()}</div>
                                  `:""}
                                </div>
                              </td>
                              <td>${this._getPermissionSummary(e)}</td>
                              <td>
                                <div class="d-flex gap-1">
                                  ${this._hasPermission("settings","read")?s`
                                    <button @click=${()=>this._navigateToViewPermissions(e)} class="btn btn-sm btn-outline-secondary" title="View Permissions">
                                      <i class="bi bi-eye"></i>
                                    </button>
                                  `:""}
                                  ${this._hasPermission("settings","update")?s`
                                    <button @click=${()=>this._navigateToEdit(e)} class="btn btn-sm btn-outline-info" title="Edit Role">
                                      <i class="bi bi-pencil"></i>
                                    </button>
                                  `:""}
                                  ${this._hasPermission("settings","delete")&&!e.isSystemRole?s`
                                    <button @click=${()=>this._deleteRole(e)} class="btn btn-sm btn-outline-danger" title="Delete Role">
                                      <i class="bi bi-trash"></i>
                                    </button>
                                  `:""}
                                  ${e.isSystemRole?s`
                                    <span class="badge bg-secondary" title="System role cannot be deleted">
                                      <i class="bi bi-lock"></i> Protected
                                    </span>
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
    `}}customElements.define("role-management",l);
