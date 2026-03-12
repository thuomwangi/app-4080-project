import React, { useState } from 'react';

export default function SellerDashboard() {
  // --- 1. ACCESSIBILITY STATE ---
  const [highContrast, setHighContrast] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);

  // --- 2. THEME & SIMPLIFIED LOGIC ---
  const themeClass = highContrast ? "bg-black text-white" : "bg-light text-dark";
  const sidebarClass = highContrast ? "bg-black border-end border-secondary" : "bg-white border-end";
  const mutedText = highContrast ? "text-white-50" : "text-muted";
  
  // Simplified Mode removes shadows, adds borders, and increases padding for better focus
  const cardClass = `card rounded-4 border-0 ${
    highContrast ? 'bg-dark border border-white text-white' : 'bg-white text-dark'
  } ${
    simplifiedMode ? 'shadow-none border border-secondary-subtle p-lg-4' : 'shadow-sm'
  }`;

  return (
    <div className={`container-fluid min-vh-100 ${themeClass} ${simplifiedMode ? 'simplified-active' : ''}`}>
      <div className="row">
        
        {/* --- 1. SIDEBAR --- */}
        <div className={`col-md-2 vh-100 p-4 position-fixed d-none d-md-block ${sidebarClass}`}>
          <div className={`d-flex align-items-center mb-5 ${highContrast ? 'text-white' : 'text-primary'}`}>
            <i className="bi bi-cart-fill fs-4 me-2"></i>
            <h5 className="fw-bold mb-0">USIU Marketplace</h5>
          </div>
          <ul className="nav flex-column">
            <li className={`nav-item mb-3 fw-bold ${highContrast ? 'text-white' : 'text-primary'}`}>
               <i className="bi bi-grid-1x2-fill me-2"></i> Dashboard
            </li>
            <li className={`nav-item mb-3 fw-semibold ${mutedText}`}>
               <i className="bi bi-box-seam me-2"></i> Products
            </li>
            <li className={`nav-item mb-3 fw-semibold ${mutedText}`}>
               <i className="bi bi-receipt me-2"></i> Orders
            </li>
            <li className={`nav-item fw-semibold ${mutedText}`}>
               <i className="bi bi-people me-2"></i> Customers
            </li>
          </ul>
          
          <div className="position-absolute bottom-0 start-0 p-4 w-100">
            <div className="d-flex align-items-center">
              <img src="https://via.placeholder.com/35" className="rounded-circle me-2" alt="Adam" />
              <div>
                <p className="small fw-bold mb-0">Adam Seller</p>
                <p className={`smaller mb-0 ${mutedText}`} style={{fontSize: '0.7rem'}}>USIU Marketplace User</p>
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
              <i className={`bi bi-bell fs-5 me-3 ${mutedText}`}></i>
              <img src="https://via.placeholder.com/35" className="rounded-circle border" alt="Adam" />
            </div>
          </div>

          {/* 2. KEY METRICS */}
          <h5 className="fw-bold mb-3">Key Metrics</h5>
          <div className="row g-4 mb-5">
            {[
              { label: "Total Sales", val: "$12,345", icon: "bi-currency-dollar", sub: "Generated this month" },
              { label: "Total Orders", val: "256", icon: "bi-cart3", sub: "Completed this month" },
              { label: "Active Customers", val: "88", icon: "bi-people", sub: "Engaged in last 30 days" },
              { label: "Avg. Order Value", val: "$48.22", icon: "bi-box", sub: "Per completed order" }
            ].map((m, i) => (
              <div className="col-md-3" key={i}>
                <div className={`${cardClass} p-3 text-center h-100`}>
                  <i className={`bi ${m.icon} fs-3 mb-2 ${highContrast ? 'text-white' : 'text-primary'}`}></i>
                  <h4 className="fw-bold mb-0">{m.val}</h4>
                  <p className={`small mb-0 ${mutedText}`}>{m.label}</p>
                  {!simplifiedMode && <small className={mutedText} style={{fontSize: '0.7rem'}}>{m.sub}</small>}
                </div>
              </div>
            ))}
          </div>

          {/* 3. SALES & ORDER REPORTS (Hidden in Simplified Mode) */}
          {!simplifiedMode && (
            <div className="row g-4 mb-5">
              <div className="col-md-7">
                <div className={`${cardClass} p-4 h-100`}>
                  <h6 className="fw-bold mb-4">Revenue Trends</h6>
                  <div className={`${highContrast ? 'bg-secondary' : 'bg-light'} rounded-3 d-flex align-items-center justify-content-center`} style={{ height: "250px" }}>
                    <span className={mutedText}>[Revenue Chart Placeholder]</span>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className={`${cardClass} p-4 h-100`}>
                  <h6 className="fw-bold mb-4">Order Distribution by Category</h6>
                  <div className={`${highContrast ? 'bg-secondary' : 'bg-light'} rounded-3 d-flex align-items-center justify-content-center`} style={{ height: "250px" }}>
                     <span className={mutedText}>[Category Donut Chart]</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. BUSINESS PROFILE */}
          <h5 className="fw-bold mb-3">Business Profile</h5>
          <div className={`${cardClass} p-4 mb-5`}>
            <h6 className="fw-bold mb-4">Manage Your Profile</h6>
            <div className="row">
              <div className="col-md-8">
                <label className={`form-label small fw-bold ${mutedText}`}>Business Name</label>
                <input type="text" className={`form-control mb-3 ${highContrast ? 'bg-dark text-white border-white' : ''}`} defaultValue="Adam's Student Emporium" />
                <label className={`form-label small fw-bold ${mutedText}`}>Business Description</label>
                <textarea className={`form-control mb-3 ${highContrast ? 'bg-dark text-white border-white' : ''}`} rows="3">Selling quality used textbooks, electronics, and handmade crafts to USIU students.</textarea>
                <label className={`form-label small fw-bold ${mutedText}`}>Contact Email</label>
                <input type="email" className={`form-control mb-4 ${highContrast ? 'bg-dark text-white border-white' : ''}`} defaultValue="adam.seller@usiu.edu" />
                <button className={`btn fw-bold px-4 py-2 ${highContrast ? 'btn-light' : 'btn-primary'}`}>Update Profile</button>
              </div>
            </div>
          </div>

          {/* 5. PRODUCT MANAGEMENT */}
          <h5 className="fw-bold mb-3">Product Management</h5>
          <div className={`${cardClass} p-4 mb-5`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold mb-0">Your Products</h6>
              <button className={`btn btn-sm px-3 fw-bold ${highContrast ? 'btn-light' : 'btn-primary'}`}>Add New Product</button>
            </div>
            <div className="table-responsive">
              <table className={`table table-hover align-middle ${highContrast ? 'table-dark' : ''} ${simplifiedMode ? 'table-borderless' : ''}`}>
                <thead className={highContrast ? 'table-dark' : 'table-light'}>
                  <tr className="small text-muted">
                    <th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th>{!simplifiedMode && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody className="small">
                  {[{ id: 'P001', name: 'Organic Chemistry Textbook', cat: 'Books', price: '$75.00', stock: 12 },
                    { id: 'P002', name: 'Bluetooth Headphones', cat: 'Electronics', price: '$45.99', stock: 8 },
                    { id: 'P003', name: 'Handmade Ceramic Mug', cat: 'Home Goods', price: '$18.50', stock: 25 }
                  ].map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.id}</td><td className="fw-semibold">{p.name}</td><td>{p.cat}</td><td>{p.price}</td><td>{p.stock}</td>
                      {!simplifiedMode && (
                        <td>
                          <i className="bi bi-pencil-square me-3" style={{cursor: 'pointer'}}></i>
                          <i className="bi bi-trash text-danger" style={{cursor: 'pointer'}}></i>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. ORDER MANAGEMENT */}
          <h5 className="fw-bold mb-3">Order Management</h5>
          <div className={`${cardClass} p-4 mb-5`}>
             <h6 className="fw-bold mb-4">Customer Orders</h6>
             <div className="table-responsive">
               <table className={`table table-hover align-middle ${highContrast ? 'table-dark' : ''}`}>
                 <thead className={highContrast ? 'table-dark' : 'table-light'}>
                   <tr className="small text-muted">
                     <th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th>{!simplifiedMode && <th>Actions</th>}
                   </tr>
                 </thead>
                 <tbody className="small">
                   {[{ id: 'ORD001', name: 'Alice Johnson', date: '2023-10-26', total: '$93.50', status: 'Pending', color: 'warning' },
                     { id: 'ORD002', name: 'Bob Williams', date: '2023-10-25', total: '$45.99', status: 'Shipped', color: 'info' },
                     { id: 'ORD003', name: 'Charlie Brown', date: '2023-10-24', total: '$18.50', status: 'Delivered', color: 'success' },
                     { id: 'ORD004', name: 'Diana Prince', date: '2023-10-24', total: '$75.00', status: 'Cancelled', color: 'danger' }
                   ].map((o, idx) => (
                     <tr key={idx}>
                       <td className="fw-bold text-primary">{o.id}</td><td>{o.name}</td><td>{o.date}</td><td>{o.total}</td>
                       <td>
                          <span className={simplifiedMode ? 'fw-bold' : `badge rounded-pill bg-${o.color} text-${o.color === 'warning' ? 'dark' : 'white'}`}>
                            {o.status}
                          </span>
                       </td>
                       {!simplifiedMode && <td><i className="bi bi-eye me-2"></i><i className="bi bi-truck"></i></td>}
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
              <div className={`${cardClass} p-4 h-100`}>
                <h6 className="fw-bold mb-4">Your Customers</h6>
                <div className="table-responsive">
                  <table className={`table table-sm align-middle ${highContrast ? 'table-dark' : ''}`}>
                    <thead className={highContrast ? 'table-dark' : 'table-light'}>
                      <tr className="small text-muted"><th>Name</th><th>Email</th><th>Purchases</th></tr>
                    </thead>
                    <tbody className="small">
                      {[{ n: 'Alice Johnson', e: 'alice@example.com', p: 3 }, { n: 'Bob Williams', e: 'bob@example.com', p: 5 }, { n: 'Charlie Brown', e: 'charlie@example.com', p: 1 }].map((c, i) => (
                        <tr key={i}><td className="py-3">{!simplifiedMode && <i className="bi bi-person me-2"></i>}{c.n}</td><td className={mutedText}>{c.e}</td><td>{c.p}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`${cardClass} p-4 h-100`}>
                <h6 className="fw-bold mb-4">Customer Feedback</h6>
                {!simplifiedMode && (
                  <div className={`btn-group w-100 mb-4 p-1 rounded-3 ${highContrast ? 'bg-secondary' : 'bg-light'}`}>
                    <button className="btn btn-white shadow-sm btn-sm fw-bold">Open</button>
                    <button className={`btn btn-sm ${mutedText}`}>In Progress</button>
                    <button className={`btn btn-sm ${mutedText}`}>Resolved</button>
                  </div>
                )}
                <div className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold small text-warning-emphasis">Item damaged</span>
                    <span className={`${mutedText} smaller`}>2023-10-27</span>
                  </div>
                  <div className={simplifiedMode ? '' : 'ps-4'}>
                    <p className="smaller mb-1">Customer: Alice Johnson</p>
                    <button className={`btn btn-sm py-0 px-3 rounded-pill mt-2 ${highContrast ? 'btn-outline-light' : 'btn-outline-secondary'}`} style={{fontSize: '0.75rem'}}>Mark In Progress</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 8. ACCESSIBILITY SETTINGS */}
          <h5 className="fw-bold mb-3">Accessibility Settings</h5>
          <div className={`${cardClass} p-4 mb-4`}>
            <h6 className="fw-bold mb-4">Interface Options</h6>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className={`fw-semibold ${mutedText}`}>Simplified Interface Mode</span>
                {simplifiedMode && <p className="smaller mb-0 text-success">Active: Clutter Reduced</p>}
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input fs-4" type="checkbox" checked={simplifiedMode} onChange={() => setSimplifiedMode(!simplifiedMode)} />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className={`fw-semibold ${mutedText}`}>High Contrast Mode</span>
              <div className="form-check form-switch">
                <input className="form-check-input fs-4" type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} />
              </div>
            </div>
          </div>

          <footer className={`text-center small py-4 ${mutedText}`}>© 2026 USIU Marketplace. All rights reserved.</footer>
        </div>
      </div>
    </div>
  );
}