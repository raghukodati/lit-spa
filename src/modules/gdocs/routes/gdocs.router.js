/**
 * GDocs Module Router Configuration
 * Unified routes with slot-based authentication
 */

import { html } from 'lit';
import '../../../shared/components/route-wrapper/route-wrapper.js';

/**
 * Create GDocs routes with slot-based authentication
 * @returns {Array} GDocs route configuration
 */
export const createGDocsRoutes = () => [
  // Module redirect to Inbox
  {
    path: '/module/gdocs',
    render: () => {
      import('@modules/gdocs/components/inbox/inbox-dashboard.js');
      window.history.replaceState({}, '', '/gdocs/inbox');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-dashboard></inbox-dashboard>
        </route-wrapper>
      `;
    }
  },
  // Inbox Routes
  {
    path: '/gdocs/inbox',
    render: () => {
      import('@modules/gdocs/components/inbox/inbox-dashboard.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-dashboard></inbox-dashboard>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/inbox/purchase-orders',
    render: () => {
      import('@modules/gdocs/components/inbox/purchase-orders-list.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-purchase-orders-list></inbox-purchase-orders-list>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/inbox/invoices',
    render: () => {
      import('@modules/gdocs/components/inbox/invoices-list.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-invoices-list></inbox-invoices-list>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/inbox/acknowledgements',
    render: () => {
      import('@modules/gdocs/components/inbox/acknowledgements-list.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-acknowledgements-list></inbox-acknowledgements-list>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/inbox/purchase-orders/create',
    render: () => {
      import('@modules/gdocs/components/inbox/purchase-order-form.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-purchase-order-form></inbox-purchase-order-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/inbox/purchase-orders/edit/*',
    render: () => {
      import('@modules/gdocs/components/inbox/purchase-order-form.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-purchase-order-form></inbox-purchase-order-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/inbox/invoices/create',
    render: () => {
      import('@modules/gdocs/components/inbox/invoice-form.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-invoice-form></inbox-invoice-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/inbox/invoices/edit/*',
    render: () => {
      import('@modules/gdocs/components/inbox/invoice-form.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-invoice-form></inbox-invoice-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/inbox/acknowledgements/create',
    render: () => {
      import('@modules/gdocs/components/inbox/acknowledgement-form.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-acknowledgement-form></inbox-acknowledgement-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/inbox/acknowledgements/edit/*',
    render: () => {
      import('@modules/gdocs/components/inbox/acknowledgement-form.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <inbox-acknowledgement-form></inbox-acknowledgement-form>
        </route-wrapper>
      `;
    }
  },
  // Outbox Routes
  {
    path: '/gdocs/outbox',
    render: () => {
      import('@modules/gdocs/components/outbox/outbox-dashboard.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-dashboard></outbox-dashboard>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/outbox/purchase-orders',
    render: () => {
      import('@modules/gdocs/components/outbox/purchase-orders-list.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-purchase-orders-list></outbox-purchase-orders-list>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/outbox/invoices',
    render: () => {
      import('@modules/gdocs/components/outbox/invoices-list.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-invoices-list></outbox-invoices-list>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/outbox/open-po-search',
    render: () => {
      import('@modules/gdocs/components/outbox/open-po-search.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <open-po-search></open-po-search>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/outbox/open-invoice-search',
    render: () => {
      import('@modules/gdocs/components/outbox/open-invoice-search.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <open-invoice-search></open-invoice-search>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/outbox/purchase-orders/create',
    render: () => {
      import('@modules/gdocs/components/outbox/purchase-order-form.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-purchase-order-form></outbox-purchase-order-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/outbox/purchase-orders/edit/*',
    render: () => {
      import('@modules/gdocs/components/outbox/purchase-order-form.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-purchase-order-form></outbox-purchase-order-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/outbox/invoices/create',
    render: () => {
      import('@modules/gdocs/components/outbox/invoice-form.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-invoice-form></outbox-invoice-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/outbox/invoices/edit/*',
    render: () => {
      import('@modules/gdocs/components/outbox/invoice-form.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <outbox-invoice-form></outbox-invoice-form>
        </route-wrapper>
      `;
    }
  },
  // Reports Routes
  {
    path: '/gdocs/reports/invoices',
    render: () => {
      import('@modules/gdocs/components/reports/invoice-reports.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <invoice-reports></invoice-reports>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/gdocs/reports/open-orders',
    render: () => {
      import('@modules/gdocs/components/reports/open-orders-reports.js');
      return html`
        <route-wrapper requiredModule="/module/gdocs">
          <open-orders-reports></open-orders-reports>
        </route-wrapper>
      `;
    }
  }
];

export default createGDocsRoutes;
