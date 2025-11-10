import{N as a}from"./index-CDXZUF87.js";import{B as d}from"./BaseComponent-tGIDWUP3.js";import{p as r}from"./permissions-DYe9rPVQ.js";class n extends d{static properties={roleId:{type:String},role:{type:Object},permissions:{type:Array},loading:{type:Boolean}};createRenderRoot(){return this}constructor(){super(),this.roleId=null,this.role=null,this.permissions=[],this.loading=!1,this._dataService=null}async connectedCallback(){super.connectedCallback();const e=window.location.pathname.match(/\/roles\/(\d+)\/permissions/);e&&(this.roleId=e[1],await this._loadData())}async _loadData(){if(!this.can("settings","read")){alert("You do not have permission to view role details"),this._handleBack();return}this.loading=!0;try{this._dataService=await this.getService("dataService"),this.role=await this._dataService.getRoleById(parseInt(this.roleId)),this.permissions=r,console.log("Loaded permissions:",this.permissions.length)}catch(s){console.error("Failed to load data:",s)}finally{this.loading=!1}}_handleBack(){window.history.pushState({},"","/roles"),window.dispatchEvent(new PopStateEvent("popstate"))}_handleEdit(){if(!this.can("settings","update")){alert("You do not have permission to edit roles");return}window.history.pushState({},"",`/roles/edit/${this.roleId}`),window.dispatchEvent(new PopStateEvent("popstate"))}_getRolePermissions(){if(!this.role?.permissions)return[];const s=[];return Object.entries(this.role.permissions).forEach(([e,i])=>{i.forEach(l=>{const t=this.permissions.filter(o=>o.entity===e&&(o.action===l||l==="manage"));s.push(...t)})}),s}_getPermissionsByModule(){const s=this._getRolePermissions(),e={};return s.forEach(i=>{e[i.module]||(e[i.module]=[]),e[i.module].push(i)}),e}_getModules(){const s=this._getPermissionsByModule();return Object.keys(s).sort()}_getLevelColor(s){return{app:"danger",module:"warning",entity:"primary",field:"info",record:"success"}[s]||"secondary"}_getRiskColor(s){return{low:"success",medium:"warning",high:"danger",critical:"dark"}[s]||"secondary"}render(){if(this.loading)return a`
        <div class="text-center p-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading role permissions...</p>
        </div>
      `;if(!this.role)return a`
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Role not found
        </div>
      `;const s=this._getRolePermissions(),e=this._getPermissionsByModule(),i=this._getModules();return a`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-shield-lock me-2"></i>Role Permissions
            </h1>
            <p class="text-muted">Viewing permissions for: <strong>${this.role.name}</strong></p>
          </div>
          <div class="d-flex gap-2">
            <button @click=${this._handleEdit} class="btn btn-primary">
              <i class="bi bi-pencil me-1"></i>Edit Role
            </button>
            <button @click=${this._handleBack} class="btn btn-secondary">
              <i class="bi bi-arrow-left me-1"></i>Back to Roles
            </button>
          </div>
        </div>

        <!-- Role Info Card -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <small class="text-muted">Role Name</small>
                <p class="mb-0 fw-bold fs-5">${this.role.name}</p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Category</small>
                <p class="mb-0">
                  <span class="badge bg-${this.role.category==="system"?"danger":"primary"}">${this.role.category}</span>
                </p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Data Scope</small>
                <p class="mb-0">
                  <span class="badge bg-info">${this.role.dataScope||"global"}</span>
                </p>
              </div>
              <div class="col-md-3">
                <small class="text-muted">Total Permissions</small>
                <p class="mb-0">
                  <span class="badge bg-success fs-6">${s.length}</span>
                </p>
              </div>
            </div>
            <hr class="my-3">
            <small class="text-muted">Description</small>
            <p class="mb-0">${this.role.description}</p>
          </div>
        </div>

        <!-- Module Statistics -->
        <div class="row mb-4">
          ${i.map(l=>a`
            <div class="col-md-3 mb-3">
              <div class="card border-primary h-100">
                <div class="card-body text-center">
                  <h6 class="text-uppercase text-muted small">${l}</h6>
                  <h3 class="mb-0 text-primary">${e[l].length}</h3>
                  <small class="text-muted">permissions</small>
                </div>
              </div>
            </div>
          `)}
        </div>

        <!-- Permissions by Module -->
        ${i.map(l=>a`
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-box me-2"></i>${l.toUpperCase()} Module Permissions
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th style="width: 25%">Permission</th>
                      <th style="width: 15%">Entity</th>
                      <th style="width: 10%">Action</th>
                      <th style="width: 10%">Level</th>
                      <th style="width: 10%">Scope</th>
                      <th style="width: 10%">Risk</th>
                      <th style="width: 20%">Requirements</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${e[l].map(t=>a`
                      <tr>
                        <td>
                          <div class="fw-bold">${t.name}</div>
                          <small class="text-muted"><code>${t.code}</code></small>
                        </td>
                        <td>
                          <span class="badge bg-secondary">${t.entity}</span>
                        </td>
                        <td>
                          <span class="badge bg-info">${t.action}</span>
                        </td>
                        <td>
                          <span class="badge bg-${this._getLevelColor(t.level)}">${t.level}</span>
                        </td>
                        <td>
                          <span class="badge bg-primary">${t.scope}</span>
                        </td>
                        <td>
                          <span class="badge bg-${this._getRiskColor(t.riskLevel)}">${t.riskLevel}</span>
                        </td>
                        <td>
                          <div class="d-flex flex-wrap gap-1">
                            ${t.requiresMfa?a`<span class="badge bg-warning" title="Requires MFA"><i class="bi bi-shield-lock"></i></span>`:""}
                            ${t.requiresApproval?a`<span class="badge bg-info" title="Requires Approval"><i class="bi bi-check-circle"></i></span>`:""}
                            ${t.auditLog?a`<span class="badge bg-secondary" title="Audit Logged"><i class="bi bi-clock-history"></i></span>`:""}
                          </div>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `)}

        <!-- Raw Role Permissions (Debug) -->
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h6 class="card-title mb-0">
              <i class="bi bi-code-square me-2"></i>Role Permission Structure
            </h6>
          </div>
          <div class="card-body">
            <pre class="mb-0 small bg-light p-3 rounded"><code>${JSON.stringify(this.role.permissions,null,2)}</code></pre>
          </div>
        </div>
      </div>
    `}}customElements.define("role-permissions-view",n);
