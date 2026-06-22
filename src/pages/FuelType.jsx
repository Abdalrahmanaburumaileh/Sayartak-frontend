import { useNavigate } from "react-router-dom";
import { Car, Fuel, Leaf, Zap } from "lucide-react";
import "./FuelType.css";

const fuelOptions = [
  {
    id: "gas",
    title: "Gas",
    description: "Internal Combustion Engine (ICE) vehicles",
    icon: Fuel,
    popular: false,
  },
  {
    id: "hybrid",
    title: "Hybrid",
    description: "Combined electrical and fuel performance",
    icon: Leaf,
    popular: true,
  },
  {
    id: "electric",
    title: "Electric",
    description: "Full Battery Electric Vehicles (BEV)",
    icon: Zap,
    popular: false,
  },
];

function FuelType() {
  const navigate = useNavigate();

  const handleSelect = (fuelType) => {
    localStorage.setItem("selectedFuelType", fuelType);
    navigate("/select-car");
  };

  const handleCancel = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="fuel-page">
      <header className="fuel-header">
        <div className="fuel-logo">
          <Car className="fuel-car-icon" size={28} strokeWidth={1.75} />
          <span className="fuel-brand">Sayartak</span>
        </div>
        <button className="fuel-cancel" onClick={handleCancel}>
          CANCEL
        </button>
      </header>

      <main className="fuel-main">
        <h1 className="fuel-title">Select Fuel Type</h1>
        <p className="fuel-subtitle">
          Choose your vehicle&apos;s power source to calibrate the instrument
          cluster and maintenance intervals.
        </p>

        <div className="fuel-cards">
          {fuelOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className={`fuel-card ${option.id === "hybrid" ? "highlighted" : ""}`}
              >
                {option.popular && (
                  <span className="fuel-popular">POPULAR</span>
                )}
                <div className="fuel-icon-box">
                  <Icon size={28} strokeWidth={1.75} />
                </div>
                <h2>{option.title}</h2>
                <p>{option.description}</p>
                <button onClick={() => handleSelect(option.id)}>
                  SELECT ENGINE
                </button>
              </div>
            );
          })}
        </div>

        <div className="fuel-progress">
          <div className="fuel-progress-bar">
            <div className="fuel-progress-fill"></div>
            <div className="fuel-progress-empty"></div>
            <div className="fuel-progress-empty"></div>
          </div>
          <p>STEP 1 OF 3: CONFIGURATION</p>
        </div>

        <div className="fuel-engine-image">
          <img src="/car-bg.avif" alt="Engine" />
        </div>
      </main>
    </div>
  );
}

export default FuelType;
