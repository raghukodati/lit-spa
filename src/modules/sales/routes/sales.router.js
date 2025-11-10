/**
 * Sales Module Router Configuration
 * Unified routes with slot-based authentication and lazy loading
 */

import { html } from 'lit';
import '../../../shared/components/route-wrapper/route-wrapper.js';

/**
 * Create Sales routes with slot-based authentication and lazy loading
 * @returns {Array} Sales route configuration
 */
export const createSalesRoutes = () => [
  {
    path: '/module/sales',
    render: () => {
      import('@modules/sales/components/dashboard/module-sales.js');
      return html`
        <route-wrapper requiredModule="/module/sales">
          <module-sales></module-sales>
        </route-wrapper>
      `;
    }
  }
];

export default createSalesRoutes;
