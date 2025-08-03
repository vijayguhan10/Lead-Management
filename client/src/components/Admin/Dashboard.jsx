import React from "react";
import {
  FaUserTie,
  FaCheckCircle,
  FaHourglassHalf,
  FaChartLine,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Chart Data for Lead Conversion
const leadChartData = [
  { name: "Jan", assigned: 100, converted: 60, pending: 40 },
  { name: "Feb", assigned: 120, converted: 80, pending: 50 },
  { name: "Mar", assigned: 140, converted: 100, pending: 60 },
  { name: "Apr", assigned: 160, converted: 120, pending: 70 },
  { name: "May", assigned: 180, converted: 140, pending: 80 },
  { name: "Jun", assigned: 200, converted: 160, pending: 90 },
  { name: "Jul", assigned: 190, converted: 150, pending: 85 },
  { name: "Aug", assigned: 170, converted: 140, pending: 80 },
  { name: "Sep", assigned: 160, converted: 130, pending: 75 },
  { name: "Oct", assigned: 150, converted: 120, pending: 70 },
  { name: "Nov", assigned: 140, converted: 110, pending: 65 },
  { name: "Dec", assigned: 130, converted: 100, pending: 60 },
];

const stats = [
  {
    label: "Assigned Leads",
    value: "320",
    sub: "This month",
    icon: <FaUserTie className="text-[#4F46E5] text-lg" />,
    percent: 80,
    color: "from-[#e0e7ff] to-[#f3f4f6]",
  },
  {
    label: "Converted Leads",
    value: "210",
    sub: "This month",
    icon: <FaCheckCircle className="text-[#16A34A] text-lg" />,
    percent: 65,
    color: "from-[#dcfce7] to-[#f3f4f6]",
  },
  {
    label: "Pending Leads",
    value: "110",
    sub: "This month",
    icon: <FaHourglassHalf className="text-[#F59E42] text-lg" />,
    percent: 35,
    color: "from-[#fef9c3] to-[#f3f4f6]",
  },
  {
    label: "Conversion Rate",
    value: "65%",
    sub: "Overall",
    icon: <FaChartLine className="text-[#7C3AED] text-lg" />,
    percent: 65,
    color: "from-[#ede9fe] to-[#f3f4f6]",
  },
];

const telecallers = [
  { name: "Priya Sharma", assigned: 45, status: "Active" },
  { name: "Rahul Verma", assigned: 38, status: "Active" },
  { name: "Sneha Patel", assigned: 27, status: "Inactive" },
];

const assignedLeads = [
  {
    type: "Product Demo",
    id: "LD-2023",
    telecaller: "Priya Sharma",
    date: "03/08/2025",
    status: "Assigned",
  },
  {
    type: "Follow-up Call",
    id: "LD-2024",
    telecaller: "Rahul Verma",
    date: "03/08/2025",
    status: "Assigned",
  },
  {
    type: "Document Collection",
    id: "LD-2025",
    telecaller: "Sneha Patel",
    date: "03/08/2025",
    status: "Assigned",
  },
  {
    type: "Lead Qualification",
    id: "LD-2026",
    telecaller: "Priya Sharma",
    date: "03/08/2025",
    status: "Assigned",
  },
];

const ongoingLeads = [
  {
    type: "Product Demo",
    id: "LD-2027",
    telecaller: "Rahul Verma",
    date: "03/08/2025",
    status: "In Progress",
  },
  {
    type: "Follow-up Call",
    id: "LD-2028",
    telecaller: "Priya Sharma",
    date: "03/08/2025",
    status: "In Progress",
  },
  {
    type: "Lead Nurturing",
    id: "LD-2029",
    telecaller: "Sneha Patel",
    date: "03/08/2025",
    status: "In Progress",
  },
];

const Dashboard = () => {
  return (
    <div className="p-2 overflow-hidden  md:p-4 font-poppins bg-gradient-to-br max-h-screen">
      {/* Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-lg flex flex-col items-start p-3 border border-[#e5e7eb] transition-transform hover:scale-[1.03]`}
          >
            <span className="text-[11px] text-gray-500 mb-1 font-semibold">
              {stat.label}
            </span>
            <div className="flex items-center gap-2 mb-1">
              {stat.icon}
              <span className="text-xl font-bold text-gray-800">
                {stat.value}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 mb-1">{stat.sub}</div>
            <div className="w-full h-2 bg-[#e5e7eb] rounded">
              <div
                className="h-2 rounded bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] transition-all"
                style={{ width: `${stat.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        {/* Lead Conversion Chart */}
        <div className="bg-white rounded-lg shadow p-3 col-span-2 flex flex-col min-h-[220px]">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-800 text-base">
              Lead Conversion
            </span>
            <span className="text-[10px] text-gray-500">Monthly Overview</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={leadChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fff8cc" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#fff8cc" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b9fabd" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#b9fabd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="assigned"
                stroke="#7C3AED"
                fillOpacity={1}
                fill="url(#colorAssigned)"
                name="Assigned Leads"
                dot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="converted"
                stroke="#16A34A"
                fillOpacity={1}
                fill="url(#colorConverted)"
                name="Converted Leads"
                dot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Telecallers Overview */}
        <div className="bg-white rounded-lg shadow p-3 flex flex-col min-h-[220px]">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-800 text-base">
              Telecallers Overview
            </span>
          </div>
          <div className="space-y-2">
            {telecallers.map((tc, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-[#f6f8fb] rounded px-2 py-2"
              >
                <div>
                  <div className="font-medium text-gray-700 text-sm">
                    {tc.name}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Assigned Leads:{" "}
                    <span className="font-semibold">{tc.assigned}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-1 rounded font-semibold shadow transition ${
                      tc.status === "Active"
                        ? "bg-[#dcfce7] text-[#16A34A]"
                        : "bg-[#fde68a] text-[#b45309]"
                    }`}
                  >
                    {tc.status}
                  </span>
                  <button className="bg-[#7C3AED] text-white text-[10px] px-3 py-1 rounded font-semibold shadow hover:bg-[#5b2edd] transition">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Assigned Leads */}
        <div className="bg-white rounded-lg shadow p-3 flex flex-col min-h-[180px]">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-800 text-base">
              Assigned Leads
            </span>
            <button className="text-[10px] text-[#7C3AED] font-semibold">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs rounded-lg overflow-hidden shadow">
              <thead className="bg-[#ede9fe] sticky top-0 z-10">
                <tr className="text-[#7C3AED]">
                  <th className="py-2 px-3 text-left font-semibold">
                    Lead Type
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">Lead ID</th>
                  <th className="py-2 px-3 text-left font-semibold">
                    Telecaller
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">Date</th>
                  <th className="py-2 px-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {assignedLeads.map((lead, idx) => (
                  <tr
                    key={idx}
                    className={`transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-[#f6f8fb]"
                    } hover:bg-[#e0e7ff]`}
                  >
                    <td className="py-2 px-3">{lead.type}</td>
                    <td className="py-2 px-3 font-mono">{lead.id}</td>
                    <td className="py-2 px-3">{lead.telecaller}</td>
                    <td className="py-2 px-3">{lead.date}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`flex items-center gap-1 px-2 py-1 rounded font-semibold text-[10px] shadow
                        ${
                          lead.status === "Assigned"
                            ? "bg-[#e9e6fd] text-[#7C3AED]"
                            : "bg-[#dcfce7] text-[#16A34A]"
                        }
                      `}
                      >
                        {lead.status === "Assigned" ? (
                          <FaHourglassHalf />
                        ) : (
                          <FaCheckCircle />
                        )}
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* On-going Leads */}
        <div className="bg-white rounded-lg shadow p-3 flex flex-col min-h-[180px]">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-800 text-base">
              On-going Leads
            </span>
            <button className="text-[10px] text-[#7C3AED] font-semibold">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs rounded-lg overflow-hidden shadow">
              <thead className="bg-[#fff4e5] sticky top-0 z-10">
                <tr className="text-[#b45309]">
                  <th className="py-2 px-3 text-left font-semibold">
                    Lead Type
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">Lead ID</th>
                  <th className="py-2 px-3 text-left font-semibold">
                    Telecaller
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">Date</th>
                  <th className="py-2 px-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {ongoingLeads.map((lead, idx) => (
                  <tr
                    key={idx}
                    className={`transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-[#f6f8fb]"
                    } hover:bg-[#fde68a]/40`}
                  >
                    <td className="py-2 px-3">{lead.type}</td>
                    <td className="py-2 px-3 font-mono">{lead.id}</td>
                    <td className="py-2 px-3">{lead.telecaller}</td>
                    <td className="py-2 px-3">{lead.date}</td>
                    <td className="py-2 px-3">
                      <span className="flex items-center gap-1 bg-[#fff4e5] text-[#b45309] px-2 py-1 rounded font-semibold text-[10px] shadow">
                        <FaChartLine />
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
