const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ecommerce-dashboard-Fa8Kuk81.js","assets/index-FS5dr0kl.js","assets/BaseComponent-BWzIoCRW.js","assets/product-list-YTWJPEye.js","assets/ui-table--BmqPkCM.js","assets/product-compare-C1lTG6KV.js","assets/product-form-DD7SPBfR.js","assets/product.model-uhuUaOub.js","assets/order-list-LwHZEU1W.js","assets/order-detail-CQwDRK4C.js","assets/category-list-lxotTIN0.js","assets/product.service-DQ0xnQr0.js","assets/inventory-management-BRhLnHHq.js"])))=>i.map(i=>d[i]);
import{_ as e,N as r}from"./index-FS5dr0kl.js";const t=()=>[{path:"/website/ecommerce",render:()=>(e(()=>import("./ecommerce-dashboard-Fa8Kuk81.js"),__vite__mapDeps([0,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <ecommerce-dashboard></ecommerce-dashboard>
        </route-wrapper>
      `)},{path:"/website/products",render:()=>(e(()=>import("./product-list-YTWJPEye.js"),__vite__mapDeps([3,1,2,4,5])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-list></product-list>
        </route-wrapper>
      `)},{path:"/website/products/new",render:()=>(e(()=>import("./product-form-DD7SPBfR.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `)},{path:"/website/products/edit/*",render:()=>(e(()=>import("./product-form-DD7SPBfR.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `)},{path:"/website/products/*",render:()=>(e(()=>import("./product-form-DD7SPBfR.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-detail></product-detail>
        </route-wrapper>
      `)},{path:"/website/orders",render:()=>(e(()=>import("./order-list-LwHZEU1W.js"),__vite__mapDeps([8,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <order-list></order-list>
        </route-wrapper>
      `)},{path:"/website/orders/*",render:()=>(e(()=>import("./order-detail-CQwDRK4C.js"),__vite__mapDeps([9,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <order-detail></order-detail>
        </route-wrapper>
      `)},{path:"/website/categories",render:()=>(e(()=>import("./category-list-lxotTIN0.js"),__vite__mapDeps([10,1,11,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <category-list></category-list>
        </route-wrapper>
      `)},{path:"/website/inventory",render:()=>(e(()=>import("./inventory-management-BRhLnHHq.js"),__vite__mapDeps([12,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <inventory-management></inventory-management>
        </route-wrapper>
      `)}];export{t as createCommerceRoutes,t as default};
