/**
 * Cart Service - Shopping Cart Management
 */

import { delay } from '../../../services/api.js';
import { Cart } from '../models/cart.model.js';
import { getProductById } from './product.service.js';

// Mock cart storage (in-memory)
let carts = {};

/**
 * Get or create cart for session/customer
 */
export async function getCart(sessionId, customerId = null) {
  await delay(200);
  
  const key = customerId || sessionId;
  
  if (!carts[key]) {
    carts[key] = {
      id: key,
      sessionId: sessionId,
      customerId: customerId,
      items: [],
      subtotal: 0,
      tax: 0,
      taxRate: 10, // 10% tax
      shipping: 0,
      discount: 0,
      discountCode: '',
      total: 0,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
  }
  
  return Cart.fromAPI(carts[key]);
}

/**
 * Add item to cart
 */
export async function addToCart(sessionId, productId, quantity = 1, customerId = null) {
  await delay(300);
  
  const product = await getProductById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  if (!product.isInStock()) {
    throw new Error('Product is out of stock');
  }
  
  const cart = await getCart(sessionId, customerId);
  cart.addItem(product, quantity);
  
  const key = customerId || sessionId;
  carts[key] = cart.toJSON();
  
  return Cart.fromAPI(carts[key]);
}

/**
 * Remove item from cart
 */
export async function removeFromCart(sessionId, productId, customerId = null) {
  await delay(200);
  
  const cart = await getCart(sessionId, customerId);
  cart.removeItem(productId);
  
  const key = customerId || sessionId;
  carts[key] = cart.toJSON();
  
  return Cart.fromAPI(carts[key]);
}

/**
 * Update item quantity
 */
export async function updateCartItemQuantity(sessionId, productId, quantity, customerId = null) {
  await delay(200);
  
  const cart = await getCart(sessionId, customerId);
  cart.updateQuantity(productId, quantity);
  
  const key = customerId || sessionId;
  carts[key] = cart.toJSON();
  
  return Cart.fromAPI(carts[key]);
}

/**
 * Clear cart
 */
export async function clearCart(sessionId, customerId = null) {
  await delay(200);
  
  const cart = await getCart(sessionId, customerId);
  cart.clear();
  
  const key = customerId || sessionId;
  carts[key] = cart.toJSON();
  
  return Cart.fromAPI(carts[key]);
}

/**
 * Apply discount code
 */
export async function applyDiscountCode(sessionId, discountCode, customerId = null) {
  await delay(300);
  
  // Mock discount validation (in real app, validate against discount service)
  const validDiscounts = {
    'SAVE10': { type: 'percentage', value: 10 },
    'SAVE20': { type: 'percentage', value: 20 },
    'FLAT50': { type: 'fixed', value: 50 }
  };
  
  const discount = validDiscounts[discountCode.toUpperCase()];
  if (!discount) {
    throw new Error('Invalid discount code');
  }
  
  const cart = await getCart(sessionId, customerId);
  
  let discountAmount = 0;
  if (discount.type === 'percentage') {
    discountAmount = (cart.subtotal * discount.value) / 100;
  } else if (discount.type === 'fixed') {
    discountAmount = discount.value;
  }
  
  cart.applyDiscount(discountCode, discountAmount);
  
  const key = customerId || sessionId;
  carts[key] = cart.toJSON();
  
  return Cart.fromAPI(carts[key]);
}

/**
 * Remove discount code
 */
export async function removeDiscountCode(sessionId, customerId = null) {
  await delay(200);
  
  const cart = await getCart(sessionId, customerId);
  cart.removeDiscount();
  
  const key = customerId || sessionId;
  carts[key] = cart.toJSON();
  
  return Cart.fromAPI(carts[key]);
}

/**
 * Update shipping cost
 */
export async function updateShipping(sessionId, shippingCost, customerId = null) {
  await delay(200);
  
  const cart = await getCart(sessionId, customerId);
  cart.shipping = shippingCost;
  cart.calculateTotals();
  
  const key = customerId || sessionId;
  carts[key] = cart.toJSON();
  
  return Cart.fromAPI(carts[key]);
}

/**
 * Merge carts (when user logs in)
 */
export async function mergeCarts(sessionId, customerId) {
  await delay(300);
  
  const sessionCart = carts[sessionId];
  const customerCart = carts[customerId];
  
  if (!sessionCart) {
    return customerCart ? Cart.fromAPI(customerCart) : await getCart(sessionId, customerId);
  }
  
  if (!customerCart) {
    // Transfer session cart to customer
    carts[customerId] = { ...sessionCart, customerId: customerId };
    delete carts[sessionId];
    return Cart.fromAPI(carts[customerId]);
  }
  
  // Merge both carts
  const merged = Cart.fromAPI(customerCart);
  sessionCart.items.forEach(item => {
    merged.addItem({ id: item.productId, ...item }, item.quantity);
  });
  
  carts[customerId] = merged.toJSON();
  delete carts[sessionId];
  
  return merged;
}

/**
 * Get cart count
 */
export async function getCartItemCount(sessionId, customerId = null) {
  await delay(100);
  const cart = await getCart(sessionId, customerId);
  return cart.getItemCount();
}

export default {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  applyDiscountCode,
  removeDiscountCode,
  updateShipping,
  mergeCarts,
  getCartItemCount
};
