/**
 * B2B Punchout Session Manager - E-Procurement Integration
 * Supports cXML and OCI protocols for integration with SAP Ariba, Coupa, Oracle, etc.
 */

import { LitElement, html } from 'lit';
import { getProducts } from '../../../services/product.service.js';
import { getCompanyById } from '../../../services/company.service.js';

class PunchoutSession extends LitElement {
  static properties = {
    sessionActive: { type: Boolean },
    sessionData: { type: Object },
    protocol: { type: String }, // 'cxml' or 'oci'
    cart: { type: Array },
    products: { type: Array },
    loading: { type: Boolean },
    company: { type: Object },
    searchQuery: { type: String },
    selectedCategory: { type: String },
    viewMode: { type: String }
  };

  constructor() {
    super();
    this.sessionActive = false;
    this.sessionData = null;
    this.protocol = null;
    this.cart = [];
    this.products = [];
    this.loading = false;
    this.company = null;
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.viewMode = 'grid';
    this.companyId = 1; // Mock: From authentication
    
    this.initializeSession();
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadCompany();
    await this.loadProducts();
  }

  async initializeSession() {
    // Check URL parameters for punchout session
    const urlParams = new URLSearchParams(window.location.search);
    const protocol = urlParams.get('protocol') || urlParams.get('HOOK_URL') ? 'oci' : urlParams.get('cxml-urlencoded') ? 'cxml' : null;
    
    if (protocol) {
      this.sessionActive = true;
      this.protocol = protocol;
      
      if (protocol === 'cxml') {
        this.sessionData = {
          buyerCookie: urlParams.get('buyerCookie'),
          returnURL: urlParams.get('returnURL'),
          sessionId: urlParams.get('sessionId'),
          timestamp: new Date().toISOString()
        };
      } else if (protocol === 'oci') {
        this.sessionData = {
          hookUrl: urlParams.get('HOOK_URL'),
          username: urlParams.get('USERNAME'),
          password: urlParams.get('PASSWORD'),
          sessionId: this.generateSessionId(),
          timestamp: new Date().toISOString()
        };
      }
      
      // Store session in sessionStorage
      sessionStorage.setItem('punchout_session', JSON.stringify({
        protocol: this.protocol,
        data: this.sessionData,
        active: true
      }));
      
      this.requestUpdate();
    } else {
      // Check if session exists in storage
      const stored = sessionStorage.getItem('punchout_session');
      if (stored) {
        const session = JSON.parse(stored);
        this.sessionActive = session.active;
        this.protocol = session.protocol;
        this.sessionData = session.data;
      }
    }
  }

  generateSessionId() {
    return 'POUT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  async loadCompany() {
    this.loading = true;
    try {
      this.company = await getCompanyById(this.companyId);
    } catch (err) {
      console.error('Failed to load company:', err);
    } finally {
      this.loading = false;
    }
  }

  async loadProducts() {
    this.loading = true;
    try {
      this.products = await getProducts();
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      this.loading = false;
    }
  }

  handleAddToCart(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      this.cart.push({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        description: product.description,
        quantity: quantity,
        price: product.price,
        total: product.price * quantity,
        uom: product.unitOfMeasure || 'EA',
        manufacturer: product.manufacturer || '',
        manufacturerPartNumber: product.mpn || ''
      });
    }
    
