// Analytics Service - Analytics and forecast data management
import { delay } from '../../../services/api.js';
import { Forecast } from '../models/forecast.model.js';

// Sales by Month data (mock data for now)
const salesByMonth = [
  { month: 'Jan 2024', sales: 45200, target: 50000 },
  { month: 'Feb 2024', sales: 52300, target: 50000 },
  { month: 'Mar 2024', sales: 48900, target: 50000 },
  { month: 'Apr 2024', sales: 61500, target: 55000 },
  { month: 'May 2024', sales: 58700, target: 55000 },
  { month: 'Jun 2024', sales: 67200, target: 60000 },
  { month: 'Jul 2024', sales: 71800, target: 65000 },
  { month: 'Aug 2024', sales: 69300, target: 65000 },
  { month: 'Sep 2024', sales: 74500, target: 70000 },
  { month: 'Oct 2024', sales: 78900, target: 75000 },
];

// Sales by Customer data (mock data for now)
const salesByCustomer = [
  { customer: 'Acme Corp', sales: 125600, orders: 45 },
  { customer: 'TechStart Inc', sales: 98700, orders: 32 },
  { customer: 'Global Systems', sales: 87400, orders: 28 },
  { customer: 'Innovate Ltd', sales: 76200, orders: 25 },
  { customer: 'FutureTech', sales: 65800, orders: 22 },
  { customer: 'Digital Dynamics', sales: 54300, orders: 18 },
  { customer: 'Smart Solutions', sales: 43700, orders: 15 },
  { customer: 'Alpha Industries', sales: 38900, orders: 12 },
];

// Forecast Data (mock data for now)
const forecastData = [
  // Acme Corp
  { id: 1, customer: 'Acme Corp', month: 'Nov 2024', forecastValue: 13500, actualRevenue: 0, performance: 0, status: 'Pending' },
  { id: 2, customer: 'Acme Corp', month: 'Oct 2024', forecastValue: 12800, actualRevenue: 13200, performance: 103.1, status: 'Exceeded' },
  { id: 3, customer: 'Acme Corp', month: 'Sep 2024', forecastValue: 12000, actualRevenue: 11800, performance: 98.3, status: 'Met' },
  
  // TechStart Inc
  { id: 4, customer: 'TechStart Inc', month: 'Nov 2024', forecastValue: 10500, actualRevenue: 0, performance: 0, status: 'Pending' },
  { id: 5, customer: 'TechStart Inc', month: 'Oct 2024', forecastValue: 10200, actualRevenue: 10800, performance: 105.9, status: 'Exceeded' },
  { id: 6, customer: 'TechStart Inc', month: 'Sep 2024', forecastValue: 9800, actualRevenue: 9500, performance: 96.9, status: 'Below' },
  
  // Global Systems
  { id: 7, customer: 'Global Systems', month: 'Nov 2024', forecastValue: 9200, actualRevenue: 0, performance: 0, status: 'Pending' },
  { id: 8, customer: 'Global Systems', month: 'Oct 2024', forecastValue: 8900, actualRevenue: 9100, performance: 102.2, status: 'Exceeded' },
  { id: 9, customer: 'Global Systems', month: 'Sep 2024', forecastValue: 8500, actualRevenue: 8400, performance: 98.8, status: 'Met' },
  
  // Innovate Ltd
  { id: 10, customer: 'Innovate Ltd', month: 'Nov 2024', forecastValue: 8100, actualRevenue: 0, performance: 0, status: 'Pending' },
  { id: 11, customer: 'Innovate Ltd', month: 'Oct 2024', forecastValue: 7800, actualRevenue: 8200, performance: 105.1, status: 'Exceeded' },
  { id: 12, customer: 'Innovate Ltd', month: 'Sep 2024', forecastValue: 7500, actualRevenue: 7200, performance: 96.0, status: 'Below' },
];

// Analytics API
export async function getSalesByMonth() {
  await delay(200);
  return [...salesByMonth];
}

export async function getSalesByCustomer() {
  await delay(200);
  return [...salesByCustomer];
}

export async function getForecastData(filters = {}) {
  await delay(200);
  let result = [...forecastData];
  
  if (filters.customer) {
    result = result.filter(f => f.customer === filters.customer);
  }
  
  if (filters.month) {
    result = result.filter(f => f.month === filters.month);
  }
  
  if (filters.status) {
    result = result.filter(f => f.status === filters.status);
  }
  
  return result;
}

