import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { ShoppingCart } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(name, email, password, role);
    navigate(redirectTo || (role === "seller" ? "/dashboard" : "/"));
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
            <h1 className="text-2xl font-bold">Create Your Account</h1>
            <p className="text-sm text-muted-foreground">Join the campus marketplace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign up form">
            <div>
              <label htmlFor="signup-name" className="mb-1 block text-sm font-medium">Full Name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="signup-email" className="mb-1 block text-sm font-medium">Email</label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="mb-1 block text-sm font-medium">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="••••••••"
              />
            </div>

            <fieldset>
              <legend className="mb-2 block text-sm font-medium">I want to</legend>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("buyer")}
                  className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    role === "buyer" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                  aria-pressed={role === "buyer"}
                >
                  Buy Items
                </button>
                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    role === "seller" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                  aria-pressed={role === "seller"}
                >
                  Sell Items
                </button>
              </div>
            </fieldset>

            <button type="submit" className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
