import { Car } from "lucide-react";
import "./BrandLogo.css";

function BrandLogo({ className = "" }) {
  return (
    <div className={`brand-logo ${className}`}>
      <Car size={22} strokeWidth={1.75} />
      <div>
        <strong>Sayartak Pro</strong>
        <small>Vehicle Master</small>
      </div>
    </div>
  );
}

export default BrandLogo;
