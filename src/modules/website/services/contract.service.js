/**
 * Contract Service - B2B Customer Contracts Management
 */

import { delay } from '../../../services/api.js';
import { Contract } from '../models/contract.model.js';

// Mock contract data
let contracts = [
  {
    id: 1,
    contractNumber: 'CNT-2024-001',
    name: 'Annual Supply Agreement - Acme',
    type: 'standard',
    companyId: 1,
    companyName: 'Acme Corporation',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    autoRenew: true,
    renewalPeriod: 12,
    renewalNotice: 30,
    totalValue: 500000,
    minimumCommitment: 250000,
    paymentTerms: 'Net 30',
    currency: 'USD',
    priceListId: 1,
    discountPercent: 15,
    volumeDiscount: true,
    volumeTiers: [
      { minQty: 1000, discount: 5 },
      { minQty: 5000, discount: 10 },
      { minQty: 10000, discount: 15 }
    ],
    creditLimit: 100000,
    paymentSchedule: 'per_order',
    includedProducts: [],
    excludedProducts: [],
    serviceLevel: 'premium',
    shippingTerms: 'FOB',
    deliverySchedule: 'As requested',
    allowBackorders: true,
    minOrderQty: 0,
    maxOrderQty: null,
    termsAndConditions: 'Standard terms apply',
    slaTerms: '99.9% uptime guarantee',
    accountManagerId: 1,
    accountManagerName: 'Sarah Johnson',
    ordersPlaced: 45,
    totalSpent: 125000,
    lastOrderDate: '2024-11-01',
    requiresApproval: true,
    approvalStatus: 'approved',
    approvedBy: [1],
    approvedAt: '2024-01-05T10:00:00Z',
    customerSignatory: 'John Smith, VP Procurement',
    customerSignedDate: '2024-01-05T14:00:00Z',
    vendorSignatory: 'Mary Wilson, Sales Director',
    vendorSignedDate: '2024-01-05T15:00:00Z',
    attachments: [],
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 2,
    contractNumber: 'CNT-2024-002',
    name: 'Master Service Agreement - TechStart',
    type: 'master',
    companyId: 2,
    companyName: 'TechStart Inc',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    autoRenew: false,
    renewalPeriod: 12,
    renewalNotice: 60,
    totalValue: 300000,
    minimumCommitment: 150000,
    paymentTerms: 'Net 60',
    currency: 'USD',
    priceListId: 2,
    discountPercent: 10,
    volumeDiscount: false,
    volumeTiers: [],
    creditLimit: 50000,
    paymentSchedule: 'monthly',
    includedProducts: [1, 2, 3],
    excludedProducts: [],
    serviceLevel: 'enterprise',
    shippingTerms: 'CIF',
    deliverySchedule: 'Monthly',
    allowBackorders: false,
    minOrderQty: 100,
    maxOrderQty: 10000,
    termsAndConditions: 'Custom terms negotiated',
    slaTerms: '24/7 support included',
    accountManagerId: 1,
    accountManagerName: 'Sarah Johnson',
    ordersPlaced: 12,
    totalSpent: 78000,
    lastOrderDate: '2024-10-28',
    requiresApproval: true,
    approvalStatus: 'approved',
    approvedBy: [1, 2],
    approvedAt: '2024-03-05T10:00:00Z',
    customerSignatory: 'Jane Doe, CEO',
    customerSignedDate: '2024-03-05T16:00:00Z',
    vendorSignatory: 'Robert Brown, VP Sales',
    vendorSignedDate: '2024-03-05T17:00:00Z',
    attachments: [],
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-10-28T00:00:00Z'
  }
];

let nextContractId = 3;

/**
 * Get all contracts
 */
