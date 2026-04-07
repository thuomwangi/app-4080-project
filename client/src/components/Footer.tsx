import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-background py-10" role="contentinfo">
    <div className="container mx-auto px-4">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary mb-3" aria-label="CampusCart home">
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            CampusCart
          </Link>
          <p className="text-sm text-muted-foreground">Connect. Buy. Sell. The ultimate campus marketplace for university students.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
          <nav aria-label="Quick links" className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/products" className="hover:text-primary transition-colors">Browse Products</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Sell Items</Link>
            <Link to="/login" className="hover:text-primary transition-colors">My Account</Link>
          </nav>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Categories</h4>
          <nav aria-label="Product categories" className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/products?category=Electronics" className="hover:text-primary transition-colors">Electronics</Link>
            <Link to="/products?category=Books" className="hover:text-primary transition-colors">Books</Link>
            <Link to="/products?category=Furniture" className="hover:text-primary transition-colors">Furniture</Link>
          </nav>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Support</h4>
          <nav aria-label="Support links" className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/support" className="hover:text-primary transition-colors">Help & Support</Link>
            <Link to="/support/create" className="hover:text-primary transition-colors">Report an Issue</Link>
            <span>Safety Tips</span>
          </nav>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
        <span>© 2026 CampusCart. All rights reserved.</span>
        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
