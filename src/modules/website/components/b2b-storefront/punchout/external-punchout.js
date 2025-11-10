/**
 * External Punchout - Punch out to external supplier catalogs
 * Browse external suppliers and receive items back into cart
 */

import { LitElement, html } from 'lit';

class ExternalPunchout extends LitElement {
  static properties = {
    suppliers: { type: Array },
    returnedItems: { type: Array },
    loading: { type: Boolean },
    processingReturn: { type: Boolean },
    selectedSupplier: { type: Object },
    showReturnModal: { type: Boolean }
  };

  constructor() {
    super();
    this.suppliers = [];
    this.returnedItems = [];
    this.loading = false;
    this.processingReturn = false;
    this.selectedSupplier = null;
    this.showReturnModal = false;
    this.companyId = 1; // Mock: From authentication
    
    this.loadSuppliers();
    this.checkForReturnData();
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    // Listen for return from external punchout
    window.addEventListener('message', this.handlePunchoutReturn.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('message', this.handlePunchoutReturn.bind(this));
  }

  loadSuppliers() {
    // Mock supplier catalog - in production, load from API
    this.suppliers = [
      {
        id: 1,
        name: 'Office Supplies Direct',
        description: 'Complete office supplies, furniture, and technology',
        category: 'Office Supplies',
        protocol: 'cxml',
        punchoutUrl: 'https://suppliers.example.com/office-supplies/punchout',
        logo: null,
        active: true,
        contractPricing: true,
        averageDelivery: '2-3 days'
      },
      {
        id: 2,
        name: 'Industrial Parts Co',
        description: 'MRO supplies, tools, and industrial equipment',
        category: 'Industrial',
        protocol: 'oci',
        punchoutUrl: 'https://suppliers.example.com/industrial/punchout',
        logo: null,
        active: true,
        contractPricing: true,
        averageDelivery: '1-2 days'
      },
      {
        id: 3,
        name: 'Tech Equipment Plus',
        description: 'Computers, electronics, and IT accessories',
        category: 'Technology',
        protocol: 'cxml',
        punchoutUrl: 'https://suppliers.example.com/tech/punchout',
        logo: null,
        active: true,
        contractPricing: false,
        averageDelivery: '3-5 days'
      },
      {
        id: 4,
        name: 'Safety & PPE Warehouse',
        description: 'Safety equipment, PPE, and workplace safety supplies',
        category: 'Safety',
        protocol: 'cxml',
        punchoutUrl: 'https://suppliers.example.com/safety/punchout',
        logo: null,
        active: true,
        contractPricing: true,
        averageDelivery: '1-2 days'
      },
      {
        id: 5,
        name: 'Facilities Maintenance Supply',
        description: 'Janitorial, cleaning, and facility maintenance products',
        category: 'Facilities',
        protocol: 'oci',
        punchoutUrl: 'https://suppliers.example.com/facilities/punchout',
        logo: null,
        active: true,
        contractPricing: true,
        averageDelivery: '2-4 days'
      }
    ];
  }

  checkForReturnData() {
    // Check URL for return data from external punchout
    const urlParams = new URLSearchParams(window.location.search);
    const cxmlData = urlParams.get('cxml-urlencoded');
    const ociData = urlParams.get('NEW_ITEM-DESCRIPTION[1]');
    
    if (cxmlData) {
      this.processCXMLReturn(decodeURIComponent(cxmlData));
    } else if (ociData) {
      this.processOCIReturn(urlParams);
    }
  }

  handlePunchoutToSupplier(supplier) {
    this.selectedSupplier = supplier;
    
    if (!confirm(`Punch out to ${supplier.name}?\n\nYou will be redirected to their catalog. Selected items will be added to your cart when you return.`)) {
      return;
    }

    // Build punchout request
    if (supplier.protocol === 'cxml') {
      this.punchoutCXML(supplier);
    } else if (supplier.protocol === 'oci') {
      this.punchoutOCI(supplier);
    }
  }

  punchoutCXML(supplier) {
    // Build cXML PunchOutSetupRequest
    const buyerCookie = this.generateBuyerCookie();
    const returnUrl = `${window.location.origin}${window.location.pathname}#/b2b-store/external-punchout`;
    
    const setupRequest = this.buildCXMLSetupRequest(buyerCookie, returnUrl);
    
    // Create form to POST to supplier
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = supplier.punchoutUrl;
    form.target = '_blank'; // Open in new window
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'cxml-urlencoded';
    input.value = encodeURIComponent(setupRequest);
    
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    // Store session info
    sessionStorage.setItem('external_punchout_session', JSON.stringify({
      supplierId: supplier.id,
      supplierName: supplier.name,
      protocol: 'cxml',
      buyerCookie: buyerCookie,
      timestamp: new Date().toISOString()
    }));
  }

  punchoutOCI(supplier) {
    // Build OCI punchout URL
    const returnUrl = `${window.location.origin}${window.location.pathname}#/b2b-store/external-punchout`;
    
    const ociUrl = `${supplier.punchoutUrl}?` +
      `HOOK_URL=${encodeURIComponent(returnUrl)}` +
      `&USERNAME=buyer_${this.companyId}` +
      `&PASSWORD=session_${Date.now()}`;
    
    // Open in new window
    window.open(ociUrl, '_blank');
    
    // Store session info
    sessionStorage.setItem('external_punchout_session', JSON.stringify({
      supplierId: supplier.id,
      supplierName: supplier.name,
      protocol: 'oci',
      timestamp: new Date().toISOString()
    }));
  }

  buildCXMLSetupRequest(buyerCookie, returnUrl) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd">
<cXML payloadID="${this.generatePayloadId()}" timestamp="${new Date().toISOString()}" xml:lang="en-US">
  <Header>
    <From>
      <Credential domain="NetworkID">
        <Identity>Buyer-${this.companyId}</Identity>
      </Credential>
    </From>
    <To>
      <Credential domain="NetworkID">
        <Identity>SupplierSystem</Identity>
      </Credential>
    </To>
    <Sender>
      <Credential domain="NetworkID">
        <Identity>Buyer-${this.companyId}</Identity>
      </Credential>
      <UserAgent>B2B Storefront External Punchout 1.0</UserAgent>
    </Sender>
  </Header>
  <Request>
    <PunchOutSetupRequest operation="create">
      <BuyerCookie>${buyerCookie}</BuyerCookie>
      <Extrinsic name="UserEmail">user@company.com</Extrinsic>
      <Extrinsic name="UniqueName">Company Name</Extrinsic>
      <BrowserFormPost>
        <URL>${returnUrl}</URL>
      </BrowserFormPost>
      <Contact role="buyer">
        <Name xml:lang="en">Buyer Name</Name>
        <Email>buyer@company.com</Email>
      </Contact>
    </PunchOutSetupRequest>
  </Request>
</cXML>`;
  }

  processCXMLReturn(cxmlData) {
    this.processingReturn = true;
    
    try {
      // Parse cXML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(cxmlData, 'text/xml');
      
      // Extract items from PunchOutOrderMessage
      const items = [];
      const itemNodes = xmlDoc.getElementsByTagName('ItemIn');
      
      for (let i = 0; i < itemNodes.length; i++) {
        const itemNode = itemNodes[i];
        const quantity = itemNode.getAttribute('quantity');
        const lineNumber = itemNode.getAttribute('lineNumber');
        
        const sku = this.getXMLValue(itemNode, 'SupplierPartID');
        const description = this.getXMLValue(itemNode, 'Description');
        const unitPrice = this.getXMLValue(itemNode, 'Money');
        const uom = this.getXMLValue(itemNode, 'UnitOfMeasure');
        const manufacturer = this.getXMLValue(itemNode, 'ManufacturerName');
        const mpn = this.getXMLValue(itemNode, 'ManufacturerPartID');
        
        items.push({
          lineNumber: parseInt(lineNumber),
          sku: sku,
          description: description,
          quantity: parseInt(quantity),
          unitPrice: parseFloat(unitPrice),
          uom: uom,
          manufacturer: manufacturer,
          manufacturerPartNumber: mpn,
          total: parseInt(quantity) * parseFloat(unitPrice),
          source: 'external',
          protocol: 'cxml'
        });
      }
      
      this.returnedItems = items;
      this.showReturnModal = true;
      
      // Get supplier info from session
      const session = JSON.parse(sessionStorage.getItem('external_punchout_session') || '{}');
      this.selectedSupplier = this.suppliers.find(s => s.id === session.supplierId);
      
    } catch (err) {
      console.error('Failed to parse cXML return:', err);
      alert('Error processing returned items from supplier');
    } finally {
      this.processingReturn = false;
      this.requestUpdate();
    }
  }

  processOCIReturn(urlParams) {
    this.processingReturn = true;
    
    try {
      const items = [];
      let lineNum = 1;
      
      // Parse OCI format (NEW_ITEM-FIELD[n])
      while (urlParams.has(`NEW_ITEM-DESCRIPTION[${lineNum}]`)) {
        const description = urlParams.get(`NEW_ITEM-DESCRIPTION[${lineNum}]`);
        const sku = urlParams.get(`NEW_ITEM-VENDORMAT[${lineNum}]`);
        const quantity = urlParams.get(`NEW_ITEM-QUANTITY[${lineNum}]`);
        const price = urlParams.get(`NEW_ITEM-PRICE[${lineNum}]`);
        const uom = urlParams.get(`NEW_ITEM-UNIT[${lineNum}]`);
        const manufacturer = urlParams.get(`NEW_ITEM-MANUFACTURER[${lineNum}]`);
        const mpn = urlParams.get(`NEW_ITEM-MANUFACTMAT[${lineNum}]`);
        
        items.push({
          lineNumber: lineNum,
          sku: sku || `EXT-${lineNum}`,
          description: description,
          quantity: parseInt(quantity) || 1,
          unitPrice: parseFloat(price) || 0,
          uom: uom || 'EA',
          manufacturer: manufacturer || '',
          manufacturerPartNumber: mpn || '',
          total: (parseInt(quantity) || 1) * (parseFloat(price) || 0),
          source: 'external',
          protocol: 'oci'
        });
        
        lineNum++;
      }
      
      this.returnedItems = items;
      this.showReturnModal = true;
      
      // Get supplier info from session
      const session = JSON.parse(sessionStorage.getItem('external_punchout_session') || '{}');
      this.selectedSupplier = this.suppliers.find(s => s.id === session.supplierId);
      
    } catch (err) {
      console.error('Failed to parse OCI return:', err);
      alert('Error processing returned items from supplier');
    } finally {
      this.processingReturn = false;
      this.requestUpdate();
    }
  }

  handlePunchoutReturn(event) {
    // Handle postMessage from punchout window
    if (event.data && event.data.type === 'punchout-return') {
      if (event.data.protocol === 'cxml') {
        this.processCXMLReturn(event.data.payload);
      } else if (event.data.protocol === 'oci') {
        // Process OCI data from postMessage
        const urlParams = new URLSearchParams(event.data.payload);
        this.processOCIReturn(urlParams);
      }
    }
  }

  handleAddToCart() {
    if (this.returnedItems.length === 0) return;
    
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem('b2b-cart') || '[]');
    
    // Add returned items to cart
    this.returnedItems.forEach(item => {
      existingCart.push({
        productId: `EXT-${Date.now()}-${Math.random()}`, // Generate unique ID for external items
        sku: item.sku,
        name: item.description,
        description: `${item.manufacturer ? item.manufacturer + ' - ' : ''}${item.manufacturerPartNumber || ''}`,
        quantity: item.quantity,
        price: item.unitPrice,
        total: item.total,
        uom: item.uom,
        source: 'external',
        supplier: this.selectedSupplier?.name || 'External Supplier'
      });
    });
    
    // Save updated cart
    localStorage.setItem('b2b-cart', JSON.stringify(existingCart));
    
    // Clear session
    sessionStorage.removeItem('external_punchout_session');
    
    // Show success and redirect
    alert(`${this.returnedItems.length} items added to cart from ${this.selectedSupplier?.name || 'external supplier'}!`);
    window.location.pathname = '/b2b-store/cart';
  }

  handleCancelReturn() {
    this.showReturnModal = false;
    this.returnedItems = [];
    this.selectedSupplier = null;
    sessionStorage.removeItem('external_punchout_session');
  }

  getXMLValue(parent, tagName) {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent : '';
  }

  generateBuyerCookie() {
    return 'BUYER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  generatePayloadId() {
    return Date.now() + '@' + window.location.hostname;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  get totalReturnedValue() {
    return this.returnedItems.reduce((sum, item) => sum + item.total, 0);
  }

  render() {
    if (this.processingReturn) {
      return html`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Processing returned items...</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="mb-4">
          <h2 class="mb-1">
            <i class="bi bi-box-arrow-up-right me-2"></i>External Supplier Catalogs
          </h2>
          <p class="text-muted mb-0">Browse and purchase from approved external suppliers</p>
        </div>

        <!-- Info Alert -->
        <div class="alert alert-info mb-4">
          <h5 class="alert-heading"><i class="bi bi-info-circle me-2"></i>How It Works</h5>
          <ol class="mb-0">
            <li>Click "Browse Catalog" on any supplier below</li>
            <li>A new window opens with the supplier's catalog</li>
            <li>Select items and complete your selection in their system</li>
            <li>Items are automatically added to your cart when you return</li>
            <li>Complete checkout with all items from multiple suppliers</li>
          </ol>
        </div>

        <!-- Supplier Cards -->
        <div class="row g-4">
          ${this.suppliers.map(supplier => html`
            <div class="col-md-6 col-lg-4">
              <div class="card h-100 ${!supplier.active ? 'opacity-50' : ''}">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="flex-grow-1">
                      <h5 class="card-title mb-1">${supplier.name}</h5>
                      <span class="badge bg-secondary">${supplier.category}</span>
                      ${supplier.contractPricing ? html`
                        <span class="badge bg-success ms-1">Contract Pricing</span>
                      ` : ''}
                    </div>
                    ${supplier.logo ? html`
                      <img src="${supplier.logo}" alt="${supplier.name}" style="height: 40px;" />
                    ` : html`
                      <div class="bg-light rounded p-2" style="width: 50px; height: 50px;">
                        <i class="bi bi-building fs-4 text-secondary"></i>
                      </div>
                    `}
                  </div>
                  
                  <p class="card-text text-muted small mb-3">${supplier.description}</p>
                  
                  <div class="mb-3">
                    <div class="d-flex justify-content-between small mb-1">
                      <span class="text-muted">Protocol:</span>
                      <strong class="text-uppercase">${supplier.protocol}</strong>
                    </div>
                    <div class="d-flex justify-content-between small">
                      <span class="text-muted">Avg. Delivery:</span>
                      <strong>${supplier.averageDelivery}</strong>
                    </div>
                  </div>
                  
                  <button class="btn btn-primary w-100" 
                          @click=${() => this.handlePunchoutToSupplier(supplier)}
                          ?disabled=${!supplier.active}>
                    <i class="bi bi-box-arrow-up-right me-2"></i>Browse Catalog
                  </button>
                </div>
              </div>
            </div>
          `)}
        </div>

        <!-- Return Modal -->
        ${this.showReturnModal ? html`
          <div class="modal show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header bg-success text-white">
                  <h5 class="modal-title">
                    <i class="bi bi-check-circle me-2"></i>Items Returned from ${this.selectedSupplier?.name}
                  </h5>
                  <button type="button" class="btn-close btn-close-white" @click=${this.handleCancelReturn}></button>
                </div>
                <div class="modal-body">
                  <div class="alert alert-success">
                    <strong>${this.returnedItems.length} items</strong> ready to add to your cart
                  </div>
                  
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>Line</th>
                          <th>Description</th>
                          <th>SKU</th>
                          <th>Manufacturer</th>
                          <th class="text-center">Qty</th>
                          <th class="text-end">Unit Price</th>
                          <th class="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.returnedItems.map(item => html`
                          <tr>
                            <td>${item.lineNumber}</td>
                            <td>
                              <strong>${item.description}</strong>
                              ${item.uom !== 'EA' ? html`<br><small class="text-muted">UOM: ${item.uom}</small>` : ''}
                            </td>
                            <td><code>${item.sku}</code></td>
                            <td>
                              ${item.manufacturer || '-'}
                              ${item.manufacturerPartNumber ? html`<br><small class="text-muted">${item.manufacturerPartNumber}</small>` : ''}
                            </td>
                            <td class="text-center">${item.quantity}</td>
                            <td class="text-end">${this.formatCurrency(item.unitPrice)}</td>
                            <td class="text-end"><strong>${this.formatCurrency(item.total)}</strong></td>
                          </tr>
                        `)}
                      </tbody>
                      <tfoot>
                        <tr class="table-light">
                          <th colspan="6" class="text-end">Total Value:</th>
                          <th class="text-end">${this.formatCurrency(this.totalReturnedValue)}</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click=${this.handleCancelReturn}>
                    <i class="bi bi-x-circle me-2"></i>Cancel
                  </button>
                  <button type="button" class="btn btn-success" @click=${this.handleAddToCart}>
                    <i class="bi bi-cart-plus me-2"></i>Add ${this.returnedItems.length} Items to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('external-punchout', ExternalPunchout);
