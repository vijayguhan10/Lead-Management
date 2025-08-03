import React, { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaSearch,
  FaPlay,
  FaRegCommentDots,
  FaEllipsisV,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const callLogs = [
  {
    date: "Today",
    logs: [
      {
        time: "12:12 PM",
        name: "Anthony K. Powell",
        type: "inbound",
        phone: "+1 917 456 7890",
        client: "Store",
        agent: "Maryanna Rubenstein",
        agentInitials: "MR",
        duration: 5, // minutes
        durationStr: "00:05",
        recording: "01:15",
        status: "Answered",
      },
      {
        time: "9:02 AM",
        name: "Unknown",
        type: "inbound",
        phone: "+1 926 456 7890",
        client: "Office",
        agent: "Maryanna Rubenstein",
        agentInitials: "MR",
        duration: 1.09,
        durationStr: "01:09",
        recording: "01:09",
        status: "Missed",
      },
    ],
  },
  {
    date: "Jul 27",
    logs: [
      {
        time: "8:43 PM",
        name: "Alice",
        type: "outbound",
        phone: "+1 803 456 7890",
        client: "Store",
        agent: "Maryanna Rubenstein",
        agentInitials: "MR",
        duration: 0.01,
        durationStr: "00:01",
        recording: "",
        status: "Declined",
      },
      {
        time: "5:10 PM",
        name: "Site visitor",
        type: "inbound",
        phone: "",
        client: "Website Home",
        agent: "",
        agentInitials: "",
        duration: 0.52,
        durationStr: "00:52",
        recording: "00:48",
        status: "Answered",
      },
    ],
  },
];

const statusColors = {
  Answered: "bg-green-50 text-green-700 border border-green-100",
  Missed: "bg-red-50 text-red-700 border border-red-100",
  Declined: "bg-yellow-50 text-yellow-700 border border-yellow-100",
};

const statusFilters = ["All", "Answered", "Missed", "Declined"];

function getDashboardStats(logs) {
  let totalCalls = 0,
    answered = 0,
    missed = 0,
    declined = 0,
    totalDuration = 0;
  logs.forEach((group) =>
    group.logs.forEach((log) => {
      totalCalls++;
      totalDuration += Number(log.duration) || 0;
      if (log.status === "Answered") answered++;
      if (log.status === "Missed") missed++;
      if (log.status === "Declined") declined++;
    })
  );
  return {
    totalCalls,
    answered,
    missed,
    declined,
    totalDurationStr: `${Math.floor(totalDuration)} min`,
  };
}

export default function CallLogs() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);

  // Filter logs by status and date
  const filteredLogs = callLogs
    .filter((group) => {
      if (!selectedDate) return true;
      // Match group.date with selectedDate
      const groupDate = new Date(group.date);
      return (
        groupDate.toDateString() === selectedDate.toDateString() ||
        group.date === "Today"
      );
    })
    .map((group) => ({
      ...group,
      logs:
        statusFilter === "All"
          ? group.logs
          : group.logs.filter((log) => log.status === statusFilter),
    }));

  const dashboardStats = getDashboardStats(filteredLogs);

  return (
    <div className="bg-white min-h-screen px-0 py-6">
      {/* Dashboard Summary */}
      <div className="flex items-center gap-8 px-8 py-4 bg-gradient-to-r from-[#f6f8fb] via-[#e0e7ff] to-[#fffbe6] rounded-xl shadow mb-4">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Total Calls</span>
          <span className="font-bold text-lg text-[#7C3AED]">
            {dashboardStats.totalCalls}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Answered</span>
          <span className="font-bold text-lg text-[#16A34A]">
            {dashboardStats.answered}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Missed</span>
          <span className="font-bold text-lg text-[#EF4444]">
            {dashboardStats.missed}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Declined</span>
          <span className="font-bold text-lg text-[#F59E42]">
            {dashboardStats.declined}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Total Duration</span>
          <span className="font-bold text-lg text-[#4F46E5]">
            {dashboardStats.totalDurationStr}
          </span>
        </div>
        <div className="flex-1"></div>
        {/* Calendar Date Picker */}
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          placeholderText="Select date"
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-white"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 px-8 mb-2">
        {statusFilters.map((f) => (
          <button
            key={f}
            className={`px-3 py-1 rounded-full text-sm font-semibold border ${
              statusFilter === f
                ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                : "bg-white text-[#7C3AED] border-[#e5e7eb]"
            } transition`}
            onClick={() => setStatusFilter(f)}
          >
            {f}
          </button>
        ))}
        {/* Export/Download Button */}
        <button className="ml-auto px-3 py-1 rounded text-xs font-semibold bg-[#e0e7ff] text-[#4F46E5] border border-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition">
          Export Logs
        </button>
      </div>

      {/* Table */}
      <div className="bg-white px-8">
        <h2 className="text-xl font-bold text-[#4F46E5] mb-4">Call Logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 text-gray-700">
                <th className="py-3 px-4 border-b border-r border-gray-200 text-left">
                  Time
                </th>
                <th className="py-3 px-4 border-b border-r border-gray-200 text-left">
                  Type
                </th>
                <th className="py-3 px-4 border-b border-r border-gray-200 text-left">
                  Name
                </th>
                <th className="py-3 px-4 border-b border-r border-gray-200 text-left">
                  Client
                </th>
                <th className="py-3 px-4 border-b border-r border-gray-200 text-left">
                  Phone
                </th>
                <th className="py-3 px-4 border-b border-r border-gray-200 text-left">
                  Agent
                </th>
                <th className="py-3 px-4 border-b border-r border-gray-200 text-left">
                  Duration
                </th>
                <th className="py-3 px-4 border-b border-r border-gray-200 text-left">
                  Recording
                </th>
                <th className="py-3 px-4 border-b border-r border-gray-200 text-left">
                  Status
                </th>
                <th className="py-3 px-4 border-b border-gray-200 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((group) => (
                <React.Fragment key={group.date}>
                  {/* Date Group Header */}
                  <tr>
                    <td
                      colSpan={10}
                      className="sticky left-0 bg-white font-semibold text-[#7C3AED] py-2 px-4 border-b border-gray-200"
                    >
                      {group.date}
                    </td>
                  </tr>
                  {group.logs.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="py-6 text-center text-gray-400 border-b border-gray-200"
                      >
                        No calls for this status.
                      </td>
                    </tr>
                  )}
                  {group.logs.map((log, idx) => (
                    <tr
                      key={idx}
                      className="bg-white hover:bg-[#f6f8fb] transition"
                    >
                      {/* Time */}
                      <td className="py-3 px-4 border-b border-r border-gray-200 flex items-center gap-2">
                        {log.type === "inbound" ? (
                          <FaArrowDown
                            className="text-[#16A34A]"
                            title="Inbound"
                          />
                        ) : (
                          <FaArrowUp
                            className="text-[#EF4444]"
                            title="Outbound"
                          />
                        )}
                        {log.time}
                      </td>
                      {/* Type */}
                      <td className="py-3 px-4 border-b border-r border-gray-200">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            log.type === "inbound"
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                        >
                          {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                        </span>
                      </td>
                      {/* Name */}
                      <td className="py-3 px-4 border-b border-r border-gray-200 font-semibold text-gray-800 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-[#e0e7ff] text-[#7C3AED] rounded-full text-xs font-bold">
                          {log.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                        {log.name}
                      </td>
                      {/* Client */}
                      <td className="py-3 px-4 border-b border-r border-gray-200">
                        {log.client}
                      </td>
                      {/* Phone */}
                      <td className="py-3 px-4 border-b border-r border-gray-200">
                        {log.phone}
                      </td>
                      {/* Agent */}
                      <td className="py-3 px-4 border-b border-r border-gray-200 flex items-center gap-2">
                        {log.agentInitials && (
                          <span className="inline-flex items-center justify-center w-7 h-7 bg-[#f6f8fb] text-[#4F46E5] rounded-full text-xs font-bold">
                            {log.agentInitials}
                          </span>
                        )}
                        {log.agent}
                      </td>
                      {/* Duration */}
                      <td className="py-3 px-4 border-b border-r border-gray-200">
                        {log.durationStr}
                        <div className="w-16 h-2 bg-gray-200 rounded mt-1">
                          <div
                            className="h-2 rounded bg-gradient-to-r from-[#7C3AED] to-[#4F46E5]"
                            style={{
                              width: `${Math.min(100, log.duration * 20)}%`,
                            }}
                          ></div>
                        </div>
                      </td>
                      {/* Recording */}
                      <td className="py-3 px-4 border-b border-r border-gray-200">
                        {log.recording}
                      </td>
                      {/* Status Chip */}
                      <td
                        className={`py-3 px-4 border-b border-r border-gray-200`}
                      >
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            statusColors[log.status]
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="py-3 px-4 border-b border-gray-200 flex gap-3">
                        <button
                          className="p-2 rounded hover:bg-gray-100"
                          title="Play Recording"
                        >
                          <FaPlay className="text-[#4F46E5]" />
                        </button>
                        <button
                          className="p-2 rounded hover:bg-gray-100"
                          title="View/Add Notes"
                        >
                          <FaRegCommentDots className="text-[#16A34A]" />
                        </button>
                        <button
                          className="p-2 rounded hover:bg-gray-100"
                          title="More Actions"
                        >
                          <FaEllipsisV className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination, Sorting, Notes Modal, etc. can be added here */}
      </div>
    </div>
  );
}
