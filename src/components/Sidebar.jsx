import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, History, User, Plus } from "lucide-react";
import BrandLogo from "./BrandLogo";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/history", label: "History", icon: History },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <BrandLogo />
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.path}
              className={location.pathname === link.path ? "active" : ""}
              onClick={() => navigate(link.path)}
            >
              <Icon size={18} strokeWidth={1.75} />
              {link.label}
            </button>
          );
        })}
      </nav>

      <button className="sidebar-add-btn" onClick={() => navigate("/fuel-type")}>
        <Plus size={16} strokeWidth={2} />
        Add New Vehicle
      </button>

      <div className="sidebar-footer">
        <small>{user.full_name || user.email || "User"}</small>
      </div>
    </aside>
  );
}

export default Sidebar;
