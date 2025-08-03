import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "../components/Auth/Auth";
import Dashboard from "../components/Admin/Dashboard";

import Lead from "../components/Lead/Lead";

import IndividualTelecaller from "../components/Telecaller/IndividualTelecaller";
import TelecallerOverviewPanel from "../components/Telecaller/TelecallerOverviewPanel";
import CallLogs from "../components/Call/CallLogs";

const InitialRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Auth />} />

        <Route path="/leads" element={<Lead />} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/call-logs" element={<CallLogs />} />
        <Route path="/telecaller" element={<TelecallerOverviewPanel />} />
        <Route path="/viewtelecaller" element={<IndividualTelecaller />} />
        <Route path="/leads" element={<Lead />} />
      </Routes>
    </div>
  );
};

export default InitialRouter;
