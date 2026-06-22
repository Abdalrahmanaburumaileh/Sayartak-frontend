import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Check, ArrowLeft, ArrowRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import "./SelectCar.css";
import "./SelectModel.css";

function SelectModel() {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [makeName, setMakeName] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [search, setSearch] = useState("");

  const fuelType = localStorage.getItem("selectedFuelType") || "gas";
  const make = localStorage.getItem("selectedMake") || "";

  useEffect(() => {
    if (!make) {
      navigate("/select-car");
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/cars/${make}?fuel=${fuelType}`)
      .then((res) => res.json())
      .then((data) => {
        setMakeName(data.make);
        setModels(data.models);
      });
  }, [make, fuelType, navigate]);

  const filtered = models.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = () => {
    if (!selectedModel) {
      alert("Please select a model");
      return;
    }
    localStorage.setItem("selectedModel", selectedModel);
    navigate("/vehicle-setup");
  };

  return (
    <div className="select-car-page">
      <Sidebar />

      <div className="select-car-content model-page">
        <p className="selected-brand">SELECTED BRAND: {makeName.toUpperCase()}</p>
        <h1>Select Your Model</h1>
        <p className="select-car-sub">
          Choose your vehicle model to continue setup
        </p>

        <div className="select-car-search">
          <Search size={18} strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="model-grid">
          {filtered.map((model) => (
            <div
              key={model.name}
              className={`model-card ${selectedModel === model.name ? "selected" : ""}`}
              onClick={() => setSelectedModel(model.name)}
            >
              <span className="model-tag">{model.tag}</span>
              {selectedModel === model.name && (
                <span className="model-check">
                  <Check size={14} strokeWidth={2.5} />
                </span>
              )}
              <img
                className="model-image"
                src={model.image_url || "/car-bg.avif"}
                alt={model.name}
              />
              <h3>{model.name}</h3>
              <p>{model.fuel} engine</p>
            </div>
          ))}
        </div>

        <div className="model-actions">
          <button className="back-btn" onClick={() => navigate("/select-car")}>
            <ArrowLeft size={16} strokeWidth={1.75} />
            Back
          </button>
          <button className="continue-btn" onClick={handleContinue}>
            Continue to Setup
            <ArrowRight size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectModel;
