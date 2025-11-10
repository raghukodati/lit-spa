/**
 * Order Service - E-commerce Order Management
 */

import { delay } from '../../../services/api.js';
import { Order } from '../models/order.model.js';

// Mock order data
let orders = [
  {
    id: 1,
    orderNumber: 'ORD-2411-0001',
    customerId: 1,
    customerEmail: 'john.doe@example.com',
    items: [
      { productId: 1, name: 'Professional Laptop', sku: 'LAPTOP-001', quantity: 1, price: 1299.99, total: 1299.99 }
    ],
    subtotal: 1299.99,
    tax: 130.00,
    taxRate: 10,
    shipping: 25.00,
    discount: 0,
    total: 1454.99,
    status: 'delivered',
    paymentStatus: 'paid',
    fulfillmentStatus: 'fulfilled',
    createdAt: '2024-11-01T10:00:00Z'
  }
];
let nextOrderId = 2;

/**
 * Get all orders with filtering and pagination
 */
export async function getOrders(options = {}) {
  await delay(300);
  let result = [...orders];
  
  // Filtering
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    result = result.filter(o => 
      o.orderNumber.toLowerCase().includes(searchLower) ||
      o.customerEmail.toLowerCase().includes(searchLower)
    );
  }
  
  if (options.customerId) {
    result = result.filter(o => o.customerId === options.customerId);
  }
  
  if (options.status) {
    result = result.filter(o => o.status === options.status);
  }
  
  if (options.paymentStatus) {
    result = result.filter(o => o.paymentStatus === options.paymentStatus);
  }
  
  if (options.fulfillmentStatus) {
    result = result.filter(o => o.fulfillmentStatus === options.fulfillmentStatus);
  }
  
  if (options.startDate) {
    result = result.filter(o => new Date(o.createdAt) >= new Date(options.startDate));
  }
  
  if (options.endDate) {
    result = result.filter(o => new Date(o.createdAt) <= new Date(options.endDate));
  }
  
  // Sorting
  if (options.sortBy) {
    result.sort((a, b) => {
      let aVal = a[options.sortBy];
      let bVal = b[options.sortBy];
      
      if (options.sortOrder === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
    });
  } else {
    // Default: newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  const total = result.length;
  
  // Pagination
  if (options.page && options.pageSize) {
    const start = (options.page - 1) * options.pageSize;
    const end = start + options.pageSize;
    result = result.slice(start, end);
  }
  
  return {
    data: result.map(o => Order.fromAPI(o)),
    total: total,
    page: options.page || 1,
    pageSize: options.pageSize || total,
    totalPages: options.pageSize ? Math.ceil(total / options.pageSize) : 1
  };
}

/**
 * Get order by ID
 */
export async function getOrderById(id) {
  await delay(200);
  const order = orders.find(o => o.id === parseInt(id));
  return order ? Order.fromAPI(order) : null;
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber) {
  await delay(200);
  const order = orders.find(o => o.orderNumber === orderNumber);
  return order ? Order.fromAPI(order) : null;
}

/**
 * Create order
 */
export async function createOrder(orderData) {
  await delay(300);
  
  const order = new Order(orderData);
  const validation = order.validate();
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  // Generate order number if not provided
  if (!order.orderNumber) {
    order.generateOrderNumber();
  }
  
  // Calculate totals
  order.calculateTotals();
  
  const newOrder = {
    ...order.toJSON(),
    id: nextOrderId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  return Order.fromAPI(newOrder);
}

/**
 * Update order
 */
export async function updateOrder(id, updates) {
  await delay(300);
  const index = orders.findIndex(o => o.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Order not found');
  }
  
  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return Order.fromAPI(orders[index]);
}

/**
 * Update order status
 */
export async function updateOrderStatus(id, status) {
  await delay(200);
  const order = orders.find(o => o.id === parseInt(id));
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  order.status = status;
  order.updatedAt = new Date().toISOString();
  
  if (status === 'delivered') {
    order.completedAt = new Date().toISOString();
    order.deliveredDate = new Date().toISOString();
  } else if (status === 'cancelled') {
    order.cancelledAt = new Date().toISOString();
  }
  
  return Order.fromAPI(order);
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(id, paymentStatus, transactionId = null) {
  await delay(200);
  const order = orders.find(o => o.id === parseInt(id));
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  order.paymentStatus = paymentStatus;
  if (transactionId) {
    order.transactionId = transactionId;
  }
  if (paymentStatus === 'paid') {
    order.paymentDate = new Date().toISOString();
  }
  order.updatedAt = new Date().toISOString();
  
  return Order.fromAPI(order);
}

/**
 * Update fulfillment status
 */
export async function updateFulfillmentStatus(id, fulfillmentStatus, trackingInfo = {}) {
  await delay(200);
  const order = orders.find(o => o.id === parseInt(id));
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  order.fulfillmentStatus = fulfillmentStatus;
  if (trackingInfo.trackingNumber) order.trackingNumber = trackingInfo.trackingNumber;
  if (trackingInfo.carrier) order.carrier = trackingInfo.carrier;
  if (trackingInfo.trackingUrl) order.trackingUrl = trackingInfo.trackingUrl;
  
  if (fulfillmentStatus === 'fulfilled') {
    order.shippedDate = new Date().toISOString();
  }
  
  order.updatedAt = new Date().toISOString();
  
  return Order.fromAPI(order);
}

/**
 * Cancel order
 */
export async function cancelOrder(id, reason = '') {
  await delay(300);
  const order = orders.find(o => o.id === parseInt(id));
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  const orderModel = Order.fromAPI(order);
  if (!orderModel.canCancel()) {
    throw new Error('Order cannot be cancelled');
  }
  
  order.status = 'cancelled';
  order.cancelledAt = new Date().toISOString();
  order.notes = (order.notes ? order.notes + '\n' : '') + `Cancelled: ${reason}`;
  order.updatedAt = new Date().toISOString();
  
  return Order.fromAPI(order);
}

/**
 * Refund order
 */
export async function refundOrder(id, reason = '') {
  await delay(300);
  const order = orders.find(o => o.id === parseInt(id));
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  const orderModel = Order.fromAPI(order);
  if (!orderModel.canRefund()) {
    throw new Error('Order cannot be refunded');
  }
  
  order.status = 'refunded';
  order.paymentStatus = 'refunded';
  order.notes = (order.notes ? order.notes + '\n' : '') + `Refunded: ${reason}`;
  order.updatedAt = new Date().toISOString();
  
  return Order.fromAPI(order);
}

/**
 * Get orders by customer
 */
export async function getOrdersByCustomer(customerId, options = {}) {
  return getOrders({ ...options, customerId });
}

/**
 * Get order statistics
 */
export async function getOrderStats(startDate = null, endDate = null) {
  await delay(200);
  
  let filteredOrders = [...orders];
  
  if (startDate) {
    filteredOrders = filteredOrders.filter(o => new Date(o.createdAt) >= new Date(startDate));
  }
  
  if (endDate) {
    filteredOrders = filteredOrders.filter(o => new Date(o.createdAt) <= new Date(endDate));
  }
  
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const ordersByStatus = {
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    processing: filteredOrders.filter(o => o.status === 'processing').length,
    shipped: filteredOrders.filter(o => o.status === 'shipped').length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
    refunded: filteredOrders.filter(o => o.status === 'refunded').length
  };
  
  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    ordersByStatus
  };
}

export default {
  getOrders,
  getOrderById,
  getOrderByNumber,
  createOrder,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus,
  updateFulfillmentStatus,
  cancelOrder,
  refundOrder,
  getOrdersByCustomer,
  getOrderStats
};
