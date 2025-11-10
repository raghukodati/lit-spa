/**
 * Price List Service - B2B Custom Pricing Management
 */

import { delay } from '../../../services/api.js';
import { PriceList } from '../models/pricelist.model.js';

// Mock price list data
let priceLists = [
  {
    id: 1,
    name: 'Enterprise Tier Pricing',
    code: 'ENT-001',
    description: 'Volume pricing for enterprise customers',
    status: 'active',
    type: 'volume',
    currency: 'USD',
    priceModifier: 'percentage',
    modifierValue: 15,
    items: [],
    volumeTiers: [
      { minQty: 1, maxQty: 99, discount: 10 },
      { minQty: 100, maxQty: 499, discount: 15 },
      { minQty: 500, maxQty: null, discount: 20 }
    ],
    assignedCompanies: [1],
    assignedCategories: [],
    assignedProducts: [],
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    priority: 10,
    minimumOrderQty: 0,
    minimumOrderAmount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Tech Startup Special',
    code: 'TECH-001',
    description: 'Special pricing for technology startups',
    status: 'active',
    type: 'custom',
    currency: 'USD',
    priceModifier: 'percentage',
    modifierValue: 10,
    items: [
      { productId: 1, sku: 'PROD-001', price: 249.99, minQty: 1, maxQty: null },
      { productId: 2, sku: 'PROD-002', price: 499.99, minQty: 1, maxQty: null }
    ],
    volumeTiers: [],
    assignedCompanies: [2],
    assignedCategories: [],
    assignedProducts: [1, 2],
    validFrom: '2024-03-01',
    validTo: '2025-03-01',
    priority: 5,
    minimumOrderQty: 0,
    minimumOrderAmount: 1000,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  }
];

let nextPriceListId = 3;

/**
 * Get all price lists
 */
export async function getPriceLists(options = {}) {
  await delay(200);
  let result = [...priceLists];
  
  // Filter by status
  if (options.status) {
    result = result.filter(pl => pl.status === options.status);
  }
  
  // Filter by type
  if (options.type) {
    result = result.filter(pl => pl.type === options.type);
  }
  
  // Filter by company
  if (options.companyId) {
    result = result.filter(pl => 
      pl.assignedCompanies.includes(parseInt(options.companyId))
    );
  }
  
  // Search
  if (options.search) {
    const search = options.search.toLowerCase();
    result = result.filter(pl =>
      pl.name.toLowerCase().includes(search) ||
      pl.code.toLowerCase().includes(search)
    );
  }
  
  return result.map(pl => PriceList.fromAPI(pl));
}

/**
 * Get price list by ID
 */
export async function getPriceListById(id) {
  await delay(200);
  const priceList = priceLists.find(pl => pl.id === parseInt(id));
  return priceList ? PriceList.fromAPI(priceList) : null;
}

/**
 * Get price list by code
 */
export async function getPriceListByCode(code) {
  await delay(200);
  const priceList = priceLists.find(pl => pl.code === code);
  return priceList ? PriceList.fromAPI(priceList) : null;
}

/**
 * Get price lists for company
 */
export async function getPriceListsForCompany(companyId) {
  await delay(200);
  const result = priceLists.filter(pl =>
    pl.assignedCompanies.includes(parseInt(companyId)) &&
    pl.status === 'active'
  );
  
  // Sort by priority (higher first)
  result.sort((a, b) => b.priority - a.priority);
  
  return result.map(pl => PriceList.fromAPI(pl));
}

/**
 * Create price list
 */
