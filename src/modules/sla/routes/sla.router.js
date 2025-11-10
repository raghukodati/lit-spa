/**
 * SLA Module Router Configuration
 * Unified routes with slot-based authentication and lazy loading
 */

import { html } from 'lit';
import '../../../shared/components/route-wrapper/route-wrapper.js';

/**
 * Create SLA routes with slot-based authentication and lazy loading
 * @returns {Array} SLA route configuration
 */
export const createSLARoutes = () => [
  {
    path: '/module/sla',
    render: () => {
      import('@modules/sla/components/dashboard/sla-dashboard.js');
      return html`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/sla/dashboard',
    render: () => {
      import('@modules/sla/components/dashboard/sla-dashboard.js');
      return html`
        <route-wrapper requiredModule="/module/sla">
          <sla-dashboard></sla-dashboard>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/sla/incidents',
    render: () => {
      import('@modules/sla/components/incidents/incidents-list.js');
      return html`
        <route-wrapper requiredModule="/module/sla">
          <incidents-list></incidents-list>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/sla/incidents/new',
    render: () => {
      import('@modules/sla/components/incidents/incident-form.js');
      return html`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `;
    }
  },
  {
    path: '/sla/incidents/edit/*',
    render: () => {
      import('@modules/sla/components/incidents/incident-form.js');
      return html`
        <route-wrapper requiredModule="/module/sla">
          <incident-form></incident-form>
        </route-wrapper>
      `;
    }
  }
];

export default createSLARoutes;
