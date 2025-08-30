import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaFolderOpen,
} from "react-icons/fa";
import { useApi } from "../../../hooks/useApi";

const LeadsTable = ({ onLeadSelect, selectedLead }) => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [telecallers, setTelecallers] = useState([]);
  const [telecallerFilter, setTelecallerFilter] = useState("all");

  const orgId = localStorage.getItem("organizationId");
  const role = localStorage.getItem("role");
  // Allow user to choose rows per page; default 4. When a lead is selected, force 2 rows.
  const [rowsPerPageChoice, setRowsPerPageChoice] = useState(4);
  // If the user interacts with the dropdown, we won't auto-override their choice.
  const [userChangedRows, setUserChangedRows] = useState(false);
  // leadsPerPage follows the user's choice. We may auto-set rowsPerPageChoice to 2
  // when a lead is selected, but only if the user hasn't manually changed the dropdown.
  const leadsPerPage = rowsPerPageChoice;

  // Reset to first page when a lead is selected and keep currentPage within bounds
  useEffect(() => {
    // If a lead is selected and the user hasn't manually changed rows-per-page,
    // auto-set the rows to 2 for focused view. Do NOT force currentPage to 1 —
    // that causes the table to jump to first page when selecting a lead on another page.
    if (selectedLead && !userChangedRows) {
      setRowsPerPageChoice(2);
    }
  }, [selectedLead]);

  useEffect(() => {
    const total = Math.max(1, Math.ceil(filteredLeads.length / leadsPerPage));
    if (currentPage > total) {
      setCurrentPage(total);
    }
  }, [filteredLeads, leadsPerPage, currentPage]);

  // Fetch leads using the same pattern as Lead.jsx
  const {
    data: leadData,
    loading: leadLoading,
    error: leadError,
  } = useApi(
    "lead",
    role === "admin" ? `/leads/getOrganizationLeads/${orgId}` : null,
    { manual: role !== "admin" }
  );

  const {
    data: telecallersData,
    loading: telecallersLoading,
    error: telecallersError,
  } = useApi(
    "telecaller",
    role === "admin" ? `/telecallers/organization/${orgId}` : null,
    { manual: role !== "admin" }
  );

  useEffect(() => {
    if (telecallersData) {
      setTelecallers(Array.isArray(telecallersData) ? telecallersData : []);
    }
    if (telecallersError) {
      setTelecallers([]);
    }
  }, [telecallersData, telecallersError]);

  useEffect(() => {
    if (leadData) {
      setLeads(leadData);
      // If parent passed selectedLead with only an _id (from query param),
      // find it in the fetched leads and ensure the table paginates to it and selects it.
      if (selectedLead && (selectedLead._id || selectedLead.id)) {
        // determine effective leads-per-page: if we would auto-set rows to 2
        // (when a lead is selected and the user hasn't changed the choice),
        // use 2 for the page calculation to avoid a race.
        const effectivePerPage =
          !userChangedRows && selectedLead ? 2 : rowsPerPageChoice;
        const targetId = String(selectedLead._id || selectedLead.id);
        const idx = leadData.findIndex((l) =>
          [l._id, l.id, l.userId].some((k) => String(k) === targetId)
        );
        if (idx >= 0) {
          const page = Math.floor(idx / effectivePerPage) + 1;
          setCurrentPage(page);
          // ensure parent selection is consistent
          onLeadSelect && onLeadSelect(leadData[idx]);
        }
      }
    }
  }, [leadData, selectedLead, rowsPerPageChoice, userChangedRows]);

  // Filter leads based on search term
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    let filtered = leads.slice();

    if (term) {
      filtered = filtered.filter(
        (lead) =>
          (lead.name || "").toLowerCase().includes(term) ||
          (lead.email || "").toLowerCase().includes(term) ||
          (lead.phone || "").includes(term)
      );
    }

    // Apply telecaller filter (admin-only). Options: 'all', 'unassigned', or telecallerId
    if (role === "admin" && telecallerFilter && telecallerFilter !== "all") {
      if (telecallerFilter === "unassigned") {
        filtered = filtered.filter((l) => !l.assignedTo);
      } else {
        filtered = filtered.filter((l) => {
          const assignedId =
            l.assignedTo?._id || l.assignedTo?.id || l.assignedTo;
          return assignedId && String(assignedId) === String(telecallerFilter);
        });
      }
    }

    setFilteredLeads(filtered);
    // Reset to first page only when user is actively searching or filter changes.
    if (term || telecallerFilter !== "all") setCurrentPage(1);
  }, [leads, searchTerm, telecallerFilter, role]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const currentLeads = filteredLeads.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // compact pagination helper
  const getPaginationPages = (totalPages, currentPage, maxVisible = 6) => {
    if (totalPages <= maxVisible)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    const siblingCount = 1;
    let left = Math.max(currentPage - siblingCount, 2);
    let right = Math.min(currentPage + siblingCount, totalPages - 1);
    if (left > 2) pages.push("...");
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  // refs to table rows so we can scroll a selected lead into view
  const rowRefs = useRef({});

  // when selectedLead prop changes, ensure the row is visible (after render)
  useEffect(() => {
    if (selectedLead && selectedLead._id) {
      const rowEl = rowRefs.current[selectedLead._id];
      if (rowEl && typeof rowEl.scrollIntoView === "function") {
        // center the row in view for clarity
        rowEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedLead, currentPage]);

  if (leadLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(leadsPerPage)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (leadError) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-500">
          <p>Failed to load leads</p>
          <p className="text-sm text-gray-500 mt-1">Please try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Select Lead</h2>
            <p className="text-sm text-gray-500">
              Choose a lead to manage their files
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rows</label>
              <select
                value={rowsPerPageChoice}
                onChange={(e) => {
                  setRowsPerPageChoice(Number(e.target.value));
                  setUserChangedRows(true);
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white shadow-sm"
                title="Rows per page"
              >
                {Array.from({ length: 10 }).map((_, i) => {
                  const v = i + 1;
                  return (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Telecaller filter (admin only) */}
            {role === "admin" && (
              <div className="flex items-center gap-3">
                <label
                  htmlFor="telecaller-filter"
                  className="text-sm text-gray-600"
                >
                  Telecaller
                </label>
                <div className="relative">
                  <select
                    id="telecaller-filter"
                    value={telecallerFilter}
                    onChange={(e) => {
                      setTelecallerFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none pl-3 pr-8 py-1 border border-gray-300 rounded-full text-sm bg-white shadow-sm"
                    title="Filter by telecaller"
                  >
                    <option value="all">All telecallers</option>
                    <option value="unassigned">Unassigned</option>
                    {telecallers.map((t) => (
                      <option key={t._id || t.id} value={t._id || t.id}>
                        {t.name || t.fullName || t.firstName}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                  </div>
                </div>
              </div>
            )}

            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? "No leads found" : "No leads available"}
                </td>
              </tr>
            ) : (
              currentLeads.map((lead) => (
                <tr
                  key={lead._id}
                  ref={(el) => (rowRefs.current[lead._id] = el)}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedLead?._id === lead._id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => onLeadSelect(lead)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {lead.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{lead.email}</div>
                    <div className="text-sm text-gray-500">{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.status === "Qualified"
                          ? "bg-green-100 text-green-800"
                          : lead.status === "Contacted"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString()
                      : "Just now"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Removed FaEye icon as requested */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLeadSelect(lead);
                        }}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Manage Files"
                      >
                        <FaFolderOpen className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * leadsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * leadsPerPage, filteredLeads.length)}
                </span>{" "}
                of <span className="font-medium">{filteredLeads.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px items-center">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArrowLeft className="w-4 h-4" />
                </button>
                {(() => {
                  const pages = getPaginationPages(totalPages, currentPage, 6);
                  return pages.map((p, idx) =>
                    p === "..." ? (
                      <span
                        key={`dots-${idx}`}
                        className="px-3 py-2 text-gray-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => paginate(p)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === p
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  );
                })()}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
