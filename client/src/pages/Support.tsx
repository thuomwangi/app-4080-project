import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, AlertCircle, Clock, CheckCircle2, XCircle, MessageSquare, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useSupport, type TicketStatus } from "@/context/SupportContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const statusConfig: Record<TicketStatus, { icon: typeof Clock; color: string; bg: string }> = {
  Open: { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10" },
  "In Progress": { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  Resolved: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  Closed: { icon: XCircle, color: "text-muted-foreground", bg: "bg-muted" },
};

const orderStatuses: TicketStatus[] = ["Open", "In Progress", "Resolved", "Closed"];

const Support = () => {
  const { isAuthenticated, user } = useAuth();
  const { tickets, addResponse, updateTicketStatus } = useSupport();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [closeConfirm, setCloseConfirm] = useState<string | null>(null);

  const isSeller = user?.role === "seller" || user?.role === "admin";

  // Sellers see tickets related to their listings; buyers see their own
  const visibleTickets = isSeller
    ? tickets
    : tickets.filter((t) => t.buyerName === user?.name);

  const activeTicket = tickets.find((t) => t.id === selectedTicket);

  const handleSendResponse = () => {
    if (!activeTicket || !responseText.trim() || !user) return;
    addResponse(activeTicket.id, user.name, user.role as "buyer" | "seller" | "admin", responseText.trim());
    setResponseText("");
    toast.success("Response sent");
  };

  const handleStatusChange = (ticketId: string, status: TicketStatus) => {
    updateTicketStatus(ticketId, status);
    toast.success(`Ticket status updated to ${status}`);
  };

  const handleClose = (ticketId: string) => {
    updateTicketStatus(ticketId, "Closed");
    setCloseConfirm(null);
    toast.success("Ticket closed");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="flex min-h-[60vh] items-center justify-center text-center">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Sign In Required</h1>
            <p className="mb-4 text-muted-foreground">Please sign in to view your support tickets.</p>
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{isSeller ? "Support Ticket Management" : "My Support Tickets"}</h1>
            <p className="text-sm text-muted-foreground">{isSeller ? "View and respond to customer tickets." : "View and manage your support requests."}</p>
          </div>
          <Link to="/support/create" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors" aria-label="Create new support ticket">
            <Plus className="h-4 w-4" aria-hidden="true" /> New Ticket
          </Link>
        </div>

        {visibleTickets.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <h2 className="mb-1 text-lg font-semibold">No Tickets Yet</h2>
            <p className="mb-4 text-sm text-muted-foreground">No support tickets to display.</p>
            <Link to="/support/create" className="inline-flex rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">Create a Ticket</Link>
          </div>
        ) : (
          <div className="space-y-4" role="list" aria-label="Support tickets">
            {visibleTickets.map((ticket) => {
              const cfg = statusConfig[ticket.status];
              const Icon = cfg.icon;
              return (
                <article key={ticket.id} className="rounded-xl border border-border bg-card p-5 shadow-sm" role="listitem" aria-label={`Ticket ${ticket.id}, status: ${ticket.status}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold">{ticket.id}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                          <Icon className="h-3 w-3" aria-hidden="true" /> {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{ticket.issueType} — {ticket.orderProduct}</p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                      {ticket.responses.length > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> {ticket.responses.length} response(s)
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right text-xs text-muted-foreground">
                        <p>Order {ticket.orderId}</p>
                        <p>{ticket.createdAt}</p>
                        <p className="text-xs">By: {ticket.buyerName}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => setSelectedTicket(ticket.id)} className="gap-1 text-xs">
                          <MessageSquare className="h-3 w-3" /> {isSeller ? "Respond" : "View"}
                        </Button>
                        {isSeller && ticket.status !== "Closed" && (
                          <Button size="sm" variant="destructive" onClick={() => setCloseConfirm(ticket.id)} className="text-xs">
                            Close
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Seller status change */}
                  {isSeller && ticket.status !== "Closed" && (
                    <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                      <span className="text-xs text-muted-foreground">Status:</span>
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value as TicketStatus)}
                        className="rounded border border-input bg-background px-2 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Change status for ticket ${ticket.id}`}
                      >
                        {orderStatuses.filter((s) => s !== "Closed").map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Ticket Detail / Respond Dialog */}
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ticket {activeTicket?.id}</DialogTitle>
            </DialogHeader>
            {activeTicket && (
              <div className="space-y-4">
                <div className="rounded-lg bg-secondary p-3 text-sm">
                  <p className="font-medium">{activeTicket.issueType} — {activeTicket.orderProduct}</p>
                  <p className="mt-1 text-muted-foreground">{activeTicket.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">By {activeTicket.buyerName} • Order {activeTicket.orderId}</p>
                </div>

                {/* Responses */}
                {activeTicket.responses.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {activeTicket.responses.map((r) => (
                      <div key={r.id} className={`rounded-lg p-3 text-sm ${r.authorRole === "seller" || r.authorRole === "admin" ? "bg-primary/5 border border-primary/20" : "bg-secondary"}`}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-xs">{r.author} ({r.authorRole})</span>
                          <span className="text-xs text-muted-foreground">{r.date}</span>
                        </div>
                        <p className="text-sm">{r.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add response */}
                {activeTicket.status !== "Closed" && (
                  <div className="space-y-2">
                    <label htmlFor="response-text" className="text-sm font-medium">Add Response</label>
                    <Textarea id="response-text" rows={3} value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Type your response…" />
                    <Button onClick={handleSendResponse} disabled={!responseText.trim()} className="gap-2">
                      <Send className="h-4 w-4" /> Send Response
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Close confirmation */}
        <Dialog open={!!closeConfirm} onOpenChange={() => setCloseConfirm(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Close Ticket</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Are you sure you want to close this ticket? This marks it as resolved and closed.</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setCloseConfirm(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => closeConfirm && handleClose(closeConfirm)}>Close Ticket</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
