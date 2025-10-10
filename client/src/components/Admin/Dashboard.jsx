import React from "react";
import {
  FaUsers,
  FaUserCheck,
  FaCheckCircle,
  FaChartLine,
  FaSpinner,
  FaExclamationTriangle,
  FaSync,
} from "react-icons/fa";
import { toast } from "react-toastify";
import MetricCard from "./Dashboard/MetricCard";
import ConversionChart from "./Dashboard/ConversionChart";
import TelecallerStatsCard from "./Dashboard/TelecallerStatsCard";
import SourceConversionTable from "./Dashboard/SourceConversionTable";
import { useDashboardData } from "../../hooks/useDashboardData";

/**
 * Admin Dashboard - Dynamic analytics dashboard with live data
 * Shows metrics, conversion trends, telecaller performance, and source analytics
 */
const Dashboard = () => {
  const orgId = localStorage.getItem("organizationId") || "";
  const { dashboardData, loading, error, refetch } = useDashboardData(orgId);

  // Handle missing organization ID
  if (!orgId) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <FaExclamationTriangle className="text-5xl text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Organization Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load dashboard. Please ensure you are logged in with a
            valid organization.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl text-[#7C3AED] mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Loading dashboard analytics...
          </p>
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message || "An error occurred while loading the dashboard."}
          </p>
          <button
            onClick={() => {
              toast.info("Retrying...");
              refetch();
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const {
    overview,
    monthlyConversions,
    telecallerPerformance,
    sourceConversions,
  } = dashboardData;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-poppins">
      {/* Top refresh removed per UX request */}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total Leads"
          value={overview.totalLeads}
          subtext="All leads in your organization"
          icon={<FaUsers className="text-blue-600" />}
          color="from-blue-50 to-white"
          percent={100}
        />
        <MetricCard
          label="Assigned Leads"
          value={overview.assignedLeads}
          subtext={`${overview.unassignedLeads} unassigned`}
          icon={<FaUserCheck className="text-purple-600" />}
          color="from-purple-50 to-white"
          percent={
            overview.totalLeads > 0
              ? (overview.assignedLeads / overview.totalLeads) * 100
              : 0
          }
        />
        <MetricCard
          label="Converted Leads"
          value={overview.convertedLeads}
          subtext="Successfully closed deals"
          icon={<FaCheckCircle className="text-green-600" />}
          color="from-green-50 to-white"
          percent={parseFloat(overview.conversionRate)}
        />
        <MetricCard
          label="Conversion Rate"
          value={`${overview.conversionRate}%`}
          subtext="Overall conversion performance"
          icon={<FaChartLine className="text-orange-600" />}
          color="from-orange-50 to-white"
          percent={parseFloat(overview.conversionRate)}
        />
      </div>

      {/* Charts and Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Conversion Trend Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ConversionChart data={monthlyConversions} loading={loading} />
        </div>

        {/* Telecaller Performance - Takes 1 column */}
        <div className="lg:col-span-1">
          <TelecallerStatsCard
            telecallerPerformance={telecallerPerformance}
            loading={loading}
          />
        </div>
      </div>

      {/* Source Conversion Table - Full Width */}
      <div className="mb-6">
        <SourceConversionTable
          sourceConversions={sourceConversions}
          loading={loading}
        />
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            toast.info("Refreshing dashboard data...");
            refetch();
          }}
          className="bg-[#7C3AED] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6D28D9] transition-colors shadow-md flex items-center gap-2"
        >
          <FaChartLine />
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
