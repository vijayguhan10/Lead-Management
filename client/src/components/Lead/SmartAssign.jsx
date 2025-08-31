import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useApi } from "../../hooks/useApi";

export default function SmartAssign({
  open,
  onClose,
  leads = [], // unassigned leads for selection
  allLeads = [], // full leads list for lookups (name/phone)
  telecallers = [],
  orgId,
  onSuccess,
}) {
  const [selectedLeads, setSelectedLeads] = useState(() =>
    Array.isArray(leads) ? leads.map((l) => l._id || l.id || l) : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedLeads(
        Array.isArray(leads) ? leads.map((l) => l._id || l.id || l) : []
      );
    }
  }, [open, leads]);

  const { execute } = useApi("lead", "/leads/smart-assign", { manual: true });
  const remaining = useMemo(() => selectedLeads.length, [selectedLeads]);
  const [assignmentResult, setAssignmentResult] = useState(null);

  const findTelecallerById = (tcId) => {
    if (!telecallers || !Array.isArray(telecallers)) return null;
    return telecallers.find((t) => {
      const keys = [
        t.id,
        t._id,
        t.userId,
        t.user && t.user.id,
        t.user && t.user._id,
      ];
      return keys.some((k) => String(k) === String(tcId));
    });
  };

  const findLeadById = (lid) => {
    if (!leads || !Array.isArray(leads)) return null;
    return leads.find((L) => String(L._id || L.id) === String(lid));
  };

  // build a map for fast lookups and to support different lead shapes
  // prefer `allLeads` (full dataset) if provided, otherwise fall back to `leads`
  const leadsMap = useMemo(() => {
    const source =
      Array.isArray(allLeads) && allLeads.length > 0 ? allLeads : leads;
    const map = {};
    if (!Array.isArray(source)) return map;
    for (const L of source) {
      const id = String(L?._id || L?.id || L || "");
      if (!id) continue;
      map[id] = L;
    }
    return map;
  }, [allLeads, leads]);

  if (!open) return null;

  const handleRemove = (id) => {
    setSelectedLeads((prev) => prev.filter((p) => String(p) !== String(id)));
  };

  const handleAdd = (id) => {
    setSelectedLeads((prev) => {
      if (prev.some((p) => String(p) === String(id))) return prev;
      return [...prev, id];
    });
  };

  const handleSmartAssign = async () => {
    if (!selectedLeads || selectedLeads.length === 0) {
      toast.info("No leads selected for smart assign.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = orgId
        ? { leadIds: selectedLeads, organizationId: orgId }
        : { leadIds: selectedLeads };
      const res = await execute({ method: "POST", data: payload });
      setAssignmentResult(res || null);
      // Notify parent so it can refetch before modal close; parent will show toast
      onSuccess && onSuccess(res || null);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Smart assign failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAssignments = () => {
    if (!assignmentResult) return null;
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-700">Assignment Results</div>
        {(assignmentResult.assignments || []).length === 0 ? (
          <div className="text-gray-500">No assignments returned.</div>
        ) : (
          (assignmentResult.assignments || []).map((a, idx) => {
            const tcId = a.telecallerId;
            const tc = findTelecallerById(tcId);
            const tcName = tc
              ? tc.name || tc.fullName || tc.firstName
              : String(tcId);
            // light pastel gradients for a softer, airy look
            const colors = [
              "from-indigo-200 to-indigo-100",
              "from-emerald-200 to-emerald-100",
              "from-amber-200 to-amber-100",
              "from-rose-200 to-rose-100",
              "from-sky-200 to-sky-100",
            ];
            const color = colors[idx % colors.length];
            const initials = (tcName || "T")
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            return (
              <div
                key={tcId}
                className={`p-4 rounded-lg shadow-sm transform transition duration-300 hover:scale-[1.005] bg-gradient-to-r ${color}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center font-bold text-lg text-gray-800 shadow-sm">
                      {initials}
                    </div>
                  </div>
                  <div className="flex-1 text-gray-900">
                    <div className="font-semibold text-lg">{tcName}</div>
                    <div className="text-sm opacity-90">
                      Assigned {(a.assignedLeads || []).length} leads
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {(a.assignedLeads || []).map((assigned, aIdx) => {
                        // assigned entry may be a string id or an object with _id/id or even embedded name/phone
                        let id = "";
                        if (assigned && typeof assigned === "object") {
                          id = String(
                            assigned._id || assigned.id || assigned.leadId || ""
                          );
                        } else {
                          id = String(assigned || "");
                        }

                        // try lookup via map, then via find helper
                        const leadObj =
                          (id && leadsMap[id]) ||
                          findLeadById(id) ||
                          (assigned && typeof assigned === "object"
                            ? assigned
                            : null);

                        const displayName =
                          leadObj?.name ||
                          leadObj?.fullName ||
                          leadObj?.email ||
                          id ||
                          "Unknown";
                        const displayPhone =
                          leadObj?.phone ||
                          leadObj?.mobile ||
                          leadObj?.email ||
                          "";

                        return (
                          <div
                            key={id || `lead-${aIdx}`}
                            className="bg-white/20 rounded px-3 py-2 text-sm flex flex-col"
                          >
                            <div className="font-medium text-sm">
                              {displayName}
                            </div>
                            <div className="text-xs opacity-90">
                              {displayPhone}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div className="text-sm text-gray-600">
          Updated leads: <strong>{assignmentResult.updatedLeads ?? 0}</strong>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px) brightness(0.8)',
          WebkitBackdropFilter: 'blur(10px) brightness(0.8)'
        }}
      ></div>
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-4xl mx-4 py-0 px-0 relative flex flex-col"
        style={{ maxHeight: "85vh" }}
      >
        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-gray-100 rounded-t-3xl">
          <h3 className="text-2xl font-bold text-gray-900">
            Smart Assign Leads
          </h3>
          <button
            className="text-2xl font-bold text-gray-500"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto px-8 py-6 flex-1">
          <div className="mb-4 text-sm text-gray-700">
            Selected leads: <strong>{remaining}</strong>
          </div>

          {assignmentResult ? (
            renderAssignments()
          ) : (
            <div className="grid gap-3">
              {Array.isArray(leads) && leads.length > 0 ? (
                leads.map((l) => {
                  const id = l._id || l.id || l;
                  const included = selectedLeads.some(
                    (s) => String(s) === String(id)
                  );
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {l.name || l.email || id}
                        </div>
                        <div className="text-xs text-gray-500">
                          {l.phone || l.source || ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {included ? (
                          <button
                            className="px-3 py-1 bg-red-100 text-red-700 rounded"
                            onClick={() => handleRemove(id)}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            className="px-3 py-1 bg-green-100 text-green-700 rounded"
                            onClick={() => handleAdd(id)}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-6">
                  No unassigned leads available.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-8 py-4 flex justify-between items-center border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Total to assign: <strong>{remaining}</strong>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-gray-100 rounded-md"
              onClick={onClose}
            >
              Close
            </button>
            {!assignmentResult && (
              <button
                className={`px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold flex items-center gap-2 ${
                  isSubmitting ? "opacity-80" : ""
                }`}
                onClick={handleSmartAssign}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <svg
                    className="w-4 h-4 animate-spin text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : null}
                <span>
                  {isSubmitting ? "Assigning..." : "Smart Assign Leads"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

SmartAssign.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  leads: PropTypes.array,
  allLeads: PropTypes.array,
  telecallers: PropTypes.array,
  orgId: PropTypes.string,
  onSuccess: PropTypes.func,
};
