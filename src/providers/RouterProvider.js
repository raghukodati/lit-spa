/**
 * Router Provider - Centralized route management with lazy loading
 * Implements the Provider Pattern for route configuration
 */

class RouterProvider {
  constructor() {
    if (RouterProvider.instance) {
      return RouterProvider.instance;
    }
    
    this.routeLoaders = new Map();
    this.loadedRoutes = new Map();
    RouterProvider.instance = this;
  }

  /**
   * Register a route loader (lazy loading function)
   * @param {string} name - Route group name
   * @param {Function} loader - Function that returns route configuration
   */
  register(name, loader) {
    this.routeLoaders.set(name, loader);
  }

  /**
   * Get routes by name (loads if not already loaded)
   * @param {string} name - Route group name
   * @returns {Promise<Array>} Route configuration array
   */
  async get(name) {
    // Return cached routes if already loaded
    if (this.loadedRoutes.has(name)) {
      return this.loadedRoutes.get(name);
    }

    // Load routes if loader exists
    const loader = this.routeLoaders.get(name);
    if (!loader) {
      console.warn(`RouterProvider: No loader registered for "${name}"`);
      return [];
    }

    try {
      const routes = await loader();
      this.loadedRoutes.set(name, routes);
      return routes;
    } catch (error) {
      console.error(`RouterProvider: Failed to load routes for "${name}"`, error);
      return [];
    }
  }

  /**
   * Get multiple route groups
   * @param {Array<string>} names - Array of route group names
   * @returns {Promise<Array>} Combined routes array
   */
  async getMultiple(names) {
    const routeArrays = await Promise.all(names.map(name => this.get(name)));
    return routeArrays.flat();
  }

  /**
   * Get all registered routes
   * @returns {Promise<Array>} All routes combined
   */
  async getAll() {
    const names = Array.from(this.routeLoaders.keys());
    return this.getMultiple(names);
  }

  /**
   * Clear cached routes (useful for hot reload)
   */
  clearCache() {
    this.loadedRoutes.clear();
  }

  /**
   * Remove a route group
   */
  unregister(name) {
    this.routeLoaders.delete(name);
    this.loadedRoutes.delete(name);
  }
}

// Export singleton instance
export const routerProvider = new RouterProvider();

// Factory function for registering routes
export function registerRoutes(config) {
  Object.entries(config).forEach(([name, loader]) => {
    routerProvider.register(name, loader);
  });
}
