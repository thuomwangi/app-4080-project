import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import {
  getProducts, getCart, saveCart, addToCart, updateCartQty, removeFromCart,
  cartCount, cartTotal, ksh, CATEGORIES,
  type Product, type CartItem,
} from "../lib/store";

export default function ProductListing() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [cart,     setCart]       = useState<CartItem[]>([]);
  const [search,   setSearch]     = useState("");
  const [category, setCategory]   = useState("All");
  const [sort,     setSort]       = useState("newest");
  const [showCart, setShowCart]   = useState(false);
  const [toast,    setToast]      = useState<string | null>(null);

  const reload = useCallback(() => {
    setProducts(getProducts());
    setCart(getCart());
  }, []);

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

  // filter + sort
  const visible = products
    .filter(p =>
      (category === "All" || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.seller.toLowerCase().includes(search.toLowerCase()) ||
       p.category.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

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
        {/* ── Page header ── */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h1 className="fw-bold mb-1">Browse Products</h1>
            <p className="text-muted mb-0">{visible.length} item{visible.length !== 1 ? "s" : ""} found</p>
          </div>
          <Link to="/seller-dashboard" className="btn btn-primary d-md-none">+ List an Item</Link>
        </div>

        {/* ── Search & sort bar ── */}
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search products, sellers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="btn btn-outline-secondary" onClick={() => setSearch("")}>✕</button>
              )}
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* ── Category pills ── */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`btn btn-sm rounded-pill ${category === c ? "btn-primary" : "btn-outline-secondary"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* ── Product Grid ── */}
        {visible.length === 0 ? (
          <div className="text-center py-5">
            <div className="fs-1 mb-3">🔍</div>
            <h4 className="text-muted">No products found</h4>
            <p className="text-muted small">Try a different search or category</p>
            <button className="btn btn-outline-primary mt-2" onClick={() => { setSearch(""); setCategory("All"); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {visible.map(p => {
              const inCart = cart.find(i => i.id === p.id);
              return (
                <div className="col-sm-6 col-lg-4 col-xl-3" key={p.id}>
                  <div className="card h-100 shadow-sm border-0 product-card">
                    {/* image */}
                    <Link to={`/products/${p.id}`} className="text-decoration-none">
                      <div className="bg-light d-flex align-items-center justify-content-center position-relative overflow-hidden"
                        style={{ height: 190 }}>
                        {p.image
                          ? <img src={p.image} alt={p.name} className="w-100 h-100" style={{ objectFit:"cover" }} />
                          : <span style={{ fontSize: 64 }}>{p.emoji}</span>
                        }
                        {p.tag && (
                          <span className="badge bg-primary position-absolute top-0 start-0 m-2">{p.tag}</span>
                        )}
                        {p.stock <= 3 && p.stock > 0 && (
                          <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
                            Only {p.stock} left!
                          </span>
                        )}
                        {p.stock === 0 && (
                          <div className="position-absolute inset-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
                            <span className="badge bg-danger fs-6">Sold Out</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="card-body d-flex flex-column">
                      <p className="text-muted small mb-1">{p.category}</p>
                      <Link to={`/products/${p.id}`} className="text-decoration-none text-dark">
                        <h6 className="card-title fw-semibold lh-sm mb-1">{p.name}</h6>
                      </Link>
                      <p className="text-muted small mb-2 flex-grow-1" style={{ display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                        {p.description}
                      </p>
                      <div className="d-flex align-items-center justify-content-between mt-auto">
                        <span className="fw-bold text-primary fs-5">KSh {p.price.toLocaleString()}</span>
                        {inCart
                          ? (
                            <div className="d-flex align-items-center gap-1">
                              <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQty(p.id, -1)}>−</button>
                              <span className="px-2 fw-semibold">{inCart.qty}</span>
                              <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQty(p.id, +1)}>+</button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              disabled={p.stock === 0}
                              onClick={() => handleAdd(p)}
                            >
                              {p.stock === 0 ? "Sold Out" : "Add to Cart"}
                            </button>
                          )
                        }
                      </div>
                    </div>

                    <div className="card-footer bg-white border-0 pt-0 pb-2 px-3">
                      <small className="text-muted">@{p.seller}</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
                      <div className="bg-light rounded d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 52, height: 52, overflow:"hidden" }}>
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-100 h-100" style={{ objectFit:"cover" }} />
                          : <span style={{ fontSize: 28 }}>{item.emoji}</span>
                        }
                      </div>
                      <div className="flex-grow-1 min-width-0">
                        <p className="mb-0 fw-semibold small text-truncate">{item.name}</p>
                        <p className="mb-0 text-primary small fw-bold">KSh {item.price.toLocaleString()}</p>
                      </div>
                      <div className="d-flex align-items-center gap-1 flex-shrink-0">
                        <button className="btn btn-outline-secondary btn-sm py-0" style={{ lineHeight:1.4 }} onClick={() => handleQty(item.id, -1)}>−</button>
                        <span className="px-1 small fw-semibold">{item.qty}</span>
                        <button className="btn btn-outline-secondary btn-sm py-0" style={{ lineHeight:1.4 }} onClick={() => handleQty(item.id, +1)}>+</button>
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
                  <button className="btn btn-primary fw-semibold" onClick={() => { setShowCart(false); }}>
                    Proceed to Checkout →
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => { removeFromCart(""); setCart([]); }}>
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
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-4 px-4 py-2 bg-dark text-white rounded-pill shadow"
          style={{ zIndex: 9999, whiteSpace:"nowrap", fontSize: 14 }}>
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
