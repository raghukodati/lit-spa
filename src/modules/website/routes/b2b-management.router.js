/**
 * B2B Management Router Configuration (Admin/Internal B2B Features)
 * Unified routes with slot-based authentication
 */

import { html } from 'lit';
import '../../../shared/components/route-wrapper/route-wrapper.js';

/**
 * Create B2B Management routes with slot-based authentication
 * @returns {Array} B2B Management route configuration
 */
export const createB2BManagementRoutes = () => [
  {
    path: '/website/b2b',
    render: () => {
      import('@modules/website/components/b2b/dashboard/b2b-dashboard.js');
      return html`<route-wrapper requiredModule="/module/commerce"><b2b-dashboard></b2b-dashboard></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/companies',
    render: () => {
      import('@modules/companies/company-list.js');
      return html`<route-wrapper requiredModule="/module/commerce"><company-list></company-list></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/companies/new',
    render: () => {
      import('@modules/companies/company-form.js');
      return html`<route-wrapper requiredModule="/module/commerce"><company-form></company-form></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/companies/edit/*',
    render: () => {
      import('@modules/companies/company-form.js');
      return html`<route-wrapper requiredModule="/module/commerce"><company-form></company-form></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/companies/*',
    render: () => {
      import('@modules/companies/company-detail.js');
      return html`<route-wrapper requiredModule="/module/commerce"><company-detail></company-detail></route-wrapper>`;
    }
  },
  // Top-level Companies routes (separate module path)
  {
    path: '/companies',
    render: () => {
      import('@modules/companies/company-list.js');
      return html`<route-wrapper requiredModule="/module/commerce"><company-list></company-list></route-wrapper>`;
    }
  },
  {
    path: '/companies/new',
    render: () => {
      import('@modules/companies/company-form.js');
      return html`<route-wrapper requiredModule="/module/commerce"><company-form></company-form></route-wrapper>`;
    }
  },
  {
    path: '/companies/edit/*',
    render: () => {
      import('@modules/companies/company-form.js');
      return html`<route-wrapper requiredModule="/module/commerce"><company-form></company-form></route-wrapper>`;
    }
  },
  {
    path: '/companies/*',
    render: () => {
      import('@modules/companies/company-detail.js');
      return html`<route-wrapper requiredModule="/module/commerce"><company-detail></company-detail></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/quotes',
    render: () => {
      import('@modules/website/components/b2b/quotes/quote-list.js');
      return html`<route-wrapper requiredModule="/module/commerce"><quote-list></quote-list></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/quotes/new',
    render: () => {
      import('@modules/website/components/b2b/quotes/quote-form.js');
      return html`<route-wrapper requiredModule="/module/commerce"><quote-form></quote-form></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/quotes/edit/*',
    render: () => {
      import('@modules/website/components/b2b/quotes/quote-form.js');
      return html`<route-wrapper requiredModule="/module/commerce"><quote-form></quote-form></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/quotes/*',
    render: () => {
      import('@modules/website/components/b2b/quotes/quote-detail.js');
      return html`<route-wrapper requiredModule="/module/commerce"><quote-detail></quote-detail></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/pricelists',
    render: () => {
      import('@modules/website/components/b2b/pricelists/pricelist-list.js');
      return html`<route-wrapper requiredModule="/module/commerce"><pricelist-list></pricelist-list></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/pricelists/new',
    render: () => {
      import('@modules/website/components/b2b/pricelists/pricelist-form.js');
      return html`<route-wrapper requiredModule="/module/commerce"><pricelist-form></pricelist-form></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/pricelists/edit/*',
    render: () => {
      import('@modules/website/components/b2b/pricelists/pricelist-form.js');
      return html`<route-wrapper requiredModule="/module/commerce"><pricelist-form></pricelist-form></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/contracts',
    render: () => {
      import('@modules/website/components/b2b/contracts/contract-list.js');
      return html`<route-wrapper requiredModule="/module/commerce"><contract-list></contract-list></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/contracts/new',
    render: () => {
      import('@modules/website/components/b2b/contracts/contract-form.js');
      return html`<route-wrapper requiredModule="/module/commerce"><contract-form></contract-form></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/contracts/edit/*',
    render: () => {
      import('@modules/website/components/b2b/contracts/contract-form.js');
      return html`<route-wrapper requiredModule="/module/commerce"><contract-form></contract-form></route-wrapper>`;
    }
  },
  {
    path: '/website/b2b/purchase-orders',
    render: () => {
      import('@modules/website/components/b2b/purchase-orders/po-list.js');
      return html`<route-wrapper requiredModule="/module/commerce"><po-list></po-list></route-wrapper>`;
    }
  }
];

export default createB2BManagementRoutes;
