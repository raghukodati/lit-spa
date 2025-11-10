/**
 * B2B Storefront Router Configuration (Customer Portal)
 * Unified routes with slot-based authentication
 */

import { html } from 'lit';
import '../../../shared/components/route-wrapper/route-wrapper.js';

/**
 * Create B2B Storefront routes with slot-based authentication
 * @returns {Array} B2B Storefront route configuration
 */
export const createB2BStorefrontRoutes = () => [
  {
    path: '/b2b-store',
    render: () => {
      import('@modules/website/components/b2b-storefront/dashboard/storefront-dashboard.js');
      return html`<route-wrapper requiredModule="/module/commerce"><storefront-dashboard></storefront-dashboard></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/catalog',
    render: () => {
      import('@modules/website/components/b2b-storefront/catalog/product-catalog.js');
      return html`<route-wrapper requiredModule="/module/commerce"><product-catalog></product-catalog></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/catalog/*',
    render: () => {
      import('@modules/website/components/b2b-storefront/catalog/product-catalog.js');
      return html`<route-wrapper requiredModule="/module/commerce"><product-catalog></product-catalog></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/product/*',
    render: () => {
      import('@modules/website/components/b2b-storefront/catalog/product-details.js');
      return html`<route-wrapper requiredModule="/module/commerce"><product-details></product-details></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/cart',
    render: () => {
      import('@modules/website/components/b2b-storefront/cart/shopping-cart.js');
      return html`<route-wrapper requiredModule="/module/commerce"><b2b-shopping-cart></b2b-shopping-cart></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/quick-order',
    render: () => {
      import('@modules/website/components/b2b-storefront/quick-order/quick-order.js');
      return html`<route-wrapper requiredModule="/module/commerce"><quick-order></quick-order></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/checkout',
    render: () => {
      import('@modules/website/components/b2b-storefront/checkout/checkout.js');
      return html`<route-wrapper requiredModule="/module/commerce"><checkout-component></checkout-component></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/account',
    render: () => {
      import('@modules/website/components/b2b-storefront/account/account-dashboard.js');
      return html`<route-wrapper requiredModule="/module/commerce"><account-dashboard></account-dashboard></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/account/addresses',
    render: () => {
      import('@modules/website/components/b2b-storefront/account/address-book.js');
      return html`<route-wrapper requiredModule="/module/commerce"><address-book></address-book></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/account/payment-methods',
    render: () => {
      import('@modules/website/components/b2b-storefront/account/payment-methods.js');
      return html`<route-wrapper requiredModule="/module/commerce"><payment-methods></payment-methods></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/orders',
    render: () => {
      import('@modules/website/components/b2b-storefront/orders/order-history.js');
      return html`<route-wrapper requiredModule="/module/commerce"><order-history></order-history></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/purchased-products',
    render: () => {
      import('@modules/website/components/b2b-storefront/orders/purchased-products.js');
      return html`<route-wrapper requiredModule="/module/commerce"><purchased-products></purchased-products></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/approvals',
    render: () => {
      import('@modules/website/components/b2b-storefront/approvals/approval-workflow.js');
      return html`<route-wrapper requiredModule="/module/commerce"><approval-workflow></approval-workflow></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/approvals/requests',
    render: () => {
      import('@modules/website/components/b2b-storefront/approvals/approval-request.js');
      return html`<route-wrapper requiredModule="/module/commerce"><approval-request></approval-request></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/approvals/rules',
    render: () => {
      import('@modules/website/components/b2b-storefront/approvals/approval-rules.js');
      return html`<route-wrapper requiredModule="/module/commerce"><approval-rules></approval-rules></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/keepstock',
    render: () => {
      import('@modules/website/components/b2b-storefront/keepstock/keepstock-dashboard.js');
      return html`<route-wrapper requiredModule="/module/commerce"><keepstock-dashboard></keepstock-dashboard></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/invoices',
    render: () => {
      import('@modules/website/components/b2b-storefront/account/invoice-history.js');
      return html`<route-wrapper requiredModule="/module/commerce"><invoice-history></invoice-history></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/punchout',
    render: () => {
      import('@modules/website/components/b2b-storefront/punchout/punchout-session.js');
      return html`<route-wrapper requiredModule="/module/commerce"><punchout-session></punchout-session></route-wrapper>`;
    }
  },
  {
    path: '/b2b-store/external-punchout',
    render: () => {
      import('@modules/website/components/b2b-storefront/punchout/external-punchout.js');
      return html`<route-wrapper requiredModule="/module/commerce"><external-punchout></external-punchout></route-wrapper>`;
    }
  }
];

export default createB2BStorefrontRoutes;