    this.requestUpdate();
  }

  handleUpdateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = parseInt(quantity);
      item.total = item.quantity * item.price;
      this.requestUpdate();
    }
  }

  handleRemoveItem(productId) {
    this.cart = this.cart.filter(item => item.productId !== productId);
  }

  handleTransferCart() {
    if (!this.sessionActive || !this.sessionData) {
      alert('No active punchout session');
      return;
    }

    if (this.cart.length === 0) {
      alert('Cart is empty. Please add items before transferring.');
      return;
    }

    if (this.protocol === 'cxml') {
      this.transferCXML();
    } else if (this.protocol === 'oci') {
      this.transferOCI();
    }
  }

  transferCXML() {
    // Build cXML PunchOutOrderMessage
    const orderMessage = this.buildCXMLOrderMessage();
    
    // Create form to POST back to procurement system
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = this.sessionData.returnURL;
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'cxml-urlencoded';
    input.value = encodeURIComponent(orderMessage);
    
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  }

  buildCXMLOrderMessage() {
    const items = this.cart.map((item, index) => `
      <ItemIn quantity="${item.quantity}" lineNumber="${index + 1}">
        <ItemID>
          <SupplierPartID>${item.sku}</SupplierPartID>
        </ItemID>
        <ItemDetail>
          <UnitPrice>
            <Money currency="USD">${item.price.toFixed(2)}</Money>
          </UnitPrice>
          <Description xml:lang="en">${this.escapeXML(item.name)}</Description>
          <UnitOfMeasure>${item.uom}</UnitOfMeasure>
          <Classification domain="UNSPSC">43211500</Classification>
          <ManufacturerPartID>${item.manufacturerPartNumber}</ManufacturerPartID>
          <ManufacturerName>${this.escapeXML(item.manufacturer)}</ManufacturerName>
        </ItemDetail>
      </ItemIn>
    `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd">
<cXML payloadID="${this.generatePayloadId()}" timestamp="${new Date().toISOString()}" xml:lang="en-US">
  <Header>
    <From>
      <Credential domain="NetworkID">
        <Identity>${this.company?.name || 'Supplier'}</Identity>
      </Credential>
    </From>
    <To>
      <Credential domain="NetworkID">
        <Identity>BuyerSystem</Identity>
      </Credential>
    </To>
    <Sender>
      <Credential domain="NetworkID">
        <Identity>${this.company?.name || 'Supplier'}</Identity>
      </Credential>
      <UserAgent>B2B Storefront Punchout 1.0</UserAgent>
    </Sender>
  </Header>
  <Message>
    <PunchOutOrderMessage>
      <BuyerCookie>${this.sessionData.buyerCookie}</BuyerCookie>
      <PunchOutOrderMessageHeader operationAllowed="create">
        <Total>
          <Money currency="USD">${this.cartTotal.toFixed(2)}</Money>
        </Total>
      </PunchOutOrderMessageHeader>
      ${items}
    </PunchOutOrderMessage>
  </Message>
</cXML>`;
  }

  transferOCI() {
    // Build OCI format and POST back
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = this.sessionData.hookUrl;
    
    // Add authentication
    this.addFormField(form, 'USERNAME', this.sessionData.username);
    this.addFormField(form, 'PASSWORD', this.sessionData.password);
    
    // Add cart items in OCI format
    this.cart.forEach((item, index) => {
      const lineNum = index + 1;
      this.addFormField(form, `NEW_ITEM-DESCRIPTION[${lineNum}]`, item.name);
      this.addFormField(form, `NEW_ITEM-VENDORMAT[${lineNum}]`, item.sku);
      this.addFormField(form, `NEW_ITEM-QUANTITY[${lineNum}]`, item.quantity.toString());
      this.addFormField(form, `NEW_ITEM-UNIT[${lineNum}]`, item.uom);
      this.addFormField(form, `NEW_ITEM-PRICE[${lineNum}]`, item.price.toFixed(2));
      this.addFormField(form, `NEW_ITEM-CURRENCY[${lineNum}]`, 'USD');
      this.addFormField(form, `NEW_ITEM-LEADTIME[${lineNum}]`, '5');
      this.addFormField(form, `NEW_ITEM-MANUFACTURER[${lineNum}]`, item.manufacturer);
      this.addFormField(form, `NEW_ITEM-MANUFACTMAT[${lineNum}]`, item.manufacturerPartNumber);
    });
    
    document.body.appendChild(form);
    form.submit();
  }

  addFormField(form, name, value) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value || '';
    form.appendChild(input);
  }

  generatePayloadId() {
    return Date.now() + '@' + window.location.hostname;
  }

  escapeXML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
  }

  handleCancelSession() {
    if (!confirm('Cancel punchout session and return to procurement system?')) return;
    
    sessionStorage.removeItem('punchout_session');
    
    if (this.protocol === 'cxml' && this.sessionData.returnURL) {
      window.location.href = this.sessionData.returnURL;
    } else if (this.protocol === 'oci' && this.sessionData.hookUrl) {
      window.location.href = this.sessionData.hookUrl;
    } else {
      window.location.pathname = '/b2b-store';
    }
  }

  get cartTotal() {
    return this.cart.reduce((sum, item) => sum + item.total, 0);
  }

  get filteredProducts() {
    let filtered = [...this.products];
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
    
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    
    return filtered;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  render() {
    if (this.loading) {
      return html`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading punchout session...</p>
          </div>
        </div>
      `;
    }

    if (!this.sessionActive) {
      return html`
        <div class="container-fluid mt-4">
          <div class="alert alert-info">
            <h4><i class="bi bi-link-45deg me-2"></i>Punchout Session Required</h4>
            <p class="mb-0">This page is accessed via punchout from your procurement system. 
            Please initiate a punchout session from your e-procurement platform (SAP Ariba, Coupa, Oracle, etc.)</p>
          </div>
          <div class="card mt-3">
            <div class="card-header">
              <h5 class="mb-0">Supported Protocols</h5>
            </div>
            <div class="card-body">
              <ul>
                <li><strong>cXML:</strong> SAP Ariba, Oracle, Coupa</li>
                <li><strong>OCI:</strong> SAP SRM, Oracle iProcurement</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container-fluid mt-4">
        <!-- Punchout Session Banner -->
        <div class="alert alert-success border-success">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-1">
                <i class="bi bi-link-45deg me-2"></i>Active Punchout Session
              </h5>
              <small>Protocol: <strong>${this.protocol.toUpperCase()}</strong> | Session ID: <code>${this.sessionData.sessionId}</code></small>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-danger" @click=${this.handleCancelSession}>
                <i class="bi bi-x-circle me-1"></i>Cancel & Return
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Product Catalog -->
          <div class="col-lg-8">
            <div class="card mb-4">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">
                    <i class="bi bi-grid me-2"></i>Select Products
                  </h5>
                  <div class="d-flex gap-2">
                    <input type="text" class="form-control form-control-sm" 
                           placeholder="Search products..." 
                           .value=${this.searchQuery}
                           @input=${(e) => this.searchQuery = e.target.value}
                           style="width: 250px;" />
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  ${this.filteredProducts.map(product => html`
                    <div class="col-md-6">
                      <div class="card h-100">
                        <div class="card-body">
                          <h6 class="card-title">${product.name}</h6>
                          <p class="text-muted small mb-2">SKU: ${product.sku}</p>
                          <p class="card-text small">${product.description || 'No description'}</p>
                          <div class="d-flex justify-content-between align-items-center mt-3">
                            <strong class="text-primary fs-5">${this.formatCurrency(product.price)}</strong>
                            <button class="btn btn-sm btn-success" 
                                    @click=${() => this.handleAddToCart(product)}>
                              <i class="bi bi-plus-circle me-1"></i>Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  `)}
                </div>
              </div>
            </div>
          </div>

          <!-- Punchout Cart -->
          <div class="col-lg-4">
            <div class="card sticky-top" style="top: 20px;">
              <div class="card-header bg-success text-white">
                <h5 class="mb-0">
                  <i class="bi bi-cart3 me-2"></i>Punchout Cart (${this.cart.length})
                </h5>
              </div>
              <div class="card-body" style="max-height: 500px; overflow-y: auto;">
                ${this.cart.length === 0 ? html`
                  <div class="text-center text-muted py-4">
                    <i class="bi bi-cart-x" style="font-size: 3rem;"></i>
                    <p class="mt-2">No items selected</p>
                  </div>
                ` : html`
                  ${this.cart.map(item => html`
                    <div class="border-bottom pb-2 mb-2">
                      <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                          <h6 class="mb-1 small">${item.name}</h6>
                          <p class="text-muted small mb-1">SKU: ${item.sku}</p>
                          <div class="d-flex align-items-center gap-2">
                            <input type="number" class="form-control form-control-sm" 
                                   style="width: 70px;"
                                   min="1"
                                   .value=${item.quantity}
                                   @change=${(e) => this.handleUpdateQuantity(item.productId, e.target.value)} />
                            <span class="small">× ${this.formatCurrency(item.price)}</span>
                          </div>
                        </div>
                        <div class="text-end">
                          <button class="btn btn-sm btn-outline-danger" 
                                  @click=${() => this.handleRemoveItem(item.productId)}>
                            <i class="bi bi-x"></i>
                          </button>
                          <div class="fw-bold mt-1">${this.formatCurrency(item.total)}</div>
                        </div>
                      </div>
                    </div>
                  `)}
                `}
              </div>
              ${this.cart.length > 0 ? html`
                <div class="card-footer">
                  <div class="d-flex justify-content-between mb-3">
                    <strong class="fs-5">Total:</strong>
                    <strong class="fs-5 text-success">${this.formatCurrency(this.cartTotal)}</strong>
                  </div>
                  <button class="btn btn-success w-100" 
                          @click=${this.handleTransferCart}
                          ?disabled=${this.cart.length === 0}>
                    <i class="bi bi-arrow-return-left me-2"></i>Transfer to ${this.protocol.toUpperCase()}
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('punchout-session', PunchoutSession);
