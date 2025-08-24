import React, { useState, useMemo } from "react";

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 transition-all">
      <div className="bg-white rounded-xl shadow-2xl p-6 min-w-[340px] max-w-lg w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-indigo-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const TelecallerAssignInfo = ({ lead, telecallers = [], onAssign }) => {
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState(null);

  const filtered = useMemo(() => {
    if (!query) return telecallers;
    const q = query.toLowerCase();
    return telecallers.filter(
      (t) =>
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.email && t.email.toLowerCase().includes(q)) ||
        (t.phone && t.phone.toLowerCase().includes(q))
    );
  }, [telecallers, query]);

  const handleAssign = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await Promise.resolve(onAssign?.(lead?.id ?? lead, selected));
      setAssigned({ telecaller: selected, at: new Date() });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">
                {lead?.name || lead?.company || "Untitled Lead"}
              </h3>
              <p className="text-base text-gray-500 mb-2">
                {lead?.email || lead?.phone || "No contact information"}
              </p>
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold text-sm mb-2">
                {lead?.status || "New"}
              </span>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {lead?.notes || "No notes available for this lead."}
              </p>
              {assigned && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                  <span className="font-semibold text-indigo-700">
                    Assigned to {assigned.telecaller.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({new Date(assigned.at).toLocaleString()})
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow hover:scale-105 transition"
              >
                {selected ? "Change Telecaller" : "Assign Telecaller"}
              </button>
              {selected && (
                <div className="flex flex-col items-start gap-1 px-4 py-2 rounded-lg bg-indigo-50">
                  <span className="text-lg font-semibold text-indigo-700">
                    {selected.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selected.email || selected.phone}
                  </span>
                  <span className="text-xs text-purple-600 font-semibold">
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
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleAssign}
                disabled={!selected || loading}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  selected
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Assigning..." : assigned ? "Reassign" : "Assign"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Select Telecaller
        </h2>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email or phone..."
          className="w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none mb-4"
        />
        <div className="max-h-64 overflow-auto">
          {filtered.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              No telecallers found.
            </div>
          ) : (
            filtered.map((t) => (
              <button
                key={t.id || t._id || t.email}
                onClick={() => {
                  setSelected(t);
                  setModalOpen(false);
                  setQuery("");
                }}
                className="w-full text-left px-4 py-3 mb-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex flex-col items-start transition"
              >
                <span className="text-lg font-semibold text-indigo-700">
                  {t.name}
                </span>
                <span className="text-xs text-gray-500">
                  {t.email || t.phone}
                </span>
                <span className="text-xs text-purple-600 font-semibold">
                  {t.role || "Telecaller"}
                </span>
              </button>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TelecallerAssignInfo;
