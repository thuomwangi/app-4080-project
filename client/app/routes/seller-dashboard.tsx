export default function SellerDashboard() {
  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}
        <div className="col-md-2 bg-white border-end vh-100 p-4">
          <h5 className="fw-bold mb-4">USIU Marketplace</h5>

          <ul className="nav flex-column">
            <li className="nav-item mb-3 fw-semibold text-primary">Dashboard</li>
            <li className="nav-item mb-3 text-muted">Products</li>
            <li className="nav-item mb-3 text-muted">Orders</li>
            <li className="nav-item text-muted">Customers</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-4 bg-light">

          {/* Page Title */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Seller Dashboard</h2>
          </div>

          {/* Metrics Row */}
          <div className="row g-4 mb-4">

            <div className="col-md-3">
              <div className="card shadow-sm rounded-4 p-3">
                <h4 className="fw-bold">$12,345</h4>
                <p className="mb-1">Total Sales</p>
                <small className="text-muted">Generated this month</small>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm rounded-4 p-3">
                <h4 className="fw-bold">256</h4>
                <p className="mb-1">Total Orders</p>
                <small className="text-muted">Completed this month</small>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm rounded-4 p-3">
                <h4 className="fw-bold">88</h4>
                <p className="mb-1">Active Customers</p>
                <small className="text-muted">Last 30 days</small>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm rounded-4 p-3">
                <h4 className="fw-bold">$48.22</h4>
                <p className="mb-1">Avg Order Value</p>
                <small className="text-muted">Per order</small>
              </div>
            </div>

          </div>

          {/* Reports Section */}
          <div className="row g-4 mb-4">

            <div className="col-md-6">
              <div className="card shadow-sm rounded-4 p-4">
                <h5 className="fw-semibold mb-3">Revenue Trends</h5>
                <div style={{ height: "200px", background: "#f8f9fa" }}>
                  Chart Placeholder
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm rounded-4 p-4">
                <h5 className="fw-semibold mb-3">Order Distribution</h5>
                <div style={{ height: "200px", background: "#f8f9fa" }}>
                  Chart Placeholder
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}