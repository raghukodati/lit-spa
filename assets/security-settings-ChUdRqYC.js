import{N as s}from"./index-CDXZUF87.js";import{B as a}from"./BaseComponent-tGIDWUP3.js";class l extends a{static properties={settings:{type:Object},loading:{type:Boolean},saving:{type:Boolean}};createRenderRoot(){return this}constructor(){super(),this.settings={passwordMinLength:12,passwordRequireUppercase:!0,passwordRequireLowercase:!0,passwordRequireNumbers:!0,passwordRequireSpecialChars:!0,passwordExpiryDays:90,passwordHistoryCount:5,sessionTimeout:60,maxConcurrentSessions:3,sessionIdleTimeout:30,requireReauth:!0,maxLoginAttempts:5,lockoutDuration:30,autoUnlockEnabled:!0,mfaRequired:!1,mfaGracePeriod:7,auditLogRetention:90,auditDetailLevel:"medium",alertOnSecurityViolations:!0,alertEmail:"security@example.com",ipWhitelistEnabled:!1,allowedIpRanges:"",dataEncryptionEnabled:!0,fieldLevelEncryption:!0,sensitiveDataMasking:!0},this.loading=!1,this.saving=!1}async connectedCallback(){super.connectedCallback(),await this.loadSettings()}async loadSettings(){this.loading=!0;try{console.log("Security settings loaded")}catch(e){console.error("Failed to load security settings:",e)}finally{this.loading=!1}}_handleInput(e,i){const t=i.target.type==="checkbox"?i.target.checked:i.target.value;this.settings={...this.settings,[e]:t}}async _handleSave(){this.saving=!0;try{alert("Security settings saved successfully")}catch(e){console.error("Failed to save security settings:",e),alert("Failed to save security settings")}finally{this.saving=!1}}_handleReset(){confirm("Reset all security settings to defaults?")&&this.loadSettings()}render(){return s`
      <div>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 fw-bold">
              <i class="bi bi-gear-wide-connected me-2"></i>Security Settings
            </h1>
            <p class="text-muted">Configure enterprise security policies and access controls</p>
          </div>
          <div class="d-flex gap-2">
            <button @click=${this._handleReset} class="btn btn-outline-secondary">
              <i class="bi bi-arrow-counterclockwise me-1"></i>Reset
            </button>
            <button @click=${this._handleSave} class="btn btn-primary" ?disabled=${this.saving}>
              ${this.saving?s`<span class="spinner-border spinner-border-sm me-2"></span>`:s`<i class="bi bi-save me-1"></i>`}
              Save Settings
            </button>
          </div>
        </div>

        ${this.loading?s`
          <div class="text-center p-5">
            <div class="spinner-border text-primary"></div>
          </div>
        `:s`
          <div class="row">
            <!-- Password Policy -->
            <div class="col-lg-6 mb-4">
              <div class="card shadow-sm h-100">
                <div class="card-header bg-primary text-white">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-key me-2"></i>Password Policy
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Minimum Length</label>
                    <input 
                      type="number" 
                      class="form-control"
                      .value=${this.settings.passwordMinLength}
                      @input=${e=>this._handleInput("passwordMinLength",e)}
                      min="8" max="32">
                    <div class="form-text">Minimum characters required</div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="passwordRequireUppercase"
                        .checked=${this.settings.passwordRequireUppercase}
                        @change=${e=>this._handleInput("passwordRequireUppercase",e)}>
                      <label class="form-check-label" for="passwordRequireUppercase">
                        Require Uppercase Letters
                      </label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="passwordRequireLowercase"
                        .checked=${this.settings.passwordRequireLowercase}
                        @change=${e=>this._handleInput("passwordRequireLowercase",e)}>
                      <label class="form-check-label" for="passwordRequireLowercase">
                        Require Lowercase Letters
                      </label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="passwordRequireNumbers"
                        .checked=${this.settings.passwordRequireNumbers}
                        @change=${e=>this._handleInput("passwordRequireNumbers",e)}>
                      <label class="form-check-label" for="passwordRequireNumbers">
                        Require Numbers
                      </label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="passwordRequireSpecialChars"
                        .checked=${this.settings.passwordRequireSpecialChars}
                        @change=${e=>this._handleInput("passwordRequireSpecialChars",e)}>
                      <label class="form-check-label" for="passwordRequireSpecialChars">
                        Require Special Characters
                      </label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Password Expiry (days)</label>
                    <input 
                      type="number" 
                      class="form-control"
                      .value=${this.settings.passwordExpiryDays}
                      @input=${e=>this._handleInput("passwordExpiryDays",e)}
                      min="0" max="365">
                    <div class="form-text">0 = never expires</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Password History</label>
                    <input 
                      type="number" 
                      class="form-control"
                      .value=${this.settings.passwordHistoryCount}
                      @input=${e=>this._handleInput("passwordHistoryCount",e)}
                      min="0" max="24">
                    <div class="form-text">Prevent reuse of last N passwords</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Session Management -->
            <div class="col-lg-6 mb-4">
              <div class="card shadow-sm h-100">
                <div class="card-header bg-info text-white">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-clock-history me-2"></i>Session Management
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Session Timeout (minutes)</label>
                    <input 
                      type="number" 
                      class="form-control"
                      .value=${this.settings.sessionTimeout}
                      @input=${e=>this._handleInput("sessionTimeout",e)}
                      min="5" max="480">
                    <div class="form-text">Absolute session timeout</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Idle Timeout (minutes)</label>
                    <input 
                      type="number" 
                      class="form-control"
                      .value=${this.settings.sessionIdleTimeout}
                      @input=${e=>this._handleInput("sessionIdleTimeout",e)}
                      min="5" max="240">
                    <div class="form-text">Timeout after inactivity</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Max Concurrent Sessions</label>
                    <input 
                      type="number" 
                      class="form-control"
                      .value=${this.settings.maxConcurrentSessions}
                      @input=${e=>this._handleInput("maxConcurrentSessions",e)}
                      min="1" max="10">
                    <div class="form-text">Per user</div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="requireReauth"
                        .checked=${this.settings.requireReauth}
                        @change=${e=>this._handleInput("requireReauth",e)}>
                      <label class="form-check-label" for="requireReauth">
                        Require Re-authentication for Sensitive Actions
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Account Security -->
            <div class="col-lg-6 mb-4">
              <div class="card shadow-sm h-100">
                <div class="card-header bg-warning text-dark">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-shield-lock me-2"></i>Account Security
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Max Login Attempts</label>
                    <input 
                      type="number" 
                      class="form-control"
                      .value=${this.settings.maxLoginAttempts}
                      @input=${e=>this._handleInput("maxLoginAttempts",e)}
                      min="3" max="10">
                    <div class="form-text">Before account lockout</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Lockout Duration (minutes)</label>
                    <input 
                      type="number" 
                      class="form-control"
                      .value=${this.settings.lockoutDuration}
                      @input=${e=>this._handleInput("lockoutDuration",e)}
                      min="5" max="1440">
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="autoUnlockEnabled"
                        .checked=${this.settings.autoUnlockEnabled}
                        @change=${e=>this._handleInput("autoUnlockEnabled",e)}>
                      <label class="form-check-label" for="autoUnlockEnabled">
                        Auto-Unlock After Duration
                      </label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="mfaRequired"
                        .checked=${this.settings.mfaRequired}
                        @change=${e=>this._handleInput("mfaRequired",e)}>
                      <label class="form-check-label" for="mfaRequired">
                        <strong>Require MFA for All Users</strong>
                      </label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">MFA Grace Period (days)</label>
                    <input 
                      type="number" 
                      class="form-control"
                      .value=${this.settings.mfaGracePeriod}
                      @input=${e=>this._handleInput("mfaGracePeriod",e)}
                      min="0" max="30">
                    <div class="form-text">Days to enable MFA before enforcement</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Audit Settings -->
            <div class="col-lg-6 mb-4">
              <div class="card shadow-sm h-100">
                <div class="card-header bg-success text-white">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-file-text me-2"></i>Audit & Logging
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Audit Log Retention (days)</label>
                    <input 
                      type="number" 
                      class="form-control"
                      .value=${this.settings.auditLogRetention}
                      @input=${e=>this._handleInput("auditLogRetention",e)}
                      min="30" max="365">
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Audit Detail Level</label>
                    <select 
                      class="form-select"
                      .value=${this.settings.auditDetailLevel}
                      @change=${e=>this._handleInput("auditDetailLevel",e)}>
                      <option value="minimal">Minimal - Critical events only</option>
                      <option value="medium">Medium - Important events</option>
                      <option value="detailed">Detailed - All events</option>
                      <option value="verbose">Verbose - Everything</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="alertOnSecurityViolations"
                        .checked=${this.settings.alertOnSecurityViolations}
                        @change=${e=>this._handleInput("alertOnSecurityViolations",e)}>
                      <label class="form-check-label" for="alertOnSecurityViolations">
                        Alert on Security Violations
                      </label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Alert Email</label>
                    <input 
                      type="email" 
                      class="form-control"
                      .value=${this.settings.alertEmail}
                      @input=${e=>this._handleInput("alertEmail",e)}>
                  </div>
                </div>
              </div>
            </div>

            <!-- IP Restrictions -->
            <div class="col-lg-6 mb-4">
              <div class="card shadow-sm h-100">
                <div class="card-header bg-danger text-white">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-globe me-2"></i>IP Restrictions
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="ipWhitelistEnabled"
                        .checked=${this.settings.ipWhitelistEnabled}
                        @change=${e=>this._handleInput("ipWhitelistEnabled",e)}>
                      <label class="form-check-label" for="ipWhitelistEnabled">
                        <strong>Enable IP Whitelist</strong>
                      </label>
                    </div>
                    <div class="form-text text-warning">
                      <i class="bi bi-exclamation-triangle"></i> Be careful! This may lock you out
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Allowed IP Ranges</label>
                    <textarea 
                      class="form-control"
                      rows="6"
                      .value=${this.settings.allowedIpRanges}
                      @input=${e=>this._handleInput("allowedIpRanges",e)}
                      placeholder="192.168.1.0/24&#10;10.0.0.0/8&#10;203.0.113.0/24"
                      ?disabled=${!this.settings.ipWhitelistEnabled}>
                    </textarea>
                    <div class="form-text">One range per line (CIDR notation)</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data Security -->
            <div class="col-lg-6 mb-4">
              <div class="card shadow-sm h-100">
                <div class="card-header bg-dark text-white">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-lock me-2"></i>Data Security
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="dataEncryptionEnabled"
                        .checked=${this.settings.dataEncryptionEnabled}
                        @change=${e=>this._handleInput("dataEncryptionEnabled",e)}>
                      <label class="form-check-label" for="dataEncryptionEnabled">
                        <strong>Enable Data Encryption at Rest</strong>
                      </label>
                    </div>
                    <div class="form-text">Encrypt sensitive data in database</div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="fieldLevelEncryption"
                        .checked=${this.settings.fieldLevelEncryption}
                        @change=${e=>this._handleInput("fieldLevelEncryption",e)}>
                      <label class="form-check-label" for="fieldLevelEncryption">
                        Field-Level Encryption
                      </label>
                    </div>
                    <div class="form-text">Encrypt individual fields</div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        type="checkbox" 
                        class="form-check-input"
                        id="sensitiveDataMasking"
                        .checked=${this.settings.sensitiveDataMasking}
                        @change=${e=>this._handleInput("sensitiveDataMasking",e)}>
                      <label class="form-check-label" for="sensitiveDataMasking">
                        Sensitive Data Masking
                      </label>
                    </div>
                    <div class="form-text">Mask sensitive fields in UI</div>
                  </div>

                  <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    <strong>Note:</strong> Changes to encryption settings may require system restart
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Save Button (Bottom) -->
          <div class="d-grid gap-2 mb-4">
            <button @click=${this._handleSave} class="btn btn-primary btn-lg" ?disabled=${this.saving}>
              ${this.saving?s`<span class="spinner-border spinner-border-sm me-2"></span>Saving...`:s`<i class="bi bi-save me-2"></i>Save All Security Settings`}
            </button>
          </div>
        `}
      </div>
    `}}customElements.define("security-settings",l);
