/**
 * Quote Service - B2B Quotes and RFQ Management
 */

import { delay } from '../../../services/api.js';
import { Quote } from '../models/quote.model.js';

// Mock quote data
let quotes = [
  {
    id: 1,
    quoteNumber: 'QT-2024-001',
    type: 'standard',
    companyId: 1,
    companyName: 'Acme Corporation',
    contactName: 'John Smith',
    contactEmail: 'john.smith@acme.com',
    contactPhone: '+1-555-0100',
    status: 'sent',
    title: 'Q4 Office Supplies Order',
    description: 'Quarterly office supplies procurement',
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
      },
      {
        productId: 2,
        sku: 'PROD-002',
        name: 'Standing Desk',
        quantity: 25,
        unitPrice: 599.99,
        discount: 15,
        tax: 0,
        total: 12749.79
      }
    ],
    subtotal: 26249.34,
    discountAmount: 3281.17,
    discountPercent: 12.5,
    taxAmount: 1837.45,
    shippingAmount: 500,
    total: 25305.62,
    currency: 'USD',
    paymentTerms: 'Net 30',
    validUntil: '2024-12-31',
    salesRepId: 1,
    salesRepName: 'Sarah Johnson',
    viewCount: 5,
    sentAt: '2024-10-15T10:00:00Z',
    viewedAt: '2024-10-16T09:30:00Z',
    createdAt: '2024-10-14T00:00:00Z',
    updatedAt: '2024-10-16T09:30:00Z'
  },
  {
    id: 2,
    quoteNumber: 'QT-2024-002',
    type: 'rfq',
    companyId: 2,
    companyName: 'TechStart Inc',
    contactName: 'Jane Doe',
    contactEmail: 'jane.doe@techstart.com',
    contactPhone: '+1-555-0200',
    status: 'accepted',
    title: 'Server Hardware Upgrade',
    description: 'Data center infrastructure upgrade',
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
    discountPercent: 0,
    taxAmount: 0,
    shippingAmount: 1000,
    total: 50999.90,
    currency: 'USD',
    paymentTerms: 'Net 60',
    validUntil: '2024-11-30',
    salesRepId: 1,
    salesRepName: 'Sarah Johnson',
    convertedToOrderId: 15,
    convertedAt: '2024-10-20T14:00:00Z',
    viewCount: 8,
    sentAt: '2024-10-10T10:00:00Z',
    viewedAt: '2024-10-11T08:00:00Z',
    createdAt: '2024-10-09T00:00:00Z',
    updatedAt: '2024-10-20T14:00:00Z'
  }
];

let nextQuoteId = 3;

/**
 * Get all quotes
 */
export async function getQuotes(options = {}) {
  await delay(200);
  let result = [...quotes];
  
  // Filter by status
  if (options.status) {
    result = result.filter(q => q.status === options.status);
  }
  
  // Filter by company
  if (options.companyId) {
    result = result.filter(q => q.companyId === parseInt(options.companyId));
  }
  
  // Filter by sales rep
  if (options.salesRepId) {
    result = result.filter(q => q.salesRepId === parseInt(options.salesRepId));
  }
  
  // Filter by type
  if (options.type) {
    result = result.filter(q => q.type === options.type);
  }
  
  // Search
  if (options.search) {
    const search = options.search.toLowerCase();
    result = result.filter(q =>
      q.quoteNumber.toLowerCase().includes(search) ||
      q.companyName.toLowerCase().includes(search) ||
      q.title.toLowerCase().includes(search)
    );
  }
  
  // Sort
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return result.map(q => Quote.fromAPI(q));
}

/**
 * Get quote by ID
 */
export async function getQuoteById(id) {
  await delay(200);
  const quote = quotes.find(q => q.id === parseInt(id));
  return quote ? Quote.fromAPI(quote) : null;
}

/**
 * Get quote by number
 */
export async function getQuoteByNumber(quoteNumber) {
  await delay(200);
  const quote = quotes.find(q => q.quoteNumber === quoteNumber);
  return quote ? Quote.fromAPI(quote) : null;
}

/**
 * Create quote
 */
