import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getCart, updateCartQty, type CartItem } from "../lib/store";

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedCart, setSavedCart] = useState<CartItem[]>([]); 
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => { setCart(getCart()); }, []);

  const subtotal = (step === 3 ? savedCart : cart).reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subtotal + 50;

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
    setSavedCart([...cart]);
    setTimeout(() => {
      setLoading(false);
      localStorage.removeItem("campus_cart");
      setStep(3);
    }, 2500);
  };

  if (step === 3) return (
    <div className="container py-5">
      <style>{`@media print { body * { visibility: hidden; } #receipt-content, #receipt-content * { visibility: visible; } #receipt-content { position: absolute; left: 0; top: 0; width: 100%; } .d-print-none { display: none !important; } }`}</style>
      <div className="card border-0 shadow-lg rounded-4 mx-auto overflow-hidden" style={{ maxWidth: '600px' }}>
        <div className="bg-success p-5 text-center text-white d-print-none">
          <i className="bi bi-shield-check display-1"></i>
          <h2 className="fw-bold mt-3">Payment Verified</h2>
        </div>
        <div className="p-5" id="receipt-content">
          <div className="d-flex justify-content-between mb-4">
            <div><h4 className="fw-bold text-primary mb-0">CampusCart</h4><small>Official Receipt</small></div>
            <div className="text-end"><p className="mb-0 fw-bold">Order #CC-{Math.floor(100000 + Math.random()*900000)}</p></div>
          </div>
          <table className="table table-borderless">
            <thead><tr className="border-bottom"><th className="ps-0">Item</th><th className="text-center">Qty</th><th className="text-end pe-0">Amount</th></tr></thead>
            <tbody>
              {savedCart.map((item) => (
                <tr key={item.id}>
                  <td className="ps-0"><span className="fw-semibold">{item.name}</span><br/><small className="text-muted">Seller: {item.seller}</small></td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-end pe-0">KES {(item.price * item.qty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 pt-3 border-top text-end">
            <h5 className="fw-bold text-primary">Total Paid: KES {total.toLocaleString()}</h5>
          </div>
        </div>
        <div className="p-4 bg-light border-top d-flex gap-3 d-print-none">
          <button className="btn btn-outline-dark btn-lg w-100 rounded-pill fw-bold" onClick={() => window.print()}>Download PDF</button>
          <Link to="/products" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold">Done</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar bg-white border-bottom px-4 py-3"><div className="container"><Link className="navbar-brand fw-bold text-primary" to="/products"><i className="bi bi-arrow-left me-2"></i> Checkout</Link></div></nav>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            {step === 1 ? (
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold mb-4">Review Cart</h4>
                {cart.length === 0 ? <p className="text-center py-5">Cart is empty.</p> : cart.map((item) => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between border-bottom py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={item.image} className="rounded border p-1" style={{width: '60px', height: '60px', objectFit: 'cover'}} />
                      <div><h6 className="mb-0 fw-bold">{item.name}</h6><small className="text-muted">Seller: {item.seller}</small></div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="btn-group border rounded-pill bg-white">
                        <button className="btn btn-sm px-3" onClick={() => { updateCartQty(item.id, -1); setCart(getCart()); }}>-</button>
                        <span className="btn btn-sm disabled fw-bold">{item.qty}</span>
                        <button className="btn btn-sm px-3" onClick={() => { updateCartQty(item.id, 1); setCart(getCart()); }}>+</button>
                      </div>
                      <span className="fw-bold">KES {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold mb-4">Payment Details</h4>
                <form onSubmit={handlePayment}>
                  <div className="mb-3"><label className="form-label small fw-bold">Name on Card</label><input type="text" className="form-control py-3" required value={cardName} onChange={e => setCardName(e.target.value)} /></div>
                  <div className="mb-3"><label className="form-label small fw-bold">Card Number</label><input type="text" className="form-control py-3" required value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} maxLength={19} /></div>
                  <div className="row">
                    <div className="col-md-6 mb-3"><label className="form-label small fw-bold">Expiry</label><input type="text" className="form-control py-3" required value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} /></div>
                    <div className="col-md-6 mb-3"><label className="form-label small fw-bold">CVV</label><input type="password" className="form-control py-3" required value={cvv} onChange={e => setCvv(e.target.value)} maxLength={3} /></div>
                  </div>
                  <button type="submit" disabled={!isCardValid() || loading} className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm">
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
              <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
              <div className="d-flex justify-content-between mb-4 border-top pt-2"><span className="fw-bold fs-4">Total</span><span className="fw-bold fs-4 text-primary">KES {total.toLocaleString()}</span></div>
              {step === 1 && <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold" disabled={cart.length === 0} onClick={() => setStep(2)}>To Payment</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}