import { Link } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useTransactions, type OrderStatus } from "@/context/TransactionContext";

const statusColor = (s: OrderStatus) => {
  switch (s) {
    case "Delivered": return "bg-success/10 text-success";
    case "Shipped": case "Processing": return "bg-primary/10 text-primary";
    case "Confirmed": return "bg-accent text-accent-foreground";
    case "Cancelled": return "bg-destructive/10 text-destructive";
    default: return "bg-warning/10 text-warning";
  }
};

const MyOrders = () => {
  const { isAuthenticated, user } = useAuth();
  const { transactions } = useTransactions();

  const myOrders = transactions.filter(
    (tx) => tx.buyerEmail === user?.email || tx.buyerName === user?.name
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex min-h-[60vh] items-center justify-center text-center">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Sign In Required</h1>
            <p className="mb-4 text-muted-foreground">Please sign in to view your orders.</p>
            <Link to="/login" className="inline-flex rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">Sign In</Link>
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-sm text-muted-foreground">View your order history and track status.</p>
        </div>

        {myOrders.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <h2 className="mb-1 text-lg font-semibold">No Orders Yet</h2>
            <p className="mb-4 text-sm text-muted-foreground">Start shopping to see your orders here.</p>
            <Link to="/products" className="inline-flex rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4" role="list" aria-label="Your orders">
            {myOrders.map((tx) => (
              <article key={tx.id} className="rounded-xl border border-border bg-card p-5 shadow-sm" role="listitem">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold">{tx.orderId}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(tx.orderStatus)}`}>
                        {tx.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Seller: {tx.sellerName}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{tx.date}</p>
                    <p className="font-mono text-xs mt-1">Ref: {tx.mpesaRef}</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  {tx.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Transaction ID:</span> {tx.id}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">${tx.total.toFixed(2)}</span>
                    <Link to={`/receipt/${tx.id}`} className="text-xs text-primary hover:underline">View Receipt</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
