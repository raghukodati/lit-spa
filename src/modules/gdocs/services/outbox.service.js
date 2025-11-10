// Gdocs Outbox Service - Purchase Orders, Invoices
import { get, delay } from '../../../services/api.js';

// Outbox Cache
let outboxPurchaseOrdersCache = null;
let outboxInvoicesCache = null;

// Outbox Purchase Orders
export async function getOutboxPurchaseOrders() {
  if (!outboxPurchaseOrdersCache) {
    outboxPurchaseOrdersCache = await get('/gdocs/outbox-purchase-orders.json');
  }
  return [...outboxPurchaseOrdersCache];
}

export async function getOutboxPurchaseOrderById(id) {
  const orders = await getOutboxPurchaseOrders();
  return orders.find(o => o.id === parseInt(id));
}

export async function createOutboxPurchaseOrder(order) {
  await delay(300);
  const orders = await getOutboxPurchaseOrders();
  const newOrder = {
    id: Math.max(...orders.map(o => o.id), 0) + 1,
    ...order,
    sentDate: new Date().toISOString(),
    isOpen: true
  };
  outboxPurchaseOrdersCache.push(newOrder);
  return newOrder;
}

export async function updateOutboxPurchaseOrder(id, updates) {
  await delay(300);
  const orders = await getOutboxPurchaseOrders();
  const order = orders.find(o => o.id === parseInt(id));
  if (order) {
    Object.assign(order, updates);
    return order;
  }
  return null;
}

export async function deleteOutboxPurchaseOrder(id) {
  await delay(300);
  const index = outboxPurchaseOrdersCache.findIndex(o => o.id === parseInt(id));
  if (index !== -1) {
    outboxPurchaseOrdersCache.splice(index, 1);
    return true;
  }
  return false;
}

export async function getOpenOutboxPurchaseOrders() {
  const orders = await getOutboxPurchaseOrders();
  return orders.filter(o => o.isOpen);
}

// Outbox Invoices
export async function getOutboxInvoices() {
  if (!outboxInvoicesCache) {
    outboxInvoicesCache = await get('/gdocs/outbox-invoices.json');
  }
  return [...outboxInvoicesCache];
}

export async function getOutboxInvoiceById(id) {
  const invoices = await getOutboxInvoices();
  return invoices.find(i => i.id === parseInt(id));
}

export async function createOutboxInvoice(invoice) {
  await delay(300);
  const invoices = await getOutboxInvoices();
  const newInvoice = {
    id: Math.max(...invoices.map(i => i.id), 0) + 1,
    ...invoice,
    sentDate: new Date().toISOString(),
    isOpen: true,
    amountPaid: 0
  };
  outboxInvoicesCache.push(newInvoice);
  return newInvoice;
}

export async function updateOutboxInvoice(id, updates) {
  await delay(300);
  const invoices = await getOutboxInvoices();
  const invoice = invoices.find(i => i.id === parseInt(id));
  if (invoice) {
    Object.assign(invoice, updates);
    return invoice;
  }
  return null;
}

export async function deleteOutboxInvoice(id) {
  await delay(300);
  const index = outboxInvoicesCache.findIndex(i => i.id === parseInt(id));
  if (index !== -1) {
    outboxInvoicesCache.splice(index, 1);
    return true;
  }
  return false;
}

export async function getOpenOutboxInvoices() {
  const invoices = await getOutboxInvoices();
  return invoices.filter(i => i.isOpen);
}
