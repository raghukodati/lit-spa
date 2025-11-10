import{N as t}from"./index-DCWHXaZV.js";import{B as c}from"./BaseComponent-TlNBBqtl.js";class d extends c{static properties={userId:{type:String},user:{type:Object},roles:{type:Array},selectedRoles:{type:Array},loading:{type:Boolean}};createRenderRoot(){return this}constructor(){super(),this.userId=null,this.user=null,this.roles=[],this.selectedRoles=[],this.loading=!1,this._dataService=null}connectedCallback(){super.connectedCallback();const e=window.location.pathname.match(/\/users\/(\d+)\/assign-roles/);e&&(this.userId=e[1],this._loadData())}async _loadData(){this.loading=!0,this._dataService||(this._dataService=await this.getService("dataService"));const[s,e]=await Promise.all([this._dataService.getUserById(parseInt(this.userId)),this._dataService.getRoles()]);this.user=s,this.roles=e,this.selectedRoles=s?.assignedRoles||[],this.loading=!1}_toggleRole(s){this.selectedRoles.includes(s)?this.selectedRoles=this.selectedRoles.filter(e=>e!==s):this.selectedRoles=[...this.selectedRoles,s]}_getPermissionSummary(s){if(!s||typeof s!="object")return t`<span class="text-muted small">No permissions</span>`;const e=Object.values(s).reduce((a,l)=>a+l.length,0),i=Object.keys(s).filter(a=>s[a].length>0).length;return t`
      <div class="d-flex flex-wrap gap-1">
        <span class="badge bg-primary">${e} permissions</span>
        <span class="badge bg-info">${i} entities</span>
      </div>
    `}async _handleSave(){if(!this.can("settings","update")){alert("You do not have permission to assign roles");return}this.loading=!0;try{this._dataService||(this._dataService=await this.getService("dataService")),await this._dataService.assignRolesToUser(parseInt(this.userId),this.selectedRoles),window.history.pushState({},"","/users"),window.dispatchEvent(new PopStateEvent("popstate"))}catch(s){console.error("Error assigning roles:",s)}finally{this.loading=!1}}_handleCancel(){window.history.pushState({},"","/users"),window.dispatchEvent(new PopStateEvent("popstate"))}render(){return this.loading&&!this.user?t`
        <div class="text-center p-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading user and roles...</p>
        </div>
      `:this.user?t`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-shield-check me-2"></i>Assign Roles to User
            </h1>
            <p class="text-muted">
              Assigning roles for: <strong>${this.user.name}</strong> (${this.user.email})
            </p>
          </div>
          <button @click=${this._handleCancel} class="btn btn-secondary">
            <i class="bi bi-arrow-left me-1"></i>Back to Users
          </button>
        </div>

        <!-- User Info Card -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <small class="text-muted">User Name</small>
                <p class="mb-0 fw-bold">${this.user.name}</p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Email</small>
                <p class="mb-0">${this.user.email}</p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Primary Role</small>
                <p class="mb-0"><span class="badge bg-${this._getRoleColor(this.user.role)}">${this.user.role}</span></p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Status</small>
                <p class="mb-0"><span class="badge bg-${this.user.status==="Active"?"success":"danger"}">${this.user.status}</span></p>
              </div>
            </div>
          </div>
        </div>

        <!-- Role Assignment Card -->
        <div class="card shadow-sm">
          <div class="card-header bg-white">
            <h5 class="card-title mb-0">
              <i class="bi bi-shield-lock me-2"></i>Available Roles
            </h5>
          </div>
          <div class="card-body">
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              Select one or more roles to assign to this user. Users can have multiple roles with combined permissions.
            </div>
            
            <div class="row g-3">
              ${this.roles.map(s=>t`
                <div class="col-md-6">
                  <div class="card h-100 ${this.selectedRoles.includes(s.id)?"border-warning border-2 bg-light":""}">
                    <div class="card-body">
                      <div class="form-check">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="role-${s.id}"
                          .checked=${this.selectedRoles.includes(s.id)}
                          @change=${()=>this._toggleRole(s.id)}
                        >
                        <label class="form-check-label w-100" for="role-${s.id}">
                          <div class="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 class="mb-1">
                                <i class="bi bi-shield-check me-1 text-warning"></i>${s.name}
                              </h6>
                              <p class="text-muted small mb-2">${s.description}</p>
                            </div>
                            ${this.selectedRoles.includes(s.id)?t`
                              <span class="badge bg-success">
                                <i class="bi bi-check-lg"></i> Assigned
                              </span>
                            `:""}
                          </div>
                          <div class="mt-2">
                            ${this._getPermissionSummary(s.permissions)}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              `)}
            </div>

            <!-- Summary -->
            <div class="mt-4 p-3 bg-light rounded">
              <h6 class="mb-2">
                <i class="bi bi-list-check me-2"></i>Assignment Summary
              </h6>
              <p class="mb-2">
                <strong>${this.selectedRoles.length}</strong> role(s) selected
              </p>
              ${this.selectedRoles.length>0?t`
                <div class="d-flex flex-wrap gap-2">
                  ${this.selectedRoles.map(s=>{const e=this.roles.find(i=>i.id===s);return e?t`
                      <span class="badge bg-warning text-dark">
                        <i class="bi bi-shield-check me-1"></i>${e.name}
                      </span>
                    `:""})}
                </div>
              `:t`
                <p class="text-muted mb-0">No roles selected</p>
              `}
            </div>

            <!-- Action Buttons -->
            <div class="d-flex gap-2 mt-4 pt-3 border-top">
              <button 
                @click=${this._handleSave} 
                class="btn btn-warning btn-lg flex-fill" 
                ?disabled=${this.loading}
              >
                ${this.loading?t`<span class="spinner-border spinner-border-sm me-2"></span>Saving...`:t`<i class="bi bi-check-circle me-2"></i>Save Role Assignment`}
              </button>
              <button 
                type="button" 
                class="btn btn-outline-secondary btn-lg" 
                @click=${this._handleCancel}
              >
                <i class="bi bi-x-circle me-1"></i>Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `:t`
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          User not found
        </div>
      `}_getRoleColor(s){return{Admin:"warning",Manager:"primary",User:"secondary"}[s]||"secondary"}}customElements.define("user-role-assignment",d);
