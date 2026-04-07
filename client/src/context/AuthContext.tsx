import React, { createContext, useContext, useState, useCallback } from "react";

export interface User {
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  joinDate: string;
  status: "active" | "pending" | "suspended";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string, role: "buyer" | "seller") => void;
  logout: () => void;
  isAuthenticated: boolean;
  allUsers: User[];
  approveUser: (email: string) => void;
  rejectUser: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  { name: "Admin", email: "admin@yopmail.com", role: "admin", joinDate: "2025-01-15", status: "active" },
  { name: "Alex Johnson", email: "alex@university.edu", role: "seller", joinDate: "2025-06-10", status: "active" },
  { name: "Sarah Kim", email: "sarah@university.edu", role: "seller", joinDate: "2025-07-20", status: "active" },
  { name: "Mike Chen", email: "mike@university.edu", role: "buyer", joinDate: "2025-08-05", status: "active" },
  { name: "Emma Davis", email: "emma@university.edu", role: "buyer", joinDate: "2025-09-01", status: "active" },
  { name: "Tom Wilson", email: "tom@university.edu", role: "seller", joinDate: "2026-01-12", status: "pending" },
  { name: "Lisa Park", email: "lisa@university.edu", role: "seller", joinDate: "2026-02-28", status: "pending" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);

  const login = useCallback((email: string, _password: string) => {
    // Check for admin
    if (email === "admin@yopmail.com") {
      const admin = { name: "Admin", email, role: "admin" as const, joinDate: "2025-01-15", status: "active" as const };
      setUser(admin);
      return;
    }
    const existing = allUsers.find((u) => u.email === email);
    if (existing) {
      setUser(existing);
    } else {
      setUser({ name: email.split("@")[0], email, role: "seller", joinDate: new Date().toISOString().slice(0, 10), status: "active" });
    }
  }, [allUsers]);

  const signup = useCallback((name: string, email: string, _password: string, role: "buyer" | "seller") => {
    const newUser: User = { name, email, role, joinDate: new Date().toISOString().slice(0, 10), status: role === "seller" ? "pending" : "active" };
    setAllUsers((prev) => [...prev, newUser]);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const approveUser = useCallback((email: string) => {
    setAllUsers((prev) => prev.map((u) => u.email === email ? { ...u, status: "active" as const } : u));
  }, []);

  const rejectUser = useCallback((email: string) => {
    setAllUsers((prev) => prev.map((u) => u.email === email ? { ...u, status: "suspended" as const } : u));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, allUsers, approveUser, rejectUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
