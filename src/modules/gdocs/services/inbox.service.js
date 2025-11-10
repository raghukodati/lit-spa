// Gdocs Inbox Service - Purchase Orders, Invoices, Acknowledgements
import { get, delay } from '../../../services/api.js';
import { getBusinessPartnerLabelById } from '../../../services/dataService.js';

// Inbox Purchase Orders Cache
let inboxPurchaseOrdersCache = null;
let inboxInvoicesCache = null;
let inboxAcknowledgementsCache = null;

// Load Inbox Purchase Orders
export async function getInboxPurchaseOrders() {
  if (!inboxPurchaseOrdersCache) {
    inboxPurchaseOrdersCache = await get('/gdocs/inbox-purchase-orders.json');
  }
  return [...inboxPurchaseOrdersCache];
}

export async function getInboxPurchaseOrderById(id) {
  const orders = await getInboxPurchaseOrders();
  return orders.find(o => o.id === parseInt(id));
}

export async function createInboxPurchaseOrder(order) {
  await delay(300);
  const orders = await getInboxPurchaseOrders();
  const newOrder = {
    id: Math.max(...orders.map(o => o.id), 0) + 1,
    ...order,
    receivedDate: new Date().toISOString()
  };
  inboxPurchaseOrdersCache.push(newOrder);
  return newOrder;
}

export async function updateInboxPurchaseOrder(id, updates) {
  await delay(300);
  const orders = await getInboxPurchaseOrders();
  const order = orders.find(o => o.id === parseInt(id));
  if (order) {
    Object.assign(order, updates);
    return order;
  }
  return null;
}

export async function deleteInboxPurchaseOrder(id) {
  await delay(300);
  const index = inboxPurchaseOrdersCache.findIndex(o => o.id === parseInt(id));
  if (index !== -1) {
    inboxPurchaseOrdersCache.splice(index, 1);
    return true;
  }
  return false;
}

export function getInboxPOVendors() {
  if (!inboxPurchaseOrdersCache) return [];
  const set = new Set();
  inboxPurchaseOrdersCache.forEach(o => {
    if (o.vendorId) {
      set.add(getBusinessPartnerLabelById(o.vendorId));
    } else if (o.vendor) {
      set.add(o.vendor);
    }
  });
  return [...set].filter(Boolean).sort();
}

export function getInboxPOAccounts() {
  if (!inboxPurchaseOrdersCache) return [];
  const set = new Set();
  inboxPurchaseOrdersCache.forEach(o => {
    if (o.customerId) {
      set.add(getBusinessPartnerLabelById(o.customerId));
    } else if (o.account) {
      set.add(o.account);
    } else if (o.customerName) {
      set.add(o.customerName);
    }
  });
  return [...set].filter(Boolean).sort();
}

export function getInboxPOStatuses() {
  return ['pending', 'approved', 'processed'];
}

// Load Inbox Invoices
export async function getInboxInvoices() {
  if (!inboxInvoicesCache) {
    inboxInvoicesCache = await get('/gdocs/inbox-invoices.json');
  }
  return [...inboxInvoicesCache];
}

export async function getInboxInvoiceById(id) {
  const invoices = await getInboxInvoices();
  return invoices.find(i => i.id === parseInt(id));
}

export async function createInboxInvoice(invoice) {
  await delay(300);
  const invoices = await getInboxInvoices();
  const newInvoice = {
    id: Math.max(...invoices.map(i => i.id), 0) + 1,
    ...invoice,
    receivedDate: new Date().toISOString()
  };
  inboxInvoicesCache.push(newInvoice);
  return newInvoice;
}

export async function updateInboxInvoice(id, updates) {
  await delay(300);
  const invoices = await getInboxInvoices();
  const invoice = invoices.find(i => i.id === parseInt(id));
  if (invoice) {
    Object.assign(invoice, updates);
    return invoice;
  }
  return null;
}

export async function deleteInboxInvoice(id) {
  await delay(300);
  const index = inboxInvoicesCache.findIndex(i => i.id === parseInt(id));
  if (index !== -1) {
    inboxInvoicesCache.splice(index, 1);
    return true;
  }
  return false;
}

// Load Inbox Acknowledgements
export async function getInboxAcknowledgements() {
  if (!inboxAcknowledgementsCache) {
    inboxAcknowledgementsCache = await get('/gdocs/inbox-acknowledgements.json');
  }
  return [...inboxAcknowledgementsCache];
}

export async function getInboxAcknowledgementById(id) {
  const acks = await getInboxAcknowledgements();
  return acks.find(a => a.id === parseInt(id));
}

export async function createInboxAcknowledgement(ack) {
  await delay(300);
  const acks = await getInboxAcknowledgements();
  const newAck = {
    id: Math.max(...acks.map(a => a.id), 0) + 1,
    ...ack,
    receivedDate: new Date().toISOString(),
    ackDate: new Date().toISOString()
  };
  inboxAcknowledgementsCache.push(newAck);
  return newAck;
}

export async function updateInboxAcknowledgement(id, updates) {
  await delay(300);
  const acks = await getInboxAcknowledgements();
  const ack = acks.find(a => a.id === parseInt(id));
  if (ack) {
    Object.assign(ack, updates);
    return ack;
  }
  return null;
}

export async function deleteInboxAcknowledgement(id) {
  await delay(300);
  const index = inboxAcknowledgementsCache.findIndex(a => a.id === parseInt(id));
  if (index !== -1) {
    inboxAcknowledgementsCache.splice(index, 1);
    return true;
  }
  return false;
}
