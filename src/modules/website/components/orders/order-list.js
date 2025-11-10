import { html } from 'lit';
import { BaseComponent, repeat, classMap, live, when } from '../../../../shared/components/base/BaseComponent.js';

class OrderList extends BaseComponent {
  static properties = {
    orders: { type: Array },
    stats: { type: Object },
    loading: { type: Boolean },
    searchTerm: { type: String },
    filterStatus: { type: String },
    filterPaymentStatus: { type: String },
    page: { type: Number },
    pageSize: { type: Number },
    total: { type: Number }
  };

  constructor() {
    super();
    this.orders = [];
    this.stats = {};
    this.loading = false;
    this.searchTerm = '';
    this.filterStatus = '';
    this.filterPaymentStatus = '';
    this.page = 1;
    this.pageSize = 20;
    this.total = 0;
    this._orderService = null;
  }

  createRenderRoot() { return this; }

  async connectedCallback() {
    super.connectedCallback();
    if (!this._orderService) {
      this._orderService = await this.getService('orderService');
    }
    await this.loadOrders();
    await this.loadStats();
  }

  async loadOrders() {
    this.loading = true;
    try {
      if (!this._orderService) {
        this._orderService = await this.getService('orderService');
      }
      const result = await this._orderService.getOrders({
        search: this.searchTerm,
        status: this.filterStatus,
        paymentStatus: this.filterPaymentStatus,
        page: this.page,
        pageSize: this.pageSize
      });
      this.orders = result.data;
      this.total = result.total;
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadStats() {
    try {
      if (!this._orderService) {
        this._orderService = await this.getService('orderService');
      }
      this.stats = await this._orderService.getOrderStats();
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  handleSearch(e) {
    this.searchTerm = e.target.value;
    this.page = 1;
    this.loadOrders();
  }

  handleView(orderId) {
    // Guard navigation with read permission
    if (!this.can('orders', 'read')) return;
    window.location.pathname = `/website/orders/${orderId}`;
  }

  getStatusBadge(status) {
    const badges = {
      pending: 'bg-warning',
      processing: 'bg-info',
      shipped: 'bg-primary',
      delivered: 'bg-success',
      cancelled: 'bg-danger',
      refunded: 'bg-secondary'
    };
    return badges[status] || 'bg-secondary';
  }

  render() {
    return html`
      <div class="container-fluid mt-4">
        <h2 class="mb-4">Orders</h2>

        <!-- Stats Cards -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">Total Orders</h5>
                <h3>${this.stats.totalOrders || 0}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">Total Revenue</h5>
                <h3>$${(this.stats.totalRevenue || 0).toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">Average Order</h5>
                <h3>$${(this.stats.averageOrderValue || 0).toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">Pending Orders</h5>
                <h3>${this.stats.ordersByStatus?.pending || 0}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by order number or email..."
                  .value="${live(this.searchTerm)}"
                  @input="${this.handleSearch}"
                />
              </div>
              <div class="col-md-3">
                <select class="form-select" @change="${e => { this.filterStatus = e.target.value; this.loadOrders(); }}">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div class="col-md-3">
                <select class="form-select" @change="${e => { this.filterPaymentStatus = e.target.value; this.loadOrders(); }}">
                  <option value="">All Payment Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders Table -->
        ${this.loading ? html`
          <div class="text-center py-5">
            <div class="spinner-border"></div>
          </div>
        ` : html`
          <div class="card">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${when(
                    this.orders.length === 0,
                    () => html`
                      <tr>
                        <td colspan="8" class="text-center py-4">No orders found</td>
                      </tr>
                    `,
                    () => repeat(
                      this.orders,
                      (order) => order.id,
                      (order) => html`
                        <tr>
                          <td><strong>${order.orderNumber}</strong></td>
                          <td>${order.customerEmail}</td>
                          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>${order.getItemCount()} items</td>
                          <td>$${order.total.toFixed(2)}</td>
                          <td>
                            <span class=${classMap({
                              'badge': true,
                              'bg-success': order.paymentStatus === 'paid',
                              'bg-warning': order.paymentStatus !== 'paid'
                            })}>
                              ${order.paymentStatus}
                            </span>
                          </td>
                          <td>
                            <span class=${classMap({
                              'badge': true,
                              [this.getStatusBadge(order.status)]: true
                            })}>
                              ${order.status}
                            </span>
                          </td>
                          <td>
                            ${this.ifCan('orders', 'read', html`
                              <button 
                                class="btn btn-sm btn-primary"
                                @click="${() => this.handleView(order.id)}"
                              >
                                View
                              </button>
                            `)}
                          </td>
                        </tr>
                      `
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        `}
      </div>
    `;
  }
}

customElements.define('order-list', OrderList);
