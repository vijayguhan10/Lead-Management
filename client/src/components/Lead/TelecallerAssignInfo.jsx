import React, { useState, useMemo } from "react";

const Modal = ({ open, onClose, telecallers, onSelect, query, setQuery }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl mx-4 py-10 px-8 relative flex flex-col justify-center">
        <button
          className="absolute top-8 right-10 text-gray-500 hover:text-gray-700 text-3xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 justify-center">
            Assign Telecaller
          </h2>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search telecaller name, email or phone..."
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none mb-6 text-base"
          />
          <div className="h-64 overflow-y-auto mb-4 w-full">
            <table className="min-w-full text-base rounded-xl overflow-hidden shadow border border-gray-100">
              <tbody>
                {telecallers.length === 0 ? (
                  <tr>
                    <td className="p-6 text-center text-gray-500">
                      No telecallers found.
                    </td>
                  </tr>
                ) : (
                  telecallers.map((t, idx) => (
                    <tr
                      key={t.id || t._id || t.email || idx}
                      className="transition bg-white hover:bg-indigo-50 border-b-2 border-gray-200 cursor-pointer"
                      onClick={() => {
                        onSelect(t);
                        onClose();
                        setQuery("");
                      }}
                    >
                      <td className="py-5 px-4 font-bold text-indigo-700 text-lg whitespace-nowrap">
                        {t.name}
                      </td>
                      <td className="py-5 px-4 text-gray-700 text-base whitespace-nowrap">
                        {t.email || t.phone}
                      </td>
                      <td className="py-5 px-4 text-purple-600 font-semibold text-base whitespace-nowrap">
                        {t.role || "Telecaller"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-8 w-full">
            <button
              className="px-8 py-3 bg-gray-900 text-white rounded-full shadow font-bold text-lg hover:bg-gray-700 transition"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
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
          <div className="flex flex-col gap-8">
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
                disabled={!selected || loading}
                className={`px-8 py-3 rounded-full font-bold shadow-lg transition text-lg ${
                  selected
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Assigning..." : assigned ? "Reassign" : "Assign"}
              </button>
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
      />
    </div>
  );
};

export default TelecallerAssignInfo;
