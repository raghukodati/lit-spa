/**
 * Global Event Bus Service
 * Centralized event management for application-wide events
 */

class EventBus {
  constructor() {
    this._listeners = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this._listeners.has(eventName)) {
      this._listeners.set(eventName, new Set());
    }
    
    this._listeners.get(eventName).add(callback);
    
    // Return unsubscribe function
    return () => this.off(eventName, callback);
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first call)
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  once(eventName, callback) {
    const wrappedCallback = (data) => {
      callback(data);
      this.off(eventName, wrappedCallback);
    };
    
    return this.on(eventName, wrappedCallback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Callback function to remove
   */
  off(eventName, callback) {
    if (this._listeners.has(eventName)) {
      this._listeners.get(eventName).delete(callback);
      
      // Clean up empty listener sets
      if (this._listeners.get(eventName).size === 0) {
        this._listeners.delete(eventName);
      }
    }
  }

  /**
   * Emit an event
   * @param {string} eventName - Name of the event
   * @param {*} data - Data to pass to listeners
   */
  emit(eventName, data) {
    if (this._listeners.has(eventName)) {
      this._listeners.get(eventName).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for "${eventName}":`, error);
        }
      });
    }
    
    // Also emit as DOM custom event for broader compatibility
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Clear all listeners for an event
   * @param {string} eventName - Name of the event
   */
  clear(eventName) {
    if (eventName) {
      this._listeners.delete(eventName);
    } else {
      this._listeners.clear();
    }
  }

  /**
   * Get count of listeners for an event
   * @param {string} eventName - Name of the event
   * @returns {number} Number of listeners
   */
  listenerCount(eventName) {
    return this._listeners.has(eventName) ? this._listeners.get(eventName).size : 0;
  }

  /**
   * Get all event names
   * @returns {string[]} Array of event names
   */
  eventNames() {
    return Array.from(this._listeners.keys());
  }
}

// Export singleton instance
export const eventBus = new EventBus();

// Export event name constants
export const Events = {
  // Auth Events
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_TOKEN_EXPIRED: 'auth:token-expired',
  AUTH_TOKEN_REFRESHED: 'auth:token-refreshed',
  AUTH_STATE_CHANGED: 'auth:state-changed',

  // Navigation Events
  NAV_MENU_TOGGLE: 'nav:menu-toggle',
  NAV_MENU_PIN: 'nav:menu-pin',
  NAV_MENU_UNPIN: 'nav:menu-unpin',
  NAV_MODULE_SWITCH: 'nav:module-switch',
  NAV_ROUTE_CHANGED: 'nav:route-changed',

  // User Events
  USER_CREATED: 'user:created',
  USER_UPDATED: 'user:updated',
  USER_DELETED: 'user:deleted',
  USER_PROFILE_UPDATED: 'user:profile-updated',

  // Role Events
  ROLE_CREATED: 'role:created',
  ROLE_UPDATED: 'role:updated',
  ROLE_DELETED: 'role:deleted',
  ROLE_ASSIGNED: 'role:assigned',
  ROLE_REVOKED: 'role:revoked',

  // Permission Events
  PERMISSION_GRANTED: 'permission:granted',
  PERMISSION_REVOKED: 'permission:revoked',

  // Customer Events
  CUSTOMER_CREATED: 'customer:created',
  CUSTOMER_UPDATED: 'customer:updated',
  CUSTOMER_DELETED: 'customer:deleted',

  // Data Events
  DATA_LOADED: 'data:loaded',
  DATA_SAVED: 'data:saved',
  DATA_ERROR: 'data:error',
  DATA_REFRESHED: 'data:refreshed',

  // UI Events
  UI_LOADING_START: 'ui:loading-start',
  UI_LOADING_END: 'ui:loading-end',
  UI_NOTIFICATION: 'ui:notification',
  UI_ERROR: 'ui:error',
  UI_SUCCESS: 'ui:success',
  UI_WARNING: 'ui:warning',

  // Form Events
  FORM_SUBMIT: 'form:submit',
  FORM_CANCEL: 'form:cancel',
  FORM_RESET: 'form:reset',
  FORM_VALIDATION_ERROR: 'form:validation-error',

  // Modal Events
  MODAL_OPEN: 'modal:open',
  MODAL_CLOSE: 'modal:close',
  MODAL_CONFIRM: 'modal:confirm',
  MODAL_CANCEL: 'modal:cancel',
};

export default eventBus;
