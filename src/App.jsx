import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import FuelType from "./pages/FuelType";
import SelectCar from "./pages/SelectCar";
import SelectModel from "./pages/SelectModel";
import VehicleSetup from "./pages/VehicleSetup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import { AdminRoute, DriverRoute, AuthRoute } from "./components/RouteGuard";

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname === "/admin";

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path="/fuel-type"
            element={
              <DriverRoute>
                <FuelType />
              </DriverRoute>
            }
          />
          <Route
            path="/select-car"
            element={
              <DriverRoute>
                <SelectCar />
              </DriverRoute>
            }
          />
          <Route
            path="/select-model"
            element={
              <DriverRoute>
                <SelectModel />
              </DriverRoute>
            }
          />
          <Route
            path="/vehicle-setup"
            element={
              <DriverRoute>
                <VehicleSetup />
              </DriverRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <DriverRoute>
                <Dashboard />
              </DriverRoute>
            }
          />
          <Route
            path="/history"
            element={
              <DriverRoute>
                <History />
              </DriverRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <DriverRoute>
                <Profile />
              </DriverRoute>
            }
          />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
