const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sla-dashboard-BT6WCe1W.js","assets/index-DeW_3Z4T.js","assets/BaseComponent-RCMQUWYM.js","assets/incidents-list-ClOijFdh.js","assets/ui-table-Dq9ttfAp.js","assets/incident-form-BEvVyVt2.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e}from"./index-DeW_3Z4T.js";const d=()=>[{path:"/module/sla",render:()=>(r(()=>import("./sla-dashboard-BT6WCe1W.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `)},{path:"/sla/dashboard",render:()=>(r(()=>import("./sla-dashboard-BT6WCe1W.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `)},{path:"/sla/incidents",render:()=>(r(()=>import("./incidents-list-ClOijFdh.js"),__vite__mapDeps([3,1,2,4])),e`
        <route-wrapper requiredModule="/module/sla">
          <incidents-list></incidents-list>
        </route-wrapper>
      `)},{path:"/sla/incidents/new",render:()=>(r(()=>import("./incident-form-BEvVyVt2.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `)},{path:"/sla/incidents/edit/*",render:()=>(r(()=>import("./incident-form-BEvVyVt2.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `)}];export{d as createSLARoutes,d as default};
