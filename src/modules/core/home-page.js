import {LitElement, css, html} from 'lit';
import {getHomeData, getCurrentUser, getUserPermissions, entities, getRoles, getUserModules, isSuperAdmin} from '../../services/dataService.js';
import { unsafeHTML } from '@shared/directives/index.js';

class HomePage extends LitElement {
  static properties = {
    title: {type: String, reflect: true},
    highlight: {type: Boolean, reflect: true},
    items: {type: String, reflect: true},
    autoincrement: {type: Boolean, reflect: true},
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.data = null;
    this.allRoles = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  async _load() {
    this.data = await getHomeData();
    this.allRoles = await getRoles();
    this._applyPropsToData();
    this.requestUpdate();
  }


  _applyPropsToData() {
    if (!this.data) return;
    if (this.title) this.data.title = this.title;
    if (this.highlight !== undefined) this.data.highlight = this.highlight;
    if (this.items) {
      try {
        this.data.items = JSON.parse(this.items);
      } catch (e) {
        console.error('Invalid items JSON:', e);
      }
    }
  }

  render() {
    const currentUser = getCurrentUser();
    const permissions = getUserPermissions();
    const totalPermissions = Object.values(permissions).reduce((sum, perms) => sum + perms.length, 0);
    const userModules = getUserModules();
    const isSuper = isSuperAdmin();
    
    // Get assigned role names and details
    const assignedRoleNames = (currentUser?.assignedRoles || [])
      .map(roleId => this.allRoles.find(r => r.id === roleId)?.name)
      .filter(name => name);
      
    // Get permission scope label
    const scopeLabels = {
      'global': 'Global Access',
      'organization': 'Organization',
      'own': 'Own Data Only'
    };
    const scopeLabel = scopeLabels[currentUser?.permissionScope] || currentUser?.permissionScope || 'Not Set';
    
    return html`
      <div>
        <!-- Welcome Banner -->
        <div class="alert alert-light border-0 shadow-sm mb-4">
          <div class="d-flex align-items-center">
            <div class="flex-shrink-0">
              <i class="bi bi-house-door fs-1 text-primary"></i>
            </div>
            <div class="flex-grow-1 ms-3">
              <h4 class="alert-heading mb-1">Welcome back, ${currentUser?.name}!</h4>
              <p class="mb-0 text-muted">You have access to ${userModules.length} modules with ${totalPermissions} permissions across ${Object.keys(permissions).length} entities.</p>
            </div>
            ${isSuper ? html`
              <div class="flex-shrink-0">
                <span class="badge bg-danger fs-6 px-3 py-2">
                  <i class="bi bi-star-fill me-1"></i>Super Admin
                </span>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- User Info & Stats -->
        <div class="row g-3 mb-4">
          <!-- User Profile Card -->
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <i class="bi bi-person-circle fs-1 text-primary mb-2"></i>
                <h6 class="card-title mb-1">${currentUser?.name}</h6>
                <p class="text-muted small mb-3">${currentUser?.email}</p>
                <div class="d-flex flex-column gap-2">
                  <div class="d-flex align-items-center justify-content-between">
                    <small class="text-muted">Scope:</small>
                    <span class="badge bg-secondary">${scopeLabel}</span>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <small class="text-muted">Roles:</small>
                    <span class="badge bg-primary">${assignedRoleNames.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Permissions Card -->
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <i class="bi bi-key fs-1 text-success mb-2"></i>
                <h2 class="mb-1">${totalPermissions}</h2>
                <p class="text-muted mb-3">Total Permissions</p>
                <div class="d-flex flex-wrap gap-1 justify-content-center">
                  ${assignedRoleNames.map(roleName => html`
                    <span class="badge bg-success-subtle text-success border border-success" style="font-size: 0.7rem;">${roleName}</span>
                  `)}
                </div>
              </div>
            </div>
          </div>

          <!-- Entities Card -->
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <i class="bi bi-grid-3x3-gap fs-1 text-info mb-2"></i>
                <h2 class="mb-1">${Object.keys(permissions).length}</h2>
                <p class="text-muted mb-3">Accessible Entities</p>
                <small class="text-muted">You can access ${Object.keys(permissions).length} different entity types</small>
              </div>
            </div>
          </div>

          <!-- Modules Card -->
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <i class="bi bi-grid-3x3 fs-1 text-warning mb-2"></i>
                <h2 class="mb-1">${userModules.length}</h2>
                <p class="text-muted mb-3">Active Modules</p>
                <small class="text-muted">Access to ${userModules.length} modules via role permissions</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Modules -->
        ${userModules.length > 0 ? html`
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-gradient bg-primary text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-grid-3x3 me-2"></i>Your Modules
              </h5>
              <small>Click any module to access its features</small>
            </div>
            <div class="card-body p-4">
              <div class="row g-4">
                ${userModules.map(module => html`
                  <div class="col-md-4 col-lg-3">
                    <a href="/module/${module.id}" class="text-decoration-none">
                      <div class="card h-100 border-0 shadow-sm position-relative overflow-hidden" 
                           style="transition: all 0.3s ease;"
                           onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
                        <div class="position-absolute top-0 start-0 w-100 h-25 bg-${module.color}" style="opacity: 0.1;"></div>
                        <div class="card-body text-center position-relative">
                          <div class="mb-3">
                            <i class="bi bi-${module.icon} fs-1 text-${module.color}"></i>
                          </div>
                          <h5 class="card-title mb-2">${module.name}</h5>
                          <p class="text-muted small mb-3" style="min-height: 40px;">${module.description}</p>
                          <div class="btn btn-${module.color} btn-sm w-100">
                            <i class="bi bi-arrow-right-circle me-1"></i>Open
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                `)}
              </div>
            </div>
          </div>
        ` : html`
          <div class="alert alert-warning border-0 shadow-sm mb-4">
            <div class="d-flex align-items-center">
              <i class="bi bi-exclamation-triangle fs-3 me-3"></i>
              <div>
                <h5 class="alert-heading mb-1">No Modules Available</h5>
                <p class="mb-0">You don't have access to any modules. Please contact your administrator to assign roles with appropriate permissions.</p>
              </div>
            </div>
          </div>
        `}

        <!-- Permissions by Entity -->
        ${totalPermissions > 0 ? html`
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-gradient bg-success text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-shield-check me-2"></i>Your Permissions
              </h5>
              <small>Detailed breakdown of your access rights by entity</small>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                ${entities.map(entity => {
                  const entityPerms = permissions[entity.id] || [];
                  if (entityPerms.length === 0) return '';
                  
                  // Count permissions
                  const permCount = entityPerms.length;
                  const hasManage = entityPerms.includes('manage');
                  
                  return html`
                    <div class="col-md-6 col-lg-4">
                      <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body">
                          <div class="d-flex align-items-start justify-content-between mb-2">
                            <div class="d-flex align-items-center">
                              <div class="bg-primary bg-opacity-10 rounded p-2 me-2">
                                <i class="bi bi-${entity.icon} fs-5 text-primary"></i>
                              </div>
                              <div>
                                <h6 class="card-title mb-0">${entity.name}</h6>
                                <small class="text-muted">${permCount} permission${permCount !== 1 ? 's' : ''}</small>
                              </div>
                            </div>
                            ${hasManage ? html`
                              <span class="badge bg-danger">Full Access</span>
                            ` : ''}
                          </div>
                          <p class="text-muted small mb-3">${entity.description}</p>
                          <div class="d-flex flex-wrap gap-1">
                            ${entityPerms.includes('create') ? html`<span class="badge bg-success-subtle text-success border border-success"><i class="bi bi-plus-circle me-1"></i>Create</span>` : ''}
                            ${entityPerms.includes('read') ? html`<span class="badge bg-info-subtle text-info border border-info"><i class="bi bi-eye me-1"></i>Read</span>` : ''}
                            ${entityPerms.includes('update') ? html`<span class="badge bg-warning-subtle text-warning border border-warning"><i class="bi bi-pencil me-1"></i>Update</span>` : ''}
                            ${entityPerms.includes('delete') ? html`<span class="badge bg-danger-subtle text-danger border border-danger"><i class="bi bi-trash me-1"></i>Delete</span>` : ''}
                            ${entityPerms.includes('manage') ? html`<span class="badge bg-danger"><i class="bi bi-shield-check me-1"></i>Manage</span>` : ''}
                            ${entityPerms.includes('export') ? html`<span class="badge bg-secondary"><i class="bi bi-download me-1"></i>Export</span>` : ''}
                            ${entityPerms.includes('approve') ? html`<span class="badge bg-primary"><i class="bi bi-check-circle me-1"></i>Approve</span>` : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  `;
                })}
              </div>
            </div>
          </div>
        ` : html`
          <div class="alert alert-info border-0 shadow-sm mb-4">
            <div class="d-flex align-items-center">
              <i class="bi bi-info-circle fs-3 me-3"></i>
              <div>
                <h5 class="alert-heading mb-1">No Permissions Assigned</h5>
                <p class="mb-0">You don't have any permissions assigned yet. Contact your administrator to get access.</p>
              </div>
            </div>
          </div>
        `}
      </div>
    `;
  }
}

customElements.define('home-page', HomePage);

class XmlViewerPage extends LitElement {
  static properties = { xml: { type: String }, error: { type: String }, mode: { type: String } };
  static styles = css`
    :host { display: block; padding: 16px; }
    h2 { margin: 0 0 12px; font-size: 18px; }
    .container { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    textarea { width: 100%; min-height: 280px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 13px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
    .viewer { border: 1px solid #ddd; border-radius: 8px; background: #0b1020; color: #e6edf3; padding: 12px; overflow: auto; min-height: 280px; }
    pre { margin: 0; white-space: pre; }
    .tag { color: #7ee787; }
    .name { color: #79c0ff; }
    .attr { color: #c9d1d9; }
    .value { color: #a5d6ff; }
    .text { color: #e6edf3; }
    .error { color: #b42318; background: #fee4e2; border: 1px solid #fda29b; padding: 8px 10px; border-radius: 8px; margin-top: 8px; }
    .toolbar { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
    .grow { flex: 1; }
    button { cursor: pointer; border: 1px solid #ddd; background: #fff; padding: 6px 10px; border-radius: 6px; font-size: 13px; }
    button:hover { background: #f5f5f5; }
    select { border: 1px solid #ddd; background: #fff; padding: 6px 10px; border-radius: 6px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; background: #fff; color: #222; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 10px; font-size: 13px; }
    th { background: #f9fafb; text-align: left; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
    .card { border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; padding: 12px; }
    .card h4 { margin: 0 0 8px; font-size: 14px; }
    .kv { display: grid; grid-template-columns: 120px 1fr; gap: 6px 10px; font-size: 13px; }
    .kv div { padding: 4px 0; }
    .block { border: 1px dashed #d1d5db; border-radius: 10px; background: #fafafa; color: #111; padding: 12px; }
  `;
  constructor() {
    super();
    this.xml = `<catalog>\n  <book id="bk101">\n    <author>Gambardella, Matthew</author>\n    <title>XML Developer's Guide</title>\n    <genre>Computer</genre>\n    <price currency="USD">44.95</price>\n    <publish_date>2000-10-01</publish_date>\n    <description>An in-depth look at creating applications with XML.</description>\n  </book>\n  <book id="bk102">\n    <author>Ralls, Kim</author>\n    <title>Midnight Rain</title>\n    <genre>Fantasy</genre>\n    <price currency="USD">5.95</price>\n    <publish_date>2000-12-16</publish_date>\n  </book>\n</catalog>`;
    this.error = '';
    this.mode = 'viewer';
  }
  updated(changed) { if (changed.has('xml')) { this.error = ''; } }
  _format(xml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'application/xml');
      const parseError = doc.getElementsByTagName('parsererror')[0];
      if (parseError) { const text = parseError.textContent || 'Invalid XML'; throw new Error(text); }
      const serializer = new XMLSerializer();
      const raw = serializer.serializeToString(doc);
      const pretty = this._prettify(raw);
      return this._highlight(this._escape(pretty));
    } catch (e) {
      this.error = e.message;
      return this._highlight(this._escape(this.xml));
    }
  }
  _prettify(xml) {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let formatted = '';
    let pad = 0;
    xml = xml.replace(reg, '$1\n$2$3');
    xml.split('\n').forEach((node) => {
      if (!node) return;
      let indent = 0;
      if (node.match(/^<\//)) { pad = Math.max(pad - 1, 0); }
      else if (node.match(/<.*?>.*<\/.+>/)) { indent = 0; }
      else if (node.match(/<.*?\/>/)) { indent = 0; }
      else if (node.match(/^<[^!?].*?>$/)) { indent = 1; }
      else { indent = 0; }
      const padding = PADDING.repeat(pad);
      formatted += padding + node + '\n';
      pad += indent;
    });
    return formatted.trim();
  }
  _escape(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#39;'); }
  _highlight(safeXml) {
    let out = safeXml;
    out = out
      .replace(/(&lt;\/?)([\w:-]+)([^&]*?)(&gt;)/g, (m, lt, name, rest, gt) => {
        const attrs = rest.replace(/([\w:-]+)(=)(&quot;.*?&quot;)/g, '<span class="attr">$1</span>$2<span class="value">$3</span>');
        return `<span class="tag">${lt}</span><span class="name">${name}</span>${attrs}<span class="tag">${gt}</span>`;
      })
      .replace(/(^|\n)([^<\n][^\n]*)/g, (m, br, text) => `${br}<span class="text">${text}</span>`);
    return out;
  }
  _onSample() {
    this.xml = `<order id="PO-1001">\n  <buyer>Acme Corp</buyer>\n  <items>\n    <item sku="ABC123" qty="2">Widget</item>\n    <item sku="XYZ999" qty="5">Gadget</item>\n  </items>\n</order>`;
  }
  _onFormat() { this.requestUpdate(); }
  _onInput(e) { this.xml = e.target.value; }

  _toJson(xml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'application/xml');
      const parseError = doc.getElementsByTagName('parsererror')[0];
      if (parseError) throw new Error(parseError.textContent || 'Invalid XML');
      const walk = (node) => {
        if (node.nodeType === 3) return node.nodeValue.trim() ? node.nodeValue : null;
        if (node.nodeType !== 1) return null;
        const obj = { _name: node.nodeName };
        if (node.attributes && node.attributes.length) {
          obj._attrs = {};
          for (const a of node.attributes) obj._attrs[a.name] = a.value;
        }
        const children = [];
        for (const c of node.childNodes) {
          const v = walk(c);
          if (v !== null && v !== undefined && !(typeof v === 'string' && v === '')) children.push(v);
        }
        if (children.length === 1 && typeof children[0] === 'string') {
          obj._text = children[0];
        } else if (children.length) {
          obj._children = children.filter(x => typeof x === 'object');
          const texts = children.filter(x => typeof x === 'string');
          if (texts.length) obj._text = texts.join(' ');
        }
        return obj;
      };
      const rootEl = Array.from(doc.childNodes).find(n => n.nodeType === 1);
      return walk(rootEl);
    } catch (e) {
      this.error = e.message;
      return null;
    }
  }

  _asCollection(json) {
    if (!json) return { items: [], fields: [] };
    const pickArray = (n) => {
      const groups = {};
      (n._children || []).forEach(ch => {
        groups[ch._name] = groups[ch._name] || [];
        groups[ch._name].push(ch);
      });
      const largest = Object.entries(groups).sort((a,b) => b[1].length - a[1].length)[0];
      if (largest && largest[1].length > 1) return largest[1];
      if (n._children && n._children.length) return n._children;
      return [n];
    };
    const items = pickArray(json);
    const fields = new Set();
    items.forEach(it => {
      if (it._attrs) Object.keys(it._attrs).forEach(k => fields.add('@'+k));
      (it._children || []).forEach(ch => fields.add(ch._name));
      if (it._text) fields.add('#text');
    });
    return { items, fields: Array.from(fields) };
  }

  _renderTable(collection) {
    const headers = collection.fields;
    const rows = collection.items.map(it => headers.map(h => {
      if (h === '#text') return it._text || '';
      if (h.startsWith('@')) return (it._attrs || {})[h.slice(1)] || '';
      const child = (it._children || []).find(c => c._name === h);
      return child? (child._text || '') : '';
    }));
    return html`
      <table>
        <thead><tr>${headers.map(h => html`<th>${h}</th>`)}</tr></thead>
        <tbody>
          ${rows.map(r => html`<tr>${r.map(c => html`<td>${c}</td>`)}</tr>`)}
        </tbody>
      </table>
    `;
  }

  _renderCards(collection) {
    return html`
      <div class="cards">
        ${collection.items.map((it, idx) => html`
          <div class="card">
            <h4>${it._name} ${idx+1}</h4>
            <div class="kv">
              ${collection.fields.map(f => html`
                <div><strong>${f}</strong></div>
                <div>${f === '#text' ? (it._text || '') : f.startsWith('@') ? (it._attrs || {})[f.slice(1)] || '' : ((it._children || []).find(c => c._name === f)? ((it._children || []).find(c => c._name === f)._text || '') : '')}</div>
              `)}
            </div>
          </div>
        `)}
      </div>
    `;
  }

  _renderBlocks(collection) {
    return html`
      <div class="block">
        ${collection.items.map((it) => html`
          <div style="margin-bottom:12px;">
            <div style="font-weight:600; margin-bottom:6px;">${it._name}</div>
            ${collection.fields.map(f => html`<div><span style="color:#6b7280;">${f}:</span> <span>${f === '#text' ? (it._text || '') : f.startsWith('@') ? (it._attrs || {})[f.slice(1)] || '' : ((it._children || []).find(c => c._name === f)? ((it._children || []).find(c => c._name === f)._text || '') : '')}</span></div>`)}
          </div>
        `)}
      </div>
    `;
  }

  _renderMode() {
    if (this.mode === 'table') {
      const json = this._toJson(this.xml); const col = this._asCollection(json); return this._renderTable(col);
    }
    if (this.mode === 'cards') {
      const json = this._toJson(this.xml); const col = this._asCollection(json); return this._renderCards(col);
    }
    if (this.mode === 'blocks') {
      const json = this._toJson(this.xml); const col = this._asCollection(json); return this._renderBlocks(col);
    }
    return html`<div class="viewer"><pre><code>${unsafeHTML(this._format(this.xml))}</code></pre></div>`;
  }

  render() {
    return html`
      <h2>XML Viewer</h2>
      <div class="toolbar">
        <button @click=${this._onSample}>Load sample</button>
        <button @click=${this._onFormat}>Format</button>
        <div class="grow"></div>
        <label>Mode:</label>
        <select .value=${this.mode} @change=${e => this.mode = e.target.value}>
          <option value="viewer">Viewer</option>
          <option value="table">Table</option>
          <option value="cards">Cards</option>
          <option value="blocks">Blocks</option>
        </select>
      </div>
      ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      <div class="container">
        <textarea .value=${this.xml} @input=${this._onInput}></textarea>
        ${this._renderMode()}
      </div>
    `;
  }
}
customElements.define('xml-viewer-page', XmlViewerPage);
