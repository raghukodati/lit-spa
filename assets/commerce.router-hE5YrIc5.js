const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ecommerce-dashboard-BajgAqWJ.js","assets/index-D7HSGHDh.js","assets/BaseComponent-CD8EqlKR.js","assets/product-list-DcsHBkcq.js","assets/ui-table-CEjEWzQ5.js","assets/product-compare-CEW2r8yt.js","assets/product-form-j6deWAGs.js","assets/product.model-uhuUaOub.js","assets/order-list-Bb32h6zV.js","assets/order-detail-wB2SebuX.js","assets/category-list-CiDY3yrr.js","assets/product.service-DXYb3PKJ.js","assets/inventory-management-Duv4pQv8.js"])))=>i.map(i=>d[i]);
import{_ as e,N as r}from"./index-D7HSGHDh.js";const t=()=>[{path:"/website/ecommerce",render:()=>(e(()=>import("./ecommerce-dashboard-BajgAqWJ.js"),__vite__mapDeps([0,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <ecommerce-dashboard></ecommerce-dashboard>
        </route-wrapper>
      `)},{path:"/website/products",render:()=>(e(()=>import("./product-list-DcsHBkcq.js"),__vite__mapDeps([3,1,2,4,5])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-list></product-list>
        </route-wrapper>
      `)},{path:"/website/products/new",render:()=>(e(()=>import("./product-form-j6deWAGs.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `)},{path:"/website/products/edit/*",render:()=>(e(()=>import("./product-form-j6deWAGs.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `)},{path:"/website/products/*",render:()=>(e(()=>import("./product-form-j6deWAGs.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-detail></product-detail>
        </route-wrapper>
      `)},{path:"/website/orders",render:()=>(e(()=>import("./order-list-Bb32h6zV.js"),__vite__mapDeps([8,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <order-list></order-list>
        </route-wrapper>
      `)},{path:"/website/orders/*",render:()=>(e(()=>import("./order-detail-wB2SebuX.js"),__vite__mapDeps([9,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <order-detail></order-detail>
        </route-wrapper>
      `)},{path:"/website/categories",render:()=>(e(()=>import("./category-list-CiDY3yrr.js"),__vite__mapDeps([10,1,11,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <category-list></category-list>
        </route-wrapper>
      `)},{path:"/website/inventory",render:()=>(e(()=>import("./inventory-management-Duv4pQv8.js"),__vite__mapDeps([12,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <inventory-management></inventory-management>
        </route-wrapper>
      `)}];export{t as createCommerceRoutes,t as default};
