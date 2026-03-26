import { useState, useRef } from "react";
import { Link } from "react-router";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Listing {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "sold" | "draft";
  emoji: string;
  views: number;
  sales: number;
  createdAt: string;
}

interface Order {
  id: string;
  buyer: string;
  item: string;
  amount: number;
  status: "pending" | "confirmed" | "delivered";
  date: string;
  emoji: string;
}

const CATEGORIES = ["Electronics", "Books", "Clothing", "Furniture", "Study Gear", "Sports", "Food", "Services", "Other"];

const SAMPLE_LISTINGS: Listing[] = [
  { id: "1", name: "Engineering Textbook Set", category: "Books", price: 2500, stock: 3, status: "active", emoji: "📚", views: 142, sales: 4, createdAt: "2026-03-10" },
  { id: "2", name: "Laptop Stand – Aluminium", category: "Electronics", price: 1800, stock: 1, status: "active", emoji: "💻", views: 89, sales: 2, createdAt: "2026-03-12" },
  { id: "3", name: "Campus Hoodie (M/L)", category: "Clothing", price: 1200, stock: 0, status: "sold", emoji: "👕", views: 310, sales: 8, createdAt: "2026-03-01" },
  { id: "4", name: "Scientific Calculator", category: "Electronics", price: 950, stock: 5, status: "active", emoji: "🔢", views: 66, sales: 1, createdAt: "2026-03-14" },
  { id: "5", name: "Mini Desk Lamp", category: "Study Gear", price: 650, stock: 2, status: "draft", emoji: "💡", views: 0, sales: 0, createdAt: "2026-03-20" },
];

