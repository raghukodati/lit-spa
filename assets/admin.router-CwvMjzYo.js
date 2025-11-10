const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/admin-dashboard-BzZt1lb_.js","assets/index-ClUva-wm.js","assets/BaseComponent-BBuH-jbW.js","assets/user-management-H12HQov9.js","assets/user-form-DzgANzXY.js","assets/user-role-assignment-BbjBcjgX.js","assets/user-impersonation-DX_jqgDv.js","assets/role-management-C7wHIHv9.js","assets/role-form-B9IBBUEA.js","assets/role-permissions-view-DTAchn90.js","assets/permissions-DYe9rPVQ.js","assets/permission-browser-BuudWwaK.js","assets/audit-log-viewer-DhvsCATB.js","assets/security-settings-DVXNQpgC.js","assets/user-activity-monitor-ClfZEqGk.js","assets/session-management-B9Daz1kQ.js","assets/security-demo-BcYKZW_h.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e,O as t,z as u}from"./index-ClUva-wm.js";function s(){if(!t.authenticated)return console.warn("❌ Admin route access denied: Not authenticated"),!1;const i=u("admin");return i||console.warn("❌ Admin route access denied: User does not have admin module access"),i}function d(i){return()=>s()?i():e`<access-denied></access-denied>`}const n=()=>[{path:"/module/admin",render:()=>(r(()=>import("./admin-dashboard-BzZt1lb_.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/admin">
          <module-admin></module-admin>
        </route-wrapper>
      `)},{path:"/users",render:()=>(r(()=>import("./user-management-H12HQov9.js"),__vite__mapDeps([3,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.read">
          <user-management></user-management>
        </route-wrapper>
      `)},{path:"/users/new",render:()=>(r(()=>import("./user-form-DzgANzXY.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.create">
          <user-form></user-form>
        </route-wrapper>
      `)},{path:"/users/edit/*",render:()=>(r(()=>import("./user-form-DzgANzXY.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.update">
          <user-form></user-form>
        </route-wrapper>
      `)},{path:"/users/*/assign-roles",render:()=>(r(()=>import("./user-role-assignment-BbjBcjgX.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.update">
          <user-role-assignment></user-role-assignment>
        </route-wrapper>
      `)},{path:"/users/impersonate",render:()=>(r(()=>import("./user-impersonation-DX_jqgDv.js"),__vite__mapDeps([6,1])),e`
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
      `)},{path:"/roles",render:()=>(r(()=>import("./role-management-C7wHIHv9.js"),__vite__mapDeps([7,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.read">
          <role-management></role-management>
        </route-wrapper>
      `)},{path:"/roles/new",render:()=>(r(()=>import("./role-form-B9IBBUEA.js"),__vite__mapDeps([8,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.create">
          <role-form></role-form>
        </route-wrapper>
      `)},{path:"/roles/edit/*",render:()=>(r(()=>import("./role-form-B9IBBUEA.js"),__vite__mapDeps([8,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.update">
          <role-form></role-form>
        </route-wrapper>
      `)},{path:"/roles/*/permissions",render:()=>(r(()=>import("./role-permissions-view-DTAchn90.js"),__vite__mapDeps([9,1,2,10])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.read">
          <role-permissions-view></role-permissions-view>
        </route-wrapper>
      `)},{path:"/permissions",render:()=>(r(()=>import("./permission-browser-BuudWwaK.js"),__vite__mapDeps([11,1,2,10])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="permissions.read">
          <permission-browser></permission-browser>
        </route-wrapper>
      `)},{path:"/permissions/catalog",render:()=>(window.history.replaceState({},"","/permissions"),window.dispatchEvent(new PopStateEvent("popstate")),e`<div></div>`)},{path:"/security/audit-log",render:()=>(r(()=>import("./audit-log-viewer-DhvsCATB.js"),__vite__mapDeps([12,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.read">
          <audit-log-viewer></audit-log-viewer>
        </route-wrapper>
      `)},{path:"/security/settings",render:()=>(r(()=>import("./security-settings-DVXNQpgC.js"),__vite__mapDeps([13,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.manage">
          <security-settings></security-settings>
        </route-wrapper>
      `)},{path:"/security/activity",render:()=>(r(()=>import("./user-activity-monitor-ClfZEqGk.js"),__vite__mapDeps([14,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.read">
          <user-activity-monitor></user-activity-monitor>
        </route-wrapper>
      `)},{path:"/security/sessions",render:()=>(r(()=>import("./session-management-B9Daz1kQ.js"),__vite__mapDeps([15,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.manage">
          <session-management></session-management>
        </route-wrapper>
      `)},{path:"/admin/security-demo",render:()=>(r(()=>import("./security-demo-BcYKZW_h.js"),__vite__mapDeps([16,1])),e`
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
