import { useState } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [
    { title: "Login | Campus Cart" },
    { name: "description", content: "Login to Campus Cart" },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/seller-dashboard");
      } else {
        navigate("/products");
      }
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

        .brand-dots {
          display: flex;
          gap: 8px;
          margin-top: 3rem;
        }

        .brand-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
        }

        .brand-dot.active {
          background: white;
          width: 30px;
          border-radius: 5px;
        }

        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 3rem;
          background: #111111;
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

        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          color: #444;
          font-size: 0.8rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #2a2a2a;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .forgot-link {
          color: #666;
          font-size: 0.85rem;
          text-decoration: none;
          float: right;
          margin-top: 0.5rem;
        }

        .forgot-link:hover {
          color: #F44250;
        }

        @media (max-width: 768px) {
          .auth-left { display: none; }
          .auth-right { padding: 2rem 1.5rem; }
          .auth-page { background: #111111; }
        }
      `}</style>

      <div className="auth-page">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="brand-name">Campus Cart</div>
            <p className="brand-tagline">
              The marketplace built for students. Buy, sell, and discover deals on your campus.
            </p>
            <div className="brand-dots">
              <div className="brand-dot active"></div>
              <div className="brand-dot"></div>
              <div className="brand-dot"></div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-form-container">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">
              Don't have an account?{" "}
              <a href="/sign-up">Sign up for free</a>
            </p>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <button type="submit" className="btn-auth" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}