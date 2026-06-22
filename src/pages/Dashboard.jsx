import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FilePlus,
  Pencil,
  History,
  Droplets,
  CircleDot,
  Wrench,
  Battery,
  Cog,
  CloudSun,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { getMaintenanceStats } from "../utils/maintenance";
import CarImage from "../components/CarImage";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [vehicle, setVehicle] = useState(null);
  const [stats, setStats] = useState(null);
  const [weather, setWeather] = useState(null);

  const loadVehicle = useCallback(() => {
    fetch(`http://localhost:3000/api/vehicles?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const activeId = localStorage.getItem("activeVehicleId");
        const active =
          data.vehicles.find((v) => v.id === parseInt(activeId)) ||
          data.vehicles.find((v) => v.is_active) ||
          data.vehicles[0];
        if (!active) {
          navigate("/fuel-type");
          return;
        }
        setVehicle(active);
        localStorage.setItem("activeVehicleId", active.id);
        setStats(getMaintenanceStats(active));
      });
  }, [user.id, navigate]);

  useEffect(() => {
    if (!user.id) {
      navigate("/login");
      return;
    }
    loadVehicle();

    fetch("http://localhost:3000/api/weather")
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch(() => setWeather(null));
  }, [user.id, navigate, loadVehicle]);

  const addMaintenanceRecord = async (type, description) => {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch("http://localhost:3000/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleId: vehicle.id,
        type,
        description,
        serviceDate: today,
        mileage: vehicle.mileage,
      }),
    });
    if (res.ok) {
      loadVehicle();
      alert(`${type} recorded in maintenance history!`);
    }
  };

  const handleOilChanged = () => {
    addMaintenanceRecord(
      "OIL CHANGE",
      `Oil changed at ${vehicle.mileage?.toLocaleString()} km`
    );
  };

  const handleTiresChanged = () => {
    addMaintenanceRecord(
      "TIRES",
      `Tires changed at ${vehicle.mileage?.toLocaleString()} km`
    );
  };

  if (!vehicle || !stats) {
    return (
      <div className="dashboard-page">
        <Sidebar />
        <div className="dashboard-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="dashboard-content">
        <div className="dash-hero">
          <div className="dash-hero-info">
            <small>Vehicle ID: SYR-{vehicle.id}</small>
            <h1>
              {vehicle.make} {vehicle.model}
            </h1>
            <p>
              {vehicle.year} | {vehicle.color || "No color set"}
            </p>
          </div>
          <div className="dash-hero-img">
            <CarImage make={vehicle.make} model={vehicle.model} alt="Car" />
            <div className="dash-hero-stats">
              <span>STATUS: ACTIVE</span>
              <strong>{vehicle.mileage?.toLocaleString()} KM</strong>
            </div>
          </div>
        </div>

        <div className="dash-quick-actions">
          <button onClick={() => navigate("/history")}>
            <FilePlus size={16} strokeWidth={1.75} />
            Add Record
          </button>
          <button onClick={() => navigate("/vehicle-setup")}>
            <Pencil size={16} strokeWidth={1.75} />
            Edit Car
          </button>
          <button onClick={() => navigate("/history")}>
            <History size={16} strokeWidth={1.75} />
            View History
          </button>
        </div>

        <div className="dash-health">
          <h2>Maintenance Health</h2>
          <div className="health-icons">
            {vehicle.fuel_type !== "electric" && (
              <div className={`health-item ${stats.health.oil}`}>
                <Droplets size={22} strokeWidth={1.75} />
                <small>Oil</small>
              </div>
            )}
            <div className={`health-item ${stats.health.tires}`}>
              <CircleDot size={22} strokeWidth={1.75} />
              <small>Tires</small>
            </div>
            <div className={`health-item ${stats.health.brakes}`}>
              <Wrench size={22} strokeWidth={1.75} />
              <small>Brakes</small>
            </div>
            <div className={`health-item ${stats.health.battery}`}>
              <Battery size={22} strokeWidth={1.75} />
              <small>Battery</small>
            </div>
            <div className={`health-item ${stats.health.transmission}`}>
              <Cog size={22} strokeWidth={1.75} />
              <small>Trans</small>
            </div>
          </div>
        </div>

        <div className="dash-grid">
          <div className="dash-gauges">
            {vehicle.fuel_type !== "electric" && (
              <div className="gauge-card">
                <div className="gauge-header">
                  <h3>Oil Life ({stats.oilLife}%)</h3>
                  <button className="changed-btn" onClick={handleOilChanged}>
                    Changed
                  </button>
                </div>
                <div className="gauge-bar">
                  <div
                    className="gauge-fill orange"
                    style={{ width: `${stats.oilLife}%` }}
                  ></div>
                </div>
                <div className="gauge-labels">
                  <span>{stats.kmSinceOilChange} KM SINCE CHANGE</span>
                  <span>{stats.oilKmLeft} KM LEFT</span>
                </div>
              </div>
            )}

            <div className="gauge-card">
              <div className="gauge-header">
                <h3>Tire Condition ({stats.tireLife}%)</h3>
                <button className="changed-btn" onClick={handleTiresChanged}>
                  Changed
                </button>
              </div>
              <div className="gauge-bar">
                <div
                  className="gauge-fill blue"
                  style={{ width: `${stats.tireLife}%` }}
                ></div>
              </div>
              <div className="gauge-labels">
                <span>OPTIMAL</span>
                <span>{stats.tireYearsLeft} YEARS LEFT</span>
              </div>
            </div>
          </div>

          <div className="dash-side">
            {weather?.tip && (
              <div className="weather-card">
                <h3>
                  <CloudSun size={18} strokeWidth={1.75} />
                  Weather Alert — {weather.city || "Amman"}
                  {weather.temp != null && ` (${weather.temp}°C)`}
                </h3>
                <p>{weather.tip}</p>
              </div>
            )}

            <div className="actions-card">
              <h3>Recommended Actions</h3>
              {stats.actions.map((action, i) => (
                <div key={i} className={`action-item ${action.level}`}>
                  {action.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
