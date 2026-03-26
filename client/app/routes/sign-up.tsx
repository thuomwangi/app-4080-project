import React, { useState } from 'react';
import { Link } from 'react-router'; // Correct import for v7

const SignUpPage = () => {
  const [role, setRole] = useState('buyer');

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5" style={{ maxWidth: '450px', width: '100%' }}>
        
        {/* Logo/Icon Header */}
        <div className="text-center mb-4">
          <div className="bg-primary-subtle d-inline-block p-3 rounded-circle mb-3">
            <i className="bi bi-cart3 text-primary fs-3"></i>
          </div>
          <h2 className="fw-bold mb-1">Create an account</h2>
          <p className="text-muted small">Enter your details to join CampusCart</p>
        </div>

        <form>
          {/* Buyer/Seller Toggle */}
          <div className="mb-4">
            <div className="d-flex p-1 bg-light rounded-3 border">
              <button 
                type="button" 
                className={`btn flex-fill py-2 rounded-2 border-0 fw-semibold transition-all ${role === 'buyer' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                onClick={() => setRole('buyer')}
              >
                Buyer
              </button>
              <button 
                type="button" 
                className={`btn flex-fill py-2 rounded-2 border-0 fw-semibold transition-all ${role === 'seller' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                onClick={() => setRole('seller')}
              >
                Seller
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <input type="email" className="form-control py-2 border-light-subtle rounded-3" placeholder="you@university.edu" required />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Password</label>
            <input type="password" className="form-control py-2 border-light-subtle rounded-3" placeholder="••••••••" required />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold rounded-3 mb-3 shadow-sm">
            Sign Up
          </button>

          <div className="d-flex align-items-center mb-3">
            <hr className="flex-grow-1 text-muted opacity-25" />
            <span className="mx-3 text-muted small fw-medium">or</span>
            <hr className="flex-grow-1 text-muted opacity-25" />
          </div>

          <button type="button" className="btn btn-outline-light border text-dark w-100 py-2 fw-medium rounded-3 d-flex align-items-center justify-content-center gap-2 mb-4 shadow-sm bg-white">
            <img src="https://www.google.com/favicon.ico" alt="Google" width="16" />
            Continue with Google
          </button>

          <div className="text-center">
            <p className="text-muted small mb-0">
              Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Sign In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;