export function getCustomerList() {
  return [...new Set(forecastData.map(f => f.customer))];
}

export function getMonthList() {
  return [...new Set(forecastData.map(f => f.month))];
}

// Forecast Management (for forecast-list and forecast-form)
export function getForecastYears() {
  return ['2024', '2025'];
}

export function getForecastMonths() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months;
}

export function getForecastCustomers() {
  return [...new Set(forecastData.map(f => f.customer))].sort();
}

// ========================================
// FORECAST MANAGEMENT CRUD
// ========================================

let forecasts = [
  { id: 1, customerName: 'Acme Corp', year: '2024', month: 'January', forecastValue: 125000, commissionPercent: 8.5, commissionDollar: 10625, createdDate: '2024-01-05' },
  { id: 2, customerName: 'Acme Corp', year: '2024', month: 'February', forecastValue: 132000, commissionPercent: 8.5, commissionDollar: 11220, createdDate: '2024-02-05' },
  { id: 3, customerName: 'TechStart Inc', year: '2024', month: 'January', forecastValue: 98000, commissionPercent: 7.5, commissionDollar: 7350, createdDate: '2024-01-05' },
  { id: 4, customerName: 'TechStart Inc', year: '2024', month: 'February', forecastValue: 105000, commissionPercent: 7.5, commissionDollar: 7875, createdDate: '2024-02-05' },
  { id: 5, customerName: 'Global Systems', year: '2024', month: 'January', forecastValue: 87000, commissionPercent: 7.0, commissionDollar: 6090, createdDate: '2024-01-05' },
  { id: 6, customerName: 'Global Systems', year: '2024', month: 'February', forecastValue: 92000, commissionPercent: 7.0, commissionDollar: 6440, createdDate: '2024-02-05' },
  { id: 7, customerName: 'Innovate Ltd', year: '2024', month: 'January', forecastValue: 76000, commissionPercent: 6.5, commissionDollar: 4940, createdDate: '2024-01-05' },
  { id: 8, customerName: 'Innovate Ltd', year: '2024', month: 'February', forecastValue: 81000, commissionPercent: 6.5, commissionDollar: 5265, createdDate: '2024-02-05' },
  { id: 9, customerName: 'FutureTech', year: '2024', month: 'January', forecastValue: 65000, commissionPercent: 6.0, commissionDollar: 3900, createdDate: '2024-01-05' },
  { id: 10, customerName: 'FutureTech', year: '2024', month: 'February', forecastValue: 70000, commissionPercent: 6.0, commissionDollar: 4200, createdDate: '2024-02-05' },
  { id: 11, customerName: 'Digital Dynamics', year: '2024', month: 'January', forecastValue: 54000, commissionPercent: 5.5, commissionDollar: 2970, createdDate: '2024-01-05' },
  { id: 12, customerName: 'Digital Dynamics', year: '2024', month: 'February', forecastValue: 58000, commissionPercent: 5.5, commissionDollar: 3190, createdDate: '2024-02-05' },
  { id: 13, customerName: 'Smart Solutions', year: '2024', month: 'January', forecastValue: 43000, commissionPercent: 5.0, commissionDollar: 2150, createdDate: '2024-01-05' },
  { id: 14, customerName: 'Smart Solutions', year: '2024', month: 'February', forecastValue: 47000, commissionPercent: 5.0, commissionDollar: 2350, createdDate: '2024-02-05' },
  { id: 15, customerName: 'Alpha Industries', year: '2024', month: 'January', forecastValue: 38000, commissionPercent: 4.5, commissionDollar: 1710, createdDate: '2024-01-05' },
  { id: 16, customerName: 'Alpha Industries', year: '2024', month: 'February', forecastValue: 42000, commissionPercent: 4.5, commissionDollar: 1890, createdDate: '2024-02-05' },
  { id: 17, customerName: 'Acme Corp', year: '2024', month: 'March', forecastValue: 138000, commissionPercent: 8.5, commissionDollar: 11730, createdDate: '2024-03-05' },
  { id: 18, customerName: 'TechStart Inc', year: '2024', month: 'March', forecastValue: 110000, commissionPercent: 7.5, commissionDollar: 8250, createdDate: '2024-03-05' },
  { id: 19, customerName: 'Global Systems', year: '2024', month: 'March', forecastValue: 95000, commissionPercent: 7.0, commissionDollar: 6650, createdDate: '2024-03-05' },
  { id: 20, customerName: 'Innovate Ltd', year: '2024', month: 'March', forecastValue: 84000, commissionPercent: 6.5, commissionDollar: 5460, createdDate: '2024-03-05' },
];
let nextForecastId = 21;

