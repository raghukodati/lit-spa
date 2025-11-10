// OIDC Service - OpenID Connect Authentication
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { oidcConfig } from '../config/oidc.config.js';

let userManager = null;

// Initialize OIDC User Manager
export function initOidcUserManager() {
  if (!oidcConfig.enabled) {
    return null;
  }

  if (!userManager) {
    userManager = new UserManager({
      ...oidcConfig,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    });

    // Event handlers for OIDC lifecycle
    userManager.events.addUserLoaded((user) => {
      // User successfully loaded
      if (window.location.hostname === 'localhost') {
        console.log('OIDC: User loaded', user.profile.email);
      }
    });

    userManager.events.addUserUnloaded(() => {
      // User session cleared
    });

    userManager.events.addAccessTokenExpiring(() => {
      // Token will expire soon, trigger silent renewal
      oidcSilentRenew().catch(() => {});
    });

    userManager.events.addAccessTokenExpired(() => {
      // Token has expired, user needs to re-authenticate
      window.dispatchEvent(new CustomEvent('oidc-token-expired'));
    });

    userManager.events.addSilentRenewError((error) => {
      // Silent renewal failed, log only in development
      if (window.location.hostname === 'localhost') {
        console.error('OIDC: Silent renew failed', error.message);
      }
    });

    userManager.events.addUserSignedOut(() => {
      // User signed out from IdP
      window.dispatchEvent(new CustomEvent('oidc-user-signed-out'));
    });
  }

  return userManager;
}

// Get User Manager instance
export function getUserManager() {
  if (!userManager) {
    return initOidcUserManager();
  }
  return userManager;
}

// Start OIDC login flow
export async function oidcLogin() {
  const manager = getUserManager();
  if (!manager) {
    throw new Error('OIDC is not enabled');
  }
  
  await manager.signinRedirect();
}

// Handle OIDC callback after redirect
export async function oidcHandleCallback() {
  const manager = getUserManager();
  if (!manager) {
    throw new Error('OIDC is not enabled');
  }
  
  const user = await manager.signinRedirectCallback();
  return user;
}

// Get current OIDC user
export async function oidcGetUser() {
  const manager = getUserManager();
  if (!manager) {
    return null;
  }
  
  try {
    const user = await manager.getUser();
    return user;
  } catch {
    return null;
  }
}

// Logout from OIDC provider
export async function oidcLogout() {
  const manager = getUserManager();
  if (!manager) {
    return;
  }
  
  await manager.signoutRedirect();
}

// Silent token renewal
export async function oidcSilentRenew() {
  const manager = getUserManager();
  if (!manager) {
    return null;
  }
  
  const user = await manager.signinSilent();
  return user;
}

// Check if user is authenticated via OIDC
export async function oidcIsAuthenticated() {
  const user = await oidcGetUser();
  return user !== null && !user.expired;
}

// Remove OIDC user from storage (local logout only)
export async function oidcRemoveUser() {
  const manager = getUserManager();
  if (!manager) {
    return;
  }
  
  try {
    await manager.removeUser();
  } catch {
    // Ignore errors during user removal
  }
}

// Map OIDC user profile to application user format
export function mapOidcUserToAppUser(oidcUser) {
  if (!oidcUser) {
    return null;
  }

  const profile = oidcUser.profile;
  
  // Map OIDC claims to application user structure
  // Customize this based on your IdP's claim structure
  return {
    id: profile.sub || profile.user_id || profile.id,
    username: profile.preferred_username || profile.username || profile.email,
    email: profile.email,
    name: profile.name || profile.given_name + ' ' + profile.family_name,
    role: profile.role || profile.roles?.[0] || 'user',
    assignedRoles: profile.roles || profile.role ? [profile.role] : [],
    // Store original OIDC profile for reference
    oidcProfile: profile,
    // Token info
    accessToken: oidcUser.access_token,
    idToken: oidcUser.id_token,
    tokenType: oidcUser.token_type,
    expiresAt: oidcUser.expires_at,
  };
}

// Check if OIDC is enabled
export function isOidcEnabled() {
  return oidcConfig.enabled === true;
}
