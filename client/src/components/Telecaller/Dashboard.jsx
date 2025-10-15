import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTelecallerDashboardData } from "../../hooks/useTelecallerDashboardData";
import { FaSpinner, FaExclamationTriangle, FaSync } from "react-icons/fa";
import { toast } from "react-toastify";
import StatsCard from "./Dashboard/StatsCard";
import FollowUpWidget from "./Dashboard/FollowUpWidget";
import ConversionStagesChart from "./Dashboard/ConversionStagesChart";
import TrendsChart from "./Dashboard/TrendsChart";
import UpcomingFollowUps from "./Dashboard/UpcomingFollowUps";

/**
 * Telecaller Dashboard Component
 * Displays comprehensive analytics for a specific telecaller
 */
const Dashboard = () => {
  const { telecallerId: paramTelecallerId } = useParams();
  // Get telecaller ID from URL params or localStorage
  const telecallerId = paramTelecallerId || localStorage.getItem("userId");
  const [trendFilter, setTrendFilter] = useState("monthly"); // 'monthly' or 'weekly'

  const { dashboardData, loading, error, refetch } =
    useTelecallerDashboardData(telecallerId);

  // Telecaller not found
  if (!telecallerId) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <FaExclamationTriangle className="text-5xl text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Telecaller Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load dashboard. Please ensure you are logged in properly.
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
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
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

  // Data not loaded yet
  if (!dashboardData) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl text-[#7C3AED] mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Preparing dashboard...</p>
        </div>
      </div>
    );
  }

  const { stats, followUps, statusDistribution, trends, upcomingFollowUps } =
    dashboardData || {};

  // Verify data structure
  if (!stats || !followUps || !statusDistribution || !trends) {
    console.error("❌ Invalid dashboard data structure:", dashboardData);
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <FaExclamationTriangle className="text-5xl text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Invalid Data Format
          </h2>
          <p className="text-gray-600 mb-4">
            The dashboard data is not in the expected format. Please contact
            support.
          </p>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no leads assigned
  if (stats.totalLeads === 0) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header removed per UX request */}

        {/* Empty State */}
        <div
          className="flex items-center justify-center"
          style={{ minHeight: "calc(100vh - 200px)" }}
        >
          <div className="text-center bg-white rounded-xl shadow-lg p-12 max-w-2xl">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Leads Assigned Yet
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              You don't have any leads assigned to you at the moment.
              <br />
              Please contact your administrator to assign leads to your account.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Telecaller ID:</strong>{" "}
                <code className="bg-white px-2 py-1 rounded text-xs">
                  {telecallerId}
                </code>
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={refetch}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaSync />
                Check Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-poppins">
      {/* Top refresh removed per UX request */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Leads"
          value={stats.totalLeads}
          color="blue"
          subtitle="Assigned to you"
        />
        <StatsCard
          title="Converted"
          value={stats.convertedLeads}
          color="green"
          subtitle={`${stats.conversionRate}% conversion rate`}
        />
        <StatsCard
          title="Qualified"
          value={stats.qualifiedLeads}
          color="purple"
          subtitle="Ready for conversion"
        />
        <StatsCard
          title="New Leads"
          value={stats.newLeads}
          color="orange"
          subtitle="Awaiting contact"
        />
      </div>

      {/* Follow-up Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FollowUpWidget
          title="Overdue"
          count={followUps.overdue}
          color="red"
          leads={followUps.overdueLeads}
        />
        <FollowUpWidget
          title="Today's Follow-ups"
          count={followUps.today}
          color="blue"
          leads={followUps.todaysLeads}
        />
        <FollowUpWidget
          title="Pending"
          count={followUps.pending}
          color="yellow"
          subtitle="Scheduled later"
          leads={followUps.pendingLeads}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ConversionStagesChart data={statusDistribution} />
        <TrendsChart
          data={trendFilter === "monthly" ? trends.monthly : trends.weekly}
          filter={trendFilter}
          onFilterChange={setTrendFilter}
        />
      </div>

      {/* Upcoming Follow-ups */}
      <UpcomingFollowUps followUps={upcomingFollowUps} />
    </div>
  );
};

export default Dashboard;
