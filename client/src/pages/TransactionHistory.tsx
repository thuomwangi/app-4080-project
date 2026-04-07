import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useTransactions } from "@/context/TransactionContext";
import { Button } from "@/components/ui/button";

const TransactionHistory = () => {
  const { isAuthenticated, user } = useAuth();
  const { transactions } = useTransactions();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex min-h-[60vh] items-center justify-center text-center">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Sign in to view transactions</h1>
            <Link to="/login" className="inline-flex rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">Sign In</Link>
          </div>
        </main>
      </div>
    );
  }

  // Filter based on role
  const filtered = user?.role === "admin"
    ? transactions
    : user?.role === "seller"
    ? transactions.filter((tx) => tx.sellerName === user.name)
    : transactions.filter((tx) => tx.buyerEmail === user.email || tx.buyerName === user.name);

  return (
    <div className="min-h-screen bg-section">
      <Header />
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/dashboard" className="p-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Back to dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" aria-hidden="true" /> Transaction History
            </h1>
            <p className="text-sm text-muted-foreground">{filtered.length} transactions</p>
          </div>
        </div>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No transactions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Transaction history">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Txn ID</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Items</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Total</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">M-Pesa Ref</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Date</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx) => (
                    <tr key={tx.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium">{tx.id}</td>
                      <td className="py-3">{tx.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}</td>
                      <td className="py-3 font-medium">${tx.total.toFixed(2)}</td>
                      <td className="py-3 font-mono text-xs">{tx.mpesaRef}</td>
                      <td className="py-3 text-muted-foreground">{tx.date}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">{tx.status}</span>
                      </td>
                      <td className="py-3">
                        <Link to={`/receipt/${tx.id}`} className="text-primary hover:underline text-xs font-medium flex items-center gap-1">
                          <Download className="h-3 w-3" /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TransactionHistory;
