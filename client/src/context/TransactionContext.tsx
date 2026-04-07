import React, { createContext, useContext, useState, useCallback } from "react";

export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface Transaction {
  id: string;
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  phone: string;
  mpesaRef: string;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  orderStatus: OrderStatus;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "mpesaRef" | "date" | "status" | "orderStatus">) => Transaction;
  updateOrderStatus: (txId: string, status: OrderStatus) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const mockTransactions: Transaction[] = [
  {
    id: "TXN-001", orderId: "#1234", buyerName: "John D.", buyerEmail: "john@university.edu",
    sellerName: "Alex Johnson",
    items: [{ name: "Wireless Earbuds Pro", quantity: 1, price: 45.00 }],
    subtotal: 45.00, shipping: 5.00, total: 50.00, phone: "+254 712 345 678",
    mpesaRef: "RKL4X7Y9ZQ", date: "2026-03-28 14:32", status: "Completed", orderStatus: "Delivered",
  },
  {
    id: "TXN-002", orderId: "#1235", buyerName: "Sarah K.", buyerEmail: "sarah.k@university.edu",
    sellerName: "Alex Johnson",
    items: [{ name: "Study Desk", quantity: 1, price: 149.99 }],
    subtotal: 149.99, shipping: 5.00, total: 154.99, phone: "+254 723 456 789",
    mpesaRef: "QMP8N2R3WT", date: "2026-03-29 09:15", status: "Completed", orderStatus: "Shipped",
  },
  {
    id: "TXN-003", orderId: "#1236", buyerName: "Mike C.", buyerEmail: "mike@university.edu",
    sellerName: "Sarah Kim",
    items: [{ name: "Textbook Bundle", quantity: 1, price: 35.00 }],
    subtotal: 35.00, shipping: 5.00, total: 40.00, phone: "+254 734 567 890",
    mpesaRef: "XYZ5A1B2CD", date: "2026-04-01 11:45", status: "Completed", orderStatus: "Pending",
  },
];

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const addTransaction = useCallback((tx: Omit<Transaction, "id" | "mpesaRef" | "date" | "status" | "orderStatus">) => {
    const newTx: Transaction = {
      ...tx,
      id: `TXN-${String(Date.now()).slice(-6)}`,
      mpesaRef: `MPE${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      date: new Date().toLocaleString(),
      status: "Completed",
      orderStatus: "Pending",
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  }, []);

  const updateOrderStatus = useCallback((txId: string, orderStatus: OrderStatus) => {
    setTransactions((prev) => prev.map((tx) => tx.id === txId ? { ...tx, orderStatus } : tx));
  }, []);

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, updateOrderStatus }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
};
