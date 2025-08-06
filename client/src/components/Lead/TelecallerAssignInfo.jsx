import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const TelecallerAssignInfo = ({ lead, telecallers, onAssign }) => {
  const [selectedTelecaller, setSelectedTelecaller] = useState(null);
  const [assigned, setAssigned] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred dark background */}
      <div className="absolute inset-0 bg-[#00000063] bg-opacity-60 backdrop-blur-sm"></div>
      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl border-2 border-[#C7BFFF] min-w-[350px] md:min-w-[500px] max-w-[95vw] w-full p-8 flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={() => onAssign(null)}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-[#7C3AED] mb-6 flex items-center gap-2">
          <span className="luxury-icon">💎</span> Assign Lead to Telecaller
        </h2>
        <div className="mb-6 p-4 bg-[#f9fafb] rounded-xl shadow flex flex-col gap-1 border border-[#e0e7ff]">
          <div className="font-semibold text-[#4F46E5] text-lg">
            Lead: {lead.name}
          </div>
          <div className="text-xs text-gray-500">Email: {lead.email}</div>
          <div className="text-xs text-gray-500">Phone: {lead.phone}</div>
          <div className="text-xs text-gray-500">Source: {lead.source}</div>
          <div className="text-xs text-gray-500">Priority: {lead.priority}</div>
        </div>
        <div className="mb-6">
          <div className="font-semibold text-[#7C3AED] mb-3 text-lg">
            Select Telecaller
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {telecallers.map((tc) => (
              <button
                key={tc.name}
                className={`flex items-center gap-4 p-4 rounded-xl shadow border-2 transition-all bg-white w-full
                  ${
                    selectedTelecaller === tc.name
                      ? "border-[#FFD700] ring-2 ring-[#FFD700] bg-[#fffbe6]"
                      : "border-[#e0e7ff]"
                  }
                  hover:border-[#FFD700]`}
                onClick={() => setSelectedTelecaller(tc.name)}
                disabled={assigned}
              >
                {tc.avatar ? (
                  <img
                    src={tc.avatar}
                    alt={tc.name}
                    className="w-14 h-14 rounded-full border-2 border-[#FFD700] object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-14 h-14 text-[#e0e7ff]" />
                )}
                <div className="flex flex-col items-start justify-center w-full">
                  <span className="font-bold text-[#4F46E5] text-base">
                    {tc.name}
                  </span>
                  <span className="text-xs text-gray-500 mb-1">
                    {tc.luxuryLevel}
                  </span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mt-1 w-full">
                    <span className="text-[#7C3AED] font-semibold">
                      Assigned:{" "}
                      <span className="font-bold">{tc.assignedThisMonth}</span>
                    </span>
                    <span className="text-[#16A34A] font-semibold">
                      Completed:{" "}
                      <span className="font-bold">{tc.completed}</span>
                    </span>
                    <span className="text-[#F59E42] font-semibold">
                      Pending: <span className="font-bold">{tc.pending}</span>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button
            className="px-8 py-3 bg-[#FFD700] text-[#4F46E5] rounded-xl shadow-xl font-bold text-lg hover:bg-[#FDE68A] transition disabled:opacity-50"
            disabled={!selectedTelecaller || assigned}
            onClick={() => {
              if (selectedTelecaller) {
                setAssigned(true);
                setTimeout(() => {
                  onAssign(selectedTelecaller);
                }, 800); // Simulate assignment delay
              }
            }}
          >
            {assigned ? "Assigned!" : "Assign Lead"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelecallerAssignInfo;
