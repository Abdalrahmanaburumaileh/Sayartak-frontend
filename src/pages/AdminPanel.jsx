import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Users,
  Search,
  Pencil,
  Trash2,
  LogOut,
  Plus,
} from "lucide-react";
import { adminFetch } from "../utils/api";
import "./AdminPanel.css";

function AdminPanel() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [draftId] = useState(() => `DRAFT_${Date.now().toString().slice(-4)}`);

  const [form, setForm] = useState({
    make: "",
    model: "",
    fuel: "electric",
    logoUrl: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const res = await adminFetch("/users");
    const data = await res.json();
    if (res.ok) {
      setUsers(data.users || []);
    } else if (res.status === 401 || res.status === 403) {
      navigate("/login");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ make: "", model: "", fuel: "electric", logoUrl: "", imageUrl: "" });
    setMessage("");
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await adminFetch("/cars", {
      method: "POST",
      body: JSON.stringify({
        make: form.make,
        model: form.model,
        fuel: form.fuel,
        logoUrl: form.logoUrl,
        imageUrl: form.imageUrl,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setMessage("Vehicle added to catalog successfully.");
      setForm({ make: "", model: "", fuel: "electric", logoUrl: "", imageUrl: "" });
    } else {
      setMessage(data.message || "Failed to add vehicle");
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    const res = await adminFetch(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      loadUsers();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Delete this user and all their vehicles?")) return;

    const res = await adminFetch(`/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      loadUsers();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to delete user");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const initials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <strong>Sayartak Admin</strong>
          <small>Fleet Management</small>
        </div>

        <nav className="admin-nav">
          <button type="button" className="admin-nav-btn active">
            <Plus size={16} strokeWidth={2} />
            Add Vehicle
          </button>
        </nav>

        <button type="button" className="admin-logout" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={1.75} />
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <small>FLEET COMMAND / ADD NEW VEHICLE</small>
            <h1>Admin Panel – Add New Vehicle</h1>
            <p>
              Manage and add new vehicles to the system database with precision
              tracking and automated maintenance scheduling.
            </p>
          </div>
          <div className="admin-header-actions">
            <div className="admin-avatar">{initials(user.full_name)}</div>
          </div>
        </header>

        <div className="admin-grid">
          <section className="admin-card add-car-card">
            <div className="admin-card-head">
              <h2>
                <Car size={18} strokeWidth={1.75} />
                Add New Car
              </h2>
              <span className="draft-id">{draftId}</span>
            </div>

            <form onSubmit={handleAddCar} className="add-car-form">
              <div className="add-car-columns">
                <div className="add-car-fields">
                  <div className="admin-field">
                    <label>CAR MAKE</label>
                    <input
                      placeholder="e.g. Porsche"
                      value={form.make}
                      onChange={(e) =>
                        setForm({ ...form, make: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label>CAR MODEL</label>
                    <input
                      placeholder="e.g. Taycan Turbo S"
                      value={form.model}
                      onChange={(e) =>
                        setForm({ ...form, model: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label>FUEL TYPE</label>
                    <select
                      value={form.fuel}
                      onChange={(e) =>
                        setForm({ ...form, fuel: e.target.value })
                      }
                    >
                      <option value="gas">Gas</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                </div>

                <div className="url-panels">
                  <div className="image-url-panel">
                    <label>LOGO URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={form.logoUrl}
                      onChange={(e) =>
                        setForm({ ...form, logoUrl: e.target.value })
                      }
                    />
                    <small className="field-hint">
                      Brand logo link — saved as text in the database.
                    </small>
                    {form.logoUrl ? (
                      <img
                        src={form.logoUrl}
                        alt="Logo preview"
                        className="image-preview logo-preview"
                      />
                    ) : (
                      <div className="image-placeholder small">
                        <span>Logo preview</span>
                      </div>
                    )}
                  </div>

                  <div className="image-url-panel">
                    <label>IMAGE URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/car.png"
                      value={form.imageUrl}
                      onChange={(e) =>
                        setForm({ ...form, imageUrl: e.target.value })
                      }
                    />
                    <small className="field-hint">
                      Paste the image link — saved as text in the database.
                    </small>
                    {form.imageUrl ? (
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="image-preview"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <Car size={32} strokeWidth={1.5} />
                        <span>Image preview</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {message && <p className="admin-message">{message}</p>}

              <div className="admin-form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  CANCEL
                </button>
                <button type="submit" className="submit-btn" disabled={saving}>
                  {saving ? "ADDING..." : "ADD VEHICLE"}
                </button>
              </div>
            </form>
          </section>

          <section className="admin-card users-card">
            <div className="admin-card-head">
              <h2>
                <Users size={18} strokeWidth={1.75} />
                System Users
              </h2>
              <div className="admin-search">
                <Search size={16} strokeWidth={1.75} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <p className="admin-loading">Loading users...</p>
            ) : (
              <div className="users-table-wrap">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>USER</th>
                      <th>ROLE</th>
                      <th>JOINED DATE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="user-cell">
                            <span className="user-avatar">
                              {initials(u.full_name)}
                            </span>
                            <div>
                              <strong>{u.full_name}</strong>
                              <small>{u.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <select
                            className="role-select"
                            value={u.role}
                            onChange={(e) =>
                              handleUpdateUser(u.id, { role: e.target.value })
                            }
                          >
                            <option value="admin">Admin</option>
                            <option value="driver">Driver</option>
                          </select>
                        </td>
                        <td>{formatDate(u.created_at)}</td>
                        <td>
                          <span
                            className={`status-badge ${u.status === "active" ? "active" : "inactive"}`}
                          >
                            {u.status?.toUpperCase() || "ACTIVE"}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button
                              type="button"
                              title="Toggle status"
                              onClick={() =>
                                handleUpdateUser(u.id, {
                                  status:
                                    u.status === "active" ? "inactive" : "active",
                                })
                              }
                            >
                              <Pencil size={14} strokeWidth={1.75} />
                            </button>
                            <button
                              type="button"
                              title="Delete user"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              <Trash2 size={14} strokeWidth={1.75} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
