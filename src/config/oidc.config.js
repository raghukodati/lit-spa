// OIDC Configuration
// Configure this for your identity provider (Keycloak, Auth0, Okta, etc.)

export const oidcConfig = {
  // Enable/Disable OIDC authentication
  enabled: false, // Set to true to enable OIDC
  
  // Identity Provider Settings
  authority: 'https://your-idp.example.com/realms/your-realm', // OIDC provider URL
  client_id: 'your-client-id', // Client ID from your IdP
  redirect_uri: `${window.location.origin}/callback`, // Callback URL after login
  post_logout_redirect_uri: `${window.location.origin}/`, // Redirect after logout
  
  // Response type (typically 'code' for authorization code flow)
  response_type: 'code',
  
  // Scopes to request
  scope: 'openid profile email',
  
  // Token settings
  automaticSilentRenew: true, // Auto-refresh tokens
  silent_redirect_uri: `${window.location.origin}/silent-renew.html`, // Silent renew URL
  
  // Additional settings
  loadUserInfo: true, // Load user info from UserInfo endpoint
  filterProtocolClaims: true, // Filter out OIDC protocol claims
  
  // Metadata (optional - will be auto-discovered if not provided)
  metadata: {
    // Uncomment and configure if auto-discovery doesn't work
    // issuer: 'https://your-idp.example.com/realms/your-realm',
    // authorization_endpoint: 'https://your-idp.example.com/realms/your-realm/protocol/openid-connect/auth',
    // token_endpoint: 'https://your-idp.example.com/realms/your-realm/protocol/openid-connect/token',
    // userinfo_endpoint: 'https://your-idp.example.com/realms/your-realm/protocol/openid-connect/userinfo',
    // end_session_endpoint: 'https://your-idp.example.com/realms/your-realm/protocol/openid-connect/logout',
  }
};

// Example configurations for popular providers:

// Keycloak Example:
// export const oidcConfig = {
//   enabled: true,
//   authority: 'https://keycloak.example.com/realms/my-app',
//   client_id: 'spa-client',
//   redirect_uri: `${window.location.origin}/callback`,
//   response_type: 'code',
//   scope: 'openid profile email roles',
// };

// Auth0 Example:
// export const oidcConfig = {
//   enabled: true,
//   authority: 'https://your-tenant.auth0.com',
//   client_id: 'your-auth0-client-id',
//   redirect_uri: `${window.location.origin}/callback`,
//   response_type: 'code',
//   scope: 'openid profile email',
// };

// Okta Example:
// export const oidcConfig = {
//   enabled: true,
//   authority: 'https://your-domain.okta.com/oauth2/default',
//   client_id: 'your-okta-client-id',
//   redirect_uri: `${window.location.origin}/callback`,
//   response_type: 'code',
//   scope: 'openid profile email',
// };

// Azure AD Example:
// export const oidcConfig = {
//   enabled: true,
//   authority: 'https://login.microsoftonline.com/your-tenant-id/v2.0',
//   client_id: 'your-azure-client-id',
//   redirect_uri: `${window.location.origin}/callback`,
//   response_type: 'code',
//   scope: 'openid profile email',
// };
