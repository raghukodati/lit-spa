// Gdocs Service - Document management with sample data
import { delay } from '../../../services/api.js';

// Authors Entity
let authors = [
  { id: 1, name: 'John Doe', email: 'john.doe@company.com', department: 'Product', avatar: 'JD', documentsCount: 2 },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', department: 'Finance', avatar: 'JS', documentsCount: 2 },
  { id: 3, name: 'Bob Johnson', email: 'bob.johnson@company.com', department: 'Marketing', avatar: 'BJ', documentsCount: 2 },
  { id: 4, name: 'Alice Williams', email: 'alice.williams@company.com', department: 'HR', avatar: 'AW', documentsCount: 2 },
  { id: 5, name: 'Mike Davis', email: 'mike.davis@company.com', department: 'Engineering', avatar: 'MD', documentsCount: 2 },
  { id: 6, name: 'Sarah Miller', email: 'sarah.miller@company.com', department: 'Sales', avatar: 'SM', documentsCount: 2 },
  { id: 7, name: 'Emily Brown', email: 'emily.brown@company.com', department: 'Design', avatar: 'EB', documentsCount: 1 },
  { id: 8, name: 'Tom Wilson', email: 'tom.wilson@company.com', department: 'Security', avatar: 'TW', documentsCount: 2 },
];

// Documents Entity
let gdocs = [
  { id: 1, title: 'Project Proposal 2024', authorId: 1, category: 'Proposals', status: 'Published', size: '2.5 MB', version: '3.2', lastModified: '2024-10-28', tags: ['proposal', 'project', '2024'], shared: 5, views: 156 },
  { id: 2, title: 'Q3 Financial Report', authorId: 2, category: 'Reports', status: 'Draft', size: '4.1 MB', version: '1.0', lastModified: '2024-10-29', tags: ['finance', 'Q3', 'report'], shared: 3, views: 89 },
  { id: 3, title: 'Marketing Strategy', authorId: 3, category: 'Strategy', status: 'Published', size: '1.8 MB', version: '2.5', lastModified: '2024-10-27', tags: ['marketing', 'strategy'], shared: 8, views: 234 },
  { id: 4, title: 'Employee Handbook', authorId: 4, category: 'HR', status: 'Published', size: '3.2 MB', version: '5.0', lastModified: '2024-10-25', tags: ['HR', 'handbook'], shared: 45, views: 567 },
  { id: 5, title: 'Product Roadmap 2025', authorId: 1, category: 'Planning', status: 'Draft', size: '2.9 MB', version: '1.3', lastModified: '2024-10-29', tags: ['product', 'roadmap', '2025'], shared: 6, views: 123 },
  { id: 6, title: 'Technical Specification', authorId: 5, category: 'Technical', status: 'Review', size: '5.4 MB', version: '2.1', lastModified: '2024-10-28', tags: ['technical', 'spec'], shared: 4, views: 78 },
  { id: 7, title: 'Sales Presentation', authorId: 6, category: 'Sales', status: 'Published', size: '6.7 MB', version: '1.8', lastModified: '2024-10-26', tags: ['sales', 'presentation'], shared: 12, views: 345 },
  { id: 8, title: 'API Documentation', authorId: 5, category: 'Technical', status: 'Published', size: '2.1 MB', version: '4.5', lastModified: '2024-10-24', tags: ['API', 'docs', 'technical'], shared: 20, views: 892 },
  { id: 9, title: 'Training Manual', authorId: 4, category: 'Training', status: 'Published', size: '4.8 MB', version: '3.0', lastModified: '2024-10-23', tags: ['training', 'manual'], shared: 25, views: 456 },
  { id: 10, title: 'Budget Analysis 2024', authorId: 2, category: 'Finance', status: 'Published', size: '3.5 MB', version: '2.0', lastModified: '2024-10-22', tags: ['budget', 'finance', '2024'], shared: 7, views: 234 },
  { id: 11, title: 'UX Design Guidelines', authorId: 7, category: 'Design', status: 'Draft', size: '7.2 MB', version: '1.5', lastModified: '2024-10-29', tags: ['UX', 'design', 'guidelines'], shared: 9, views: 167 },
  { id: 12, title: 'Security Policy', authorId: 8, category: 'Security', status: 'Published', size: '1.9 MB', version: '6.0', lastModified: '2024-10-21', tags: ['security', 'policy'], shared: 35, views: 678 },
  { id: 13, title: 'Customer Survey Results', authorId: 6, category: 'Research', status: 'Published', size: '2.6 MB', version: '1.0', lastModified: '2024-10-20', tags: ['survey', 'customer', 'research'], shared: 11, views: 289 },
  { id: 14, title: 'Compliance Checklist', authorId: 8, category: 'Compliance', status: 'Published', size: '1.2 MB', version: '3.5', lastModified: '2024-10-19', tags: ['compliance', 'checklist'], shared: 18, views: 445 },
  { id: 15, title: 'Team Meeting Notes', authorId: 3, category: 'Meetings', status: 'Draft', size: '0.8 MB', version: '1.1', lastModified: '2024-10-29', tags: ['meeting', 'notes'], shared: 5, views: 45 },
];
let nextGdocId = 16;

