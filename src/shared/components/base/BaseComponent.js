/**
 * Base Component - Abstract base class with ServiceProvider integration
 * Extends LitElement with provider pattern support, permission checking, and context consumption
 */

import { LitElement } from 'lit';
import { serviceProvider } from '../../../providers/ServiceProvider.js';
import { PermissionMixin } from '../../mixins/PermissionMixin.js';
import { ContextConsumer } from '../../context/Context.js';
import { UserContext, PermissionContext, AppContext } from '../../context/index.js';
// Import Lit directives for easy access in components
import { 
  repeat, 
  until, 
  classMap, 
  styleMap, 
  ref, 
  createRef,
  live,
  when,
  guard,
  ifDefined,
  cache
} from '../../directives/index.js';

// Re-export directives for convenience
export { 
  repeat, 
  until, 
  classMap, 
  styleMap, 
  ref, 
  createRef,
  live,
  when,
  guard,
  ifDefined,
  cache
};

// Create base with permission mixin and context consumer
const BaseWithMixins = ContextConsumer(PermissionMixin(LitElement));

export class BaseComponent extends BaseWithMixins {
  constructor() {
    super();
    this._services = new Map();
    this._contextValues = {};
  }

  /**
   * Get a service from the ServiceProvider
   * Services are cached per component instance
   * 
   * @param {string} serviceName - Name of the registered service
   * @returns {Promise<any>} Service instance
   * 
   * @example
   * // In your component
   * const cartService = await this.getService('cartService');
   * const cart = await cartService.getCart();
   */
  async getService(serviceName) {
    // Return cached service if available
    if (this._services.has(serviceName)) {
      return this._services.get(serviceName);
    }

    // Get service from provider and cache it
    try {
      const service = await serviceProvider.get(serviceName);
      this._services.set(serviceName, service);
      return service;
    } catch (error) {
      console.error(`BaseComponent: Failed to get service "${serviceName}"`, error);
      throw error;
    }
  }

  /**
   * Get multiple services at once
   * 
   * @param {Array<string>} serviceNames - Array of service names
   * @returns {Promise<Object>} Object with service names as keys
   * 
   * @example
   * const { cartService, orderService } = await this.getServices(['cartService', 'orderService']);
   */
  async getServices(serviceNames) {
    const services = {};
    await Promise.all(
      serviceNames.map(async (name) => {
        services[name] = await this.getService(name);
      })
    );
    return services;
  }

  /**
   * Clear cached services (useful for testing or hot reload)
   */
  clearServiceCache() {
    this._services.clear();
  }

  /**
   * Get user context
   * @returns {Object} User context value { user, isAuthenticated, isLoading, error }
   */
  get userContext() {
    if (!this._contextValues.user) {
      this._contextValues.user = this.consumeContext(UserContext, (value) => {
        this._contextValues.user = value;
      });
    }
    return this._contextValues.user;
  }

  /**
   * Get permission context
   * @returns {Object} Permission context value { ability, isInitialized, summary }
   */
  get permissionContext() {
    if (!this._contextValues.permission) {
      this._contextValues.permission = this.consumeContext(PermissionContext, (value) => {
        this._contextValues.permission = value;
      });
    }
    return this._contextValues.permission;
  }

  /**
   * Get app context
   * @returns {Object} App context value { theme, sidebarCollapsed, notifications, etc }
   */
  get appContext() {
    if (!this._contextValues.app) {
      this._contextValues.app = this.consumeContext(AppContext, (value) => {
        this._contextValues.app = value;
      });
    }
    return this._contextValues.app;
  }

  /**
   * Convenience getter for current user
   */
  get currentUser() {
    return this.userContext?.user;
  }

  /**
   * Convenience getter for authentication status
   */
  get isAuthenticated() {
    return this.userContext?.isAuthenticated || false;
  }

  /**
   * Convenience getter for current theme
   */
  get theme() {
    return this.appContext?.theme || 'light';
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Optionally clear service cache when component is removed
    // this.clearServiceCache();
  }
}

/**
 * Mixin for adding ServiceProvider support to any LitElement
 * Use this if you don't want to extend BaseComponent
 * 
 * @example
 * import { LitElement } from 'lit';
 * import { ServiceProviderMixin } from './BaseComponent.js';
 * 
 * class MyComponent extends ServiceProviderMixin(LitElement) {
 *   async loadData() {
 *     const service = await this.getService('myService');
 *   }
 * }
 */
export const ServiceProviderMixin = (superClass) => {
  return class extends superClass {
    constructor() {
      super();
      this._services = new Map();
    }

    async getService(serviceName) {
      if (this._services.has(serviceName)) {
        return this._services.get(serviceName);
      }

      const service = await serviceProvider.get(serviceName);
      this._services.set(serviceName, service);
      return service;
    }

    async getServices(serviceNames) {
      const services = {};
      await Promise.all(
        serviceNames.map(async (name) => {
          services[name] = await this.getService(name);
        })
      );
      return services;
    }

    clearServiceCache() {
      this._services.clear();
    }
  };
};
