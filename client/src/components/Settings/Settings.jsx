import React, { useState } from "react";
import {
  FaUserEdit,
  FaKey,
  FaToggleOn,
  FaToggleOff,
  FaSearch,
  FaEnvelope,
  FaQuestionCircle,
  FaBug,
  FaDownload,
  FaTrashAlt,
  FaCreditCard,
  FaCalendarAlt,
  FaLink,
  FaUserPlus,
  FaCamera,
} from "react-icons/fa";

// Dummy data
const TELECALLER_LIMIT = 5;
const telecallersData = [
  {
    name: "A. Singh",
    email: "a.singh@example.com",
    phone: "+91-9876543210",
    status: "Active",
    frozen: false,
    role: "Telecaller",
  },
  {
    name: "K. Joseph",
    email: "k.joseph@example.com",
    phone: "+91-9842123456",
    status: "Active",
    frozen: false,
    role: "Supervisor",
  },
  {
    name: "R. Nair",
    email: "r.nair@example.com",
    phone: "+91-9866123456",
    status: "Active",
    frozen: false,
    role: "Telecaller",
  },
];

const integrations = [
  { name: "Google", connected: true },
  { name: "Slack", connected: false },
  { name: "Zoom", connected: true },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "Up to 3 Participants",
      "Teams 5",
      "Boards 5",
      "Chat/Video 5",
      "Sketches",
      "Video Call Times 40 Min",
    ],
    button: "Try For Free",
  },
  {
    name: "Starter",
    price: "$5",
    features: [
      "Up to 10 Participants",
      "Teams Unlimited",
      "Boards Unlimited",
      "Chat/Video Unlimited",
      "Sketch Unlimited",
      "Video Call Times Unlimited",
    ],
    button: "Go Starter",
  },
  {
    name: "Pro",
    price: "$12",
    features: ["All The Benefits Of Starter Plus", "Up to 100 Participants"],
    button: "Go Professional",
  },
  {
    name: "Business",
    price: "$19",
    features: ["All The Benefits Of Pro Plus", "300+ Participants"],
    button: "Go Business",
  },
];

