/**
 * Centralized Authentication State Manager
 * Single source of truth for auth state, shared across all components
 */

import { isAuthenticated, getCurrentUser, canAccessRoute } from './dataService.js';

class AuthState {
  constructor() {
    this._authenticated = false;
    this._user = null;
    this._lastCheck = 0;
    this._checkInterval = 1000; // Cache for 1 second
    this._listeners = new Set();
    
    // Initialize on creation
    this._updateState();
    
    // Listen for auth events
    window.addEventListener('user-logged-in', () => this._updateState());
    window.addEventListener('user-logged-out', () => this._updateState());
    window.addEventListener('oidc-token-expired', () => this._updateState());
  }

  /**
   * Get current authentication status (cached)
   */
  get authenticated() {
    this._checkCache();
    return this._authenticated;
  }

  /**
   * Get current user (cached)
   */
  get user() {
    this._checkCache();
    return this._user;
  }

  /**
   * Check if user can access a route/module
   */
  canAccess(route) {
    this._checkCache();
    if (!this._authenticated) return false;
    return canAccessRoute(route, this._user);
  }

  /**
   * Force refresh of auth state
   */
  refresh() {
    this._updateState();
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(callback) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  /**
   * Check if cache is still valid, update if needed
   */
  _checkCache() {
    const now = Date.now();
    if (now - this._lastCheck > this._checkInterval) {
      this._updateState();
    }
  }

  /**
   * Update authentication state
   */
  _updateState() {
    const wasAuthenticated = this._authenticated;
    const oldUser = this._user;

    this._authenticated = isAuthenticated();
    this._user = this._authenticated ? getCurrentUser() : null;
    this._lastCheck = Date.now();

    // Notify listeners if state changed
    if (wasAuthenticated !== this._authenticated || oldUser !== this._user) {
      this._notifyListeners();
    }
  }

  /**
   * Notify all subscribers of state change
   */
  _notifyListeners() {
    this._listeners.forEach(callback => {
      try {
        callback({
          authenticated: this._authenticated,
          user: this._user
        });
      } catch (error) {
        console.error('Error in auth state listener:', error);
      }
    });
  }
}

// Export singleton instance
export const authState = new AuthState();

export default authState;
