import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaDownload,
  FaFileImport,
  FaEdit,
  FaFolderOpen,
} from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import { toast } from "react-toastify";
import AddLead from "./AddLead";
import LeadDetailsPopup from "./LeadDetailsPopup";
import TelecallerAssignInfo from "./TelecallerAssignInfo";
import SmartAssign from "./SmartAssign";
import EditLead from "./EditLead";

const Lead = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId =
    localStorage.getItem("userId") ||
    JSON.parse(localStorage.getItem("user"))?.userId;

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
  const [telecallerFilter, setTelecallerFilter] = useState("all");
  const [showSmartAssign, setShowSmartAssign] = useState(false);
  const [loading, setLoading] = useState(false); // keep a local fallback for UX where needed
  const [rowsPerPageChoice, setRowsPerPageChoice] = useState(6);
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = React.useRef(null);

  // Advanced filtering states
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Available filter options
  const statusOptions = [
    "New",
    "Contacted",
    "Qualified",
    "Converted",
    "Dropped",
  ];

  // Get unique sources from actual leads data
  const sourceOptions = React.useMemo(() => {
    const uniqueSources = [
      ...new Set(leads.map((lead) => lead.source).filter(Boolean)),
    ];
    return uniqueSources.sort();
  }, [leads]);

  const orgId =
    localStorage.getItem("organizationId") ||
    localStorage.getItem("orgId") ||
    "";

  // Only fetch organization leads and telecallers list for admin role
  const {
    data: leadsData,
    loading: leadsLoading,
    error: leadsError,
    refetch: refetchLeads,
  } = useApi(
    "lead",
    role === "admin" ? `/leads/getOrganizationLeads/${orgId}` : null,
    { manual: role !== "admin" }
  );

  // Telecaller: fetch assigned lead IDs, then fetch details
  const {
    data: telecallerLeadIds,
    loading: telecallerLeadsLoading,
    error: telecallerLeadsError,
    refetch: refetchTelecallerLeads,
  } = useApi(
    "telecaller",
    role === "telecaller" && userId ? `/telecallers/${userId}/leads` : null,
    { manual: role !== "telecaller" }
  );

  // Telecallers list (for assignment display, only for admin)
  const telecallerEndpoint = `/telecallers/organization/${orgId}`;
  const {
    data: telecallersData,
    loading: telecallersLoading,
    error: telecallersError,
    refetch: refetchTelecallers,
  } = useApi("telecaller", role === "admin" ? telecallerEndpoint : null, {
    manual: role !== "admin",
  });

  const leadsPerPage = rowsPerPageChoice;

  // Sync hook data into component state and handle errors
  useEffect(() => {
    if (role === "telecaller") {
      // For telecaller, fetch lead details for assigned IDs
      if (Array.isArray(telecallerLeadIds) && telecallerLeadIds.length > 0) {
        setLoading(true);
        Promise.all(
          telecallerLeadIds.map((id) =>
            fetch(`${import.meta.env.VITE_LEAD_SERVICE_URL}/leads/${id}`, {
              headers: {
                "Content-Type": "application/json",
                ...(localStorage.getItem("jwt_token") && {
                  Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
                }),
              },
            })
              .then((res) => res.json())
              .catch(() => null)
          )
        ).then((details) => {
          setLeads(details.filter(Boolean));
          setLoading(false);
        });
      } else {
        setLeads([]);
        setLoading(false);
      }
      if (telecallerLeadsError) {
        toast.error(
          telecallerLeadsError.message || "Failed to load telecaller leads."
        );
      }
    } else {
      if (leadsData) {
        setLeads(leadsData || []);
      }
      if (leadsError) {
        setLeads([]);
        toast.error(leadsError.message || "Failed to load leads.");
      }
      setLoading(leadsLoading);
    }
  }, [
    leadsData,
    leadsError,
    telecallerLeadIds,
    telecallerLeadsError,
    role,
    leadsLoading,
  ]);

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

  const filteredLeads = leads.filter((lead) => {
    // basic search match
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // status filter
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    // source filter
    const matchesSource =
      sourceFilter === "all" || lead.source === sourceFilter;

    // telecaller filter: 'all', 'unassigned', or telecaller id
    let matchesTelecaller = true;
    if (telecallerFilter !== "all") {
      if (telecallerFilter === "unassigned") {
        matchesTelecaller = !lead.assignedTo;
      } else {
        // specific telecaller id
        matchesTelecaller =
          String(lead.assignedTo) === String(telecallerFilter) ||
          String(lead.assignedTo?._id) === String(telecallerFilter);
      }
    }

    return matchesSearch && matchesStatus && matchesSource && matchesTelecaller;
  });

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate pagination items with ellipses when pages exceed maxVisible
  const getPaginationPages = (totalPages, currentPage, maxVisible = 6) => {
    if (totalPages <= maxVisible)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = [];
    pages.push(1);

    const siblingCount = 1; // pages to show on each side of current
    let left = Math.max(currentPage - siblingCount, 2);
    let right = Math.min(currentPage + siblingCount, totalPages - 1);

    if (left > 2) {
      pages.push("...");
    } else {
      for (let i = 2; i < left; i++) pages.push(i);
    }

    for (let p = left; p <= right; p++) pages.push(p);

    if (right < totalPages - 1) {
      pages.push("...");
    } else {
      for (let i = right + 1; i < totalPages; i++) pages.push(i);
    }

    pages.push(totalPages);
    return pages;
  };

  const toggleLeadSelect = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const exportLeads = () => {
    // Export the currently filtered leads (all matches, not just the current page)
    if (!filteredLeads || filteredLeads.length === 0) {
      toast.info("No leads to export (nothing matches current filters)");
      return;
    }

    const rows = filteredLeads.map((l) => ({
      id: l._id || l.id,
      name: l.name || "",
      phone: l.phone || "",
      email: l.email || "",
      source: l.source || "",
      assignedTo: (() => {
        try {
          if (!l.assignedTo) return "";
          const assignedId = l.assignedTo;
          const tc = telecallers.find((t) =>
            [t.id, t._id, t.userId, t.user?.id, t.user?._id].some(
              (k) => String(k) === String(assignedId)
            )
          );
          return tc
            ? tc.name || tc.fullName || tc.firstName
            : String(assignedId);
        } catch (e) {
          return String(l.assignedTo || "");
        }
      })(),
      status: l.status || "",
      priority: l.priority || "",
      createdAt: l.createdAt ? new Date(l.createdAt).toLocaleString() : "",
      tags: Array.isArray(l.tags) ? l.tags.join("; ") : l.tags || "",
      notes: l.notes ? String(l.notes).replace(/\r?\n/g, " ") : "",
    }));

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return "";
      const s = String(val);
      if (s.includes(",") || s.includes("\n") || s.includes('"')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };

    const headers = [
      "ID",
      "Name",
      "Phone",
      "Email",
      "Source",
      "Assigned To",
      "Status",
      "Priority",
      "Created At",
      "Tags",
      "Notes",
    ];

    const csvLines = [headers.join(",")];
    for (const r of rows) {
      const line = [
        escapeCsv(r.id),
        escapeCsv(r.name),
        escapeCsv(r.phone),
        escapeCsv(r.email),
        escapeCsv(r.source),
        escapeCsv(r.assignedTo),
        escapeCsv(r.status),
        escapeCsv(r.priority),
        escapeCsv(r.createdAt),
        escapeCsv(r.tags),
        escapeCsv(r.notes),
      ].join(",");
      csvLines.push(line);
    }

    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `leads_export_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(downloadUrl);
    toast.success("Export ready: downloading filtered leads");
  };

  const bulkAssign = () => {
    setShowSmartAssign(true);
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target.result; // data:application/...;base64,XXXX
      const base64 = dataUrl.split(",")[1];
      try {
        const token = localStorage.getItem("jwt_token");
        const orgId =
          localStorage.getItem("organizationId") ||
          localStorage.getItem("orgId") ||
          "";
        const res = await fetch(
          `${import.meta.env.VITE_LEAD_SERVICE_URL}/leads/import`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              fileBase64: base64,
              organizationId: orgId,
              createdBy: localStorage.getItem("userId") || undefined,
            }),
          }
        );
        const json = await res.json();
        if (res.ok) {
          toast.success(
            `Import completed: created ${json.created}, updated ${json.updated}`
          );
          setShowImportModal(false);
          refetchLeads();
        } else {
          toast.error(json.error || "Import failed");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Import failed");
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadImportSample = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const url = `${
        import.meta.env.VITE_LEAD_SERVICE_URL
      }/leads/import/sample`;
      const res = await fetch(url, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error("Failed to fetch sample");
      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "leads_import_sample.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
      toast.success("Sample downloaded");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to download sample");
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter("all");
    setSourceFilter("all");
    setTelecallerFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Get count of active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (sourceFilter !== "all") count++;
    if (telecallerFilter !== "all") count++;
    if (searchTerm.trim()) count++;
    return count;
  };

  return (
    <div className="p-8 min-h-screen font-sans">
      {/* Top Cards: Only show for non-telecaller roles */}
      {role !== "telecaller" && (
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
      )}
      {/* Heading for telecaller role */}
      {role === "telecaller" && (
        <div className="mb-2 mt-0 flex flex-col items-center">
          <h2 className="text-4xl font-extrabold text-[#222] tracking-tight mb-2">
            Leads
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#FFD700] via-[#E6F9E5] to-[#FFD700] rounded-full mb-2"></div>
        </div>
      )}

      {/* Bulk Actions & Search */}
      <div className="space-y-4 mb-6">
        {/* Top Row: Actions and Search */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <>
              {role !== "telecaller" && (
                <>
                  <button
                    className="px-4 py-2 bg-[#FFD700] text-[#222] rounded-lg shadow font-bold hover:bg-[#FFFDEB] transition"
                    onClick={bulkAssign}
                  >
                    Smart Assign
                  </button>
                  <button
                    className="px-4 py-2 bg-[#E6F9E5] text-[#222] rounded-lg shadow font-bold hover:bg-[#B7EFC5] transition flex items-center gap-2"
                    onClick={() => setShowImportModal(true)}
                  >
                    <FaFileImport /> Import
                  </button>
                  <button
                    className="px-4 py-2 bg-[#FFD700] text-[#222] rounded-lg shadow font-bold hover:bg-[#FFFDEB] transition"
                    onClick={() => setShowIndividualAssign(true)}
                  >
                    Add Individual
                  </button>
                </>
              )}

              {/* Export is available to all roles (exports currently filtered leads client-side) */}
              <button
                className="px-4 py-2 bg-[#222] text-[#FFD700] rounded-lg shadow font-bold hover:bg-[#444] transition flex items-center gap-2"
                onClick={exportLeads}
              >
                <FaDownload /> Export
              </button>
            </>
          </div>

          <div className="flex items-center gap-4">
            {/* Filters Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 font-medium ${
                showFilters
                  ? "bg-[#FFD700] border-[#FFD700] text-[#222]"
                  : "bg-white border-gray-300 text-gray-700 hover:border-[#FFD700]"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                />
              </svg>
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>

            {/* Search */}
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
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Advanced Filters
              </h3>
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700]"
                  >
                    <option value="all">All Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Source Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Source
                </label>
                <div className="relative">
                  <select
                    value={sourceFilter}
                    onChange={(e) => {
                      setSourceFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700]"
                  >
                    <option value="all">All Sources</option>
                    {sourceOptions.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Telecaller Filter (Admin only) */}
              {role === "admin" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Telecaller
                  </label>
                  <div className="relative">
                    <select
                      value={telecallerFilter}
                      onChange={(e) => {
                        setTelecallerFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700]"
                    >
                      <option value="all">All Telecallers</option>
                      <option value="unassigned">Unassigned</option>
                      {telecallers.map((t) => (
                        <option key={t._id || t.id} value={t._id || t.id}>
                          {t.name || t.fullName || t.firstName}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      ▼
                    </div>
                  </div>
                </div>
              )}

              {/* Rows per page */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Rows per page
                </label>
                <div className="relative">
                  <select
                    value={rowsPerPageChoice}
                    onChange={(e) => {
                      setRowsPerPageChoice(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700]"
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
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Applied Filters Display */}
            {getActiveFiltersCount() > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-600">
                    Applied filters:
                  </span>
                  {statusFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Status: {statusFilter}
                      <button
                        onClick={() => {
                          setStatusFilter("all");
                          setCurrentPage(1);
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {sourceFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Source: {sourceFilter}
                      <button
                        onClick={() => {
                          setSourceFilter("all");
                          setCurrentPage(1);
                        }}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {telecallerFilter !== "all" && role === "admin" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      Telecaller:{" "}
                      {telecallerFilter === "unassigned"
                        ? "Unassigned"
                        : telecallers.find(
                            (t) => (t._id || t.id) === telecallerFilter
                          )?.name || telecallerFilter}
                      <button
                        onClick={() => {
                          setTelecallerFilter("all");
                          setCurrentPage(1);
                        }}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {searchTerm.trim() && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setCurrentPage(1);
                        }}
                        className="ml-1 text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {currentLeads.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {filteredLeads.length}
          </span>{" "}
          leads
          {filteredLeads.length !== totalLeads && (
            <span className="text-gray-500">
              {" "}
              (filtered from {totalLeads} total)
            </span>
          )}
        </div>
        {getActiveFiltersCount() > 0 && (
          <div className="text-sm text-gray-500">
            {getActiveFiltersCount()} filter
            {getActiveFiltersCount() > 1 ? "s" : ""} applied
          </div>
        )}
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
                Phone
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Source
              </th>
              {role !== "telecaller" && (
                <th className="py-3 px-4 text-left font-semibold border-b">
                  Assigned
                </th>
              )}
              <th className="py-3 px-4 text-left font-semibold border-b">
                Status
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Created
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Edit
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Files
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">
                  Loading leads...
                </td>
              </tr>
            ) : currentLeads.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12">
                  <div className="flex flex-col items-center space-y-3">
                    <svg
                      className="w-16 h-16 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="text-gray-500">
                      {getActiveFiltersCount() > 0 ? (
                        <div className="text-center">
                          <p className="text-lg font-medium mb-2">
                            No leads match your filters
                          </p>
                          <p className="text-sm mb-4">
                            Try adjusting your search criteria or clearing some
                            filters
                          </p>
                          <button
                            onClick={clearAllFilters}
                            className="px-4 py-2 bg-[#FFD700] text-[#222] rounded-lg font-medium hover:bg-[#FFFDEB] transition"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-lg font-medium mb-2">
                            No leads found
                          </p>
                          <p className="text-sm text-gray-400">
                            Start by adding some leads to your organization
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
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
                  <td className="py-3 px-4 text-black border-b">
                    {lead.phone}
                  </td>
                  <td className="py-3 px-4 text-gray-600 border-b">
                    {lead.source}
                  </td>
                  {role !== "telecaller" && (
                    <td className="py-3 px-4 text-[#222] border-b">
                      {lead.assignedTo ? (
                        (() => {
                          const assignedId = lead.assignedTo;
                          const tc = telecallers.find((t) =>
                            [
                              t.id,
                              t._id,
                              t.userId,
                              t.user?.id,
                              t.user?._id,
                            ].some((k) => String(k) === String(assignedId))
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
                  )}
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
                    <div className="flex items-center justify-center">
                      <FaEdit
                        className="text-green-500 hover:text-green-700 cursor-pointer"
                        title={
                          role === "telecaller"
                            ? "Edit Notes/Tags"
                            : "Edit Lead"
                        }
                        onClick={() => setEditLead(lead)}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <button
                      onClick={() => {
                        navigate(`/asset-management?leadId=${lead._id}`);
                      }}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer flex items-center gap-1"
                      title="Manage Files"
                    >
                      <FaFolderOpen className="w-4 h-4" />
                      <span className="text-sm">Files</span>
                    </button>
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
        <div className="flex gap-2 items-center">
          {(() => {
            const totalPages =
              Math.ceil(filteredLeads.length / leadsPerPage) || 1;
            const pages = getPaginationPages(totalPages, currentPage, 6);
            return pages.map((p, idx) =>
              p === "..." ? (
                <span key={`dots-${idx}`} className="px-3 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => paginate(p)}
                  className={`px-3 py-1 rounded-lg shadow ${
                    currentPage === p
                      ? "bg-[#222] text-[#FFD700]"
                      : "bg-[#FFFDEB] text-[#222] hover:bg-[#FFD700]"
                  }`}
                >
                  {p}
                </button>
              )
            );
          })()}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur effect */}
          <div
            className="absolute inset-0 transition-opacity"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px) brightness(0.8)",
              WebkitBackdropFilter: "blur(10px) brightness(0.8)",
            }}
          ></div>
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
      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 transition-opacity"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px) brightness(0.8)",
              WebkitBackdropFilter: "blur(10px) brightness(0.8)",
            }}
          ></div>
          <div className="bg-white rounded-lg shadow-xl p-6 z-10 w-96">
            <h3 className="text-lg font-bold mb-4">Import Leads</h3>
            <p className="text-sm text-gray-600 mb-4">
              You can download a sample file to see the required format, or
              upload your .xlsx file to import leads.
            </p>
            <div className="flex gap-2 mb-4">
              <button
                className="px-4 py-2 bg-[#222] text-[#FFD700] rounded-lg shadow font-bold hover:opacity-90"
                onClick={downloadImportSample}
              >
                Download Sample
              </button>
              <label className="px-4 py-2 bg-[#E6F9E5] text-[#222] rounded-lg shadow font-bold cursor-pointer">
                Upload File
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcel}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => setShowImportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
