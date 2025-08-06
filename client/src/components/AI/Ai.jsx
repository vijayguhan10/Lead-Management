import React, { useState } from "react";
import {
  FaPaperclip,
  FaRobot,
  FaArrowRight,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const samplePrompts = [
  "Consolidate financial data from all subsidiaries",
  "Generate the monthly income statement",
  "Reconcile the bank accounts for March",
  "Book a journal entry",
  "Provide a 12-month cash flow forecast",
  "Generate the quarterly profit and loss statement",
  "Show the budget variance for Q1 compared to actuals",
  "Create a real-time financial performance dashboard",
];

const sampleLeads = [
  {
    name: "Priya Sharma",
    email: "priya@company.com",
    phone: "9876543210",
    status: "Qualified",
  },
  {
    name: "Rahul Verma",
    email: "rahul@company.com",
    phone: "9123456780",
    status: "Contacted",
  },
  {
    name: "Amit Patel",
    email: "amit@company.com",
    phone: "9988776655",
    status: "Pending",
  },
  {
    name: "Sara Lee",
    email: "sara@company.com",
    phone: "9001122334",
    status: "Converted",
  },
];

const Ai = () => {
  const [leadPopup, setLeadPopup] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#f7f8fa] flex flex-col items-center justify-center px-0 py-0">
      <div className="w-full max-w-4xl mx-auto py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Hi, Gustavo
        </h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          What can I help you with?
        </h2>
        <p className="text-gray-500 mb-8 text-lg">
          Choose a prompt below or write your own to start chatting with Lumina.
        </p>
        <div className="bg-white rounded-xl shadow border border-gray-200 p-8 mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Ask a question or make a request..."
            />
            <button
              className="text-gray-500 hover:text-gray-700 p-3 rounded transition"
              title="Send"
            >
              <FaArrowRight size={22} />
            </button>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-5 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition border border-gray-200"
              onClick={() => setLeadPopup(true)}
            >
              <FaPaperclip /> Import Leads
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition border border-gray-200">
              <FaRobot /> AI Actions
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 px-6 py-5 bg-white rounded-lg shadow border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition text-left"
            >
              <FaRobot className="text-gray-400" />
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Lead Data Popup */}
      {leadPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-3xl mx-4 py-12 px-10 relative flex flex-col justify-center">
            <button
              className="absolute top-8 right-10 text-gray-500 hover:text-gray-700 text-3xl font-bold"
              onClick={() => setLeadPopup(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-10 flex items-center gap-3 justify-center">
              <FaPaperclip className="text-gray-400" /> Imported Lead Data
            </h2>
            <div className="h-64 overflow-y-auto mb-8 w-full">
              <table className="min-w-full text-base rounded-xl overflow-hidden shadow border border-gray-100">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="py-4 px-4 text-left font-semibold">Name</th>
                    <th className="py-4 px-4 text-left font-semibold">Email</th>
                    <th className="py-4 px-4 text-left font-semibold">Phone</th>
                    <th className="py-4 px-4 text-left font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sampleLeads.map((lead, idx) => (
                    <tr
                      key={idx}
                      className="transition bg-white hover:bg-gray-50 border-b border-gray-200"
                    >
                      <td className="py-5 px-4 font-bold text-gray-900 flex items-center gap-2 text-lg">
                        <FaUser className="text-gray-400" /> {lead.name}
                      </td>
                      <td className="py-5 px-4 text-gray-700 flex items-center gap-2 text-base">
                        <FaEnvelope className="text-gray-400" /> {lead.email}
                      </td>
                      <td className="py-5 px-4 text-gray-700 flex items-center gap-2 text-base">
                        <FaPhone className="text-gray-400" /> {lead.phone}
                      </td>
                      <td className="py-5 px-4">
                        {lead.status === "Qualified" && (
                          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-900 font-bold flex items-center gap-2 border border-gray-200 text-base">
                            <FaCheckCircle className="text-gray-400" /> Qualified
                          </span>
                        )}
                        {lead.status === "Converted" && (
                          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-900 font-bold flex items-center gap-2 border border-gray-200 text-base">
                            <FaCheckCircle className="text-gray-400" /> Converted
                          </span>
                        )}
                        {lead.status === "Contacted" && (
                          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-900 font-bold flex items-center gap-2 border border-gray-200 text-base">
                            <FaCheckCircle className="text-gray-400" /> Contacted
                          </span>
                        )}
                        {lead.status === "Pending" && (
                          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-900 font-bold flex items-center gap-2 border border-gray-200 text-base">
                            <FaTimesCircle className="text-gray-400" /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-12">
              <button
                className="px-8 py-3 bg-gray-900 text-white rounded-full shadow font-bold text-lg hover:bg-gray-700 transition"
                onClick={() => setLeadPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ai;
