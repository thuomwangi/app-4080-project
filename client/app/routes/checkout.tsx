import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getCart, removeFromCart, updateCartQty, type CartItem } from "../lib/store";

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedCart, setSavedCart] = useState<CartItem[]>([]); // Snapshot for receipt
  const [step, setStep] = useState(1); // 1: Review, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const currentCart = getCart();
    setCart(currentCart);
  }, []);

  const subtotal = (step === 3 ? savedCart : cart).reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subtotal + 50; // Service Fee

  const isCardValid = () => {
    const s = cardNumber.replace(/\s/g, "");
    if (s.length < 13) return false;
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
      let intVal = parseInt(s.charAt(i));
      if (i % 2 === (s.length % 2)) {
        intVal *= 2;
        if (intVal > 9) intVal -= 9;
      }
      sum += intVal;
    }
    return sum % 10 === 0 && expiry.length === 5 && cvv.length === 3;
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Save snapshot for the receipt before clearing store
    setSavedCart([...cart]);

    setTimeout(() => {
      setLoading(false);
      localStorage.removeItem("campus_cart");
      setStep(3);
    }, 2500);
  };

  if (step === 3) {
    return (
      <div className="container py-5">
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              #receipt-content, #receipt-content * { visibility: visible; }
              #receipt-content { position: absolute; left: 0; top: 0; width: 100%; }
              .d-print-none { display: none !important; }
            }
          `}
        </style>
        <div className="card border-0 shadow-lg rounded-4 mx-auto overflow-hidden" style={{ maxWidth: '600px' }}>
          {/* Success Header */}
          <div className="bg-success p-5 text-center text-white d-print-none">
            <i className="bi bi-shield-check display-1"></i>
            <h2 className="fw-bold mt-3">Payment Verified</h2>
            <p className="mb-0 opacity-75">Your USIU marketplace order is confirmed.</p>
          </div>

          {/* Printable Receipt */}
          <div className="p-5" id="receipt-content">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h4 className="fw-bold text-primary mb-0">CampusCart</h4>
                <small className="text-muted">Official Transaction Receipt</small>
              </div>
              <div className="text-end">
                <p className="mb-0 fw-bold small">Order #CC-{Math.floor(100000 + Math.random() * 900000)}</p>
                <p className="mb-0 small text-muted">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <table className="table table-borderless mt-4">
              <thead>
                <tr className="border-bottom">
                  <th className="ps-0">Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end pe-0">Amount</th>
                </tr>
              </thead>
              <tbody>
                {savedCart.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-0">
                      <span className="fw-semibold">{item.name}</span><br/>
                      <small className="text-muted text-uppercase" style={{fontSize: '0.7rem'}}>Seller: {item.seller}</small>
                    </td>
                    <td className="text-center">{item.qty}</td>
                    <td className="text-end pe-0">KES {(item.price * item.qty).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 pt-3 border-top">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Platform Service Fee</span>
                <span>KES 50</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
                <span>Total Amount Paid</span>
                <span className="text-primary">KES {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-5 p-3 bg-light rounded-3 text-center small">
              <p className="mb-1 fw-bold text-dark">Meetup Instructions</p>
              <p className="mb-0 text-muted">Show this PDF to your seller at the designated campus meetup spot (e.g., Student Center) to collect your items.</p>
            </div>
          </div>

          {/* Post-Payment Actions */}
          <div className="p-4 bg-light border-top d-flex gap-3 d-print-none">
            <button className="btn btn-outline-dark btn-lg w-100 rounded-pill fw-bold" onClick={() => window.print()}>
              <i className="bi bi-download me-2"></i> Download PDF
            </button>
            <Link to="/products" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold">
              Done
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar bg-white border-bottom px-4 py-3">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" to="/products">
            <i className="bi bi-arrow-left me-2"></i> Checkout
          </Link>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            {step === 1 ? (
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold mb-4 text-dark">Review Cart</h4>
                {cart.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">Your cart is empty.</p>
                        <Link to="/products" className="btn btn-primary">Go Shopping</Link>
                    </div>
                ) : cart.map((item) => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between border-bottom py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-white border rounded p-2 fs-3 shadow-sm">{item.emoji}</div>
                      <div>
                        <h6 className="mb-0 fw-bold">{item.name}</h6>
                        <small className="text-muted">Seller: {item.seller}</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="btn-group border rounded-pill bg-white">
                        <button className="btn btn-sm px-3" onClick={() => { updateCartQty(item.id, -1); setCart(getCart()); }}>-</button>
                        <span className="btn btn-sm disabled fw-bold text-dark">{item.qty}</span>
                        <button className="btn btn-sm px-3" onClick={() => { updateCartQty(item.id, 1); setCart(getCart()); }}>+</button>
                      </div>
                      <span className="fw-bold text-dark">KES {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">Visa / Mastercard</h4>
                    <div className="fs-3 text-muted">
                        <i className="bi bi-credit-card-2-front me-2"></i>
                        <i className="bi bi-shield-lock"></i>
                    </div>
                </div>
                <form onSubmit={handlePayment}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">Cardholder Name</label>
                    <input type="text" className="form-control py-3 rounded-3" required value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Full Name" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">Card Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><i className="bi bi-credit-card text-primary"></i></span>
                      <input 
                        type="text" 
                        className="form-control py-3 border-start-0" 
                        required 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} 
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength={19}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase">Expiry Date</label>
                      <input type="text" className="form-control py-3" required value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase">CVV</label>
                      <input type="password" className="form-control py-3" required value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" maxLength={3} />
                    </div>
                  </div>
                  <button type="submit" disabled={!isCardValid() || loading} className="btn btn-primary w-100 py-3 rounded-pill fw-bold mt-3 shadow-sm">
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-lock-fill me-2"></i>}
                    {loading ? 'Processing...' : `Pay KES ${total.toLocaleString()}`}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{top: '100px'}}>
              <h5 className="fw-bold mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2 text-muted"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
              <div className="d-flex justify-content-between mb-4 text-muted"><span>Platform Fee</span><span>KES 50</span></div>
              <div className="d-flex justify-content-between border-top pt-3 mb-4">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-4 text-primary">KES {total.toLocaleString()}</span>
              </div>
              {step === 1 && (
                <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" disabled={cart.length === 0} onClick={() => setStep(2)}>
                  Proceed to Payment
                </button>
              )}
              {step === 2 && (
                  <button className="btn btn-link w-100 text-muted small" onClick={() => setStep(1)}>
                      Edit Cart
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}