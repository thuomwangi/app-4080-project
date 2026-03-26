import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import {
  getProducts, getCart, saveCart, addToCart, updateCartQty, removeFromCart,
  CATEGORIES,
  type Product, type CartItem,
} from "./store";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [view, setView] = useState<"home" | "browse">("home");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const reload = useCallback(() => {
    setProducts(getProducts());
    setCart(getCart());
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
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

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const visible = products
    .filter(p =>
      (category === "All" || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.seller.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const featured = products.slice(0, 8);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const categoryIcons: Record<string, string> = {
    All: "🏪", Electronics: "💻", Books: "📚", Clothing: "👗",
    Furniture: "🛋️", "Study Gear": "✏️", Sports: "⚽", Food: "🍱",
    Services: "🔧", Other: "📦"
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --primary: #1a56f0;
          --primary-dark: #1040cc;
          --primary-light: #e8effe;
          --accent: #ff6b35;
          --accent-light: #fff0eb;
          --surface: #ffffff;
          --bg: #f5f7ff;
          --bg2: #eef1fc;
          --text: #0f1523;
          --text2: #4a5568;
          --text3: #8a94a6;
          --border: #e2e8f8;
          --shadow-sm: 0 2px 8px rgba(26,86,240,0.08);
          --shadow-md: 0 8px 32px rgba(26,86,240,0.12);
          --shadow-lg: 0 20px 60px rgba(26,86,240,0.16);
          --radius: 16px;
          --radius-sm: 10px;
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif;
        }

        body { font-family: var(--font-body); background: var(--bg); color: var(--text); }

        /* NAV */
        .cc-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 0 24px;
        }
        .cc-nav-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center;
          height: 68px; gap: 32px;
        }
        .cc-logo {
          font-family: var(--font-display); font-weight: 800; font-size: 20px;
          color: var(--primary); text-decoration: none;
          display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }
        .cc-logo-icon {
          width: 36px; height: 36px; background: var(--primary);
          border-radius: 10px; display: flex; align-items: center;
          justify-content: center; font-size: 18px;
        }
        .cc-nav-links {
          display: flex; gap: 4px; list-style: none; margin: 0;
        }
        .cc-nav-links a {
          padding: 8px 16px; border-radius: 8px;
          color: var(--text2); text-decoration: none;
          font-size: 15px; font-weight: 500; transition: all .2s;
        }
        .cc-nav-links a:hover, .cc-nav-links a.active {
          color: var(--primary); background: var(--primary-light);
        }
        .cc-nav-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
        .cc-search-bar {
          display: flex; align-items: center; gap: 8px;
          background: var(--bg); border: 1.5px solid var(--border);
          border-radius: 12px; padding: 8px 14px; width: 220px; transition: all .2s;
        }
        .cc-search-bar:focus-within {
          border-color: var(--primary); background: #fff;
          box-shadow: 0 0 0 3px rgba(26,86,240,0.1);
        }
        .cc-search-bar input {
          border: none; background: none; outline: none;
          font-family: var(--font-body); font-size: 14px; color: var(--text); width: 100%;
        }
        .cc-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 12px; font-family: var(--font-body);
          font-size: 14px; font-weight: 600; cursor: pointer;
          border: none; text-decoration: none; transition: all .2s; white-space: nowrap;
        }
        .cc-btn-primary { background: var(--primary); color: #fff; }
        .cc-btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: var(--shadow-md); }
        .cc-btn-ghost { background: transparent; color: var(--text2); border: 1.5px solid var(--border); }
        .cc-btn-ghost:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
        .cc-btn-accent { background: var(--accent); color: #fff; }
        .cc-btn-accent:hover { background: #e55a28; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,107,53,0.3); }
        .cc-cart-btn {
          position: relative; background: var(--bg); border: 1.5px solid var(--border);
          border-radius: 12px; padding: 10px 14px;
          cursor: pointer; display: flex; align-items: center; gap: 6px;
          font-family: var(--font-body); font-size: 14px; font-weight: 500; color: var(--text);
          transition: all .2s;
        }
        .cc-cart-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
        .cc-badge {
          position: absolute; top: -6px; right: -6px;
          background: var(--accent); color: #fff;
          font-size: 11px; font-weight: 700; min-width: 20px; height: 20px;
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          padding: 0 4px; border: 2px solid #fff;
        }

        /* HERO */
        .cc-hero {
          background: linear-gradient(135deg, #0f1523 0%, #1a2540 50%, #1a56f0 100%);
          padding: 80px 24px;
          position: relative; overflow: hidden;
        }
        .cc-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(26,86,240,0.4) 0%, transparent 70%);
          pointer-events: none;
        }
        .cc-hero::after {
          content: '';
          position: absolute; top: -40%; right: -10%;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .cc-hero-inner {
          max-width: 1280px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 64px;
          align-items: center; position: relative; z-index: 1;
        }
        .cc-hero-label {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,107,53,0.2); border: 1px solid rgba(255,107,53,0.4);
          border-radius: 100px; padding: 6px 14px;
          color: #ff9d7a; font-size: 13px; font-weight: 600; margin-bottom: 20px;
        }
        .cc-hero h1 {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(36px, 5vw, 60px); line-height: 1.05;
          color: #fff; margin-bottom: 20px;
        }
        .cc-hero h1 span { color: #ff6b35; }
        .cc-hero p {
          color: rgba(255,255,255,0.7); font-size: 17px; line-height: 1.7;
          margin-bottom: 36px; max-width: 440px;
        }
        .cc-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .cc-hero-stats {
          display: flex; gap: 32px; margin-top: 48px;
        }
        .cc-hero-stat-num {
          font-family: var(--font-display); font-size: 28px; font-weight: 800; color: #fff;
        }
        .cc-hero-stat-label { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 2px; }
        .cc-hero-visual {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
        }
        .cc-hero-card {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius); padding: 16px;
          backdrop-filter: blur(8px); transition: transform .3s;
          animation: floatCard 4s ease-in-out infinite;
        }
        .cc-hero-card:nth-child(2) { animation-delay: 1s; margin-top: 20px; }
        .cc-hero-card:nth-child(3) { animation-delay: 2s; }
        .cc-hero-card:nth-child(4) { animation-delay: 0.5s; margin-top: 20px; }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .cc-hero-card-emoji { font-size: 28px; margin-bottom: 8px; }
        .cc-hero-card-name { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px; }
        .cc-hero-card-price { font-size: 15px; font-weight: 700; color: #ff6b35; }

        /* SECTIONS */
        .cc-section { padding: 72px 24px; }
        .cc-section-inner { max-width: 1280px; margin: 0 auto; }
        .cc-section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 40px;
        }
        .cc-section-label {
          font-size: 12px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: var(--primary); margin-bottom: 8px;
        }
        .cc-section-title {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(24px, 3vw, 36px); color: var(--text); line-height: 1.1;
        }
        .cc-view-all {
          display: flex; align-items: center; gap: 6px;
          color: var(--primary); font-weight: 600; font-size: 14px;
          text-decoration: none; padding: 8px 16px;
          border-radius: 8px; transition: all .2s;
        }
        .cc-view-all:hover { background: var(--primary-light); }

        /* CATEGORIES */
        .cc-cats { background: #fff; }
        .cc-cats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }
        .cc-cat-card {
          background: var(--bg); border: 1.5px solid var(--border);
          border-radius: var(--radius); padding: 24px 16px;
          text-align: center; cursor: pointer;
          transition: all .25s; text-decoration: none;
        }
        .cc-cat-card:hover, .cc-cat-card.active {
          background: var(--primary); border-color: var(--primary);
          transform: translateY(-4px); box-shadow: var(--shadow-md);
        }
        .cc-cat-card:hover .cc-cat-emoji, .cc-cat-card.active .cc-cat-emoji { transform: scale(1.2); }
        .cc-cat-card:hover .cc-cat-name, .cc-cat-card.active .cc-cat-name { color: #fff; }
        .cc-cat-card:hover .cc-cat-count, .cc-cat-card.active .cc-cat-count { color: rgba(255,255,255,0.7); }
        .cc-cat-emoji { font-size: 32px; margin-bottom: 10px; display: block; transition: transform .25s; }
        .cc-cat-name { font-weight: 700; font-size: 14px; color: var(--text); display: block; margin-bottom: 4px; }
        .cc-cat-count { font-size: 12px; color: var(--text3); display: block; }

        /* PRODUCT GRID */
        .cc-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }
        .cc-product-card {
          background: #fff; border-radius: var(--radius);
          border: 1.5px solid var(--border); overflow: hidden;
          transition: all .25s; cursor: pointer;
          display: flex; flex-direction: column;
        }
        .cc-product-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: transparent;
        }
        .cc-product-img {
          height: 200px; background: var(--bg);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .cc-product-img img {
          width: 100%; height: 100%; object-fit: cover; transition: transform .4s;
        }
        .cc-product-card:hover .cc-product-img img { transform: scale(1.06); }
        .cc-product-img-emoji { font-size: 72px; }
        .cc-product-tag {
          position: absolute; top: 10px; left: 10px;
          padding: 4px 10px; border-radius: 100px;
          font-size: 11px; font-weight: 700; letter-spacing: .5px;
          text-transform: uppercase;
        }
        .cc-tag-primary { background: var(--primary); color: #fff; }
        .cc-tag-accent { background: var(--accent); color: #fff; }
        .cc-tag-warning { background: #f59e0b; color: #fff; }
        .cc-tag-danger { background: #ef4444; color: #fff; }
        .cc-product-wishlist {
          position: absolute; top: 10px; right: 10px;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,0.9); border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 16px; transition: all .2s;
          backdrop-filter: blur(4px);
        }
        .cc-product-wishlist:hover { background: #fff; transform: scale(1.1); }
        .cc-product-body { padding: 16px; flex: 1; display: flex; flex-direction: column; }
        .cc-product-category {
          font-size: 11px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; color: var(--primary); margin-bottom: 6px;
        }
        .cc-product-name {
          font-family: var(--font-display); font-weight: 700; font-size: 15px;
          color: var(--text); line-height: 1.3; margin-bottom: 6px;
          text-decoration: none; display: block;
        }
        .cc-product-desc {
          font-size: 13px; color: var(--text3); line-height: 1.5; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 12px;
        }
        .cc-product-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 12px; border-top: 1px solid var(--border); margin-top: auto;
        }
        .cc-product-price {
          font-family: var(--font-display); font-weight: 800; font-size: 20px; color: var(--primary);
        }
        .cc-product-seller { font-size: 12px; color: var(--text3); margin-top: 2px; }
        .cc-add-btn {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--primary); color: #fff;
          border: none; cursor: pointer; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s; flex-shrink: 0;
        }
        .cc-add-btn:hover { background: var(--primary-dark); transform: scale(1.1); box-shadow: var(--shadow-md); }
        .cc-add-btn:disabled { background: var(--border); color: var(--text3); cursor: not-allowed; transform: none; }
        .cc-qty-ctrl {
          display: flex; align-items: center; gap: 6px;
        }
        .cc-qty-btn {
          width: 30px; height: 30px; border-radius: 8px;
          border: 1.5px solid var(--border); background: #fff;
          cursor: pointer; font-size: 16px; display: flex; align-items: center;
          justify-content: center; transition: all .2s; color: var(--text);
        }
        .cc-qty-btn:hover { border-color: var(--primary); color: var(--primary); }
        .cc-qty-num { font-weight: 700; font-size: 14px; min-width: 20px; text-align: center; }

        /* BROWSE FILTERS */
        .cc-filters {
          background: #fff; border-radius: var(--radius);
          border: 1.5px solid var(--border);
          padding: 20px; margin-bottom: 24px;
          display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
        }
        .cc-filter-input {
          flex: 1; min-width: 200px;
          display: flex; align-items: center; gap: 8px;
          background: var(--bg); border: 1.5px solid var(--border);
          border-radius: 12px; padding: 10px 14px; transition: all .2s;
        }
        .cc-filter-input:focus-within {
          border-color: var(--primary); background: #fff;
          box-shadow: 0 0 0 3px rgba(26,86,240,0.1);
        }
        .cc-filter-input input {
          border: none; background: none; outline: none;
          font-family: var(--font-body); font-size: 14px; color: var(--text); width: 100%;
        }
        .cc-select {
          padding: 10px 14px; border-radius: 12px;
          border: 1.5px solid var(--border); background: var(--bg);
          font-family: var(--font-body); font-size: 14px; color: var(--text);
          cursor: pointer; outline: none; transition: all .2s;
        }
        .cc-select:focus { border-color: var(--primary); background: #fff; }
        .cc-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .cc-pill {
          padding: 6px 16px; border-radius: 100px;
          border: 1.5px solid var(--border); background: #fff;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all .2s; color: var(--text2); font-family: var(--font-body);
        }
        .cc-pill:hover { border-color: var(--primary); color: var(--primary); }
        .cc-pill.active { background: var(--primary); border-color: var(--primary); color: #fff; }

        /* CART DRAWER */
        .cc-cart-overlay {
          position: fixed; inset: 0; z-index: 200;
        }
        .cc-cart-bg {
          position: absolute; inset: 0; background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px); animation: fadeIn .25s;
        }
        .cc-cart-drawer {
          position: absolute; top: 0; right: 0; height: 100%;
          width: min(440px, 100vw);
          background: #fff; display: flex; flex-direction: column;
          animation: slideIn .3s cubic-bezier(0.32, 0.72, 0, 1);
          box-shadow: -20px 0 60px rgba(0,0,0,0.2);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .cc-cart-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px; border-bottom: 1px solid var(--border);
        }
        .cc-cart-title {
          font-family: var(--font-display); font-weight: 800; font-size: 20px;
        }
        .cc-cart-close {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--bg); border: none; cursor: pointer; font-size: 18px;
          display: flex; align-items: center; justify-content: center; transition: all .2s;
        }
        .cc-cart-close:hover { background: #fee2e2; color: #ef4444; }
        .cc-cart-body { flex: 1; overflow-y: auto; padding: 16px; }
        .cc-cart-item {
          display: flex; gap: 12px; align-items: center;
          border: 1.5px solid var(--border); border-radius: var(--radius-sm);
          padding: 12px; margin-bottom: 10px; transition: border-color .2s;
        }
        .cc-cart-item:hover { border-color: var(--primary); }
        .cc-cart-item-img {
          width: 56px; height: 56px; border-radius: 10px;
          background: var(--bg); flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; overflow: hidden;
        }
        .cc-cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .cc-cart-item-name { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
        .cc-cart-item-price { color: var(--primary); font-weight: 700; font-size: 14px; }
        .cc-cart-item-controls { margin-left: auto; display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .cc-cart-remove {
          background: none; border: none; cursor: pointer;
          color: var(--text3); font-size: 16px; padding: 4px; transition: color .2s;
        }
        .cc-cart-remove:hover { color: #ef4444; }
        .cc-cart-footer { padding: 20px; border-top: 1.5px solid var(--border); }
        .cc-cart-total {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 16px;
        }
        .cc-cart-total-label { color: var(--text2); font-size: 15px; }
        .cc-cart-total-amount {
          font-family: var(--font-display); font-weight: 800; font-size: 24px; color: var(--primary);
        }

        /* CTA BANNER */
        .cc-cta {
          background: linear-gradient(135deg, var(--primary) 0%, #6c3fc5 100%);
          border-radius: 24px; padding: 56px 48px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: center; position: relative; overflow: hidden;
        }
        .cc-cta::before {
          content: '';
          position: absolute; top: -50%; right: 10%;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
        }
        .cc-cta h2 {
          font-family: var(--font-display); font-weight: 800; font-size: 36px;
          color: #fff; line-height: 1.1; margin-bottom: 12px;
        }
        .cc-cta p { color: rgba(255,255,255,0.75); font-size: 16px; line-height: 1.6; }
        .cc-cta-features { display: flex; gap: 16px; margin-top: 24px; flex-wrap: wrap; }
        .cc-cta-feature {
          display: flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;
        }
        .cc-cta-check {
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(255,255,255,0.2); display: flex;
          align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;
        }
        .cc-cta-right { display: flex; flex-direction: column; gap: 12px; }
        .cc-cta-card {
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px; padding: 20px; backdrop-filter: blur(8px);
          display: flex; align-items: center; gap: 16px; color: #fff;
        }
        .cc-cta-card-icon { font-size: 32px; }
        .cc-cta-card-title { font-weight: 700; font-size: 15px; margin-bottom: 2px; }
        .cc-cta-card-desc { font-size: 13px; opacity: .7; }

        /* FOOTER */
        .cc-footer {
          background: var(--text); padding: 60px 24px 32px;
        }
        .cc-footer-inner { max-width: 1280px; margin: 0 auto; }
        .cc-footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px; margin-bottom: 48px;
        }
        .cc-footer-brand { font-family: var(--font-display); font-weight: 800; font-size: 22px; color: #fff; margin-bottom: 12px; }
        .cc-footer-tagline { color: rgba(255,255,255,0.4); font-size: 14px; line-height: 1.6; }
        .cc-footer-col-title { color: rgba(255,255,255,0.6); font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px; }
        .cc-footer-col a { display: block; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; margin-bottom: 10px; transition: color .2s; }
        .cc-footer-col a:hover { color: #fff; }
        .cc-footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; }
        .cc-footer-copy { color: rgba(255,255,255,0.3); font-size: 13px; }

        /* EMPTY STATE */
        .cc-empty { text-align: center; padding: 80px 24px; }
        .cc-empty-icon { font-size: 72px; margin-bottom: 16px; }
        .cc-empty-title { font-family: var(--font-display); font-weight: 700; font-size: 22px; margin-bottom: 8px; }
        .cc-empty-sub { color: var(--text3); margin-bottom: 24px; }

        /* TOAST */
        .cc-toast {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          background: var(--text); color: #fff; padding: 14px 24px;
          border-radius: 100px; font-size: 14px; font-weight: 500;
          box-shadow: var(--shadow-lg); z-index: 9999; white-space: nowrap;
          animation: toastIn .3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex; align-items: center; gap: 8px;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.9); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        .cc-toast-check {
          width: 20px; height: 20px; border-radius: 50%;
          background: #22c55e; display: flex; align-items: center; justify-content: center; font-size: 11px;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .cc-hero-inner { grid-template-columns: 1fr; }
          .cc-hero-visual { display: none; }
          .cc-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .cc-cta { grid-template-columns: 1fr; }
          .cc-hero { padding: 56px 24px; }
          .cc-nav-links { display: none; }
          .cc-search-bar { display: none; }
        }

        /* SOLD OUT OVERLAY */
        .cc-sold-out-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="cc-nav">
        <div className="cc-nav-inner">
          <a href="#" className="cc-logo" onClick={() => setView("home")}>
            <div className="cc-logo-icon">🛒</div>
            CampusCart
          </a>
          <ul className="cc-nav-links">
            <li><a href="#" className={view === "home" ? "active" : ""} onClick={() => setView("home")}>Home</a></li>
            <li><a href="#" className={view === "browse" ? "active" : ""} onClick={() => setView("browse")}>Products</a></li>
            <li><Link to="/seller-dashboard">Sell</Link></li>
          </ul>
          <div className="cc-nav-right">
            <div className="cc-search-bar">
              <span style={{ color: "var(--text3)" }}>🔍</span>
              <input
                placeholder="Search products…"
                value={search}
                onChange={e => { setSearch(e.target.value); setView("browse"); }}
              />
            </div>
            <button className="cc-cart-btn" onClick={() => setShowCart(true)}>
              🛒 Cart
              {count > 0 && <span className="cc-badge">{count}</span>}
            </button>
            <Link to="/login" className="cc-btn cc-btn-primary" style={{ padding: "10px 18px", borderRadius: 12 }}>Sign In</Link>
          </div>
        </div>
      </nav>

      {view === "home" ? (
        <>
          {/* ── HERO ── */}
          <section className="cc-hero">
            <div className="cc-hero-inner">
              <div>
                <div className="cc-hero-label">
                  <span>✨</span> Student Marketplace
                </div>
                <h1>Discover &<br /><span>Sell Campus</span><br />Treasures</h1>
                <p>Your one-stop marketplace for campus essentials. Buy and sell with fellow students safely and easily.</p>
                <div className="cc-hero-btns">
                  <button className="cc-btn cc-btn-primary" style={{ padding: "14px 28px", fontSize: 15, borderRadius: 14 }}
                    onClick={() => setView("browse")}>
                    Shop Now →
                  </button>
                  <Link to="/seller-dashboard" className="cc-btn"
                    style={{ padding: "14px 28px", fontSize: 15, borderRadius: 14, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)" }}>
                    Start Selling
                  </Link>
                </div>
                <div className="cc-hero-stats">
                  <div>
                    <div className="cc-hero-stat-num">2.4K+</div>
                    <div className="cc-hero-stat-label">Active Listings</div>
                  </div>
                  <div>
                    <div className="cc-hero-stat-num">840+</div>
                    <div className="cc-hero-stat-label">Students</div>
                  </div>
                  <div>
                    <div className="cc-hero-stat-num">98%</div>
                    <div className="cc-hero-stat-label">Happy Buyers</div>
                  </div>
                </div>
              </div>
              <div className="cc-hero-visual">
                {featured.slice(0, 4).map((p, i) => (
                  <div className="cc-hero-card" key={p.id || i}>
                    <div className="cc-hero-card-emoji">{p.emoji || "📦"}</div>
                    <div className="cc-hero-card-name">{p.name}</div>
                    <div className="cc-hero-card-price">KSh {p.price?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CATEGORIES ── */}
          <section className="cc-section cc-cats">
            <div className="cc-section-inner">
              <div className="cc-section-header">
                <div>
                  <div className="cc-section-label">Browse By</div>
                  <div className="cc-section-title">Explore Categories</div>
                </div>
              </div>
              <div className="cc-cats-grid">
                {CATEGORIES.filter(c => c !== "All").map(c => {
                  const count = products.filter(p => p.category === c).length;
                  return (
                    <div
                      key={c}
                      className={`cc-cat-card ${category === c ? "active" : ""}`}
                      onClick={() => { setCategory(c); setView("browse"); }}
                    >
                      <span className="cc-cat-emoji">{categoryIcons[c] || "📦"}</span>
                      <span className="cc-cat-name">{c}</span>
                      <span className="cc-cat-count">{count} items</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── FEATURED PRODUCTS ── */}
          <section className="cc-section" style={{ background: "var(--bg)" }}>
            <div className="cc-section-inner">
              <div className="cc-section-header">
                <div>
                  <div className="cc-section-label">Handpicked For You</div>
                  <div className="cc-section-title">Featured Products</div>
                </div>
                <a href="#" className="cc-view-all" onClick={() => setView("browse")}>
                  View All →
                </a>
              </div>
              <div className="cc-products-grid">
                {featured.map(p => {
                  const inCart = cart.find(i => i.id === p.id);
                  return (
                    <div className="cc-product-card" key={p.id}>
                      <div className="cc-product-img">
                        {p.image
                          ? <img src={p.image} alt={p.name} />
                          : <span className="cc-product-img-emoji">{p.emoji}</span>
                        }
                        {p.tag && <span className={`cc-product-tag cc-tag-primary`}>{p.tag}</span>}
                        {p.stock <= 3 && p.stock > 0 && (
                          <span className="cc-product-tag cc-tag-warning" style={{ left: "auto", right: 10 }}>
                            Only {p.stock} left
                          </span>
                        )}
                        {p.stock === 0 && (
                          <div className="cc-sold-out-overlay">
                            <span className="cc-product-tag cc-tag-danger">Sold Out</span>
                          </div>
                        )}
                        <button
                          className="cc-product-wishlist"
                          onClick={() => toggleWishlist(p.id)}
                          title={wishlist.includes(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          {wishlist.includes(p.id) ? "❤️" : "🤍"}
                        </button>
                      </div>
                      <div className="cc-product-body">
                        <div className="cc-product-category">{p.category}</div>
                        <Link to={`/products/${p.id}`} className="cc-product-name">{p.name}</Link>
                        <p className="cc-product-desc">{p.description}</p>
                        <div className="cc-product-footer">
                          <div>
                            <div className="cc-product-price">KSh {p.price.toLocaleString()}</div>
                            <div className="cc-product-seller">@{p.seller}</div>
                          </div>
                          {inCart ? (
                            <div className="cc-qty-ctrl">
                              <button className="cc-qty-btn" onClick={() => handleQty(p.id, -1)}>−</button>
                              <span className="cc-qty-num">{inCart.qty}</span>
                              <button className="cc-qty-btn" onClick={() => handleQty(p.id, +1)}>+</button>
                            </div>
                          ) : (
                            <button className="cc-add-btn" disabled={p.stock === 0} onClick={() => handleAdd(p)}>+</button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── CTA BANNER ── */}
          <section className="cc-section" style={{ background: "#fff" }}>
            <div className="cc-section-inner">
              <div className="cc-cta">
                <div>
                  <h2>CampusCart:<br />Connect. Buy. Sell.</h2>
                  <p>Join thousands of students buying and selling on campus. Whether you're a buyer or seller, we've got you covered.</p>
                  <div className="cc-cta-features">
                    {["Safe & Secure", "Student Verified", "Instant Listings", "Free to Join"].map(f => (
                      <div className="cc-cta-feature" key={f}>
                        <div className="cc-cta-check">✓</div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="cc-cta-right">
                  <div className="cc-cta-card">
                    <div className="cc-cta-card-icon">🛍️</div>
                    <div>
                      <div className="cc-cta-card-title">For Buyers</div>
                      <div className="cc-cta-card-desc">Find great deals on campus essentials from fellow students.</div>
                    </div>
                  </div>
                  <div className="cc-cta-card">
                    <div className="cc-cta-card-icon">🏪</div>
                    <div>
                      <div className="cc-cta-card-title">For Sellers</div>
                      <div className="cc-cta-card-desc">Turn your unused items into cash. Reach buyers instantly.</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button className="cc-btn" onClick={() => setView("browse")}
                      style={{ flex: 1, justifyContent: "center", background: "#fff", color: "var(--primary)", borderRadius: 12, padding: "12px 20px" }}>
                      Browse Products
                    </button>
                    <Link to="/seller-dashboard" className="cc-btn cc-btn-accent"
                      style={{ flex: 1, justifyContent: "center", borderRadius: 12, padding: "12px 20px" }}>
                      Start Selling
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="cc-footer">
            <div className="cc-footer-inner">
              <div className="cc-footer-grid">
                <div>
                  <div className="cc-footer-brand">🛒 CampusCart</div>
                  <div className="cc-footer-tagline">Connect. Buy. Sell. The ultimate campus marketplace for university students.</div>
                </div>
                <div className="cc-footer-col">
                  <div className="cc-footer-col-title">Quick Links</div>
                  <a href="#" onClick={() => setView("browse")}>Browse Products</a>
                  <Link to="/seller-dashboard">Sell Items</Link>
                  <Link to="/login">My Account</Link>
                </div>
                <div className="cc-footer-col">
                  <div className="cc-footer-col-title">Categories</div>
                  {["Electronics", "Books", "Clothing", "Furniture"].map(c => (
                    <a key={c} href="#" onClick={() => { setCategory(c); setView("browse"); }}>{c}</a>
                  ))}
                </div>
                <div className="cc-footer-col">
                  <div className="cc-footer-col-title">Support</div>
                  <a href="#">Help Center</a>
                  <a href="#">Safety Tips</a>
                  <a href="#">Contact Us</a>
                </div>
              </div>
              <div className="cc-footer-bottom">
                <div className="cc-footer-copy">© 2026 CampusCart. All rights reserved.</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <a href="#" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textDecoration: "none" }}>Privacy</a>
                  <a href="#" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textDecoration: "none" }}>Terms</a>
                </div>
              </div>
            </div>
          </footer>
        </>
      ) : (
        /* ── BROWSE VIEW ── */
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ marginBottom: 24 }}>
            <div className="cc-section-label">All Products</div>
            <h1 className="cc-section-title">Browse Products</h1>
            <p style={{ color: "var(--text3)", marginTop: 6 }}>{visible.length} item{visible.length !== 1 ? "s" : ""} found</p>
          </div>

          <div className="cc-filters">
            <div className="cc-filter-input">
              <span style={{ color: "var(--text3)" }}>🔍</span>
              <input
                placeholder="Search products, sellers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>✕</button>}
            </div>
            <select className="cc-select" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="cc-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>

          <div className="cc-pills">
            {CATEGORIES.map(c => (
              <button key={c} className={`cc-pill ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
                {categoryIcons[c] || ""} {c}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="cc-empty">
              <div className="cc-empty-icon">🔍</div>
              <div className="cc-empty-title">No products found</div>
              <div className="cc-empty-sub">Try a different search or category</div>
              <button className="cc-btn cc-btn-primary" onClick={() => { setSearch(""); setCategory("All"); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="cc-products-grid">
              {visible.map(p => {
                const inCart = cart.find(i => i.id === p.id);
                return (
                  <div className="cc-product-card" key={p.id}>
                    <div className="cc-product-img">
                      {p.image
                        ? <img src={p.image} alt={p.name} />
                        : <span className="cc-product-img-emoji">{p.emoji}</span>
                      }
                      {p.tag && <span className="cc-product-tag cc-tag-primary">{p.tag}</span>}
                      {p.stock <= 3 && p.stock > 0 && (
                        <span className="cc-product-tag cc-tag-warning" style={{ left: "auto", right: 10 }}>
                          Only {p.stock} left
                        </span>
                      )}
                      {p.stock === 0 && (
                        <div className="cc-sold-out-overlay">
                          <span className="cc-product-tag cc-tag-danger">Sold Out</span>
                        </div>
                      )}
                      <button className="cc-product-wishlist" onClick={() => toggleWishlist(p.id)}>
                        {wishlist.includes(p.id) ? "❤️" : "🤍"}
                      </button>
                    </div>
                    <div className="cc-product-body">
                      <div className="cc-product-category">{p.category}</div>
                      <Link to={`/products/${p.id}`} className="cc-product-name">{p.name}</Link>
                      <p className="cc-product-desc">{p.description}</p>
                      <div className="cc-product-footer">
                        <div>
                          <div className="cc-product-price">KSh {p.price.toLocaleString()}</div>
                          <div className="cc-product-seller">@{p.seller}</div>
                        </div>
                        {inCart ? (
                          <div className="cc-qty-ctrl">
                            <button className="cc-qty-btn" onClick={() => handleQty(p.id, -1)}>−</button>
                            <span className="cc-qty-num">{inCart.qty}</span>
                            <button className="cc-qty-btn" onClick={() => handleQty(p.id, +1)}>+</button>
                          </div>
                        ) : (
                          <button className="cc-add-btn" disabled={p.stock === 0} onClick={() => handleAdd(p)}>+</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── CART DRAWER ── */}
      {showCart && (
        <div className="cc-cart-overlay">
          <div className="cc-cart-bg" onClick={() => setShowCart(false)} />
          <div className="cc-cart-drawer">
            <div className="cc-cart-header">
              <div className="cc-cart-title">🛒 Your Cart {count > 0 && <span style={{ color: "var(--text3)", fontWeight: 400, fontSize: 16 }}>({count} items)</span>}</div>
              <button className="cc-cart-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            <div className="cc-cart-body">
              {cart.length === 0 ? (
                <div className="cc-empty" style={{ padding: "60px 24px" }}>
                  <div className="cc-empty-icon">🛒</div>
                  <div className="cc-empty-title">Your cart is empty</div>
                  <div className="cc-empty-sub">Start browsing to add items</div>
                  <button className="cc-btn cc-btn-primary" onClick={() => { setShowCart(false); setView("browse"); }}>
                    Browse Products
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div className="cc-cart-item" key={item.id}>
                    <div className="cc-cart-item-img">
                      {item.image ? <img src={item.image} alt={item.name} /> : item.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="cc-cart-item-name">{item.name}</div>
                      <div className="cc-cart-item-price">KSh {item.price.toLocaleString()}</div>
                    </div>
                    <div className="cc-cart-item-controls">
                      <button className="cc-qty-btn" onClick={() => handleQty(item.id, -1)}>−</button>
                      <span className="cc-qty-num">{item.qty}</span>
                      <button className="cc-qty-btn" onClick={() => handleQty(item.id, +1)}>+</button>
                      <button className="cc-cart-remove" onClick={() => handleRemove(item.id)}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cc-cart-footer">
                <div className="cc-cart-total">
                  <span className="cc-cart-total-label">Total ({count} items)</span>
                  <span className="cc-cart-total-amount">KSh {total.toLocaleString()}</span>
                </div>
                <button className="cc-btn cc-btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "14px", borderRadius: 14, fontSize: 15, marginBottom: 10 }}
                  onClick={() => { setShowCart(false); navigate("/checkout"); }}>
                  Proceed to Checkout →
                </button>
                <button className="cc-btn cc-btn-ghost"
                  style={{ width: "100%", justifyContent: "center", padding: "11px", borderRadius: 14, fontSize: 14 }}
                  onClick={handleClearCart}>
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="cc-toast">
          <div className="cc-toast-check">✓</div>
          {toast}
        </div>
      )}
    </>
  );
}