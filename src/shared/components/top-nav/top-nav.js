/**
 * Top Navigation Component
 * Displays top navbar with menu toggle, branding, module switcher, and user menu
 * 
 * Dispatches:
 * - Events.NAV_MENU_TOGGLE: Menu toggle clicked
 * - Events.NAV_MODULE_SWITCH: Module switched
 * - Events.AUTH_LOGOUT: Logout clicked
 */

import { LitElement, html } from 'lit';
import { eventBus, Events } from '../../../services/eventBus.js';

class TopNav extends LitElement {
  static properties = {
    currentUser: { type: Object },
    currentModule: { type: Object },
    userModules: { type: Array },
    menuPinned: { type: Boolean }
  };

  constructor() {
    super();
    this.currentUser = null;
    this.currentModule = null;
    this.userModules = [];
    this.menuPinned = false;
  }

  createRenderRoot() {
    return this;
  }

  _toggleMenu() {
    // Emit through event bus
    eventBus.emit(Events.NAV_MENU_TOGGLE, { menuPinned: this.menuPinned });
    
    // Also dispatch DOM event for backward compatibility
    this.dispatchEvent(new CustomEvent('menu-toggle', { 
      bubbles: true, 
      composed: true 
    }));
  }

  _handleModuleSwitch(moduleId) {
    // Emit through event bus
    eventBus.emit(Events.NAV_MODULE_SWITCH, { moduleId });
    
    // Also dispatch DOM event for backward compatibility
    this.dispatchEvent(new CustomEvent('module-switch', { 
      detail: { moduleId },
      bubbles: true, 
      composed: true 
    }));
  }

  _handleLogout(e) {
    e.preventDefault();
    
    // Emit through event bus
    eventBus.emit(Events.AUTH_LOGOUT, { user: this.currentUser });
    
    // Also dispatch DOM event for backward compatibility
    this.dispatchEvent(new CustomEvent('user-logout', { 
      bubbles: true, 
      composed: true 
    }));
  }

  render() {
    return html`
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div class="container-fluid">
          <!-- Menu Toggle Button -->
          <button class="btn ${this.menuPinned ? 'btn-secondary' : 'btn-light'} me-3 menu-toggle-btn" 
                  @click=${this._toggleMenu}
                  title="${this.menuPinned ? 'Menu is pinned - unpin from menu' : 'Toggle menu'}">
            <i class="bi bi-${this.menuPinned ? 'pin-fill' : 'list'} fs-4"></i>
          </button>

          <a class="navbar-brand fw-bold" href="/">
            <i class="bi bi-lightning-charge-fill me-2"></i>Lit SPA Dashboard
          </a>
          
          <!-- User Info & Logout -->
          <div class="d-flex align-items-center gap-3">
            <!-- Module Switcher -->
            ${this.userModules.length > 1 ? html`
              <div class="dropdown">
                <button class="btn btn-light dropdown-toggle" type="button" id="moduleDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-${this.currentModule?.icon} text-${this.currentModule?.color} me-1"></i>
                  ${this.currentModule?.name}
                </button>
                <ul class="dropdown-menu" aria-labelledby="moduleDropdown">
                  <li><h6 class="dropdown-header">Switch Module</h6></li>
                  <li><hr class="dropdown-divider"></li>
                  ${this.userModules.map(module => html`
                    <li>
                      <a class="dropdown-item ${module.id === this.currentModule?.id ? 'active' : ''}" 
                         href="#" 
                         @click=${(e) => { e.preventDefault(); this._handleModuleSwitch(module.id); }}>
                        <i class="bi bi-${module.icon} text-${module.color} me-2"></i>
                        ${module.name}
                        <br>
                        <small class="text-muted">${module.description}</small>
                      </a>
                    </li>
                  `)}
                </ul>
              </div>
            ` : ''}

            <!-- User Menu -->
            <div class="dropdown">
              <button class="btn btn-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle me-1"></i>
                ${this.currentUser?.name || 'User'}
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <h6 class="dropdown-header">
                    <i class="bi bi-person-badge me-1"></i>
                    ${this.currentUser?.username}
                  </h6>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <span class="dropdown-item-text">
                    <small class="text-muted">Role:</small>
                    <span class="badge bg-primary ms-1">${this.currentUser?.role}</span>
                  </span>
                </li>
                <li>
                  <span class="dropdown-item-text">
                    <small class="text-muted">${this.currentUser?.email}</small>
                  </span>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click=${this._handleLogout}>
                    <i class="bi bi-box-arrow-right me-2"></i>Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    `;
  }
}

customElements.define('top-nav', TopNav);

export default TopNav;
