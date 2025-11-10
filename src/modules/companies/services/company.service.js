/**
 * Company Service - B2B Customer/Organization Management
 */

import { delay } from '../../../services/api.js';
import { Company } from '../models/company.model.js';

// Mock company data
let companies = [
  {
    id: 1,
    name: 'Acme Corporation',
    legalName: 'Acme Corporation Inc.',
    taxId: '12-3456789',
    companyType: 'enterprise',
    partnerType: 'customer',
    industry: 'Manufacturing',
    website: 'https://acme.com',
    status: 'active',
    accountNumber: 'ACM-001',
    primaryContact: {
      name: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '+1-555-0100',
      title: 'Purchasing Manager'
    },
    billingAddress: {
      street1: '123 Business Ave',
      street2: 'Suite 100',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    shippingAddresses: [
      {
        id: 1,
        name: 'Main Warehouse',
        street1: '456 Warehouse Rd',
        city: 'Newark',
        state: 'NJ',
        postalCode: '07101',
        country: 'USA',
        isDefault: true
      }
    ],
    creditLimit: 100000,
    creditUsed: 25000,
    paymentTerms: 'Net 30',
    priceListId: 1,
    discountPercent: 15,
    taxExempt: false,
    accountManagerId: 1,
    accountManagerName: 'Sarah Johnson',
    requiresApproval: true,
    approvalLimit: 10000,
    allowBackorders: true,
    minimumOrderAmount: 500,
    allowedPaymentMethods: ['invoice', 'purchase_order'],
    contractStartDate: '2024-01-01',
    contractEndDate: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'TechStart Inc',
    legalName: 'TechStart Incorporated',
    taxId: '98-7654321',
    companyType: 'business',
    partnerType: 'customer',
    industry: 'Technology',
    website: 'https://techstart.com',
    status: 'active',
    accountNumber: 'TSI-002',
    primaryContact: {
      name: 'Jane Doe',
      email: 'jane.doe@techstart.com',
      phone: '+1-555-0200',
      title: 'Operations Director'
    },
    billingAddress: {
      street1: '789 Tech Park',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA'
    },
    shippingAddresses: [
      {
        id: 1,
        name: 'HQ Office',
        street1: '789 Tech Park',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'USA',
        isDefault: true
      }
    ],
    creditLimit: 50000,
    creditUsed: 12000,
    paymentTerms: 'Net 60',
    priceListId: 2,
    discountPercent: 10,
    taxExempt: true,
    taxExemptId: 'TX-12345',
    accountManagerId: 1,
    accountManagerName: 'Sarah Johnson',
    requiresApproval: false,
    allowBackorders: false,
    minimumOrderAmount: 1000,
    allowedPaymentMethods: ['credit_card', 'purchase_order'],
    contractStartDate: '2024-03-01',
    contractEndDate: '2025-03-01',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  
  {
    id: 3,
    name: 'Global Supplies LLC',
    legalName: 'Global Supplies LLC',
    taxId: '11-2223333',
    companyType: 'business',
    partnerType: 'vendor',
    industry: 'Wholesale',
    website: 'https://globalsupplies.example',
    status: 'active',
    accountNumber: 'GSL-003',
    primaryContact: {
      name: 'Patrick Vendor',
      email: 'patrick@globalsupplies.example',
      phone: '+1-555-0300',
      title: 'Account Manager'
    },
    billingAddress: { street1: '12 Vendor Way', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'USA' },
    shippingAddresses: [],
    creditLimit: 0,
    creditUsed: 0,
    paymentTerms: 'Net 30',
    priceListId: null,
    discountPercent: 0,
    taxExempt: false,
    accountManagerId: null,
    accountManagerName: '',
    requiresApproval: false,
    approvalLimit: 0,
    allowBackorders: false,
    minimumOrderAmount: 0,
    allowedPaymentMethods: ['invoice'],
    contractStartDate: '2024-01-01',
    contractEndDate: '2025-01-01',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Prime Manufacturing Co',
    legalName: 'Prime Manufacturing Company',
    taxId: '22-3334444',
    companyType: 'enterprise',
    partnerType: 'vendor',
    industry: 'Manufacturing',
    website: 'https://primemanufacturing.example',
    status: 'active',
    accountNumber: 'PMC-004',
    primaryContact: {
      name: 'Linda Prime',
      email: 'linda@primemanufacturing.example',
      phone: '+1-555-0400',
      title: 'Sales Director'
    },
    billingAddress: { street1: '500 Industrial Dr', city: 'Dallas', state: 'TX', postalCode: '75201', country: 'USA' },
    shippingAddresses: [],
    creditLimit: 0,
    creditUsed: 0,
    paymentTerms: 'Net 60',
    priceListId: null,
    discountPercent: 0,
    taxExempt: false,
    accountManagerId: null,
    accountManagerName: '',
    requiresApproval: false,
    approvalLimit: 0,
    allowBackorders: false,
    minimumOrderAmount: 0,
    allowedPaymentMethods: ['invoice'],
    contractStartDate: '2024-02-01',
    contractEndDate: '2026-02-01',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z'
  }
];

let nextCompanyId = 5;

/**
 * Get all companies
 */
export async function getCompanies(options = {}) {
  await delay(200);
  let result = [...companies];
  
  // Filter by status
  if (options.status) {
    result = result.filter(c => c.status === options.status);
  }
  
  // Filter by type
  if (options.companyType) {
    result = result.filter(c => c.companyType === options.companyType);
  }

  // Filter by partner type
  if (options.partnerType) {
    result = result.filter(c => c.partnerType === options.partnerType);
  }
  
  // Filter by account manager
  if (options.accountManagerId) {
    result = result.filter(c => c.accountManagerId === options.accountManagerId);
  }
  
  // Search
  if (options.search) {
    const search = options.search.toLowerCase();
    result = result.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.accountNumber.toLowerCase().includes(search) ||
      c.primaryContact.email.toLowerCase().includes(search)
    );
  }
  
  // Sort
  if (options.sortBy) {
    result.sort((a, b) => {
      const aVal = a[options.sortBy];
      const bVal = b[options.sortBy];
      return options.sortOrder === 'desc' ? 
        (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1);
    });
  }
  
  return result.map(c => Company.fromAPI(c));
}

/**
 * Get company by ID
 */
export async function getCompanyById(id) {
  await delay(200);
  const company = companies.find(c => c.id === parseInt(id));
  return company ? Company.fromAPI(company) : null;
}

/**
 * Get company by account number
 */
export async function getCompanyByAccountNumber(accountNumber) {
  await delay(200);
  const company = companies.find(c => c.accountNumber === accountNumber);
  return company ? Company.fromAPI(company) : null;
}

/**
 * Create company
 */
export async function createCompany(companyData) {
  await delay(300);
  
  const company = new Company(companyData);
  const validation = company.validate();
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  // Generate account number if not provided
  if (!company.accountNumber) {
    const prefix = company.name.substring(0, 3).toUpperCase();
    company.accountNumber = `${prefix}-${String(nextCompanyId).padStart(3, '0')}`;
  }
  
  const newCompany = {
    ...company.toJSON(),
    id: nextCompanyId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  companies.push(newCompany);
  return Company.fromAPI(newCompany);
}

/**
 * Update company
 */
export async function updateCompany(id, updates) {
  await delay(300);
  const index = companies.findIndex(c => c.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Company not found');
  }
  
  companies[index] = {
    ...companies[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return Company.fromAPI(companies[index]);
}

/**
 * Delete company
 */
export async function deleteCompany(id) {
  await delay(300);
  const index = companies.findIndex(c => c.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Company not found');
  }
  
  companies.splice(index, 1);
  return true;
}

/**
 * Update company credit
 */
export async function updateCompanyCredit(id, creditUsed) {
  await delay(200);
  const company = companies.find(c => c.id === parseInt(id));
  
  if (!company) {
    throw new Error('Company not found');
  }
  
  company.creditUsed = creditUsed;
  company.updatedAt = new Date().toISOString();
  
  return Company.fromAPI(company);
}

/**
 * Get company statistics
 */
export async function getCompanyStats(id) {
  await delay(200);
  
  return {
    totalOrders: 45,
    totalSpent: 125000,
    averageOrderValue: 2778,
    lastOrderDate: '2024-11-01',
    creditUtilization: 25, // percentage
    paymentScore: 98, // 0-100
    daysOutstanding: 15 // average days to pay
  };
}

/**
 * Add shipping address
 */
export async function addShippingAddress(companyId, address) {
  await delay(200);
  const company = companies.find(c => c.id === parseInt(companyId));
  
  if (!company) {
    throw new Error('Company not found');
  }
  
  const newAddress = {
    ...address,
    id: company.shippingAddresses.length + 1
  };
  
  company.shippingAddresses.push(newAddress);
  company.updatedAt = new Date().toISOString();
  
  return newAddress;
}

/**
 * Update shipping address
 */
export async function updateShippingAddress(companyId, addressId, updates) {
  await delay(200);
  const company = companies.find(c => c.id === parseInt(companyId));
  
  if (!company) {
    throw new Error('Company not found');
  }
  
  const addressIndex = company.shippingAddresses.findIndex(a => a.id === addressId);
  
  if (addressIndex === -1) {
    throw new Error('Address not found');
  }
  
  company.shippingAddresses[addressIndex] = {
    ...company.shippingAddresses[addressIndex],
    ...updates
  };
  
  company.updatedAt = new Date().toISOString();
  
  return company.shippingAddresses[addressIndex];
}

/**
 * Delete shipping address
 */
export async function deleteShippingAddress(companyId, addressId) {
  await delay(200);
  const company = companies.find(c => c.id === parseInt(companyId));
  
  if (!company) {
    throw new Error('Company not found');
  }
  
  const addressIndex = company.shippingAddresses.findIndex(a => a.id === addressId);
  
  if (addressIndex === -1) {
    throw new Error('Address not found');
  }
  
  company.shippingAddresses.splice(addressIndex, 1);
  company.updatedAt = new Date().toISOString();
  
  return true;
}

export function getCompanyLabelById(id) {
  const c = companies.find(c => c.id === parseInt(id));
  return c ? `${c.accountNumber || ''}${c.accountNumber ? ' • ' : ''}${c.name}` : '';
}

export function getCompanyLabelByAccountNumber(accountNumber) {
  const c = companies.find(c => c.accountNumber === accountNumber);
  return c ? `${c.accountNumber || ''}${c.accountNumber ? ' • ' : ''}${c.name}` : '';
}

export default {
  getCompanies,
  getCompanyById,
  getCompanyByAccountNumber,
  createCompany,
  updateCompany,
  deleteCompany,
  updateCompanyCredit,
  getCompanyStats,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  getCompanyLabelById,
  getCompanyLabelByAccountNumber
};
