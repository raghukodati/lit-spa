const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/module-analytics-7vRhNkR0.js","assets/index-FS5dr0kl.js","assets/analytics.service-CR6gsSiL.js","assets/forecast-list-B63yhD1M.js","assets/forecast-form-CfISQW2H.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e}from"./index-FS5dr0kl.js";const a=()=>[{path:"/module/analytics",render:()=>(r(()=>import("./module-analytics-7vRhNkR0.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <module-analytics></module-analytics>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast",render:()=>(r(()=>import("./forecast-list-B63yhD1M.js"),__vite__mapDeps([3,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-list></forecast-list>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast/create",render:()=>(r(()=>import("./forecast-form-CfISQW2H.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast/edit/*",render:()=>(r(()=>import("./forecast-form-CfISQW2H.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `)}];export{a as createAnalyticsRoutes,a as default};
