import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SideBar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import InitialRouter from "./Router/InitialRouter";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";

function App() {
  const location = useLocation();
  const [runTour, setRunTour] = useState(false);

  // Paths where sidebar/header should be hidden
  const hideSidebarPaths = ["/", "/login", "/auth", "/signup"];
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);

  useEffect(() => {
    setRunTour(false); // Reset tour on route change if needed
  }, [location.pathname]);

  const steps = [
    {
      target: ".sidebar-tour-step-0",
      content:
        "Onboard-Tour: Start here for a guided walkthrough of the app features.",
    },
    {
      target: ".sidebar-tour-step-1",
      content: "Dashboard: View your lead analytics and overall performance.",
    },
    {
      target: ".sidebar-tour-step-2",
      content: "Leads: Manage all your leads efficiently.",
    },
    {
      target: ".sidebar-tour-step-3",
      content: "Telecaller: Assign and monitor telecallers.",
    },
    {
      target: ".sidebar-tour-step-4",
      content: "Recordings: Access and review call logs.",
    },
    {
      target: ".sidebar-tour-step-5",
      content: "Settings: Customize your account and preferences.",
    },
    {
      target: ".sidebar-tour-step-6",
      content: "Files/Documents: Manage your assets and documents.",
    },
    {
      target: ".sidebar-tour-step-7",
      content: "Summary: Get a quick overview of your activities.",
    },
    {
      target: ".sidebar-tour-step-8",
      content:
        "Ai Visualizer: Visualize your lead data with AI-powered insights.",
    },
    // Dashboard Cards
    {
      target: ".dashboard-card-0",
      content: "Assigned Leads: Total leads assigned this month.",
    },
    {
      target: ".dashboard-card-1",
      content: "Converted Leads: Leads successfully converted this month.",
    },
    {
      target: ".dashboard-card-2",
      content: "Pending Leads: Leads still pending action.",
    },
    {
      target: ".dashboard-card-3",
      content: "Conversion Rate: Overall percentage of leads converted.",
    },
    // Dashboard Tables
    {
      target: ".dashboard-table-assigned",
      content:
        "Assigned Leads Table: Details of leads assigned to telecallers.",
    },
    {
      target: ".dashboard-table-ongoing",
      content: "On-going Leads Table: Leads currently in progress.",
    },
  ];

  return (
    <div className="flex font-poppins overflow-x-hidden">
      {!shouldHideSidebar && <SideBar setRunTour={setRunTour} />}

      <div className={shouldHideSidebar ? "w-full" : "xl:ml-64 w-full"}>
        {!shouldHideSidebar && <Header />}
        <InitialRouter />
      </div>

      {/* Joyride stays here, always mounted */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            zIndex: 10000,
            backgroundColor: "#fff",
            borderRadius: "18px",
            boxShadow: "0 8px 32px rgba(44, 62, 80, 0.15)",
            padding: "24px",
            color: "#22223b",
            fontFamily: "Poppins, sans-serif",
            fontSize: "1.08rem",
            width: 420,
            transition:
              "box-shadow 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1)",
          },
          tooltip: {
            backgroundColor: "#fff",
            color: "#22223b",
            borderRadius: "18px",
            boxShadow: "0 8px 32px rgba(44, 62, 80, 0.15)",
            padding: "24px",
            fontFamily: "Poppins, sans-serif",
            fontSize: "1.08rem",
            transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
            transform: "scale(1)",
            opacity: 1,
          },
          buttonNext: {
            backgroundColor: "#3b82f6",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1rem",
            padding: "10px 22px",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.12)",
            transition: "background 0.2s",
          },
          buttonBack: {
            color: "#3b82f6",
            background: "none",
            fontWeight: "500",
            fontSize: "1rem",
            padding: "10px 18px",
            transition: "color 0.2s",
          },
          buttonClose: {
            color: "#ef4444",
            background: "none",
            fontWeight: "600",
            fontSize: "1.2rem",
            padding: "8px",
            transition: "color 0.2s",
          },
          arrow: {
            color: "#3b82f6",
            transition: "color 0.2s",
          },
          badge: {
            backgroundColor: "#3b82f6",
            color: "#fff",
            fontWeight: "600",
            fontSize: "0.95rem",
            borderRadius: "6px",
            padding: "4px 10px",
            transition: "background 0.2s",
          },
        }}
        callback={(data) => {
          const { status } = data;
          if (status === "finished" || status === "skipped") {
            setRunTour(false);
          }
        }}
      />
  {/* Toast container for react-toastify */}
  <ToastContainer position="top-right" newestOnTop closeOnClick pauseOnHover />
    </div>
  );
}

export default App;
