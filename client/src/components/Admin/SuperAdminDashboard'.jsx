import React, { useState } from "react";
import {
  FaUserTie,
  FaUserCircle,
  FaPhone,
  FaWhatsapp,
  FaChartLine,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
} from "react-icons/fa";

const superStats = [
  {
    label: "Total Leads",
    value: "1,250",
    icon: <FaChartLine className="text-blue-500" />,
  },
  {
    label: "Total Admins",
    value: "8",
    icon: <FaUserTie className="text-purple-500" />,
  },
  {
    label: "Total Telecallers",
    value: "22",
    icon: <FaUserCircle className="text-green-500" />,
  },
];

const exotelStats = [
  {
    label: "Virtual Numbers",
    value: "15",
    icon: <FaPhone className="text-blue-500" />,
  },
  {
    label: "Available Balance",
    value: "₹ 8,500",
    icon: <FaMoneyBillWave className="text-green-500" />,
  },
  {
    label: "Active Numbers",
    value: "12",
    icon: <FaPhone className="text-purple-500" />,
  },
  {
    label: "Total Call Duration",
    value: "120h 30m",
    icon: <FaClock className="text-yellow-500" />,
  },
];

const whatsappStats = [
  {
    label: "Active Numbers",
    value: "5",
    icon: <FaWhatsapp className="text-green-500" />,
  },
  {
    label: "Total Messages",
    value: "3,200",
    icon: <FaWhatsapp className="text-green-500" />,
  },
];

const telecallers = [
  {
    name: "Priya Sharma",
    phone: "+919876543210",
    email: "priya@company.com",
    status: "Active",
    leads: 45,
  },
  {
    name: "Rahul Verma",
    phone: "+919876543211",
    email: "rahul@company.com",
    status: "Active",
    leads: 38,
  },
  {
    name: "Sneha Patel",
    phone: "+919876543212",
    email: "sneha@company.com",
    status: "Inactive",
    leads: 27,
  },
];

const admins = [
  {
    name: "Turja",
    phone: "+919876543213",
    email: "turja@company.com",
    status: "Active",
  },
  {
    name: "Amit Patel",
    phone: "+919876543214",
    email: "amit@company.com",
    status: "Active",
  },
];

// Mock storage data for each admin
const storageStats = [
  { name: "Turja", used: 2.5, total: 5 },
  { name: "Amit Patel", used: 1.2, total: 5 },
];

export default function SuperAdminDashboard() {
  const [view, setView] = useState("telecallers");

  return (
    <div className="min-h-screen max-h-full bg-gray-50 px-6 py-8 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {superStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 border border-gray-200"
          >
            <div className="text-3xl">{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaPhone /> Exotel Integration
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {exotelStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 bg-gray-50 rounded p-4"
              >
                <div className="text-xl">{stat.icon}</div>
                <div>
                  <div className="font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
            <FaWhatsapp /> WhatsApp Integration
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {whatsappStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 bg-gray-50 rounded p-4"
              >
                <div className="text-xl">{stat.icon}</div>
                <div>
                  <div className="font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Table with Toggle */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-purple-700 flex items-center gap-2">
            <FaUsers /> {view === "telecallers" ? "Telecallers" : "Admins"}{" "}
            Details
          </h2>
          <div className="flex gap-2 bg-gray-100 rounded-full p-1">
            <button
              className={`px-4 py-1 rounded-full font-semibold transition ${
                view === "telecallers"
                  ? "bg-purple-600 text-white shadow"
                  : "text-purple-700"
              }`}
              onClick={() => setView("telecallers")}
            >
              Telecallers
            </button>
            <button
              className={`px-4 py-1 rounded-full font-semibold transition ${
                view === "admins"
                  ? "bg-purple-600 text-white shadow"
                  : "text-purple-700"
              }`}
              onClick={() => setView("admins")}
            >
              Admins
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-base rounded overflow-hidden border border-gray-100">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left font-semibold">Name</th>
                <th className="py-3 px-4 text-left font-semibold">Phone</th>
                <th className="py-3 px-4 text-left font-semibold">Email</th>
                <th className="py-3 px-4 text-left font-semibold">Status</th>
                {view === "telecallers" && (
                  <th className="py-3 px-4 text-left font-semibold">
                    Leads Assigned
                  </th>
                )}
                <th className="py-3 px-4 text-left font-semibold">Role</th>
              </tr>
            </thead>
            <tbody>
              {view === "telecallers"
                ? telecallers.map((tc, idx) => (
                    <tr
                      key={tc.email}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-3 px-4 font-bold text-blue-700">
                        {tc.name}
                      </td>
                      <td className="py-3 px-4">{tc.phone}</td>
                      <td className="py-3 px-4">{tc.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold shadow ${
                            tc.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {tc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{tc.leads}</td>
                      <td className="py-3 px-4">Telecaller</td>
                    </tr>
                  ))
                : admins.map((ad, idx) => (
                    <tr
                      key={ad.email}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-3 px-4 font-bold text-purple-700">
                        {ad.name}
                      </td>
                      <td className="py-3 px-4">{ad.phone}</td>
                      <td className="py-3 px-4">{ad.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full font-semibold shadow bg-blue-100 text-blue-700">
                          {ad.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">Admin</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storage Usage Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-10">
        <h2 className="text-lg font-bold text-indigo-700 mb-4 flex items-center gap-2">
          <FaChartLine /> Storage Usage
        </h2>
        <div className="mb-4">
          <div className="text-sm text-gray-600 font-semibold mb-2">
            Total Storage Used:{" "}
            <span className="text-indigo-600">
              {storageStats.reduce((acc, s) => acc + s.used, 0).toFixed(1)} GB
            </span>
            {" / "}
            <span className="text-gray-500">
              {storageStats.reduce((acc, s) => acc + s.total, 0)} GB
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded h-3 mb-2">
            <div
              className="bg-indigo-500 h-3 rounded"
              style={{
                width:
                  (storageStats.reduce((acc, s) => acc + s.used, 0) /
                    storageStats.reduce((acc, s) => acc + s.total, 0)) *
                    100 +
                  "%",
              }}
            ></div>
          </div>
        </div>
        <table className="min-w-full text-base rounded overflow-hidden border border-gray-100">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4 text-left font-semibold">Admin</th>
              <th className="py-2 px-4 text-left font-semibold">
                Storage Used
              </th>
              <th className="py-2 px-4 text-left font-semibold">
                Pending Storage
              </th>
              <th className="py-2 px-4 text-left font-semibold">
                Total Storage
              </th>
            </tr>
          </thead>
          <tbody>
            {storageStats.map((admin, idx) => (
              <tr
                key={admin.name}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-2 px-4 font-bold text-indigo-700">
                  {admin.name}
                </td>
                <td className="py-2 px-4">{admin.used} GB</td>
                <td className="py-2 px-4">
                  {(admin.total - admin.used).toFixed(1)} GB
                </td>
                <td className="py-2 px-4">{admin.total} GB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ...rest of dashboard... */}
    </div>
  );
}
