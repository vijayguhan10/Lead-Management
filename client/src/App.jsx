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
      target: ".my-first-step", // Add this class to your first feature
      content: "This is your dashboard!",
    },
    {
      target: ".my-other-step", // Add this class to another feature
      content: "Here you can manage telecallers.",
    },
    {
      target: ".sidebar-settings", // Example: settings in sidebar
      content: "Access your settings here.",
    },
    // ...add more steps as needed
  ];

  return (
    <div className="font-poppins">
      {!isLoginPage && <SideBar />}
      {!isLoginPage && <Header />}
      <div className="ml-64">
        <InitialRouter />
      </div>
      <button
        onClick={() => setRunTour(true)}
        className="fixed top-4 right-4 px-4 py-2 bg-black text-white rounded"
      >
        Start Onboarding Tour
      </button>
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
    </div>
  );
}

export default App;
