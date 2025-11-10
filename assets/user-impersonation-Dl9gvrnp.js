import{T as o,U as r,H as l,N as t}from"./index-DeW_3Z4T.js";class c extends o{static properties={users:{type:Array,state:!0},filteredUsers:{type:Array,state:!0},searchTerm:{type:String,state:!0},loading:{type:Boolean,state:!0},canImpersonate:{type:Boolean,state:!0}};constructor(){super(),this.users=[],this.filteredUsers=[],this.searchTerm="",this.loading=!1,this.canImpersonate=!1}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),this.canImpersonate=r.canImpersonate(),this.canImpersonate&&await this._loadUsers()}async _loadUsers(){this.loading=!0;try{const e=await l();this.users=e.map(s=>({...s,active:!0})),this.filteredUsers=[...this.users]}catch(e){console.error("Failed to load users:",e),alert("Failed to load users: "+e.message)}finally{this.loading=!1}}_handleSearch(e){if(this.searchTerm=e.target.value.toLowerCase(),!this.searchTerm){this.filteredUsers=[...this.users];return}this.filteredUsers=this.users.filter(s=>s.name.toLowerCase().includes(this.searchTerm)||s.email.toLowerCase().includes(this.searchTerm)||s.username?.toLowerCase().includes(this.searchTerm))}async _handleImpersonate(e){const s=`Are you sure you want to impersonate:

${e.name} (${e.email})?

This will allow you to see and do what this user can do.`;if(confirm(s)){this.loading=!0;try{await r.startImpersonation(e);const a=document.querySelector("#impersonationModal");if(a){const i=bootstrap.Modal.getInstance(a);i&&i.hide()}window.location.href="/"}catch(a){console.error("Failed to start impersonation:",a),alert("Failed to impersonate user: "+a.message),this.loading=!1}}}_getUserRoleNames(e){const s=JSON.parse(localStorage.getItem("roles_cache")||"[]"),a=(e.assignedRoles||[]).map(i=>s.find(n=>n.id===i)).filter(Boolean).map(i=>i.name);return a.length>0?a.join(", "):"No roles"}render(){return this.canImpersonate?this.loading&&this.users.length===0?t`
        <div class="text-center p-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading users...</p>
        </div>
      `:t`
      <div class="container-fluid">
        <div class="row mb-3">
          <div class="col">
            <h5 class="mb-0">
              <i class="bi bi-incognito me-2 text-warning"></i>
              User Impersonation
            </h5>
            <p class="text-muted small mb-0">Select a user to view the application as them</p>
          </div>
        </div>

        <!-- Search -->
        <div class="row mb-3">
          <div class="col">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search by name, email, or username..."
                .value=${this.searchTerm}
                @input=${this._handleSearch}
              />
            </div>
          </div>
        </div>

        <!-- User List -->
        <div class="row">
          <div class="col">
            ${this.filteredUsers.length===0?t`
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                ${this.searchTerm?"No users found matching your search.":"No users available."}
              </div>
            `:t`
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Roles</th>
                      <th>Status</th>
                      <th class="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.filteredUsers.map(e=>t`
                      <tr>
                        <td>
                          <div class="d-flex align-items-center gap-2">
                            <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                 style="width: 32px; height: 32px; font-size: 14px;">
                              ${e.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong>${e.name}</strong>
                              ${e.isSuperAdmin?t`
                                <span class="badge bg-danger ms-1">Super Admin</span>
                              `:""}
                            </div>
                          </div>
                        </td>
                        <td class="text-muted">${e.email}</td>
                        <td>
                          <span class="badge bg-secondary">${this._getUserRoleNames(e)}</span>
                        </td>
                        <td>
                          ${e.active?t`
                            <span class="badge bg-success">Active</span>
                          `:t`
                            <span class="badge bg-secondary">Inactive</span>
                          `}
                        </td>
                        <td class="text-end">
                          <button 
                            class="btn btn-sm btn-outline-primary"
                            @click=${()=>this._handleImpersonate(e)}
                            ?disabled=${this.loading||!e.active}>
                            <i class="bi bi-person-fill-check me-1"></i>
                            Impersonate
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

        <!-- Warning -->
        <div class="row mt-3">
          <div class="col">
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>
              <strong>Security Notice:</strong> Impersonation actions are logged. 
              You will have the same permissions and see the same data as the impersonated user.
            </div>
          </div>
        </div>
      </div>
    `:t`
        <div class="alert alert-danger">
          <i class="bi bi-shield-x me-2"></i>
          You don't have permission to impersonate users.
        </div>
      `}}customElements.define("user-impersonation",c);export{c as default};
