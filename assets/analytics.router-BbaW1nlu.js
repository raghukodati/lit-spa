const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/module-analytics-PcVf0CcA.js","assets/index-DeW_3Z4T.js","assets/analytics.service-Cv2OmCgT.js","assets/forecast-list-DpSu_NDe.js","assets/forecast-form-YnpdwIQg.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e}from"./index-DeW_3Z4T.js";const a=()=>[{path:"/module/analytics",render:()=>(r(()=>import("./module-analytics-PcVf0CcA.js"),__vite__mapDeps([0,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <module-analytics></module-analytics>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast",render:()=>(r(()=>import("./forecast-list-DpSu_NDe.js"),__vite__mapDeps([3,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-list></forecast-list>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast/create",render:()=>(r(()=>import("./forecast-form-YnpdwIQg.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `)},{path:"/module/analytics/forecast/edit/*",render:()=>(r(()=>import("./forecast-form-YnpdwIQg.js"),__vite__mapDeps([4,1,2])),e`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `)}];export{a as createAnalyticsRoutes,a as default};
