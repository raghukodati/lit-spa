import{T as c,W as d,V as i,N as s}from"./index-DfU7H5-o.js";class o extends c{static properties={user:{type:Object},permissions:{type:Object},auditLog:{type:Array}};static styles=d`
    .demo-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .section h3 {
      margin-top: 0;
      color: #333;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }
    .permission-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-top: 15px;
    }
    .permission-item {
      padding: 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .permission-item.granted {
      background: #d4edda;
      border: 1px solid #c3e6cb;
    }
    .permission-item.denied {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
    }
    .permission-item i {
      font-size: 18px;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      margin: 2px;
    }
    .badge.scope-global { background: #dc3545; color: white; }
    .badge.scope-organization { background: #007bff; color: white; }
    .badge.scope-department { background: #17a2b8; color: white; }
    .badge.scope-team { background: #ffc107; color: black; }
    .badge.scope-own { background: #28a745; color: white; }
    .audit-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .audit-table th,
    .audit-table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }
    .audit-table th {
      background: #f8f9fa;
      font-weight: bold;
    }
    .audit-table tr:hover {
      background: #f8f9fa;
    }
    .info-card {
      background: #e7f3ff;
      border-left: 4px solid #007bff;
      padding: 15px;
      margin: 10px 0;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin: 4px;
    }
    .btn-primary { background: #007bff; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn:hover { opacity: 0.9; }
    .btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
    }
  `;constructor(){super(),this.user=null,this.permissions={},this.auditLog=[]}connectedCallback(){super.connectedCallback(),this.loadSecurityInfo()}loadSecurityInfo(){if(!i.isAuthenticated()){console.warn("Security context not initialized");return}this.user=i.getUser(),this.permissions=this.checkAllPermissions(),this.auditLog=i.getAuditLog(10)}checkAllPermissions(){const e=["User","Role","Permission","Customer","Order","Product","Incident"],n=["create","read","update","delete"],t={};return e.forEach(a=>{t[a]={},n.forEach(r=>{t[a][r]=i.can(r,a)})}),t}render(){return i.isAuthenticated()?s`
      <div class="demo-container">
        <!-- User Information -->
        <div class="section">
          <h3>👤 Current User</h3>
          <div class="info-card">
            <strong>${this.user?.name}</strong> (${this.user?.username})<br>
            Email: ${this.user?.email}<br>
            Role: ${this.user?.role}<br>
            Scope: <span class="badge scope-${this.user?.permissionScope}">${this.user?.permissionScope?.toUpperCase()}</span><br>
            MFA: ${this.user?.mfaEnabled?"✅ Enabled":"❌ Disabled"}<br>
            Organization: ${this.user?.organizationId} | Department: ${this.user?.departmentId} | Team: ${this.user?.teamId||"None"}
          </div>
        </div>

        <!-- Assigned Roles -->
        <div class="section">
          <h3>🛡️ Assigned Roles</h3>
          ${i.getRoles().map(e=>s`
            <div class="info-card">
              <strong>${e.name}</strong> - ${e.description}<br>
              <span class="badge">Priority: ${e.priority}</span>
              <span class="badge">Category: ${e.category}</span>
              <span class="badge scope-${e.dataScope}">${e.dataScope}</span>
              ${e.isSystemRole?s`<span class="badge" style="background: #6c757d; color: white;">System Role</span>`:""}
            </div>
          `)}
        </div>

        <!-- Permission Matrix -->
        <div class="section">
          <h3>🔐 Permission Matrix</h3>
          ${Object.entries(this.permissions).map(([e,n])=>s`
            <h4>${e}</h4>
            <div class="permission-grid">
              ${Object.entries(n).map(([t,a])=>s`
                <div class="permission-item ${a?"granted":"denied"}">
                  <i class="bi bi-${a?"check-circle-fill":"x-circle-fill"}"></i>
                  <span>${t.toUpperCase()}</span>
                </div>
              `)}
            </div>
          `)}
        </div>

        <!-- Security Context Features -->
        <div class="section">
          <h3>🔍 Security Features</h3>
          
          <h4>App-Level Checks</h4>
          <div class="permission-grid">
            <div class="permission-item ${i.isAdmin()?"granted":"denied"}">
              <i class="bi bi-${i.isAdmin()?"check":"x"}-circle-fill"></i>
              <span>Is Admin</span>
            </div>
            <div class="permission-item ${i.canAccessModule("admin")?"granted":"denied"}">
              <i class="bi bi-${i.canAccessModule("admin")?"check":"x"}-circle-fill"></i>
              <span>Admin Module</span>
            </div>
            <div class="permission-item ${i.canAccessModule("sales")?"granted":"denied"}">
              <i class="bi bi-${i.canAccessModule("sales")?"check":"x"}-circle-fill"></i>
              <span>Sales Module</span>
            </div>
            <div class="permission-item ${i.canAccessModule("analytics")?"granted":"denied"}">
              <i class="bi bi-${i.canAccessModule("analytics")?"check":"x"}-circle-fill"></i>
              <span>Analytics Module</span>
            </div>
          </div>

          <h4>Field-Level Permissions</h4>
          <div class="permission-grid">
            <div class="permission-item ${i.canAccessField("User","salary","read")?"granted":"denied"}">
              <i class="bi bi-${i.canAccessField("User","salary","read")?"check":"x"}-circle-fill"></i>
              <span>Read User.salary</span>
            </div>
            <div class="permission-item ${i.canAccessField("User","email","read")?"granted":"denied"}">
              <i class="bi bi-${i.canAccessField("User","email","read")?"check":"x"}-circle-fill"></i>
              <span>Read User.email</span>
            </div>
            <div class="permission-item ${i.canAccessField("Customer","creditLimit","read")?"granted":"denied"}">
              <i class="bi bi-${i.canAccessField("Customer","creditLimit","read")?"check":"x"}-circle-fill"></i>
              <span>Read Customer.creditLimit</span>
            </div>
            <div class="permission-item ${i.canAccessField("Customer","creditLimit","write")?"granted":"denied"}">
              <i class="bi bi-${i.canAccessField("Customer","creditLimit","write")?"check":"x"}-circle-fill"></i>
              <span>Write Customer.creditLimit</span>
            </div>
          </div>

          <h4>MFA Requirements</h4>
          <div class="permission-grid">
            <div class="permission-item ${i.requiresMfa("delete","User")?"denied":"granted"}">
              <i class="bi bi-shield-${i.requiresMfa("delete","User")?"lock":"check"}-fill"></i>
              <span>Delete User (${i.requiresMfa("delete","User")?"MFA Required":"No MFA"})</span>
            </div>
            <div class="permission-item ${i.requiresMfa("manage","Settings")?"denied":"granted"}">
              <i class="bi bi-shield-${i.requiresMfa("manage","Settings")?"lock":"check"}-fill"></i>
              <span>Manage Settings (${i.requiresMfa("manage","Settings")?"MFA Required":"No MFA"})</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="section">
          <h3>🎯 Action Buttons (Permission-Based)</h3>
          <button 
            class="btn btn-primary"
            ?disabled=${!i.can("create","User")}
            @click=${()=>alert("Create User")}>
            <i class="bi bi-plus-circle"></i> Create User
          </button>
          <button 
            class="btn btn-danger"
            ?disabled=${!i.can("delete","User")}
            @click=${()=>alert("Delete User (MFA Required)")}>
            <i class="bi bi-trash"></i> Delete User
          </button>
          <button 
            class="btn btn-success"
            ?disabled=${!i.can("export","Report")}
            @click=${()=>alert("Export Report")}>
            <i class="bi bi-download"></i> Export Report
          </button>
          <button 
            class="btn btn-primary"
            ?disabled=${!i.can("manage","Settings")}
            @click=${()=>alert("Manage Settings (MFA Required)")}>
            <i class="bi bi-gear"></i> System Settings
          </button>
        </div>

        <!-- Audit Log -->
        <div class="section">
          <h3>📋 Recent Audit Log</h3>
          <table class="audit-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event</th>
                <th>User</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${this.auditLog.map(e=>s`
                <tr>
                  <td>${new Date(e.timestamp).toLocaleString()}</td>
                  <td><strong>${e.event}</strong></td>
                  <td>${e.username||"System"}</td>
                  <td><small>${JSON.stringify(e.details)}</small></td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>

        <!-- Permission Summary -->
        <div class="section">
          <h3>📊 Permission Summary</h3>
          ${this.renderPermissionSummary()}
        </div>
      </div>
    `:s`
        <div class="demo-container">
          <div class="section">
            <h3>⚠️ Security Context Not Initialized</h3>
            <p>Please initialize the security context first.</p>
          </div>
        </div>
      `}renderPermissionSummary(){const e=i.getPermissionSummary();return s`
      <div class="permission-grid">
        <div class="permission-item ${e.canManageUsers?"granted":"denied"}">
          <i class="bi bi-${e.canManageUsers?"check":"x"}-circle-fill"></i>
          <span>Manage Users</span>
        </div>
        <div class="permission-item ${e.canManageRoles?"granted":"denied"}">
          <i class="bi bi-${e.canManageRoles?"check":"x"}-circle-fill"></i>
          <span>Manage Roles</span>
        </div>
        <div class="permission-item ${e.canManageCustomers?"granted":"denied"}">
          <i class="bi bi-${e.canManageCustomers?"check":"x"}-circle-fill"></i>
          <span>Manage Customers</span>
        </div>
        <div class="permission-item ${e.canManageOrders?"granted":"denied"}">
          <i class="bi bi-${e.canManageOrders?"check":"x"}-circle-fill"></i>
          <span>Manage Orders</span>
        </div>
        <div class="permission-item ${e.canManageProducts?"granted":"denied"}">
          <i class="bi bi-${e.canManageProducts?"check":"x"}-circle-fill"></i>
          <span>Manage Products</span>
        </div>
        <div class="permission-item ${e.canManageIncidents?"granted":"denied"}">
          <i class="bi bi-${e.canManageIncidents?"check":"x"}-circle-fill"></i>
          <span>Manage Incidents</span>
        </div>
        <div class="permission-item ${e.canViewReports?"granted":"denied"}">
          <i class="bi bi-${e.canViewReports?"check":"x"}-circle-fill"></i>
          <span>View Reports</span>
        </div>
        <div class="permission-item ${e.canViewAnalytics?"granted":"denied"}">
          <i class="bi bi-${e.canViewAnalytics?"check":"x"}-circle-fill"></i>
          <span>View Analytics</span>
        </div>
      </div>
    `}}customElements.define("security-demo",o);
