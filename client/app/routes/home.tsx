import React from 'react';

// --- IMAGE IMPORTS (Adjusted for routes/ directory) ---
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
      {/* --- NAVIGATION (As seen in Screenshot 073828) --- */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom px-4">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center gap-2" href="#">
            <div className="bg-primary p-1 rounded">
              <i className="bi bi-cart-fill text-white"></i>
            </div>
            <span className="fw-bold text-primary fs-4">CampusCart</span>
          </a>
          
          <div className="collapse navbar-collapse justify-content-center">
            <ul className="navbar-nav gap-4">
              <li className="nav-item"><a className="nav-link active" href="#"><i className="bi bi-house-door me-1"></i> Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#"><i className="bi bi-box-seam me-1"></i> Products</a></li>
              <li className="nav-item"><a className="nav-link" href="#"><i className="bi bi-cart3 me-1"></i> Cart</a></li>
            </ul>
          </div>

          <div className="d-flex align-items-center gap-3">
             <div className="input-group d-none d-md-flex" style={{width: '250px'}}>
                <span className="input-group-text bg-light border-0 rounded-start-pill"><i className="bi bi-search text-muted"></i></span>
                <input type="text" className="form-control bg-light border-0 rounded-end-pill" placeholder="Search products..." />
             </div>
             <i className="bi bi-brightness-high fs-5 cursor-pointer"></i>
             <button className="btn btn-outline-dark border-0 fw-bold">Sign In</button>
             <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Register</button>
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
                
                <div className="input-group input-group-lg mb-4 shadow" style={{ maxWidth: '500px' }}>
                  <span className="input-group-text bg-white border-0 rounded-start-pill"><i className="bi bi-search text-muted"></i></span>
                  <input type="text" className="form-control border-0 rounded-end-pill fs-6" placeholder="Search for textbooks, electronics, and more..." />
                </div>

                <div className="d-flex gap-3 flex-wrap">
                  <button className="btn btn-primary btn-lg rounded-pill px-4 fw-bold">Register as Buyer</button>
                  <button className="btn btn-light btn-lg rounded-pill px-4 fw-bold">Register as Seller</button>
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
            <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">View All Products</button>
          </div>
          
          <div className="row g-4">
            {featuredProducts.map((prod, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="position-relative">
                    <img src={prod.img} className="card-img-top object-fit-cover" style={{height: '200px'}} alt={prod.name} />
                  </div>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-1">{prod.name}</h6>
                    <p className="text-muted smaller mb-3" style={{fontSize: '0.8rem'}}>{prod.desc}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fw-bold text-primary fs-5">{prod.price}</span>
                      <button className="btn btn-outline-dark btn-sm rounded px-3 fw-semibold">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONNECT SECTION (As seen in Screenshot 073905) --- */}
      <section className="container py-5 text-center my-5">
        <h2 className="fw-bold mb-2 fs-1">CampusCart: Connect, Buy, Sell.</h2>
        <p className="text-muted fs-5 mb-5">Your campus marketplace for students, by students. Simple, secure, and accessible.</p>
        
        <div className="row g-4 justify-content-center">
          <div className="col-md-5">
            <div className="card p-5 border-0 shadow-sm rounded-4 h-100 bg-white">
              <i className="bi bi-cart3 text-primary display-5 mb-4"></i>
              <h3 className="fw-bold mb-3">For Buyers</h3>
              <p className="text-muted mb-4 small">Discover unique items, textbooks, electronics, and more from your fellow students. Save money, support your community.</p>
              <button className="btn btn-primary btn-lg rounded w-100 fw-bold py-3">Start Shopping</button>
            </div>
          </div>
          <div className="col-md-5">
            <div className="card p-5 border-0 shadow-sm rounded-4 h-100 bg-white">
              <i className="bi bi-currency-exchange text-success display-5 mb-4"></i>
              <h3 className="fw-bold mb-3">For Sellers</h3>
              <p className="text-muted mb-4 small">Easily list your unused items, turn them into cash, and manage your sales with our intuitive seller dashboard.</p>
              <button className="btn btn-outline-dark btn-lg rounded w-100 fw-bold py-3">Become a Seller</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- MOCKUP FOOTER (Re-created from Screenshot 073905) --- */}
      <footer className="bg-white pt-5 pb-4 border-top">
        <div className="container">
          <div className="row gy-5">
            {/* Branding Column */}
            <div className="col-lg-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-dark p-1 rounded">
                  <i className="bi bi-cart-fill text-white"></i>
                </div>
                <span className="fw-bold fs-4 text-dark">CampusCart</span>
              </div>
              <p className="text-muted small">© 2026 CampusCart. All rights reserved.</p>
            </div>

            {/* Navigation Column */}
            <div className="col-6 col-lg-3">
              <h6 className="fw-bold text-dark mb-3">Navigation</h6>
              <ul className="list-unstyled small text-muted lh-lg">
                <li>Home</li>
                <li>Products</li>
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="col-6 col-lg-3">
              <h6 className="fw-bold text-dark mb-3">Contact Us</h6>
              <div className="small text-muted mb-2">
                <strong>Email:</strong> support@campuscart.com
              </div>
              <div className="small text-muted">
                <strong>Phone:</strong> +254 (0) 123 456789
              </div>
            </div>

            {/* Follow Column */}
            <div className="col-lg-3 text-lg-end">
              <h6 className="fw-bold text-dark mb-3">Follow Us</h6>
              <div className="d-flex justify-content-lg-end gap-4 fs-4 text-dark">
                <i className="bi bi-facebook cursor-pointer"></i>
                <i className="bi bi-twitter-x cursor-pointer"></i>
                <i className="bi bi-instagram cursor-pointer"></i>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;