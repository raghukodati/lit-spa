import { LitElement, html } from 'lit';

class WebsiteDashboard extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    stats: { type: Object }
  };

  constructor() {
    super();
    this.stats = {
      totalPages: 24,
      publishedPages: 18,
      draftPages: 6,
      blogPosts: 42,
      mediaFiles: 156,
      visitors: 1250
    };
  }

  render() {
    return html`
      <div class="container-fluid py-4">
        <!-- Header -->
        <div class="row mb-4">
          <div class="col-12">
            <h1 class="h2 mb-3">
              <i class="bi bi-globe text-primary me-2"></i>Website Dashboard
            </h1>
            <p class="text-muted">Overview of your website content and performance</p>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="row g-3 mb-4">
          <div class="col-md-4 col-lg-2">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-0">Total Pages</h6>
                    <h2 class="mb-0 mt-2">${this.stats.totalPages}</h2>
                  </div>
                  <i class="bi bi-file-earmark-text fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-lg-2">
            <div class="card bg-success text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-0">Published</h6>
                    <h2 class="mb-0 mt-2">${this.stats.publishedPages}</h2>
                  </div>
                  <i class="bi bi-check-circle fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-lg-2">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-0">Drafts</h6>
                    <h2 class="mb-0 mt-2">${this.stats.draftPages}</h2>
                  </div>
                  <i class="bi bi-pencil-square fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-lg-2">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-0">Blog Posts</h6>
                    <h2 class="mb-0 mt-2">${this.stats.blogPosts}</h2>
                  </div>
                  <i class="bi bi-journal-text fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-lg-2">
            <div class="card bg-secondary text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-0">Media Files</h6>
                    <h2 class="mb-0 mt-2">${this.stats.mediaFiles}</h2>
                  </div>
                  <i class="bi bi-image fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-lg-2">
            <div class="card bg-dark text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-0">Visitors</h6>
                    <h2 class="mb-0 mt-2">${this.stats.visitors}</h2>
                  </div>
                  <i class="bi bi-people fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Row -->
        <div class="row">
          <!-- Quick Actions -->
          <div class="col-lg-4 mb-4">
            <div class="card shadow-sm">
              <div class="card-header bg-light">
                <h6 class="mb-0">
                  <i class="bi bi-lightning-charge text-primary me-2"></i>Quick Actions
                </h6>
              </div>
              <div class="list-group list-group-flush">
                <a href="/website/pages/create" class="list-group-item list-group-item-action">
                  <i class="bi bi-plus-circle text-primary me-2"></i>Create New Page
                </a>
                <a href="/website/blog/create" class="list-group-item list-group-item-action">
                  <i class="bi bi-plus-circle text-success me-2"></i>Write Blog Post
                </a>
                <a href="/website/media" class="list-group-item list-group-item-action">
                  <i class="bi bi-upload text-info me-2"></i>Upload Media
                </a>
                <a href="/website/navigation" class="list-group-item list-group-item-action">
                  <i class="bi bi-menu-button-wide text-warning me-2"></i>Edit Navigation
                </a>
                <a href="/website/settings" class="list-group-item list-group-item-action">
                  <i class="bi bi-gear text-secondary me-2"></i>Website Settings
                </a>
              </div>
            </div>
          </div>

          <!-- Recent Pages -->
          <div class="col-lg-8 mb-4">
            <div class="card shadow-sm">
              <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                  <i class="bi bi-clock-history text-primary me-2"></i>Recent Pages
                </h6>
                <a href="/website/pages" class="btn btn-sm btn-outline-primary">View All</a>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Author</th>
                        <th>Last Modified</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Home Page</strong></td>
                        <td><span class="badge bg-success">Published</span></td>
                        <td>John Doe</td>
                        <td>Oct 30, 2024</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-pencil"></i>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>About Us</strong></td>
                        <td><span class="badge bg-success">Published</span></td>
                        <td>Jane Smith</td>
                        <td>Oct 29, 2024</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-pencil"></i>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Products</strong></td>
                        <td><span class="badge bg-warning">Draft</span></td>
                        <td>Bob Johnson</td>
                        <td>Oct 28, 2024</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-pencil"></i>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Contact</strong></td>
                        <td><span class="badge bg-success">Published</span></td>
                        <td>Alice Williams</td>
                        <td>Oct 27, 2024</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-pencil"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Blog Posts -->
        <div class="row">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                  <i class="bi bi-journal-text text-success me-2"></i>Recent Blog Posts
                </h6>
                <a href="/website/blog" class="btn btn-sm btn-outline-success">View All</a>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-4">
                    <div class="card border">
                      <div class="card-body">
                        <span class="badge bg-success mb-2">Published</span>
                        <h6 class="card-title">Getting Started with Web Development</h6>
                        <p class="card-text small text-muted">Learn the basics of HTML, CSS, and JavaScript...</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                          <small class="text-muted">Oct 30, 2024</small>
                          <button class="btn btn-sm btn-outline-primary">Edit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card border">
                      <div class="card-body">
                        <span class="badge bg-success mb-2">Published</span>
                        <h6 class="card-title">10 Tips for Better SEO</h6>
                        <p class="card-text small text-muted">Improve your website's search engine ranking...</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                          <small class="text-muted">Oct 28, 2024</small>
                          <button class="btn btn-sm btn-outline-primary">Edit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card border">
                      <div class="card-body">
                        <span class="badge bg-warning mb-2">Draft</span>
                        <h6 class="card-title">Understanding Web Accessibility</h6>
                        <p class="card-text small text-muted">Make your website accessible to everyone...</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                          <small class="text-muted">Oct 27, 2024</small>
                          <button class="btn btn-sm btn-outline-primary">Edit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('website-dashboard', WebsiteDashboard);
