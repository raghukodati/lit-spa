import{T as s,N as i}from"./index-B2c558M3.js";class t extends s{createRenderRoot(){return this}render(){return i`
      <div class="container-fluid py-4">
        <h1 class="h2 mb-4">
          <i class="bi bi-send me-2 text-info"></i>Outbox Dashboard
        </h1>
        <div class="row">
          <div class="col-md-3">
            <div class="card bg-primary text-white mb-3">
              <div class="card-body">
                <h6>Total Documents</h6>
                <h2>10</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white mb-3">
              <div class="card-body">
                <h6>Sent</h6>
                <h2>3</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white mb-3">
              <div class="card-body">
                <h6>Acknowledged</h6>
                <h2>4</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-white mb-3">
              <div class="card-body">
                <h6>Open</h6>
                <h2>4</h2>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row mt-4">
          <div class="col-md-4">
            <div class="card">
              <div class="card-header bg-light">
                <h6 class="mb-0">Quick Links</h6>
              </div>
              <div class="list-group list-group-flush">
                <a href="/gdocs/outbox/purchase-orders" class="list-group-item list-group-item-action">
                  <i class="bi bi-file-earmark-text me-2"></i>Purchase Orders
                </a>
                <a href="/gdocs/outbox/invoices" class="list-group-item list-group-item-action">
                  <i class="bi bi-file-earmark-text me-2"></i>Invoices
                </a>
                <a href="/gdocs/outbox/open-po-search" class="list-group-item list-group-item-action">
                  <i class="bi bi-search me-2"></i>Open PO Search
                </a>
                <a href="/gdocs/outbox/open-invoice-search" class="list-group-item list-group-item-action">
                  <i class="bi bi-search me-2"></i>Open Invoice Search
                </a>
              </div>
            </div>
          </div>
          
          <div class="col-md-8">
            <div class="card">
              <div class="card-header bg-light">
                <h6 class="mb-0">Recent Documents</h6>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Document #</th>
                        <th>Type</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>PO-OUT-2024-001</td>
                        <td>Purchase Order</td>
                        <td>Beta Manufacturing</td>
                        <td><span class="badge bg-success">Sent</span></td>
                        <td>Oct 25, 2024</td>
                      </tr>
                      <tr>
                        <td>INV-OUT-2024-001</td>
                        <td>Invoice</td>
                        <td>Gamma Enterprises</td>
                        <td><span class="badge bg-info">Viewed</span></td>
                        <td>Oct 26, 2024</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("outbox-dashboard",t);