export async function getContracts(options = {}) {
  await delay(200);
  let result = [...contracts];
  
  // Filter by status
  if (options.status) {
    result = result.filter(c => c.status === options.status);
  }
  
  // Filter by company
  if (options.companyId) {
    result = result.filter(c => c.companyId === parseInt(options.companyId));
  }
  
  // Filter by type
  if (options.type) {
    result = result.filter(c => c.type === options.type);
  }
  
  // Filter by account manager
  if (options.accountManagerId) {
    result = result.filter(c => c.accountManagerId === parseInt(options.accountManagerId));
  }
  
  // Filter expiring soon
  if (options.expiringSoon) {
    result = result.filter(c => {
      const contract = Contract.fromAPI(c);
      return contract.isExpiringSoon;
    });
  }
  
  // Search
  if (options.search) {
    const search = options.search.toLowerCase();
    result = result.filter(c =>
      c.contractNumber.toLowerCase().includes(search) ||
      c.name.toLowerCase().includes(search) ||
      c.companyName.toLowerCase().includes(search)
    );
  }
  
  return result.map(c => Contract.fromAPI(c));
}

/**
 * Get contract by ID
 */
export async function getContractById(id) {
  await delay(200);
  const contract = contracts.find(c => c.id === parseInt(id));
  return contract ? Contract.fromAPI(contract) : null;
}

/**
 * Get contract by number
 */
export async function getContractByNumber(contractNumber) {
  await delay(200);
  const contract = contracts.find(c => c.contractNumber === contractNumber);
  return contract ? Contract.fromAPI(contract) : null;
}

/**
 * Get contracts for company
 */
export async function getContractsForCompany(companyId) {
  await delay(200);
  const result = contracts.filter(c => c.companyId === parseInt(companyId));
  return result.map(c => Contract.fromAPI(c));
}

/**
 * Get active contract for company
 */
export async function getActiveContractForCompany(companyId) {
  await delay(200);
  const result = contracts.find(c => 
    c.companyId === parseInt(companyId) && c.status === 'active'
  );
  return result ? Contract.fromAPI(result) : null;
}

/**
 * Create contract
 */
