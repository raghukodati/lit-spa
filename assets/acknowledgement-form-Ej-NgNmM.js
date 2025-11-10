import{T as a,N as s}from"./index-DfU7H5-o.js";import{getForecastCustomers as i,getForecastYears as o,getForecastMonths as r,getForecastById as l,updateForecast as c,createForecast as n}from"./analytics.service-24UmsJYf.js";class d extends a{static properties={forecastId:{type:String},formData:{type:Object},loading:{type:Boolean},saving:{type:Boolean},error:{type:String},isEditMode:{type:Boolean},customers:{type:Array},years:{type:Array},months:{type:Array},calculatedCommission:{type:Number}};createRenderRoot(){return this}constructor(){super(),this.forecastId=null,this.formData={customerName:"",year:"2024",month:"January",forecastValue:0,commissionPercent:5},this.loading=!1,this.saving=!1,this.error="",this.isEditMode=!1,this.customers=[],this.years=[],this.months=[],this.calculatedCommission=0}connectedCallback(){super.connectedCallback(),this._checkMode(),this._loadDropdownData()}_checkMode(){const t=window.location.pathname.match(/\/module\/analytics\/forecast\/edit\/(\d+)/);t?(this.isEditMode=!0,this.forecastId=t[1],this._loadForecast()):(this.isEditMode=!1,this._calculateCommission())}async _loadDropdownData(){this.customers=i(),this.years=o(),this.months=r()}async _loadForecast(){this.loading=!0,this.error="";try{const e=await l(this.forecastId);e?(this.formData={customerName:e.customerName,year:e.year,month:e.month,forecastValue:e.forecastValue,commissionPercent:e.commissionPercent},this._calculateCommission()):this.error="Forecast not found"}catch(e){this.error=e.message||"Failed to load forecast"}finally{this.loading=!1}}async _handleSubmit(e){e.preventDefault(),this.saving=!0,this.error="";try{this.isEditMode?await c(parseInt(this.forecastId),this.formData):await n(this.formData),window.history.pushState({},"","/module/analytics/forecast"),window.dispatchEvent(new PopStateEvent("popstate"))}catch(t){this.error=t.message||"Failed to save forecast"}finally{this.saving=!1}}_handleCancel(){confirm("Are you sure you want to cancel? Unsaved changes will be lost.")&&(window.history.pushState({},"","/module/analytics/forecast"),window.dispatchEvent(new PopStateEvent("popstate")))}_updateField(e,t){this.formData={...this.formData,[e]:t},(e==="forecastValue"||e==="commissionPercent")&&this._calculateCommission()}_calculateCommission(){const e=parseFloat(this.formData.forecastValue)||0,t=parseFloat(this.formData.commissionPercent)||0;this.calculatedCommission=e*t/100}render(){return this.loading?s`
        <div class="container mt-5">
          <div class="text-center p-5">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
            <p class="mt-3">Loading forecast...</p>
          </div>
        </div>
      `:s`
      <div class="container-fluid">
        <div class="mb-4">
          <div class="d-flex align-items-center mb-3">
            <button class="btn btn-outline-secondary me-3" @click=${this._handleCancel}>
              <i class="bi bi-arrow-left me-1"></i>Back
            </button>
            <div>
              <h1 class="h2 fw-bold mb-1">
                <i class="bi bi-bar-chart-line text-primary me-2"></i>
                ${this.isEditMode?"Edit Forecast":"Create New Forecast"}
              </h1>
              <p class="text-muted mb-0">
                ${this.isEditMode?"Update forecast details":"Add a new forecast record"}
              </p>
            </div>
          </div>
        </div>

        ${this.error?s`
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            ${this.error}
            <button type="button" class="btn-close" @click=${()=>this.error=""}></button>
          </div>
        `:""}

        <form @submit=${this._handleSubmit}>
          <div class="row">
            <div class="col-lg-8">
              <div class="card shadow-sm mb-4">
                <div class="card-header bg-white">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-pencil me-2"></i>Forecast Information
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-4">
                    <label for="customerName" class="form-label fw-semibold">
                      Customer Name <span class="text-danger">*</span>
                    </label>
                    <select
                      id="customerName"
                      class="form-select form-select-lg"
                      .value=${this.formData.customerName}
                      @change=${e=>this._updateField("customerName",e.target.value)}
                      required
                      ?disabled=${this.saving}
                    >
                      <option value="">Select a customer...</option>
                      ${this.customers.map(e=>s`
                        <option value="${e}" ?selected=${this.formData.customerName===e}>
                          ${e}
                        </option>
                      `)}
                    </select>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-4">
                      <label for="year" class="form-label fw-semibold">
                        Year <span class="text-danger">*</span>
                      </label>
                      <select
                        id="year"
                        class="form-select"
                        .value=${this.formData.year}
                        @change=${e=>this._updateField("year",e.target.value)}
                        required
                        ?disabled=${this.saving}
                      >
                        ${this.years.map(e=>s`
                          <option value="${e}">${e}</option>
                        `)}
                        <option value="2025">2025</option>
                      </select>
                    </div>

                    <div class="col-md-6 mb-4">
                      <label for="month" class="form-label fw-semibold">
                        Month <span class="text-danger">*</span>
                      </label>
                      <select
                        id="month"
                        class="form-select"
                        .value=${this.formData.month}
                        @change=${e=>this._updateField("month",e.target.value)}
                        required
                        ?disabled=${this.saving}
                      >
                        ${this.months.map(e=>s`
                          <option value="${e}">${e}</option>
                        `)}
                      </select>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="forecastValue" class="form-label fw-semibold">
                      Forecast Value ($) <span class="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      id="forecastValue"
                      class="form-control form-control-lg"
                      .value=${this.formData.forecastValue}
                      @input=${e=>this._updateField("forecastValue",parseFloat(e.target.value)||0)}
                      min="0"
                      step="100"
                      required
                      ?disabled=${this.saving}
                    />
                  </div>

                  <div class="mb-4">
                    <label for="commissionPercent" class="form-label fw-semibold">
                      Commission Percentage (%) <span class="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      id="commissionPercent"
                      class="form-control form-control-lg"
                      .value=${this.formData.commissionPercent}
                      @input=${e=>this._updateField("commissionPercent",parseFloat(e.target.value)||0)}
                      min="0"
                      max="100"
                      step="0.1"
                      required
                      ?disabled=${this.saving}
                    />
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold">
                      Calculated Commission ($)
                    </label>
                    <input
                      type="text"
                      class="form-control form-control-lg bg-light text-success fw-bold"
                      .value=${"$"+this.calculatedCommission.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}
                      readonly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="card shadow-sm" style="position: sticky; top: 20px;">
                <div class="card-body">
                  <button
                    type="submit"
                    class="btn btn-primary w-100 mb-2"
                    ?disabled=${this.saving}
                  >
                    ${this.saving?s`
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    `:s`
                      <i class="bi bi-check-circle me-2"></i>
                      ${this.isEditMode?"Update Forecast":"Create Forecast"}
                    `}
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary w-100"
                    @click=${this._handleCancel}
                    ?disabled=${this.saving}
                  >
                    <i class="bi bi-x-circle me-2"></i>Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    `}}customElements.define("inbox-acknowledgement-form",d);