// Document Metadata Entity
let documentMetadata = [
  { id: 1, documentId: 1, createdDate: '2024-08-15', fileType: 'PDF', language: 'English', encryption: true, downloadCount: 45, printCount: 12 },
  { id: 2, documentId: 2, createdDate: '2024-10-29', fileType: 'Excel', language: 'English', encryption: true, downloadCount: 23, printCount: 5 },
  { id: 3, documentId: 3, createdDate: '2024-09-10', fileType: 'PowerPoint', language: 'English', encryption: false, downloadCount: 67, printCount: 18 },
  { id: 4, documentId: 4, createdDate: '2024-01-05', fileType: 'PDF', language: 'English', encryption: false, downloadCount: 234, printCount: 89 },
  { id: 5, documentId: 5, createdDate: '2024-10-20', fileType: 'Word', language: 'English', encryption: true, downloadCount: 34, printCount: 8 },
  { id: 6, documentId: 6, createdDate: '2024-10-15', fileType: 'PDF', language: 'English', encryption: true, downloadCount: 12, printCount: 3 },
  { id: 7, documentId: 7, createdDate: '2024-10-20', fileType: 'PowerPoint', language: 'English', encryption: false, downloadCount: 89, printCount: 34 },
  { id: 8, documentId: 8, createdDate: '2024-07-10', fileType: 'Markdown', language: 'English', encryption: false, downloadCount: 456, printCount: 23 },
];

// Document Versions Entity
let documentVersions = [
  { id: 1, documentId: 1, versionNumber: '3.2', createdDate: '2024-10-28', createdBy: 'John Doe', changeLog: 'Updated budget section', fileSize: '2.5 MB' },
  { id: 2, documentId: 1, versionNumber: '3.1', createdDate: '2024-10-20', createdBy: 'John Doe', changeLog: 'Added timeline', fileSize: '2.4 MB' },
  { id: 3, documentId: 1, versionNumber: '3.0', createdDate: '2024-10-15', createdBy: 'John Doe', changeLog: 'Major revision', fileSize: '2.3 MB' },
  { id: 4, documentId: 2, versionNumber: '1.0', createdDate: '2024-10-29', createdBy: 'Jane Smith', changeLog: 'Initial version', fileSize: '4.1 MB' },
  { id: 5, documentId: 3, versionNumber: '2.5', createdDate: '2024-10-27', createdBy: 'Bob Johnson', changeLog: 'Updated Q4 strategy', fileSize: '1.8 MB' },
];
let nextVersionId = 6;

// Document Comments Entity
let documentComments = [
  { id: 1, documentId: 1, authorId: 2, authorName: 'Jane Smith', comment: 'Great proposal! The budget section needs more detail.', timestamp: '2024-10-28 14:30:00', isResolved: false },
  { id: 2, documentId: 1, authorId: 3, authorName: 'Bob Johnson', comment: 'Timeline looks achievable', timestamp: '2024-10-28 15:45:00', isResolved: true },
  { id: 3, documentId: 3, authorId: 1, authorName: 'John Doe', comment: 'Should we include social media strategy?', timestamp: '2024-10-27 10:15:00', isResolved: false },
  { id: 4, documentId: 8, authorId: 6, authorName: 'Sarah Miller', comment: 'Can you add examples for the REST endpoints?', timestamp: '2024-10-24 13:45:00', isResolved: false },
];
let nextCommentId = 5;

