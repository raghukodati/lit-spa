/**
 * Directive Examples Component
 * Demonstrates proper usage of Lit directives
 */

import { html } from 'lit';
import { 
  BaseComponent, 
  repeat, 
  classMap, 
  styleMap, 
  when, 
  live, 
  until,
  guard,
  createRef,
  ref
} from '../base/BaseComponent.js';

class DirectiveExamples extends BaseComponent {
  static properties = {
    items: { type: Array },
    searchTerm: { type: String },
    loading: { type: Boolean },
    activeFilter: { type: String }
  };

  constructor() {
    super();
    this.items = [
      { id: 1, name: 'Product A', price: 10, status: 'active', featured: true },
      { id: 2, name: 'Product B', price: 20, status: 'inactive', featured: false },
      { id: 3, name: 'Product C', price: 30, status: 'active', featured: false }
    ];
    this.searchTerm = '';
    this.loading = false;
    this.activeFilter = 'all';
    this.searchInput = createRef();
  }

  createRenderRoot() { return this; }

  // Example: Async data loading
  async loadData() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return html`<div class="alert alert-success">Data loaded!</div>`;
  }

  get filteredItems() {
    return this.items.filter(item =>
      (this.activeFilter === 'all' || item.status === this.activeFilter) &&
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  render() {
    return html`
      <div class="container mt-4">
        <h2>Lit Directives Examples</h2>

        <!-- Example 1: live directive for inputs -->
        <div class="card mb-4">
          <div class="card-header">
            <h5>1. live() - Controlled Input</h5>
          </div>
          <div class="card-body">
            <input
              ${ref(this.searchInput)}
              type="text"
              class="form-control"
              placeholder="Search products..."
              .value=${live(this.searchTerm)}
              @input=${e => this.searchTerm = e.target.value}
            />
            <small class="text-muted">Search term: "${this.searchTerm}"</small>
          </div>
        </div>

        <!-- Example 2: classMap for conditional classes -->
        <div class="card mb-4">
          <div class="card-header">
            <h5>2. classMap() - Conditional CSS Classes</h5>
          </div>
          <div class="card-body">
            <div class="btn-group mb-3">
              ${['all', 'active', 'inactive'].map(filter => html`
                <button
                  class=${classMap({
                    'btn': true,
                    'btn-primary': this.activeFilter === filter,
                    'btn-outline-primary': this.activeFilter !== filter
                  })}
                  @click=${() => this.activeFilter = filter}
                >
                  ${filter}
                </button>
              `)}
            </div>
          </div>
        </div>

        <!-- Example 3: styleMap for dynamic styles -->
        <div class="card mb-4">
          <div class="card-header">
            <h5>3. styleMap() - Dynamic Inline Styles</h5>
          </div>
          <div class="card-body">
            ${this.filteredItems.map(item => html`
              <div
                class="p-2 mb-2"
                style=${styleMap({
                  backgroundColor: item.featured ? '#fff3cd' : '#f8f9fa',
                  borderLeft: `4px solid ${item.status === 'active' ? '#28a745' : '#dc3545'}`,
                  borderRadius: '4px'
                })}
              >
                ${item.name} - $${item.price}
              </div>
            `)}
          </div>
        </div>

        <!-- Example 4: when for conditional rendering -->
        <div class="card mb-4">
          <div class="card-header">
            <h5>4. when() - Conditional Rendering</h5>
          </div>
          <div class="card-body">
            ${when(
              this.filteredItems.length > 0,
              () => html`
                <div class="alert alert-success">
                  Found ${this.filteredItems.length} item(s)
                </div>
              `,
              () => html`
                <div class="alert alert-warning">
                  No items found matching your criteria
                </div>
              `
            )}
          </div>
        </div>

        <!-- Example 5: repeat for efficient list rendering -->
        <div class="card mb-4">
          <div class="card-header">
            <h5>5. repeat() - Efficient List Rendering with Keys</h5>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${repeat(
                  this.filteredItems,
                  (item) => item.id,
                  (item) => html`
                    <tr>
                      <td>${item.id}</td>
                      <td>
                        ${item.name}
                        ${item.featured ? html`
                          <span class="badge bg-warning ms-2">Featured</span>
                        ` : ''}
                      </td>
                      <td>$${item.price}</td>
                      <td>
                        <span class=${classMap({
                          'badge': true,
                          'bg-success': item.status === 'active',
                          'bg-danger': item.status === 'inactive'
                        })}>
                          ${item.status}
                        </span>
                      </td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Example 6: until for async content -->
        <div class="card mb-4">
          <div class="card-header">
            <h5>6. until() - Async Content Loading</h5>
          </div>
          <div class="card-body">
            <button 
              class="btn btn-primary mb-3" 
              @click=${() => this.requestUpdate()}
            >
              Reload Async Content
            </button>
            
            ${until(
              this.loadData(),
              html`
                <div class="text-center">
                  <div class="spinner-border" role="status"></div>
                  <p class="mt-2">Loading...</p>
                </div>
              `
            )}
          </div>
        </div>

        <!-- Example 7: guard for expensive renders -->
        <div class="card mb-4">
          <div class="card-header">
            <h5>7. guard() - Memoized Expensive Renders</h5>
          </div>
          <div class="card-body">
            ${guard([this.filteredItems], () => {
              console.log('Expensive render called!');
              return html`
                <p>This content only re-renders when filteredItems changes</p>
                <p>Items: ${this.filteredItems.map(i => i.name).join(', ')}</p>
              `;
            })}
          </div>
        </div>

        <!-- Summary -->
        <div class="alert alert-info">
          <h5>Summary:</h5>
          <ul>
            <li><strong>live()</strong> - Forces property updates for controlled inputs</li>
            <li><strong>classMap()</strong> - Conditional CSS classes from object</li>
            <li><strong>styleMap()</strong> - Dynamic inline styles from object</li>
            <li><strong>when()</strong> - Clean if/else conditional rendering</li>
            <li><strong>repeat()</strong> - Efficient keyed list rendering</li>
            <li><strong>until()</strong> - Async content with loading states</li>
            <li><strong>guard()</strong> - Memoize expensive renders</li>
            <li><strong>ref()</strong> - Direct DOM element references</li>
          </ul>
        </div>
      </div>
    `;
  }
}

customElements.define('directive-examples', DirectiveExamples);

export default DirectiveExamples;
