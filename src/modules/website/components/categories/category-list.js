import { LitElement, html } from 'lit';
import { getProductCategories } from '../../services/product.service.js';

class CategoryList extends LitElement {
  static properties = {
    categories: { type: Array },
    loading: { type: Boolean }
  };

  constructor() {
    super();
    this.categories = [];
    this.loading = false;
  }

  createRenderRoot() { return this; }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadCategories();
  }

  async loadCategories() {
    this.loading = true;
    try {
      this.categories = await getProductCategories();
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="container-fluid mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Product Categories</h2>
          <a href="#/website/categories/new" class="btn btn-primary">
            <i class="bi bi-plus-lg"></i> Add Category
          </a>
        </div>

        ${this.loading ? html`
          <div class="text-center py-5"><div class="spinner-border"></div></div>
        ` : html`
          <div class="row">
            ${this.categories.map(category => html`
              <div class="col-md-4 mb-3">
                <div class="card">
                  <div class="card-body">
                    <h5>${category}</h5>
                    <button class="btn btn-sm btn-primary">Edit</button>
                  </div>
                </div>
              </div>
            `)}
          </div>
        `}
      </div>
    `;
  }
}

customElements.define('category-list', CategoryList);
