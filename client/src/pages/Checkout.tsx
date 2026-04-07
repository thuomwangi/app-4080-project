import { Minus, Plus, Trash2, Phone, Download, CheckCircle, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTransactions, Transaction } from "@/context/TransactionContext";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Checkout = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addTransaction } = useTransactions();
  const [phone, setPhone] = useState("");
  const [paid, setPaid] = useState(false);
  const [lastTx, setLastTx] = useState<Transaction | null>(null);

  const shipping = 5.00;
  const total = totalPrice + shipping;

  // Redirect guests to login, preserving return path
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/checkout" replace />;
  }

  const handlePay = () => {
    const tx = addTransaction({
      orderId: `#${Math.floor(1000 + Math.random() * 9000)}`,
      buyerName: user?.name || "Guest",
      buyerEmail: user?.email || "",
      sellerName: "CampusCart Sellers",
      items: items.map(({ product, quantity }) => ({ name: product.name, quantity, price: product.price })),
      subtotal: totalPrice,
      shipping,
      total,
      phone,
    });
    setLastTx(tx);
    setPaid(true);
    clearCart();
  };

  if (items.length === 0 && !paid) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex min-h-[60vh] items-center justify-center text-center">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Your Cart is Empty</h1>
            <p className="mb-4 text-muted-foreground">Add some items to get started!</p>
            <Link to="/products" className="inline-flex rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (paid && lastTx) {
    return (
      <div className="min-h-screen bg-section">
        <Header />
        <main id="main-content" className="container mx-auto max-w-2xl px-4 py-8" role="status" aria-live="polite">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success" aria-hidden="true">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Payment Successful!</h1>
            <p className="mb-6 text-muted-foreground">Your M-Pesa payment has been processed successfully.</p>

            <div className="mb-6 rounded-lg bg-secondary p-4 text-left text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-medium">{lastTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">M-Pesa Reference</span>
                <span className="font-mono font-medium">{lastTx.mpesaRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-primary">${lastTx.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-medium">{lastTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{lastTx.phone}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">Items:</p>
                {lastTx.items.map((item, i) => (
                  <p key={i} className="text-xs">{item.quantity}x {item.name} — ${(item.price * item.quantity).toFixed(2)}</p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to={`/receipt/${lastTx.id}`}>
                <Button className="gap-2 w-full sm:w-auto">
                  <Download className="h-4 w-4" /> Download Receipt
                </Button>
              </Link>
              <Link to="/my-orders">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  View My Orders
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <div className="mt-4">
              <Link to="/support/create" className="text-sm text-primary hover:underline">
                Need help? Create a Support Ticket
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-section">
      <Header />
      <main id="main-content" className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold">Cart &amp; Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="cart-heading">
              <h2 id="cart-heading" className="mb-4 text-lg font-semibold">Your Shopping Cart</h2>
              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-4 rounded-lg border border-border p-4">
                    <img src={product.image} alt={`${product.name}, ${product.condition} condition`} className="h-20 w-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.condition} • {product.location}</p>
                      <p className="mt-1 text-sm font-bold text-primary">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(product.id)} className="text-muted-foreground hover:text-destructive transition-colors" aria-label={`Remove ${product.name} from cart`}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <div className="flex items-center gap-2" role="group" aria-label={`Quantity for ${product.name}`}>
                        <button onClick={() => updateQuantity(product.id, quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded border border-border hover:bg-secondary" aria-label="Decrease quantity" disabled={quantity <= 1}>
                          <Minus className="h-3 w-3" aria-hidden="true" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center" aria-live="polite">{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded border border-border hover:bg-secondary" aria-label="Increase quantity">
                          <Plus className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="mpesa-heading">
              <h2 id="mpesa-heading" className="mb-4 text-lg font-semibold">M-Pesa Payment</h2>
              <div>
                <label htmlFor="mpesa-phone" className="mb-1 block text-sm font-medium">Phone Number</label>
                <input id="mpesa-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7XX XXX XXX" autoComplete="tel" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <button onClick={handlePay} className="mt-4 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Pay with M-Pesa — ${total.toFixed(2)}
              </button>
            </section>
          </div>

          <div>
            <section className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="summary-heading">
              <h2 id="summary-heading" className="mb-4 text-lg font-semibold">Complete Your Order</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Order Summary</p>
                {items.map(({ product, quantity }) => (
                  <p key={product.id}>{quantity}x {product.name}</p>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
