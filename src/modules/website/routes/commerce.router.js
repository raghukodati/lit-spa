/**
 * Commerce Module Router Configuration (B2C E-commerce)
 * Unified routes with slot-based authentication
 */

import { html } from 'lit';
import '../../../shared/components/route-wrapper/route-wrapper.js';

/**
 * Create Commerce routes with slot-based authentication
 * @returns {Array} Commerce route configuration
 */
export const createCommerceRoutes = () => [
  {
    path: '/website/ecommerce',
    render: () => {
      import('@modules/website/components/dashboard/ecommerce-dashboard.js');
      return html`
        <route-wrapper requiredModule="/module/commerce">
          <ecommerce-dashboard></ecommerce-dashboard>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/website/products',
    render: () => {
      import('@modules/website/components/products/product-list.js');
      return html`
        <route-wrapper requiredModule="/module/commerce">
          <product-list></product-list>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/website/products/new',
    render: () => {
      import('@modules/website/components/products/product-form.js');
      return html`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/website/products/edit/*',
    render: () => {
      import('@modules/website/components/products/product-form.js');
      return html`
        <route-wrapper requiredModule="/module/commerce">
          <product-form></product-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/website/products/*',
    render: () => {
      import('@modules/website/components/products/product-form.js');
      return html`
        <route-wrapper requiredModule="/module/commerce">
          <product-detail></product-detail>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/website/orders',
    render: () => {
      import('@modules/website/components/orders/order-list.js');
      return html`
        <route-wrapper requiredModule="/module/commerce">
          <order-list></order-list>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/website/orders/*',
    render: () => {
      import('@modules/website/components/orders/order-detail.js');
      return html`
        <route-wrapper requiredModule="/module/commerce">
          <order-detail></order-detail>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/website/cart',
    render: () => {
      import('@modules/website/components/cart/shopping-cart.js');
      return html`
        <route-wrapper requiredModule="/module/commerce">
          <shopping-cart></shopping-cart>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/website/categories',
    render: () => {
      import('@modules/website/components/categories/category-list.js');
      return html`
        <route-wrapper requiredModule="/module/commerce">
          <category-list></category-list>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/website/inventory',
    render: () => {
      import('@modules/website/components/inventory/inventory-management.js');
      return html`
        <route-wrapper requiredModule="/module/commerce">
          <inventory-management></inventory-management>
        </route-wrapper>
      `;
    }
  }
];

export default createCommerceRoutes;
