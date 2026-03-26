import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { getProducts, getCart, addToCart, CATEGORIES, type Product, type CartItem } from "../lib/store";

export default function ProductListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const reload = useCallback(() => {
    setProducts(getProducts());
    setCart(getCart());
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const visible = products.filter(p => 
    (category === "All" || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3 sticky-top">
        <div className="container">
          <Link className="navbar-brand text-primary fw-bold fs-4" to="/">CampusCart</Link>
          <div className="ms-auto d-flex align-items-center gap-3">
            <Link to="/products" className="nav-link fw-semibold">Browse</Link>
            <Link to="/checkout" className="btn btn-light rounded-circle position-relative p-2 border">
              <i className="bi bi-cart3 fs-5"></i>
              {cart.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">{cart.reduce((s,i)=>s+i.qty,0)}</span>}
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row g-4">
          <aside className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-4">Filters</h5>
              <div className="mb-4">
                <label className="small fw-bold text-muted text-uppercase mb-2 d-block">Category</label>
                {CATEGORIES.map(c => (
                  <div className="form-check mb-2" key={c}>
                    <input className="form-check-input" type="radio" name="cat" id={c} checked={category === c} onChange={() => setCategory(c)} />
                    <label className="form-check-label small" htmlFor={c}>{c}</label>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline-primary btn-sm w-100 rounded-3" onClick={() => {setCategory("All"); setSearch("");}}>Reset</button>
            </div>
          </aside>

          <main className="col-lg-9">
            <div className="mb-4">
              <div className="input-group bg-white shadow-sm rounded-4 overflow-hidden">
                <span className="input-group-text bg-white border-0 ps-4"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control border-0 py-3" placeholder="Search campus deals..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="row g-4">
              {visible.map(p => (
                <div className="col-md-6 col-xl-4" key={p.id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                    <img src={p.image} className="card-img-top" style={{height: '200px', objectFit: 'cover'}} alt={p.name} />
                    <div className="card-body p-4">
                      <span className="text-primary small fw-bold text-uppercase">{p.category}</span>
                      <h6 className="fw-bold mt-1 text-truncate">{p.name}</h6>
                      <p className="fw-bold fs-5 mb-3">KES {p.price.toLocaleString()}</p>
                      <div className="d-grid gap-2">
                        <Link to={`/products/${p.id}`} className="btn btn-primary btn-sm rounded-3 fw-bold">Details</Link>
                        <button className="btn btn-outline-secondary btn-sm rounded-3" onClick={() => {addToCart(p); reload();}}>Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}