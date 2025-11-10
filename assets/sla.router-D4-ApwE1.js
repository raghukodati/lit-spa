const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/sla-dashboard-DlbthdaE.js","assets/index-DfU7H5-o.js","assets/BaseComponent-gTxbGt-p.js","assets/incidents-list-J01rjJ7t.js","assets/ui-table-Yht0ye0-.js","assets/incident-form-Dwq4VOiF.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e}from"./index-DfU7H5-o.js";const d=()=>[{path:"/module/sla",render:()=>(r(()=>import("./sla-dashboard-DlbthdaE.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `)},{path:"/sla/dashboard",render:()=>(r(()=>import("./sla-dashboard-DlbthdaE.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `)},{path:"/sla/incidents",render:()=>(r(()=>import("./incidents-list-J01rjJ7t.js"),__vite__mapDeps([3,1,2,4])),e`
        <route-wrapper requiredModule="/module/sla">
          <incidents-list></incidents-list>
        </route-wrapper>
      `)},{path:"/sla/incidents/new",render:()=>(r(()=>import("./incident-form-Dwq4VOiF.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `)},{path:"/sla/incidents/edit/*",render:()=>(r(()=>import("./incident-form-Dwq4VOiF.js"),__vite__mapDeps([5,1,2])),e`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `)}];export{d as createSLARoutes,d as default};
