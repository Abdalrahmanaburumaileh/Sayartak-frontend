import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Settings, Car, LogOut, Plus, Pencil } from "lucide-react";
import Sidebar from "../components/Sidebar";
import CarImage from "../components/CarImage";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!storedUser.id) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/api/profile/${storedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message && !data.user) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setUser(data.user);
        setVehicles(data.vehicles || []);
        setForm({
          fullName: data.user.full_name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, [storedUser.id, navigate]);

  const handleSave = async () => {
    const res = await fetch(
      `http://localhost:3000/api/profile/${storedUser.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...data.user, full_name: data.user.full_name })
      );
      setEditing(false);
    } else {
      alert(data.message || "Failed to save");
    }
  };

  const handleSelectVehicle = async (vehicleId) => {
    await fetch(`http://localhost:3000/api/vehicles/${vehicleId}/activate`, {
      method: "PUT",
    });
    localStorage.setItem("activeVehicleId", vehicleId);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Sidebar />
        <div className="profile-content">
          <p className="profile-loading">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-page">
        <Sidebar />
        <div className="profile-content">
          <p className="profile-error">
            {error || "Could not load profile."}
          </p>
          <p className="profile-error-hint">
            Make sure you ran setup-vehicles-and-history.sql and the backend is running.
          </p>
        </div>
      </div>
    );
  }

  const activeCount = vehicles.filter((v) => v.is_active).length;
  const memberSince = user.created_at
    ? new Date(user.created_at).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="profile-page">
      <Sidebar />

      <div className="profile-content">
        <div className="profile-top">
          <div className="profile-user-card">
            <div className="profile-avatar">
              <UserIcon size={28} strokeWidth={1.75} />
            </div>
            <div>
              <h1>{user.full_name}</h1>
              <p>{user.email}</p>
              <div className="profile-badges">
                <span className="badge blue">PREMIUM MEMBER</span>
                <span className="badge gray">SINCE {memberSince}</span>
              </div>
            </div>
          </div>

          <div className="profile-stats-card">
            <small>VEHICLES IN GARAGE</small>
            <strong>{String(vehicles.length).padStart(2, "0")}</strong>
            <p>{activeCount} Active • {vehicles.length - activeCount} Others</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-details-card">
            <div className="card-header">
              <h3>
                <UserIcon size={18} strokeWidth={1.75} />
                Account Details
              </h3>
              <button onClick={() => setEditing(!editing)}>
                {editing ? (
                  "Cancel"
                ) : (
                  <>
                    <Pencil size={14} strokeWidth={1.75} />
                    EDIT INFO
                  </>
                )}
              </button>
            </div>

            {editing ? (
              <div className="profile-form">
                <label>Full Name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
                <label>Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <label>Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <button className="save-profile-btn" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="profile-fields">
                <div className="field-box">
                  <small>Full Name</small>
                  <p>{user.full_name}</p>
                </div>
                <div className="field-box">
                  <small>Email Address</small>
                  <p>{user.email}</p>
                </div>
                <div className="field-box">
                  <small>Phone Number</small>
                  <p>{user.phone || "Not set"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="profile-side">
            <div className="profile-prefs-card">
              <h3>
                <Settings size={18} strokeWidth={1.75} />
                Preferences
              </h3>
              <p>Push Notifications: ON</p>
              <p>Dark Interface: ON</p>
              <p>Language: ENGLISH</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} strokeWidth={1.75} />
              LOGOUT SESSION
            </button>
          </div>
        </div>

        <div className="profile-vehicles">
          <h3>
            <Car size={18} strokeWidth={1.75} />
            Primary Vehicles
          </h3>
          <div className="vehicle-list">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className={`vehicle-card ${v.is_active ? "active" : ""}`}
                onClick={() => handleSelectVehicle(v.id)}
              >
                <CarImage make={v.make} model={v.model} alt="Car" />
                <p>
                  {v.make} {v.model} • {v.year}
                </p>
                {v.is_active && <span className="active-tag">ACTIVE</span>}
              </div>
            ))}
            <div
              className="vehicle-card add-card"
              onClick={() => navigate("/fuel-type")}
            >
              <Plus size={28} strokeWidth={1.75} />
              <p>ADD VEHICLE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
