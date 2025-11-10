const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/inbox-dashboard-DkLjyHUu.js","assets/index-DfU7H5-o.js","assets/purchase-orders-list-Kzp3ZQbz.js","assets/analytics.service-24UmsJYf.js","assets/invoices-list-CjTsbJyI.js","assets/acknowledgements-list-O0vUNWUf.js","assets/purchase-order-form-BQT_bqIi.js","assets/invoice-form-1LDbLYdH.js","assets/acknowledgement-form-Ej-NgNmM.js","assets/outbox-dashboard-C-TN4G-P.js","assets/purchase-orders-list-BbUf2Njx.js","assets/company.service-D2dl1Zj8.js","assets/company.model-CKmygYMs.js","assets/invoices-list-D-DM9w4Z.js","assets/open-po-search-B0jga4dG.js","assets/open-invoice-search-CCqIJniY.js","assets/purchase-order-form-COc7VAAl.js","assets/invoice-form-CyyczfFn.js","assets/invoice-reports-Cxgizqmd.js","assets/open-orders-reports-Ns2clMjA.js"])))=>i.map(i=>d[i]);
import{_ as r,N as e}from"./index-DfU7H5-o.js";const d=()=>[{path:"/module/gdocs",render:()=>(r(()=>import("./inbox-dashboard-DkLjyHUu.js"),__vite__mapDeps([0,1])),window.history.replaceState({},"","/gdocs/inbox"),e`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-dashboard></inbox-dashboard>
        </route-wrapper>
      `)},{path:"/gdocs/inbox",render:()=>(r(()=>import("./inbox-dashboard-DkLjyHUu.js"),__vite__mapDeps([0,1])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-dashboard></inbox-dashboard>
        </route-wrapper>
      `)},{path:"/gdocs/inbox/purchase-orders",render:()=>(r(()=>import("./purchase-orders-list-Kzp3ZQbz.js"),__vite__mapDeps([2,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-purchase-orders-list></inbox-purchase-orders-list>
        </route-wrapper>
      `)},{path:"/gdocs/inbox/invoices",render:()=>(r(()=>import("./invoices-list-CjTsbJyI.js"),__vite__mapDeps([4,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-invoices-list></inbox-invoices-list>
        </route-wrapper>
      `)},{path:"/gdocs/inbox/acknowledgements",render:()=>(r(()=>import("./acknowledgements-list-O0vUNWUf.js"),__vite__mapDeps([5,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-acknowledgements-list></inbox-acknowledgements-list>
        </route-wrapper>
      `)},{path:"/gdocs/inbox/purchase-orders/create",render:()=>(r(()=>import("./purchase-order-form-BQT_bqIi.js"),__vite__mapDeps([6,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-purchase-order-form></inbox-purchase-order-form>
        </route-wrapper>
      `)},{path:"/gdocs/inbox/purchase-orders/edit/*",render:()=>(r(()=>import("./purchase-order-form-BQT_bqIi.js"),__vite__mapDeps([6,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-purchase-order-form></inbox-purchase-order-form>
        </route-wrapper>
      `)},{path:"/gdocs/inbox/invoices/create",render:()=>(r(()=>import("./invoice-form-1LDbLYdH.js"),__vite__mapDeps([7,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-invoice-form></inbox-invoice-form>
        </route-wrapper>
      `)},{path:"/gdocs/inbox/invoices/edit/*",render:()=>(r(()=>import("./invoice-form-1LDbLYdH.js"),__vite__mapDeps([7,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-invoice-form></inbox-invoice-form>
        </route-wrapper>
      `)},{path:"/gdocs/inbox/acknowledgements/create",render:()=>(r(()=>import("./acknowledgement-form-Ej-NgNmM.js"),__vite__mapDeps([8,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-acknowledgement-form></inbox-acknowledgement-form>
        </route-wrapper>
      `)},{path:"/gdocs/inbox/acknowledgements/edit/*",render:()=>(r(()=>import("./acknowledgement-form-Ej-NgNmM.js"),__vite__mapDeps([8,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-acknowledgement-form></inbox-acknowledgement-form>
        </route-wrapper>
      `)},{path:"/gdocs/outbox",render:()=>(r(()=>import("./outbox-dashboard-C-TN4G-P.js"),__vite__mapDeps([9,1])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-dashboard></outbox-dashboard>
        </route-wrapper>
      `)},{path:"/gdocs/outbox/purchase-orders",render:()=>(r(()=>import("./purchase-orders-list-BbUf2Njx.js"),__vite__mapDeps([10,1,11,12,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-purchase-orders-list></outbox-purchase-orders-list>
        </route-wrapper>
      `)},{path:"/gdocs/outbox/invoices",render:()=>(r(()=>import("./invoices-list-D-DM9w4Z.js"),__vite__mapDeps([13,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-invoices-list></outbox-invoices-list>
        </route-wrapper>
      `)},{path:"/gdocs/outbox/open-po-search",render:()=>(r(()=>import("./open-po-search-B0jga4dG.js"),__vite__mapDeps([14,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <open-po-search></open-po-search>
        </route-wrapper>
      `)},{path:"/gdocs/outbox/open-invoice-search",render:()=>(r(()=>import("./open-invoice-search-CCqIJniY.js"),__vite__mapDeps([15,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <open-invoice-search></open-invoice-search>
        </route-wrapper>
      `)},{path:"/gdocs/outbox/purchase-orders/create",render:()=>(r(()=>import("./purchase-order-form-COc7VAAl.js"),__vite__mapDeps([16,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-purchase-order-form></outbox-purchase-order-form>
        </route-wrapper>
      `)},{path:"/gdocs/outbox/purchase-orders/edit/*",render:()=>(r(()=>import("./purchase-order-form-COc7VAAl.js"),__vite__mapDeps([16,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-purchase-order-form></outbox-purchase-order-form>
        </route-wrapper>
      `)},{path:"/gdocs/outbox/invoices/create",render:()=>(r(()=>import("./invoice-form-CyyczfFn.js"),__vite__mapDeps([17,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-invoice-form></outbox-invoice-form>
        </route-wrapper>
      `)},{path:"/gdocs/outbox/invoices/edit/*",render:()=>(r(()=>import("./invoice-form-CyyczfFn.js"),__vite__mapDeps([17,1,3])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-invoice-form></outbox-invoice-form>
        </route-wrapper>
      `)},{path:"/gdocs/reports/invoices",render:()=>(r(()=>import("./invoice-reports-Cxgizqmd.js"),__vite__mapDeps([18,1])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <invoice-reports></invoice-reports>
        </route-wrapper>
      `)},{path:"/gdocs/reports/open-orders",render:()=>(r(()=>import("./open-orders-reports-Ns2clMjA.js"),__vite__mapDeps([19,1])),e`
        <route-wrapper requiredModule="/module/gdocs">
          <open-orders-reports></open-orders-reports>
        </route-wrapper>
      `)}];export{d as createGDocsRoutes,d as default};
