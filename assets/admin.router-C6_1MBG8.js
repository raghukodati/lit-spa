const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/admin-dashboard-B18UhWZu.js","assets/index-tL1z1sM1.js","assets/BaseComponent-D2jDfeym.js","assets/user-management-Dw81aF2g.js","assets/user-form-BXoCmV95.js","assets/user-role-assignment-BYNqZnhX.js","assets/user-impersonation-Bey36tDP.js","assets/role-management-CrO5rxHs.js","assets/role-form-DUABUNnA.js","assets/role-permissions-view-vWCHOn43.js","assets/permissions-DYe9rPVQ.js","assets/permission-browser-BNRBaJSy.js","assets/audit-log-viewer-D6wTfXg5.js","assets/security-settings-CnAu-zdw.js","assets/user-activity-monitor-CUQBCLtI.js","assets/session-management-D_OvGl2g.js","assets/security-demo-Bjv7UuVX.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e,O as t,z as u}from"./index-tL1z1sM1.js";function s(){if(!t.authenticated)return console.warn("❌ Admin route access denied: Not authenticated"),!1;const i=u("admin");return i||console.warn("❌ Admin route access denied: User does not have admin module access"),i}function d(i){return()=>s()?i():e`<access-denied></access-denied>`}const n=()=>[{path:"/module/admin",render:()=>(r(()=>import("./admin-dashboard-B18UhWZu.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/admin">
          <module-admin></module-admin>
        </route-wrapper>
      `)},{path:"/users",render:()=>(r(()=>import("./user-management-Dw81aF2g.js"),__vite__mapDeps([3,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.read">
          <user-management></user-management>
        </route-wrapper>
      `)},{path:"/users/new",render:()=>(r(()=>import("./user-form-BXoCmV95.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.create">
          <user-form></user-form>
        </route-wrapper>
      `)},{path:"/users/edit/*",render:()=>(r(()=>import("./user-form-BXoCmV95.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.update">
          <user-form></user-form>
        </route-wrapper>
      `)},{path:"/users/*/assign-roles",render:()=>(r(()=>import("./user-role-assignment-BYNqZnhX.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.update">
          <user-role-assignment></user-role-assignment>
        </route-wrapper>
      `)},{path:"/users/impersonate",render:()=>(r(()=>import("./user-impersonation-Bey36tDP.js"),__vite__mapDeps([6,1])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.read">
          <div class="container-fluid py-4">
            <div class="mb-4">
              <a href="/users" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left"></i> Back to Users
              </a>
            </div>
            <user-impersonation></user-impersonation>
          </div>
        </route-wrapper>
      `)},{path:"/roles",render:()=>(r(()=>import("./role-management-CrO5rxHs.js"),__vite__mapDeps([7,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.read">
          <role-management></role-management>
        </route-wrapper>
      `)},{path:"/roles/new",render:()=>(r(()=>import("./role-form-DUABUNnA.js"),__vite__mapDeps([8,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.create">
          <role-form></role-form>
        </route-wrapper>
      `)},{path:"/roles/edit/*",render:()=>(r(()=>import("./role-form-DUABUNnA.js"),__vite__mapDeps([8,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.update">
          <role-form></role-form>
        </route-wrapper>
      `)},{path:"/roles/*/permissions",render:()=>(r(()=>import("./role-permissions-view-vWCHOn43.js"),__vite__mapDeps([9,1,2,10])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.read">
          <role-permissions-view></role-permissions-view>
        </route-wrapper>
      `)},{path:"/permissions",render:()=>(r(()=>import("./permission-browser-BNRBaJSy.js"),__vite__mapDeps([11,1,2,10])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="permissions.read">
          <permission-browser></permission-browser>
        </route-wrapper>
      `)},{path:"/permissions/catalog",render:()=>(window.history.replaceState({},"","/permissions"),window.dispatchEvent(new PopStateEvent("popstate")),e`<div></div>`)},{path:"/security/audit-log",render:()=>(r(()=>import("./audit-log-viewer-D6wTfXg5.js"),__vite__mapDeps([12,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.read">
          <audit-log-viewer></audit-log-viewer>
        </route-wrapper>
      `)},{path:"/security/settings",render:()=>(r(()=>import("./security-settings-CnAu-zdw.js"),__vite__mapDeps([13,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.manage">
          <security-settings></security-settings>
        </route-wrapper>
      `)},{path:"/security/activity",render:()=>(r(()=>import("./user-activity-monitor-CUQBCLtI.js"),__vite__mapDeps([14,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.read">
          <user-activity-monitor></user-activity-monitor>
        </route-wrapper>
      `)},{path:"/security/sessions",render:()=>(r(()=>import("./session-management-D_OvGl2g.js"),__vite__mapDeps([15,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.manage">
          <session-management></session-management>
        </route-wrapper>
      `)},{path:"/admin/security-demo",render:()=>(r(()=>import("./security-demo-Bjv7UuVX.js"),__vite__mapDeps([16,1])),e`
        <route-wrapper requiredModule="/module/admin">
          <div class="container-fluid py-4">
            <div class="mb-4">
              <a href="/module/admin" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left"></i> Back to Admin
              </a>
            </div>
            <security-demo></security-demo>
          </div>
        </route-wrapper>
      `)}].map(o=>({...o,render:d(o.render)}));export{n as createAdminRoutes,n as default};
