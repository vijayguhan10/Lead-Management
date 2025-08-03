import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faSort,
  faEye,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import sampleData from "./sampleData";
import "./Lead.css";
import LeadDetailsPopup from "./LeadDetailsPopup";

const Lead = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null); // State for selected lead
  const leadsPerPage = 6; // Adjusted to render 6 rows per page

  const leads = sampleData;

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Hide main content when popup is open */}
      {!selectedLead && (
        <>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">My Leads</h1>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} /> Filter
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 flex items-center gap-2">
                <FontAwesomeIcon icon={faSort} /> Sort
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-base rounded-lg overflow-hidden shadow-lg border border-gray-300">
              <thead className="bg-[#ede9fe] sticky top-0 z-10">
                <tr className="text-[#7C3AED]">
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Email</th>
                  <th className="py-3 px-4 text-left font-semibold">Phone</th>
                  <th className="py-3 px-4 text-left font-semibold">Source</th>
                  <th className="py-3 px-4 text-left font-semibold">
                    Priority
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">Status</th>
                  <th className="py-3 px-4 text-left font-semibold">
                    Assigned Telecallers
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">View</th>
                </tr>
              </thead>
              <tbody key={currentPage}>
                {currentLeads.map((lead, idx) => (
                  <tr
                    key={lead.email}
                    className={`transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-[#f6f8fb]"
                    } hover:bg-[#e0e7ff]`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {lead.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{lead.email}</td>
                    <td className="py-3 px-4 text-gray-600">{lead.phone}</td>
                    <td className="py-3 px-4 text-gray-600">{lead.source}</td>
                    <td className="py-3 px-4 text-gray-600">{lead.priority}</td>
                    <td className="py-3 px-4 text-gray-600">{lead.status}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {lead.assignedTelecallers}
                    </td>
                    <td className="py-3 px-4">
                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        onClick={() => setSelectedLead(lead)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Previous
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
              Next <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </>
      )}
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
