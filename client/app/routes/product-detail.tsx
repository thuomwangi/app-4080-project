import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  getProduct, getCart, saveCart, addToCart, updateCartQty, removeFromCart,
  type Product, type CartItem,
} from "./store";

export default function ProductDetail() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();

  const [product,  setProduct]  = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [cart,     setCart]     = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [toast,    setToast]    = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!id) return;
    const p = getProduct(id);
    if (!p) { setNotFound(true); return; }
    setProduct(p);
    setCart(getCart());
  }, [id]);

  useEffect(() => { reload(); }, [reload]);

  // show toast helper
  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleAdd = (p: Product) => {
    addToCart(p);
    setCart(getCart());
    notify(`${p.name} added to cart!`);
  };

  const handleQty = (id: string, d: number) => {
    updateCartQty(id, d);
    setCart(getCart());
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const handleClearCart = () => {
    saveCart([]);
    setCart([]);
  };

  const count  = cart.reduce((s, i) => s + i.qty, 0);
  const total  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const inCart = product ? cart.find(i => i.id === product.id) : undefined;

  /* ── Not found ── */
  if (notFound) return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">🛒 Campus Cart</Link>
          <div className="d-flex align-items-center gap-2 ms-auto">
            <Link to="/seller-dashboard" className="btn btn-outline-light btn-sm d-none d-md-inline-flex">+ Sell</Link>
            <Link to="/products" className="btn btn-light btn-sm">Browse</Link>
          </div>
        </div>
      </nav>
      <div className="container py-5 text-center">
        <div className="fs-1 mb-3">😕</div>
        <h4 className="fw-bold mb-2">Product not found</h4>
        <p className="text-muted">This listing may have been removed or the link is incorrect.</p>
        <Link to="/products" className="btn btn-primary mt-2">← Back to Products</Link>
      </div>
    </>
  );

  /* ── Loading ── */
  if (!product) return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">🛒 Campus Cart</Link>
        </div>
      </nav>
      <div className="container py-5 text-center text-muted">Loading…</div>
    </>
  );

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">🛒 Campus Cart</Link>
          <div className="d-flex align-items-center gap-2 ms-auto">
            <Link to="/seller-dashboard" className="btn btn-outline-light btn-sm d-none d-md-inline-flex">+ Sell</Link>
            <button className="btn btn-light btn-sm position-relative" onClick={() => setShowCart(true)}>
              🛒 Cart
              {count > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">

        {/* ── Breadcrumb ── */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-primary">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products" className="text-decoration-none text-primary">Products</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products" className="text-decoration-none text-primary">{product.category}</Link>
            </li>
            <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 200 }}>
              {product.name}
            </li>
          </ol>
        </nav>

        {/* ── Main detail card ── */}
        <div className="row g-4 mb-5">

          {/* Left – image */}
          <div className="col-md-5">
            <div
              className="bg-light rounded-3 d-flex align-items-center justify-content-center position-relative overflow-hidden"
              style={{ height: 360 }}
            >
              {product.image
                ? <img src={product.image} alt={product.name} className="w-100 h-100" style={{ objectFit: "cover" }} />
                : <span style={{ fontSize: 120 }}>{product.emoji}</span>
              }
              {product.tag && (
                <span className="badge bg-primary position-absolute top-0 start-0 m-3 fs-6">{product.tag}</span>
              )}
              {product.stock <= 3 && product.stock > 0 && (
                <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-3">
                  Only {product.stock} left!
                </span>
              )}
              {product.stock === 0 && (
                <div className="position-absolute w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
                  <span className="badge bg-danger fs-5">Sold Out</span>
                </div>
              )}
            </div>
          </div>

          {/* Right – details */}
          <div className="col-md-7">
            <p className="text-muted small text-uppercase fw-semibold mb-1">{product.category}</p>
            <h2 className="fw-bold mb-3">{product.name}</h2>
            <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>{product.description}</p>

            <div className="d-flex align-items-center gap-4 mb-3">
              <span className="fw-bold text-primary" style={{ fontSize: "2rem" }}>
                KSh {product.price.toLocaleString()}
              </span>
              <span className={`badge ${product.stock > 0 ? "bg-success" : "bg-danger"} fs-6`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <p className="text-muted small mb-4">
              Sold by <strong className="text-dark">@{product.seller}</strong>
              <span className="mx-2">·</span>
              Listed {product.createdAt}
            </p>

            <hr />

            {/* ── Cart actions ── */}
            {product.stock === 0 ? (
              <button className="btn btn-secondary btn-lg w-100" disabled>Sold Out</button>
            ) : inCart ? (
              <div>
                <p className="small text-muted fw-semibold text-uppercase mb-2">In your cart</p>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <button className="btn btn-outline-secondary" onClick={() => handleQty(product.id, -1)}>−</button>
                  <span className="fw-bold fs-4">{inCart.qty}</span>
                  <button className="btn btn-outline-secondary" onClick={() => handleQty(product.id, +1)}>+</button>
                  <span className="text-primary fw-bold ms-2">
                    = KSh {(inCart.qty * product.price).toLocaleString()}
                  </span>
                </div>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary fw-semibold" onClick={() => setShowCart(true)}>
                    View Cart →
                  </button>
                  <button className="btn btn-primary fw-semibold" onClick={() => { setShowCart(false); navigate("/checkout"); }}>
                    Proceed to Checkout →
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-lg fw-semibold" onClick={() => handleAdd(product)}>
                  Add to Cart
                </button>
                <Link to="/products" className="btn btn-outline-secondary">← Back to Products</Link>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Cart Offcanvas ── */}
      {showCart && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050 }}>
          {/* backdrop */}
          <div className="position-absolute w-100 h-100 bg-dark bg-opacity-50" onClick={() => setShowCart(false)} />
          {/* drawer */}
          <div
            className="position-absolute top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
            style={{ width: "min(420px, 100vw)", zIndex: 1 }}
          >
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
              <h5 className="mb-0 fw-bold">🛒 Your Cart</h5>
              <button className="btn-close" onClick={() => setShowCart(false)} />
            </div>

            <div className="flex-grow-1 overflow-auto p-3">
              {cart.length === 0 ? (
                <div className="text-center py-5">
                  <div className="fs-1 mb-2">🛒</div>
                  <p className="text-muted">Your cart is empty</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowCart(false)}>Browse Products</button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {cart.map(item => (
                    <div key={item.id} className="d-flex gap-3 align-items-center border rounded p-2">
                      <div
                        className="bg-light rounded d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 52, height: 52, overflow: "hidden" }}
                      >
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-100 h-100" style={{ objectFit: "cover" }} />
                          : <span style={{ fontSize: 28 }}>{item.emoji}</span>
                        }
                      </div>
                      <div className="flex-grow-1 min-width-0">
                        <p className="mb-0 fw-semibold small text-truncate">{item.name}</p>
                        <p className="mb-0 text-primary small fw-bold">KSh {item.price.toLocaleString()}</p>
                      </div>
                      <div className="d-flex align-items-center gap-1 flex-shrink-0">
                        <button className="btn btn-outline-secondary btn-sm py-0" style={{ lineHeight: 1.4 }} onClick={() => handleQty(item.id, -1)}>−</button>
                        <span className="px-1 small fw-semibold">{item.qty}</span>
                        <button className="btn btn-outline-secondary btn-sm py-0" style={{ lineHeight: 1.4 }} onClick={() => handleQty(item.id, +1)}>+</button>
                        <button className="btn btn-link btn-sm text-danger p-0 ms-1" onClick={() => handleRemove(item.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-top p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">Total ({count} items)</span>
                  <span className="fw-bold fs-5 text-primary">KSh {total.toLocaleString()}</span>
                </div>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary fw-semibold"
                    onClick={() => { setShowCart(false); navigate("/checkout"); }}
                  >
                    Proceed to Checkout →
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={handleClearCart}>
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 px-4 py-2 bg-dark text-white rounded-pill shadow"
          style={{ zIndex: 9999, whiteSpace: "nowrap", fontSize: 14 }}
        >
          ✓ {toast}
        </div>
      )}

      <style>{`
        .product-card { transition: transform .2s, box-shadow .2s; }
        .product-card:hover { transform: translateY(-3px); box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.1) !important; }
      `}</style>
    </>
  );
}