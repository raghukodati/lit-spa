// User Management Service
import { get, isMockMode } from '../../../services/api.js';

// Cache for users data
let usersCache = [];
let nextUserId = 7;

// Load users from API/mock
async function loadUsers() {
  if (usersCache.length === 0) {
    usersCache = await get('/users.json');
  }
  return usersCache;
}

export async function getUsers() {
  const users = await loadUsers();
  // Update cache
  localStorage.setItem('users_cache', JSON.stringify(users));
  return [...users];
}

export async function getUserById(id) {
  const users = await loadUsers();
  return users.find(u => u.id === id) || null;
}

export async function createUser(userData) {
  await loadUsers();
  const newUser = {
    id: nextUserId++,
    name: userData.name,
    email: userData.email,
    username: userData.username || '',
    role: userData.role || 'User',
    status: userData.status || 'Active',
    active: (userData.status || 'Active') === 'Active',
    organizationId: userData.organizationId || '',
    departmentId: userData.departmentId || '',
    teamId: userData.teamId || '',
    permissionScope: userData.permissionScope || 'own',
    mfaEnabled: !!userData.mfaEnabled,
    accountLocked: !!userData.accountLocked,
    passwordExpires: userData.passwordExpires !== false,
    sessionTimeout: userData.sessionTimeout || 60,
    assignedRoles: userData.assignedRoles || [],
  };
  usersCache.push(newUser);
  // Update cache
  localStorage.setItem('users_cache', JSON.stringify(usersCache));
  return newUser;
}

export async function updateUser(id, userData) {
  await loadUsers();
  const index = usersCache.findIndex(u => u.id === id);
  if (index !== -1) {
    usersCache[index] = { ...usersCache[index], ...userData, id };
    // Update cache
    localStorage.setItem('users_cache', JSON.stringify(usersCache));
    return usersCache[index];
  }
  return null;
}

export async function assignRolesToUser(userId, roleIds) {
  await loadUsers();
  const user = usersCache.find(u => u.id === userId);
  if (user) {
    user.assignedRoles = roleIds;
    // Update cache
    localStorage.setItem('users_cache', JSON.stringify(usersCache));
    return user;
  }
  return null;
}

export async function deleteUser(id) {
  await loadUsers();
  const index = usersCache.findIndex(u => u.id === id);
  if (index !== -1) {
    usersCache.splice(index, 1);
    // Update cache
    localStorage.setItem('users_cache', JSON.stringify(usersCache));
    return true;
  }
  return false;
}
