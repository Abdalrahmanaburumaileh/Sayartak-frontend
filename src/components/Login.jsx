import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(import.meta.env.VITE_API_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin");
        return;
      }

      const vehiclesRes = await fetch(
        `${import.meta.env.VITE_API_URL}/vehicles?userId=${data.user.id}`
      );
      const vehiclesData = await vehiclesRes.json();
      if (vehiclesData.vehicles?.length > 0) {
        const active =
          vehiclesData.vehicles.find((v) => v.is_active) ||
          vehiclesData.vehicles[0];
        localStorage.setItem("activeVehicleId", active.id);
        navigate("/dashboard");
      } else {
        navigate("/fuel-type");
      }
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <BrandLogo />
      </div>

      <div className="login-form">
        <h2 className="login-title">Login</h2>
        <div className="login-underline"></div>

        <form onSubmit={handleLogin}>
          <div className="field-group">
            <label className="field-label">Email</label>
            <div className="field-wrapper">
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
              />
              <span className="field-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M16 8v1a4 4 0 0 0 4 4" />
                  <path d="M21 8A9 9 0 1 0 12 21" />
                </svg>
              </span>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <div className="field-wrapper">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
              />
              <span className="field-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn">Login &rarr;</button>
        </form>
      </div>

      <div className="below-card">
        <div className="divider">
          <span className="divider-line"></span>
          <span className="divider-text">New technician?</span>
          <span className="divider-line"></span>
        </div>
        <Link to="/register" className="register-btn">
          Register New Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
