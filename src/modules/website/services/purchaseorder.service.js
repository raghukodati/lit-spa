/**
 * Purchase Order Service - B2B Purchase Order Management
 */

import { delay } from '../../../services/api.js';
import { PurchaseOrder } from '../models/purchaseorder.model.js';

// Mock purchase order data
let purchaseOrders = [
  {
    id: 1,
    poNumber: 'PO-2024-001',
    customerPONumber: 'ACM-PO-5678',
    companyId: 1,
    companyName: 'Acme Corporation',
    contactId: 1,
    contactName: 'John Smith',
    contactEmail: 'john.smith@acme.com',
    status: 'delivered',
    approvalStatus: 'approved',
    quoteId: 1,
    contractId: 1,
    orderId: 101,
    items: [
      {
        productId: 1,
        sku: 'PROD-001',
        name: 'Office Chair - Executive',
        quantity: 50,
        unitPrice: 299.99,
        discount: 10,
        tax: 0,
        total: 13499.55
      }
    ],
    subtotal: 14999.50,
    discountAmount: 1499.95,
    taxAmount: 1080.00,
    shippingAmount: 500.00,
    total: 15079.55,
    currency: 'USD',
    paymentTerms: 'Net 30',
    paymentMethod: 'invoice',
    paymentStatus: 'paid',
    paidAmount: 15079.55,
    shippingAddress: {
      street1: '456 Warehouse Rd',
      city: 'Newark',
      state: 'NJ',
      postalCode: '07101',
      country: 'USA'
    },
    billingAddress: {
      street1: '123 Business Ave',
      street2: 'Suite 100',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    shippingMethod: 'Ground',
    requestedDeliveryDate: '2024-11-15',
    estimatedDeliveryDate: '2024-11-15',
    actualDeliveryDate: '2024-11-14',
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    requiresApproval: true,
    approvalLimit: 10000,
    approvers: [
      { userId: 1, name: 'Sarah Johnson', status: 'approved', approvedAt: '2024-11-01T10:00:00Z' }
    ],
    approvedBy: 1,
    approvedAt: '2024-11-01T10:00:00Z',
    specialInstructions: 'Deliver to loading dock',
    internalNotes: 'Priority order',
    taxExempt: false,
    costCenter: 'CC-001',
    budgetCode: 'BUDGET-2024-Q4',
    projectCode: 'PROJ-456',
    accountManagerId: 1,
    salesRepId: 1,
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-11-14T15:00:00Z',
    submittedAt: '2024-11-01T09:30:00Z'
  },
  {
    id: 2,
    poNumber: 'PO-2024-002',
    customerPONumber: 'TSI-PO-9012',
    companyId: 2,
    companyName: 'TechStart Inc',
    contactId: 2,
    contactName: 'Jane Doe',
    contactEmail: 'jane.doe@techstart.com',
    status: 'processing',
    approvalStatus: 'approved',
    quoteId: 2,
    contractId: 2,
    orderId: 102,
    items: [
      {
        productId: 3,
        sku: 'SERV-001',
        name: 'Rack Server - 2U',
        quantity: 10,
        unitPrice: 4999.99,
        discount: 0,
        tax: 0,
        total: 49999.90
      }
    ],
    subtotal: 49999.90,
    discountAmount: 0,
    taxAmount: 0,
    shippingAmount: 1000.00,
    total: 50999.90,
    currency: 'USD',
    paymentTerms: 'Net 60',
    paymentMethod: 'purchase_order',
    paymentStatus: 'unpaid',
    paidAmount: 0,
    shippingAddress: {
      street1: '789 Tech Park',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA'
    },
    billingAddress: {
      street1: '789 Tech Park',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA'
    },
    shippingMethod: 'Freight',
    requestedDeliveryDate: '2024-11-25',
    estimatedDeliveryDate: '2024-11-25',
    actualDeliveryDate: null,
    trackingNumber: '',
    carrier: '',
    requiresApproval: false,
    approvalLimit: 0,
    approvers: [],
    approvedBy: null,
    approvedAt: null,
    specialInstructions: 'Call before delivery',
    internalNotes: '',
    taxExempt: true,
    taxExemptId: 'TX-12345',
    costCenter: 'CC-TECH-001',
    budgetCode: 'TECH-2024-CAP',
    projectCode: 'DC-UPGRADE',
    accountManagerId: 1,
    salesRepId: 1,
    createdAt: '2024-11-10T14:00:00Z',
    updatedAt: '2024-11-10T14:30:00Z',
    submittedAt: '2024-11-10T14:30:00Z'
  }
];

let nextPOId = 3;

/**
 * Get all purchase orders
 */
export async function getPurchaseOrders(options = {}) {
  await delay(200);
  let result = [...purchaseOrders];
  
  // Filter by status
  if (options.status) {
    result = result.filter(po => po.status === options.status);
  }
  
  // Filter by approval status
  if (options.approvalStatus) {
    result = result.filter(po => po.approvalStatus === options.approvalStatus);
  }
  
  // Filter by company
  if (options.companyId) {
    result = result.filter(po => po.companyId === parseInt(options.companyId));
  }
  
  // Filter by payment status
  if (options.paymentStatus) {
    result = result.filter(po => po.paymentStatus === options.paymentStatus);
  }
  
  // Search
  if (options.search) {
    const search = options.search.toLowerCase();
    result = result.filter(po =>
      po.poNumber.toLowerCase().includes(search) ||
      po.customerPONumber.toLowerCase().includes(search) ||
      po.companyName.toLowerCase().includes(search)
    );
  }
  
  // Sort
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return result.map(po => PurchaseOrder.fromAPI(po));
}

/**
 * Get purchase order by ID
 */
export async function getPurchaseOrderById(id) {
  await delay(200);
  const po = purchaseOrders.find(p => p.id === parseInt(id));
  return po ? PurchaseOrder.fromAPI(po) : null;
}

/**
 * Get purchase order by number
 */
export async function getPurchaseOrderByNumber(poNumber) {
  await delay(200);
  const po = purchaseOrders.find(p => p.poNumber === poNumber);
  return po ? PurchaseOrder.fromAPI(po) : null;
}

/**
 * Get purchase orders for company
 */
export async function getPurchaseOrdersForCompany(companyId) {
  await delay(200);
  const result = purchaseOrders.filter(po => po.companyId === parseInt(companyId));
  return result.map(po => PurchaseOrder.fromAPI(po));
}

/**
 * Create purchase order
 */
export async function createPurchaseOrder(poData) {
  await delay(300);
  
  const po = new PurchaseOrder(poData);
  
  // Generate PO number if not provided
  if (!po.poNumber) {
    const year = new Date().getFullYear();
    po.poNumber = `PO-${year}-${String(nextPOId).padStart(3, '0')}`;
  }
  
  po.calculateTotals();
  
  const validation = po.validate();
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  const newPO = {
    ...po.toJSON(),
    id: nextPOId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  purchaseOrders.push(newPO);
  return PurchaseOrder.fromAPI(newPO);
}

/**
 * Update purchase order
 */
export async function updatePurchaseOrder(id, updates) {
  await delay(300);
  const index = purchaseOrders.findIndex(po => po.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Purchase order not found');
  }
  
  purchaseOrders[index] = {
    ...purchaseOrders[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Recalculate totals if items changed
  if (updates.items) {
    const po = PurchaseOrder.fromAPI(purchaseOrders[index]);
    po.calculateTotals();
    purchaseOrders[index] = po.toJSON();
  }
  
  return PurchaseOrder.fromAPI(purchaseOrders[index]);
}

/**
 * Delete purchase order
 */
export async function deletePurchaseOrder(id) {
  await delay(300);
  const index = purchaseOrders.findIndex(po => po.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Purchase order not found');
  }
  
  purchaseOrders.splice(index, 1);
  return true;
}

/**
 * Submit purchase order
 */
export async function submitPurchaseOrder(id) {
  await delay(300);
  const po = purchaseOrders.find(p => p.id === parseInt(id));
  
  if (!po) {
    throw new Error('Purchase order not found');
  }
  
  po.status = 'submitted';
  po.submittedAt = new Date().toISOString();
  
  // Check if needs approval
  const poObj = PurchaseOrder.fromAPI(po);
  if (poObj.needsApproval()) {
    po.approvalStatus = 'pending';
  } else {
    po.approvalStatus = 'approved';
    po.status = 'approved';
  }
  
  po.updatedAt = new Date().toISOString();
  
  return PurchaseOrder.fromAPI(po);
}

/**
 * Approve purchase order
 */
export async function approvePurchaseOrder(id, userId, userName) {
  await delay(300);
  const po = purchaseOrders.find(p => p.id === parseInt(id));
  
  if (!po) {
    throw new Error('Purchase order not found');
  }
  
  const poObj = PurchaseOrder.fromAPI(po);
  
  if (!poObj.canApprove(userId)) {
    throw new Error('User cannot approve this purchase order');
  }
  
  poObj.approve(userId, userName);
  
  // Update the stored PO
  Object.assign(po, poObj.toJSON());
  
  if (po.approvalStatus === 'approved') {
    po.status = 'approved';
  }
  
  po.updatedAt = new Date().toISOString();
  
  return PurchaseOrder.fromAPI(po);
}

/**
 * Reject purchase order
 */
export async function rejectPurchaseOrder(id, userId, reason) {
  await delay(300);
  const po = purchaseOrders.find(p => p.id === parseInt(id));
  
  if (!po) {
    throw new Error('Purchase order not found');
  }
  
  const poObj = PurchaseOrder.fromAPI(po);
  poObj.reject(userId, reason);
  
  Object.assign(po, poObj.toJSON());
  po.status = 'cancelled';
  po.updatedAt = new Date().toISOString();
  
  return PurchaseOrder.fromAPI(po);
}

/**
 * Update PO status
 */
export async function updatePOStatus(id, status) {
  await delay(300);
  const po = purchaseOrders.find(p => p.id === parseInt(id));
  
  if (!po) {
    throw new Error('Purchase order not found');
  }
  
  po.status = status;
  po.updatedAt = new Date().toISOString();
  
  return PurchaseOrder.fromAPI(po);
}

/**
 * Add tracking information
 */
export async function addTrackingInfo(id, trackingNumber, carrier) {
  await delay(200);
  const po = purchaseOrders.find(p => p.id === parseInt(id));
  
  if (!po) {
    throw new Error('Purchase order not found');
  }
  
  po.trackingNumber = trackingNumber;
  po.carrier = carrier;
  po.status = 'shipped';
  po.updatedAt = new Date().toISOString();
  
  return PurchaseOrder.fromAPI(po);
}

/**
 * Mark as delivered
 */
export async function markAsDelivered(id) {
  await delay(200);
  const po = purchaseOrders.find(p => p.id === parseInt(id));
  
  if (!po) {
    throw new Error('Purchase order not found');
  }
  
  po.status = 'delivered';
  po.actualDeliveryDate = new Date().toISOString().split('T')[0];
  po.updatedAt = new Date().toISOString();
  
  return PurchaseOrder.fromAPI(po);
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(id, paymentStatus, paidAmount = 0) {
  await delay(200);
  const po = purchaseOrders.find(p => p.id === parseInt(id));
  
  if (!po) {
    throw new Error('Purchase order not found');
  }
  
  po.paymentStatus = paymentStatus;
  po.paidAmount = paidAmount;
  po.updatedAt = new Date().toISOString();
  
  return PurchaseOrder.fromAPI(po);
}

/**
 * Cancel purchase order
 */
export async function cancelPurchaseOrder(id, reason) {
  await delay(300);
  const po = purchaseOrders.find(p => p.id === parseInt(id));
  
  if (!po) {
    throw new Error('Purchase order not found');
  }
  
  po.status = 'cancelled';
  po.internalNotes = `${po.internalNotes}\nCancelled: ${reason}`;
  po.updatedAt = new Date().toISOString();
  
  return PurchaseOrder.fromAPI(po);
}

/**
 * Get purchase order statistics
 */
export async function getPOStats() {
  await delay(200);
  
  return {
    total: purchaseOrders.length,
    draft: purchaseOrders.filter(po => po.status === 'draft').length,
    submitted: purchaseOrders.filter(po => po.status === 'submitted').length,
    approved: purchaseOrders.filter(po => po.status === 'approved').length,
    pendingApproval: purchaseOrders.filter(po => po.approvalStatus === 'pending').length,
    processing: purchaseOrders.filter(po => po.status === 'processing').length,
    shipped: purchaseOrders.filter(po => po.status === 'shipped').length,
    delivered: purchaseOrders.filter(po => po.status === 'delivered').length,
    cancelled: purchaseOrders.filter(po => po.status === 'cancelled').length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + po.total, 0),
    averageValue: purchaseOrders.length > 0 ? purchaseOrders.reduce((sum, po) => sum + po.total, 0) / purchaseOrders.length : 0,
    unpaid: purchaseOrders.filter(po => po.paymentStatus === 'unpaid').length,
    paid: purchaseOrders.filter(po => po.paymentStatus === 'paid').length
  };
}

/**
 * Get pending approvals for user
 */
export async function getPendingApprovalsForUser(userId) {
  await delay(200);
  
  const result = purchaseOrders.filter(po => 
    po.approvalStatus === 'pending' &&
    po.approvers.some(a => a.userId === userId && a.status === 'pending')
  );
  
  return result.map(po => PurchaseOrder.fromAPI(po));
}

export default {
  getPurchaseOrders,
  getPurchaseOrderById,
  getPurchaseOrderByNumber,
  getPurchaseOrdersForCompany,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  submitPurchaseOrder,
  approvePurchaseOrder,
  rejectPurchaseOrder,
  updatePOStatus,
  addTrackingInfo,
  markAsDelivered,
  updatePaymentStatus,
  cancelPurchaseOrder,
  getPOStats,
  getPendingApprovalsForUser
};
