/**
 * Public Routes - No Authentication Required
 * These routes are always available and loaded statically
 */

import { html } from 'lit';

export const publicRoutes = [
  {
    path: '/login',
    render: () => html`<login-page></login-page>`
  },
  {
    path: '/callback',
    render: () => html`<oidc-callback></oidc-callback>`
  },
  {
    path: '/access-denied',
    render: () => html`<access-denied></access-denied>`
  },
  {
    path: '/samples/xml-viewer',
    render: () => html`<xml-viewer-page></xml-viewer-page>`
  }
];

export default publicRoutes;
