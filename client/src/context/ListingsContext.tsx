import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/data/products";

interface ListingsContextType {
  userListings: Product[];
  addListing: (listing: Product) => void;
  updateListing: (id: string, listing: Partial<Product>) => void;
  deleteListing: (id: string) => void;
  drafts: Partial<Product & { formData?: any }>[];
  saveDraft: (draft: any) => void;
  clearDraft: () => void;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const ListingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userListings, setUserListings] = useState<Product[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);

  const addListing = useCallback((listing: Product) => {
    setUserListings((prev) => [listing, ...prev]);
  }, []);

  const updateListing = useCallback((id: string, updates: Partial<Product>) => {
    setUserListings((prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteListing = useCallback((id: string) => {
    setUserListings((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const saveDraft = useCallback((draft: any) => {
    setDrafts([draft]);
  }, []);

  const clearDraft = useCallback(() => {
    setDrafts([]);
  }, []);

  return (
    <ListingsContext.Provider value={{ userListings, addListing, updateListing, deleteListing, drafts, saveDraft, clearDraft }}>
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used within ListingsProvider");
  return ctx;
};
