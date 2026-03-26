import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getProducts, addProduct, deleteProduct, CATEGORIES, type Product } from '../lib/store';

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics' | 'add'>('inventory');
  const [searchQuery, setSearchQuery] = useState("");
  
  // Accessibility States
  const [highContrast, setHighContrast] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);

  // Form State for Adding Products
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "Other",
    description: "",
    emoji: "📦",
    stock: 1,
    seller: "Adam" 
  });

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(formData);
    setProducts(getProducts()); 
    setActiveTab('inventory'); // Go back to list after adding
    setFormData({ name: "", price: 0, category: "Other", description: "", emoji: "📦", stock: 1, seller: "Adam" });
  };

  const handleDelete = (id: string) => {
    if(confirm("Delete this listing?")) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  const sellerProducts = products.filter(p => p.seller === "Adam");
  
  // --- Analytics Logic ---
  const categoryStats = CATEGORIES.filter(c => c !== "All").map(cat => {
    const count = sellerProducts.filter(p => p.category === cat).length;
    const value = sellerProducts.filter(p => p.category === cat).reduce((sum, p) => sum + (p.price * p.stock), 0);
    return { name: cat, count, value };
  });

  const maxCount = Math.max(...categoryStats.map(s => s.count), 1);

  // Style helpers
  const themeClass = highContrast ? "bg-black text-white" : "bg-light text-dark";
  const cardClass = `card rounded-4 border-0 shadow-sm p-4 ${highContrast ? 'bg-dark border border-white text-white' : 'bg-white text-dark'}`;

  return (
    <div className={`container-fluid min-vh-100 ${themeClass}`}>
      <div className="row">
        
        {/* SIDEBAR */}
        <div className="col-md-2 vh-100 p-4 border-end d-none d-md-block bg-white position-fixed shadow-sm">
          <div className="d-flex align-items-center mb-5 text-primary">
            <i className="bi bi-person-badge-fill fs-4 me-2"></i>
            <h5 className="fw-bold mb-0">Seller Hub</h5>
          </div>
          
          <div className="nav flex-column gap-2">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`nav-link border-0 text-start rounded-3 px-3 py-2 ${activeTab === 'inventory' ? 'bg-primary text-white shadow' : 'text-muted'}`}
            >
              <i className="bi bi-box-seam me-2"></i> Inventory
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`nav-link border-0 text-start rounded-3 px-3 py-2 ${activeTab === 'analytics' ? 'bg-primary text-white shadow' : 'text-muted'}`}
            >
              <i className="bi bi-graph-up-arrow me-2"></i> Analytics
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className={`nav-link border-0 text-start rounded-3 px-3 py-2 ${activeTab === 'add' ? 'bg-primary text-white shadow' : 'text-muted'}`}
            >
              <i className="bi bi-plus-circle me-2"></i> Add New
            </button>
          </div>

          <div className="position-absolute bottom-0 start-0 p-4 w-100">
            <Link to="/products" className="btn btn-outline-secondary btn-sm w-100 rounded-pill">
              <i className="bi bi-arrow-left me-2"></i> Back to Shop
            </Link>
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="col-md-10 offset-md-2 p-5">
          
          {/* TAB 1: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="animate-in">
              <div className="d-flex justify-content-between align-items-end mb-4">
                <h2 className="fw-bold">My Products</h2>
                <div className="text-end">
                  <span className="badge bg-primary rounded-pill px-3">{sellerProducts.length} Total Items</span>
                </div>
              </div>
              
              <div className={cardClass}>
                <input 
                  type="text" 
                  className="form-control mb-4 bg-light border-0 py-2" 
                  placeholder="Filter by name..." 
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="table-responsive">
                  <table className={`table align-middle ${highContrast ? 'table-dark' : ''}`}>
                    <thead>
                      <tr className="text-muted small uppercase">
                        <th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                        <tr key={p.id}>
                          <td><span className="me-2">{p.emoji}</span> <strong>{p.name}</strong></td>
                          <td><small className="badge bg-secondary-subtle text-dark border-0">{p.category}</small></td>
                          <td className="fw-bold">KES {p.price.toLocaleString()}</td>
                          <td>{p.stock}</td>
                          <td>
                            <button onClick={() => handleDelete(p.id)} className="btn btn-sm text-danger border-0">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANALYTICS (CSS BAR CHART) */}
          {activeTab === 'analytics' && (
            <div className="animate-in">
              <h2 className="fw-bold mb-4">Business Performance</h2>
              <div className="row g-4">
                <div className="col-md-8">
                  <div className={cardClass}>
                    <h6 className="fw-bold mb-4">Stock Distribution by Category</h6>
                    <div className="d-flex align-items-end gap-3" style={{ height: '200px' }}>
                      {categoryStats.map(stat => (
                        <div key={stat.name} className="flex-grow-1 d-flex flex-column align-items-center">
                          <div 
                            className="bg-primary rounded-top-2 w-100 transition-all" 
                            style={{ 
                              height: `${(stat.count / maxCount) * 100}%`,
                              opacity: stat.count === 0 ? 0.1 : 1,
                              minHeight: '4px'
                            }}
                          ></div>
                          <small className="text-muted mt-2" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>{stat.name}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`${cardClass} h-100 bg-primary text-white`}>
                    <h6 className="fw-bold opacity-75">Estimated Value</h6>
                    <h1 className="fw-bold">KES {categoryStats.reduce((a, b) => a + b.value, 0).toLocaleString()}</h1>
                    <p className="small mb-0 opacity-75 mt-auto">Based on current stock levels</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADD PRODUCT */}
          {activeTab === 'add' && (
            <div className="animate-in">
              <h2 className="fw-bold mb-4">List New Product</h2>
              <div className="col-lg-7">
                <div className={cardClass}>
                  <form onSubmit={handleSave}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Item Name</label>
                      <input type="text" className="form-control" required onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col">
                        <label className="form-label small fw-bold">Price (KES)</label>
                        <input type="number" className="form-control" required onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                      </div>
                      <div className="col">
                        <label className="form-label small fw-bold">Stock</label>
                        <input type="number" className="form-control" required defaultValue={1} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Category</label>
                      <select className="form-select" onChange={e => setFormData({...formData, category: e.target.value})}>
                        {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="form-label small fw-bold">Description</label>
                      <textarea className="form-control" rows={3} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold">Confirm Listing</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SHARED SETTINGS BOX */}
          <div className="mt-5 p-4 border rounded-4 bg-white opacity-75">
             <div className="form-check form-switch d-inline-block me-4">
                <input className="form-check-input" type="checkbox" onChange={() => setSimplifiedMode(!simplifiedMode)} />
                <label className="small fw-bold">Simple Mode</label>
             </div>
             <div className="form-check form-switch d-inline-block">
                <input className="form-check-input" type="checkbox" onChange={() => setHighContrast(!highContrast)} />
                <label className="small fw-bold">High Contrast</label>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}