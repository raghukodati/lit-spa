/**
 * Lazy Loading Utility
 * Handles dynamic imports for route-level code splitting
 */

/**
 * Lazy load a component with dynamic import
 * @param {Function} importFn - Dynamic import function
 * @returns {Function} Component loader function
 */
export const lazyLoad = (importFn) => {
  return async () => {
    try {
      await importFn();
      return true;
    } catch (error) {
      console.error('Failed to load component:', error);
      throw error;
    }
  };
};

/**
 * Preload a component for faster subsequent loads
 * @param {Function} importFn - Dynamic import function
 */
export const preloadComponent = (importFn) => {
  // Preload in the background
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => importFn());
  } else {
    setTimeout(() => importFn(), 1);
  }
};

/**
 * Batch preload multiple components
 * @param {Array<Function>} importFns - Array of dynamic import functions
 */
export const preloadComponents = (importFns) => {
  importFns.forEach(importFn => preloadComponent(importFn));
};

export default lazyLoad;
