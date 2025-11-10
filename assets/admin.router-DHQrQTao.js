const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/admin-dashboard-C-TNwL0z.js","assets/index-e1bWKrj6.js","assets/BaseComponent-C9iYdUKf.js","assets/user-management-BOsr3OvG.js","assets/user-form-TbAFidLm.js","assets/user-role-assignment-DzmOjMH8.js","assets/user-impersonation-DTepOXDp.js","assets/role-management-Cyrqw_HZ.js","assets/role-form-BIHDp364.js","assets/role-permissions-view-DcTWQkkd.js","assets/permissions-DYe9rPVQ.js","assets/permission-browser-TWZ9NKih.js","assets/audit-log-viewer-DmXiqVpD.js","assets/security-settings-Dn18WVni.js","assets/user-activity-monitor-CfhixCB3.js","assets/session-management-BomvHRPy.js","assets/security-demo-BbgA4jsu.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e,O as t,z as u}from"./index-e1bWKrj6.js";function s(){if(!t.authenticated)return console.warn("❌ Admin route access denied: Not authenticated"),!1;const i=u("admin");return i||console.warn("❌ Admin route access denied: User does not have admin module access"),i}function d(i){return()=>s()?i():e`<access-denied></access-denied>`}const n=()=>[{path:"/module/admin",render:()=>(r(()=>import("./admin-dashboard-C-TNwL0z.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/admin">
          <module-admin></module-admin>
        </route-wrapper>
      `)},{path:"/users",render:()=>(r(()=>import("./user-management-BOsr3OvG.js"),__vite__mapDeps([3,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.read">
          <user-management></user-management>
        </route-wrapper>
      `)},{path:"/users/new",render:()=>(r(()=>import("./user-form-TbAFidLm.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.create">
          <user-form></user-form>
        </route-wrapper>
      `)},{path:"/users/edit/*",render:()=>(r(()=>import("./user-form-TbAFidLm.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.update">
          <user-form></user-form>
        </route-wrapper>
      `)},{path:"/users/*/assign-roles",render:()=>(r(()=>import("./user-role-assignment-DzmOjMH8.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="users.update">
          <user-role-assignment></user-role-assignment>
        </route-wrapper>
      `)},{path:"/users/impersonate",render:()=>(r(()=>import("./user-impersonation-DTepOXDp.js"),__vite__mapDeps([6,1])),e`
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
      `)},{path:"/roles",render:()=>(r(()=>import("./role-management-Cyrqw_HZ.js"),__vite__mapDeps([7,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.read">
          <role-management></role-management>
        </route-wrapper>
      `)},{path:"/roles/new",render:()=>(r(()=>import("./role-form-BIHDp364.js"),__vite__mapDeps([8,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.create">
          <role-form></role-form>
        </route-wrapper>
      `)},{path:"/roles/edit/*",render:()=>(r(()=>import("./role-form-BIHDp364.js"),__vite__mapDeps([8,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.update">
          <role-form></role-form>
        </route-wrapper>
      `)},{path:"/roles/*/permissions",render:()=>(r(()=>import("./role-permissions-view-DcTWQkkd.js"),__vite__mapDeps([9,1,2,10])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="roles.read">
          <role-permissions-view></role-permissions-view>
        </route-wrapper>
      `)},{path:"/permissions",render:()=>(r(()=>import("./permission-browser-TWZ9NKih.js"),__vite__mapDeps([11,1,2,10])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="permissions.read">
          <permission-browser></permission-browser>
        </route-wrapper>
      `)},{path:"/permissions/catalog",render:()=>(window.history.replaceState({},"","/permissions"),window.dispatchEvent(new PopStateEvent("popstate")),e`<div></div>`)},{path:"/security/audit-log",render:()=>(r(()=>import("./audit-log-viewer-DmXiqVpD.js"),__vite__mapDeps([12,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.read">
          <audit-log-viewer></audit-log-viewer>
        </route-wrapper>
      `)},{path:"/security/settings",render:()=>(r(()=>import("./security-settings-Dn18WVni.js"),__vite__mapDeps([13,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.manage">
          <security-settings></security-settings>
        </route-wrapper>
      `)},{path:"/security/activity",render:()=>(r(()=>import("./user-activity-monitor-CfhixCB3.js"),__vite__mapDeps([14,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.read">
          <user-activity-monitor></user-activity-monitor>
        </route-wrapper>
      `)},{path:"/security/sessions",render:()=>(r(()=>import("./session-management-BomvHRPy.js"),__vite__mapDeps([15,1,2])),e`
        <route-wrapper requiredModule="/module/admin" requiredPermission="security.manage">
          <session-management></session-management>
        </route-wrapper>
      `)},{path:"/admin/security-demo",render:()=>(r(()=>import("./security-demo-BbgA4jsu.js"),__vite__mapDeps([16,1])),e`
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
