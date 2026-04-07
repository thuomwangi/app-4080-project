import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Users, CheckCircle, XCircle, CreditCard, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useTransactions } from "@/context/TransactionContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Tab = "users" | "approvals" | "transactions";

const AdminDashboard = () => {
  const { user, isAuthenticated, allUsers, approveUser, rejectUser } = useAuth();
  const { transactions } = useTransactions();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("users");

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex min-h-[60vh] items-center justify-center text-center">
          <div>
            <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h1 className="mb-2 text-2xl font-bold">Admin Access Required</h1>
            <p className="mb-4 text-muted-foreground">Sign in with an admin account to access this page.</p>
            <Link to="/login" className="inline-flex rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const pendingSellers = allUsers.filter((u) => u.role === "seller" && u.status === "pending");

  const handleApprove = (email: string, name: string) => {
    approveUser(email);
    toast({ title: "Seller Approved", description: `${name} now has seller privileges.` });
  };

  const handleReject = (email: string, name: string) => {
    rejectUser(email);
    toast({ title: "Application Rejected", description: `${name}'s seller application was rejected.` });
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { key: "users", label: "All Users", icon: Users, count: allUsers.length },
    { key: "approvals", label: "Seller Approvals", icon: Clock, count: pendingSellers.length },
    { key: "transactions", label: "Transactions", icon: CreditCard, count: transactions.length },
  ];

  return (
    <div className="min-h-screen bg-section">
      <Header />
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" aria-hidden="true" /> Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Manage users, approvals, and transactions.</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="Admin sections">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                tab === t.key ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-secondary"
              }`}
            >
              <t.icon className="h-4 w-4" aria-hidden="true" />
              {t.label}
              {t.count !== undefined && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  tab === t.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {tab === "users" && (
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="users-heading">
            <h2 id="users-heading" className="mb-4 text-lg font-semibold">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Users table">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Name</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Email</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Role</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Joined</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => (
                    <tr key={u.email} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium">{u.name}</td>
                      <td className="py-3 text-muted-foreground">{u.email}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.role === "admin" ? "bg-primary/10 text-primary" :
                          u.role === "seller" ? "bg-success/10 text-success" :
                          "bg-secondary text-foreground"
                        }`}>{u.role}</span>
                      </td>
                      <td className="py-3 text-muted-foreground">{u.joinDate}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.status === "active" ? "bg-success/10 text-success" :
                          u.status === "pending" ? "bg-warning/10 text-warning" :
                          "bg-destructive/10 text-destructive"
                        }`}>{u.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Approvals Tab */}
        {tab === "approvals" && (
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="approvals-heading">
            <h2 id="approvals-heading" className="mb-4 text-lg font-semibold">Pending Seller Approvals</h2>
            {pendingSellers.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No pending seller applications.</p>
            ) : (
              <div className="space-y-4">
                {pendingSellers.map((u) => (
                  <div key={u.email} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email} • Applied {u.joinDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(u.email, u.name)} className="gap-1">
                        <CheckCircle className="h-4 w-4" aria-hidden="true" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(u.email, u.name)} className="gap-1">
                        <XCircle className="h-4 w-4" aria-hidden="true" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Transactions Tab */}
        {tab === "transactions" && (
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="admin-tx-heading">
            <h2 id="admin-tx-heading" className="mb-4 text-lg font-semibold">All Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Transactions table">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Txn ID</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Buyer</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Seller</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Amount</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">M-Pesa Ref</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Date</th>
                    <th scope="col" className="pb-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium">{tx.id}</td>
                      <td className="py-3">{tx.buyerName}</td>
                      <td className="py-3">{tx.sellerName}</td>
                      <td className="py-3 font-medium">${tx.total.toFixed(2)}</td>
                      <td className="py-3 font-mono text-xs">{tx.mpesaRef}</td>
                      <td className="py-3 text-muted-foreground">{tx.date}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">{tx.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
