// API Service - Wrapper for fetch with mock delay
const MOCK_API_DELAY = 300; // Simulate network latency
const USE_MOCK_DATA = true; // Toggle between mock and real API

// Base URL for API
const API_BASE_URL = USE_MOCK_DATA 
  ? '/src/mocks'  // Local mock files
  : 'https://api.example.com/v1';  // Real API endpoint

/**
 * Generic fetch wrapper with error handling and mock delay
 */
async function apiRequest(endpoint, options = {}) {
  try {
    // Add mock delay to simulate network
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * GET request
 */
export async function get(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function post(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function put(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function del(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

/**
 * Delay utility (for non-fetch operations)
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if using mock data
 */
export function isMockMode() {
  return USE_MOCK_DATA;
}
