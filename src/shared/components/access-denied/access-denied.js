import {LitElement, html} from 'lit';

class AccessDeniedPage extends LitElement {
  createRenderRoot() { return this; }

  _goBack() {
    window.history.back();
  }

  _goHome() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    return html`
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 text-center">
            <div class="py-5">
              <div class="mb-4">
                <i class="bi bi-shield-x text-danger" style="font-size: 120px;"></i>
              </div>
              
              <h1 class="display-4 fw-bold text-danger mb-3">Access Denied</h1>
              <p class="lead text-muted mb-4">
                You don't have permission to access this page.
              </p>
              
              <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Insufficient Permissions</strong>
                <p class="mb-0 mt-2 small">
                  This page requires specific permissions that are not assigned to your role.
                  Please contact your administrator if you believe you should have access.
                </p>
              </div>

              <div class="d-flex gap-2 justify-content-center mt-4">
                <button @click=${this._goBack} class="btn btn-outline-secondary">
                  <i class="bi bi-arrow-left me-1"></i>Go Back
                </button>
                <button @click=${this._goHome} class="btn btn-primary">
                  <i class="bi bi-house me-1"></i>Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('access-denied', AccessDeniedPage);
