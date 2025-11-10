// Role Management Service
import { get, isMockMode } from '../../../services/api.js';

// Cache for roles data
let rolesCache = [];
let nextRoleId = 5;

// Load roles from API/mock
async function loadRoles() {
  if (rolesCache.length === 0) {
    rolesCache = await get('/roles.json');
  }
  return rolesCache;
}

export async function getRoles() {
  const roles = await loadRoles();
  // Update cache
  localStorage.setItem('roles_cache', JSON.stringify(roles));
  return [...roles];
}

export async function getRoleById(id) {
  const roles = await loadRoles();
  return roles.find(r => r.id === id) || null;
}

export async function createRole(roleData) {
  await loadRoles();
  const newRole = {
    id: nextRoleId++,
    name: roleData.name,
    description: roleData.description || '',
    permissions: roleData.permissions || [],
    userCount: 0,
  };
  rolesCache.push(newRole);
  // Update cache
  localStorage.setItem('roles_cache', JSON.stringify(rolesCache));
  return newRole;
}

export async function updateRole(id, roleData) {
  await loadRoles();
  const index = rolesCache.findIndex(r => r.id === id);
  if (index !== -1) {
    rolesCache[index] = { ...rolesCache[index], ...roleData, id };
    // Update cache
    localStorage.setItem('roles_cache', JSON.stringify(rolesCache));
    return rolesCache[index];
  }
  return null;
}

export async function deleteRole(id) {
  await loadRoles();
  const index = rolesCache.findIndex(r => r.id === id);
  if (index !== -1) {
    rolesCache.splice(index, 1);
    // Update cache
    localStorage.setItem('roles_cache', JSON.stringify(rolesCache));
    return true;
  }
  return false;
}
