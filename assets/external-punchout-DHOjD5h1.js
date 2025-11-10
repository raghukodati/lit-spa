import{T as b,N as o}from"./index-tL1z1sM1.js";class f extends b{static properties={suppliers:{type:Array},returnedItems:{type:Array},loading:{type:Boolean},processingReturn:{type:Boolean},selectedSupplier:{type:Object},showReturnModal:{type:Boolean}};constructor(){super(),this.suppliers=[],this.returnedItems=[],this.loading=!1,this.processingReturn=!1,this.selectedSupplier=null,this.showReturnModal=!1,this.companyId=1,this.loadSuppliers(),this.checkForReturnData()}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),window.addEventListener("message",this.handlePunchoutReturn.bind(this))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("message",this.handlePunchoutReturn.bind(this))}loadSuppliers(){this.suppliers=[{id:1,name:"Office Supplies Direct",description:"Complete office supplies, furniture, and technology",category:"Office Supplies",protocol:"cxml",punchoutUrl:"https://suppliers.example.com/office-supplies/punchout",logo:null,active:!0,contractPricing:!0,averageDelivery:"2-3 days"},{id:2,name:"Industrial Parts Co",description:"MRO supplies, tools, and industrial equipment",category:"Industrial",protocol:"oci",punchoutUrl:"https://suppliers.example.com/industrial/punchout",logo:null,active:!0,contractPricing:!0,averageDelivery:"1-2 days"},{id:3,name:"Tech Equipment Plus",description:"Computers, electronics, and IT accessories",category:"Technology",protocol:"cxml",punchoutUrl:"https://suppliers.example.com/tech/punchout",logo:null,active:!0,contractPricing:!1,averageDelivery:"3-5 days"},{id:4,name:"Safety & PPE Warehouse",description:"Safety equipment, PPE, and workplace safety supplies",category:"Safety",protocol:"cxml",punchoutUrl:"https://suppliers.example.com/safety/punchout",logo:null,active:!0,contractPricing:!0,averageDelivery:"1-2 days"},{id:5,name:"Facilities Maintenance Supply",description:"Janitorial, cleaning, and facility maintenance products",category:"Facilities",protocol:"oci",punchoutUrl:"https://suppliers.example.com/facilities/punchout",logo:null,active:!0,contractPricing:!0,averageDelivery:"2-4 days"}]}checkForReturnData(){const e=new URLSearchParams(window.location.search),t=e.get("cxml-urlencoded"),s=e.get("NEW_ITEM-DESCRIPTION[1]");t?this.processCXMLReturn(decodeURIComponent(t)):s&&this.processOCIReturn(e)}handlePunchoutToSupplier(e){this.selectedSupplier=e,confirm(`Punch out to ${e.name}?

You will be redirected to their catalog. Selected items will be added to your cart when you return.`)&&(e.protocol==="cxml"?this.punchoutCXML(e):e.protocol==="oci"&&this.punchoutOCI(e))}punchoutCXML(e){const t=this.generateBuyerCookie(),s=`${window.location.origin}${window.location.pathname}#/b2b-store/external-punchout`,c=this.buildCXMLSetupRequest(t,s),r=document.createElement("form");r.method="POST",r.action=e.punchoutUrl,r.target="_blank";const a=document.createElement("input");a.type="hidden",a.name="cxml-urlencoded",a.value=encodeURIComponent(c),r.appendChild(a),document.body.appendChild(r),r.submit(),document.body.removeChild(r),sessionStorage.setItem("external_punchout_session",JSON.stringify({supplierId:e.id,supplierName:e.name,protocol:"cxml",buyerCookie:t,timestamp:new Date().toISOString()}))}punchoutOCI(e){const t=`${window.location.origin}${window.location.pathname}#/b2b-store/external-punchout`,s=`${e.punchoutUrl}?HOOK_URL=${encodeURIComponent(t)}&USERNAME=buyer_${this.companyId}&PASSWORD=session_${Date.now()}`;window.open(s,"_blank"),sessionStorage.setItem("external_punchout_session",JSON.stringify({supplierId:e.id,supplierName:e.name,protocol:"oci",timestamp:new Date().toISOString()}))}buildCXMLSetupRequest(e,t){return`<?xml version="1.0" encoding="UTF-8"?>
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
      <BuyerCookie>${e}</BuyerCookie>
      <Extrinsic name="UserEmail">user@company.com</Extrinsic>
      <Extrinsic name="UniqueName">Company Name</Extrinsic>
      <BrowserFormPost>
        <URL>${t}</URL>
      </BrowserFormPost>
      <Contact role="buyer">
        <Name xml:lang="en">Buyer Name</Name>
        <Email>buyer@company.com</Email>
      </Contact>
    </PunchOutSetupRequest>
  </Request>
</cXML>`}processCXMLReturn(e){this.processingReturn=!0;try{const s=new DOMParser().parseFromString(e,"text/xml"),c=[],r=s.getElementsByTagName("ItemIn");for(let i=0;i<r.length;i++){const n=r[i],l=n.getAttribute("quantity"),u=n.getAttribute("lineNumber"),d=this.getXMLValue(n,"SupplierPartID"),m=this.getXMLValue(n,"Description"),p=this.getXMLValue(n,"Money"),h=this.getXMLValue(n,"UnitOfMeasure"),g=this.getXMLValue(n,"ManufacturerName"),y=this.getXMLValue(n,"ManufacturerPartID");c.push({lineNumber:parseInt(u),sku:d,description:m,quantity:parseInt(l),unitPrice:parseFloat(p),uom:h,manufacturer:g,manufacturerPartNumber:y,total:parseInt(l)*parseFloat(p),source:"external",protocol:"cxml"})}this.returnedItems=c,this.showReturnModal=!0;const a=JSON.parse(sessionStorage.getItem("external_punchout_session")||"{}");this.selectedSupplier=this.suppliers.find(i=>i.id===a.supplierId)}catch(t){console.error("Failed to parse cXML return:",t),alert("Error processing returned items from supplier")}finally{this.processingReturn=!1,this.requestUpdate()}}processOCIReturn(e){this.processingReturn=!0;try{const t=[];let s=1;for(;e.has(`NEW_ITEM-DESCRIPTION[${s}]`);){const r=e.get(`NEW_ITEM-DESCRIPTION[${s}]`),a=e.get(`NEW_ITEM-VENDORMAT[${s}]`),i=e.get(`NEW_ITEM-QUANTITY[${s}]`),n=e.get(`NEW_ITEM-PRICE[${s}]`),l=e.get(`NEW_ITEM-UNIT[${s}]`),u=e.get(`NEW_ITEM-MANUFACTURER[${s}]`),d=e.get(`NEW_ITEM-MANUFACTMAT[${s}]`);t.push({lineNumber:s,sku:a||`EXT-${s}`,description:r,quantity:parseInt(i)||1,unitPrice:parseFloat(n)||0,uom:l||"EA",manufacturer:u||"",manufacturerPartNumber:d||"",total:(parseInt(i)||1)*(parseFloat(n)||0),source:"external",protocol:"oci"}),s++}this.returnedItems=t,this.showReturnModal=!0;const c=JSON.parse(sessionStorage.getItem("external_punchout_session")||"{}");this.selectedSupplier=this.suppliers.find(r=>r.id===c.supplierId)}catch(t){console.error("Failed to parse OCI return:",t),alert("Error processing returned items from supplier")}finally{this.processingReturn=!1,this.requestUpdate()}}handlePunchoutReturn(e){if(e.data&&e.data.type==="punchout-return"){if(e.data.protocol==="cxml")this.processCXMLReturn(e.data.payload);else if(e.data.protocol==="oci"){const t=new URLSearchParams(e.data.payload);this.processOCIReturn(t)}}}handleAddToCart(){if(this.returnedItems.length===0)return;const e=JSON.parse(localStorage.getItem("b2b-cart")||"[]");this.returnedItems.forEach(t=>{e.push({productId:`EXT-${Date.now()}-${Math.random()}`,sku:t.sku,name:t.description,description:`${t.manufacturer?t.manufacturer+" - ":""}${t.manufacturerPartNumber||""}`,quantity:t.quantity,price:t.unitPrice,total:t.total,uom:t.uom,source:"external",supplier:this.selectedSupplier?.name||"External Supplier"})}),localStorage.setItem("b2b-cart",JSON.stringify(e)),sessionStorage.removeItem("external_punchout_session"),alert(`${this.returnedItems.length} items added to cart from ${this.selectedSupplier?.name||"external supplier"}!`),window.location.pathname="/b2b-store/cart"}handleCancelReturn(){this.showReturnModal=!1,this.returnedItems=[],this.selectedSupplier=null,sessionStorage.removeItem("external_punchout_session")}getXMLValue(e,t){const s=e.getElementsByTagName(t)[0];return s?s.textContent:""}generateBuyerCookie(){return"BUYER-"+Date.now()+"-"+Math.random().toString(36).substr(2,9)}generatePayloadId(){return Date.now()+"@"+window.location.hostname}formatCurrency(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(e)}get totalReturnedValue(){return this.returnedItems.reduce((e,t)=>e+t.total,0)}render(){return this.processingReturn?o`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Processing returned items...</p>
          </div>
        </div>
      `:o`
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
          ${this.suppliers.map(e=>o`
            <div class="col-md-6 col-lg-4">
              <div class="card h-100 ${e.active?"":"opacity-50"}">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="flex-grow-1">
                      <h5 class="card-title mb-1">${e.name}</h5>
                      <span class="badge bg-secondary">${e.category}</span>
                      ${e.contractPricing?o`
                        <span class="badge bg-success ms-1">Contract Pricing</span>
                      `:""}
                    </div>
                    ${e.logo?o`
                      <img src="${e.logo}" alt="${e.name}" style="height: 40px;" />
                    `:o`
                      <div class="bg-light rounded p-2" style="width: 50px; height: 50px;">
                        <i class="bi bi-building fs-4 text-secondary"></i>
                      </div>
                    `}
                  </div>
                  
                  <p class="card-text text-muted small mb-3">${e.description}</p>
                  
                  <div class="mb-3">
                    <div class="d-flex justify-content-between small mb-1">
                      <span class="text-muted">Protocol:</span>
                      <strong class="text-uppercase">${e.protocol}</strong>
                    </div>
                    <div class="d-flex justify-content-between small">
                      <span class="text-muted">Avg. Delivery:</span>
                      <strong>${e.averageDelivery}</strong>
                    </div>
                  </div>
                  
                  <button class="btn btn-primary w-100" 
                          @click=${()=>this.handlePunchoutToSupplier(e)}
                          ?disabled=${!e.active}>
                    <i class="bi bi-box-arrow-up-right me-2"></i>Browse Catalog
                  </button>
                </div>
              </div>
            </div>
          `)}
        </div>

        <!-- Return Modal -->
        ${this.showReturnModal?o`
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
                        ${this.returnedItems.map(e=>o`
                          <tr>
                            <td>${e.lineNumber}</td>
                            <td>
                              <strong>${e.description}</strong>
                              ${e.uom!=="EA"?o`<br><small class="text-muted">UOM: ${e.uom}</small>`:""}
                            </td>
                            <td><code>${e.sku}</code></td>
                            <td>
                              ${e.manufacturer||"-"}
                              ${e.manufacturerPartNumber?o`<br><small class="text-muted">${e.manufacturerPartNumber}</small>`:""}
                            </td>
                            <td class="text-center">${e.quantity}</td>
                            <td class="text-end">${this.formatCurrency(e.unitPrice)}</td>
                            <td class="text-end"><strong>${this.formatCurrency(e.total)}</strong></td>
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
        `:""}
      </div>
    `}}customElements.define("external-punchout",f);
