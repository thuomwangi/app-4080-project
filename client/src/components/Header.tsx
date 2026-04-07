import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, Plus, LifeBuoy, Shield, CreditCard, Package, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const Header = () => {
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("campuscart-high-contrast");
    if (stored === "true") {
      setHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }
  }, []);

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem("campuscart-high-contrast", String(next));
    if (next) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background shadow-sm" role="banner">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary" aria-label="CampusCart home">
          <ShoppingCart className="h-6 w-6" aria-hidden="true" />
          CampusCart
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Products</Link>
          <Link to="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Sell</Link>
          {isAuthenticated && user?.role === "admin" && (
            <Link to="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" /> Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <label htmlFor="header-search" className="sr-only">Search products</label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input id="header-search" type="search" placeholder="Search products..." className="h-9 w-56 rounded-lg border border-input bg-secondary pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors ${highContrast ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground hover:text-foreground hover:border-foreground"}`}
            aria-pressed={highContrast}
            aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            HC
          </button>

          <Link to="/post-item" className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors" aria-label="Sell an item">
            <Plus className="h-4 w-4" aria-hidden="true" /> Sell
          </Link>

          <Link to="/checkout" className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ', empty'}`}>
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground" aria-hidden="true">{totalItems}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/my-orders" className="p-2 text-foreground hover:text-primary transition-colors" aria-label="My orders">
                <Package className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link to="/support" className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Help and support">
                <LifeBuoy className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link to="/transactions" className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Transaction history">
                <CreditCard className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link to="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground" aria-label={`${user?.name}'s dashboard`}>
                {user?.name?.charAt(0).toUpperCase()}
              </Link>
              <button onClick={logout} className="text-sm text-muted-foreground hover:text-foreground" aria-label="Log out">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <User className="h-4 w-4" aria-hidden="true" /> Sign In
            </Link>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"}>
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-border bg-background p-4 md:hidden" role="navigation" aria-label="Mobile navigation">
          <nav className="flex flex-col gap-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Products</Link>
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Sell</Link>
            <Link to="/post-item" onClick={() => setMobileOpen(false)} className="text-sm font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" /> Sell an Item
            </Link>
            <Link to="/my-orders" onClick={() => setMobileOpen(false)} className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" aria-hidden="true" /> My Orders
            </Link>
            <Link to="/support" onClick={() => setMobileOpen(false)} className="text-sm font-medium flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" aria-hidden="true" /> Support
            </Link>
            <Link to="/transactions" onClick={() => setMobileOpen(false)} className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" aria-hidden="true" /> Transactions
            </Link>
            <Link to="/checkout" onClick={() => setMobileOpen(false)} className="text-sm font-medium flex items-center gap-2">
              Cart {totalItems > 0 && `(${totalItems})`}
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" aria-hidden="true" /> Admin
              </Link>
            )}
            <button onClick={toggleHighContrast} className="text-sm font-medium flex items-center gap-2 text-left" aria-pressed={highContrast}>
              <Eye className="h-4 w-4" aria-hidden="true" /> {highContrast ? "Disable" : "Enable"} High Contrast
            </button>
            {!isAuthenticated && (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">Sign In</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
