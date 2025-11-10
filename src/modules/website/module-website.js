import { LitElement, html } from 'lit';

class ModuleWebsite extends LitElement {
  createRenderRoot() { return this; }

  render() {
    return html`
      <div class="container-fluid py-4">
        <div class="row mb-4">
          <div class="col-12">
            <h1 class="h2 mb-3">
              <i class="bi bi-globe text-primary me-2"></i>Website Management
            </h1>
            <p class="text-muted">Manage your website content, pages, and settings</p>
          </div>
        </div>

        <div class="row g-4">
          <!-- Pages Card -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                    <i class="bi bi-file-earmark-text text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Pages</h5>
                    <p class="text-muted small mb-0">Manage website pages</p>
                  </div>
                </div>
                <p class="card-text">Create, edit, and organize your website pages and content.</p>
                <a href="/website/pages" class="btn btn-outline-primary btn-sm">
                  <i class="bi bi-arrow-right me-1"></i>Manage Pages
                </a>
              </div>
            </div>
          </div>

          <!-- Blog Card -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                    <i class="bi bi-journal-text text-success fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Blog</h5>
                    <p class="text-muted small mb-0">Manage blog posts</p>
                  </div>
                </div>
                <p class="card-text">Write and publish blog posts and articles.</p>
                <a href="/website/blog" class="btn btn-outline-success btn-sm">
                  <i class="bi bi-arrow-right me-1"></i>Manage Blog
                </a>
              </div>
            </div>
          </div>

          <!-- Media Card -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                    <i class="bi bi-image text-info fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Media</h5>
                    <p class="text-muted small mb-0">Manage media files</p>
                  </div>
                </div>
                <p class="card-text">Upload and organize images, videos, and documents.</p>
                <a href="/website/media" class="btn btn-outline-info btn-sm">
                  <i class="bi bi-arrow-right me-1"></i>Manage Media
                </a>
              </div>
            </div>
          </div>

          <!-- Navigation Card -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                    <i class="bi bi-menu-button-wide text-warning fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Navigation</h5>
                    <p class="text-muted small mb-0">Manage menus</p>
                  </div>
                </div>
                <p class="card-text">Configure website navigation menus and links.</p>
                <a href="/website/navigation" class="btn btn-outline-warning btn-sm">
                  <i class="bi bi-arrow-right me-1"></i>Manage Navigation
                </a>
              </div>
            </div>
          </div>

          <!-- SEO Card -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                    <i class="bi bi-search text-danger fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">SEO</h5>
                    <p class="text-muted small mb-0">Search optimization</p>
                  </div>
                </div>
                <p class="card-text">Manage SEO settings, meta tags, and sitemaps.</p>
                <a href="/website/seo" class="btn btn-outline-danger btn-sm">
                  <i class="bi bi-arrow-right me-1"></i>Manage SEO
                </a>
              </div>
            </div>
          </div>

          <!-- Settings Card -->
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="rounded-circle bg-secondary bg-opacity-10 p-3 me-3">
                    <i class="bi bi-gear text-secondary fs-4"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">Settings</h5>
                    <p class="text-muted small mb-0">Website settings</p>
                  </div>
                </div>
                <p class="card-text">Configure general website settings and preferences.</p>
                <a href="/website/settings" class="btn btn-outline-secondary btn-sm">
                  <i class="bi bi-arrow-right me-1"></i>Manage Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('module-website', ModuleWebsite);
