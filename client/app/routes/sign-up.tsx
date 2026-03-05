import { useState } from "react";
import { Link } from "react-router";

export default function SignUp() {
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Sign Up submitted");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">

        <div className="col-lg-5 col-md-7 col-sm-10">

          {/* Logo / Title */}
          <h4 className="mb-4 text-primary fw-bold text-center">
            USIU Market
          </h4>

          <div
            className="card shadow-sm p-4"
            style={{ borderRadius: "12px" }}
          >
            <h3 className="text-center fw-bold mb-2">Create Your Account</h3>

            <p className="text-center text-muted mb-4">
              Join the USIU Market to buy or sell goods within the student
              community.
            </p>

            <form onSubmit={handleSubmit}>

              {/* Names */}
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="John"
                    required
                  />
                </div>

                <div className="col">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                />
                <div className="form-text">
                  Password must be at least 8 characters long.
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="mb-4">
                <label className="form-label d-block">
                  I want to register as:
                </label>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={role === "buyer"}
                    onChange={() => setRole("buyer")}
                  />
                  <label className="form-check-label">Buyer</label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={role === "seller"}
                    onChange={() => setRole("seller")}
                  />
                  <label className="form-check-label">Seller</label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Create Account
              </button>

            </form>

            <p className="text-center mt-3 mb-0">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Log in
              </Link>
            </p>

          </div>

          <p className="small text-muted mt-4 text-center">
            By clicking 'Create Account', you agree to our Terms of Service and
            Privacy Policy.
          </p>

        </div>

      </div>
    </div>
  );
}