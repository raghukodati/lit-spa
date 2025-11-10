const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/module-analytics-ECGmsgbn.js","assets/index-DfU7H5-o.js","assets/analytics.service-24UmsJYf.js","assets/forecast-list-aZwaZtRk.js","assets/forecast-form-D8kvAh8_.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e}from"./index-DfU7H5-o.js";const a=()=>[{path:"/module/analytics",render:()=>(r(()=>import("./module-analytics-ECGmsgbn.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <module-analytics></module-analytics>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast",render:()=>(r(()=>import("./forecast-list-aZwaZtRk.js"),__vite__mapDeps([3,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-list></forecast-list>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast/create",render:()=>(r(()=>import("./forecast-form-D8kvAh8_.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast/edit/*",render:()=>(r(()=>import("./forecast-form-D8kvAh8_.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `)}];export{a as createAnalyticsRoutes,a as default};
