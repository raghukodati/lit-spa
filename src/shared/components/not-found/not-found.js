import {LitElement, html} from 'lit';

class NotFoundPage extends LitElement {
  static properties = {
    message: {type: String, reflect: true},
  };

  createRenderRoot() { return this; }

  render() {
    return html`
      <div class="card shadow text-center">
        <div class="card-body">
          <h1 class="card-title display-4">Not Found</h1>
          <p class="card-text">${this.message || 'The page you requested could not be found.'}</p>
          <a href="/" class="btn btn-primary">Go home</a>
        </div>
      </div>
    `;
  }
}

customElements.define('not-found', NotFoundPage);
