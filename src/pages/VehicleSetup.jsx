import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import Sidebar from "../components/Sidebar";
import CarImage from "../components/CarImage";
import "./VehicleSetup.css";

function VehicleSetup() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const activeVehicleId = localStorage.getItem("activeVehicleId");

  const [make, setMake] = useState(localStorage.getItem("selectedMake") || "");
  const [model, setModel] = useState(localStorage.getItem("selectedModel") || "");
  const [fuelType, setFuelType] = useState(
    localStorage.getItem("selectedFuelType") || "gas"
  );
  const [editMode, setEditMode] = useState(false);

  const [year, setYear] = useState(new Date().getFullYear());
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState("");
  const [lastOilChangeMileage, setLastOilChangeMileage] = useState("");
  const [lastTireChange, setLastTireChange] = useState("");
  const [lastBatteryCheck, setLastBatteryCheck] = useState("");

  useEffect(() => {
    if (activeVehicleId && !localStorage.getItem("selectedMake")) {
      fetch(`http://localhost:3000/api/vehicles/${activeVehicleId}`)
        .then((res) => res.json())
        .then((data) => {
          const v = data.vehicle;
          setEditMode(true);
          setMake(v.make);
          setModel(v.model);
          setFuelType(v.fuel_type);
          setYear(v.year);
          setMileage(v.mileage);
          setColor(v.color || "");
          setLastOilChangeMileage(v.last_oil_change_mileage || "");
          setLastTireChange(v.last_tire_change?.split("T")[0] || "");
          setLastBatteryCheck(v.last_battery_check?.split("T")[0] || "");
        });
    }
  }, [activeVehicleId]);

  const handleSave = async (e) => {
    e.preventDefault();

    const body = {
      year,
      mileage: parseInt(mileage) || 0,
      color,
      lastOilChangeMileage:
        fuelType !== "electric"
          ? parseInt(lastOilChangeMileage) || 0
          : undefined,
      lastTireChange: lastTireChange || null,
      lastBatteryCheck: lastBatteryCheck || null,
    };

    if (editMode) {
      const res = await fetch(
        `http://localhost:3000/api/vehicles/${activeVehicleId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (res.ok) navigate("/dashboard");
      return;
    }

    const res = await fetch("http://localhost:3000/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        make,
        model,
        fuelType,
        ...body,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("activeVehicleId", data.vehicle.id);
      localStorage.removeItem("selectedMake");
      localStorage.removeItem("selectedModel");
      localStorage.removeItem("selectedFuelType");
      navigate("/dashboard");
    } else {
      alert(data.message || "Failed to save vehicle");
    }
  };

  if (!make || !model) {
    if (!editMode) {
      navigate("/select-car");
      return null;
    }
  }

  return (
    <div className="setup-page">
      <Sidebar />

      <div className="setup-content">
        <div className="setup-hero">
          <CarImage make={make} model={model} alt="Your car" />
          <div className="setup-hero-overlay">
            <span className="setup-badge">Active Vehicle</span>
            <h1>
              {make} {model}
            </h1>
          </div>
        </div>

        <div className="setup-grid">
          <div className="setup-info-card">
            <h3>
              <Info size={18} strokeWidth={1.75} />
              Vehicle Insight
            </h3>
            <p>
              Keeping your vehicle data up to date ensures precise maintenance
              alerts and performance optimization.
            </p>
            <span className="setup-status">● In Service</span>
          </div>

          <div className="setup-form-card">
            <h3>Maintenance Specifications</h3>
            <form onSubmit={handleSave}>
              <div className="setup-field">
                <label>Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>

              <div className="setup-field">
                <label>Current Mileage (KM)</label>
                <input
                  type="number"
                  placeholder="12450"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  required
                />
              </div>

              <div className="setup-field">
                <label>Color</label>
                <input
                  type="text"
                  placeholder="Metallic Jet Black"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              {fuelType !== "electric" && (
                <div className="setup-field">
                  <label>Last Oil Change Mileage (KM)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10000"
                    value={lastOilChangeMileage}
                    onChange={(e) => setLastOilChangeMileage(e.target.value)}
                  />
                  <small className="field-hint">
                    Enter the km reading when you last changed the oil
                  </small>
                </div>
              )}

              <div className="setup-field">
                <label>Last Tire Change (Date)</label>
                <input
                  type="date"
                  value={lastTireChange}
                  onChange={(e) => setLastTireChange(e.target.value)}
                />
              </div>

              <div className="setup-field">
                <label>Optional Battery Check Date</label>
                <input
                  type="date"
                  value={lastBatteryCheck}
                  onChange={(e) => setLastBatteryCheck(e.target.value)}
                />
              </div>

              <div className="setup-buttons">
                <button
                  type="button"
                  onClick={() => navigate(editMode ? "/dashboard" : "/select-model")}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleSetup;
