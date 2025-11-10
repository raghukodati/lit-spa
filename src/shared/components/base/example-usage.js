/**
 * Example Component - Demonstrates Provider Pattern usage
 * This is a reference implementation showing best practices
 */

import { html, css } from 'lit';
import { BaseComponent } from './BaseComponent.js';

export class ExampleUsage extends BaseComponent {
  static properties = {
    products: { type: Array },
    cart: { type: Object },
    loading: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    .product-card {
      border: 1px solid #ddd;
      padding: 15px;
      margin: 10px 0;
      border-radius: 8px;
    }
    .loading {
      text-align: center;
      padding: 40px;
    }
  `;

  constructor() {
    super();
    this.products = [];
    this.cart = null;
    this.loading = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
  }

  /**
   * Example 1: Load data using single service
   */
  async loadData() {
    this.loading = true;
    
    try {
      // Get service from provider (lazy loaded and cached)
      const productService = await this.getService('productService');
      
      // Use the service
      this.products = await productService.getProducts();
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Example 2: Use multiple services together
   */
  async handleAddToCart(productId) {
    try {
      // Get multiple services at once
      const { cartService, productService } = await this.getServices([
        'cartService',
        'productService'
      ]);
      
      // Use both services
      const product = await productService.getProduct(productId);
      await cartService.addToCart({
        productId: product.id,
        quantity: 1,
        price: product.price
      });
      
      // Update cart display
      this.cart = await cartService.getCart();
      
      // Show notification (another service)
      const notificationService = await this.getService('notificationService');
      await notificationService.showSuccess(`Added ${product.name} to cart`);
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  }

  /**
   * Example 3: Create order with multiple services
   */
  async handleCheckout() {
    try {
      const { cartService, orderService, authState } = await this.getServices([
        'cartService',
        'orderService',
        'authState'
      ]);
      
      const cart = await cartService.getCart();
      const user = authState.user;
      
      const order = await orderService.createOrder({
        customerId: user.id,
        items: cart.items,
        total: cart.total
      });
      
      await cartService.clearCart();
      
      // Navigate to order confirmation
      window.location.href = `/orders/${order.id}`;
      
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading">
          <p>Loading products...</p>
        </div>
      `;
    }

    return html`
      <div class="example-container">
        <h2>Products (Provider Pattern Example)</h2>
        
        ${this.cart ? html`
          <div class="cart-summary">
            <h3>Cart</h3>
            <p>Items: ${this.cart.items?.length || 0}</p>
            <p>Total: $${this.cart.total || 0}</p>
            <button @click=${this.handleCheckout}>Checkout</button>
          </div>
        ` : ''}

        <div class="product-list">
          ${this.products.map(product => html`
            <div class="product-card">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <p class="price">$${product.price}</p>
              <button @click=${() => this.handleAddToCart(product.id)}>
                Add to Cart
              </button>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define('example-usage', ExampleUsage);
