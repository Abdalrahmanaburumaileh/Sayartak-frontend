import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch(import.meta.env.VITE_API_URL + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Account created! Please login.");
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="reg-page">
      <nav className="reg-nav">
        <BrandLogo />
        <div className="reg-nav-links">
          <Link to="/login" className="nav-link">LOGIN</Link>
          <span className="nav-link active">REGISTER</span>
        </div>
      </nav>

      <main className="reg-main">
        <div className="reg-left">
          <h1 className="reg-headline">
            Precision Care for Your{" "}
            <span className="reg-highlight">Performance</span> Machine.
          </h1>
          <p className="reg-subtext">
            Join the exclusive community of proactive vehicle owners. Track,
            maintain, and master your garage with dashboard-level technical
            clarity.
          </p>

          <div className="launch-card">
            <div className="launch-icon">&#9881;</div>
            <div>
              <p className="launch-label">READY TO LAUNCH</p>
              <p className="launch-title">Vehicle Master v2.4</p>
            </div>
          </div>
        </div>

        <div className="reg-card">
          <h2>Create Account</h2>
          <p className="reg-card-sub">Initialize your vehicle management profile.</p>

          <form onSubmit={handleRegister}>
            <div className="reg-form-group">
              <label>FULL NAME</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="reg-form-group">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="driver@sayartak.pro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="reg-row">
              <div className="reg-form-group">
                <label>PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="reg-form-group">
                <label>CONFIRM</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="create-btn">
              Create Account &rarr;
            </button>
          </form>

          <p className="already-registered">
            Already registered?{" "}
            <Link to="/login" className="login-here">
              LOGIN HERE
            </Link>
          </p>
        </div>
      </main>

      <footer className="reg-footer">
        <div className="footer-left">
          <div className="footer-stat">
            <span className="footer-stat-label">ENGINE STATUS</span>
            <div className="footer-bar">
              <div className="footer-bar-fill" style={{ width: "70%" }}></div>
            </div>
          </div>
          <div className="footer-stat">
            <span className="footer-stat-label">SYSTEM CONNECTIVITY</span>
            <div className="footer-bar">
              <div className="footer-bar-fill" style={{ width: "85%" }}></div>
            </div>
          </div>
        </div>
        <p className="footer-copy">
          &copy; 2024 SAYARTAK AUTOMOTIVE TECHNOLOGIES. ALL SYSTEMS NOMINAL.
        </p>
      </footer>
    </div>
  );
};

export default Register;
