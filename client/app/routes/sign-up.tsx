import { useState } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [
    { title: "Sign Up | Campus Cart" },
    { name: "description", content: "Create your Campus Cart account" },
  ];
}

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/products");
    } catch (err) {
      setError("Cannot connect to server. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@400;500;600&display=swap');

        .auth-page {
          min-height: 100vh;
          background-color: #0a0a0a;
          font-family: 'Instrument Sans', sans-serif;
          display: flex;
          align-items: stretch;
        }

        .auth-left {
          flex: 1;
          background-color: #F44250;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem;
          position: relative;
          overflow: hidden;
        }

        .auth-left::before {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          border: 80px solid rgba(255,255,255,0.08);
          top: -100px;
          right: -100px;
        }

        .auth-left::after {
          content: '';
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          border: 50px solid rgba(255,255,255,0.08);
          bottom: -60px;
          left: -60px;
        }

        .auth-left-content {
          position: relative;
          z-index: 1;
        }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 2.5rem;
          color: white;
          letter-spacing: -1px;
          margin-bottom: 1rem;
        }

        .brand-tagline {
          color: rgba(255,255,255,0.75);
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 320px;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin-top: 2.5rem;
        }

        .feature-list li {
          color: rgba(255,255,255,0.85);
          font-size: 0.95rem;
          padding: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .feature-icon {
          width: 24px;
          height: 24px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 3rem;
          background: #111111;
          overflow-y: auto;
        }

        .auth-form-container {
          width: 100%;
          max-width: 420px;
        }

        .auth-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 2rem;
          color: #ffffff;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .auth-subtitle {
          color: #888;
          margin-bottom: 2.5rem;
          font-size: 0.95rem;
        }

        .auth-subtitle a {
          color: #F44250;
          text-decoration: none;
          font-weight: 500;
        }

        .auth-subtitle a:hover {
          text-decoration: underline;
        }

        .form-label-custom {
          color: #aaa;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          display: block;
        }

        .form-control-custom {
          background: #1a1a1a;
          border: 1.5px solid #2a2a2a;
          border-radius: 10px;
          color: #ffffff;
          padding: 0.85rem 1rem;
          font-size: 0.95rem;
          width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Instrument Sans', sans-serif;
        }

        .form-control-custom:focus {
          border-color: #F44250;
          box-shadow: 0 0 0 3px rgba(244, 66, 80, 0.15);
          background: #1a1a1a;
          color: #ffffff;
        }

        .form-control-custom::placeholder {
          color: #555;
        }

        .btn-auth {
          width: 100%;
          padding: 0.9rem;
          background: #F44250;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'Instrument Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 0.5rem;
        }

        .btn-auth:hover {
          background: #d93340;
          transform: translateY(-1px);
        }

        .btn-auth:active {
          transform: translateY(0);
        }

        .btn-auth:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .error-box {
          background: rgba(244, 66, 80, 0.1);
          border: 1px solid rgba(244, 66, 80, 0.3);
          border-radius: 10px;
          padding: 0.85rem 1rem;
          color: #ff6b75;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .terms-text {
          color: #555;
          font-size: 0.8rem;
          text-align: center;
          margin-top: 1.25rem;
          line-height: 1.5;
        }

        .terms-text a {
          color: #F44250;
          text-decoration: none;
        }

        .password-hint {
          color: #555;
          font-size: 0.78rem;
          margin-top: 0.4rem;
        }

        @media (max-width: 768px) {
          .auth-left { display: none; }
          .auth-right { padding: 2rem 1.5rem; }
          .auth-page { background: #111111; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="auth-page">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="brand-name">Campus Cart</div>
            <p className="brand-tagline">
              Join thousands of students buying and selling on campus.
            </p>
            <ul className="feature-list">
              <li>
                <span className="feature-icon">✓</span>
                Buy and sell within your campus
              </li>
              <li>
                <span className="feature-icon">✓</span>
                Safe and verified student community
              </li>
              <li>
                <span className="feature-icon">✓</span>
                List items in seconds
              </li>
              <li>
                <span className="feature-icon">✓</span>
                Free to use, always
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-form-container">
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">
              Already have an account?{" "}
              <a href="/login">Sign in</a>
            </p>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label-custom">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control-custom"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label-custom">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control-custom"
                  placeholder="you@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label-custom">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control-custom"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <p className="password-hint">Must be at least 6 characters</p>
              </div>

              <div className="form-group">
                <label className="form-label-custom">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control-custom"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <button type="submit" className="btn-auth" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </div>

              <p className="terms-text">
                By signing up you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}