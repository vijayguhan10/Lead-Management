import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaDownload,
  FaFileImport,
  FaEye,
  FaCommentDots,
  FaEdit,
} from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import { toast } from "react-toastify";
import AddLead from "./AddLead";
import LeadDetailsPopup from "./LeadDetailsPopup";
import TelecallerAssignInfo from "./TelecallerAssignInfo";
import SmartAssign from "./SmartAssign";
import EditLead from "./EditLead";

const Lead = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showIndividualAssign, setShowIndividualAssign] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showTelecallerAssign, setShowTelecallerAssign] = useState(false);
  const [telecallerLead, setTelecallerLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [telecallers, setTelecallers] = useState([]);
  const [showSmartAssign, setShowSmartAssign] = useState(false);
  const [loading, setLoading] = useState(false); // keep a local fallback for UX where needed

  const orgId =
    localStorage.getItem("organizationId") ||
    localStorage.getItem("orgId") ||
    "";

  const {
    data: leadsData,
    loading: leadsLoading,
    error: leadsError,
    refetch: refetchLeads,
  } = useApi("lead", `/leads/getOrganizationLeads/${orgId}`);

  const telecallerEndpoint = `/telecallers/organization/${orgId}`;

  const {
    data: telecallersData,
    loading: telecallersLoading,
    error: telecallersError,
    refetch: refetchTelecallers,
  } = useApi("telecaller", telecallerEndpoint);

  const leadsPerPage = 6;

  // Sync hook data into component state and handle errors
  useEffect(() => {
    if (leadsData) {
      setLeads(leadsData || []);
    }
    if (leadsError) {
      setLeads([]);
      toast.error(leadsError.message || "Failed to load leads.");
    }
  }, [leadsData, leadsError]);

  useEffect(() => {
    if (telecallersData) {
      setTelecallers(Array.isArray(telecallersData) ? telecallersData : []);
    }
    if (telecallersError) {
      setTelecallers([]);
      toast.error(telecallersError.message || "Failed to load telecallers.");
    }
  }, [telecallersData, telecallersError]);

  useEffect(() => {
    setLoading(leadsLoading);
  }, [leadsLoading]);

  // Dashboard metrics
  const totalLeads = leads.length;
  const assignedLeads = leads.filter((l) => l.assignedTo).length;
  const unassignedLeadsCount = totalLeads - assignedLeads;
  const conversionRate = totalLeads
    ? Math.round((assignedLeads / totalLeads) * 100)
    : 0;

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleLeadSelect = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const exportLeads = () => {
    alert("Export to Excel/CSV coming soon!");
  };

  const bulkAssign = () => {
    setShowSmartAssign(true);
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Selected file: ${file.name}`);
    }
  };

  return (
    <div className="p-8 min-h-screen font-sans">
      {/* Top Cards */}
      <div className="flex gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-[#F7E9A0] w-1/4">
          <span className="text-2xl font-bold text-[#222]">{totalLeads}</span>
          <span className="text-xs text-[#222] mt-2">Total Leads</span>
        </div>
        <div className="bg-[#E6F9E5] rounded-xl shadow p-6 flex flex-col items-center border border-[#B7EFC5] w-1/4">
          <span className="text-2xl font-bold text-[#16A34A]">
            {assignedLeads}
          </span>
          <span className="text-xs text-[#222] mt-2">Assigned</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-[#F7E9A0] w-1/4">
          <span className="text-2xl font-bold text-[#FFD700]">
            {unassignedLeadsCount}
          </span>
          <span className="text-xs text-[#222] mt-2">Unassigned</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-[#F7E9A0] w-1/4">
          <span className="text-2xl font-bold text-[#222]">
            {conversionRate}%
          </span>
          <span className="text-xs text-[#222] mt-2">Conversion Rate</span>
        </div>
      </div>

      {/* Bulk Actions & Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-[#FFD700] text-[#222] rounded-lg shadow font-bold hover:bg-[#FFFDEB] transition"
            onClick={bulkAssign}
          >
            Smart Assign
          </button>
          <button
            className="px-4 py-2 bg-[#222] text-[#FFD700] rounded-lg shadow font-bold hover:bg-[#444] transition flex items-center gap-2"
            onClick={exportLeads}
          >
            <FaDownload /> Export
          </button>
          <label className="px-4 py-2 bg-[#E6F9E5] text-[#222] rounded-lg shadow font-bold hover:bg-[#B7EFC5] transition flex items-center gap-2 cursor-pointer">
            <FaFileImport /> Import
            <input
              type="file"
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              onChange={handleImportExcel}
            />
          </label>
          <button
            className="px-4 py-2 bg-[#FFD700] text-[#222] rounded-lg shadow font-bold hover:bg-[#FFFDEB] transition"
            onClick={() => setShowIndividualAssign(true)}
          >
            Add Individual
          </button>
        </div>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-[#FFD700] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] bg-[#FFFDEB] text-[#222]"
          />
          <span className="absolute left-3 top-3 text-[#FFD700]">
            <FaSearch />
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl text-black shadow-xl border border-[#F7E9A0]">
        <table className="min-w-full text-base">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left font-semibold border-b">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === currentLeads.length}
                  onChange={() =>
                    setSelectedLeads(
                      selectedLeads.length === currentLeads.length
                        ? []
                        : currentLeads.map((l) => l._id)
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
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  Loading leads...
                </td>
              </tr>
            ) : currentLeads.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  No leads found.
                </td>
              </tr>
            ) : (
              currentLeads.map((lead) => (
                <tr key={lead._id} className="transition hover:bg-[#E6F9E5]">
                  <td className="py-3 px-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => toggleLeadSelect(lead._id)}
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-blue-700 border-b hover:underline cursor-pointer">
                    {lead.name}
                  </td>
                  <td className="py-3 px-4 text-black border-b hover:underline cursor-pointer">
                    {lead.email}
                  </td>
                  <td className="py-3 px-4 text-black border-b">
                    {lead.phone}
                  </td>
                  <td className="py-3 px-4 text-gray-600 border-b">
                    {lead.source}
                  </td>
                  <td className="py-3 px-4 text-[#222] border-b">
                    {lead.assignedTo ? (
                      (() => {
                        const assignedId = lead.assignedTo;
                        const tc = telecallers.find((t) =>
                          [t.id, t._id, t.userId, t.user?.id, t.user?._id].some(
                            (k) => String(k) === String(assignedId)
                          )
                        );

                        const name = tc
                          ? tc.name || tc.fullName || tc.firstName
                          : "Assigned";
                        return (
                          <span className="px-3 py-1 rounded-full bg-[#E6F9E5] text-[#16A34A] font-semibold shadow">
                            {name}
                          </span>
                        );
                      })()
                    ) : (
                      <button
                        className="px-4 py-2 bg-[#FFD700] text-[#222] rounded-lg shadow font-semibold hover:bg-[#FFFDEB] transition"
                        onClick={() => {
                          setTelecallerLead(lead);
                          setShowTelecallerAssign(true);
                        }}
                      >
                        Assign
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#222] border-b">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold shadow ${
                        lead.status === "Qualified"
                          ? "bg-[#E6F9E5] text-[#16A34A]"
                          : lead.status === "Contacted"
                          ? "bg-[#FFFDEB] text-[#FFD700]"
                          : "bg-gray-100 text-[#222]"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 border-b">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString()
                      : "Just now"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex gap-2 items-center">
                      <FaEye
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        onClick={() => setSelectedLead(lead)}
                      />
                      <FaEdit
                        className="text-green-500 hover:text-green-700 cursor-pointer"
                        title="Edit Lead"
                        onClick={() => setEditLead(lead)}
                      />
                      <FaCommentDots
                        className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
                        title="Add/View Notes"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#FFD700] text-[#222] rounded-lg shadow hover:bg-[#FFFDEB] disabled:opacity-50 flex items-center gap-2"
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
                    ? "bg-[#222] text-[#FFD700]"
                    : "bg-[#FFFDEB] text-[#222] hover:bg-[#FFD700]"
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
          className="px-4 py-2 bg-[#FFD700] text-[#222] rounded-lg shadow hover:bg-[#FFFDEB] disabled:opacity-50 flex items-center gap-2"
        >
          Next <FaArrowRight />
        </button>
      </div>

      {/* Popups */}
      {showIndividualAssign && (
        <AddLead
          open={showIndividualAssign}
          onClose={() => setShowIndividualAssign(false)}
          onSubmit={(createdLead) => {
            setLeads((prev) => [...(prev || []), createdLead]);
            setShowIndividualAssign(false);
          }}
        />
      )}
      {selectedLead && (
        <LeadDetailsPopup
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
      {showTelecallerAssign && telecallerLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]">
          <TelecallerAssignInfo
            lead={telecallerLead}
            telecallers={telecallers}
            setTelecallers={setTelecallers}
            loading={telecallersLoading}
            refetchTelecallers={refetchTelecallers}
            onAssign={async (res) => {
              try {
                if (typeof refetchLeads === "function") await refetchLeads();
              } catch (err) {
                console.error("Failed to refetch leads:", err);
              }
              setShowTelecallerAssign(false);
              setTelecallerLead(null);
            }}
            onClose={() => {
              setShowTelecallerAssign(false);
              setTelecallerLead(null);
            }}
          />
        </div>
      )}
      {showSmartAssign && (
        <SmartAssign
          open={showSmartAssign}
          onClose={() => setShowSmartAssign(false)}
          leads={leads.filter((l) => !l.assignedTo)}
          allLeads={leads}
          telecallers={telecallers}
          orgId={orgId}
          onSuccess={async (res) => {
            try {
              // ensure parent data is refreshed BEFORE closing so UI immediately reflects assignment
              if (typeof refetchLeads === "function") await refetchLeads();
              if (typeof refetchTelecallers === "function")
                await refetchTelecallers();
              // show a toast only after successful assignment and refetch
              toast.success("Smart assign completed.");
            } catch (err) {
              console.error("Failed to refetch leads after smart assign:", err);
            }
            // keep modal open to let user inspect results; they can close manually
          }}
        />
      )}
      {editLead && (
        <EditLead
          leadId={editLead._id || editLead.id}
          telecallers={telecallers}
          onClose={() => setEditLead(null)}
          onSubmit={() => {
            setEditLead(null);
            try {
              if (typeof refetchLeads === "function") refetchLeads();
            } catch (err) {
              console.error("Failed to refetch leads after edit:", err);
            }
          }}
        />
      )}
    </div>
  );
};

export default Lead;
