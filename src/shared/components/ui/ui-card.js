import { LitElement, html } from 'lit';

class UICard extends LitElement {
  static properties = {
    title: { type: String },
    subtitle: { type: String },
    variant: { type: String }
  };

  constructor() {
    super();
    this.title = '';
    this.subtitle = '';
    this.variant = '';
  }

  createRenderRoot() { return this; }

  renderHeader() {
    const hasHeaderSlot = !!this.querySelector('[slot="header"]') || !!this.querySelector('[slot="actions"]');
    if (!this.title && !this.subtitle && !hasHeaderSlot) return null;
    return html`
      <div class="card-header d-flex align-items-center justify-content-between">
        <div>
          ${this.title ? html`<h5 class="card-title m-0">${this.title}</h5>` : ''}
          ${this.subtitle ? html`<div class="card-subtitle text-muted">${this.subtitle}</div>` : ''}
          <slot name="header"></slot>
        </div>
        <div class="card-actions d-flex align-items-center gap-2">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }

  renderFooter() {
    const hasFooterSlot = !!this.querySelector('[slot="footer"]');
    if (!hasFooterSlot) return null;
    return html`
      <div class="card-footer">
        <slot name="footer"></slot>
      </div>
    `;
  }

  render() {
    const classes = ['card'];
    if (this.variant === 'outline') classes.push('border');
    if (this.variant === 'flush') classes.push('border-0');
    return html`
      <div class="${classes.join(' ')}">
        ${this.renderHeader()}
        <div class="card-body">
          <slot></slot>
        </div>
        ${this.renderFooter()}
      </div>
    `;
  }
}

customElements.define('ui-card', UICard);
export default UICard;