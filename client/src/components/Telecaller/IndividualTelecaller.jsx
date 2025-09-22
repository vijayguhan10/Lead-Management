import React, { useState } from "react";
import {
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaCommentDots,
  FaUserCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaChartLine,
  FaStar,
  FaDownload,
  FaSearch,
  FaCalendarAlt,
  FaTrophy,
  FaRobot,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Converted", value: 18 },
  { name: "Pending", value: 22 },
  { name: "Staging", value: 10 },
];

const telecaller = {
  name: "Arun Kumar",
  email: "arun.kumar@tamilmail.com",
  profile: "",
  todayAssignments: 12,
  todayFollowups: 11,
  yesterdayPending: 4,
  completedClosed: 132,
  monthlyCalls: 120,
  monthlyTarget: 400,
  totalDuration: "5h 20m",
  progressRate: 30.0,
  avgDuration: "7m",
  firstResponse: "1m",
  missedCalls: 2,
  badges: ["200 Calls", "25 Conversions"],
};

const callLogs = [
  {
    id: 1,
    lead: "Karthik Subramanian",
    time: "09:10 AM",
    duration: "10m",
    status: "Completed",
    stage: "Converted",
    date: "2025-08-03",
  },
  {
    id: 2,
    lead: "Meena Ramesh",
    time: "10:30 AM",
    duration: "6m",
    status: "Completed",
    stage: "Pending",
    date: "2025-08-03",
  },
  {
    id: 3,
    lead: "Sundar Rajan",
    time: "11:15 AM",
    duration: "8m",
    status: "Completed",
    stage: "Staging",
    date: "2025-08-02",
  },
];

const assignedLeads = [
  {
    name: "Karthik Subramanian",
    status: "Converted",
    duration: "10m",
    date: "2025-08-03",
  },
  {
    name: "Meena Ramesh",
    status: "Pending",
    duration: "6m",
    date: "2025-08-03",
  },
  {
    name: "Sundar Rajan",
    status: "Staging",
    duration: "8m",
    date: "2025-08-02",
  },
];

const conversionStats = [
  {
    label: "Converted",
    value: 18,
    icon: <FaCheckCircle className="text-[#16A34A]" />,
    color: "bg-[#dcfce7] text-[#16A34A]",
  },
  {
    label: "Pending",
    value: 22,
    icon: <FaHourglassHalf className="text-[#F59E42]" />,
    color: "bg-[#fef9c3] text-[#F59E42]",
  },
  {
    label: "Staging",
    value: 10,
    icon: <FaChartLine className="text-[#7C3AED]" />,
    color: "bg-[#ede9fe] text-[#7C3AED]",
  },
];

const todayDate = "2025-08-03";
const todaysAssignedLeads = assignedLeads.filter(
  (lead) => lead.date === todayDate
);

