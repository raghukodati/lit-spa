import {LitElement, html} from 'lit';
import {login} from '../../services/dataService.js';

class LoginPage extends LitElement {
  static properties = {
    username: {type: String},
    password: {type: String},
    loading: {type: Boolean},
    error: {type: String},
    showPassword: {type: Boolean},
  };

  createRenderRoot() { return this; }

  constructor() {
    super();
    this.username = '';
    this.password = '';
    this.loading = false;
    this.error = '';
    this.showPassword = false;
  }

  async _handleSubmit(e) {
    e.preventDefault();
    this.error = '';
    this.loading = true;

    try {
      await login(this.username, this.password);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (err) {
      this.error = err.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }

  _togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  render() {
    return html`
      <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">
              <!-- Logo/Brand -->
              <div class="text-center mb-4">
                <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                  <i class="bi bi-shield-lock fs-1"></i>
                </div>
                <h1 class="h3 mt-3 fw-bold">Lit SPA Dashboard</h1>
                <p class="text-muted">Sign in to your account</p>
              </div>

              <!-- Login Card -->
              <div class="card shadow-lg border-0">
                <div class="card-body p-4">
                  ${this.error ? html`
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                      <i class="bi bi-exclamation-triangle me-2"></i>
                      ${this.error}
                      <button type="button" class="btn-close" @click=${() => this.error = ''}></button>
                    </div>
                  ` : ''}

                  <form @submit=${this._handleSubmit}>
                    <!-- Username -->
                    <div class="mb-3">
                      <label for="username" class="form-label fw-semibold">
                        <i class="bi bi-person me-1"></i>Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        class="form-control form-control-lg"
                        .value=${this.username}
                        @input=${(e) => this.username = e.target.value}
                        placeholder="Enter your username"
                        required
                        ?disabled=${this.loading}
                      />
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                      <label for="password" class="form-label fw-semibold">
                        <i class="bi bi-lock me-1"></i>Password
                      </label>
                      <div class="input-group">
                        <input
                          type="${this.showPassword ? 'text' : 'password'}"
                          id="password"
                          class="form-control form-control-lg"
                          .value=${this.password}
                          @input=${(e) => this.password = e.target.value}
                          placeholder="Enter your password"
                          required
                          ?disabled=${this.loading}
                        />
                        <button 
                          class="btn btn-outline-secondary" 
                          type="button"
                          @click=${this._togglePasswordVisibility}
                          ?disabled=${this.loading}
                        >
                          <i class="bi bi-eye${this.showPassword ? '-slash' : ''}"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Remember Me & Forgot Password -->
                    <div class="d-flex justify-content-between align-items-center mb-4">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="rememberMe">
                        <label class="form-check-label" for="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <a href="#" class="text-decoration-none small">Forgot password?</a>
                    </div>

                    <!-- Submit Button -->
                    <button 
                      type="submit" 
                      class="btn btn-primary btn-lg w-100"
                      ?disabled=${this.loading}
                    >
                      ${this.loading 
                        ? html`<span class="spinner-border spinner-border-sm me-2"></span>Signing in...`
                        : html`<i class="bi bi-box-arrow-in-right me-2"></i>Sign In`
                      }
                    </button>
                  </form>
                </div>
              </div>

              <!-- Demo Credentials -->
              <div class="card mt-3 border-info">
                <div class="card-body">
                  <h6 class="card-title text-info">
                    <i class="bi bi-info-circle me-1"></i>Demo Credentials by Module
                  </h6>
                  <div class="small">
                    <div class="mb-2">
                      <strong>Super Admin:</strong> 
                      <code class="ms-2">admin / admin123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${() => { this.username = 'admin'; this.password = 'admin123'; }}>
                        Use
                      </button>
                      <div class="text-muted small">All modules (admin)</div>
                    </div>
                    <div class="mb-2">
                      <strong>Manager:</strong> 
                      <code class="ms-2">manager / manager123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${() => { this.username = 'manager'; this.password = 'manager123'; }}>
                        Use
                      </button>
                      <div class="text-muted small">Inventory, Analytics, Gdocs (admin)</div>
                    </div>
                    <div class="mb-2">
                      <strong>Sales:</strong> 
                      <code class="ms-2">user / user123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${() => { this.username = 'user'; this.password = 'user123'; }}>
                        Use
                      </button>
                      <div class="text-muted small">Sales (admin), CRM, Gdocs (user)</div>
                    </div>
                    <div class="mb-2">
                      <strong>Analyst:</strong> 
                      <code class="ms-2">analyst / analyst123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${() => { this.username = 'analyst'; this.password = 'analyst123'; }}>
                        Use
                      </button>
                      <div class="text-muted small">Analytics (admin), Gdocs (user)</div>
                    </div>
                    <div class="mb-2">
                      <strong>Inventory:</strong> 
                      <code class="ms-2">inventory / inventory123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${() => { this.username = 'inventory'; this.password = 'inventory123'; }}>
                        Use
                      </button>
                      <div class="text-muted small">Inventory (admin), Gdocs (user)</div>
                    </div>
                    <div>
                      <strong>CRM:</strong> 
                      <code class="ms-2">crm / crm123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${() => { this.username = 'crm'; this.password = 'crm123'; }}>
                        Use
                      </button>
                      <div class="text-muted small">CRM (admin), Sales, Gdocs (user)</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="text-center mt-4 text-muted small">
                <p class="mb-0">&copy; 2024 Lit SPA Dashboard. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('login-page', LoginPage);
