import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Download, ArrowLeft, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTransactions } from "@/context/TransactionContext";
import { Button } from "@/components/ui/button";

const Receipt = () => {
  const { id } = useParams<{ id: string }>();
  const { transactions } = useTransactions();
  const tx = transactions.find((t) => t.id === id);

  const handlePrint = () => window.print();

  if (!tx) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex min-h-[60vh] items-center justify-center text-center">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Receipt Not Found</h1>
            <Link to="/transactions" className="text-primary hover:underline">View Transactions</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-section">
      <Header />
      <main id="main-content" className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <Link to="/transactions" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Transactions
          </Link>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Download Receipt
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm" id="receipt-content">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between border-b border-border pb-6">
            <div className="flex items-center gap-2 text-primary">
              <ShoppingCart className="h-8 w-8" />
              <span className="text-2xl font-bold">CampusCart</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">RECEIPT</p>
              <p className="text-sm text-muted-foreground">{tx.id}</p>
            </div>
          </div>

          {/* Payment Confirmed Badge */}
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-success/10 p-4">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <p className="font-semibold text-success">Payment Confirmed via M-Pesa</p>
              <p className="text-sm text-muted-foreground">Reference: {tx.mpesaRef}</p>
            </div>
          </div>

          {/* Details */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Buyer</p>
              <p className="font-medium">{tx.buyerName}</p>
              <p className="text-sm text-muted-foreground">{tx.phone}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Date & Time</p>
              <p className="font-medium">{tx.date}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Order ID</p>
              <p className="font-medium">{tx.orderId}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">M-Pesa Reference</p>
              <p className="font-mono font-medium">{tx.mpesaRef}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-muted-foreground">Item</th>
                  <th className="pb-2 font-medium text-muted-foreground text-center">Qty</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">Price</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {tx.items.map((item, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-3">{item.name}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-3 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${tx.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>${tx.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
              <span>Total Paid</span>
              <span className="text-primary">${tx.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground border-t border-border pt-6">
            <p>Thank you for your purchase on CampusCart!</p>
            <p>For support, visit <Link to="/support" className="text-primary hover:underline">Help & Support</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Receipt;
