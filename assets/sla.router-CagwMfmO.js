const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sla-dashboard-CALMS_gL.js","assets/index-DCWHXaZV.js","assets/BaseComponent-TlNBBqtl.js","assets/incidents-list-JrQyoa-w.js","assets/ui-table-8J99rBEl.js","assets/incident-form-DmZ5OG9m.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e}from"./index-DCWHXaZV.js";const d=()=>[{path:"/module/sla",render:()=>(r(()=>import("./sla-dashboard-CALMS_gL.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `)},{path:"/sla/dashboard",render:()=>(r(()=>import("./sla-dashboard-CALMS_gL.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `)},{path:"/sla/incidents",render:()=>(r(()=>import("./incidents-list-JrQyoa-w.js"),__vite__mapDeps([3,1,2,4])),e`
        <route-wrapper requiredModule="/module/sla">
          <incidents-list></incidents-list>
        </route-wrapper>
      `)},{path:"/sla/incidents/new",render:()=>(r(()=>import("./incident-form-DmZ5OG9m.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `)},{path:"/sla/incidents/edit/*",render:()=>(r(()=>import("./incident-form-DmZ5OG9m.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `)}];export{d as createSLARoutes,d as default};
