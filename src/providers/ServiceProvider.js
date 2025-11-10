/**
 * Service Provider - Dependency Injection container for services
 * Implements the Provider Pattern with singleton management
 */

class ServiceProvider {
  constructor() {
    if (ServiceProvider.instance) {
      return ServiceProvider.instance;
    }
    
    this.services = new Map();
    this.singletons = new Map();
    this.factories = new Map();
    ServiceProvider.instance = this;
  }

  /**
   * Register a singleton service
   * @param {string} name - Service name
   * @param {Function|Object} service - Service class or instance
   */
  singleton(name, service) {
    this.services.set(name, {
      type: 'singleton',
      value: service
    });
  }

  /**
   * Register a factory (creates new instance each time)
   * @param {string} name - Service name
   * @param {Function} factory - Factory function
   */
  factory(name, factory) {
    this.services.set(name, {
      type: 'factory',
      value: factory
    });
  }

  /**
   * Register a lazy-loaded service
   * @param {string} name - Service name
   * @param {Function} loader - Async loader function
   */
  lazy(name, loader) {
    this.services.set(name, {
      type: 'lazy',
      value: loader
    });
  }

  /**
   * Get a service by name
   * @param {string} name - Service name
   * @returns {Promise<any>} Service instance
   */
  async get(name) {
    const service = this.services.get(name);
    
    if (!service) {
      throw new Error(`ServiceProvider: Service "${name}" not registered`);
    }

    switch (service.type) {
      case 'singleton':
        return this._resolveSingleton(name, service);
      
      case 'factory':
        return service.value();
      
      case 'lazy':
        return this._resolveLazy(name, service);
      
      default:
        throw new Error(`ServiceProvider: Unknown service type "${service.type}"`);
    }
  }

  /**
   * Resolve singleton (create once, reuse)
   */
  async _resolveSingleton(name, service) {
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    const instance = typeof service.value === 'function' 
      ? new service.value() 
      : service.value;
    
    this.singletons.set(name, instance);
    return instance;
  }

  /**
   * Resolve lazy-loaded service
   */
  async _resolveLazy(name, service) {
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    const loaded = await service.value();
    const instance = loaded.default || loaded;
    this.singletons.set(name, instance);
    return instance;
  }

  /**
   * Check if service exists
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * Remove a service
   */
  remove(name) {
    this.services.delete(name);
    this.singletons.delete(name);
  }

  /**
   * Clear all services
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
  }

  /**
   * Get all registered service names
   */
  getRegistered() {
    return Array.from(this.services.keys());
  }
}

// Export singleton instance
export const serviceProvider = new ServiceProvider();

// Convenience function for batch registration
export function registerServices(config) {
  Object.entries(config).forEach(([name, service]) => {
    if (service.type === 'singleton') {
      serviceProvider.singleton(name, service.value);
    } else if (service.type === 'factory') {
      serviceProvider.factory(name, service.value);
    } else if (service.type === 'lazy') {
      serviceProvider.lazy(name, service.value);
    }
  });
}
