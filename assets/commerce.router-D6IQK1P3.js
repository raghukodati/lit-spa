const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ecommerce-dashboard-ClixVXYg.js","assets/index-DeW_3Z4T.js","assets/BaseComponent-RCMQUWYM.js","assets/product-list-P5SJQjnB.js","assets/ui-table-Dq9ttfAp.js","assets/product-compare-CzKINzfS.js","assets/product-form-BXofcmwP.js","assets/product.model-uhuUaOub.js","assets/order-list-DUeVLGAo.js","assets/order-detail-DQRUF_U-.js","assets/category-list-CG0Q6Xdb.js","assets/product.service-DrPQdxZ9.js","assets/inventory-management-Cv6PJvoW.js"])))=>i.map(i=>d[i]);
import{_ as e,N as r}from"./index-DeW_3Z4T.js";const t=()=>[{path:"/website/ecommerce",render:()=>(e(()=>import("./ecommerce-dashboard-ClixVXYg.js"),__vite__mapDeps([0,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <ecommerce-dashboard></ecommerce-dashboard>
        </route-wrapper>
      `)},{path:"/website/products",render:()=>(e(()=>import("./product-list-P5SJQjnB.js"),__vite__mapDeps([3,1,2,4,5])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-list></product-list>
        </route-wrapper>
      `)},{path:"/website/products/new",render:()=>(e(()=>import("./product-form-BXofcmwP.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `)},{path:"/website/products/edit/*",render:()=>(e(()=>import("./product-form-BXofcmwP.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `)},{path:"/website/products/*",render:()=>(e(()=>import("./product-form-BXofcmwP.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-detail></product-detail>
        </route-wrapper>
      `)},{path:"/website/orders",render:()=>(e(()=>import("./order-list-DUeVLGAo.js"),__vite__mapDeps([8,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <order-list></order-list>
        </route-wrapper>
      `)},{path:"/website/orders/*",render:()=>(e(()=>import("./order-detail-DQRUF_U-.js"),__vite__mapDeps([9,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <order-detail></order-detail>
        </route-wrapper>
      `)},{path:"/website/categories",render:()=>(e(()=>import("./category-list-CG0Q6Xdb.js"),__vite__mapDeps([10,1,11,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <category-list></category-list>
        </route-wrapper>
      `)},{path:"/website/inventory",render:()=>(e(()=>import("./inventory-management-Cv6PJvoW.js"),__vite__mapDeps([12,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <inventory-management></inventory-management>
        </route-wrapper>
      `)}];export{t as createCommerceRoutes,t as default};
