import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useApi } from "../../hooks/useApi";

const Modal = ({
  open,
  onClose,
  telecallers,
  onSelect,
  query,
  setQuery,
  loading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-5xl mx-4 py-6 px-8 relative flex flex-col justify-center max-h-[85vh] overflow-auto">
        <div className="w-full flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 truncate">
            Assign Telecaller
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-4 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 text-3xl font-bold"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <div className="w-full text-center py-8 text-gray-500">
            Loading telecallers...
          </div>
        ) : (
          <>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search telecaller name, email or phone..."
              className="w-full px-4 py-3 pr-20 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none mb-6 text-base"
            />

            <div className="h-96 md:h-[60vh] overflow-y-auto mb-4 w-full">
              <table className="min-w-full text-base rounded-xl overflow-hidden shadow border border-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left font-semibold border-b">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left font-semibold border-b">
                      Contact
                    </th>
                    <th className="py-3 px-4 text-left font-semibold border-b">
                      Role
                    </th>
                    <th className="py-3 px-4 text-left font-semibold border-b">
                      Performance Metrics
                    </th>
                    <th className="py-3 px-4 text-left font-semibold border-b">
                      Assigned Leads
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(!telecallers || telecallers.length === 0) && (
                    <tr>
                      <td className="p-6 text-center text-gray-500" colSpan={5}>
                        No telecallers found.
                      </td>
                    </tr>
                  )}

                  {telecallers &&
                    telecallers.length > 0 &&
                    telecallers.map((t, idx) => {
                      const perf = t.performanceMetrics || {};
                      const daily = perf.dailyCallTarget ?? 0;
                      const monthly = perf.monthlyLeadGoal ?? 0;

                      // normalize assignedCount into a number (avoid nested ternary)
                      let assignedCount = 0;
                      if (Array.isArray(t.assignedLeads))
                        assignedCount = t.assignedLeads.length;
                      else if (typeof t.assignedLeads === "number")
                        assignedCount = t.assignedLeads;

                      return (
                        <tr
                          key={t.id || t._id || t.email || idx}
                          className="transition bg-white hover:bg-indigo-50 border-b-2 border-gray-200 cursor-pointer"
                          onClick={() => {
                            onSelect(t);
                            onClose();
                            setQuery("");
                          }}
                        >
                          <td className="py-5 px-4 font-bold text-indigo-700 text-lg break-words">
                            {t.name}
                          </td>
                          <td className="py-5 px-4 text-gray-700 text-base break-words">
                            {t.email || t.phone}
                          </td>
                          <td className="py-5 px-4 text-purple-600 font-semibold text-base">
                            {t.role || "Telecaller"}
                          </td>

                          <td className="py-5 px-4 text-gray-700 text-sm">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center">
                                <div className="w-36 text-right pr-2 font-medium">
                                  Daily Call Target:
                                </div>
                                <div className="text-indigo-700 font-medium">
                                  {daily}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="w-36 text-right pr-2 font-medium">
                                  Monthly Lead Goal:
                                </div>
                                <div className="text-indigo-700 font-medium">
                                  {monthly}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-5 px-4 text-gray-800 font-semibold text-center">
                            {assignedCount}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-4 w-full">
              <button
                className="px-8 py-3 bg-gray-900 text-white rounded-full shadow font-bold text-lg hover:bg-gray-700 transition"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const TelecallerAssignInfo = ({
  lead,
  telecallers = [],
  loading = false,
  onAssign,
  onClose,
}) => {
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assigned, setAssigned] = useState(null);

  const { execute: executeLead } = useApi("lead", "/", { manual: true });

  // Use telecallers provided via props (fetched once by parent)
  const telecallerList = useMemo(() => {
    if (!telecallers || !Array.isArray(telecallers)) return [];
    return telecallers;
  }, [telecallers]);

  const filtered = useMemo(() => {
    const source = telecallerList || [];
    if (!query) return source;
    const q = query.toLowerCase();
    return source.filter(
      (t) =>
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.email && t.email.toLowerCase().includes(q)) ||
        (t.phone && t.phone.toLowerCase().includes(q))
    );
  }, [telecallerList, query]);

  const handleAssign = async () => {
    if (!selected) return;
    setAssigning(true);
    try {
      const leadId = lead?.id ?? lead?._id ?? lead;
      const telecallerId = selected?.id ?? selected?._id ?? selected;
      const res = await executeLead({
        method: "PATCH",
        endpoint: `/leads/${leadId}/assign/${telecallerId}`,
      });
      setAssigned({ telecaller: selected, at: new Date() });
      onAssign && onAssign(res || { leadId, telecallerId });
      toast.success("Telecaller assigned successfully.");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      const message = err?.message || "Failed to assign telecaller.";
      toast.error(message);
    } finally {
      setAssigning(false);
    }
  };

  let assignButtonLabel;
  if (assigning) assignButtonLabel = "Assigning...";
  else if (assigned) assignButtonLabel = "Reassign";
  else assignButtonLabel = "Assign";

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <div className="rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden relative">
        <div className="p-8 bg-gradient-to-r from-gray-50 to-white relative">
          <button
            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 text-3xl font-bold z-20 rounded-full w-10 h-10 flex items-center justify-center"
            onClick={typeof onClose === "function" ? onClose : () => {}}
            aria-label="Close"
            type="button"
          >
            &times;
          </button>
          <div className="flex pt-3.5 flex-col gap-8">
            <div className="rounded-2xl bg-gradient-to-br from-white via-indigo-50 to-purple-50 shadow-lg border border-gray-100 p-8">
              <h3 className="text-3xl font-extrabold text-indigo-800 mb-2 tracking-tight">
                {lead?.name || lead?.company || "Untitled Lead"}
              </h3>
              <div className="flex flex-wrap gap-6 items-center mb-4">
                <span className="text-base text-gray-500">
                  {lead?.email || lead?.phone || "No contact information"}
                </span>
                <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-800 font-bold text-sm shadow">
                  {lead?.status || "New"}
                </span>
              </div>
              <p className="mt-2 text-md text-gray-700 leading-relaxed italic">
                {lead?.notes || "No notes available for this lead."}
              </p>
              {assigned && (
                <div className="mt-6 flex items-center gap-3 text-md text-gray-700 bg-indigo-50 rounded-xl px-4 py-2 shadow">
                  <span className="font-bold text-indigo-700">
                    Assigned to {assigned.telecaller.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({new Date(assigned.at).toLocaleString()})
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
              <div className="relative w-full flex justify-center">
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition text-lg"
                  >
                    {selected ? "Change Telecaller" : "Assign Telecaller"}
                  </button>
                  {selected && (
                    <div className="flex flex-col items-start gap-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 shadow border border-indigo-200">
                      <span className="text-xl font-bold text-indigo-700">
                        {selected.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {selected.email || selected.phone}
                      </span>
                      <span className="text-sm text-purple-600 font-semibold">
                        {selected.role || "Telecaller"}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(null);
                      setAssigned(null);
                    }}
                    className="px-6 py-3 rounded-full border border-gray-300 text-md text-gray-700 bg-white hover:bg-gray-50 font-semibold shadow"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleAssign}
                    disabled={!selected || assigning}
                    className={`px-8 py-3 rounded-full font-bold shadow-lg transition text-lg ${
                      selected
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {assignButtonLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        telecallers={filtered}
        onSelect={setSelected}
        query={query}
        setQuery={setQuery}
        loading={loading}
      />
    </div>
  );
};

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  telecallers: PropTypes.arrayOf(PropTypes.object),
  onSelect: PropTypes.func,
  query: PropTypes.string,
  setQuery: PropTypes.func,
  loading: PropTypes.bool,
};

TelecallerAssignInfo.propTypes = {
  lead: PropTypes.object,
  telecallers: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onAssign: PropTypes.func,
  onClose: PropTypes.func,
};

export default TelecallerAssignInfo;