export async function createPriceList(priceListData) {
  await delay(300);
  
  const priceList = new PriceList(priceListData);
  const validation = priceList.validate();
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  const newPriceList = {
    ...priceList.toJSON(),
    id: nextPriceListId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  priceLists.push(newPriceList);
  return PriceList.fromAPI(newPriceList);
}

/**
 * Update price list
 */
export async function updatePriceList(id, updates) {
  await delay(300);
  const index = priceLists.findIndex(pl => pl.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Price list not found');
  }
  
  priceLists[index] = {
    ...priceLists[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return PriceList.fromAPI(priceLists[index]);
}

/**
 * Delete price list
 */
export async function deletePriceList(id) {
  await delay(300);
  const index = priceLists.findIndex(pl => pl.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Price list not found');
  }
  
  priceLists.splice(index, 1);
  return true;
}

/**
 * Get price for product
 */
export async function getPriceForProduct(productId, quantity, basePrice, companyId) {
  await delay(200);
  
  // Get applicable price lists for company
  const companyPriceLists = await getPriceListsForCompany(companyId);
  
  if (companyPriceLists.length === 0) {
    return basePrice;
  }
  
  // Use highest priority price list
  const priceList = companyPriceLists[0];
  
  if (!priceList.isActive) {
    return basePrice;
  }
  
  return priceList.getPrice(productId, quantity, basePrice);
}

/**
 * Assign price list to company
 */
export async function assignPriceListToCompany(priceListId, companyId) {
  await delay(200);
  const priceList = priceLists.find(pl => pl.id === parseInt(priceListId));
  
  if (!priceList) {
    throw new Error('Price list not found');
  }
  
  if (!priceList.assignedCompanies.includes(companyId)) {
    priceList.assignedCompanies.push(companyId);
    priceList.updatedAt = new Date().toISOString();
  }
  
  return PriceList.fromAPI(priceList);
}

/**
 * Unassign price list from company
 */
export async function unassignPriceListFromCompany(priceListId, companyId) {
  await delay(200);
  const priceList = priceLists.find(pl => pl.id === parseInt(priceListId));
  
  if (!priceList) {
    throw new Error('Price list not found');
  }
  
  priceList.assignedCompanies = priceList.assignedCompanies.filter(
    id => id !== companyId
  );
  priceList.updatedAt = new Date().toISOString();
  
  return PriceList.fromAPI(priceList);
}

/**
 * Add product to price list
 */
export async function addProductToPriceList(priceListId, productId, sku, price, minQty = null, maxQty = null) {
  await delay(200);
  const priceList = priceLists.find(pl => pl.id === parseInt(priceListId));
  
  if (!priceList) {
    throw new Error('Price list not found');
  }
  
  // Remove existing if present
  priceList.items = priceList.items.filter(i => i.productId !== productId);
  
  // Add new
  priceList.items.push({ productId, sku, price, minQty, maxQty });
  priceList.updatedAt = new Date().toISOString();
  
  return PriceList.fromAPI(priceList);
}

/**
 * Remove product from price list
 */
export async function removeProductFromPriceList(priceListId, productId) {
  await delay(200);
  const priceList = priceLists.find(pl => pl.id === parseInt(priceListId));
  
  if (!priceList) {
    throw new Error('Price list not found');
  }
  
  priceList.items = priceList.items.filter(i => i.productId !== productId);
  priceList.updatedAt = new Date().toISOString();
  
  return PriceList.fromAPI(priceList);
}

/**
 * Add volume tier
 */
export async function addVolumeTier(priceListId, minQty, maxQty, discountOrPrice) {
  await delay(200);
  const priceList = priceLists.find(pl => pl.id === parseInt(priceListId));
  
  if (!priceList) {
    throw new Error('Price list not found');
  }
  
  const pl = PriceList.fromAPI(priceList);
  pl.addVolumeTier(minQty, maxQty, discountOrPrice);
  
  priceList.volumeTiers = pl.volumeTiers;
  priceList.updatedAt = new Date().toISOString();
  
  return PriceList.fromAPI(priceList);
}

/**
 * Duplicate price list
 */
export async function duplicatePriceList(id) {
  await delay(300);
  const priceList = priceLists.find(pl => pl.id === parseInt(id));
  
  if (!priceList) {
    throw new Error('Price list not found');
  }
  
  const newPriceList = {
    ...priceList,
    id: nextPriceListId++,
    name: `${priceList.name} (Copy)`,
    code: `${priceList.code}-COPY-${nextPriceListId}`,
    status: 'draft',
    assignedCompanies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  priceLists.push(newPriceList);
  return PriceList.fromAPI(newPriceList);
}

export default {
  getPriceLists,
  getPriceListById,
  getPriceListByCode,
  getPriceListsForCompany,
  createPriceList,
  updatePriceList,
  deletePriceList,
  getPriceForProduct,
  assignPriceListToCompany,
  unassignPriceListFromCompany,
  addProductToPriceList,
  removeProductFromPriceList,
  addVolumeTier,
  duplicatePriceList
};
