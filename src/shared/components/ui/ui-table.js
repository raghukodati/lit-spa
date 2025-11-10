import { LitElement, html } from 'lit';

class UITable extends LitElement {
  static properties = {
    columns: { type: Array },
    items: { type: Array },
    loading: { type: Boolean },
    emptyText: { type: String },
    page: { type: Number },
    pageSize: { type: Number },
    total: { type: Number },
    sortBy: { type: String },
    sortOrder: { type: String }
  };

  constructor() {
    super();
    this.columns = [];
    this.items = [];
    this.loading = false;
    this.emptyText = 'No data';
    this.page = 1;
    this.pageSize = 10;
    this.total = 0;
    this.sortBy = '';
    this.sortOrder = 'asc';
  }

  createRenderRoot() { return this; }

  onHeaderClick(col) {
    if (!col.sortable) return;
    let sortBy = col.key;
    let sortOrder = this.sortOrder;
    if (this.sortBy === col.key) {
      sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortOrder = 'asc';
    }
    this.dispatchEvent(new CustomEvent('table-sort', {
      detail: { sortBy, sortOrder },
      bubbles: true
    }));
  }

  goTo(page) {
    const max = Math.max(1, Math.ceil(this.total / this.pageSize));
    const next = Math.min(Math.max(1, page), max);
    this.dispatchEvent(new CustomEvent('table-page', {
      detail: { page: next },
      bubbles: true
    }));
  }

  renderHeader() {
    return html`
      <thead>
        <tr>
          ${this.columns.map(col => html`
            <th
              role="${col.sortable ? 'button' : 'columnheader'}"
              scope="col"
              @click="${() => this.onHeaderClick(col)}"
              class="${col.sortable ? 'user-select-none' : ''}"
            >
              <span class="d-inline-flex align-items-center gap-1">
                ${col.label ?? col.key}
                ${col.sortable ? html`
                  <i class="bi ${this.sortBy === col.key
                      ? (this.sortOrder === 'asc' ? 'bi-caret-up-fill' : 'bi-caret-down-fill')
                      : 'bi-chevron-expand'}"></i>
                ` : ''}
              </span>
            </th>
          `)}
        </tr>
      </thead>
    `;
  }

  renderBody() {
    if (this.loading) {
      return html`
        <tbody>
          <tr><td colspan="${this.columns.length}" class="text-center py-5">
            <div class="spinner-border" role="status"></div>
          </td></tr>
        </tbody>
      `;
    }
    if (!this.items?.length) {
      return html`
        <tbody>
          <tr><td colspan="${this.columns.length}" class="text-center py-4">
            ${this.emptyText}
          </td></tr>
        </tbody>
      `;
    }
    return html`
      <tbody>
        ${this.items.map(item => html`
          <tr>
            ${this.columns.map(col => html`
              <td>
                ${col.render ? col.render(item) : (item?.[col.key] ?? '')}
              </td>
            `)}
          </tr>
        `)}
      </tbody>
    `;
  }

  renderPagination() {
    const totalPages = Math.max(1, Math.ceil(this.total / this.pageSize));
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return html`
      <nav class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item ${this.page === 1 ? 'disabled' : ''}">
            <a class="page-link" @click="${() => this.goTo(this.page - 1)}">Previous</a>
          </li>
          ${pages.map(p => html`
            <li class="page-item ${this.page === p ? 'active' : ''}">
              <a class="page-link" @click="${() => this.goTo(p)}">${p}</a>
            </li>
          `)}
          <li class="page-item ${this.page === totalPages ? 'disabled' : ''}">
            <a class="page-link" @click="${() => this.goTo(this.page + 1)}">Next</a>
          </li>
        </ul>
      </nav>
    `;
  }

  render() {
    return html`
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          ${this.renderHeader()}
          ${this.renderBody()}
        </table>
      </div>
      ${this.renderPagination()}
      <div class="text-center text-muted mt-2">
        ${this.items?.length ?? 0} of ${this.total} items
      </div>
    `;
  }
}

customElements.define('ui-table', UITable);
export default UITable;