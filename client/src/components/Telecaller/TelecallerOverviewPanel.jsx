import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
  FaPhone,
  FaEnvelope,
  FaUserCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaChartLine,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Sample telecaller data
const telecallers = [
  {
    _id: "688e62123825fdf0a7e16944",
    name: "Arjun Mehta",
    phone: "+919934567891",
    email: "arjun.mehta@example.com",
    assignedLeads: [
      { name: "Lakshmi Narayanan", status: "Converted" },
      { name: "Priya Selvam", status: "In Progress" },
      { name: "Vijay Anand", status: "Not Contacted" },
      { name: "Ravi Kumar", status: "Dropped" },
    ],
    performanceMetrics: {
      dailyCallTarget: 55,
      monthlyLeadGoal: 320,
      completedCallsToday: 42,
      leadsAssignedToday: 8,
    },
    status: "Active",
  },
  {
    _id: "688e62123825fdf0a7e16945",
    name: "Meena Ramesh",
    phone: "+919876543210",
    email: "meena.ramesh@example.com",
    assignedLeads: [
      { name: "Karthik Subramanian", status: "Converted" },
      { name: "Sundar Rajan", status: "In Progress" },
    ],
    performanceMetrics: {
      dailyCallTarget: 40,
      monthlyLeadGoal: 200,
      completedCallsToday: 38,
      leadsAssignedToday: 5,
    },
    status: "Active",
  },
  {
    _id: "688e62123825fdf0a7e16946",
    name: "Vijay Anand",
    phone: "+919812345678",
    email: "vijay.anand@example.com",
    assignedLeads: [
      { name: "Lakshmi Narayanan", status: "Converted" },
      { name: "Priya Selvam", status: "Dropped" },
      { name: "Ravi Kumar", status: "Not Contacted" },
    ],
    performanceMetrics: {
      dailyCallTarget: 60,
      monthlyLeadGoal: 350,
      completedCallsToday: 50,
      leadsAssignedToday: 10,
    },
    status: "Active",
  },
  {
    _id: "688e62123825fdf0a7e16947",
    name: "Priya Selvam",
    phone: "+919800112233",
    email: "priya.selvam@example.com",
    assignedLeads: [
      { name: "Karthik Subramanian", status: "In Progress" },
      { name: "Sundar Rajan", status: "Converted" },
      { name: "Ravi Kumar", status: "Dropped" },
      { name: "Lakshmi Narayanan", status: "Not Contacted" },
    ],
    performanceMetrics: {
      dailyCallTarget: 45,
      monthlyLeadGoal: 280,
      completedCallsToday: 30,
      leadsAssignedToday: 7,
    },
    status: "Active",
  },
  {
    _id: "688e62123825fdf0a7e16948",
    name: "Ravi Kumar",
    phone: "+919855667788",
    email: "ravi.kumar@example.com",
    assignedLeads: [
      { name: "Priya Selvam", status: "Converted" },
      { name: "Lakshmi Narayanan", status: "In Progress" },
      { name: "Vijay Anand", status: "Dropped" },
    ],
    performanceMetrics: {
      dailyCallTarget: 50,
      monthlyLeadGoal: 300,
      completedCallsToday: 40,
      leadsAssignedToday: 6,
    },
    status: "Active",
  },
  {
    _id: "688e62123825fdf0a7e16949",
    name: "Lakshmi Narayanan",
    phone: "+919844556677",
    email: "lakshmi.narayanan@example.com",
    assignedLeads: [
      { name: "Priya Selvam", status: "Converted" },
      { name: "Ravi Kumar", status: "In Progress" },
      { name: "Vijay Anand", status: "Not Contacted" },
      { name: "Karthik Subramanian", status: "Dropped" },
    ],
    performanceMetrics: {
      dailyCallTarget: 48,
      monthlyLeadGoal: 290,
      completedCallsToday: 35,
      leadsAssignedToday: 8,
    },
    status: "Active",
  },
  {
    _id: "688e62123825fdf0a7e16950",
    name: "Sundar Rajan",
    phone: "+919833221144",
    email: "sundar.rajan@example.com",
    assignedLeads: [
      { name: "Lakshmi Narayanan", status: "Converted" },
      { name: "Priya Selvam", status: "In Progress" },
      { name: "Ravi Kumar", status: "Not Contacted" },
    ],
    performanceMetrics: {
      dailyCallTarget: 52,
      monthlyLeadGoal: 310,
      completedCallsToday: 45,
      leadsAssignedToday: 9,
    },
    status: "Active",
  },
];

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

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000); // 2.5s
    return () => clearTimeout(timer);
  }, []);

  // Filter logic
  const filteredTelecallers = telecallers.filter((tc) =>
    tc.name.toLowerCase().includes(search.toLowerCase())
  );

  // Helper: Get top 3 telecallers by completedCallsToday (for Monthly)
  const topTelecallers = [...telecallers]
    .sort(
      (a, b) =>
        b.performanceMetrics.completedCallsToday -
        a.performanceMetrics.completedCallsToday
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white px-0 py-8">
      <div className="max-w-6xl mx-auto">
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
            {topTelecallers.map((tc, idx) => (
              <div
                key={tc._id}
                className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-[#FFD700] p-6 flex flex-col items-center justify-center transition hover:scale-[1.03] hover:shadow-2xl"
                style={{
                  boxShadow: "0 4px 24px 0 rgba(255, 215, 0, 0.10)",
                }}
              >
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 rounded-full bg-[#FFD700]/80 text-[#7C3AED] text-xs font-bold shadow">
                    {idx === 0 ? "🥇 Top Performer" : idx === 1 ? "🥈" : "🥉"}
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
                      {tc.performanceMetrics.completedCallsToday}
                    </span>{" "}
                    Calls
                  </span>
                  <span className="text-xs text-gray-500">
                    Target:{" "}
                    <span className="font-bold">
                      {tc.performanceMetrics.dailyCallTarget}
                    </span>
                  </span>
                  <span className="text-xs text-gray-500">
                    Leads Today:{" "}
                    <span className="font-bold">
                      {tc.performanceMetrics.leadsAssignedToday}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                  Assigned LeadsToday
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
                    <span className="font-bold">{tc.assignedLeads.length}</span>
                    <div className="flex gap-1 mt-1 overflow-x-auto whitespace-nowrap">
                      {tc.assignedLeads.slice(0, 3).map((lead, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            statusColors[lead.status]
                          }`}
                          title={`${lead.name} - ${lead.status}`}
                        >
                          {lead.name.split(" ")[0]} ({lead.status})
                        </span>
                      ))}
                      {tc.assignedLeads.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 border border-gray-200">
                          +{tc.assignedLeads.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">
                    {tc.performanceMetrics.dailyCallTarget}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">
                    <span className="font-bold text-[#16A34A]">
                      {tc.performanceMetrics.completedCallsToday}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      (
                      {Math.round(
                        (tc.performanceMetrics.completedCallsToday /
                          tc.performanceMetrics.dailyCallTarget) *
                          100
                      )}
                      %)
                    </span>
                    <div className="w-full h-2 bg-gray-200 rounded mt-1">
                      <div
                        className="h-2 rounded bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (tc.performanceMetrics.completedCallsToday /
                              tc.performanceMetrics.dailyCallTarget) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 whitespace-nowrap">
                    {tc.performanceMetrics.leadsAssignedToday}
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
                      className="bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FF8C00] text-white px-4 py-2 rounded shadow flex items-center gap-2 text-xs font-semibold hover:scale-105 transition font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/viewtelecaller`);
                      }}
                    >
                      <FaChartLine /> View Telecaller Profile
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
                    No telecallers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showConfetti && <Confetti />}
      </div>
    </div>
  );
}
