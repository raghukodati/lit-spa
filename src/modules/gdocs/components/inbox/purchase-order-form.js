import {LitElement, html} from 'lit';
import {
  getForecastById,
  createForecast,
  updateForecast,
  getForecastYears,
  getForecastMonths,
  getForecastCustomers
} from '../../../../services/dataService.js';

class ForecastFormPage extends LitElement {
  static properties = {
    forecastId: {type: String},
    formData: {type: Object},
    loading: {type: Boolean},
    saving: {type: Boolean},
    error: {type: String},
    isEditMode: {type: Boolean},
    customers: {type: Array},
    partnersCustomers: {type: Array},
    partnersVendors: {type: Array},
    years: {type: Array},
    months: {type: Array},
    calculatedCommission: {type: Number},
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.forecastId = null;
    this.formData = {
      customerName: '',
      year: '2024',
      month: 'January',
      forecastValue: 0,
      commissionPercent: 5.0,
    };
    this.loading = false;
    this.saving = false;
    this.error = '';
    this.isEditMode = false;
    this.customers = [];
    this.partnersCustomers = [];
    this.partnersVendors = [];
    this.years = [];
    this.months = [];
    this.calculatedCommission = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkMode();
    this._loadDropdownData();
  }

  _checkMode() {
    const path = window.location.pathname;
    const editMatch = path.match(/\/module\/analytics\/forecast\/edit\/(\d+)/);
    
    if (editMatch) {
      this.isEditMode = true;
      this.forecastId = editMatch[1];
      this._loadForecast();
    } else {
      this.isEditMode = false;
      this._calculateCommission();
    }
  }

  async _loadDropdownData() {
    try {
      const ds = await import('../../../../services/dataService.js');
      this.partnersCustomers = await ds.getBusinessPartners({ partnerType: 'customer' });
      this.partnersVendors = await ds.getBusinessPartners({ partnerType: 'vendor' });
      this.customers = this.partnersCustomers.map(p => `${p.accountNumber || ''}${p.accountNumber ? ' • ' : ''}${p.name}`);
    } catch (e) {
      this.partnersCustomers = [];
      this.partnersVendors = [];
      this.customers = [];
    }
    this.years = getForecastYears();
    this.months = getForecastMonths();
  }

  async _loadForecast() {
    this.loading = true;
    this.error = '';
    
    try {
      const forecast = await getForecastById(this.forecastId);
      if (forecast) {
        this.formData = {
          customerName: forecast.customerName,
          year: forecast.year,
          month: forecast.month,
          forecastValue: forecast.forecastValue,
          commissionPercent: forecast.commissionPercent,
        };
        this._calculateCommission();
      } else {
        this.error = 'Forecast not found';
      }
    } catch (err) {
      this.error = err.message || 'Failed to load forecast';
    } finally {
      this.loading = false;
    }
  }

  async _handleSubmit(e) {
    e.preventDefault();
    this.saving = true;
    this.error = '';

    try {
      if (this.isEditMode) {
        await updateForecast(parseInt(this.forecastId), this.formData);
      } else {
        await createForecast(this.formData);
      }

      window.history.pushState({}, '', '/module/analytics/forecast');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      this.error = err.message || 'Failed to save forecast';
    } finally {
      this.saving = false;
    }
  }

  _handleCancel() {
    if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      window.history.pushState({}, '', '/module/analytics/forecast');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  _updateField(field, value) {
    this.formData = {
      ...this.formData,
      [field]: value
    };
    
    if (field === 'forecastValue' || field === 'commissionPercent') {
      this._calculateCommission();
    }
  }

  _calculateCommission() {
    const value = parseFloat(this.formData.forecastValue) || 0;
    const percent = parseFloat(this.formData.commissionPercent) || 0;
    this.calculatedCommission = (value * percent) / 100;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="container mt-5">
          <div class="text-center p-5">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
            <p class="mt-3">Loading forecast...</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container-fluid">
        <div class="mb-4">
          <div class="d-flex align-items-center mb-3">
            <button class="btn btn-outline-secondary me-3" @click=${this._handleCancel}>
              <i class="bi bi-arrow-left me-1"></i>Back
            </button>
            <div>
              <h1 class="h2 fw-bold mb-1">
                <i class="bi bi-bar-chart-line text-primary me-2"></i>
                ${this.isEditMode ? 'Edit Forecast' : 'Create New Forecast'}
              </h1>
              <p class="text-muted mb-0">
                ${this.isEditMode ? 'Update forecast details' : 'Add a new forecast record'}
              </p>
            </div>
          </div>
        </div>

        ${this.error ? html`
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            ${this.error}
            <button type="button" class="btn-close" @click=${() => this.error = ''}></button>
          </div>
        ` : ''}

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
                    <label class="form-label fw-semibold">Vendor (Business Partner)</label>
                    <select
                      class="form-select form-select-lg"
                      .value=${this.formData.vendorId || ''}
                      @change=${(e) => {
                        const id = e.target.value ? parseInt(e.target.value) : null;
                        const p = this.partnersVendors.find(x => x.id === id);
                        this._updateField('vendorId', id);
                        this._updateField('vendor', p ? `${p.accountNumber || ''}${p.accountNumber ? ' • ' : ''}${p.name}` : '');
                      }}
                      ?disabled=${this.saving}
                    >
                      <option value="">Select a vendor...</option>
                      ${this.partnersVendors.map(p => html`<option value="${p.id}">${p.accountNumber || ''}${p.accountNumber ? ' • ' : ''}${p.name}</option>`)}
                    </select>
                  </div>

                  <div class="mb-4">
                    <label for="customerName" class="form-label fw-semibold">
                      Customer (Business Partner) <span class="text-danger">*</span>
                    </label>
                    <select
                      id="customerName"
                      class="form-select form-select-lg"
                      .value=${this.formData.customerId || ''}
                      @change=${(e) => {
                        const id = e.target.value ? parseInt(e.target.value) : null;
                        const p = this.partnersCustomers.find(x => x.id === id);
                        this._updateField('customerId', id);
                        this._updateField('customerName', p ? `${p.accountNumber || ''}${p.accountNumber ? ' • ' : ''}${p.name}` : '');
                      }}
                      required
                      ?disabled=${this.saving}
                    >
                      <option value="">Select a customer...</option>
                      ${this.partnersCustomers.map(p => html`<option value="${p.id}">${p.accountNumber || ''}${p.accountNumber ? ' • ' : ''}${p.name}</option>`)}
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
                        @change=${(e) => this._updateField('year', e.target.value)}
                        required
                        ?disabled=${this.saving}
                      >
                        ${this.years.map(year => html`
                          <option value="${year}">${year}</option>
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
                        @change=${(e) => this._updateField('month', e.target.value)}
                        required
                        ?disabled=${this.saving}
                      >
                        ${this.months.map(month => html`
                          <option value="${month}">${month}</option>
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
                      @input=${(e) => this._updateField('forecastValue', parseFloat(e.target.value) || 0)}
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
                      @input=${(e) => this._updateField('commissionPercent', parseFloat(e.target.value) || 0)}
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
                      .value=${'$' + this.calculatedCommission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                    ${this.saving ? html`
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    ` : html`
                      <i class="bi bi-check-circle me-2"></i>
                      ${this.isEditMode ? 'Update Forecast' : 'Create Forecast'}
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
    `;
  }
}

customElements.define('inbox-purchase-order-form', ForecastFormPage);
