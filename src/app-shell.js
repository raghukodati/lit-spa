import {LitElement, css, html} from 'lit';
import {Router} from '@lit-labs/router';
import {getUserModules, getCurrentModule, setCurrentModule, logout, initAuth, getRoles} from './services/dataService.js';
import {authState} from './services/authState.js';
import {initializeAbilities, clearAbilities} from './services/casl-permission.service.js';
import {
  userContextProvider,
  permissionContextProvider,
  appContextProvider,
  initializeContexts
} from './shared/context/index.js';
import { initializeSecurity, clearSecurity } from './modules/admin/services/security-init.service.js';

// ============================================
// PROVIDER PATTERN - Centralized Configuration
// ============================================

// Initialize RouterProvider with all route configurations
import './config/routes.config.js';
import { routerProvider } from './providers/RouterProvider.js';

// Initialize ServiceProvider with all service registrations
import './config/services.config.js';

// ============================================
// STATIC IMPORTS (Loaded immediately)
// ============================================

// Auth Module - Required immediately for login flow
import './modules/auth/login-page.js';
import './modules/auth/oidc-callback.js';

// Core Module - Home page loaded immediately
import './modules/core/home-page.js';

// Shared Components - Used globally across all pages
import '@shared/components/access-denied/access-denied.js';
import '@shared/components/not-found/not-found.js';
import '@shared/components/side-nav/side-nav.js';
import '@shared/components/top-nav/top-nav.js';
import '@shared/components/route-wrapper/route-wrapper.js';
import '@shared/components/impersonation-banner/impersonation-banner.js';

export class AppShell extends LitElement {
  static properties = {
    currentUser: {type: Object},
    currentModule: {type: Object},
    userModules: {type: Array},
    menuOpen: {type: Boolean},
    menuPinned: {type: Boolean},
    expandedModules: {type: Object},
    menuFilter: {type: String},
  };

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.currentUser = authState.user;
    this.currentModule = getCurrentModule();
    this.userModules = getUserModules();
    this.menuOpen = false;
    this.menuPinned = localStorage.getItem('menu_pinned') === 'true';
    this.menuFilter = '';
    if (this.menuPinned) {
      this.menuOpen = true;
    }
    // Initialize expanded modules - expand the current module by default
    this.expandedModules = JSON.parse(localStorage.getItem('expanded_modules') || '{}');
    if (this.currentModule && !this.expandedModules.hasOwnProperty(this.currentModule.id)) {
      this.expandedModules[this.currentModule.id] = true;
    }
    
    // ============================================
    // ROUTER CONFIGURATION - USING PROVIDER PATTERN
    // ============================================
    
