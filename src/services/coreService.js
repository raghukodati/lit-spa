// Core Service - Module definitions, entities, and shared utilities
import { delay as apiDelay } from './api.js';

export const delay = apiDelay;

// Module Definitions - Used synchronously throughout the app
export const modules = [
  {
    id: 'admin',
    name: 'Admin',
    icon: 'shield-lock',
    color: 'danger',
    description: 'System administration and user management',
    requiredRoles: [1],
    entities: ['users', 'roles'],
  },
  {
    id: 'sla',
    name: 'SLA',
    icon: 'speedometer2',
    color: 'primary',
    description: 'Service Level Agreement monitoring and incident management',
    requiredRoles: [1, 2],
    entities: ['incidents'],
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: 'cart-check',
    color: 'success',
    description: 'Sales and order management',
    requiredRoles: [1, 3],
    entities: ['orders', 'customers', 'products'],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: 'graph-up',
    color: 'info',
    description: 'Business intelligence and reports',
    requiredRoles: [1, 2],
    entities: ['reports'],
  },
  {
    id: 'gdocs',
    name: 'Gdocs',
    icon: 'file-earmark-text',
    color: 'secondary',
    description: 'Document management and collaboration',
    requiredRoles: [1, 2],
    entities: ['gdocs'],
  },
  {
    id: 'commerce',
    name: 'Commerce',
    icon: 'shop',
    color: 'success',
    description: 'Unified B2C and B2B e-commerce platform',
    requiredRoles: [1, 2],
    entities: ['products', 'orders', 'customers', 'quotes'],
  },
  {
    id: 'customers',
    name: 'Customers',
    icon: 'building',
    color: 'success',
    description: 'Customer and organization management',
    requiredRoles: [1, 2],
    entities: ['customers', 'customer_orgs'],
  },
  {
    id: 'companies',
    name: 'Companies',
    icon: 'building',
    color: 'primary',
    description: 'B2B companies and business partners',
    requiredRoles: [1, 2],
    entities: ['companies'],
  },
];

// Entity Definitions - Used synchronously for permissions
export const entities = [
  { id: 'users', name: 'Users', icon: 'people', description: 'User accounts and profiles' },
  { id: 'incidents', name: 'Incidents', icon: 'exclamation-triangle', description: 'SLA incident tracking and management' },
  { id: 'products', name: 'Products', icon: 'box', description: 'Product catalog management' },
  { id: 'orders', name: 'Orders', icon: 'cart', description: 'Order processing and tracking' },
  { id: 'customers', name: 'Customers', icon: 'person-badge', description: 'Customer relationship management' },
  { id: 'customer_orgs', name: 'Customer Organizations', icon: 'building', description: 'Customer organization management (multi-tenant)' },
  { id: 'companies', name: 'Companies', icon: 'building', description: 'B2B companies and business partners' },
  { id: 'quotes', name: 'Quotes', icon: 'file-earmark-text', description: 'B2B quotes and RFQs' },
  { id: 'purchase_orders', name: 'Purchase Orders', icon: 'receipt', description: 'B2B purchase orders' },
  { id: 'reports', name: 'Reports', icon: 'file-earmark-bar-graph', description: 'Analytics and reporting' },
  { id: 'settings', name: 'Settings', icon: 'gear', description: 'System configuration' },
  { id: 'gdocs', name: 'Gdocs', icon: 'file-earmark-text', description: 'Document management and collaboration' },
  { id: 'pages', name: 'Pages', icon: 'file-earmark', description: 'Website page management' },
  { id: 'blog', name: 'Blog', icon: 'journal-text', description: 'Blog post management' },
  { id: 'media', name: 'Media', icon: 'image', description: 'Media file management' },
];

// Permission Type Definitions - Used synchronously for permissions
export const permissionTypes = [
  { id: 'create', name: 'Create', icon: 'plus-circle', color: 'success' },
  { id: 'read', name: 'Read', icon: 'eye', color: 'info' },
  { id: 'update', name: 'Update', icon: 'pencil', color: 'warning' },
  { id: 'delete', name: 'Delete', icon: 'trash', color: 'danger' },
];


// Home and About data
export async function getHomeData() {
  return {
    title: 'Welcome',
    intro: 'This data is provided by the service layer.',
    items: [
      { id: 1, text: 'Lit components render fast' },
      { id: 2, text: 'Routing via @lit-labs/router' },
      { id: 3, text: 'Vite for dev and build' },
    ],
  };
}

export async function getAboutData() {
  return {
    framework: 'Lit',
    version: '3.x',
    features: [
      'Web Components based',
      'Small and fast',
      'Declarative templates',
    ],
    links: [
      { label: 'Docs', href: 'https://lit.dev' },
      { label: 'Router', href: 'https://github.com/lit/lit/tree/main/packages/labs/router' },
    ],
  };
}