export default function IndividualTelecaller() {
  const [globalTab, setGlobalTab] = useState("Overall");
  const [statsTab, setStatsTab] = useState("Monthly");
  const [analyticsTab, setAnalyticsTab] = useState("Monthly");
  const [conversionTab, setConversionTab] = useState("Monthly");

  return (
    <div className="bg-gradient-to-br max-h-screen max-w-screen overflow-hidden flex flex-col">
      {/* Global Tab Selector */}
      <div className="flex items-center justify-start px-6 pt-4">
        <div className="flex gap-2">
          {["Monthly", "Yearly", "Overall"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-1 rounded-full font-semibold text-sm border ${
                globalTab === tab
                  ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                  : "bg-white text-[#7C3AED] border-[#e5e7eb]"
              } transition`}
              onClick={() => setGlobalTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between flex-shrink-0 px-6 pt-2 pb-2">
        <span className="font-semibold text-gray-700 text-lg flex items-center gap-2">
          <FaArrowLeft className="mr-2" />
          Back to Telecallers
        </span>
        <div className="flex gap-2">
          <button
            className="bg-gradient-to-r from-[#d2ffeb] via-[#4F46E5] to-[#ff8ae0] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-bold border-2 border-[#7C3AED] 
    hover:from-[#16A34A] hover:via-[#4F46E5] hover:to-[#7C3AED] 
    hover:shadow-[0_0_16px_4px_rgba(124,60,237,0.3)] transition-all duration-300"
          >
            <FaRobot className="animate-bounce" />
            Ai Report
          </button>
          <button className="bg-[#7C3AED] text-white px-3 py-1 rounded shadow flex items-center gap-2 text-xs font-semibold hover:bg-[#5b2edd] transition">
            <FaDownload /> Export Logs
          </button>
          <button className="bg-[#f6f8fb] text-[#7C3AED] px-3 py-1 rounded shadow flex items-center gap-2 text-xs font-semibold hover:bg-[#e0e7ff] transition">
            <FaTrophy /> Leaderboard
          </button>
        </div>
      </div>

      {/* Header */}

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 gap-4 px-4 pb-4">
        {/* Left Section */}
        <div className="flex-[1] min-h-0 flex flex-col gap-2 overflow-hidden">
          {/* Telecaller Info */}
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-6 flex-shrink-0">
            <FaUserCircle className="text-5xl text-gray-400" />
            <div>
              <div className="font-semibold text-lg text-gray-800">
                {telecaller.name}
              </div>
              <div className="text-sm text-gray-500">{telecaller.email}</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {telecaller.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="bg-[#ede9fe] text-[#7C3AED] px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                  >
                    <FaStar className="text-[#f59e42]" /> {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              <button className="p-2 rounded-full bg-[#f6f8fb] text-[#7C3AED] shadow hover:bg-[#e0e7ff]">
                <FaPhone />
              </button>
              <button className="p-2 rounded-full bg-[#f6f8fb] text-[#7C3AED] shadow hover:bg-[#e0e7ff]">
                <FaEnvelope />
              </button>
              <button className="p-2 rounded-full bg-[#f6f8fb] text-[#7C3AED] shadow hover:bg-[#e0e7ff]">
                <FaCommentDots />
              </button>
            </div>
          </div>
          {/* Stats Grid with Tab */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-800 text-base">
              Telecaller Stats
            </span>
            <div className="flex gap-2">
              {["Monthly", "Yearly", "Overall"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    statsTab === tab
                      ? "bg-[#16A34A] text-white border-[#16A34A]"
                      : "bg-white text-[#16A34A] border-[#e5e7eb]"
                  } transition`}
                  onClick={() => setStatsTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-shrink-0">
            <div className="bg-[#f6f8fb] rounded-lg p-3 flex flex-col items-center shadow">
              <span className="text-xs text-gray-500 mb-1">
                Today's Follow up
              </span>
              <span className="text-2xl font-bold text-[#7C3AED]">
                {telecaller.todayFollowups ?? 11}
              </span>
            </div>
            <div className="bg-[#f6f8fb] rounded-lg p-3 flex flex-col items-center shadow">
              <span className="text-xs text-gray-500 mb-1">
                Yesterday Pending
              </span>
              <span className="text-2xl font-bold text-[#F59E42]">
                {telecaller.yesterdayPending ?? 4}
              </span>
            </div>
            <div className="bg-[#f6f8fb] rounded-lg p-3 flex flex-col items-center shadow">
              <span className="text-xs text-gray-500 mb-1">
                Completed / Closed
              </span>
              <span className="text-2xl font-bold text-[#16A34A]">
                {telecaller.completedClosed ?? 132}
              </span>
            </div>
          </div>
          {/* Call Conversion Analytics with Tab */}
          <div className="bg-white rounded-xl shadow p-2 flex-shrink-0 mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-800 text-base">
                Call Conversion Analytics
              </span>
              <div className="flex gap-2">
                {["Monthly", "Yearly", "Overall"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      analyticsTab === tab
                        ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                        : "bg-white text-[#4F46E5] border-[#e5e7eb]"
                    } transition`}
                    onClick={() => setAnalyticsTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Call Logs Table */}
          <div className="bg-white rounded-xl shadow p-2 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-700">Call Logs</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search calls..."
                  className="border rounded px-2 py-1 text-xs"
                />
                <button className="bg-[#7C3AED] text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:bg-[#5b2edd] transition">
                  <FaSearch /> Search
                </button>
              </div>
            </div>
            <div className="overflow-hidden flex-1 min-h-0">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-gray-500">
                    <th className="py-2 px-2 text-left">#</th>
                    <th className="py-2 px-2 text-left">Lead Name</th>
                    <th className="py-2 px-2 text-left">Time</th>
                    <th className="py-2 px-2 text-left">Duration</th>
                    <th className="py-2 px-2 text-left">Status</th>
                    <th className="py-2 px-2 text-left">Stage</th>
                    <th className="py-2 px-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {callLogs.slice(0, 3).map((log, idx) => (
                    <tr
                      key={log.id}
                      className="border-b last:border-none hover:bg-[#f6f8fb] transition"
                    >
                      <td className="py-2 px-2">{log.id}</td>
                      <td className="py-2 px-2">{log.lead}</td>
                      <td className="py-2 px-2">{log.time}</td>
                      <td className="py-2 px-2">{log.duration}</td>
                      <td className="py-2 px-2">
                        <span className="px-2 py-1 rounded font-semibold text-[10px] bg-[#e6f0fd] text-[#1e40af]">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-2 py-1 rounded font-semibold text-[10px] ${
                            log.stage === "Converted"
                              ? "bg-[#dcfce7] text-[#16A34A]"
                              : log.stage === "Pending"
                              ? "bg-[#fef9c3] text-[#F59E42]"
                              : "bg-[#ede9fe] text-[#7C3AED]"
                          }`}
                        >
                          {log.stage}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <button className="bg-[#16A34A] text-white px-2 py-1 rounded text-xs font-semibold mr-1 hover:bg-[#128a3a] transition">
                          Call Now
                        </button>
                        <button className="bg-[#7C3AED] text-white px-2 py-1 rounded text-xs font-semibold hover:bg-[#5b2edd] transition">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Right Section */}
        <div
          className="flex-[0.4] min-w-0 min-h-0 flex flex-col gap-2 overflow-hidden"
          style={{ maxWidth: 340 }}
        >
          {/* Assigned Leads */}
          <div className="bg-[#f6f8fb] rounded-xl p-2 shadow flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Assigned Leads Header */}
            <div className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
              <span>Assigned Leads</span>
              <button className="text-xs text-[#7C3AED] font-semibold">
                View All
              </button>
            </div>
            {/* Assigned Leads List - scrollable if needed */}
            <div className="space-y-2 overflow-auto min-h-0">
              {assignedLeads.slice(0, 3).map((lead, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-white rounded px-2 py-2 shadow hover:bg-[#f6f8fb] transition"
                >
                  <div>
                    <div className="font-medium text-gray-700 text-sm">
                      {lead.name}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Duration:{" "}
                      <span className="font-semibold">{lead.duration}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-1 rounded font-semibold shadow transition ${
                      lead.status === "Converted"
                        ? "bg-[#dcfce7] text-[#16A34A]"
                        : lead.status === "Pending"
                        ? "bg-[#fef9c3] text-[#F59E42]"
                        : "bg-[#ede9fe] text-[#7C3AED]"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
            {/* Today's Assigned Leads */}
            <div className="bg-white rounded-xl shadow p-2 mt-2 flex-shrink-0">
              <div className="font-semibold text-gray-700 mb-1">
                Today's Assigned Leads
              </div>
              <div className="grid grid-cols-1 gap-2">
                {todaysAssignedLeads.slice(0, 4).map((lead, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f6f8fb] rounded p-2 flex flex-col items-start shadow"
                  >
                    <span className="font-medium text-gray-700 text-sm">
                      {lead.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      Duration:{" "}
                      <span className="font-semibold">{lead.duration}</span>
                    </span>
                    <span
                      className={`text-[10px] px-2 py-1 rounded font-semibold mt-1 ${
                        lead.status === "Converted"
                          ? "bg-[#dcfce7] text-[#16A34A]"
                          : lead.status === "Pending"
                          ? "bg-[#fef9c3] text-[#F59E42]"
                          : "bg-[#ede9fe] text-[#7C3AED]"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Conversion Stats with Tab */}
          <div className="bg-[#f6f8fb] rounded-xl p-2 shadow">
            <div className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
              <span>Conversion Stats</span>
              <div className="flex gap-2">
                {["Monthly", "Yearly", "Overall"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      conversionTab === tab
                        ? "bg-[#FFD700] text-[#7C3AED] border-[#FFD700]"
                        : "bg-white text-[#7C3AED] border-[#e5e7eb]"
                    } transition`}
                    onClick={() => setConversionTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {conversionStats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-2 flex flex-col items-center ${stat.color} shadow`}
                >
                  {stat.icon}
                  <span className="font-bold text-sm">{stat.value}</span>
                  <span className="text-[10px]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
