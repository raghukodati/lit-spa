/**
 * App Context - Manages global application state
 */

import { createContext } from './Context.js';

/**
 * App Context Definition
 */
export const AppContext = createContext('app-context', {
  theme: 'light',
  sidebarCollapsed: false,
  notifications: [],
  loading: false,
  currentModule: null,
  breadcrumbs: [],
  pageTitle: '',
  metadata: {}
});

/**
 * App Context Provider Class
 * Use this to provide app context in app root
 */
export class AppContextProvider {
  constructor() {
    this._context = AppContext;
    this._loadPersistedState();
  }

  /**
   * Get the context instance
   */
  get context() {
    return this._context;
  }

  /**
   * Load persisted state from localStorage
   */
  _loadPersistedState() {
    try {
      const savedTheme = localStorage.getItem('app-theme');
      const savedSidebarState = localStorage.getItem('sidebar-collapsed');
      
      this._context.value = {
        ...this._context.value,
        theme: savedTheme || 'light',
        sidebarCollapsed: savedSidebarState === 'true'
      };
    } catch (error) {
      console.error('Failed to load persisted app state:', error);
    }
  }

  /**
   * Set theme
   */
  setTheme(theme) {
    this._context.value = {
      ...this._context.value,
      theme
    };
    localStorage.setItem('app-theme', theme);
  }

  /**
   * Toggle theme
   */
  toggleTheme() {
    const newTheme = this._context.value.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Set sidebar collapsed state
   */
  setSidebarCollapsed(collapsed) {
    this._context.value = {
      ...this._context.value,
      sidebarCollapsed: collapsed
    };
    localStorage.setItem('sidebar-collapsed', collapsed.toString());
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar() {
    this.setSidebarCollapsed(!this._context.value.sidebarCollapsed);
  }

  /**
   * Add notification
   */
  addNotification(notification) {
    const notifications = [...this._context.value.notifications];
    notifications.push({
      id: Date.now(),
      timestamp: new Date(),
      ...notification
    });
    
    this._context.value = {
      ...this._context.value,
      notifications
    };
  }

  /**
   * Remove notification
   */
  removeNotification(id) {
    const notifications = this._context.value.notifications.filter(n => n.id !== id);
    
    this._context.value = {
      ...this._context.value,
      notifications
    };
  }

  /**
   * Clear all notifications
   */
  clearNotifications() {
    this._context.value = {
      ...this._context.value,
      notifications: []
    };
  }

  /**
   * Set loading state
   */
  setLoading(loading) {
    this._context.value = {
      ...this._context.value,
      loading
    };
  }

  /**
   * Set current module
   */
  setCurrentModule(module) {
    this._context.value = {
      ...this._context.value,
      currentModule: module
    };
  }

  /**
   * Set breadcrumbs
   */
  setBreadcrumbs(breadcrumbs) {
    this._context.value = {
      ...this._context.value,
      breadcrumbs
    };
  }

  /**
   * Set page title
   */
  setPageTitle(title) {
    this._context.value = {
      ...this._context.value,
      pageTitle: title
    };
    document.title = title;
  }

  /**
   * Set metadata
   */
  setMetadata(metadata) {
    this._context.value = {
      ...this._context.value,
      metadata: {
        ...this._context.value.metadata,
        ...metadata
      }
    };
  }

  /**
   * Reset to defaults
   */
  reset() {
    this._context.value = {
      theme: 'light',
      sidebarCollapsed: false,
      notifications: [],
      loading: false,
      currentModule: null,
      breadcrumbs: [],
      pageTitle: '',
      metadata: {}
    };
  }
}

// Singleton instance
export const appContextProvider = new AppContextProvider();

// Convenience exports
export default AppContext;
