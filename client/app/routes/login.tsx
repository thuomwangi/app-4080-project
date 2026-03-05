import { useState } from "react";
import { Link } from "react-router";

export default function Login() {
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ role, email, password });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">

        <div className="col-lg-4 col-md-6 col-sm-10">

          <div
            className="card shadow-sm p-4"
            style={{ borderRadius: "12px" }}
          >
            <h2 className="text-center fw-bold mb-2">
              Welcome Back to USIU Market
            </h2>

            <p className="text-center text-muted mb-4">
              Sign in to access your account as a Buyer or Seller.
            </p>

            {/* Role Toggle */}
            <div className="btn-group w-100 mb-4">
              <button
                type="button"
                className={`btn ${
                  role === "buyer" ? "btn-primary" : "btn-outline-secondary"
                }`}
                onClick={() => setRole("buyer")}
              >
                Buyer
              </button>

              <button
                type="button"
                className={`btn ${
                  role === "seller" ? "btn-primary" : "btn-outline-secondary"
                }`}
                onClick={() => setRole("seller")}
              >
                Seller
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email or Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your email or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-2">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-end mb-3">
                <a href="#" className="small text-primary">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>

              {/* Guest Button */}
              <button type="button" className="btn btn-outline-secondary w-100">
                Continue as Guest
              </button>

            </form>

            <p className="text-center mt-4 mb-0">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-primary">
                Sign Up
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}