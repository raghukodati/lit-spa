/**
 * Analytics Module Router Configuration
 * Unified routes with slot-based authentication and lazy loading
 */

import { html } from 'lit';
import '../../../shared/components/route-wrapper/route-wrapper.js';

/**
 * Create Analytics routes with slot-based authentication and lazy loading
 * @returns {Array} Analytics route configuration
 */
export const createAnalyticsRoutes = () => [
  {
    path: '/module/analytics',
    render: () => {
      import('@modules/analytics/components/dashboard/module-analytics.js');
      return html`
        <route-wrapper requiredModule="/module/analytics">
          <module-analytics></module-analytics>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/module/analytics/forecast',
    render: () => {
      import('@modules/analytics/components/forecast/forecast-list.js');
      return html`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-list></forecast-list>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/module/analytics/forecast/create',
    render: () => {
      import('@modules/analytics/components/forecast/forecast-form.js');
      return html`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/module/analytics/forecast/edit/*',
    render: () => {
      import('@modules/analytics/components/forecast/forecast-form.js');
      return html`
        <route-wrapper requiredModule="/module/analytics">
          <forecast-form></forecast-form>
        </route-wrapper>
      `;
    }
  }
];

export default createAnalyticsRoutes;