// Document Attachments Entity
let documentAttachments = [
  { id: 1, documentId: 1, fileName: 'budget_breakdown.xlsx', fileType: 'Excel', fileSize: '1.2 MB', uploadedBy: 'John Doe', uploadedDate: '2024-10-28' },
  { id: 2, documentId: 1, fileName: 'timeline_chart.png', fileType: 'Image', fileSize: '0.5 MB', uploadedBy: 'John Doe', uploadedDate: '2024-10-28' },
  { id: 3, documentId: 3, fileName: 'market_research.pdf', fileType: 'PDF', fileSize: '3.2 MB', uploadedBy: 'Bob Johnson', uploadedDate: '2024-10-27' },
  { id: 4, documentId: 7, fileName: 'sales_data_q3.xlsx', fileType: 'Excel', fileSize: '2.1 MB', uploadedBy: 'Sarah Miller', uploadedDate: '2024-10-26' },
];
let nextAttachmentId = 5;

// Document Collaborators Entity
let documentCollaborators = [
  { id: 1, documentId: 1, userId: 2, userName: 'Jane Smith', permission: 'edit', sharedDate: '2024-10-15' },
  { id: 2, documentId: 1, userId: 3, userName: 'Bob Johnson', permission: 'view', sharedDate: '2024-10-16' },
  { id: 3, documentId: 3, userId: 1, userName: 'John Doe', permission: 'edit', sharedDate: '2024-10-20' },
  { id: 4, documentId: 3, userId: 6, userName: 'Sarah Miller', permission: 'edit', sharedDate: '2024-10-21' },
  { id: 5, documentId: 8, userId: 1, userName: 'John Doe', permission: 'edit', sharedDate: '2024-07-15' },
];
let nextCollaboratorId = 6;

