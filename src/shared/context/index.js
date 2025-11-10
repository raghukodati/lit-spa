/**
 * Context API - Central export
 */

// Core context system
export { 
  Context,
  createContext, 
  defineContext,
  ContextProvider,
  ContextConsumer
} from './Context.js';

// User context
import UserContextExport, { UserContextProvider, userContextProvider } from './UserContext.js';
export { UserContextProvider, userContextProvider };
export const UserContext = UserContextExport;

// Permission context
import PermissionContextExport, { PermissionContextProvider, permissionContextProvider } from './PermissionContext.js';
export { PermissionContextProvider, permissionContextProvider };
export const PermissionContext = PermissionContextExport;

// App context
import AppContextExport, { AppContextProvider, appContextProvider } from './AppContext.js';
export { AppContextProvider, appContextProvider };
export const AppContext = AppContextExport;

/**
 * Initialize all contexts
 * Call this in app-shell.js on startup
 */
export function initializeContexts() {
  // Contexts are initialized via their singleton providers
  // This function can be extended for any startup logic
  return {
    user: userContextProvider.context,
    permission: permissionContextProvider.context,
    app: appContextProvider.context
  };
}

/**
 * Clear all contexts
 * Call this on logout
 */
export function clearAllContexts() {
  userContextProvider.clearUser();
  permissionContextProvider.clear();
  appContextProvider.clearNotifications();
}

export default {
  UserContext,
  PermissionContext,
  AppContext,
  userContextProvider,
  permissionContextProvider,
  appContextProvider,
  initializeContexts,
  clearAllContexts
};
