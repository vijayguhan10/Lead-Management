import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  User,
  Mic,
  Settings,
  FolderOpen,
  FileText,
  BarChart2,
  LogOut,
  Torus,
} from "lucide-react";
import { FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Onboard-Tour", icon: Torus, path: "" },

  { name: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
  { name: "Leads", icon: Users, path: "/leads" },
  { name: "Telecaller", icon: User, path: "/telecaller" },
  { name: "Recordings", icon: Mic, path: "/call-logs" },
  { name: "Settings", icon: Settings, path: "/settings" },
  { name: "Files/Documents", icon: FolderOpen, path: "/asset-management" },
  { name: "Ai Visualizer", icon: FaRobot, path: "/ai-visualizer" },
];

const SideBar = ({ setRunTour }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 sm:hidden text-gray-500"
      >
        <svg className="h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white shadow-xl border-r transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="flex flex-col h-full px-3 py-8">
          {/* Workspace Branding */}
          <div className="mb-8">
            {/* Organization Name */}
            <div className="mb-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-3 border border-indigo-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {(() => {
                      try {
                        const userObj = JSON.parse(
                          localStorage.getItem("user")
                        );
                        const orgName = userObj?.organizationName || "ACS";
                        return orgName.substring(0, 2).toUpperCase();
                      } catch {
                        return "ACS";
                      }
                    })()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800 leading-tight">
                    {(() => {
                      try {
                        const userObj = JSON.parse(
                          localStorage.getItem("user")
                        );
                        return userObj?.organizationName || "Lead Management";
                      } catch {
                        return "Lead Management";
                      }
                    })()}
                  </h3>
                  <p className="text-xs text-gray-500">Workspace</p>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {(() => {
                      try {
                        const userObj = JSON.parse(
                          localStorage.getItem("user")
                        );
                        const name =
                          userObj?.name ||
                          userObj?.fullName ||
                          userObj?.firstName ||
                          "User";
                        return name.substring(0, 2).toUpperCase();
                      } catch {
                        return "U";
                      }
                    })()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {(() => {
                      try {
                        const userObj = JSON.parse(
                          localStorage.getItem("user")
                        );
                        return (
                          userObj?.name ||
                          userObj?.fullName ||
                          userObj?.firstName ||
                          "User"
                        );
                      } catch {
                        return "User";
                      }
                    })()}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {role === "admin" ? "Admin" : "Telecaller"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="flex-1 space-y-1">
            {menuItems.map(({ name, icon: Icon, path }, idx) => {
              // don't render Settings for telecaller users
              if (name === "Settings" && role === "telecaller") return null;

              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => {
                      if (name === "Onboard-Tour" && setRunTour) {
                        setRunTour(true);
                      } else if (name === "Dashboard") {
                        // Check if user is telecaller and redirect to appropriate dashboard
                        const userRole = localStorage.getItem("role");
                        if (userRole === "telecaller") {
                          navigate("/telecaller-dashboard");
                        } else {
                          navigate(path);
                        }
                        closeSidebar();
                      } else {
                        navigate(path);
                        closeSidebar();
                      }
                    }}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition ${
                      (name === "Dashboard" &&
                        ((localStorage.getItem("role") === "telecaller" &&
                          window.location.pathname ===
                            "/telecaller-dashboard") ||
                          (localStorage.getItem("role") !== "telecaller" &&
                            window.location.pathname === path))) ||
                      (name !== "Dashboard" &&
                        window.location.pathname === path)
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    } sidebar-tour-step sidebar-tour-step-${idx}`}
                  >
                    <Icon
                      size={20}
                      className={`${
                        (name === "Dashboard" &&
                          ((localStorage.getItem("role") === "telecaller" &&
                            window.location.pathname ===
                              "/telecaller-dashboard") ||
                            (localStorage.getItem("role") !== "telecaller" &&
                              window.location.pathname === path))) ||
                        (name !== "Dashboard" &&
                          window.location.pathname === path)
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    />
                    {name}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-3 text-red-600 hover:bg-red-50 p-3 rounded-lg font-medium text-sm w-full text-left"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
