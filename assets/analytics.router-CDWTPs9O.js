const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/module-analytics-BA3EjHWo.js","assets/index-DZz2m7sH.js","assets/analytics.service-O2YxAu-9.js","assets/forecast-list-I9lLKCgA.js","assets/forecast-form-49DMa-eh.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e}from"./index-DZz2m7sH.js";const a=()=>[{path:"/module/analytics",render:()=>(r(()=>import("./module-analytics-BA3EjHWo.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <module-analytics></module-analytics>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast",render:()=>(r(()=>import("./forecast-list-I9lLKCgA.js"),__vite__mapDeps([3,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-list></forecast-list>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast/create",render:()=>(r(()=>import("./forecast-form-49DMa-eh.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast/edit/*",render:()=>(r(()=>import("./forecast-form-49DMa-eh.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `)}];export{a as createAnalyticsRoutes,a as default};
