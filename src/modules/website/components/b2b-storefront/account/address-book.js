/**
 * Address Book Component - Manage shipping and billing addresses
 */

import { LitElement, html } from 'lit';

class AddressBook extends LitElement {
  static properties = {
    addresses: { type: Array },
    loading: { type: Boolean },
    showModal: { type: Boolean },
    editingAddress: { type: Object },
    isNew: { type: Boolean }
  };

  constructor() {
    super();
    this.addresses = this.loadAddresses();
    this.loading = false;
    this.showModal = false;
    this.editingAddress = null;
    this.isNew = false;
  }

  createRenderRoot() {
    return this;
  }

  loadAddresses() {
    try {
      const stored = localStorage.getItem('customer-addresses');
      return stored ? JSON.parse(stored) : this.getDefaultAddresses();
    } catch (e) {
      return this.getDefaultAddresses();
    }
  }

  getDefaultAddresses() {
    return [
      {
        id: 1,
        type: 'shipping',
        isDefault: true,
        label: 'Main Office',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Acme Corporation',
        address1: '123 Business Park',
        address2: 'Suite 400',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        phone: '(555) 123-4567'
      },
      {
        id: 2,
        type: 'billing',
        isDefault: true,
        label: 'Billing Department',
        firstName: 'Jane',
        lastName: 'Smith',
        company: 'Acme Corporation',
        address1: '123 Business Park',
        address2: 'Suite 500',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        phone: '(555) 123-4568'
      },
      {
        id: 3,
        type: 'shipping',
        isDefault: false,
        label: 'Warehouse',
        firstName: 'Mike',
        lastName: 'Johnson',
        company: 'Acme Warehouse',
        address1: '456 Industrial Blvd',
        address2: '',
        city: 'Jersey City',
        state: 'NJ',
        zip: '07302',
        country: 'United States',
        phone: '(555) 987-6543'
      }
    ];
  }

  saveAddresses() {
    localStorage.setItem('customer-addresses', JSON.stringify(this.addresses));
  }

  openNewAddressModal(type = 'shipping') {
    this.isNew = true;
    this.editingAddress = {
      type,
      isDefault: false,
      label: '',
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: ''
    };
    this.showModal = true;
    this.requestUpdate();
  }

  editAddress(address) {
    this.isNew = false;
    this.editingAddress = { ...address };
    this.showModal = true;
    this.requestUpdate();
  }

  closeModal() {
    this.showModal = false;
    this.editingAddress = null;
    this.requestUpdate();
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const addressData = {
      label: formData.get('label'),
      type: formData.get('type'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      company: formData.get('company'),
      address1: formData.get('address1'),
      address2: formData.get('address2'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
      country: formData.get('country'),
      phone: formData.get('phone'),
      isDefault: formData.get('isDefault') === 'on'
    };

    if (this.isNew) {
      const newAddress = {
        ...addressData,
        id: Date.now()
      };
      this.addresses = [...this.addresses, newAddress];
    } else {
      this.addresses = this.addresses.map(addr =>
        addr.id === this.editingAddress.id ? { ...addr, ...addressData } : addr
      );
    }

    // If this is set as default, unset other defaults of same type
    if (addressData.isDefault) {
      this.addresses = this.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === (this.editingAddress?.id || Date.now()) ? true : 
                   addr.type === addressData.type ? false : addr.isDefault
      }));
    }