export async function createContract(contractData) {
  await delay(300);
  
  const contract = new Contract(contractData);
  const validation = contract.validate();
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  // Generate contract number if not provided
  if (!contract.contractNumber) {
    const year = new Date().getFullYear();
    contract.contractNumber = `CNT-${year}-${String(nextContractId).padStart(3, '0')}`;
  }
  
  const newContract = {
    ...contract.toJSON(),
    id: nextContractId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  contracts.push(newContract);
  return Contract.fromAPI(newContract);
}

/**
 * Update contract
 */
export async function updateContract(id, updates) {
  await delay(300);
  const index = contracts.findIndex(c => c.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Contract not found');
  }
  
  contracts[index] = {
    ...contracts[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return Contract.fromAPI(contracts[index]);
}

/**
 * Delete contract
 */
export async function deleteContract(id) {
  await delay(300);
  const index = contracts.findIndex(c => c.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Contract not found');
  }
  
  contracts.splice(index, 1);
  return true;
}

/**
 * Approve contract
 */
export async function approveContract(id, userId) {
  await delay(300);
  const contract = contracts.find(c => c.id === parseInt(id));
  
  if (!contract) {
    throw new Error('Contract not found');
  }
  
  if (!contract.approvedBy.includes(userId)) {
    contract.approvedBy.push(userId);
  }
  
  contract.approvalStatus = 'approved';
  contract.approvedAt = new Date().toISOString();
  contract.updatedAt = new Date().toISOString();
  
  return Contract.fromAPI(contract);
}

/**
 * Reject contract
 */
export async function rejectContract(id, reason) {
  await delay(300);
  const contract = contracts.find(c => c.id === parseInt(id));
  
  if (!contract) {
    throw new Error('Contract not found');
  }
  
  contract.approvalStatus = 'rejected';
  contract.notes = `${contract.notes}\nRejection: ${reason}`;
  contract.updatedAt = new Date().toISOString();
  
  return Contract.fromAPI(contract);
}

/**
 * Sign contract (customer)
 */
export async function signContractCustomer(id, signatoryName) {
  await delay(300);
  const contract = contracts.find(c => c.id === parseInt(id));
  
  if (!contract) {
    throw new Error('Contract not found');
  }
  
  contract.customerSignatory = signatoryName;
  contract.customerSignedDate = new Date().toISOString();
  contract.updatedAt = new Date().toISOString();
  
  // If both parties signed, activate contract
  if (contract.vendorSignedDate) {
    contract.status = 'active';
  }
  
  return Contract.fromAPI(contract);
}

/**
 * Sign contract (vendor)
 */
export async function signContractVendor(id, signatoryName) {
  await delay(300);
  const contract = contracts.find(c => c.id === parseInt(id));
  
  if (!contract) {
    throw new Error('Contract not found');
  }
  
  contract.vendorSignatory = signatoryName;
  contract.vendorSignedDate = new Date().toISOString();
  contract.updatedAt = new Date().toISOString();
  
  // If both parties signed, activate contract
  if (contract.customerSignedDate) {
    contract.status = 'active';
  }
  
  return Contract.fromAPI(contract);
}

/**
 * Renew contract
 */
export async function renewContract(id, newEndDate) {
  await delay(300);
  const contract = contracts.find(c => c.id === parseInt(id));
  
  if (!contract) {
    throw new Error('Contract not found');
  }
  
  const oldEndDate = contract.endDate;
  contract.startDate = oldEndDate;
  contract.endDate = newEndDate || new Date(new Date(oldEndDate).getTime() + contract.renewalPeriod * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  contract.status = 'active';
  contract.updatedAt = new Date().toISOString();
  
  return Contract.fromAPI(contract);
}

/**
 * Terminate contract
 */
export async function terminateContract(id, reason) {
  await delay(300);
  const contract = contracts.find(c => c.id === parseInt(id));
  
  if (!contract) {
    throw new Error('Contract not found');
  }
  
  contract.status = 'terminated';
  contract.notes = `${contract.notes}\nTerminated: ${reason}`;
  contract.updatedAt = new Date().toISOString();
  
  return Contract.fromAPI(contract);
}

/**
 * Update contract performance
 */
export async function updateContractPerformance(id, orderId, orderTotal) {
  await delay(200);
  const contract = contracts.find(c => c.id === parseInt(id));
  
  if (!contract) {
    throw new Error('Contract not found');
  }
  
  contract.ordersPlaced += 1;
  contract.totalSpent += orderTotal;
  contract.lastOrderDate = new Date().toISOString().split('T')[0];
  contract.updatedAt = new Date().toISOString();
  
  return Contract.fromAPI(contract);
}

/**
 * Get contract statistics
 */
export async function getContractStats() {
  await delay(200);
  
  return {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    pending: contracts.filter(c => c.status === 'pending').length,
    expiringSoon: contracts.filter(c => {
      const contract = Contract.fromAPI(c);
      return contract.isExpiringSoon;
    }).length,
    expired: contracts.filter(c => c.status === 'expired').length,
    totalValue: contracts.reduce((sum, c) => sum + c.totalValue, 0),
    totalCommitment: contracts.reduce((sum, c) => sum + c.minimumCommitment, 0),
    totalSpent: contracts.reduce((sum, c) => sum + c.totalSpent, 0),
    averageValue: contracts.length > 0 ? contracts.reduce((sum, c) => sum + c.totalValue, 0) / contracts.length : 0
  };
}

/**
 * Get expiring contracts
 */
export async function getExpiringContracts(days = 30) {
  await delay(200);
  
  const result = contracts.filter(c => {
    if (c.status !== 'active' || !c.endDate) return false;
    
    const endDate = new Date(c.endDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiry <= days && daysUntilExpiry > 0;
  });
  
  return result.map(c => Contract.fromAPI(c));
}

export default {
  getContracts,
  getContractById,
  getContractByNumber,
  getContractsForCompany,
  getActiveContractForCompany,
  createContract,
  updateContract,
  deleteContract,
  approveContract,
  rejectContract,
  signContractCustomer,
  signContractVendor,
  renewContract,
  terminateContract,
  updateContractPerformance,
  getContractStats,
  getExpiringContracts
};
