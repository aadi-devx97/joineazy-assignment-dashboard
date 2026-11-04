import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  LogOut,
  GraduationCap,
  Moon,
  Sun,
} from "lucide-react";

import { AppContext } from "../../context/AppContext";
import { ThemeContext } from "../../context/ThemeContext";

function Sidebar({ isMobileOpen, onClose }) {
  const { currentUser, logout } = useContext(AppContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const isAdmin = currentUser?.role === "admin";

  const navigationItems = [
    {
      label: "Overview",
      path: isAdmin ? "/admin" : "/student",
      icon: LayoutDashboard,
    },
    ...(isAdmin
      ? [
          {
            label: "Assignments",
            path: "/admin/assignments",
            icon: ClipboardList,
          },
          {
            label: "Students",
            path: "/admin/students",
            icon: Users,
          },
        ]
      : [
          {
            label: "My Assignments",
            path: "/student/assignments",
            icon: ClipboardList,
          },
        ]),
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        w-64 min-h-screen bg-surface border-r border-border
        flex flex-col p-5
        transition-transform duration-300
        lg:static lg:translate-x-0 lg:z-auto
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >

      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-12">
        <div className="w-10 h-10 rounded-xl bg-olive text-white flex items-center justify-center">
          <GraduationCap size={23} />
        </div>

        <div>
          <h1 className="font-bold text-lg tracking-tight">Joineazy</h1>
          <p className="text-xs text-muted">Workspace</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-4 px-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Menu
        </p>
      </div>

      <nav className="space-y-1 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-olive/10 text-olive"
                    : "text-muted hover:bg-canvas hover:text-ink"
                }`
              }
            >
              <Icon size={19} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Account */}
      <div className="border-t border-border pt-5 mt-5">

        <div className="flex items-center gap-3 px-2 mb-5">
          <div className="w-10 h-10 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center font-semibold">
            {currentUser?.name?.charAt(0)}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {currentUser?.name}
            </p>
            <p className="text-xs text-muted capitalize">
              {currentUser?.role}
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-3 text-sm text-muted hover:bg-canvas hover:text-ink rounded-lg transition-colors"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-sm text-muted hover:bg-canvas hover:text-terracotta rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>

      </div>
    </aside>
  );
}

export default Sidebar;