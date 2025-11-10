const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sla-dashboard-BjvfvKGe.js","assets/index-ClUva-wm.js","assets/BaseComponent-BBuH-jbW.js","assets/incidents-list-CSsyyRp9.js","assets/ui-table-e4ZO0Nhf.js","assets/incident-form-Bp94KMo5.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e}from"./index-ClUva-wm.js";const d=()=>[{path:"/module/sla",render:()=>(r(()=>import("./sla-dashboard-BjvfvKGe.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `)},{path:"/sla/dashboard",render:()=>(r(()=>import("./sla-dashboard-BjvfvKGe.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `)},{path:"/sla/incidents",render:()=>(r(()=>import("./incidents-list-CSsyyRp9.js"),__vite__mapDeps([3,1,2,4])),e`
        <route-wrapper requiredModule="/module/sla">
          <incidents-list></incidents-list>
        </route-wrapper>
      `)},{path:"/sla/incidents/new",render:()=>(r(()=>import("./incident-form-Bp94KMo5.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `)},{path:"/sla/incidents/edit/*",render:()=>(r(()=>import("./incident-form-Bp94KMo5.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `)}];export{d as createSLARoutes,d as default};
