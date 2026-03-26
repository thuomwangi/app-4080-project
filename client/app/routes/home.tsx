import React from 'react';
import { Link } from 'react-router'; // Added Link import

// --- IMAGE IMPORTS ---
import heroBg from '../assets/images/campus-hero.jpg';
import studentImg from '../assets/images/student-hero.jpg'; 
import laptopImg from '../assets/images/laptop.jpg';
import textbookImg from '../assets/images/textbook.jpg';
import hoodieImg from '../assets/images/hoodie.jpg';
import lampImg from '../assets/images/lamp.jpg';

const HomePage = () => {
  const featuredProducts = [
    { name: 'Used Gaming Laptop', price: 'KES 95,000', img: laptopImg, desc: 'High-performance laptop perfect for gaming and engineering software.' },
    { name: 'Calculus III Textbook', price: 'KES 4,500', img: textbookImg, desc: 'Barely used, great condition, latest edition for USIU math courses.' },
    { name: 'USIU Branded Hoodie', price: 'KES 3,200', img: hoodieImg, desc: 'Comfortable and stylish official USIU gear.' },
    { name: 'Desk Lamp with USB', price: 'KES 2,500', img: lampImg, desc: 'Modern LED lamp with adjustable brightness and charging port.' }
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* --- NAVIGATION --- */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom px-4">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <div className="bg-primary p-1 rounded">
              <i className="bi bi-cart-fill text-white"></i>
            </div>
            <span className="fw-bold text-primary fs-4">CampusCart</span>
          </Link>
          
          <div className="collapse navbar-collapse justify-content-center">
            <ul className="navbar-nav gap-4">
              <li className="nav-item"><Link className="nav-link active" to="/"><i className="bi bi-house-door me-1"></i> Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/products"><i className="bi bi-box-seam me-1"></i> Products</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/seller-dashboard"><i className="bi bi-graph-up me-1"></i> Sell</Link></li>
            </ul>
          </div>

          <div className="d-flex align-items-center gap-3">
             <div className="input-group d-none d-md-flex" style={{width: '250px'}}>
                <span className="input-group-text bg-light border-0 rounded-start-pill"><i className="bi bi-search text-muted"></i></span>
                <input type="text" className="form-control bg-light border-0 rounded-end-pill" placeholder="Search products..." />
             </div>
             <Link to="/login" className="btn btn-outline-dark border-0 fw-bold">Sign In</Link>
             <Link to="/sign-up" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Register</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="position-relative overflow-hidden" style={{ height: '600px' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 z-0">
          <img src={heroBg} className="w-100 h-100 object-fit-cover" style={{ filter: 'brightness(0.4)' }} alt="USIU Campus" />
        </div>

        <div className="container position-relative h-100 z-1 d-flex align-items-center">
          <div className="row w-100 align-items-center">
            <div className="col-lg-7 text-white">
              <div className="p-4 rounded-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
                <h1 className="display-3 fw-bold mb-3">Discover & Sell Campus Treasures</h1>
                <p className="fs-4 mb-4 opacity-90">Your go-to marketplace for USIU students. Find what you need or sell what you don't!</p>
                
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/sign-up" className="btn btn-primary btn-lg rounded-pill px-4 fw-bold">Register as Buyer</Link>
                  <Link to="/sign-up" className="btn btn-light btn-lg rounded-pill px-4 fw-bold">Register as Seller</Link>
                </div>
              </div>
            </div>
            
            <div className="col-lg-5 d-none d-lg-block">
              <div className="bg-white p-2 rounded-4 shadow-lg transform rotate-2">
                <img src={studentImg} className="w-100 rounded-3" alt="USIU Student" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="bg-white py-5">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <h2 className="fw-bold mb-0">Featured Products</h2>
            <Link to="/products" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">View All Products</Link>
          </div>
          
          <div className="row g-4">
            {featuredProducts.map((prod, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                  <img src={prod.img} className="card-img-top object-fit-cover" style={{height: '200px'}} alt={prod.name} />
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-1">{prod.name}</h6>
                    <p className="text-muted smaller mb-3" style={{fontSize: '0.8rem'}}>{prod.desc}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fw-bold text-primary fs-5">{prod.price}</span>
                      <Link to={`/products/${i}`} className="btn btn-outline-dark btn-sm rounded px-3 fw-semibold">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONNECT SECTION --- */}
      <section className="container py-5 text-center my-5">
        <h2 className="fw-bold mb-2 fs-1">CampusCart: Connect, Buy, Sell.</h2>
        <div className="row g-4 justify-content-center mt-4">
          <div className="col-md-5">
            <div className="card p-5 border-0 shadow-sm rounded-4 h-100 bg-white">
              <i className="bi bi-cart3 text-primary display-5 mb-4"></i>
              <h3 className="fw-bold mb-3">For Buyers</h3>
              <Link to="/products" className="btn btn-primary btn-lg rounded w-100 fw-bold py-3">Start Shopping</Link>
            </div>
          </div>
          <div className="col-md-5">
            <div className="card p-5 border-0 shadow-sm rounded-4 h-100 bg-white">
              <i className="bi bi-currency-exchange text-success display-5 mb-4"></i>
              <h3 className="fw-bold mb-3">For Sellers</h3>
              <Link to="/seller-dashboard" className="btn btn-outline-dark btn-lg rounded w-100 fw-bold py-3">Become a Seller</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;