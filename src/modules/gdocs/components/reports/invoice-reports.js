import { LitElement, html } from 'lit';

class InvoiceReports extends LitElement {
  createRenderRoot() { return this; }

  render() {
    return html`
      <div class="container-fluid py-4">
        <h1 class="h2 mb-4">
          <i class="bi bi-bar-chart me-2"></i>Invoice Reports
        </h1>
        
        <div class="card">
          <div class="card-body">
            <p class="text-muted">Invoice reports with charts - Coming soon</p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('invoice-reports', InvoiceReports);
