import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import "./SelectCar.css";

function SelectCar() {
  const navigate = useNavigate();
  const [makes, setMakes] = useState([]);
  const [search, setSearch] = useState("");
  const fuelType = localStorage.getItem("selectedFuelType") || "gas";

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/cars?fuel=${fuelType}`)
      .then((res) => res.json())
      .then((data) => setMakes(data.makes));
  }, [fuelType]);

  const filtered = makes.filter((m) =>
    m.make.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectMake = (make) => {
    localStorage.setItem("selectedMake", make);
    navigate("/select-model");
  };

  return (
    <div className="select-car-page">
      <Sidebar />

      <div className="select-car-content">
        <h1>Select Your Vehicle</h1>
        <p className="select-car-sub">
          Choose your manufacturer to configure the dashboard telemetry.
        </p>

        <div className="select-car-search">
          <Search size={18} strokeWidth={1.75} />
          <input
            type="text"
            placeholder="SEARCH MANUFACTURER..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <p className="fuel-filter-label">
          Showing {fuelType.toUpperCase()} vehicles only
        </p>

        <div className="make-grid">
          {filtered.map((brand) => (
            <div
              key={brand.make}
              className="make-card"
              onClick={() => handleSelectMake(brand.make)}
            >
              <img
                className="make-logo"
                src={brand.logo}
                alt={`${brand.make} logo`}
              />
              <span className="make-name">{brand.make}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelectCar;
