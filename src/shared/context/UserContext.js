/**
 * User Context - Manages authentication state across the application
 */

import { createContext } from './Context.js';
import { getCurrentUser, isAuthenticated } from '../../services/authService.js';

/**
 * User Context Definition
 */
export const UserContext = createContext('user-context', {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
});

/**
 * User Context Provider Class
 * Use this to provide user context in app root
 */
export class UserContextProvider {
  constructor() {
    this._context = UserContext;
    this._updateContext();
  }

  /**
   * Get the context instance
   */
  get context() {
    return this._context;
  }

  /**
   * Update context with current user state
   */
  _updateContext() {
    try {
      const user = getCurrentUser();
      const authenticated = isAuthenticated();
      
      this._context.value = {
        user,
        isAuthenticated: authenticated,
        isLoading: false,
        error: null
      };
    } catch (error) {
      this._context.value = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message
      };
    }
  }

  /**
   * Set user (e.g., after login)
   */
  setUser(user) {
    this._context.value = {
      ...this._context.value,
      user,
      isAuthenticated: !!user,
      error: null
    };
  }

  /**
   * Clear user (e.g., after logout)
   */
  clearUser() {
    this._context.value = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    };
  }

  /**
   * Set loading state
   */
  setLoading(isLoading) {
    this._context.value = {
      ...this._context.value,
      isLoading
    };
  }

  /**
   * Set error state
   */
  setError(error) {
    this._context.value = {
      ...this._context.value,
      error: error?.message || error,
      isLoading: false
    };
  }

  /**
   * Refresh user data
   */
  async refresh() {
    this.setLoading(true);
    try {
      this._updateContext();
    } catch (error) {
      this.setError(error);
    }
  }
}

// Singleton instance
export const userContextProvider = new UserContextProvider();

// Convenience exports
export default UserContext;