    this.saveAddresses();
    this.closeModal();
  }

  deleteAddress(addressId) {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    this.addresses = this.addresses.filter(addr => addr.id !== addressId);
    this.saveAddresses();
    this.requestUpdate();
  }

  setDefaultAddress(addressId) {
    const address = this.addresses.find(a => a.id === addressId);
    if (!address) return;

    this.addresses = this.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId ? true : 
                 addr.type === address.type ? false : addr.isDefault
    }));

    this.saveAddresses();
    this.requestUpdate();
  }

  get shippingAddresses() {
    return this.addresses.filter(a => a.type === 'shipping');
  }

  get billingAddresses() {
    return this.addresses.filter(a => a.type === 'billing');
  }

  renderAddressCard(address) {
    return html`
      <div class="col-md-6 mb-3">
        <div class="card h-100 ${address.isDefault ? 'border-primary' : ''}">
          ${address.isDefault ? html`
            <div class="card-header bg-primary text-white py-1">
              <small><i class="bi bi-star-fill me-1"></i>Default ${address.type === 'shipping' ? 'Shipping' : 'Billing'}</small>
            </div>
          ` : ''}
          <div class="card-body">
            <h6 class="card-title">
              ${address.label}
              <span class="badge bg-${address.type === 'shipping' ? 'info' : 'success'} ms-2">
                ${address.type === 'shipping' ? 'Shipping' : 'Billing'}
              </span>
            </h6>
            <div class="text-muted small">
              <p class="mb-1">${address.firstName} ${address.lastName}</p>
              ${address.company ? html`<p class="mb-1">${address.company}</p>` : ''}
              <p class="mb-1">${address.address1}</p>
              ${address.address2 ? html`<p class="mb-1">${address.address2}</p>` : ''}
              <p class="mb-1">${address.city}, ${address.state} ${address.zip}</p>
              <p class="mb-1">${address.country}</p>
              <p class="mb-0"><i class="bi bi-telephone me-1"></i>${address.phone}</p>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <div class="d-flex gap-2">
              ${!address.isDefault ? html`
                <button class="btn btn-sm btn-outline-primary" 
                        @click=${() => this.setDefaultAddress(address.id)}
                        title="Set as default">
                  <i class="bi bi-star"></i> Set Default
                </button>
              ` : ''}
              <button class="btn btn-sm btn-outline-secondary" 
                      @click=${() => this.editAddress(address)}>
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-sm btn-outline-danger" 
                      @click=${() => this.deleteAddress(address.id)}>
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="container-fluid mt-4">
        <div class="row mb-4">
          <div class="col-12">
            <h2><i class="bi bi-geo-alt me-2"></i>Address Book</h2>
            <p class="text-muted">Manage your shipping and billing addresses</p>
          </div>
        </div>

        <!-- Shipping Addresses -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4><i class="bi bi-box-seam me-2"></i>Shipping Addresses</h4>
              <button class="btn btn-primary" @click=${() => this.openNewAddressModal('shipping')}>
                <i class="bi bi-plus-lg me-2"></i>Add Shipping Address
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          ${this.shippingAddresses.length > 0 ? html`
            ${this.shippingAddresses.map(addr => this.renderAddressCard(addr))}
          ` : html`
            <div class="col-12">
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                No shipping addresses found. Add one to get started.
              </div>
            </div>
          `}
        </div>

        <!-- Billing Addresses -->
        <div class="row mb-4 mt-5">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4><i class="bi bi-credit-card me-2"></i>Billing Addresses</h4>
              <button class="btn btn-success" @click=${() => this.openNewAddressModal('billing')}>
                <i class="bi bi-plus-lg me-2"></i>Add Billing Address
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          ${this.billingAddresses.length > 0 ? html`
            ${this.billingAddresses.map(addr => this.renderAddressCard(addr))}
          ` : html`
            <div class="col-12">
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                No billing addresses found. Add one to get started.
              </div>
            </div>
          `}
        </div>

        <!-- Address Modal -->
        ${this.showModal ? html`
          <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <form @submit=${this.handleFormSubmit}>
                  <div class="modal-header">
                    <h5 class="modal-title">
                      ${this.isNew ? 'Add New' : 'Edit'} Address
                    </h5>
                    <button type="button" class="btn-close" @click=${this.closeModal}></button>
                  </div>
                  <div class="modal-body">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Address Label *</label>
                        <input type="text" class="form-control" name="label" 
                               .value=${this.editingAddress?.label || ''} 
                               placeholder="e.g., Main Office" required>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Address Type *</label>
                        <select class="form-select" name="type" .value=${this.editingAddress?.type || 'shipping'} required>
                          <option value="shipping">Shipping</option>
                          <option value="billing">Billing</option>
                        </select>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label class="form-label">First Name *</label>
                        <input type="text" class="form-control" name="firstName" 
                               .value=${this.editingAddress?.firstName || ''} required>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Last Name *</label>
                        <input type="text" class="form-control" name="lastName" 
                               .value=${this.editingAddress?.lastName || ''} required>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Company</label>
                      <input type="text" class="form-control" name="company" 
                             .value=${this.editingAddress?.company || ''}>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Address Line 1 *</label>
                      <input type="text" class="form-control" name="address1" 
                             .value=${this.editingAddress?.address1 || ''} required>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Address Line 2</label>
                      <input type="text" class="form-control" name="address2" 
                             .value=${this.editingAddress?.address2 || ''}>
                    </div>

                    <div class="row">
                      <div class="col-md-5 mb-3">
                        <label class="form-label">City *</label>
                        <input type="text" class="form-control" name="city" 
                               .value=${this.editingAddress?.city || ''} required>
                      </div>
                      <div class="col-md-4 mb-3">
                        <label class="form-label">State *</label>
                        <input type="text" class="form-control" name="state" 
                               .value=${this.editingAddress?.state || ''} required>
                      </div>
                      <div class="col-md-3 mb-3">
                        <label class="form-label">ZIP *</label>
                        <input type="text" class="form-control" name="zip" 
                               .value=${this.editingAddress?.zip || ''} required>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Country *</label>
                        <input type="text" class="form-control" name="country" 
                               .value=${this.editingAddress?.country || 'United States'} required>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Phone *</label>
                        <input type="tel" class="form-control" name="phone" 
                               .value=${this.editingAddress?.phone || ''} required>
                      </div>
                    </div>

                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="isDefault" 
                             id="isDefault" ?checked=${this.editingAddress?.isDefault}>
                      <label class="form-check-label" for="isDefault">
                        Set as default ${this.editingAddress?.type === 'shipping' ? 'shipping' : 'billing'} address
                      </label>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click=${this.closeModal}>
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                      ${this.isNew ? 'Add Address' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('address-book', AddressBook);