const SAMPLE_ORDERS: Order[] = [
  { id: "ORD-001", buyer: "alice_k", item: "Engineering Textbook Set", amount: 2500, status: "confirmed", date: "2026-03-24", emoji: "📚" },
  { id: "ORD-002", buyer: "brian_m", item: "Laptop Stand – Aluminium", amount: 1800, status: "pending", date: "2026-03-25", emoji: "💻" },
  { id: "ORD-003", buyer: "carol_n", item: "Campus Hoodie (M/L)", amount: 1200, status: "delivered", date: "2026-03-18", emoji: "👕" },
  { id: "ORD-004", buyer: "david_o", item: "Scientific Calculator", amount: 950, status: "pending", date: "2026-03-26", emoji: "🔢" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const [tab, setTab] = useState<"overview" | "listings" | "orders" | "add">("overview");
  const [listings, setListings] = useState<Listing[]>(SAMPLE_LISTINGS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "sold" | "draft">("all");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Listing | null>(null);

  // New listing form state
  const [form, setForm] = useState({ name: "", category: "Electronics", price: "", stock: "", description: "", emoji: "📦" });
  const [formError, setFormError] = useState("");

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleAddListing = () => {
    if (!form.name.trim()) return setFormError("Product name is required.");
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) return setFormError("Enter a valid price.");
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) return setFormError("Enter a valid stock quantity.");
    setFormError("");
    const newListing: v = {
      id: Date.now().toString(),
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      status: "active",
      emoji: form.emoji,
      views: 0,
      sales: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setListings(prev => [newListing, ...prev]);
    setForm({ name: "", category: "Electronics", price: "", stock: "", description: "", emoji: "📦" });
    notify("Listing published successfully! 🎉");
    setTab("listings");
  };

  const handleDelete = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    setDeleteConfirm(null);
    notify("Listing removed.", "error");
  };

  const handleOrderStatus = (id: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    notify(`Order marked as ${status}.`);
  };

  const filteredListings = listings.filter(l => filterStatus === "all" || l.status === filterStatus);
  const totalRevenue = listings.reduce((s, l) => s + l.price * l.sales, 0);
  const totalSales = listings.reduce((s, l) => s + l.sales, 0);
  const totalViews = listings.reduce((s, l) => s + l.views, 0);
  const activeCount = listings.filter(l => l.status === "active").length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;

  const EMOJIS = ["📦", "📚", "💻", "👕", "🔢", "💡", "🛋️", "⚽", "🎒", "🖊️", "🍱", "🔧", "🎧", "📱", "🖥️"];

  const statusColor: Record<string, string> = {
    active: "#22c55e", sold: "#94a3b8", draft: "#f59e0b",
    pending: "#f59e0b", confirmed: "#3b82f6", delivered: "#22c55e",
  };
  const statusBg: Record<string, string> = {
    active: "#f0fdf4", sold: "#f1f5f9", draft: "#fffbeb",
    pending: "#fffbeb", confirmed: "#eff6ff", delivered: "#f0fdf4",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --primary: #1a56f0; --primary-dark: #1040cc; --primary-light: #e8effe;
          --accent: #ff6b35; --accent-light: #fff0eb;
          --surface: #ffffff; --bg: #f5f7ff; --bg2: #eef1fc;
          --text: #0f1523; --text2: #4a5568; --text3: #8a94a6;
          --border: #e2e8f8; --success: #22c55e; --warning: #f59e0b; --danger: #ef4444;
          --shadow-sm: 0 2px 8px rgba(26,86,240,0.08);
          --shadow-md: 0 8px 32px rgba(26,86,240,0.12);
          --shadow-lg: 0 20px 60px rgba(26,86,240,0.16);
          --radius: 16px; --radius-sm: 10px;
          --font-display: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
        }
        body { font-family: var(--font-body); background: var(--bg); color: var(--text); }

        /* ── NAV ── */
        .sd-nav {
          background: rgba(255,255,255,0.92); backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 0 24px; position: sticky; top: 0; z-index: 100;
        }
        .sd-nav-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; height: 68px; gap: 24px;
        }
        .sd-logo {
          font-family: var(--font-display); font-weight: 800; font-size: 20px;
          color: var(--primary); text-decoration: none;
          display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }
        .sd-logo-icon {
          width: 36px; height: 36px; background: var(--primary); border-radius: 10px;
          display: flex; align-items: center; justify-content: center; font-size: 18px;
        }
        .sd-nav-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--primary-light); border: 1px solid rgba(26,86,240,0.2);
          border-radius: 100px; padding: 6px 14px;
          color: var(--primary); font-size: 13px; font-weight: 700;
        }
        .sd-nav-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
        .sd-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 12px; font-family: var(--font-body);
          font-size: 14px; font-weight: 600; cursor: pointer;
          border: none; text-decoration: none; transition: all .2s;
        }
        .sd-btn-primary { background: var(--primary); color: #fff; }
        .sd-btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: var(--shadow-md); }
        .sd-btn-ghost { background: transparent; color: var(--text2); border: 1.5px solid var(--border); }
        .sd-btn-ghost:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
        .sd-btn-danger { background: #fee2e2; color: var(--danger); border: 1.5px solid #fecaca; }
        .sd-btn-danger:hover { background: var(--danger); color: #fff; }
        .sd-btn-sm { padding: 7px 14px; font-size: 13px; border-radius: 9px; }
        .sd-btn-accent { background: var(--accent); color: #fff; }
        .sd-btn-accent:hover { background: #e55a28; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,107,53,0.3); }

        /* ── LAYOUT ── */
        .sd-layout { max-width: 1280px; margin: 0 auto; padding: 32px 24px; display: grid; grid-template-columns: 240px 1fr; gap: 28px; }
        @media (max-width: 900px) { .sd-layout { grid-template-columns: 1fr; } .sd-sidebar { display: none; } }

        /* ── SIDEBAR ── */
        .sd-sidebar { display: flex; flex-direction: column; gap: 8px; }
        .sd-sidebar-section { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); padding: 4px 12px; margin-top: 8px; }
        .sd-nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: var(--radius-sm);
          cursor: pointer; border: none; background: none;
          font-family: var(--font-body); font-size: 14px; font-weight: 500;
          color: var(--text2); transition: all .2s; width: 100%; text-align: left;
        }
        .sd-nav-item:hover { background: var(--primary-light); color: var(--primary); }
        .sd-nav-item.active { background: var(--primary); color: #fff; font-weight: 600; }
        .sd-nav-item-icon { font-size: 18px; width: 22px; text-align: center; flex-shrink: 0; }
        .sd-nav-item-badge {
          margin-left: auto; background: var(--accent); color: #fff;
          font-size: 11px; font-weight: 700; min-width: 20px; height: 20px;
          border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 0 6px;
        }
        .sd-nav-item.active .sd-nav-item-badge { background: rgba(255,255,255,0.3); }

        /* ── SELLER PROFILE CARD ── */
        .sd-profile-card {
          background: linear-gradient(135deg, var(--primary) 0%, #1040cc 100%);
          border-radius: var(--radius); padding: 20px; color: #fff; margin-bottom: 8px;
          position: relative; overflow: hidden;
        }
        .sd-profile-card::after {
          content: ''; position: absolute; top: -20px; right: -20px;
          width: 100px; height: 100px; border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }
        .sd-profile-avatar {
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255,255,255,0.2); display: flex;
          align-items: center; justify-content: center; font-size: 24px;
          margin-bottom: 12px; border: 2px solid rgba(255,255,255,0.3);
        }
        .sd-profile-name { font-family: var(--font-display); font-weight: 700; font-size: 15px; margin-bottom: 2px; }
        .sd-profile-sub { font-size: 12px; opacity: .7; margin-bottom: 12px; }
        .sd-profile-stats { display: flex; gap: 16px; }
        .sd-profile-stat-num { font-family: var(--font-display); font-weight: 700; font-size: 18px; }
        .sd-profile-stat-label { font-size: 11px; opacity: .6; }

        /* ── MAIN CONTENT ── */
        .sd-main { min-width: 0; }
        .sd-page-header { margin-bottom: 28px; }
        .sd-page-label { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--primary); margin-bottom: 6px; }
        .sd-page-title { font-family: var(--font-display); font-weight: 800; font-size: 28px; color: var(--text); }
        .sd-page-sub { color: var(--text3); font-size: 14px; margin-top: 4px; }

        /* ── STAT CARDS ── */
        .sd-stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px; }
        .sd-stat-card {
          background: #fff; border-radius: var(--radius); border: 1.5px solid var(--border);
          padding: 20px; transition: all .25s; cursor: default;
        }
        .sd-stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: transparent; }
        .sd-stat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 12px;
        }
        .sd-stat-num { font-family: var(--font-display); font-weight: 800; font-size: 26px; color: var(--text); margin-bottom: 4px; }
        .sd-stat-label { font-size: 13px; color: var(--text3); }
        .sd-stat-trend { font-size: 12px; font-weight: 600; margin-top: 6px; display: flex; align-items: center; gap: 4px; }

        /* ── TABLE ── */
        .sd-card { background: #fff; border-radius: var(--radius); border: 1.5px solid var(--border); overflow: hidden; }
        .sd-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; border-bottom: 1px solid var(--border);
        }
        .sd-card-title { font-family: var(--font-display); font-weight: 700; font-size: 16px; }
        .sd-card-sub { font-size: 13px; color: var(--text3); margin-top: 2px; }
        .sd-table { width: 100%; border-collapse: collapse; }
        .sd-table thead tr { background: var(--bg); }
        .sd-table th { padding: 12px 20px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); }
        .sd-table td { padding: 14px 20px; border-top: 1px solid var(--border); vertical-align: middle; font-size: 14px; }
        .sd-table tbody tr { transition: background .15s; }
        .sd-table tbody tr:hover { background: var(--bg); }
        .sd-table-product { display: flex; align-items: center; gap: 12px; }
        .sd-table-emoji { width: 40px; height: 40px; border-radius: 10px; background: var(--bg); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .sd-table-name { font-weight: 600; font-size: 14px; color: var(--text); }
        .sd-table-category { font-size: 12px; color: var(--text3); margin-top: 2px; }

        .sd-status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 100px; font-size: 12px; font-weight: 600;
        }
        .sd-status-dot { width: 6px; height: 6px; border-radius: 50%; }

        /* ── ACTIONS ── */
        .sd-actions { display: flex; gap: 6px; align-items: center; }

        /* ── FILTER BAR ── */
        .sd-filter-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .sd-filter-pill {
          padding: 6px 16px; border-radius: 100px; border: 1.5px solid var(--border);
          background: #fff; font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all .2s; color: var(--text2); font-family: var(--font-body);
        }
        .sd-filter-pill:hover { border-color: var(--primary); color: var(--primary); }
        .sd-filter-pill.active { background: var(--primary); border-color: var(--primary); color: #fff; }

        /* ── ADD LISTING FORM ── */
        .sd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 640px) { .sd-form-grid { grid-template-columns: 1fr; } }
        .sd-field { display: flex; flex-direction: column; gap: 6px; }
        .sd-field-full { grid-column: 1 / -1; }
        .sd-label { font-size: 13px; font-weight: 600; color: var(--text2); }
        .sd-input {
          padding: 11px 14px; border-radius: 12px;
          border: 1.5px solid var(--border); background: var(--bg);
          font-family: var(--font-body); font-size: 14px; color: var(--text);
          outline: none; transition: all .2s; width: 100%;
        }
        .sd-input:focus { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 3px rgba(26,86,240,0.1); }
        .sd-textarea { resize: vertical; min-height: 90px; }
        .sd-select { appearance: none; cursor: pointer; }
        .sd-emoji-picker { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
        .sd-emoji-opt {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--bg); border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; cursor: pointer; transition: all .2s;
        }
        .sd-emoji-opt:hover { border-color: var(--primary); transform: scale(1.1); }
        .sd-emoji-opt.selected { background: var(--primary-light); border-color: var(--primary); transform: scale(1.1); }
        .sd-form-error { color: var(--danger); font-size: 13px; display: flex; align-items: center; gap: 6px; padding: 10px 14px; background: #fee2e2; border-radius: 10px; }

        /* ── ACTIVITY FEED ── */
        .sd-activity { display: flex; flex-direction: column; gap: 0; }
        .sd-activity-item { display: flex; align-items: flex-start; gap: 14px; padding: 16px 24px; border-bottom: 1px solid var(--border); transition: background .15s; }
        .sd-activity-item:last-child { border-bottom: none; }
        .sd-activity-item:hover { background: var(--bg); }
        .sd-activity-dot { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .sd-activity-text { font-size: 14px; line-height: 1.5; }
        .sd-activity-time { font-size: 12px; color: var(--text3); margin-top: 2px; }

        /* ── OVERVIEW GRID ── */
        .sd-overview-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
        @media (max-width: 900px) { .sd-overview-grid { grid-template-columns: 1fr; } }

        /* ── REVENUE CHART (CSS only) ── */
        .sd-chart { padding: 20px 24px 8px; }
        .sd-chart-bars { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
        .sd-chart-bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
        .sd-chart-bar {
          width: 100%; background: var(--primary-light); border-radius: 6px 6px 0 0;
          transition: all .3s; position: relative; cursor: pointer;
        }
        .sd-chart-bar:hover { background: var(--primary); }
        .sd-chart-bar:hover .sd-chart-tooltip { opacity: 1; transform: translateY(-4px); }
        .sd-chart-tooltip {
          position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%) translateY(0);
          background: var(--text); color: #fff; font-size: 11px; font-weight: 600;
          padding: 4px 8px; border-radius: 6px; white-space: nowrap; opacity: 0; transition: all .2s; pointer-events: none;
        }
        .sd-chart-label { font-size: 11px; color: var(--text3); }

        /* ── MODAL ── */
        .sd-modal-overlay { position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .sd-modal-bg { position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); animation: sdFadeIn .2s; }
        .sd-modal { position: relative; background: #fff; border-radius: 20px; width: 100%; max-width: 440px; padding: 28px; box-shadow: var(--shadow-lg); animation: sdSlideUp .3s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes sdFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sdSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .sd-modal-title { font-family: var(--font-display); font-weight: 800; font-size: 20px; margin-bottom: 8px; }
        .sd-modal-sub { color: var(--text3); font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
        .sd-modal-btns { display: flex; gap: 12px; margin-top: 24px; }

        /* ── TOAST ── */
        .sd-toast {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          padding: 13px 22px; border-radius: 100px; font-size: 14px; font-weight: 500;
          box-shadow: var(--shadow-lg); z-index: 9999; white-space: nowrap;
          display: flex; align-items: center; gap: 8px;
          animation: sdToastIn .3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .sd-toast.success { background: var(--text); color: #fff; }
        .sd-toast.error { background: #fee2e2; color: var(--danger); border: 1px solid #fecaca; }
        .sd-toast-icon { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; }
        .sd-toast.success .sd-toast-icon { background: #22c55e; }
        .sd-toast.error .sd-toast-icon { background: var(--danger); color: #fff; }
        @keyframes sdToastIn { from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.9); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }

        /* ── EMPTY STATE ── */
        .sd-empty { text-align: center; padding: 64px 24px; }
        .sd-empty-icon { font-size: 56px; margin-bottom: 14px; }
        .sd-empty-title { font-family: var(--font-display); font-weight: 700; font-size: 20px; margin-bottom: 6px; }
        .sd-empty-sub { color: var(--text3); font-size: 14px; margin-bottom: 20px; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="sd-nav">
        <div className="sd-nav-inner">
          <Link to="/" className="sd-logo">
            <div className="sd-logo-icon">🛒</div>
            CampusCart
          </Link>
          <div className="sd-nav-pill">🏪 Seller Mode</div>
          <div className="sd-nav-right">
            <Link to="/" className="sd-btn sd-btn-ghost" style={{ fontSize: 14, padding: "9px 16px", borderRadius: 11 }}>
              ← Back to Store
            </Link>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>
              👤
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN LAYOUT ── */}
      <div className="sd-layout">

        {/* ── SIDEBAR ── */}
        <aside className="sd-sidebar">
          {/* Seller profile card */}
          <div className="sd-profile-card">
            <div className="sd-profile-avatar">👤</div>
            <div className="sd-profile-name">thuomwangi</div>
            <div className="sd-profile-sub">Campus Seller · Since Jan 2026</div>
            <div className="sd-profile-stats">
              <div>
                <div className="sd-profile-stat-num">4.9</div>
                <div className="sd-profile-stat-label">Rating</div>
              </div>
              <div>
                <div className="sd-profile-stat-num">{totalSales}</div>
                <div className="sd-profile-stat-label">Sales</div>
              </div>
              <div>
                <div className="sd-profile-stat-num">{listings.length}</div>
                <div className="sd-profile-stat-label">Listed</div>
              </div>
            </div>
          </div>

          <div className="sd-sidebar-section">Main</div>
          {[
            { id: "overview", icon: "📊", label: "Overview" },
            { id: "listings", icon: "🏷️", label: "My Listings" },
            { id: "orders", icon: "📦", label: "Orders", badge: pendingOrders || undefined },
            { id: "add", icon: "➕", label: "Add Listing" },
          ].map(item => (
            <button
              key={item.id}
              className={`sd-nav-item ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id as typeof tab)}
            >
              <span className="sd-nav-item-icon">{item.icon}</span>
              {item.label}
              {item.badge ? <span className="sd-nav-item-badge">{item.badge}</span> : null}
            </button>
          ))}

          <div className="sd-sidebar-section">Account</div>
          {[
            { icon: "⚙️", label: "Settings" },
            { icon: "💬", label: "Messages" },
            { icon: "📈", label: "Analytics" },
          ].map(item => (
            <button key={item.label} className="sd-nav-item">
              <span className="sd-nav-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* ── CONTENT ── */}
        <main className="sd-main">

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <>
              <div className="sd-page-header">
                <div className="sd-page-label">Dashboard</div>
                <div className="sd-page-title">Good morning, thuomwangi 👋</div>
                <div className="sd-page-sub">Here's what's happening with your store today.</div>
              </div>

              {/* Stats */}
              <div className="sd-stats-grid">
                {[
                  { icon: "💰", label: "Total Revenue", value: `KSh ${totalRevenue.toLocaleString()}`, trend: "+12% this week", trendColor: "#22c55e", bg: "#f0fdf4", iconBg: "#dcfce7" },
                  { icon: "🛍️", label: "Total Sales", value: totalSales, trend: "+3 this week", trendColor: "#22c55e", bg: "#eff6ff", iconBg: "#dbeafe" },
                  { icon: "👁️", label: "Total Views", value: totalViews.toLocaleString(), trend: "+42 this week", trendColor: "#22c55e", bg: "#fefce8", iconBg: "#fef9c3" },
                  { icon: "📋", label: "Active Listings", value: activeCount, trend: `${listings.length - activeCount} inactive`, trendColor: "var(--text3)", bg: "#fff7ed", iconBg: "#ffedd5" },
                  { icon: "⏳", label: "Pending Orders", value: pendingOrders, trend: "Needs attention", trendColor: pendingOrders > 0 ? "#f59e0b" : "#22c55e", bg: "#fff", iconBg: pendingOrders > 0 ? "#fef3c7" : "#f0fdf4" },
                ].map(s => (
                  <div className="sd-stat-card" key={s.label} style={{ background: s.bg }}>
                    <div className="sd-stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
                    <div className="sd-stat-num">{s.value}</div>
                    <div className="sd-stat-label">{s.label}</div>
                    <div className="sd-stat-trend" style={{ color: s.trendColor }}>
                      <span>{s.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sd-overview-grid">
                {/* Revenue chart */}
                <div className="sd-card">
                  <div className="sd-card-header">
                    <div>
                      <div className="sd-card-title">Revenue Overview</div>
                      <div className="sd-card-sub">Last 7 days</div>
                    </div>
                    <span style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>Mar 2026</span>
                  </div>
                  <div className="sd-chart">
                    <div className="sd-chart-bars">
                      {[
                        { day: "Mon", val: 40 }, { day: "Tue", val: 65 }, { day: "Wed", val: 30 },
                        { day: "Thu", val: 80 }, { day: "Fri", val: 55 }, { day: "Sat", val: 90 }, { day: "Sun", val: 70 },
                      ].map(b => (
                        <div className="sd-chart-bar-wrap" key={b.day}>
                          <div className="sd-chart-bar" style={{ height: `${b.val}%` }}>
                            <div className="sd-chart-tooltip">KSh {(b.val * 42).toLocaleString()}</div>
                          </div>
                          <span className="sd-chart-label">{b.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="sd-card">
                  <div className="sd-card-header">
                    <div>
                      <div className="sd-card-title">Recent Activity</div>
                      <div className="sd-card-sub">Latest updates</div>
                    </div>
                  </div>
                  <div className="sd-activity">
                    {[
                      { icon: "🛍️", bg: "#eff6ff", text: "New order for Scientific Calculator", time: "2 hours ago" },
                      { icon: "👁️", bg: "#f0fdf4", text: "Laptop Stand has 89 views", time: "5 hours ago" },
                      { icon: "⭐", bg: "#fefce8", text: "You received a 5-star review", time: "Yesterday" },
                      { icon: "📦", bg: "#fff7ed", text: "Hoodie marked as delivered", time: "2 days ago" },
                    ].map((a, i) => (
                      <div className="sd-activity-item" key={i}>
                        <div className="sd-activity-dot" style={{ background: a.bg }}>{a.icon}</div>
                        <div>
                          <div className="sd-activity-text">{a.text}</div>
                          <div className="sd-activity-time">{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ LISTINGS ══ */}
          {tab === "listings" && (
            <>
              <div className="sd-page-header">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div className="sd-page-label">Inventory</div>
                    <div className="sd-page-title">My Listings</div>
                    <div className="sd-page-sub">{listings.length} total · {activeCount} active</div>
                  </div>
                  <button className="sd-btn sd-btn-accent" onClick={() => setTab("add")}>
                    ＋ Add New Listing
                  </button>
                </div>
              </div>

              {/* Filter pills */}
              <div className="sd-filter-bar" style={{ marginBottom: 20 }}>
                {(["all", "active", "sold", "draft"] as const).map(s => (
                  <button key={s} className={`sd-filter-pill ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                    {s !== "all" && <span style={{ marginLeft: 6, opacity: .7 }}>({listings.filter(l => l.status === s).length})</span>}
                  </button>
                ))}
              </div>

              <div className="sd-card">
                {filteredListings.length === 0 ? (
                  <div className="sd-empty">
                    <div className="sd-empty-icon">📭</div>
                    <div className="sd-empty-title">No listings found</div>
                    <div className="sd-empty-sub">No {filterStatus === "all" ? "" : filterStatus} listings yet.</div>
                    <button className="sd-btn sd-btn-primary" onClick={() => setTab("add")}>Add Your First Listing</button>
                  </div>
                ) : (
                  <table className="sd-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Sales</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredListings.map(l => (
                        <tr key={l.id}>
                          <td>
                            <div className="sd-table-product">
                              <div className="sd-table-emoji">{l.emoji}</div>
                              <div>
                                <div className="sd-table-name">{l.name}</div>
                                <div className="sd-table-category">{l.category}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--primary)" }}>
                            KSh {l.price.toLocaleString()}
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: l.stock === 0 ? "var(--danger)" : l.stock <= 2 ? "var(--warning)" : "var(--text)" }}>
                              {l.stock === 0 ? "Out of stock" : l.stock}
                            </span>
                          </td>
                          <td>
                            <span className="sd-status-badge"
                              style={{ background: statusBg[l.status], color: statusColor[l.status] }}>
                              <span className="sd-status-dot" style={{ background: statusColor[l.status] }} />
                              {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                            </span>
                          </td>
                          <td style={{ color: "var(--text2)" }}>{l.views}</td>
                          <td style={{ fontWeight: 600 }}>{l.sales}</td>
                          <td>
                            <div className="sd-actions">
                              <button className="sd-btn sd-btn-ghost sd-btn-sm" title="Edit">✏️</button>
                              <button className="sd-btn sd-btn-danger sd-btn-sm" onClick={() => setDeleteConfirm(l.id)} title="Delete">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ══ ORDERS ══ */}
          {tab === "orders" && (
            <>
              <div className="sd-page-header">
                <div className="sd-page-label">Sales</div>
                <div className="sd-page-title">Orders</div>
                <div className="sd-page-sub">{orders.length} orders · {pendingOrders} pending</div>
              </div>

              <div className="sd-card">
                {orders.length === 0 ? (
                  <div className="sd-empty">
                    <div className="sd-empty-icon">📦</div>
                    <div className="sd-empty-title">No orders yet</div>
                    <div className="sd-empty-sub">When buyers purchase your items, they'll appear here.</div>
                  </div>
                ) : (
                  <table className="sd-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Buyer</th>
                        <th>Item</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text3)" }}>{o.id}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
                              <span style={{ fontWeight: 600, fontSize: 14 }}>@{o.buyer}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 18 }}>{o.emoji}</span>
                              <span style={{ fontWeight: 500, fontSize: 13 }}>{o.item}</span>
                            </div>
                          </td>
                          <td style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--primary)" }}>
                            KSh {o.amount.toLocaleString()}
                          </td>
                          <td style={{ color: "var(--text3)", fontSize: 13 }}>{o.date}</td>
                          <td>
                            <span className="sd-status-badge"
                              style={{ background: statusBg[o.status], color: statusColor[o.status] }}>
                              <span className="sd-status-dot" style={{ background: statusColor[o.status] }} />
                              {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            {o.status === "pending" && (
                              <button className="sd-btn sd-btn-primary sd-btn-sm"
                                onClick={() => handleOrderStatus(o.id, "confirmed")}>
                                Confirm
                              </button>
                            )}
                            {o.status === "confirmed" && (
                              <button className="sd-btn sd-btn-ghost sd-btn-sm"
                                onClick={() => handleOrderStatus(o.id, "delivered")}>
                                Mark Delivered
                              </button>
                            )}
                            {o.status === "delivered" && (
                              <span style={{ color: "var(--success)", fontSize: 13, fontWeight: 600 }}>✓ Done</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ══ ADD LISTING ══ */}
          {tab === "add" && (
            <>
              <div className="sd-page-header">
                <div className="sd-page-label">Inventory</div>
                <div className="sd-page-title">Add New Listing</div>
                <div className="sd-page-sub">Fill in the details to list your item on CampusCart.</div>
              </div>

              <div className="sd-card" style={{ padding: 28 }}>
                {formError && (
                  <div className="sd-form-error" style={{ marginBottom: 20 }}>⚠️ {formError}</div>
                )}

                <div className="sd-form-grid">
                  {/* Product name */}
                  <div className="sd-field sd-field-full">
                    <label className="sd-label">Product Name *</label>
                    <input className="sd-input" placeholder="e.g. Engineering Maths Textbook"
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>

                  {/* Category */}
                  <div className="sd-field">
                    <label className="sd-label">Category *</label>
                    <select className="sd-input sd-select" value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="sd-field">
                    <label className="sd-label">Price (KSh) *</label>
                    <input className="sd-input" type="number" placeholder="e.g. 1500" min={0}
                      value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                  </div>

                  {/* Stock */}
                  <div className="sd-field">
                    <label className="sd-label">Stock Quantity *</label>
                    <input className="sd-input" type="number" placeholder="e.g. 3" min={0}
                      value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                  </div>

                  {/* Description */}
                  <div className="sd-field sd-field-full">
                    <label className="sd-label">Description</label>
                    <textarea className="sd-input sd-textarea" placeholder="Describe your item — condition, features, why it's useful…"
                      value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>

                  {/* Emoji picker */}
                  <div className="sd-field sd-field-full">
                    <label className="sd-label">Product Icon</label>
                    <div className="sd-emoji-picker">
                      {EMOJIS.map(em => (
                        <button key={em} type="button"
                          className={`sd-emoji-opt ${form.emoji === em ? "selected" : ""}`}
                          onClick={() => setForm(f => ({ ...f, emoji: em }))}>
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="sd-field sd-field-full">
                    <label className="sd-label">Preview</label>
                    <div style={{
                      background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: "var(--radius)",
                      padding: 20, display: "flex", alignItems: "center", gap: 16
                    }}>
                      <div style={{ width: 64, height: 64, borderRadius: 14, background: "#fff", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                        {form.emoji}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: form.name ? "var(--text)" : "var(--text3)" }}>
                          {form.name || "Product Name"}
                        </div>
                        <div style={{ color: "var(--text3)", fontSize: 13, marginTop: 2 }}>{form.category}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--primary)", marginTop: 6 }}>
                          {form.price ? `KSh ${Number(form.price).toLocaleString()}` : "KSh —"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div style={{ display: "flex", gap: 12, marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                  <button className="sd-btn sd-btn-accent"
                    style={{ padding: "13px 28px", borderRadius: 14, fontSize: 15 }}
                    onClick={handleAddListing}>
                    🚀 Publish Listing
                  </button>
                  <button className="sd-btn sd-btn-ghost"
                    style={{ padding: "13px 24px", borderRadius: 14, fontSize: 15 }}
                    onClick={() => setForm({ name: "", category: "Electronics", price: "", stock: "", description: "", emoji: "📦" })}>
                    Clear Form
                  </button>
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div className="sd-modal-overlay">
          <div className="sd-modal-bg" onClick={() => setDeleteConfirm(null)} />
          <div className="sd-modal">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
            <div className="sd-modal-title">Delete Listing?</div>
            <div className="sd-modal-sub">
              This will permanently remove <strong>{listings.find(l => l.id === deleteConfirm)?.name}</strong> from your store. This action cannot be undone.
            </div>
            <div className="sd-modal-btns">
              <button className="sd-btn sd-btn-danger" style={{ flex: 1, justifyContent: "center", padding: 13, borderRadius: 12 }}
                onClick={() => handleDelete(deleteConfirm)}>
                Yes, Delete
              </button>
              <button className="sd-btn sd-btn-ghost" style={{ flex: 1, justifyContent: "center", padding: 13, borderRadius: 12 }}
                onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`sd-toast ${toast.type}`}>
          <div className="sd-toast-icon">{toast.type === "success" ? "✓" : "!"}</div>
          {toast.msg}
        </div>
      )}
    </>
  );
}