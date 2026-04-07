import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ListingsProvider } from "@/context/ListingsContext";
import { SupportProvider } from "@/context/SupportContext";
import { TransactionProvider } from "@/context/TransactionContext";
import Index from "./pages/Index";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import PostItem from "./pages/PostItem";
import Support from "./pages/Support";
import CreateTicket from "./pages/CreateTicket";
import AdminDashboard from "./pages/AdminDashboard";
import TransactionHistory from "./pages/TransactionHistory";
import Receipt from "./pages/Receipt";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <ListingsProvider>
        <TransactionProvider>
        <SupportProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/post-item" element={<PostItem />} />
              <Route path="/support" element={<Support />} />
              <Route path="/support/create" element={<CreateTicket />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/transactions" element={<TransactionHistory />} />
              <Route path="/receipt/:id" element={<Receipt />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </SupportProvider>
        </TransactionProvider>
        </ListingsProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
