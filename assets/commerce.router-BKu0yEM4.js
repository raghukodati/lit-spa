const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ecommerce-dashboard-e-hDdb2Y.js","assets/index-ClUva-wm.js","assets/BaseComponent-BBuH-jbW.js","assets/product-list-CN4MQREu.js","assets/ui-table-e4ZO0Nhf.js","assets/product-compare-Cs107wSO.js","assets/product-form-BcWMPERp.js","assets/product.model-uhuUaOub.js","assets/order-list-DWPWYJF5.js","assets/order-detail-DZ4z9rOv.js","assets/category-list-BM16vvwf.js","assets/product.service-D2mQ2hSR.js","assets/inventory-management-CfuVEWBG.js"])))=>i.map(i=>d[i]);
import{_ as e,N as r}from"./index-ClUva-wm.js";const t=()=>[{path:"/website/ecommerce",render:()=>(e(()=>import("./ecommerce-dashboard-e-hDdb2Y.js"),__vite__mapDeps([0,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <ecommerce-dashboard></ecommerce-dashboard>
        </route-wrapper>
      `)},{path:"/website/products",render:()=>(e(()=>import("./product-list-CN4MQREu.js"),__vite__mapDeps([3,1,2,4,5])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-list></product-list>
        </route-wrapper>
      `)},{path:"/website/products/new",render:()=>(e(()=>import("./product-form-BcWMPERp.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `)},{path:"/website/products/edit/*",render:()=>(e(()=>import("./product-form-BcWMPERp.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `)},{path:"/website/products/*",render:()=>(e(()=>import("./product-form-BcWMPERp.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-detail></product-detail>
        </route-wrapper>
      `)},{path:"/website/orders",render:()=>(e(()=>import("./order-list-DWPWYJF5.js"),__vite__mapDeps([8,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <order-list></order-list>
        </route-wrapper>
      `)},{path:"/website/orders/*",render:()=>(e(()=>import("./order-detail-DZ4z9rOv.js"),__vite__mapDeps([9,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <order-detail></order-detail>
        </route-wrapper>
      `)},{path:"/website/categories",render:()=>(e(()=>import("./category-list-BM16vvwf.js"),__vite__mapDeps([10,1,11,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <category-list></category-list>
        </route-wrapper>
      `)},{path:"/website/inventory",render:()=>(e(()=>import("./inventory-management-CfuVEWBG.js"),__vite__mapDeps([12,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <inventory-management></inventory-management>
        </route-wrapper>
      `)}];export{t as createCommerceRoutes,t as default};
