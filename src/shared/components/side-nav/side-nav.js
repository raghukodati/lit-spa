/**
 * Side Navigation Component
 * Reusable navigation menu for the application
 */

import { LitElement, html } from 'lit';
import menuConfig from './menu-config.json';
import { hasPermission } from '@services/casl-permission.service.js';
import { impersonationService } from '@services/impersonation.service.js';

class SideNav extends LitElement {
  static properties = {
    menuOpen: { type: Boolean },
    menuPinned: { type: Boolean },
    menuFilter: { type: String },
    expandedModules: { type: Object },
    userModules: { type: Array },
    currentPath: { type: String }
  };

  static menuConfig = menuConfig;

  constructor() {
    super();
    // Listen for route changes
    this._handleRouteChange = this._handleRouteChange.bind(this);
    this._handleLinkClick = this._handleLinkClick.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    // Listen for browser back/forward
    window.addEventListener('popstate', this._handleRouteChange);
    // Listen for link clicks within the component
    this.addEventListener('click', this._handleLinkClick);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this._handleRouteChange);
    this.removeEventListener('click', this._handleLinkClick);
  }
  
  _handleRouteChange() {
    // Force re-render to update active states
    this.requestUpdate();
  }
  
  _handleLinkClick(e) {
    // Check if clicked element is a link
    const link = e.target.closest('a[href^="/"]');
    if (link) {
      // Wait for navigation to complete, then re-render
      setTimeout(() => this.requestUpdate(), 10);
    }
  }

  createRenderRoot() {
    return this;
  }

  _toggleMenuPin() {
    this.menuPinned = !this.menuPinned;
    localStorage.setItem('menu_pinned', this.menuPinned.toString());
    this.dispatchEvent(new CustomEvent('menu-pin-changed', {
      detail: { pinned: this.menuPinned },
      bubbles: true,
      composed: true
    }));
  }

  _handleMenuFilter(e) {
    // Emit event to parent to handle filter change
    this.dispatchEvent(new CustomEvent('menu-filter-changed', {
      detail: { filter: e.target.value.toLowerCase() },
      bubbles: true,
      composed: true
    }));
  }

  _clearMenuFilter() {
    // Emit event to parent to clear filter
    this.dispatchEvent(new CustomEvent('menu-filter-cleared', {
      bubbles: true,
      composed: true
    }));
  }

  _handleMenuMouseLeave() {
    if (!this.menuPinned) {
      this.menuOpen = false;
      this.dispatchEvent(new CustomEvent('menu-close', {
        bubbles: true,
        composed: true
      }));
    }
  }

  _toggleModuleExpansion(moduleId, e) {
    e.preventDefault();
    // Emit event to parent to handle module expansion
    this.dispatchEvent(new CustomEvent('module-toggled', {
      detail: { moduleId: moduleId },
      bubbles: true,
      composed: true
    }));
  }

  _isActive(path) {
    // Check current pathname directly for accurate highlighting
    return window.location.pathname === path ? 'active' : '';
  }

  _moduleMatchesFilter(module) {
    if (!this.menuFilter) return true;
    const filter = this.menuFilter;
    
    // Check module name
    if (module.name.toLowerCase().includes(filter)) return true;
    
    // Get submenu config for this module
    const moduleConfig = SideNav.menuConfig.moduleSubmenus[module.id];
    if (!moduleConfig) return false;
    
    // Check all items and keywords in the module submenu
    const matchesKeyword = (keywords) => keywords.some(keyword => keyword.includes(filter));
    
    // Check top-level items
    if (moduleConfig.items?.some(item => matchesKeyword(item.keywords))) return true;
    
    // Check sections
    if (moduleConfig.sections) {
      for (const section of moduleConfig.sections) {
        if (matchesKeyword(section.keywords)) return true;
        if (section.items.some(item => matchesKeyword(item.keywords))) return true;
      }
    }
    
    return false;
  }

  render() {
    if (!this.menuOpen && !this.menuPinned) {
      return html``;
    }

    return html`
      <div class="top-menu-popover ${this.menuPinned ? 'menu-pinned' : ''} bg-white border shadow-lg" 
           @mouseleave=${this._handleMenuMouseLeave}>
        <div class="p-3">
          <!-- Pin Button -->
          <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h6 class="mb-0 fw-bold">Navigation Menu</h6>
            <button class="btn btn-sm btn-outline-secondary" 
                    @click=${this._toggleMenuPin}
                    title="${this.menuPinned ? 'Unpin menu' : 'Pin menu'}">
              <i class="bi bi-${this.menuPinned ? 'pin-fill' : 'pin-angle'}"></i>
            </button>
          </div>
          
          <!-- Menu Filter -->
          <div class="mb-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-white">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Filter menu..."
                .value=${this.menuFilter}
                @input=${this._handleMenuFilter}
              />
              ${this.menuFilter ? html`
                <button class="btn btn-outline-secondary" @click=${this._clearMenuFilter} type="button">
                  <i class="bi bi-x"></i>
                </button>
              ` : ''}
            </div>
          </div>
          
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link ${this._isActive('/')}" href="/" data-title="Home">
                  <i class="bi bi-house me-2"></i><span>Home</span>
                </a>
              </li>

              <!-- Business Modules -->
              ${this.userModules.length > 0 ? html`
                ${this.userModules.filter(module => this._moduleMatchesFilter(module)).map(module => html`
                  <li class="nav-item">
                    <a class="nav-link d-flex justify-content-between align-items-center" 
                       href="#"
                       data-title="${module.name}"
                       @click=${(e) => this._toggleModuleExpansion(module.id, e)}>
                      <span>
                        <i class="bi bi-${module.icon} me-2 text-${module.color}"></i><span>${module.name}</span>
                      </span>
                      <i class="bi bi-chevron-${this.expandedModules[module.id] ? 'down' : 'right'} text-muted"></i>
                    </a>
                    
                    ${this.renderModuleSubmenu(module)}
                  </li>
                `)}
              ` : ''}
            </ul>

            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Reports</span>
            </h6>
            <ul class="nav flex-column mb-2">
              <li class="nav-item">
                <a class="nav-link" href="#" data-title="Analytics">
                  <i class="bi bi-graph-up me-2"></i><span>Analytics</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" data-title="Reports">
                  <i class="bi bi-file-earmark-text me-2"></i><span>Reports</span>
                </a>
              </li>
            </ul>
        </div>
      </div>
    `;
  }

  renderModuleSubmenu(module) {
    if (!this.expandedModules[module.id]) return '';

    const moduleConfig = SideNav.menuConfig.moduleSubmenus[module.id];
    if (!moduleConfig) return '';

    return html`
      <ul class="nav flex-column ms-3">
        ${this.renderMenuItems(moduleConfig.items || [])}
        ${moduleConfig.sections ? moduleConfig.sections.map(section => this.renderSection(section)) : ''}
      </ul>
    `;
  }

  renderSection(section) {
    // Check if any item in the section matches the filter
    const sectionVisible = !this.menuFilter || 
      section.keywords.some(kw => kw.includes(this.menuFilter)) ||
      section.items.some(item => item.keywords.some(kw => kw.includes(this.menuFilter)));

    if (!sectionVisible) return '';

    return html`
      <li class="nav-item">
        <hr class="my-2 text-muted">
        <div class="text-muted small px-3 mb-1">${section.title}</div>
      </li>
      ${this.renderMenuItems(section.items)}
    `;
  }

  renderMenuItems(items) {
    return items.map(item => {
      // Check if item matches filter
      const itemVisible = !this.menuFilter || 
        item.keywords.some(kw => kw.includes(this.menuFilter));

      if (!itemVisible) return '';

      // Special check for impersonation - must be able to impersonate
      if (item.id === 'impersonate') {
        try {
          const canImpersonate = impersonationService.canImpersonate();
          if (!canImpersonate) {
            console.log('🎭 Hiding impersonate menu - user lacks admin access or users.read permission');
            return ''; // Hide if user can't impersonate
          }
        } catch (error) {
          console.error('🎭 Error checking impersonation permission:', error);
          return ''; // Hide on error
        }
      }

      // Check permission if item has a permission requirement
      if (item.permission) {
        const [entity, action] = item.permission.split('.');
        if (entity && action && !hasPermission(entity, action)) {
          return ''; // Hide menu item if user lacks permission
        }
      }

      const iconClass = item.iconColor ? `text-${item.iconColor}` : '';
      const linkClass = item.indent ? 'ps-4' : '';

      return html`
        <li class="nav-item">
          <a class="nav-link ${this._isActive(item.path)} py-1 ${linkClass}" 
             href="${item.path}"
             data-title="${item.name}">
            <i class="bi bi-${item.icon} me-2 ${iconClass}"></i><span>${item.name}</span>
          </a>
        </li>
        ${item.children ? this.renderMenuItems(item.children) : ''}
      `;
    });
  }
}

customElements.define('side-nav', SideNav);
