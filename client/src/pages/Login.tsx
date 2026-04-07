import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { ShoppingCart } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-section">
      <Header />
      <main id="main-content" className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Welcome Back to CampusCart</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign in form">
            <div>
              <label htmlFor="login-email" className="mb-1 block text-sm font-medium">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="you@university.edu"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1 block text-sm font-medium">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Sign In
            </button>
          </form>

          <div className="my-4 flex items-center gap-3" role="separator">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <button className="w-full rounded-lg border border-border py-2.5 text-sm font-medium hover:bg-secondary transition-colors" aria-label="Continue with Google">
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to={`/signup${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="font-medium text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
