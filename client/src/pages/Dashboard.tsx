import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Package, DollarSign, ShoppingCart, TrendingUp, Plus, Eye, Edit, LifeBuoy, Trash2, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";
import { useTransactions, type OrderStatus } from "@/context/TransactionContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/data/products";

const salesData = [
  { month: "Jan", sales: 1200 },
  { month: "Feb", sales: 1800 },
  { month: "Mar", sales: 2400 },
  { month: "Apr", sales: 1600 },
  { month: "May", sales: 2800 },
  { month: "Jun", sales: 3200 },
];

const recentOrders = [
  { id: "#1234", product: "Wireless Earbuds Pro", buyer: "John D.", amount: "$45.00", status: "Delivered", date: "2026-03-28" },
  { id: "#1235", product: "Study Desk", buyer: "Sarah K.", amount: "$149.99", status: "Shipped", date: "2026-03-29" },
  { id: "#1236", product: "Textbook Bundle", buyer: "Mike C.", amount: "$35.00", status: "Pending", date: "2026-04-01" },
  { id: "#1237", product: "Desk Lamp", buyer: "Emma R.", amount: "$22.00", status: "Delivered", date: "2026-04-02" },
];

type DashView = "overview" | "sales" | "products" | "orders";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { userListings, updateListing, deleteListing } = useListings();
  const { transactions, updateOrderStatus } = useTransactions();
  const [view, setView] = useState<DashView>("overview");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({ name: "", price: "", description: "", condition: "" });

  const sellerTx = transactions.filter((tx) => tx.sellerName === user?.name);
  const totalSalesAmount = sellerTx.reduce((s, tx) => s + tx.total, 0);

  const stats = [
    { label: "Total Sales", value: `$${(totalSalesAmount || 12450).toLocaleString()}`, icon: DollarSign, change: "+12%", view: "sales" as DashView },
    { label: "Products Listed", value: String(userListings.length || 24), icon: Package, change: `+${userListings.length}`, view: "products" as DashView },
    { label: "Orders", value: String(recentOrders.length + sellerTx.length), icon: ShoppingCart, change: "+8%", view: "orders" as DashView },
    { label: "Revenue", value: "$3,200", icon: TrendingUp, change: "+15%", view: "sales" as DashView },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex min-h-[60vh] items-center justify-center text-center">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Access Your Dashboard</h1>
            <p className="mb-4 text-muted-foreground">Sign in to manage your listings and sales.</p>
            <Link to="/login" className="inline-flex rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">Sign In</Link>
          </div>
        </main>
      </div>
    );
  }

  const openEdit = (product: Product) => {
    setEditForm({ name: product.name, price: String(product.price), description: product.description, condition: product.condition });
    setEditProduct(product);
  };

  const saveEdit = () => {
    if (!editProduct) return;
    updateListing(editProduct.id, {
      name: editForm.name,
      price: parseFloat(editForm.price),
      description: editForm.description,
      condition: editForm.condition as Product["condition"],
    });
    setEditProduct(null);
    toast.success(`"${editForm.name}" has been updated.`);
  };

  const confirmDelete = (id: string) => {
    const product = userListings.find((p) => p.id === id);
    deleteListing(id);
    setDeleteConfirm(null);
    toast.success(`"${product?.name}" has been removed.`);
  };

  // Sub-views
  if (view !== "overview") {
    return (
      <div className="min-h-screen bg-section">
        <Header />
        <main id="main-content" className="container mx-auto px-4 py-8">
          <button onClick={() => setView("overview")} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>

          {view === "sales" && (
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="sales-detail-heading">
              <h1 id="sales-detail-heading" className="mb-4 text-xl font-bold">Sales & Transaction Details</h1>
              {sellerTx.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground mb-2">No transactions yet.</p>
                  <p className="text-sm text-muted-foreground">Demo data shown from mock orders.</p>
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="sales" fill="hsl(211, 100%, 50%)" radius={[4, 4, 0, 0]} name="Sales ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th scope="col" className="pb-3 font-medium text-muted-foreground">Txn ID</th>
                        <th scope="col" className="pb-3 font-medium text-muted-foreground">Buyer</th>
                        <th scope="col" className="pb-3 font-medium text-muted-foreground">Amount</th>
                        <th scope="col" className="pb-3 font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerTx.map((tx) => (
                        <tr key={tx.id} className="border-b border-border last:border-0">
                          <td className="py-3 font-medium">{tx.id}</td>
                          <td className="py-3">{tx.buyerName}</td>
                          <td className="py-3 font-medium">${tx.total.toFixed(2)}</td>
                          <td className="py-3 text-muted-foreground">{tx.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {view === "products" && (
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="products-detail-heading">
              <div className="mb-4 flex items-center justify-between">
                <h1 id="products-detail-heading" className="text-xl font-bold">My Products ({userListings.length})</h1>
                <Link to="/post-item">
                  <Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add New</Button>
                </Link>
              </div>
              {userListings.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">You haven't listed any products yet.</p>
                  <Link to="/post-item"><Button className="gap-2"><Plus className="h-4 w-4" /> Post Your First Item</Button></Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userListings.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                      <img src={product.image} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.category} • {product.condition}</p>
                        <p className="text-sm font-bold text-primary">KES {product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(product)} className="gap-1">
                          <Edit className="h-3 w-3" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteConfirm(product.id)} className="gap-1">
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {view === "orders" && (
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="orders-detail-heading">
              <h1 id="orders-detail-heading" className="mb-4 text-xl font-bold">All Orders</h1>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th scope="col" className="pb-3 font-medium text-muted-foreground">Order ID</th>
                      <th scope="col" className="pb-3 font-medium text-muted-foreground">Product</th>
                      <th scope="col" className="pb-3 font-medium text-muted-foreground">Buyer</th>
                      <th scope="col" className="pb-3 font-medium text-muted-foreground">Amount</th>
                      <th scope="col" className="pb-3 font-medium text-muted-foreground">Date</th>
                      <th scope="col" className="pb-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0">
                        <td className="py-3 font-medium">{order.id}</td>
                        <td className="py-3">{order.product}</td>
                        <td className="py-3">{order.buyer}</td>
                        <td className="py-3 font-medium">{order.amount}</td>
                        <td className="py-3 text-muted-foreground">{order.date}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            order.status === "Delivered" ? "bg-success/10 text-success" :
                            order.status === "Shipped" ? "bg-primary/10 text-primary" :
                            "bg-warning/10 text-warning"
                          }`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                    {sellerTx.map((tx) => (
                      <tr key={tx.id} className="border-b border-border last:border-0">
                        <td className="py-3 font-medium">{tx.orderId}</td>
                        <td className="py-3">{tx.items.map((i) => i.name).join(", ")}</td>
                        <td className="py-3">{tx.buyerName}</td>
                        <td className="py-3 font-medium">${tx.total.toFixed(2)}</td>
                        <td className="py-3 text-muted-foreground">{tx.date}</td>
                        <td className="py-3">
                          <select
                            value={tx.orderStatus}
                            onChange={(e) => {
                              updateOrderStatus(tx.id, e.target.value as OrderStatus);
                              toast.success(`Order ${tx.orderId} status updated to ${e.target.value}`);
                            }}
                            className="rounded border border-input bg-background px-2 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Update status for order ${tx.orderId}`}
                          >
                            {(["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] as OrderStatus[]).map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Edit Modal */}
          <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
            <DialogContent>
              <DialogHeader><DialogTitle>Edit Listing</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="mb-1 block text-sm font-medium">Title</label>
                  <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="edit-price" className="mb-1 block text-sm font-medium">Price (KES)</label>
                  <Input id="edit-price" type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="edit-condition" className="mb-1 block text-sm font-medium">Condition</label>
                  <select id="edit-condition" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editForm.condition} onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}>
                    {["New", "Like New", "Good", "Fair"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-desc" className="mb-1 block text-sm font-medium">Description</label>
                  <Textarea id="edit-desc" rows={4} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
                  <Button onClick={saveEdit}>Save Changes</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
            <DialogContent>
              <DialogHeader><DialogTitle>Delete Listing</DialogTitle></DialogHeader>
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this listing? This action cannot be undone.</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                <Button variant="destructive" onClick={() => deleteConfirm && confirmDelete(deleteConfirm)}>Delete</Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
        <Footer />
      </div>
    );
  }

  // Overview (original dashboard)
  return (
    <div className="min-h-screen bg-section">
      <Header />
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Seller Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening.</p>
          </div>
          <Link to="/post-item" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors" aria-label="Add a new product listing">
            <Plus className="h-4 w-4" aria-hidden="true" /> Add Product
          </Link>
        </div>

        {/* Clickable Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4" role="group" aria-label="Sales statistics">
          {stats.map((stat) => (
            <button
              key={stat.label}
              onClick={() => setView(stat.view)}
              className="rounded-xl border border-border bg-card p-5 shadow-sm text-left hover:border-primary hover:shadow-md transition-all cursor-pointer"
              aria-label={`${stat.label}: ${stat.value}. Click to view details.`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <span className="text-xs text-success">{stat.change}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-3" aria-labelledby="chart-heading">
            <h2 id="chart-heading" className="mb-4 text-lg font-semibold">Sales Overview</h2>
            <div role="img" aria-label="Bar chart showing monthly sales">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="hsl(211, 100%, 50%)" radius={[4, 4, 0, 0]} name="Sales ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2" aria-labelledby="actions-heading">
            <h2 id="actions-heading" className="mb-4 text-lg font-semibold">Quick Actions</h2>
            <nav className="space-y-3" aria-label="Quick actions">
              <Link to="/post-item" className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-sm hover:bg-secondary transition-colors">
                <Plus className="h-4 w-4 text-primary" aria-hidden="true" /> List New Product
              </Link>
              <button onClick={() => setView("orders")} className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-sm hover:bg-secondary transition-colors">
                <Eye className="h-4 w-4 text-primary" aria-hidden="true" /> View All Orders
              </button>
              <button onClick={() => setView("products")} className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-sm hover:bg-secondary transition-colors">
                <Edit className="h-4 w-4 text-primary" aria-hidden="true" /> Manage Products
              </button>
              <Link to="/support" className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-sm hover:bg-secondary transition-colors">
                <LifeBuoy className="h-4 w-4 text-primary" aria-hidden="true" /> Support Tickets
              </Link>
              <Link to="/transactions" className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-sm hover:bg-secondary transition-colors">
                <DollarSign className="h-4 w-4 text-primary" aria-hidden="true" /> Transaction History
              </Link>
            </nav>
          </section>
        </div>

        {/* Recent Orders */}
        <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="orders-heading">
          <h2 id="orders-heading" className="mb-4 text-lg font-semibold">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Recent orders table">
              <thead>
                <tr className="border-b border-border text-left">
                  <th scope="col" className="pb-3 font-medium text-muted-foreground">Order ID</th>
                  <th scope="col" className="pb-3 font-medium text-muted-foreground">Product</th>
                  <th scope="col" className="pb-3 font-medium text-muted-foreground">Buyer</th>
                  <th scope="col" className="pb-3 font-medium text-muted-foreground">Amount</th>
                  <th scope="col" className="pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{order.id}</td>
                    <td className="py-3">{order.product}</td>
                    <td className="py-3">{order.buyer}</td>
                    <td className="py-3 font-medium">{order.amount}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === "Delivered" ? "bg-success/10 text-success" :
                        order.status === "Shipped" ? "bg-primary/10 text-primary" :
                        "bg-warning/10 text-warning"
                      }`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