export async function createQuote(quoteData) {
  await delay(300);
  
  const quote = new Quote(quoteData);
  
  // Generate quote number if not provided
  if (!quote.quoteNumber) {
    const year = new Date().getFullYear();
    quote.quoteNumber = `QT-${year}-${String(nextQuoteId).padStart(3, '0')}`;
  }
  
  quote.calculateTotals();
  
  const validation = quote.validate();
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  const newQuote = {
    ...quote.toJSON(),
    id: nextQuoteId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  quotes.push(newQuote);
  return Quote.fromAPI(newQuote);
}

/**
 * Update quote
 */
export async function updateQuote(id, updates) {
  await delay(300);
  const index = quotes.findIndex(q => q.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Quote not found');
  }
  
  quotes[index] = {
    ...quotes[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Recalculate totals if items changed
  if (updates.items) {
    const quote = Quote.fromAPI(quotes[index]);
    quote.calculateTotals();
    quotes[index] = quote.toJSON();
  }
  
  return Quote.fromAPI(quotes[index]);
}

/**
 * Delete quote
 */
export async function deleteQuote(id) {
  await delay(300);
  const index = quotes.findIndex(q => q.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Quote not found');
  }
  
  quotes.splice(index, 1);
  return true;
}

/**
 * Send quote to customer
 */
export async function sendQuote(id) {
  await delay(300);
  const quote = quotes.find(q => q.id === parseInt(id));
  
  if (!quote) {
    throw new Error('Quote not found');
  }
  
  quote.status = 'sent';
  quote.sentAt = new Date().toISOString();
  quote.updatedAt = new Date().toISOString();
  
  return Quote.fromAPI(quote);
}

/**
 * Mark quote as viewed
 */
export async function markQuoteAsViewed(id) {
  await delay(200);
  const quote = quotes.find(q => q.id === parseInt(id));
  
  if (!quote) {
    throw new Error('Quote not found');
  }
  
  if (quote.status === 'sent') {
    quote.status = 'viewed';
  }
  
  quote.viewedAt = new Date().toISOString();
  quote.viewCount = (quote.viewCount || 0) + 1;
  quote.updatedAt = new Date().toISOString();
  
  return Quote.fromAPI(quote);
}

/**
 * Accept quote
 */
export async function acceptQuote(id) {
  await delay(300);
  const quote = quotes.find(q => q.id === parseInt(id));
  
  if (!quote) {
    throw new Error('Quote not found');
  }
  
  quote.status = 'accepted';
  quote.updatedAt = new Date().toISOString();
  
  return Quote.fromAPI(quote);
}

/**
 * Reject quote
 */
export async function rejectQuote(id, reason) {
  await delay(300);
  const quote = quotes.find(q => q.id === parseInt(id));
  
  if (!quote) {
    throw new Error('Quote not found');
  }
  
  quote.status = 'rejected';
  quote.rejectionReason = reason;
  quote.updatedAt = new Date().toISOString();
  
  return Quote.fromAPI(quote);
}

/**
 * Convert quote to order
 */
export async function convertQuoteToOrder(id) {
  await delay(300);
  const quote = quotes.find(q => q.id === parseInt(id));
  
  if (!quote) {
    throw new Error('Quote not found');
  }
  
  if (quote.status !== 'accepted') {
    throw new Error('Quote must be accepted before conversion');
  }
  
  // In real implementation, this would create an actual order
  const orderId = Math.floor(Math.random() * 1000);
  
  quote.status = 'converted';
  quote.convertedToOrderId = orderId;
  quote.convertedAt = new Date().toISOString();
  quote.updatedAt = new Date().toISOString();
  
  return {
    quote: Quote.fromAPI(quote),
    orderId: orderId
  };
}

/**
 * Duplicate quote
 */
export async function duplicateQuote(id) {
  await delay(300);
  const quote = quotes.find(q => q.id === parseInt(id));
  
  if (!quote) {
    throw new Error('Quote not found');
  }
  
  const newQuote = {
    ...quote,
    id: nextQuoteId++,
    quoteNumber: `QT-${new Date().getFullYear()}-${String(nextQuoteId).padStart(3, '0')}`,
    status: 'draft',
    sentAt: null,
    viewedAt: null,
    viewCount: 0,
    convertedToOrderId: null,
    convertedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  quotes.push(newQuote);
  return Quote.fromAPI(newQuote);
}

/**
 * Get quote statistics
 */
export async function getQuoteStats() {
  await delay(200);
  
  return {
    total: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    rejected: quotes.filter(q => q.status === 'rejected').length,
    converted: quotes.filter(q => q.status === 'converted').length,
    expired: quotes.filter(q => {
      const qt = Quote.fromAPI(q);
      return qt.isExpired;
    }).length,
    totalValue: quotes.reduce((sum, q) => sum + q.total, 0),
    averageValue: quotes.length > 0 ? quotes.reduce((sum, q) => sum + q.total, 0) / quotes.length : 0,
    conversionRate: quotes.filter(q => q.status === 'sent').length > 0 ?
      (quotes.filter(q => q.status === 'converted').length / quotes.filter(q => q.status === 'sent').length) * 100 : 0
  };
}

export default {
  getQuotes,
  getQuoteById,
  getQuoteByNumber,
  createQuote,
  updateQuote,
  deleteQuote,
  sendQuote,
  markQuoteAsViewed,
  acceptQuote,
  rejectQuote,
  convertQuoteToOrder,
  duplicateQuote,
  getQuoteStats
};
