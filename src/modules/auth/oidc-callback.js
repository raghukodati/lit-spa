import { LitElement, html } from 'lit';
import { oidcHandleCallback, mapOidcUserToAppUser } from '../../services/oidcService.js';

class OidcCallbackPage extends LitElement {
  static properties = {
    loading: { type: Boolean },
    error: { type: String }
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.loading = true;
    this.error = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._handleCallback();
  }

  async _handleCallback() {
    try {
      // Handle the OIDC callback
      const oidcUser = await oidcHandleCallback();
      
      // Map OIDC user to application user format
      const appUser = mapOidcUserToAppUser(oidcUser);
      
      // Store user in localStorage for sync access
      localStorage.setItem('auth_user', JSON.stringify(appUser));
      localStorage.setItem('auth_token', oidcUser.access_token);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('OIDC callback error:', error);
      this.error = error.message || 'Authentication failed';
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="container mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6 text-center">
              <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Loading...</span>
              </div>
              <h4>Completing authentication...</h4>
              <p class="text-muted">Please wait while we sign you in.</p>
            </div>
          </div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="container mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <div class="alert alert-danger">
                <h4 class="alert-heading">
                  <i class="bi bi-exclamation-triangle me-2"></i>Authentication Failed
                </h4>
                <p>${this.error}</p>
                <hr>
                <a href="/login" class="btn btn-primary">
                  <i class="bi bi-arrow-left me-2"></i>Back to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return html``;
  }
}

customElements.define('oidc-callback', OidcCallbackPage);
