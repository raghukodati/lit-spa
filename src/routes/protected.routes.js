/**
 * Protected Routes - Authentication Required
 * Common protected routes that don't belong to a specific module
 */

import { html } from 'lit';

export const protectedRoutes = [
  {
    path: '/',
    render: () => html`
      <route-wrapper>
        <home-page></home-page>
      </route-wrapper>
    `
  }
];

export default protectedRoutes;
