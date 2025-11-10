const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ecommerce-dashboard-8dItnR9I.js","assets/index-DCWHXaZV.js","assets/BaseComponent-TlNBBqtl.js","assets/product-list-C78I66o0.js","assets/ui-table-8J99rBEl.js","assets/product-compare-CsOE_id-.js","assets/product-form-ChPoasYM.js","assets/product.model-uhuUaOub.js","assets/order-list-BhfbxQzE.js","assets/order-detail-BiQU_R0x.js","assets/category-list-DB12eAV0.js","assets/product.service-DLgKb1l8.js","assets/inventory-management-Dmtd2L35.js"])))=>i.map(i=>d[i]);
import{_ as e,N as r}from"./index-DCWHXaZV.js";const t=()=>[{path:"/website/ecommerce",render:()=>(e(()=>import("./ecommerce-dashboard-8dItnR9I.js"),__vite__mapDeps([0,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <ecommerce-dashboard></ecommerce-dashboard>
        </route-wrapper>
      `)},{path:"/website/products",render:()=>(e(()=>import("./product-list-C78I66o0.js"),__vite__mapDeps([3,1,2,4,5])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-list></product-list>
        </route-wrapper>
      `)},{path:"/website/products/new",render:()=>(e(()=>import("./product-form-ChPoasYM.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `)},{path:"/website/products/edit/*",render:()=>(e(()=>import("./product-form-ChPoasYM.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `)},{path:"/website/products/*",render:()=>(e(()=>import("./product-form-ChPoasYM.js"),__vite__mapDeps([6,1,2,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <product-detail></product-detail>
        </route-wrapper>
      `)},{path:"/website/orders",render:()=>(e(()=>import("./order-list-BhfbxQzE.js"),__vite__mapDeps([8,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <order-list></order-list>
        </route-wrapper>
      `)},{path:"/website/orders/*",render:()=>(e(()=>import("./order-detail-BiQU_R0x.js"),__vite__mapDeps([9,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <order-detail></order-detail>
        </route-wrapper>
      `)},{path:"/website/categories",render:()=>(e(()=>import("./category-list-DB12eAV0.js"),__vite__mapDeps([10,1,11,7])),r`
        <route-wrapper requiredModule="/module/commerce">
          <category-list></category-list>
        </route-wrapper>
      `)},{path:"/website/inventory",render:()=>(e(()=>import("./inventory-management-Dmtd2L35.js"),__vite__mapDeps([12,1,2])),r`
        <route-wrapper requiredModule="/module/commerce">
          <inventory-management></inventory-management>
        </route-wrapper>
      `)}];export{t as createCommerceRoutes,t as default};
