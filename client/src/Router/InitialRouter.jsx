import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "../components/Auth/Auth";
import Dashboard from "../components/Admin/Dashboard";
import RecordingsDashboard from "../components/Call/RecordingsDashboard";
const InitialRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Auth />} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/recordings" element={<RecordingsDashboard />} />
      </Routes>
    </div>
  );
};

export default InitialRouter;
