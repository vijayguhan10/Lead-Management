import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
  FaUserCircle,
  FaChartLine,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";

// Default performance metrics for telecallers without data
const defaultPerformanceMetrics = {
  dailyCallTarget: 0,
  monthlyLeadGoal: 0,
  completedCallsToday: 0,
  leadsAssignedToday: 0,
};

// Status color mapping
const statusColors = {
  "Not Contacted": "bg-red-50 text-red-600 border border-red-100",
  "In Progress": "bg-yellow-50 text-yellow-700 border border-yellow-100",
  Converted: "bg-green-50 text-green-700 border border-green-100",
  Dropped: "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function TelecallerOverviewPanel() {
  const [search, setSearch] = useState("");
  const [showConfetti, setShowConfetti] = useState(true);
  const navigate = useNavigate();

  // Fetch telecallers from API
  const { data: apiTelecallers, loading, error } = useApi('telecaller', '/telecallers');

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Use API data with proper error handling
  const telecallers = React.useMemo(() => {
    if (loading) return [];
    
    if (error) {
      console.error('Error fetching telecallers:', error);
      return []; // Return empty array for any error
    }

    if (!apiTelecallers || !Array.isArray(apiTelecallers)) {
      return []; // Return empty array if no valid data
    }

    // Transform API data to match expected format
    return apiTelecallers.map(telecaller => ({
      ...telecaller,
      // Ensure required fields exist with fallbacks
      name: telecaller.name || 'Unknown Name',
      phone: telecaller.phone || 'No Phone',
      email: telecaller.email || 'No Email',
      assignedLeads: Array.isArray(telecaller.assignedLeads) ? telecaller.assignedLeads : [],
      performanceMetrics: telecaller.performanceMetrics || defaultPerformanceMetrics,
      status: telecaller.status || 'Active'
    }));
  }, [apiTelecallers, loading, error]);

  // Filter logic
  const filteredTelecallers = telecallers.filter((tc) =>
    tc.name.toLowerCase().includes(search.toLowerCase())
  );

  // Helper: Get top 3 telecallers by completedCallsToday
  const topTelecallers = React.useMemo(() => {
    return [...telecallers]
      .sort((a, b) => {
        const aCompleted = a.performanceMetrics?.completedCallsToday || 0;
        const bCompleted = b.performanceMetrics?.completedCallsToday || 0;
        return bCompleted - aCompleted;
      })
      .slice(0, 3);
  }, [telecallers]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#7C3AED] mx-auto mb-4" />
          <p className="text-gray-600">Loading telecallers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-0 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Error Notice */}
        {error && (
          <div className={`mx-4 mb-4 p-4 border rounded-lg ${
            error.isAccessDenied 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className={`flex items-center gap-2 ${
              error.isAccessDenied ? 'text-orange-700' : 'text-red-700'
            }`}>
              <FaExclamationTriangle />
              <span className="font-semibold">
                {error.isAccessDenied ? 'Access Denied' : 'Connection Error'}
              </span>
            </div>
            <p className={`text-sm mt-1 ${
              error.isAccessDenied ? 'text-orange-600' : 'text-red-600'
            }`}>
              {error.isAccessDenied 
                ? `Access denied: ${error.message}. Please contact your administrator for access to telecaller data.`
                : `Unable to fetch latest telecaller data: ${error.message}`
              }
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Telecaller Overview
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-white"
            />
            <button className="bg-[#7C3AED] text-white px-4 py-2 rounded font-semibold flex items-center gap-1 hover:bg-[#5b2edd] transition">
              <FaSearch /> Search
            </button>
          </div>
        </div>

        {/* No data state */}
        {telecallers.length === 0 && !loading && (
          <div className="text-center py-12">
            <FaUserCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {error?.isAccessDenied 
                ? "Access Denied" 
                : "No Telecallers Found"
              }
            </h3>
            <p className="text-gray-500">
              {(() => {
                if (error?.isAccessDenied) {
                  return "You don't have permission to view telecaller data. Please contact your administrator.";
                }
                if (error) {
                  return "Unable to load telecaller data. Please try again later.";
                }
                return "No telecallers are currently available in the system.";
              })()}
            </p>
          </div>
        )}

        {/* Top Performers Section */}
        {telecallers.length > 0 && (
          <div className="mb-8 px-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#7C3AED]">
                Top 3 Telecallers (Monthly)
              </h3>
              <span className="text-xs text-gray-500">
                Based on completed calls
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topTelecallers.map((tc, idx) => {
                const getPerformerBadge = (index) => {
                  if (index === 0) return "🥇 Top Performer";
                  if (index === 1) return "🥈";
                  return "🥉";
                };

                return (
                  <div
                    key={tc._id}
                    className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-[#FFD700] p-6 flex flex-col items-center justify-center transition hover:scale-[1.03] hover:shadow-2xl"
                    style={{
                      boxShadow: "0 4px 24px 0 rgba(255, 215, 0, 0.10)",
                    }}
                  >
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-full bg-[#FFD700]/80 text-[#7C3AED] text-xs font-bold shadow">
                        {getPerformerBadge(idx)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] via-[#FFB300] to-[#FF8C00] flex items-center justify-center shadow-lg border-4 border-white mb-2">
                        <FaUserCircle className="text-4xl text-white" />
                      </div>
                      <div className="font-bold text-lg text-[#7C3AED]">
                        {tc.name}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{tc.phone}</div>
                    </div>
                    <div className="flex flex-col items-center gap-1 mt-2">
                      <span className="text-base font-semibold text-gray-700">
                        <span className="text-[#FFD700] font-bold">
                          {tc.performanceMetrics?.completedCallsToday || 0}
                        </span>{" "}
                        Calls
                      </span>
                      <span className="text-xs text-gray-500">
                        Target:{" "}
                        <span className="font-bold">
                          {tc.performanceMetrics?.dailyCallTarget || 0}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        Leads Today:{" "}
                        <span className="font-bold">
                          {tc.performanceMetrics?.leadsAssignedToday || 0}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Telecallers Table */}
        {telecallers.length > 0 && (
          <div className="rounded-xl shadow border border-gray-200 bg-white max-h-[500px] overflow-auto">
            <table className="min-w-full text-sm border-separate border-spacing-0 table-fixed">
              <thead>
                <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                  <th className="py-4 px-4 text-left font-semibold border-b border-gray-200 w-44 whitespace-nowrap">
                    Telecaller Name
                  </th>
                  <th className="py-4 px-4 text-left font-semibold border-b border-gray-200 w-32 whitespace-nowrap">
                    Phone
                  </th>
                  <th className="py-4 px-4 text-left font-semibold border-b border-gray-200 w-56 whitespace-nowrap">
                    Email
                  </th>
                  <th className="py-4 px-4 text-left font-semibold border-b border-gray-200 w-56 whitespace-nowrap">
                    Assigned Leads
                  </th>
                  <th className="py-4 px-4 text-left font-semibold border-b border-gray-200 w-32 whitespace-nowrap">
                    Daily Call Target
                  </th>
                  <th className="py-4 px-4 text-left font-semibold border-b border-gray-200 w-40 whitespace-nowrap">
                    Completed Calls Today
                  </th>
                  <th className="py-4 px-4 text-left font-semibold border-b border-gray-200 w-40 whitespace-nowrap">
                    Assigned Leads Today
                  </th>
                  <th className="py-4 px-4 text-left font-semibold border-b border-gray-200 w-28 whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-4 px-4 text-left font-semibold border-b border-gray-200 w-52 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTelecallers.map((tc, idx) => (
                  <tr
                    key={tc._id}
                    className={`transition cursor-pointer hover:bg-[#f6f8fb] ${
                      idx % 2 ? "bg-white" : "bg-gray-50"
                    }`}
                    onClick={() => navigate(`/viewtelecaller`)}
                  >
                    <td className="py-3 px-4 font-semibold flex items-center gap-2 border-b border-gray-200 whitespace-nowrap">
                      <FaUserCircle className="text-xl text-gray-400" />
                      {tc.name}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">
                      {tc.phone}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap truncate">
                      {tc.email}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">
                      <span className="font-bold">{tc.assignedLeads?.length || 0}</span>
                      <div className="flex gap-1 mt-1 overflow-x-auto whitespace-nowrap">
                        {tc.assignedLeads?.length > 0 ? (
                          <>
                            {tc.assignedLeads.slice(0, 3).map((lead, leadIdx) => (
                              <span
                                key={`${tc._id}-lead-${leadIdx}`}
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  statusColors[lead.status] || statusColors["Not Contacted"]
                                }`}
                                title={`${lead.name} - ${lead.status}`}
                              >
                                {lead.name?.split(" ")[0] || "Unknown"} ({lead.status || "No Status"})
                              </span>
                            ))}
                            {tc.assignedLeads.length > 3 && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 border border-gray-200">
                                +{tc.assignedLeads.length - 3} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">No leads assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">
                      {tc.performanceMetrics?.dailyCallTarget || 0}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">
                      <span className="font-bold text-[#16A34A]">
                        {tc.performanceMetrics?.completedCallsToday || 0}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({tc.performanceMetrics?.dailyCallTarget 
                          ? Math.round(
                              ((tc.performanceMetrics.completedCallsToday || 0) /
                                tc.performanceMetrics.dailyCallTarget) * 100
                            )
                          : 0}%)
                      </span>
                      <div className="w-full h-2 bg-gray-200 rounded mt-1">
                        <div
                          className="h-2 rounded bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              tc.performanceMetrics?.dailyCallTarget 
                                ? ((tc.performanceMetrics.completedCallsToday || 0) /
                                    tc.performanceMetrics.dailyCallTarget) * 100
                                : 0
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">
                      {tc.performanceMetrics?.leadsAssignedToday || 0}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded font-semibold text-xs ${
                          tc.status === "Active"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        }`}
                      >
                        {tc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">
                      <button
                        className="bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FF8C00] text-white px-4 py-2 rounded shadow flex items-center gap-2 text-xs font-bold hover:scale-105 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/viewtelecaller`);
                        }}
                      >
                        <FaChartLine /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTelecallers.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-8 text-center text-gray-400 border-b border-gray-200"
                    >
                      No telecallers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {showConfetti && <Confetti />}
      </div>
    </div>
  );
}
