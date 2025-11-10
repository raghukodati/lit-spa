import{T as s,N as d}from"./index-CDXZUF87.js";class i extends s{createRenderRoot(){return this}render(){return d`
      <div class="container-fluid py-4">
        <h1 class="h2 mb-4">
          <i class="bi bi-inbox me-2 text-success"></i>Inbox Dashboard
        </h1>
        <div class="row">
          <div class="col-md-3">
            <div class="card bg-primary text-white mb-3">
              <div class="card-body">
                <h6>Total Documents</h6>
                <h2>15</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-white mb-3">
              <div class="card-body">
                <h6>Pending</h6>
                <h2>5</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white mb-3">
              <div class="card-body">
                <h6>Approved</h6>
                <h2>8</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white mb-3">
              <div class="card-body">
                <h6>Processed</h6>
                <h2>2</h2>
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
                <a href="/gdocs/inbox/purchase-orders" class="list-group-item list-group-item-action">
                  <i class="bi bi-file-earmark-text me-2"></i>Purchase Orders
                </a>
                <a href="/gdocs/inbox/invoices" class="list-group-item list-group-item-action">
                  <i class="bi bi-file-earmark-text me-2"></i>Invoices
                </a>
                <a href="/gdocs/inbox/acknowledgements" class="list-group-item list-group-item-action">
                  <i class="bi bi-file-earmark-check me-2"></i>Acknowledgements
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
                        <th>Vendor</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>PO-IN-2024-001</td>
                        <td>Purchase Order</td>
                        <td>Acme Supplies</td>
                        <td><span class="badge bg-warning">Pending</span></td>
                        <td>Oct 25, 2024</td>
                      </tr>
                      <tr>
                        <td>INV-IN-2024-001</td>
                        <td>Invoice</td>
                        <td>Tech Solutions</td>
                        <td><span class="badge bg-success">Approved</span></td>
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
    `}}customElements.define("inbox-dashboard",i);
