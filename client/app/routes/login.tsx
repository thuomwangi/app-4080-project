import React from 'react';
import { Link } from 'react-router';

const LoginPage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      {/* Reusable Navbar to match your screenshot */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2 text-primary fw-bold fs-4" to="/">
            <i className="bi bi-cart-fill"></i>
            CampusCart
          </Link>
          
          <div className="collapse navbar-collapse justify-content-center">
            <ul className="navbar-nav gap-4 fw-medium">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/sell">Sell</Link></li>
            </ul>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="input-group d-none d-md-flex" style={{ width: '250px' }}>
              <span className="input-group-text bg-light border-0 rounded-start-3">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input type="text" className="form-control bg-light border-0 rounded-end-3" placeholder="Search products..." />
            </div>
            <Link to="/cart" className="text-dark fs-5"><i className="bi bi-cart3"></i></Link>
            <Link to="/login" className="btn btn-primary rounded-3 px-4 fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-person-fill"></i> Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Login Card Section */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light-subtle p-3">
        <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5" style={{ maxWidth: '480px', width: '100%' }}>
          
          <div className="text-center mb-4">
            <div className="bg-primary-subtle d-inline-flex p-3 rounded-circle mb-3">
              <i className="bi bi-cart3 text-primary fs-3"></i>
            </div>
            <h2 className="fw-bold mb-1">Welcome Back to CampusCart</h2>
            <p className="text-muted small">Sign in to your account</p>
          </div>

          <form>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Email</label>
              <input 
                type="email" 
                className="form-control py-2 px-3 border-light-subtle rounded-3" 
                placeholder="you@university.edu" 
                required 
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-dark">Password</label>
              <input 
                type="password" 
                className="form-control py-2 px-3 border-light-subtle rounded-3" 
                placeholder="••••••••" 
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold rounded-3 mb-4 shadow-sm">
              Sign In
            </button>

            <div className="d-flex align-items-center mb-4 text-muted">
              <hr className="flex-grow-1 opacity-25" />
              <span className="mx-3 small fw-medium">or</span>
              <hr className="flex-grow-1 opacity-25" />
            </div>

            <button type="button" className="btn btn-outline-light border text-dark w-100 py-2 fw-medium rounded-3 d-flex align-items-center justify-content-center gap-2 mb-4 bg-white shadow-sm">
              <img src="https://www.google.com/favicon.ico" alt="Google" width="16" />
              Continue with Google
            </button>

            <div className="text-center">
              <p className="text-muted small mb-0">
                Don't have an account? <Link to="/sign-up" className="text-primary text-decoration-none fw-bold">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;