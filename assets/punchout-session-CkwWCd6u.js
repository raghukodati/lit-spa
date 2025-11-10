import{T as r,N as a}from"./index-YRTalx74.js";import{getProducts as o}from"./product.service-CxkNPT-C.js";import{getCompanyById as n}from"./company.service-DVWFSJX1.js";import"./product.model-uhuUaOub.js";import"./company.model-CKmygYMs.js";class c extends r{static properties={sessionActive:{type:Boolean},sessionData:{type:Object},protocol:{type:String},cart:{type:Array},products:{type:Array},loading:{type:Boolean},company:{type:Object},searchQuery:{type:String},selectedCategory:{type:String},viewMode:{type:String}};constructor(){super(),this.sessionActive=!1,this.sessionData=null,this.protocol=null,this.cart=[],this.products=[],this.loading=!1,this.company=null,this.searchQuery="",this.selectedCategory="all",this.viewMode="grid",this.companyId=1,this.initializeSession()}createRenderRoot(){return this}async connectedCallback(){super.connectedCallback(),await this.loadCompany(),await this.loadProducts()}async initializeSession(){const e=new URLSearchParams(window.location.search),t=e.get("protocol")||e.get("HOOK_URL")?"oci":e.get("cxml-urlencoded")?"cxml":null;if(t)this.sessionActive=!0,this.protocol=t,t==="cxml"?this.sessionData={buyerCookie:e.get("buyerCookie"),returnURL:e.get("returnURL"),sessionId:e.get("sessionId"),timestamp:new Date().toISOString()}:t==="oci"&&(this.sessionData={hookUrl:e.get("HOOK_URL"),username:e.get("USERNAME"),password:e.get("PASSWORD"),sessionId:this.generateSessionId(),timestamp:new Date().toISOString()}),sessionStorage.setItem("punchout_session",JSON.stringify({protocol:this.protocol,data:this.sessionData,active:!0})),this.requestUpdate();else{const s=sessionStorage.getItem("punchout_session");if(s){const i=JSON.parse(s);this.sessionActive=i.active,this.protocol=i.protocol,this.sessionData=i.data}}}generateSessionId(){return"POUT-"+Date.now()+"-"+Math.random().toString(36).substr(2,9)}async loadCompany(){this.loading=!0;try{this.company=await n(this.companyId)}catch(e){console.error("Failed to load company:",e)}finally{this.loading=!1}}async loadProducts(){this.loading=!0;try{this.products=await o()}catch(e){console.error("Failed to load products:",e)}finally{this.loading=!1}}handleAddToCart(e,t=1){const s=this.cart.find(i=>i.productId===e.id);s?(s.quantity+=t,s.total=s.quantity*s.price):this.cart.push({productId:e.id,sku:e.sku,name:e.name,description:e.description,quantity:t,price:e.price,total:e.price*t,uom:e.unitOfMeasure||"EA",manufacturer:e.manufacturer||"",manufacturerPartNumber:e.mpn||""}),this.requestUpdate()}handleUpdateQuantity(e,t){const s=this.cart.find(i=>i.productId===e);s&&(s.quantity=parseInt(t),s.total=s.quantity*s.price,this.requestUpdate())}handleRemoveItem(e){this.cart=this.cart.filter(t=>t.productId!==e)}handleTransferCart(){if(!this.sessionActive||!this.sessionData){alert("No active punchout session");return}if(this.cart.length===0){alert("Cart is empty. Please add items before transferring.");return}this.protocol==="cxml"?this.transferCXML():this.protocol==="oci"&&this.transferOCI()}transferCXML(){const e=this.buildCXMLOrderMessage(),t=document.createElement("form");t.method="POST",t.action=this.sessionData.returnURL;const s=document.createElement("input");s.type="hidden",s.name="cxml-urlencoded",s.value=encodeURIComponent(e),t.appendChild(s),document.body.appendChild(t),t.submit()}buildCXMLOrderMessage(){const e=this.cart.map((t,s)=>`
      <ItemIn quantity="${t.quantity}" lineNumber="${s+1}">
        <ItemID>
          <SupplierPartID>${t.sku}</SupplierPartID>
        </ItemID>
        <ItemDetail>
          <UnitPrice>
            <Money currency="USD">${t.price.toFixed(2)}</Money>
          </UnitPrice>
          <Description xml:lang="en">${this.escapeXML(t.name)}</Description>
          <UnitOfMeasure>${t.uom}</UnitOfMeasure>
          <Classification domain="UNSPSC">43211500</Classification>
          <ManufacturerPartID>${t.manufacturerPartNumber}</ManufacturerPartID>
          <ManufacturerName>${this.escapeXML(t.manufacturer)}</ManufacturerName>
        </ItemDetail>
      </ItemIn>
    `).join("");return`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd">
<cXML payloadID="${this.generatePayloadId()}" timestamp="${new Date().toISOString()}" xml:lang="en-US">
  <Header>
    <From>
      <Credential domain="NetworkID">
        <Identity>${this.company?.name||"Supplier"}</Identity>
      </Credential>
    </From>
    <To>
      <Credential domain="NetworkID">
        <Identity>BuyerSystem</Identity>
      </Credential>
    </To>
    <Sender>
      <Credential domain="NetworkID">
        <Identity>${this.company?.name||"Supplier"}</Identity>
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
      ${e}
    </PunchOutOrderMessage>
  </Message>
</cXML>`}transferOCI(){const e=document.createElement("form");e.method="POST",e.action=this.sessionData.hookUrl,this.addFormField(e,"USERNAME",this.sessionData.username),this.addFormField(e,"PASSWORD",this.sessionData.password),this.cart.forEach((t,s)=>{const i=s+1;this.addFormField(e,`NEW_ITEM-DESCRIPTION[${i}]`,t.name),this.addFormField(e,`NEW_ITEM-VENDORMAT[${i}]`,t.sku),this.addFormField(e,`NEW_ITEM-QUANTITY[${i}]`,t.quantity.toString()),this.addFormField(e,`NEW_ITEM-UNIT[${i}]`,t.uom),this.addFormField(e,`NEW_ITEM-PRICE[${i}]`,t.price.toFixed(2)),this.addFormField(e,`NEW_ITEM-CURRENCY[${i}]`,"USD"),this.addFormField(e,`NEW_ITEM-LEADTIME[${i}]`,"5"),this.addFormField(e,`NEW_ITEM-MANUFACTURER[${i}]`,t.manufacturer),this.addFormField(e,`NEW_ITEM-MANUFACTMAT[${i}]`,t.manufacturerPartNumber)}),document.body.appendChild(e),e.submit()}addFormField(e,t,s){const i=document.createElement("input");i.type="hidden",i.name=t,i.value=s||"",e.appendChild(i)}generatePayloadId(){return Date.now()+"@"+window.location.hostname}escapeXML(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"):""}handleCancelSession(){confirm("Cancel punchout session and return to procurement system?")&&(sessionStorage.removeItem("punchout_session"),this.protocol==="cxml"&&this.sessionData.returnURL?window.location.href=this.sessionData.returnURL:this.protocol==="oci"&&this.sessionData.hookUrl?window.location.href=this.sessionData.hookUrl:window.location.pathname="/b2b-store")}get cartTotal(){return this.cart.reduce((e,t)=>e+t.total,0)}get filteredProducts(){let e=[...this.products];if(this.searchQuery){const t=this.searchQuery.toLowerCase();e=e.filter(s=>s.name.toLowerCase().includes(t)||s.sku.toLowerCase().includes(t)||s.description&&s.description.toLowerCase().includes(t))}return this.selectedCategory!=="all"&&(e=e.filter(t=>t.category===this.selectedCategory)),e}formatCurrency(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(e)}render(){return this.loading?a`
        <div class="container-fluid mt-4">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading punchout session...</p>
          </div>
        </div>
      `:this.sessionActive?a`
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
                           @input=${e=>this.searchQuery=e.target.value}
                           style="width: 250px;" />
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  ${this.filteredProducts.map(e=>a`
                    <div class="col-md-6">
                      <div class="card h-100">
                        <div class="card-body">
                          <h6 class="card-title">${e.name}</h6>
                          <p class="text-muted small mb-2">SKU: ${e.sku}</p>
                          <p class="card-text small">${e.description||"No description"}</p>
                          <div class="d-flex justify-content-between align-items-center mt-3">
                            <strong class="text-primary fs-5">${this.formatCurrency(e.price)}</strong>
                            <button class="btn btn-sm btn-success" 
                                    @click=${()=>this.handleAddToCart(e)}>
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
                ${this.cart.length===0?a`
                  <div class="text-center text-muted py-4">
                    <i class="bi bi-cart-x" style="font-size: 3rem;"></i>
                    <p class="mt-2">No items selected</p>
                  </div>
                `:a`
                  ${this.cart.map(e=>a`
                    <div class="border-bottom pb-2 mb-2">
                      <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                          <h6 class="mb-1 small">${e.name}</h6>
                          <p class="text-muted small mb-1">SKU: ${e.sku}</p>
                          <div class="d-flex align-items-center gap-2">
                            <input type="number" class="form-control form-control-sm" 
                                   style="width: 70px;"
                                   min="1"
                                   .value=${e.quantity}
                                   @change=${t=>this.handleUpdateQuantity(e.productId,t.target.value)} />
                            <span class="small">× ${this.formatCurrency(e.price)}</span>
                          </div>
                        </div>
                        <div class="text-end">
                          <button class="btn btn-sm btn-outline-danger" 
                                  @click=${()=>this.handleRemoveItem(e.productId)}>
                            <i class="bi bi-x"></i>
                          </button>
                          <div class="fw-bold mt-1">${this.formatCurrency(e.total)}</div>
                        </div>
                      </div>
                    </div>
                  `)}
                `}
              </div>
              ${this.cart.length>0?a`
                <div class="card-footer">
                  <div class="d-flex justify-content-between mb-3">
                    <strong class="fs-5">Total:</strong>
                    <strong class="fs-5 text-success">${this.formatCurrency(this.cartTotal)}</strong>
                  </div>
                  <button class="btn btn-success w-100" 
                          @click=${this.handleTransferCart}
                          ?disabled=${this.cart.length===0}>
                    <i class="bi bi-arrow-return-left me-2"></i>Transfer to ${this.protocol.toUpperCase()}
                  </button>
                </div>
              `:""}
            </div>
          </div>
        </div>
      </div>
    `:a`
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
      `}}customElements.define("punchout-session",c);
