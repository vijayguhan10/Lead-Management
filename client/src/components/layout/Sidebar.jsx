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
   { name: "Onboard-Tour", icon: Torus, path: "/leads" },

    { name: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
  { name: "Leads", icon: Users, path: "/leads" },
  { name: "Telecaller", icon: User, path: "/telecaller" },
  { name: "Recordings", icon: Mic, path: "/call-logs" },
  { name: "Settings", icon: Settings, path: "/settings" },
  { name: "Files/Documents", icon: FolderOpen, path: "/asset-management" },
  { name: "Summary", icon: FileText, path: "/summary" },
  { name: "Ai Visualizer", icon: FaRobot, path: "/ai-visualizer" },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

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
          {/* Job Info */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 bg-gradient-to-r from-[#e0e7ff] via-[#f0f7fa] to-[#e0ffe0] rounded-lg px-3 py-2">
              <span className="font-bold text-base text-blue-700">
                Vijay Guhan
              </span>
            </div>
            <div className="text-xs text-gray-700 leading-tight mt-2 bg-gradient-to-r from-[#e0e7ff] via-[#f0f7fa] to-[#e0ffe0] rounded-lg px-3 py-2">
              CHENNAI
              <br />
              123 Anna Salai, Guindy,
              <br />
              Tamil Nadu, 600032
            </div>
          </div>

          {/* Menu Items */}
          <ul className="flex-1 space-y-1">
            {menuItems.map(({ name, icon: Icon, path }, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => {
                    navigate(path);
                    closeSidebar();
                  }}
                  className={`w-full1 my-first-step text-left flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition ${
                    window.location.pathname === path
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`${
                      window.location.pathname === path
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  />
                  {name}
                </button>
              </li>
            ))}
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