export async function getForecasts(options = {}) {
  await delay(300);
  let result = [...forecasts];
  
  // Filtering
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    result = result.filter(f => 
      f.customerName.toLowerCase().includes(searchLower) ||
      f.year.includes(searchLower) ||
      f.month.toLowerCase().includes(searchLower)
    );
  }
  
  if (options.customerName) {
    result = result.filter(f => f.customerName === options.customerName);
  }
  
  if (options.year) {
    result = result.filter(f => f.year === options.year);
  }
  
  if (options.month) {
    result = result.filter(f => f.month === options.month);
  }
  
  // Sorting
  if (options.sortBy) {
    result.sort((a, b) => {
      let aVal = a[options.sortBy];
      let bVal = b[options.sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (options.sortOrder === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
    });
  }
  
  const total = result.length;
  
  // Pagination
  if (options.page && options.pageSize) {
    const start = (options.page - 1) * options.pageSize;
    const end = start + options.pageSize;
    result = result.slice(start, end);
  }
  
  return {
    data: result,
    total: total,
    page: options.page || 1,
    pageSize: options.pageSize || total,
    totalPages: options.pageSize ? Math.ceil(total / options.pageSize) : 1
  };
}

export async function getForecastById(id) {
  await delay(200);
  return forecasts.find(f => f.id === parseInt(id)) || null;
}

export async function createForecast(forecast) {
  await delay(300);
  const newForecast = {
    id: nextForecastId++,
    ...forecast,
    commissionDollar: (forecast.forecastValue * forecast.commissionPercent) / 100,
    createdDate: new Date().toISOString().split('T')[0],
  };
  forecasts.push(newForecast);
  return newForecast;
}

export async function updateForecast(id, updates) {
  await delay(300);
  const forecast = forecasts.find(f => f.id === id);
  if (forecast) {
    Object.assign(forecast, updates);
    // Recalculate commission dollar if needed
    if (updates.forecastValue !== undefined || updates.commissionPercent !== undefined) {
      forecast.commissionDollar = (forecast.forecastValue * forecast.commissionPercent) / 100;
    }
    return forecast;
  }
  return null;
}

export async function deleteForecast(id) {
  await delay(300);
  const index = forecasts.findIndex(f => f.id === id);
  if (index !== -1) {
    forecasts.splice(index, 1);
    return true;
  }
  return false;
}

// ========================================
// MODEL-BASED METHODS (NEW)
// ========================================

/**
 * Get forecast as model instance with validation
 */
export async function getForecastModel(id) {
  const data = await getForecastById(id);
  if (!data) return null;
  
  // Convert to Forecast model
  return new Forecast({
    id: data.id,
    year: parseInt(data.year),
    month: getMonthNumber(data.month),
    customer: data.customerName,
    revenue: data.forecastValue,
    cost: 0, // Not tracked in current data
    notes: '',
    status: 'Draft'
  });
}

/**
 * Create forecast using model with validation
 */
export async function createForecastModel(forecastModel) {
  // Validate model
  const validation = forecastModel.validate();
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  // Calculate profit
  forecastModel.calculateProfit();
  
  // Convert to service format and create
  const serviceData = {
    customerName: forecastModel.customer,
    year: forecastModel.year.toString(),
    month: getMonthName(forecastModel.month),
    forecastValue: forecastModel.revenue,
    commissionPercent: 7.0, // Default
  };
  
  return await createForecast(serviceData);
}

/**
 * Update forecast using model
 */
export async function updateForecastModel(id, forecastModel) {
  const validation = forecastModel.validate();
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  forecastModel.calculateProfit();
  
  const serviceData = {
    customerName: forecastModel.customer,
    year: forecastModel.year.toString(),
    month: getMonthName(forecastModel.month),
    forecastValue: forecastModel.revenue,
  };
  
  return await updateForecast(id, serviceData);
}

// Helper functions
function getMonthNumber(monthName) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(monthName) + 1;
}

function getMonthName(monthNumber) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthNumber - 1] || 'January';
}
