import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createEditor } from "slate";
import {
  FaSearch,
  FaSort,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
  FaDownload,
  FaBell,
  FaColumns,
  FaCommentDots,
  FaFileImport,
} from "react-icons/fa";

import sampleData from "./sampleData";
import LeadDetailsPopup from "./LeadDetailsPopup";
import TelecallerAssignInfo from "./TelecallerAssignInfo";

const COLORS = ["#7C3AED", "#F59E42", "#16A34A", "#4F46E5", "#FFD700"];

const Lead = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showSmartAssign, setShowSmartAssign] = useState(false);
  const [showIndividualAssign, setShowIndividualAssign] = useState(false);
  const [assignLead, setAssignLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showColumns, setShowColumns] = useState({
    name: true,
    email: true,
    phone: true,
    source: true,
    priority: true,
    status: true,
    assignedTelecallers: true,
    view: true,
  });
  const [showNotes, setShowNotes] = useState(false);
  const [globalTab, setGlobalTab] = useState("Monthly");
  const leadsPerPage = 6;

  // Make some leads unassigned for demo
  const leads = sampleData.map((lead, idx) =>
    idx % 3 === 0 ? { ...lead, assignedTelecallers: "" } : lead
  );

  // Analytics
  const totalLeads = leads.length;
  const assignedLeads = leads.filter((l) => l.assignedTelecallers).length;
  const unassignedLeadsCount = totalLeads - assignedLeads;
  const conversionRate = totalLeads
    ? Math.round((assignedLeads / totalLeads) * 100)
    : 0;

  // Filtering
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Only leads not assigned to telecallers
  const unassignedLeads = currentLeads.filter(
    (lead) => !lead.assignedTelecallers || lead.assignedTelecallers === ""
  );

  // Bulk select logic
  const toggleLeadSelect = (email) => {
    setSelectedLeads((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  // Export logic (stub)
  const exportLeads = () => {
    alert("Export to Excel/CSV coming soon!");
  };

  // Bulk assign logic (stub)
  const bulkAssign = () => {
    setShowSmartAssign(true);
  };

  // Timeline/Activity log (stub)
  const showTimeline = (lead) => {
    alert(`Show timeline for ${lead.name}`);
  };

  // Notes/comments (stub)
  const addNote = (lead) => {
    alert(`Add note for ${lead.name}`);
  };

  // Chart Data
  const sourceData = [
    {
      name: "Referral",
      value: leads.filter((l) => l.source === "Referral").length,
    },
    {
      name: "Website",
      value: leads.filter((l) => l.source === "Website").length,
    },
    { name: "Other", value: leads.filter((l) => l.source === "Other").length },
  ];
  const priorityData = [
    { name: "High", value: leads.filter((l) => l.priority === "High").length },
    {
      name: "Medium",
      value: leads.filter((l) => l.priority === "Medium").length,
    },
    { name: "Low", value: leads.filter((l) => l.priority === "Low").length },
  ];
  const statusData = [
    { name: "New", value: leads.filter((l) => l.status === "New").length },
    {
      name: "Contacted",
      value: leads.filter((l) => l.status === "Contacted").length,
    },
    {
      name: "Closed",
      value: leads.filter((l) => l.status === "Closed").length,
    },
  ];

  // Tab logic for analytics (stub, you can connect to backend for real data)
  const getTabLeads = () => {
    // For demo, just return all leads
    return {
      totalLeads,
      assignedLeads,
      unassignedLeadsCount,
      conversionRate,
      sourceData,
      priorityData,
      statusData,
    };
  };
  const tabLeads = getTabLeads();

  // Slate editor state for notes
  const [notesLead, setNotesLead] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  return (
    <div className="p-8 min-h-screen bg-[#f6f8fb] font-luxury">
      {/* Top Cards */}
      <div className="flex gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-[#e0e7ff] w-1/4">
          <span className="text-2xl font-bold text-[#7C3AED]">
            {totalLeads}
          </span>
          <span className="text-xs text-gray-500 mt-2">Total Leads</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-[#e0e7ff] w-1/4">
          <span className="text-2xl font-bold text-[#16A34A]">
            {assignedLeads}
          </span>
          <span className="text-xs text-gray-500 mt-2">Assigned</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-[#e0e7ff] w-1/4">
          <span className="text-2xl font-bold text-[#F59E42]">
            {unassignedLeadsCount}
          </span>
          <span className="text-xs text-gray-500 mt-2">Unassigned</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-[#e0e7ff] w-1/4">
          <span className="text-2xl font-bold text-[#4F46E5]">
            {conversionRate}%
          </span>
          <span className="text-xs text-gray-500 mt-2">Conversion Rate</span>
        </div>
      </div>

      {/* Bulk Actions & Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-[#FFD700] text-[#4F46E5] rounded-lg shadow font-bold hover:bg-[#FDE68A] transition"
            onClick={bulkAssign}
          >
            Bulk Assign
          </button>
          <button
            className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg shadow font-bold hover:bg-[#7C3AED] transition flex items-center gap-2"
            onClick={exportLeads}
          >
            <FaDownload /> Export
          </button>
        </div>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-3 text-gray-400">
            <FaSearch />
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-[#e0e7ff]">
        <table className="min-w-full text-base">
          <thead>
            <tr className="bg-[#f3f4f6] text-[#4F46E5]">
              <th className="py-3 px-4 text-left font-semibold border-b">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === currentLeads.length}
                  onChange={() =>
                    setSelectedLeads(
                      selectedLeads.length === currentLeads.length
                        ? []
                        : currentLeads.map((l) => l.email)
                    )
                  }
                />
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Name
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Email
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Phone
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Source
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Assigned
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Status
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Created
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead, idx) => (
              <tr
                key={lead.email}
                className={`transition ${
                  idx % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"
                } hover:bg-[#eef2f7]`}
              >
                <td className="py-3 px-4 border-b">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.email)}
                    onChange={() => toggleLeadSelect(lead.email)}
                  />
                </td>
                <td className="py-3 px-4 font-medium text-blue-700 border-b hover:underline cursor-pointer">
                  {lead.name}
                </td>
                <td className="py-3 px-4 text-blue-600 border-b hover:underline cursor-pointer">
                  {lead.email}
                </td>
                <td className="py-3 px-4 text-blue-600 border-b">
                  {lead.phone}
                </td>
                <td className="py-3 px-4 text-gray-600 border-b">
                  {lead.source}
                </td>
                <td className="py-3 px-4 text-gray-600 border-b">
                  {lead.assignedTelecallers ? (
                    <span className="px-3 py-1 rounded-full bg-[#4F46E5] text-white font-semibold shadow">
                      {lead.assignedTelecallers}
                    </span>
                  ) : (
                    <button
                      className="px-4 py-2 bg-[#FFD700] text-[#4F46E5] rounded-lg shadow font-semibold hover:bg-[#FDE68A] transition"
                      onClick={() => {
                        setAssignLead(lead);
                        setShowIndividualAssign(true);
                      }}
                    >
                      Assign
                    </button>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-600 border-b">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold shadow ${
                      lead.status === "Qualified"
                        ? "bg-green-100 text-green-700"
                        : lead.status === "Contacted"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 border-b">
                  {lead.created || "Just now"}
                </td>
                <td className="py-3 px-4 border-b flex gap-2">
                  <FaEye
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  />
                  <FaCommentDots
                    className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
                    title="Add/View Notes"
                    onClick={() => setNotesLead(lead)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 flex items-center gap-2"
        >
          <FaArrowLeft /> Previous
        </button>
        <div className="flex gap-2">
          {Array.from(
            { length: Math.ceil(filteredLeads.length / leadsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded-lg shadow ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredLeads.length / leadsPerPage)
          }
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 flex items-center gap-2"
        >
          Next <FaArrowRight />
        </button>
      </div>

      {/* Popups (Smart Assign, Individual Assign, Lead Details) */}
      {/* Smart Assign Popup */}
      {showSmartAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050] bg-opacity-40">
          <div className="p-8 rounded-2xl bg-white shadow-2xl border border-[#FFD700] min-w-[350px] max-w-[90vw] w-full md:w-[600px] relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowSmartAssign(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-[#7C3AED] mb-4 flex items-center gap-2">
              <span className="luxury-icon">💎</span> Smart Assignment
            </h2>
            <div className="text-gray-700 mb-4">
              Assign selected leads to telecallers using smart logic.
            </div>
            <div className="flex justify-end mt-8">
              <button
                className="px-6 py-3 bg-[#FFD700] text-[#4F46E5] rounded-xl shadow-xl font-bold text-lg hover:bg-[#FDE68A] transition"
                onClick={() => setShowSmartAssign(false)}
              >
                Confirm Smart Assign
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Individual Assign Popup */}
      {showIndividualAssign && assignLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050] bg-opacity-40">
          <div className="p-8 rounded-2xl bg-white shadow-2xl border border-[#7C3AED] min-w-[350px] max-w-[90vw] w-full md:w-[600px] relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowIndividualAssign(false)}
            >
              &times;
            </button>
            <TelecallerAssignInfo
              lead={assignLead}
              telecallers={[
                {
                  name: "Priya Sharma",
                  assignedThisMonth: 45,
                  completed: 38,
                  pending: 7,
                  avatar: "/avatars/priya.png",
                  luxuryLevel: "Diamond",
                  rating: 4.9,
                  target: 50,
                },
                {
                  name: "Rahul Verma",
                  assignedThisMonth: 38,
                  completed: 30,
                  pending: 8,
                  avatar: "/avatars/rahul.png",
                  luxuryLevel: "Platinum",
                  rating: 4.7,
                  target: 45,
                },
                // ...more telecallers
              ]}
              onAssign={(telecaller) => {
                setShowIndividualAssign(false);
              }}
            />
          </div>
        </div>
      )}
      {notesLead && (
        <div className="fixed bg-[#00000050] inset-0 z-50 flex items-center justify-center">
          <div className="p-0 rounded-2xl bg-white shadow-2xl border-2 border-[#FFD700] min-w-[350px] max-w-[90vw] w-full md:w-[600px] relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setNotesLead(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center gap-3 px-8 pt-8 pb-2 border-b border-gray-200">
              <FaCommentDots className="text-[#FFD700] text-3xl" />
              <h2 className="text-2xl font-extrabold text-[#4F46E5]">
                Notes for <span className="text-black">{notesLead.name}</span>
              </h2>
            </div>
            <div className="mb-4 px-8 pt-4">
              <ReactQuill
                value={noteValue}
                onChange={setNoteValue}
                placeholder="Type your note here. You can format text, add lists, and links."
                theme="snow"
                className="bg-white rounded-xl border border-gray-300 shadow focus:ring-2 focus:ring-[#FFD700] min-h-[180px] text-base"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontSize: "1.05rem",
                  borderRadius: "16px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                  marginBottom: "0.5rem",
                }}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
              />
            </div>
            <div className="flex justify-end px-8 pb-8">
              <button
                className="px-7 py-3 bg-gradient-to-r from-[#FFD700] to-[#FDE68A] text-[#4F46E5] rounded-full shadow-xl font-bold text-lg hover:scale-105 transition"
                onClick={() => {
                  // Save note logic here
                  setNotesLead(null);
                  setNoteValue("");
                }}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Details Popup */}
      {selectedLead && (
        <LeadDetailsPopup
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
};

export default Lead;
