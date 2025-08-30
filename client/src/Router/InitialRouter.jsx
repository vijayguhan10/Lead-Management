import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "../components/Auth/Auth";
import Dashboard from "../components/Admin/Dashboard";

import Lead from "../components/Lead/Lead";

import IndividualTelecaller from "../components/Telecaller/IndividualTelecaller";
import TelecallerOverviewPanel from "../components/Telecaller/TelecallerOverviewPanel";
import CallLogs from "../components/Call/CallLogs";
import AssetManagement from "../components/AssetManagement/AssetManagement";
import Settings from "../components/Settings/Settings";
import Ai from "../components/AI/Ai";
import SuperAdminDashboard from "../components/Admin/SuperAdminDashboard'";
import OnboardConfig from "../components/Admin/Configuration";
const InitialRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />

        <Route path="/leads" element={<Lead />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/call-logs" element={<CallLogs />} />
        <Route path="/telecaller" element={<TelecallerOverviewPanel />} />
        <Route path="/viewtelecaller" element={<IndividualTelecaller />} />
        <Route path="/leads" element={<Lead />} />
        <Route path="/asset-management" element={<AssetManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ai-visualizer" element={<Ai />} />
        <Route
          path="/super-admin-dashboard"
          element={<SuperAdminDashboard />}
        />
        <Route path="/onboard-configuration" element={<OnboardConfig />} />
      </Routes>
    </div>
  );
};

export default InitialRouter;
