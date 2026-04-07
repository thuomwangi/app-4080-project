import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Upload, X, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useSupport, type IssueType } from "@/context/SupportContext";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const issueTypes: IssueType[] = ["Product Quality", "Delivery Problem", "Wrong Item", "Seller Behavior", "Other"];

const orders = [
  { id: "#1234", product: "Wireless Earbuds Pro" },
  { id: "#1235", product: "Study Desk" },
  { id: "#1236", product: "Textbook Bundle" },
  { id: "#1237", product: "Desk Lamp" },
];

const CreateTicket = () => {
  const { isAuthenticated, user } = useAuth();
  const { createTicket } = useSupport();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const prefilledOrder = searchParams.get("order") || "";
  const prefilledProduct = searchParams.get("product") || "";

  const [orderId, setOrderId] = useState(prefilledOrder || "");
  const [issueType, setIssueType] = useState<IssueType | "">("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex min-h-[60vh] items-center justify-center text-center">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Sign In Required</h1>
            <p className="mb-4 text-muted-foreground">Please sign in to create a support ticket.</p>
            <Link to="/login" className="inline-flex rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex min-h-[60vh] items-center justify-center text-center" role="status" aria-live="polite">
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success" aria-hidden="true">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Ticket Created Successfully</h1>
            <p className="mb-1 text-muted-foreground">Your ticket reference is:</p>
            <p className="mb-4 text-lg font-bold text-primary">{submitted}</p>
            <p className="mb-6 text-sm text-muted-foreground">Notification sent to seller. We'll get back to you shortly.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/support" className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                View My Tickets
              </Link>
              <Link to="/dashboard" className="rounded-lg border-2 border-primary px-6 py-2.5 font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedOrder = orders.find((o) => o.id === orderId);
  const orderProduct = prefilledProduct || selectedOrder?.product || "";

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !issueType || !description.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const ticket = createTicket({
      orderId,
      orderProduct,
      issueType: issueType as IssueType,
      description,
      photos,
      sellerName: "CampusCart Sellers",
      buyerName: user?.name || "Guest",
    });
    toast({ title: "Ticket created!", description: `Reference: ${ticket.id}` });
    setSubmitted(ticket.id);
  };

  return (
    <div className="min-h-screen bg-section">
      <Header />
      <main id="main-content" className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">Create Support Ticket</h1>
        <p className="mb-8 text-sm text-muted-foreground">Describe your issue and we'll help resolve it.</p>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm" aria-label="Create support ticket form">
          {/* Order */}
          <div>
            <label htmlFor="ticket-order" className="mb-1.5 block text-sm font-medium">Order <span className="text-destructive" aria-hidden="true">*</span><span className="sr-only">(required)</span></label>
            {prefilledOrder ? (
              <div id="ticket-order" className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm" role="status">
                {prefilledOrder} — {prefilledProduct}
              </div>
            ) : (
              <select
                id="ticket-order"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="">Select an order</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>{o.id} — {o.product}</option>
                ))}
              </select>
            )}
          </div>

          {/* Issue Type */}
          <div>
            <label htmlFor="ticket-issue" className="mb-1.5 block text-sm font-medium">Issue Type <span className="text-destructive" aria-hidden="true">*</span><span className="sr-only">(required)</span></label>
            <select
              id="ticket-issue"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value as IssueType)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Select issue type</option>
              {issueTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="ticket-description" className="mb-1.5 block text-sm font-medium">Description <span className="text-destructive" aria-hidden="true">*</span><span className="sr-only">(required)</span></label>
            <textarea
              id="ticket-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe your issue in detail..."
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              required
            />
          </div>

          {/* Photos */}
          <div>
            <span className="mb-1.5 block text-sm font-medium">Photos (optional)</span>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary/50 transition-colors" tabIndex={0} role="button" aria-label="Upload photos of the issue">
              <Upload className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Click to upload photos of the issue</span>
              <input type="file" accept="image/*" multiple onChange={handlePhoto} className="hidden" />
            </label>
            {photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {photos.map((src, i) => (
                  <div key={i} className="relative h-20 w-20">
                    <img src={src} alt={`Uploaded issue photo ${i + 1}`} className="h-full w-full rounded-lg object-cover border border-border" />
                    <button
                      type="button"
                      onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                      aria-label={`Remove photo ${i + 1}`}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Submit Ticket
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTicket;
