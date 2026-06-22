import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import "./History.css";

function History() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [vehicle, setVehicle] = useState(null);
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "OIL CHANGE",
    description: "",
    serviceDate: "",
    mileage: "",
  });

  const loadData = () => {
    fetch(`http://localhost:3000/api/vehicles?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const activeId = localStorage.getItem("activeVehicleId");
        const active =
          data.vehicles.find((v) => v.id === parseInt(activeId)) ||
          data.vehicles.find((v) => v.is_active) ||
          data.vehicles[0];
        setVehicle(active);
        if (active) {
          fetch(`http://localhost:3000/api/maintenance?vehicleId=${active.id}`)
            .then((res) => res.json())
            .then((d) => setRecords(d.records));
        }
      });
  };

  useEffect(() => {
    if (!user.id) {
      navigate("/login");
      return;
    }
    loadData();
  }, [user.id, navigate]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleId: vehicle.id,
        type: form.type,
        description: form.description,
        serviceDate: form.serviceDate,
        mileage: parseInt(form.mileage),
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ type: "OIL CHANGE", description: "", serviceDate: "", mileage: "" });
      loadData();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    await fetch(`http://localhost:3000/api/maintenance/${id}`, {
      method: "DELETE",
    });
    loadData();
  };

  if (!vehicle) return null;

  const totalServices = records.length;
  const lastService = records[0];
  const avgMileage =
    records.length > 0
      ? Math.round(
          records.reduce((sum, r) => sum + r.mileage, 0) / records.length
        )
      : 0;

  return (
    <div className="history-page">
      <Sidebar />

      <div className="history-content">
        <div className="history-header">
          <div>
            <h1>Maintenance History</h1>
            <p>
              Detailed log of all service records for your {vehicle.year}{" "}
              {vehicle.make} {vehicle.model}.
            </p>
          </div>
          <button className="add-record-btn" onClick={() => setShowForm(true)}>
            + Add Record
          </button>
        </div>

        <div className="history-stats">
          <div className="stat-card">
            <small>TOTAL SERVICES</small>
            <strong>{totalServices}</strong>
          </div>
          <div className="stat-card">
            <small>LAST SERVICE</small>
            <strong>
              {lastService
                ? new Date(lastService.service_date).toLocaleDateString()
                : "—"}
            </strong>
          </div>
          <div className="stat-card">
            <small>AVG MILEAGE</small>
            <strong>{avgMileage.toLocaleString()} km</strong>
          </div>
          <div className="stat-card highlight">
            <small>NEXT OIL DUE</small>
            <strong>
              {vehicle.last_oil_change_mileage
                ? (vehicle.last_oil_change_mileage + 5000).toLocaleString()
                : "—"}{" "}
              km
            </strong>
          </div>
        </div>

        {showForm && (
          <form className="add-form" onSubmit={handleAdd}>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>OIL CHANGE</option>
              <option>TIRES</option>
              <option>BRAKE SYSTEM</option>
              <option>BATTERY</option>
              <option>TRANSMISSION</option>
            </select>
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              type="date"
              value={form.serviceDate}
              onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Mileage"
              value={form.mileage}
              onChange={(e) => setForm({ ...form, mileage: e.target.value })}
              required
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        )}

        <div className="history-table-wrap">
          <table className="history-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Service Description</th>
              <th>Date</th>
              <th>Mileage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>
                  <span className="type-badge">{r.type}</span>
                </td>
                <td>{r.description}</td>
                <td>{new Date(r.service_date).toLocaleDateString()}</td>
                <td>{r.mileage?.toLocaleString()} km</td>
                <td>
                  <button onClick={() => handleDelete(r.id)}>
                    <Trash2 size={16} strokeWidth={1.75} />
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-row">
                  No maintenance records yet. Add your first record!
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default History;
