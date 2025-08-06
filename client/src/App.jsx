import "./index.css";
import SideBar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import InitialRouter from "./Router/InitialRouter";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import Joyride from "react-joyride";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [runTour, setRunTour] = useState(false);

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
    <div className="font-poppins">
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            zIndex: 10000,
            arrowColor: "#000",
            backgroundColor: "#fff",
            overlayColor: "rgba(0,0,0,0.4)",
            primaryColor: "#000",
            textColor: "#222",
          },
        }}
        callback={(data) => {
          if (data.status === "finished" || data.status === "skipped") {
            setRunTour(false);
          }
        }}
      />

      {!isLoginPage && <SideBar setRunTour={setRunTour} />}
      {!isLoginPage && <Header />}
      <div className="ml-64 main-content">
        <InitialRouter />
      </div>
    </div>
  );
}

export default App;