export async function getGdocs(options = {}) {
  await delay(300);
  
  // Populate author information
  let result = gdocs.map(doc => {
    const author = authors.find(a => a.id === doc.authorId);
    return {
      ...doc,
      author: author ? author.name : 'Unknown',
      authorEmail: author ? author.email : '',
      authorDepartment: author ? author.department : ''
    };
  });
  
  // Filtering
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    result = result.filter(doc => 
      doc.title.toLowerCase().includes(searchLower) ||
      doc.author.toLowerCase().includes(searchLower) ||
      doc.category.toLowerCase().includes(searchLower) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  if (options.category && options.category !== 'all') {
    result = result.filter(doc => doc.category === options.category);
  }
  
  if (options.status && options.status !== 'all') {
    result = result.filter(doc => doc.status === options.status);
  }
  
  if (options.author && options.author !== 'all') {
    result = result.filter(doc => doc.author === options.author);
  }
  
  // Sorting
  if (options.sortBy) {
    result.sort((a, b) => {
      let aVal = a[options.sortBy];
      let bVal = b[options.sortBy];
      
      if (options.sortBy === 'lastModified') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (typeof aVal === 'string') {
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

export async function getGdocById(id) {
  await delay(200);
  return gdocs.find(doc => doc.id === parseInt(id)) || null;
}

export async function createGdoc(gdoc) {
  await delay(300);
  const newGdoc = {
    id: nextGdocId++,
    ...gdoc,
    lastModified: new Date().toISOString().split('T')[0],
    version: '1.0',
    views: 0,
    shared: 0,
  };
  gdocs.push(newGdoc);
  return newGdoc;
}

export async function updateGdoc(id, updates) {
  await delay(300);
  const doc = gdocs.find(d => d.id === id);
  if (doc) {
    Object.assign(doc, updates);
    doc.lastModified = new Date().toISOString().split('T')[0];
    const [major, minor] = doc.version.split('.');
    doc.version = `${major}.${parseInt(minor) + 1}`;
    return doc;
  }
  return null;
}

export async function deleteGdoc(id) {
  await delay(300);
  const index = gdocs.findIndex(d => d.id === id);
  if (index !== -1) {
    gdocs.splice(index, 1);
    return true;
  }
  return false;
}

export function getGdocCategories() {
  const categories = [...new Set(gdocs.map(doc => doc.category))];
  return categories.sort();
}

export function getGdocAuthors() {
  return authors.map(a => a.name).sort();
}

export function getGdocStatuses() {
  return ['Draft', 'Review', 'Published'];
}

// Authors API
export async function getAuthors() {
  await delay(200);
  return [...authors];
}

export async function getAuthorById(id) {
  await delay(200);
  const author = authors.find(a => a.id === parseInt(id));
  if (author) {
    const authorDocs = gdocs.filter(d => d.authorId === author.id);
    return { ...author, documents: authorDocs };
  }
  return null;
}

// Document Metadata API
export async function getDocumentMetadata(documentId) {
  await delay(200);
  return documentMetadata.find(m => m.documentId === parseInt(documentId)) || null;
}

export async function updateDocumentMetadata(documentId, updates) {
  await delay(200);
  const metadata = documentMetadata.find(m => m.documentId === parseInt(documentId));
  if (metadata) {
    Object.assign(metadata, updates);
    return metadata;
  }
  return null;
}

// Document Versions API
export async function getDocumentVersions(documentId) {
  await delay(200);
  return documentVersions
    .filter(v => v.documentId === parseInt(documentId))
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
}

export async function getVersionById(id) {
  await delay(200);
  return documentVersions.find(v => v.id === parseInt(id)) || null;
}

export async function createDocumentVersion(version) {
  await delay(300);
  const newVersion = {
    id: nextVersionId++,
    ...version,
    createdDate: new Date().toISOString().split('T')[0]
  };
  documentVersions.push(newVersion);
  return newVersion;
}

// Document Comments API
export async function getDocumentComments(documentId) {
  await delay(200);
  return documentComments
    .filter(c => c.documentId === parseInt(documentId))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export async function createDocumentComment(comment) {
  await delay(300);
  const newComment = {
    id: nextCommentId++,
    ...comment,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    isResolved: false
  };
  documentComments.push(newComment);
  return newComment;
}

export async function updateDocumentComment(id, updates) {
  await delay(200);
  const comment = documentComments.find(c => c.id === parseInt(id));
  if (comment) {
    Object.assign(comment, updates);
    return comment;
  }
  return null;
}

export async function deleteDocumentComment(id) {
  await delay(200);
  const index = documentComments.findIndex(c => c.id === parseInt(id));
  if (index !== -1) {
    documentComments.splice(index, 1);
    return true;
  }
  return false;
}

// Document Attachments API
export async function getDocumentAttachments(documentId) {
  await delay(200);
  return documentAttachments
    .filter(a => a.documentId === parseInt(documentId))
    .sort((a, b) => new Date(b.uploadedDate) - new Date(a.uploadedDate));
}

export async function createDocumentAttachment(attachment) {
  await delay(300);
  const newAttachment = {
    id: nextAttachmentId++,
    ...attachment,
    uploadedDate: new Date().toISOString().split('T')[0]
  };
  documentAttachments.push(newAttachment);
  return newAttachment;
}

export async function deleteDocumentAttachment(id) {
  await delay(200);
  const index = documentAttachments.findIndex(a => a.id === parseInt(id));
  if (index !== -1) {
    documentAttachments.splice(index, 1);
    return true;
  }
  return false;
}

// Document Collaborators API
export async function getDocumentCollaborators(documentId) {
  await delay(200);
  return documentCollaborators.filter(c => c.documentId === parseInt(documentId));
}

export async function addDocumentCollaborator(collaborator) {
  await delay(300);
  const newCollaborator = {
    id: nextCollaboratorId++,
    ...collaborator,
    sharedDate: new Date().toISOString().split('T')[0]
  };
  documentCollaborators.push(newCollaborator);
  return newCollaborator;
}

export async function updateCollaboratorPermission(id, permission) {
  await delay(200);
  const collaborator = documentCollaborators.find(c => c.id === parseInt(id));
  if (collaborator) {
    collaborator.permission = permission;
    return collaborator;
  }
  return null;
}

export async function removeDocumentCollaborator(id) {
  await delay(200);
  const index = documentCollaborators.findIndex(c => c.id === parseInt(id));
  if (index !== -1) {
    documentCollaborators.splice(index, 1);
    return true;
  }
  return false;
}

// Get complete document with all relationships
export async function getGdocWithRelationships(id) {
  await delay(300);
  const doc = await getGdocById(id);
  if (!doc) return null;
  
  const author = authors.find(a => a.id === doc.authorId);
  const metadata = await getDocumentMetadata(id);
  const versions = await getDocumentVersions(id);
  const comments = await getDocumentComments(id);
  const attachments = await getDocumentAttachments(id);
  const collaborators = await getDocumentCollaborators(id);
  
  return {
    ...doc,
    author: author ? author.name : 'Unknown',
    authorDetails: author,
    metadata,
    versions,
    comments,
    attachments,
    collaborators
  };
}
