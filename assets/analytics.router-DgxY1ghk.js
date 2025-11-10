const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/module-analytics-B2AS8A9D.js","assets/index-ClUva-wm.js","assets/analytics.service-Clir5Z71.js","assets/forecast-list-Chaakass.js","assets/forecast-form-DNRrJQsm.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e}from"./index-ClUva-wm.js";const a=()=>[{path:"/module/analytics",render:()=>(r(()=>import("./module-analytics-B2AS8A9D.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <module-analytics></module-analytics>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast",render:()=>(r(()=>import("./forecast-list-Chaakass.js"),__vite__mapDeps([3,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-list></forecast-list>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast/create",render:()=>(r(()=>import("./forecast-form-DNRrJQsm.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast/edit/*",render:()=>(r(()=>import("./forecast-form-DNRrJQsm.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `)}];export{a as createAnalyticsRoutes,a as default};
