import React from 'react';

export default function SellerDashboard() {
  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row">
        
        {/* --- 1. SIDEBAR --- */}
        <div className="col-md-2 bg-white border-end vh-100 p-4 position-fixed d-none d-md-block">
          <div className="d-flex align-items-center mb-5 text-primary">
            <i className="bi bi-cart-fill fs-4 me-2"></i>
            <h5 className="fw-bold mb-0">USIU Marketplace</h5>
          </div>
          <ul className="nav flex-column">
            <li className="nav-item mb-3 fw-bold text-primary">
               <i className="bi bi-grid-1x2-fill me-2"></i> Dashboard
            </li>
            <li className="nav-item mb-3 text-muted fw-semibold">
               <i className="bi bi-box-seam me-2"></i> Products
            </li>
            <li className="nav-item mb-3 text-muted fw-semibold">
               <i className="bi bi-receipt me-2"></i> Orders
            </li>
            <li className="nav-item text-muted fw-semibold">
               <i className="bi bi-people me-2"></i> Customers
            </li>
          </ul>
          
          {/* User profile at bottom of sidebar */}
          <div className="position-absolute bottom-0 start-0 p-4 w-100">
            <div className="d-flex align-items-center">
              <img src="https://via.placeholder.com/35" className="rounded-circle me-2" alt="Adam" />
              <div>
                <p className="small fw-bold mb-0">Adam Seller</p>
                <p className="smaller text-muted mb-0" style={{fontSize: '0.7rem'}}>USIU Marketplace User</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="col-md-10 offset-md-2 p-4">
          
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Seller Dashboard</h2>
            <div className="d-flex align-items-center">
              <i className="bi bi-bell fs-5 me-3 text-muted"></i>
              <img src="https://via.placeholder.com/35" className="rounded-circle border" alt="Adam" />
            </div>
          </div>

          {/* 2. KEY METRICS */}
          <h5 className="fw-bold mb-3">Key Metrics</h5>
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
                <i className="bi bi-currency-dollar fs-3 text-primary mb-2"></i>
                <h4 className="fw-bold mb-0">$12,345</h4>
                <p className="text-muted small mb-0">Total Sales</p>
                <small className="text-muted" style={{fontSize: '0.7rem'}}>Generated this month</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
                <i className="bi bi-cart3 fs-3 text-primary mb-2"></i>
                <h4 className="fw-bold mb-0">256</h4>
                <p className="text-muted small mb-0">Total Orders</p>
                <small className="text-muted" style={{fontSize: '0.7rem'}}>Completed this month</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
                <i className="bi bi-people fs-3 text-primary mb-2"></i>
                <h4 className="fw-bold mb-0">88</h4>
                <p className="text-muted small mb-0">Active Customers</p>
                <small className="text-muted" style={{fontSize: '0.7rem'}}>Engaged in last 30 days</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
                <i className="bi bi-box fs-3 text-primary mb-2"></i>
                <h4 className="fw-bold mb-0">$48.22</h4>
                <p className="text-muted small mb-0">Avg. Order Value</p>
                <small className="text-muted" style={{fontSize: '0.7rem'}}>Per completed order</small>
              </div>
            </div>
          </div>

          {/* 3. SALES & ORDER REPORTS */}
          <div className="row g-4 mb-5">
            <div className="col-md-7">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold mb-4">Revenue Trends</h6>
                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ height: "250px" }}>
                  <span className="text-muted">[Revenue Chart Placeholder]</span>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold mb-4">Order Distribution by Category</h6>
                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ height: "250px" }}>
                   <span className="text-muted">[Category Donut Chart]</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. BUSINESS PROFILE */}
          <h5 className="fw-bold mb-3">Business Profile</h5>
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-5">
            <h6 className="fw-bold mb-4">Manage Your Profile</h6>
            <div className="row">
              <div className="col-md-8">
                <label className="form-label small fw-bold text-muted">Business Name</label>
                <input type="text" className="form-control mb-3" defaultValue="Adam's Student Emporium" />
                
                <label className="form-label small fw-bold text-muted">Business Description</label>
                <textarea className="form-control mb-3" rows="3">Selling quality used textbooks, electronics, and handmade crafts to USIU students.</textarea>
                
                <label className="form-label small fw-bold text-muted">Contact Email</label>
                <input type="email" className="form-control mb-4" defaultValue="adam.seller@usiu.edu" />
                
                <button className="btn btn-primary px-4 py-2 fw-bold">Update Profile</button>
              </div>
            </div>
          </div>

          {/* 5. PRODUCT MANAGEMENT */}
          <h5 className="fw-bold mb-3">Product Management</h5>
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold mb-0">Your Products</h6>
              <button className="btn btn-primary btn-sm px-3 fw-bold">Add New Product</button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr className="small text-muted">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {[
                    { id: 'P001', name: 'Organic Chemistry Textbook', cat: 'Books', price: '$75.00', stock: 12 },
                    { id: 'P002', name: 'Bluetooth Headphones', cat: 'Electronics', price: '$45.99', stock: 8 },
                    { id: 'P003', name: 'Handmade Ceramic Mug', cat: 'Home Goods', price: '$18.50', stock: 25 }
                  ].map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.id}</td>
                      <td className="fw-semibold">{p.name}</td>
                      <td>{p.cat}</td>
                      <td>{p.price}</td>
                      <td>{p.stock}</td>
                      <td>
                        <i className="bi bi-pencil-square text-muted me-3" style={{cursor: 'pointer'}}></i>
                        <i className="bi bi-trash text-danger" style={{cursor: 'pointer'}}></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. ORDER MANAGEMENT */}
          <h5 className="fw-bold mb-3">Order Management</h5>
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-5">
             <h6 className="fw-bold mb-4">Customer Orders</h6>
             <div className="table-responsive">
               <table className="table table-hover align-middle">
                 <thead className="table-light">
                   <tr className="small text-muted">
                     <th>Order ID</th>
                     <th>Customer</th>
                     <th>Date</th>
                     <th>Total</th>
                     <th>Status</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody className="small">
                   {[
                     { id: 'ORD001', name: 'Alice Johnson', date: '2023-10-26', total: '$93.50', status: 'Pending', color: 'warning' },
                     { id: 'ORD002', name: 'Bob Williams', date: '2023-10-25', total: '$45.99', status: 'Shipped', color: 'info' },
                     { id: 'ORD003', name: 'Charlie Brown', date: '2023-10-24', total: '$18.50', status: 'Delivered', color: 'success' },
                     { id: 'ORD004', name: 'Diana Prince', date: '2023-10-24', total: '$75.00', status: 'Cancelled', color: 'danger' }
                   ].map((o, idx) => (
                     <tr key={idx}>
                       <td className="fw-bold">{o.id}</td>
                       <td>{o.name}</td>
                       <td>{o.date}</td>
                       <td>{o.total}</td>
                       <td>
                         <span className={`badge rounded-pill bg-${o.color} text-${o.color === 'warning' ? 'dark' : 'white'}`}>
                           {o.status}
                         </span>
                       </td>
                       <td>
                        <i className="bi bi-eye text-muted me-2"></i>
                        <i className="bi bi-truck text-muted"></i>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

          {/* 7. CUSTOMER RELATIONS MANAGEMENT */}
          <h5 className="fw-bold mb-3">Customer Relations Management</h5>
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold mb-4">Your Customers</h6>
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead className="table-light small text-muted">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Total Purchases</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {[
                        { name: 'Alice Johnson', email: 'alice@example.com', p: 3 },
                        { name: 'Bob Williams', email: 'bob@example.com', p: 5 },
                        { name: 'Charlie Brown', email: 'charlie@example.com', p: 1 }
                      ].map((c, i) => (
                        <tr key={i}>
                          <td className="py-3"><i className="bi bi-person me-2"></i>{c.name}</td>
                          <td className="text-muted">{c.email}</td>
                          <td>{c.p}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold mb-4">Customer Feedback & Requests</h6>
                <div className="btn-group w-100 mb-4 bg-light p-1 rounded-3">
                  <button className="btn btn-white shadow-sm btn-sm fw-bold">Open</button>
                  <button className="btn btn-sm text-muted">In Progress</button>
                  <button className="btn btn-sm text-muted">Resolved</button>
                </div>
                <div className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold small text-warning-emphasis">
                      <i className="bi bi-clock-history me-2"></i>Item damaged during shipping
                    </span>
                    <span className="text-muted smaller">2023-10-27 <i className="bi bi-chevron-up"></i></span>
                  </div>
                  <div className="ps-4">
                    <p className="smaller text-muted mb-1">Customer: Alice Johnson</p>
                    <p className="smaller text-muted mb-3">Details: Lorem ipsum dolor sit amet...</p>
                    <button className="btn btn-sm btn-outline-secondary py-0 px-3 rounded-pill" style={{fontSize: '0.75rem'}}>Mark In Progress</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 8. ACCESSIBILITY SETTINGS */}
          <h5 className="fw-bold mb-3">Accessibility Settings</h5>
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h6 className="fw-bold mb-4">Interface Options</h6>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="small text-muted fw-semibold">Simplified Interface Mode</span>
              <div className="form-check form-switch">
                <input className="form-check-input fs-4" type="checkbox" role="switch" />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="small text-muted fw-semibold">High Contrast Mode</span>
              <div className="form-check form-switch">
                <input className="form-check-input fs-4" type="checkbox" role="switch" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-muted small py-4">
            © 2026 USIU Marketplace. All rights reserved.
          </footer>

        </div>
      </div>
    </div>
  );
}