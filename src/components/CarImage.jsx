import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3000/api";

function CarImage({ make, model, imageUrl, alt = "Car", className = "" }) {
  const [src, setSrc] = useState(imageUrl || "/car-bg.avif");

  useEffect(() => {
    if (imageUrl) {
      setSrc(imageUrl);
      return;
    }

    if (!make || !model) {
      setSrc("/car-bg.avif");
      return;
    }

    fetch(
      `${API_BASE}/cars/image?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`
    )
      .then((res) => res.json())
      .then((data) => setSrc(data.image_url || "/car-bg.avif"))
      .catch(() => setSrc("/car-bg.avif"));
  }, [make, model, imageUrl]);

  return <img src={src} alt={alt} className={className} />;
}

export default CarImage;
