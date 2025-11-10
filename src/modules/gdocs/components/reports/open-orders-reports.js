import { LitElement, html } from 'lit';

class OpenOrdersReports extends LitElement {
  createRenderRoot() { return this; }

  render() {
    return html`
      <div class="container-fluid py-4">
        <h1 class="h2 mb-4">
          <i class="bi bi-bar-chart-line me-2"></i>Open Orders Reports
        </h1>
        
        <div class="card">
          <div class="card-body">
            <p class="text-muted">Open orders reports with charts - Coming soon</p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('open-orders-reports', OpenOrdersReports);
