// Incident Service - SLA incident management
import { get, delay } from '../../../services/api.js';

// Cache for incidents
let incidentsCache = null;

// Load incidents from API
export async function getIncidents() {
  if (!incidentsCache) {
    incidentsCache = await get('/incidents.json');
  }
  return [...incidentsCache];
}

// Get incident by ID
export async function getIncidentById(id) {
  const incidents = await getIncidents();
  return incidents.find(i => i.id === parseInt(id));
}

// Get incident by number
export async function getIncidentByNumber(number) {
  const incidents = await getIncidents();
  return incidents.find(i => i.incidentNumber === number);
}

// Create incident
export async function createIncident(incidentData) {
  await delay(500);
  
  const incidents = await getIncidents();
  const newIncident = {
    id: Math.max(...incidents.map(i => i.id)) + 1,
    incidentNumber: `INC-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(3, '0')}`,
    ...incidentData,
    reportedDate: new Date().toISOString(),
    resolvedDate: null,
    resolutionTime: null,
    slaMet: true,
    status: incidentData.status || 'open'
  };
  
  incidents.push(newIncident);
  incidentsCache = incidents;
  
  // Update localStorage cache
  localStorage.setItem('incidents_cache', JSON.stringify(incidents));
  
  return newIncident;
}

// Update incident
export async function updateIncident(id, updates) {
  await delay(500);
  
  const incidents = await getIncidents();
  const index = incidents.findIndex(i => i.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Incident not found');
  }
  
  // Calculate resolution time if resolving
  if (updates.status === 'resolved' && !incidents[index].resolvedDate) {
    updates.resolvedDate = new Date().toISOString();
    const reportedDate = new Date(incidents[index].reportedDate);
    const resolvedDate = new Date(updates.resolvedDate);
    updates.resolutionTime = (resolvedDate - reportedDate) / (1000 * 60 * 60); // hours
    updates.slaMet = updates.resolutionTime <= incidents[index].slaTarget;
  }
  
  incidents[index] = { ...incidents[index], ...updates };
  incidentsCache = incidents;
  
  // Update localStorage cache
  localStorage.setItem('incidents_cache', JSON.stringify(incidents));
  
  return incidents[index];
}

// Delete incident
export async function deleteIncident(id) {
  await delay(500);
  
  const incidents = await getIncidents();
  const index = incidents.findIndex(i => i.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Incident not found');
  }
  
  incidents.splice(index, 1);
  incidentsCache = incidents;
  
  // Update localStorage cache
  localStorage.setItem('incidents_cache', JSON.stringify(incidents));
  
  return true;
}

// Get incidents by category
export async function getIncidentsByCategory(category) {
  const incidents = await getIncidents();
  return incidents.filter(i => i.category === category);
}

// Get incidents by status
export async function getIncidentsByStatus(status) {
  const incidents = await getIncidents();
  return incidents.filter(i => i.status === status);
}

// Get SLA metrics
export async function getSLAMetrics() {
  const incidents = await getIncidents();
  
  const categories = {
    problem_resolution: { name: 'Problem Resolution', incidents: [] },
    claim_resolution: { name: 'Claim Resolution', incidents: [] },
    order_confirmation: { name: 'Order Confirmation', incidents: [] },
    inventory_accuracy: { name: 'Inventory Accuracy', incidents: [] },
    sourcing: { name: 'Sourcing', incidents: [] },
    urgent_orders: { name: 'Urgent Orders', incidents: [] }
  };
  
  incidents.forEach(incident => {
    if (categories[incident.category]) {
      categories[incident.category].incidents.push(incident);
    }
  });
  
  const metrics = {};
  
  Object.keys(categories).forEach(key => {
    const categoryIncidents = categories[key].incidents;
    const resolvedIncidents = categoryIncidents.filter(i => i.status === 'resolved');
    const slaMetCount = resolvedIncidents.filter(i => i.slaMet).length;
    
    metrics[key] = {
      name: categories[key].name,
      total: categoryIncidents.length,
      resolved: resolvedIncidents.length,
      slaMet: slaMetCount,
      slaPercentage: resolvedIncidents.length > 0 
        ? Math.round((slaMetCount / resolvedIncidents.length) * 100) 
        : 0,
      open: categoryIncidents.filter(i => i.status === 'open').length,
      inProgress: categoryIncidents.filter(i => i.status === 'in_progress').length,
      avgResolutionTime: resolvedIncidents.length > 0
        ? (resolvedIncidents.reduce((sum, i) => sum + (i.resolutionTime || 0), 0) / resolvedIncidents.length).toFixed(2)
        : 0,
      targetSLA: categoryIncidents.length > 0 ? categoryIncidents[0].slaTarget : 0
    };
  });
  
  return metrics;
}

// Get overall SLA dashboard stats
export async function getSLADashboardStats() {
  const incidents = await getIncidents();
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved');
  const slaMetCount = resolvedIncidents.filter(i => i.slaMet).length;
  
  return {
    totalIncidents: incidents.length,
    openIncidents: incidents.filter(i => i.status === 'open').length,
    inProgressIncidents: incidents.filter(i => i.status === 'in_progress').length,
    resolvedIncidents: resolvedIncidents.length,
    slaMetCount: slaMetCount,
    slaMetPercentage: resolvedIncidents.length > 0 
      ? Math.round((slaMetCount / resolvedIncidents.length) * 100) 
      : 0,
    criticalIncidents: incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length,
    urgentIncidents: incidents.filter(i => i.priority === 'urgent' && i.status !== 'resolved').length,
    avgResolutionTime: resolvedIncidents.length > 0
      ? (resolvedIncidents.reduce((sum, i) => sum + (i.resolutionTime || 0), 0) / resolvedIncidents.length).toFixed(2)
      : 0
  };
}

// Initialize incidents cache
export async function initializeIncidentsCache() {
  try {
    const incidents = await getIncidents();
    localStorage.setItem('incidents_cache', JSON.stringify(incidents));
    return incidents;
  } catch (error) {
    console.error('Failed to initialize incidents cache:', error);
    return [];
  }
}

// Export to CSV
export function exportIncidentsToCSV(incidents) {
  const headers = [
    'Incident Number',
    'Title',
    'Category',
    'Priority',
    'Status',
    'Severity',
    'Reported By',
    'Assigned To',
    'Reported Date',
    'Due Date',
    'Resolved Date',
    'Resolution Time (hrs)',
    'SLA Target (hrs)',
    'SLA Met',
    'Impacted Customers'
  ];
  
  const rows = incidents.map(incident => [
    incident.incidentNumber,
    incident.title,
    incident.category,
    incident.priority,
    incident.status,
    incident.severity,
    incident.reportedBy,
    incident.assignedTo,
    new Date(incident.reportedDate).toLocaleString(),
    new Date(incident.dueDate).toLocaleString(),
    incident.resolvedDate ? new Date(incident.resolvedDate).toLocaleString() : 'N/A',
    incident.resolutionTime || 'N/A',
    incident.slaTarget,
    incident.slaMet ? 'Yes' : 'No',
    incident.impactedCustomers
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}
