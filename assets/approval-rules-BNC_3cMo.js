import{T as r,N as s}from"./index-DfU7H5-o.js";class l extends r{static properties={rules:{type:Array},loading:{type:Boolean},showModal:{type:Boolean},editingRule:{type:Object},isNew:{type:Boolean}};constructor(){super(),this.rules=this.loadRules(),this.loading=!1,this.showModal=!1,this.editingRule=null,this.isNew=!1}createRenderRoot(){return this}loadRules(){return[{id:1,name:"Standard Purchase",description:"Orders under $5,000",minAmount:0,maxAmount:5e3,requiredLevels:1,approvers:[{level:1,role:"Department Manager",users:["Sarah Johnson","Michael Brown"]}],active:!0},{id:2,name:"Medium Purchase",description:"Orders between $5,000 and $25,000",minAmount:5e3,maxAmount:25e3,requiredLevels:2,approvers:[{level:1,role:"Department Manager",users:["Sarah Johnson","Michael Brown"]},{level:2,role:"Director",users:["You","James Miller"]}],active:!0},{id:3,name:"Large Purchase",description:"Orders between $25,000 and $100,000",minAmount:25e3,maxAmount:1e5,requiredLevels:3,approvers:[{level:1,role:"Department Manager",users:["Sarah Johnson","Michael Brown"]},{level:2,role:"Director",users:["You","James Miller"]},{level:3,role:"VP/C-Level",users:["Robert Lee","Patricia Martinez"]}],active:!0},{id:4,name:"Executive Purchase",description:"Orders over $100,000",minAmount:1e5,maxAmount:null,requiredLevels:4,approvers:[{level:1,role:"Department Manager",users:["Sarah Johnson","Michael Brown"]},{level:2,role:"Director",users:["You","James Miller"]},{level:3,role:"VP/C-Level",users:["Robert Lee","Patricia Martinez"]},{level:4,role:"CFO/CEO",users:["Patricia Martinez","CEO"]}],active:!0}]}saveRules(){localStorage.setItem("approval-rules",JSON.stringify(this.rules))}openNewRuleModal(){this.isNew=!0,this.editingRule={name:"",description:"",minAmount:0,maxAmount:null,requiredLevels:1,approvers:[{level:1,role:"",users:[]}],active:!0},this.showModal=!0,this.requestUpdate()}editRule(e){this.isNew=!1,this.editingRule=JSON.parse(JSON.stringify(e)),this.showModal=!0,this.requestUpdate()}closeModal(){this.showModal=!1,this.editingRule=null,this.requestUpdate()}toggleRuleStatus(e){e.active=!e.active,this.saveRules(),this.requestUpdate()}formatCurrency(e){return e===null?"∞":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0}).format(e)}render(){return s`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2><i class="bi bi-gear me-2"></i>Approval Rules</h2>
                <p class="text-muted">Configure approval thresholds and workflows</p>
              </div>
              <button class="btn btn-primary" @click=${this.openNewRuleModal}>
                <i class="bi bi-plus-lg me-2"></i>Add Rule
              </button>
            </div>
          </div>
        </div>

        <!-- Info Alert -->
        <div class="alert alert-info mb-4">
          <h6><i class="bi bi-info-circle me-2"></i>About Approval Rules</h6>
          <p class="mb-0">
            Approval rules automatically determine how many approvals are required based on order amount. 
            Orders are routed to the appropriate approvers based on these thresholds.
          </p>
        </div>

        <!-- Rules Cards -->
        <div class="row">
          ${this.rules.map(e=>s`
            <div class="col-md-6 mb-4">
              <div class="card h-100 ${e.active?"":"opacity-50"}">
                <div class="card-header ${e.active?"bg-primary text-white":"bg-secondary text-white"}">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">${e.name}</h5>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" 
                             ?checked=${e.active}
                             @change=${()=>this.toggleRuleStatus(e)}
                             style="cursor: pointer;">
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <p class="text-muted mb-3">${e.description}</p>
                  
                  <!-- Amount Range -->
                  <div class="alert alert-light mb-3">
                    <h6 class="mb-2">Amount Range</h6>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="badge bg-success fs-6">${this.formatCurrency(e.minAmount)}</span>
                      <i class="bi bi-arrow-right"></i>
                      <span class="badge bg-success fs-6">${this.formatCurrency(e.maxAmount)}</span>
                    </div>
                  </div>

                  <!-- Approval Levels -->
                  <h6 class="mb-2">
                    <i class="bi bi-check-circle me-2"></i>
                    Requires ${e.requiredLevels} Level${e.requiredLevels>1?"s":""}
                  </h6>
                  
                  <div class="approval-chain">
                    ${e.approvers.map((i,a)=>s`
                      <div class="d-flex align-items-start mb-2">
                        <span class="badge bg-primary me-2">${i.level}</span>
                        <div class="flex-grow-1">
                          <div class="fw-bold">${i.role}</div>
                          <div class="small text-muted">
                            ${i.users.map((t,d)=>s`
                              <span class="badge bg-light text-dark me-1">${t}</span>
                            `)}
                          </div>
                        </div>
                      </div>
                      ${a<e.approvers.length-1?s`
                        <div class="text-center text-muted my-1">
                          <i class="bi bi-arrow-down"></i>
                        </div>
                      `:""}
                    `)}
                  </div>
                </div>
                <div class="card-footer bg-transparent">
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" 
                            @click=${()=>this.editRule(e)}>
                      <i class="bi bi-pencil me-1"></i>Edit
                    </button>
                    <button class="btn btn-sm btn-outline-secondary">
                      <i class="bi bi-eye me-1"></i>View Orders
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `)}
        </div>

        <!-- How It Works -->
        <div class="card mt-4">
          <div class="card-header bg-light">
            <h5 class="mb-0"><i class="bi bi-lightbulb me-2"></i>How Approval Rules Work</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <h6><i class="bi bi-1-circle text-primary me-2"></i>Order Submitted</h6>
                <p class="small">Employee submits a purchase order with total amount</p>
              </div>
              <div class="col-md-4">
                <h6><i class="bi bi-2-circle text-primary me-2"></i>Rule Matched</h6>
                <p class="small">System finds the matching rule based on order amount</p>
              </div>
              <div class="col-md-4">
                <h6><i class="bi bi-3-circle text-primary me-2"></i>Approval Chain</h6>
                <p class="small">Order routed through required approval levels sequentially</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("approval-rules",l);
