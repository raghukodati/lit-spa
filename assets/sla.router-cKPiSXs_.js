const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sla-dashboard-DtUkYsf6.js","assets/index-FS5dr0kl.js","assets/BaseComponent-BWzIoCRW.js","assets/incidents-list-CUdSft0p.js","assets/ui-table--BmqPkCM.js","assets/incident-form-DZgWWvdE.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e}from"./index-FS5dr0kl.js";const d=()=>[{path:"/module/sla",render:()=>(r(()=>import("./sla-dashboard-DtUkYsf6.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `)},{path:"/sla/dashboard",render:()=>(r(()=>import("./sla-dashboard-DtUkYsf6.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `)},{path:"/sla/incidents",render:()=>(r(()=>import("./incidents-list-CUdSft0p.js"),__vite__mapDeps([3,1,2,4])),e`
        <route-wrapper requiredModule="/module/sla">
          <incidents-list></incidents-list>
        </route-wrapper>
      `)},{path:"/sla/incidents/new",render:()=>(r(()=>import("./incident-form-DZgWWvdE.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `)},{path:"/sla/incidents/edit/*",render:()=>(r(()=>import("./incident-form-DZgWWvdE.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `)}];export{d as createSLARoutes,d as default};
