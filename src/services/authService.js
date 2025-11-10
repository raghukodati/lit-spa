// Authentication Service
import { get, isMockMode } from './api.js';
import { 
  isOidcEnabled, 
  oidcLogin, 
  oidcGetUser, 
  oidcLogout,
  oidcIsAuthenticated,
  oidcRemoveUser,
  mapOidcUserToAppUser,
  initOidcUserManager
} from './oidcService.js';

// Authentication constants
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

// Cache for auth users
let authUsersCache = null;

// Load auth users from API/mock
async function loadAuthUsers() {
  if (!authUsersCache) {
    authUsersCache = await get('/authUsers.json');
  }
  return authUsersCache;
}

// Generate mock JWT token
function generateToken(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

// Parse JWT token
function parseToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    // Check if token is expired
    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export async function login(username, password) {
  // Check if OIDC is enabled
  if (isOidcEnabled()) {
    // Redirect to OIDC provider for authentication
    await oidcLogin();
    // This will redirect, so code below won't execute
    return;
  }
  
  // Mock authentication fallback
  // Load auth users from API
  const authUsers = await loadAuthUsers();
  const authUser = authUsers.find(u => u.username === username && u.password === password);
  if (!authUser) {
    throw new Error('Invalid username or password');
  }
  
  // Try to get assigned roles from users array if exists
  const { getUsers } = await import('../modules/admin/services/user.service.js');
  const users = await getUsers();
  const userFromDb = users.find(u => u.id === authUser.id);
  const assignedRoles = userFromDb?.assignedRoles || [];
  
  const token = generateToken(authUser);
  const userData = {
    id: authUser.id,
    username: authUser.username,
    email: authUser.email,
    role: authUser.role,
    name: authUser.name,
    assignedRoles: assignedRoles,
  };
  
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
  
  // Initialize permission cache with users and roles
  const { getRoles } = await import('../modules/admin/services/role.service.js');
  const { initializePermissionCache } = await import('./casl-permission.service.js');
  const roles = await getRoles();
  await initializePermissionCache(users, roles);
  
  return { token, user: userData };
}

export async function logout() {
  // Clear impersonation state if active
  try {
    localStorage.removeItem('impersonation_state');
  } catch (e) {
    // Ignore errors
  }

  // Check if OIDC is enabled
  if (isOidcEnabled()) {
    // Remove local user data first
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    // Then logout from OIDC provider (will redirect)
    await oidcLogout();
    return;
  }
  
  // Mock authentication fallback
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getCurrentUser() {
  // Check if impersonating - import dynamically to avoid circular dependency
  try {
    const impersonationKey = 'impersonation_state';
    const impersonationState = localStorage.getItem(impersonationKey);
    if (impersonationState) {
      const state = JSON.parse(impersonationState);
      if (state.isImpersonating && state.impersonatedUser) {
        return state.impersonatedUser;
      }
    }
  } catch (e) {
    // Ignore impersonation errors, fall through to normal user
  }

  // Return normal user
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

// Get current user (async version for OIDC)
export async function getCurrentUserAsync() {
  // Check if OIDC is enabled
  if (isOidcEnabled()) {
    const oidcUser = await oidcGetUser();
    if (oidcUser && !oidcUser.expired) {
      return mapOidcUserToAppUser(oidcUser);
    }
    return null;
  }
  
  // Fallback to sync method for mock auth
  return getCurrentUser();
}

export function isAuthenticated() {
  const token = getAuthToken();
  if (!token) return false;
  
  const payload = parseToken(token);
  return payload !== null;
}

// Async version of isAuthenticated for OIDC
export async function isAuthenticatedAsync() {
  // Check if OIDC is enabled
  if (isOidcEnabled()) {
    return await oidcIsAuthenticated();
  }
  
  // Fallback to sync method for mock auth
  return isAuthenticated();
}

export function checkAuth() {
  if (!isAuthenticated()) {
    return false;
  }
  return true;
}

// Initialize authentication (OIDC or mock)
export async function initAuth() {
  if (isOidcEnabled()) {
    // Initialize OIDC
    initOidcUserManager();
    
    // Check if user is already authenticated
    const oidcUser = await oidcGetUser();
    if (oidcUser && !oidcUser.expired) {
      // Store user in localStorage for sync access
      const appUser = mapOidcUserToAppUser(oidcUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(appUser));
      localStorage.setItem(AUTH_TOKEN_KEY, oidcUser.access_token);
      return appUser;
    }
  }
  
  return getCurrentUser();
}