export default function Settings() {
  const [telecallers, setTelecallers] = useState(telecallersData);
  const [search, setSearch] = useState("");
  const [formsCreated] = useState(8);
  const [storageUsed] = useState(2.4); // GB
  const [virtualNumbers] = useState(3);
  const [virtualNumbersUsed] = useState(2);
  const [user] = useState({
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Project Manager",
    username: "arjun.mehta",
    birthday: "Jan 1, 1990",
    phone: "+91-9876543210",
    language: "English",
    lastLogin: "Aug 4, 2025 09:12 AM",
    created: "Jan 1, 2022",
  });

  // Security
  const recentLogins = [
    { device: "Chrome on Windows", time: "Aug 4, 2025 09:12 AM" },
    { device: "Safari on iPhone", time: "Aug 3, 2025 21:45 PM" },
  ];
  const devices = [
    { name: "Windows Laptop", lastActive: "Aug 4, 2025" },
    { name: "iPhone 13", lastActive: "Aug 3, 2025" },
  ];

  // Plan
  const currentPlan = plans[2]; // Pro
  const nextBilling = "2025-12-31";
  const paymentMethod = "**** **** **** 1234";

  // Telecaller search/filter
  const filteredTelecallers = telecallers.filter(
    (tc) =>
      tc.name.toLowerCase().includes(search.toLowerCase()) ||
      tc.email.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle freeze/unfreeze telecaller
  const handleToggleFreeze = (idx) => {
    setTelecallers((telecallers) =>
      telecallers.map((tc, i) =>
        i === idx ? { ...tc, frozen: !tc.frozen } : tc
      )
    );
  };

  // Invite telecaller (dummy)
  const handleInviteTelecaller = () => {
    alert("Invite Telecaller modal goes here.");
  };

  return (
    <div className="w-full min-h-screen bg-white text-black px-0 py-10">
      <div className="max-w-screen-xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-3">Settings</h1>
        <p className="mb-10 text-gray-600 text-lg">
          Manage your profile, account, telecallers, plan, integrations, and
          security settings.
        </p>

        {/* Profile Section */}
        <section className="border-b border-gray-200 pb-10 mb-10">
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            {/* Avatar with initial */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-orange-500 text-white text-4xl font-bold shadow-lg">
              {user.name[0].toLowerCase()}
            </div>
            {/* Name */}
            <div className="text-3xl font-bold text-black">
              {user.name.toLowerCase()}
            </div>
            {/* Buttons */}
            <div className="flex gap-4 mt-2">
              <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 rounded-full shadow text-black font-medium hover:bg-gray-50">
                <FaUserEdit className="text-base" /> Edit Profile
              </button>
              <button className="px-6 py-2 bg-gray-900 text-white rounded-full shadow font-semibold hover:bg-black">
                Upgrade to Pro
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-full shadow text-black font-medium hover:bg-gray-50">
                &#8230;
              </button>
            </div>
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
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Company
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value="Lead Management Inc."
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
                Location
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value="Chennai, India"
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
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Two-Factor Authentication
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="accent-black scale-125 mr-2"
                />
                <span className="text-gray-700">Enable</span>
              </div>
            </div>
            <div>
              <button className="mt-6 px-4 py-2 bg-gray-900 text-white rounded hover:bg-black">
                Logout from all devices
              </button>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="border-b border-gray-200 pb-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="mb-4">
            <div className="font-medium mb-2">Recent Login Activity</div>
            <ul className="text-gray-700 text-base space-y-1">
              {recentLogins.map((login, i) => (
                <li key={i}>
                  {login.device} — {login.time}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <div className="font-medium mb-2">Devices</div>
            <ul className="text-gray-700 text-base space-y-1">
              {devices.map((d, i) => (
                <li key={i}>
                  {d.name}{" "}
                  <span className="text-gray-400">({d.lastActive})</span>
                </li>
              ))}
            </ul>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-black">
            <FaDownload /> Download my data
          </button>
        </section>

        {/* Telecaller Management */}
        <section className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Telecaller Management</h2>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-black"
              onClick={handleInviteTelecaller}
            >
              <FaUserPlus /> Invite Telecaller
            </button>
          </div>
          <div className="mb-3 text-gray-600 text-base">
            Telecallers Used:{" "}
            <span className="font-bold">
              {telecallers.length} / {TELECALLER_LIMIT}
            </span>
          </div>
          <div className="flex items-center mb-4">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search telecallers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded px-3 py-2 w-64 text-black"
            />
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
                <th className="py-3 text-left font-normal">Role</th>
                <th className="py-3 text-left font-normal">Freeze</th>
              </tr>
            </thead>
            <tbody>
              {filteredTelecallers.map((tc, idx) => (
                <tr key={tc.email} className="border-b">
                  <td className="py-3">{tc.name}</td>
                  <td className="py-3">{tc.email}</td>
                  <td className="py-3">{tc.phone}</td>
                  <td className="py-3">{tc.status}</td>
                  <td className="py-3">{tc.role}</td>
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

        {/* Usage & Plan */}
        <section className="border-b border-gray-200 pb-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Plan</h2>
          <div className="flex flex-wrap gap-6 mb-6">
            {plans.map((plan, idx) => (
              <div
                key={plan.name}
                className={`flex-1 min-w-[220px] bg-gray-100 rounded-lg p-6 text-center border border-gray-200 ${
                  currentPlan.name === plan.name ? "border-black" : ""
                }`}
              >
                <div className="mb-2 font-bold text-lg">{plan.name}</div>
                <div className="mb-2 text-2xl font-bold">
                  {plan.price}
                  <span className="text-base font-normal">/mo.</span>
                </div>
                <ul className="mb-4 text-gray-700 text-sm space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded font-semibold ${
                    currentPlan.name === plan.name
                      ? "bg-black text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                >
                  {plan.button}
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Current Plan
              </label>
              <div className="bg-gray-100 border border-gray-300 rounded px-4 py-3 text-black">
                {currentPlan.name}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Next Billing Date
              </label>
              <div className="bg-gray-100 border border-gray-300 rounded px-4 py-3 text-black flex items-center gap-2">
                <FaCalendarAlt /> {nextBilling}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Payment Method
              </label>
              <div className="bg-gray-100 border border-gray-300 rounded px-4 py-3 text-black flex items-center gap-2">
                <FaCreditCard /> {paymentMethod}
              </div>
            </div>
          </div>
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

        {/* Support & Help */}
        <section className="border-b border-gray-200 pb-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Support & Help</h2>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-black">
              <FaEnvelope /> Contact Support
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-black rounded hover:bg-gray-200">
              <FaQuestionCircle /> FAQ
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-black rounded hover:bg-gray-200">
              <FaBug /> Report a Bug
            </button>
          </div>
        </section>

        {/* Legal & Privacy */}
        <section className="pb-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Legal & Privacy</h2>
          <div className="flex gap-6 mb-4">
            <a href="#" className="text-gray-700 underline hover:text-black">
              Terms of Service
            </a>
            <a href="#" className="text-gray-700 underline hover:text-black">
              Privacy Policy
            </a>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
            <FaTrashAlt /> Delete Account
          </button>
        </section>
      </div>
    </div>
  );
}
