const OIL_INTERVAL_KM = 5000;
const TIRE_INTERVAL_YEARS = 5;
const BATTERY_INTERVAL_YEARS = 2;
const BRAKE_INTERVAL_KM = 20000;
const TRANSMISSION_INTERVAL_KM = 60000;

export function getMaintenanceStats(vehicle) {
  const mileage = vehicle.mileage || 0;
  const fuelType = vehicle.fuel_type;

  // Oil life: km driven since last oil change vs 5000 km interval
  let oilLife = 100;
  let oilKmLeft = OIL_INTERVAL_KM;
  let kmSinceOilChange = 0;

  if (fuelType !== "electric" && vehicle.last_oil_change_mileage != null) {
    kmSinceOilChange = Math.max(0, mileage - vehicle.last_oil_change_mileage);
    oilKmLeft = Math.max(0, OIL_INTERVAL_KM - kmSinceOilChange);
    oilLife = Math.max(0, Math.min(100, (oilKmLeft / OIL_INTERVAL_KM) * 100));
  }

  // Tire life (based on 5 years from last tire change date)
  let tireLife = 100;
  let tireYearsLeft = TIRE_INTERVAL_YEARS;
  if (vehicle.last_tire_change) {
    const tireDate = new Date(vehicle.last_tire_change);
    const yearsSince =
      (Date.now() - tireDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    tireYearsLeft = Math.max(0, TIRE_INTERVAL_YEARS - yearsSince);
    tireLife = Math.max(
      0,
      Math.min(100, (tireYearsLeft / TIRE_INTERVAL_YEARS) * 100)
    );
  }

  const actions = [];

  if (fuelType !== "electric" && oilKmLeft <= 1000) {
    actions.push({
      level: oilKmLeft <= 0 ? "critical" : "warning",
      text:
        oilKmLeft <= 0
          ? `Oil change overdue by ${Math.abs(oilKmLeft)} KM (${kmSinceOilChange} KM since last change)`
          : `Oil change needed soon - ${Math.round(oilKmLeft)} KM left`,
    });
  }

  if (tireYearsLeft <= 1) {
    actions.push({
      level: tireYearsLeft <= 0 ? "critical" : "warning",
      text:
        tireYearsLeft <= 0
          ? "Tire replacement overdue - tires should be changed every 5 years"
          : `Tire replacement due in ~${Math.ceil(tireYearsLeft * 12)} months`,
    });
  }

  if (vehicle.last_battery_check) {
    const batteryDate = new Date(vehicle.last_battery_check);
    const batteryYears =
      (Date.now() - batteryDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (batteryYears >= BATTERY_INTERVAL_YEARS) {
      actions.push({
        level: "warning",
        text: "Battery check recommended - last check was over 2 years ago",
      });
    }
  } else {
    actions.push({
      level: "info",
      text: "Schedule a battery health check",
    });
  }

  if (mileage > 0 && mileage % BRAKE_INTERVAL_KM < 2000) {
    actions.push({
      level: "info",
      text: `Brake inspection due around ${Math.ceil(mileage / BRAKE_INTERVAL_KM) * BRAKE_INTERVAL_KM} KM`,
    });
  }

  if (fuelType !== "electric" && mileage >= TRANSMISSION_INTERVAL_KM - 3000) {
    actions.push({
      level: mileage >= TRANSMISSION_INTERVAL_KM ? "critical" : "warning",
      text:
        mileage >= TRANSMISSION_INTERVAL_KM
          ? `Transmission service overdue by ${mileage - TRANSMISSION_INTERVAL_KM} KM`
          : `Transmission flush due at ${TRANSMISSION_INTERVAL_KM} KM`,
    });
  }

  if (actions.length === 0) {
    actions.push({
      level: "info",
      text: "All systems looking good - keep up the great maintenance!",
    });
  }

  return {
    oilLife: Math.round(oilLife),
    oilKmLeft: Math.round(oilKmLeft),
    kmSinceOilChange: Math.round(kmSinceOilChange),
    tireLife: Math.round(tireLife),
    tireYearsLeft: Math.round(tireYearsLeft * 10) / 10,
    actions,
    health: {
      oil: oilLife > 30 ? "good" : oilLife > 15 ? "warning" : "critical",
      tires: tireLife > 30 ? "good" : "warning",
      brakes: "good",
      battery: "good",
      transmission: mileage >= TRANSMISSION_INTERVAL_KM ? "critical" : "good",
    },
  };
}
