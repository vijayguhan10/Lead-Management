import React, { useState } from "react";
import {
  FaUserEdit,
  FaKey,
  FaToggleOn,
  FaToggleOff,
  FaRegUser,
  FaRegFileAlt,
  FaDatabase,
  FaPhoneAlt,
  FaShieldAlt,
} from "react-icons/fa";

const TELECALLER_LIMIT = 5;
const telecallersData = [
  {
    name: "A. Singh",
    email: "a.singh@example.com",
    phone: "+91-9876543210",
    status: "Active",
    frozen: false,
  },
  {
    name: "K. Joseph",
    email: "k.joseph@example.com",
    phone: "+91-9842123456",
    status: "Active",
    frozen: false,
  },
  {
    name: "R. Nair",
    email: "r.nair@example.com",
    phone: "+91-9866123456",
    status: "Active",
    frozen: false,
  },
];

export default function Settings() {
  const [telecallers, setTelecallers] = useState(telecallersData);
  const [formsCreated] = useState(8);
  const [storageUsed] = useState(2.4); // GB
  const [virtualNumbers] = useState(3);
  const [virtualNumbersUsed] = useState(2);

  // Example user and plan info
  const user = {
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Project Manager",
    username: "arjun.mehta",
    birthday: "Jan 1, 1990",
    phone: "+91-9876543210",
    language: "English",
  };

  // Toggle freeze/unfreeze telecaller
  const handleToggleFreeze = (idx) => {
    setTelecallers((telecallers) =>
      telecallers.map((tc, i) =>
        i === idx ? { ...tc, frozen: !tc.frozen } : tc
      )
    );
  };

  return (
    <div className="w-full min-h-screen bg-white text-black px-0 py-10">
      <div className="max-w-screen-xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-3">Settings</h1>
        <p className="mb-10 text-gray-600 text-lg">
          Customize your profile, account, telecallers, and usage settings.
        </p>

        {/* Profile */}
        <section className="border-b border-gray-200 pb-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="flex items-center gap-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full border border-gray-300"
            />
            <div>
              <div className="font-semibold text-lg">{user.name}</div>
              <div className="text-gray-500">{user.role}</div>
            </div>
            <button className="ml-auto text-gray-500 hover:text-black p-3 rounded transition">
              <FaUserEdit />
            </button>
          </div>
        </section>

        {/* Personal Information */}
        <section className="border-b border-gray-200 pb-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Username
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={user.username}
                  readOnly
                  className="bg-gray-100 border border-gray-300 rounded px-4 py-3 w-full text-black text-base"
                />
                <button className="ml-3 text-gray-500 hover:text-black p-3 rounded transition">
                  <FaUserEdit />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Birthday
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={user.birthday}
                  readOnly
                  className="bg-gray-100 border border-gray-300 rounded px-4 py-3 w-full text-black text-base"
                />
                <button className="ml-3 text-gray-500 hover:text-black p-3 rounded transition">
                  <FaUserEdit />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Email</label>
              <div className="flex items-center">
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="bg-gray-100 border border-gray-300 rounded px-4 py-3 w-full text-black text-base"
                />
                <button className="ml-3 text-gray-500 hover:text-black p-3 rounded transition">
                  <FaUserEdit />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Phone Number
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={user.phone}
                  readOnly
                  className="bg-gray-100 border border-gray-300 rounded px-4 py-3 w-full text-black text-base"
                />
                <button className="ml-3 text-gray-500 hover:text-black p-3 rounded transition">
                  <FaUserEdit />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Account */}
        <section className="border-b border-gray-200 pb-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Password
              </label>
              <div className="flex items-center">
                <input
                  type="password"
                  value="********"
                  readOnly
                  className="bg-gray-100 border border-gray-300 rounded px-4 py-3 w-full text-black text-base"
                />
                <button className="ml-3 text-gray-500 hover:text-black p-3 rounded transition">
                  <FaKey />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Language
              </label>
              <select className="bg-gray-100 border border-gray-300 rounded px-4 py-3 w-full text-black text-base">
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
              </select>
            </div>
          </div>
        </section>

        {/* Telecaller Management */}
        <section className="border-b border-gray-200 pb-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Telecaller Management</h2>
          <div className="mb-3 text-gray-600 text-base">
            Telecallers Used:{" "}
            <span className="font-bold">
              {telecallers.length} / {TELECALLER_LIMIT}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded mb-6">
            <div
              className="h-3 bg-black rounded"
              style={{
                width: `${(telecallers.length / TELECALLER_LIMIT) * 100}%`,
              }}
            />
          </div>
          <table className="min-w-full text-base">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-3 text-left font-normal">Name</th>
                <th className="py-3 text-left font-normal">Email</th>
                <th className="py-3 text-left font-normal">Phone</th>
                <th className="py-3 text-left font-normal">Status</th>
                <th className="py-3 text-left font-normal">Freeze</th>
              </tr>
            </thead>
            <tbody>
              {telecallers.map((tc, idx) => (
                <tr key={tc.email} className="border-b">
                  <td className="py-3">{tc.name}</td>
                  <td className="py-3">{tc.email}</td>
                  <td className="py-3">{tc.phone}</td>
                  <td className="py-3">{tc.status}</td>
                  <td className="py-3">
                    <button
                      className="text-black text-2xl"
                      onClick={() => handleToggleFreeze(idx)}
                      title={tc.frozen ? "Unfreeze" : "Freeze"}
                    >
                      {tc.frozen ? <FaToggleOff /> : <FaToggleOn />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Usage Sections */}
        <section className="border-b border-gray-200 pb-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Forms Usage</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-base">
              Total Forms Created:{" "}
              <span className="font-bold">{formsCreated}</span>
            </span>
          </div>
        </section>
        <section className="border-b border-gray-200 pb-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Storage Usage</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-base">
              Used: <span className="font-bold">{storageUsed} GB</span> / 10 GB
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded mb-2">
            <div
              className="h-2 bg-black rounded"
              style={{ width: `${(storageUsed / 10) * 100}%` }}
            />
          </div>
        </section>
        <section className="border-b border-gray-200 pb-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Virtual Numbers</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-base">
              Bought: <span className="font-bold">{virtualNumbers}</span> |
              Used: <span className="font-bold">{virtualNumbersUsed}</span>
            </span>
          </div>
          <div className="text-gray-500 mb-2">
            Virtual numbers are shown for usage and management only.
          </div>
        </section>
        <section className="pb-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Privacy Guidelines</h2>
          <ul className="list-disc pl-6 text-gray-700 text-base space-y-2">
            <li>All user data is encrypted and securely stored.</li>
            <li>Telecaller access is restricted by role and permissions.</li>
            <li>
              Forms and virtual numbers are managed according to compliance
              standards.
            </li>
            <li>Contact support for any privacy concerns or data requests.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
