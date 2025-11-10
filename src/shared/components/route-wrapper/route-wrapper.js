/**
 * Route Wrapper Component
 * Non-visual component that handles route-level authentication and permissions
 * Uses slots to render page content when access is granted
 */

import { LitElement, html } from 'lit';
import { authState } from '@services/authState.js';
import { hasPermission, canAccessRoute } from '@services/casl-permission.service.js';
import { hasModuleAccess } from '@services/dataService.js';

class RouteWrapper extends LitElement {
  static properties = {
    requiredModule: { type: String },
    requiredPermission: { type: String },
    permissionEntity: { type: String },
    permissionAction: { type: String },
    canAccess: { type: Boolean, state: true },
    isChecking: { type: Boolean, state: true }
  };

  constructor() {
    super();
    this.requiredModule = '';
    this.requiredPermission = '';
    this.permissionEntity = '';
    this.permissionAction = '';
    this.canAccess = false;
    this.isChecking = true; // Start in checking state
  }

  createRenderRoot() {
    return this; // No shadow DOM
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkAccess();
  }

  updated(changedProperties) {
    if (changedProperties.has('requiredModule') || 
        changedProperties.has('requiredPermission') ||
        changedProperties.has('permissionEntity') ||
        changedProperties.has('permissionAction')) {
      this._checkAccess();
    }
  }

  _checkAccess() {
    this.isChecking = true;
    
    // Check if user is authenticated
    if (!authState.authenticated) {
      this.canAccess = false;
      this.isChecking = false;
      return;
    }

    // Check module access first (if specified)
    if (this.requiredModule) {
      // Extract module ID from path like "/module/admin" -> "admin"
      const moduleId = this.requiredModule.split('/').pop();
      const hasAccess = hasModuleAccess(moduleId);
      
      if (!hasAccess) {
        this.canAccess = false;
        this.isChecking = false;
        console.warn(`❌ Access denied to module: ${this.requiredModule} (${moduleId})`);
        return;
      }
    }

    // Check permission using entity + action format
    if (this.permissionEntity && this.permissionAction) {
      this.canAccess = hasPermission(this.permissionEntity, this.permissionAction);
      this.isChecking = false;
      if (!this.canAccess) {
        console.warn(`❌ Permission denied: ${this.permissionEntity}.${this.permissionAction}`);
      }
      return;
    }

    // Check permission using dot notation (e.g., "users.read")
    if (this.requiredPermission) {
      const [entity, action] = this.requiredPermission.split('.');
      if (entity && action) {
        this.canAccess = hasPermission(entity, action);
        this.isChecking = false;
        if (!this.canAccess) {
          console.warn(`❌ Permission denied: ${this.requiredPermission}`);
        }
        return;
      }
    }

    // Check permission using route path
    if (window.location.pathname) {
      this.canAccess = canAccessRoute(window.location.pathname);
      this.isChecking = false;
      if (!this.canAccess) {
        console.warn(`❌ Access denied to route: ${window.location.pathname}`);
      }
      return;
    }

    // Default to allowing access if no specific restrictions
    this.canAccess = true;
    this.isChecking = false;
  }

  render() {
    // Block rendering while checking permissions
    if (this.isChecking) {
      return html``; // Return empty to prevent flash of content
    }

    // If can't access, show access denied message
    if (!this.canAccess) {
      return html`<access-denied></access-denied>`;
    }

    // If can access, render the slot content
    return html`<slot></slot>`;
  }
}

customElements.define('route-wrapper', RouteWrapper);

export default RouteWrapper;
