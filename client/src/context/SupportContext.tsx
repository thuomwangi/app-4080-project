import React, { createContext, useContext, useState, useCallback } from "react";

export type IssueType = "Product Quality" | "Delivery Problem" | "Wrong Item" | "Seller Behavior" | "Other";
export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export interface TicketResponse {
  id: string;
  author: string;
  authorRole: "buyer" | "seller" | "admin";
  message: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  orderId: string;
  orderProduct: string;
  issueType: IssueType;
  description: string;
  photos: string[];
  status: TicketStatus;
  createdAt: string;
  sellerName: string;
  buyerName: string;
  responses: TicketResponse[];
}

interface SupportContextType {
  tickets: SupportTicket[];
  createTicket: (ticket: Omit<SupportTicket, "id" | "status" | "createdAt" | "responses">) => SupportTicket;
  addResponse: (ticketId: string, author: string, authorRole: "buyer" | "seller" | "admin", message: string) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

const sampleTickets: SupportTicket[] = [
  {
    id: "TKT-1001",
    orderId: "#1234",
    orderProduct: "Wireless Earbuds Pro",
    issueType: "Product Quality",
    description: "Left earbud stopped working after 2 days of use.",
    photos: [],
    status: "In Progress",
    createdAt: "2026-03-28",
    sellerName: "Alex Johnson",
    buyerName: "John D.",
    responses: [
      { id: "R-001", author: "Alex Johnson", authorRole: "seller", message: "Sorry to hear that. Can you try resetting the earbuds?", date: "2026-03-29" },
    ],
  },
  {
    id: "TKT-1002",
    orderId: "#1236",
    orderProduct: "Textbook Bundle",
    issueType: "Wrong Item",
    description: "Received wrong edition of the Chemistry textbook.",
    photos: [],
    status: "Resolved",
    createdAt: "2026-03-20",
    sellerName: "Sarah Kim",
    buyerName: "Mike C.",
    responses: [],
  },
];

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>(sampleTickets);

  const createTicket = useCallback((data: Omit<SupportTicket, "id" | "status" | "createdAt" | "responses">) => {
    const ticket: SupportTicket = {
      ...data,
      id: `TKT-${1000 + tickets.length + 1}`,
      status: "Open",
      createdAt: new Date().toISOString().split("T")[0],
      responses: [],
    };
    setTickets((prev) => [ticket, ...prev]);
    return ticket;
  }, [tickets.length]);

  const addResponse = useCallback((ticketId: string, author: string, authorRole: "buyer" | "seller" | "admin", message: string) => {
    setTickets((prev) => prev.map((t) =>
      t.id === ticketId
        ? {
            ...t,
            responses: [...t.responses, {
              id: `R-${Date.now()}`,
              author,
              authorRole,
              message,
              date: new Date().toISOString().split("T")[0],
            }],
          }
        : t
    ));
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status } : t));
  }, []);

  return (
    <SupportContext.Provider value={{ tickets, createTicket, addResponse, updateTicketStatus }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error("useSupport must be used within SupportProvider");
  return ctx;
};
