/**
 * Impersonation Banner Component
 * Shows when admin is impersonating another user
 */

import { LitElement, html } from 'lit';
import { impersonationService } from '@services/impersonation.service.js';

class ImpersonationBanner extends LitElement {
  static properties = {
    isImpersonating: { type: Boolean, state: true },
    originalUser: { type: Object, state: true },
    impersonatedUser: { type: Object, state: true }
  };

  constructor() {
    super();
    this.isImpersonating = false;
    this.originalUser = null;
    this.impersonatedUser = null;
    this._unsubscribe = null;
  }

  createRenderRoot() {
    return this; // No shadow DOM
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateStatus();
    
    // Subscribe to impersonation changes
    this._unsubscribe = impersonationService.subscribe((status) => {
      this._updateStatus();
    });

    // Listen for impersonation events
    window.addEventListener('impersonation-started', this._handleImpersonationChange);
    window.addEventListener('impersonation-stopped', this._handleImpersonationChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
    window.removeEventListener('impersonation-started', this._handleImpersonationChange);
    window.removeEventListener('impersonation-stopped', this._handleImpersonationChange);
  }

  _updateStatus() {
    const status = impersonationService.getStatus();
    this.isImpersonating = status.isImpersonating;
    this.originalUser = status.originalUser;
    this.impersonatedUser = status.impersonatedUser;
  }

  _handleImpersonationChange = () => {
    this._updateStatus();
  }

  async _handleStopImpersonation() {
    if (!confirm('Stop impersonating and return to your account?')) {
      return;
    }

    try {
      await impersonationService.stopImpersonation();
    } catch (error) {
      console.error('Failed to stop impersonation:', error);
      alert('Failed to stop impersonation: ' + error.message);
    }
  }

  render() {
    if (!this.isImpersonating) {
      return html``;
    }

    return html`
      <div class="alert alert-warning mb-0 rounded-0 d-flex align-items-center justify-content-between py-2 px-3" 
           role="alert"
           style="position: sticky; top: 0; z-index: 1030; border-left: none; border-right: none;">
        <div class="d-flex align-items-center gap-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-incognito fs-5 text-warning"></i>
            <strong>Impersonation Mode</strong>
          </div>
          <div class="vr"></div>
          <div class="small">
            <span class="text-muted">You (${this.originalUser?.name}) are viewing as:</span>
            <strong class="ms-1">${this.impersonatedUser?.name}</strong>
            <span class="text-muted ms-1">(${this.impersonatedUser?.email})</span>
          </div>
        </div>
        
        <button class="btn btn-sm btn-outline-danger" @click=${this._handleStopImpersonation}>
          <i class="bi bi-x-circle me-1"></i>
          Stop Impersonation
        </button>
      </div>
    `;
  }
}

customElements.define('impersonation-banner', ImpersonationBanner);

export default ImpersonationBanner;