    // Initialize router with empty routes, load asynchronously
    this.router = new Router(this, []);
    this._routesReady = false;
    this._routesPromise = this._initializeRoutes();
  }

  /**
   * Initialize routes using RouterProvider (Provider Pattern)
   * Routes are loaded lazily through the provider
   */
  async _initializeRoutes() {
    try {
      // Load all routes from RouterProvider
      const routes = await routerProvider.getMultiple([
        'public',
        'protected',
        'admin',
        'customers',
        'sla',
        'sales',
        'analytics',
        'commerce',
        'b2bManagement',
        'b2bStorefront',
        'gdocs',
        'fallback'
      ]);

      // Update router with loaded routes
      this.router = new Router(this, routes);
      this._routesReady = true;
      
      // Trigger router to evaluate current URL (needed for browser refresh)
      window.dispatchEvent(new PopStateEvent('popstate'));
      
      this.requestUpdate();
      console.log('✅ Routes initialized, current path:', window.location.pathname);
    } catch (error) {
      console.error('❌ Failed to initialize routes:', error);
      this._routesReady = true; // Set to true to prevent hanging
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    
    // Wait for routes to be loaded first (critical for browser refresh)
    await this._routesPromise;
    console.log('✅ Routes ready');
    
    // Initialize contexts
    this._initializeContexts();
    console.log('✅ Contexts initialized');
    
    // Initialize authentication (OIDC or mock)
    await initAuth();
    this._checkAuth();
    
    // Initialize CASL permissions after auth
    await this._initializePermissions();
    
    this.addEventListener('click', this._handleClick.bind(this));
    window.addEventListener('popstate', this._handlePopState.bind(this));
    document.addEventListener('click', this._handleClickOutside.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleClickOutside.bind(this));
  }

  /**
   * Initialize all contexts
   */
  _initializeContexts() {
    initializeContexts();
    
    // Update app context with initial state
    appContextProvider.setCurrentModule(this.currentModule?.id || null);
  }

  _checkAuth() {
    const path = window.location.pathname;
    // Allow access to login page
    if (path === '/lit-spa/login') {
      return;
    }
    
    // Check if authenticated
    if (!authState.authenticated) {
      window.location.href = '/lit-spa/login';
      return;
    }
    
    this.currentUser = authState.user;
    
    // Update user context
    userContextProvider.setUser(authState.user);
  }

  /**
   * Initialize CASL abilities and security context with current user and roles
   */
  async _initializePermissions() {
    if (!authState.authenticated || !authState.user) {
      return;
    }
    
    try {
      // Get all roles to find user's assigned roles with permissions
      const allRoles = await getRoles();
      const userRoleIds = authState.user.assignedRoles || [];
      
      // Filter to get only user's roles with their permissions
      const userRoles = allRoles.filter(role => userRoleIds.includes(role.id));
      
      // Initialize CASL abilities
      await initializeAbilities(authState.user, userRoles);
      
      // Initialize enterprise security context
      await initializeSecurity();
      
      // Update permission context
      await permissionContextProvider.initialize(authState.user, userRoles);
      
      console.log('✅ CASL permissions initialized for:', authState.user.name);
      console.log('✅ Enterprise security context initialized');
    } catch (error) {
      console.error('❌ Failed to initialize permissions:', error);
    }
  }

  _handleLogout(e) {
    e.preventDefault();
    logout();
    clearAbilities(); // Clear CASL permissions on logout
    clearSecurity(); // Clear enterprise security context
    
    // Clear all contexts
    userContextProvider.clearUser();
    permissionContextProvider.clear();
    appContextProvider.clearNotifications();
    
    this.currentUser = null;
    window.location.href = '/lit-spa/login';
  }

  _toggleMenu() {
    // If menu is pinned, don't toggle - unpin first
    if (this.menuPinned) {
      return;
    }
    this.menuOpen = !this.menuOpen;
  }

  _toggleMenuPin() {
    this.menuPinned = !this.menuPinned;
    localStorage.setItem('menu_pinned', this.menuPinned);
    if (this.menuPinned) {
      this.menuOpen = true;
    } else {
      // When unpinning, close the menu
      this.menuOpen = false;
    }
  }

  _handleMenuMouseLeave() {
    // Handled by side-nav component now
  }
  
  _handleMenuPinChanged(e) {
    this.menuPinned = e.detail.pinned;
  }
  
  _handleMenuClose() {
    this.menuOpen = false;
  }
  
  _handleMenuFilterChanged(e) {
    this.menuFilter = e.detail.filter;
    // Auto-expand modules that have matching items
    if (this.menuFilter) {
      const newExpanded = {};
      this.userModules.forEach(module => {
        if (this._moduleMatchesFilter(module)) {
          newExpanded[module.id] = true;
        }
      });
      this.expandedModules = newExpanded;
    }
  }
  
  _handleMenuFilterCleared() {
    this.menuFilter = '';
  }
  
  _handleModuleToggled(e) {
    const moduleId = e.detail.moduleId;
    this.expandedModules = {
      ...this.expandedModules,
      [moduleId]: !this.expandedModules[moduleId]
    };
    localStorage.setItem('expanded_modules', JSON.stringify(this.expandedModules));
  }

  _handleClickOutside(e) {
    if (!this.menuPinned && this.menuOpen) {
      const menu = this.querySelector('.top-menu-popover');
      const menuButton = this.querySelector('.menu-toggle-btn');
      if (menu && !menu.contains(e.target) && !menuButton.contains(e.target)) {
        this.menuOpen = false;
      }
    }
  }

  _handleModuleSwitch(moduleId) {
    if (setCurrentModule(moduleId)) {
      this.currentModule = getCurrentModule();
      window.history.pushState({}, '', `/module/${moduleId}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  _toggleModuleExpansion(moduleId, e) {
    e.preventDefault();
    e.stopPropagation();
    this.expandedModules = {
      ...this.expandedModules,
      [moduleId]: !this.expandedModules[moduleId]
    };
    localStorage.setItem('expanded_modules', JSON.stringify(this.expandedModules));
  }

  _moduleMatchesFilter(module) {
    if (!this.menuFilter) return true;
    const filter = this.menuFilter;
    
    // Check module name
    if (module.name.toLowerCase().includes(filter)) return true;
    
    // Check submenu items based on module
    const submenuItems = {
      admin: ['dashboard', 'users', 'roles', 'permissions'],
      sla: ['dashboard', 'incidents', 'tickets', 'agreements', 'metrics', 'reports', 'escalations', 'performance'],
      sales: ['dashboard', 'orders', 'products', 'reports'],
      analytics: ['dashboard', 'forecast'],
      gdocs: ['inbox', 'outbox', 'reports', 'purchase orders', 'invoices', 'acknowledgements'],
      commerce: ['dashboard', 'products', 'orders', 'cart', 'categories', 'discounts', 'inventory', 'companies', 'quotes', 'pricelists', 'contracts', 'purchase orders', 'storefront', 'catalog', 'quick order', 'account', 'punchout', 'external suppliers'],
      customers: ['organizations', 'add organization']
    };
    
    const items = submenuItems[module.id] || [];
    return items.some(item => item.includes(filter));
  }

  _menuItemMatchesFilter(text) {
    if (!this.menuFilter) return true;
    return text.toLowerCase().includes(this.menuFilter);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
    window.removeEventListener('popstate', this._handlePopState);
  }

  _handlePopState() {
    this.requestUpdate();
  }

  _handleClick(e) {
    const anchor = e.target.closest('a');
    if (anchor && anchor.getAttribute('href')?.startsWith('/')) {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
      this.router.goto(href);
    }
  }

  render() {
    const currentPath = window.location.pathname;
    const isPublicRoute = currentPath === '/lit-spa/login' || currentPath === '/lit-spa/callback' || currentPath === '/lit-spa/access-denied';
    
    // If on public route, render without dashboard layout
    if (isPublicRoute) {
      return html`${this.router.outlet()}`;
    }

    // Check authentication before rendering layout
    if (!authState.authenticated) {
      // Not authenticated - redirect to login and show nothing
      const returnUrl = encodeURIComponent(currentPath + window.location.search);
      window.location.href = `/lit-spa/login?returnUrl=${returnUrl}`;
      return html``;
    }

    // Authenticated - render full layout
    return html`
      <!-- Top Navigation -->
      <top-nav
        .currentUser=${this.currentUser}
        .currentModule=${this.currentModule}
        .userModules=${this.userModules}
        .menuPinned=${this.menuPinned}
        @menu-toggle=${this._toggleMenu}
        @module-switch=${(e) => this._handleModuleSwitch(e.detail.moduleId)}
        @user-logout=${this._handleLogout}
      ></top-nav>

      <!-- Impersonation Banner -->
      <impersonation-banner></impersonation-banner>

      <!-- Side Navigation -->
      <side-nav
        .menuOpen=${this.menuOpen}
        .menuPinned=${this.menuPinned}
        .menuFilter=${this.menuFilter}
        .expandedModules=${this.expandedModules}
        .userModules=${this.userModules}
        @menu-pin-changed=${this._handleMenuPinChanged}
        @menu-close=${this._handleMenuClose}
        @menu-filter-changed=${this._handleMenuFilterChanged}
        @menu-filter-cleared=${this._handleMenuFilterCleared}
        @module-toggled=${this._handleModuleToggled}
      ></side-nav>

      <!-- Main Content -->
      <main class="container-fluid px-4 py-4 ${this.menuPinned ? 'content-pushed' : ''}">
        ${this.router.outlet()}
      </main>
    `;
  }

  _isActive(path) {
    return location.pathname === path ? 'active' : '';
  }
}

customElements.define('app-shell', AppShell);

