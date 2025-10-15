import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";

const colorConfig = {
  red: {
    gradient: "from-red-500 to-red-600",
    bg: "bg-red-50",
    text: "text-red-600",
    icon: FaExclamationTriangle,
  },
  blue: {
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: FaClock,
  },
  yellow: {
    gradient: "from-yellow-500 to-yellow-600",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    icon: FaCalendarAlt,
  },
};

/**
 * FollowUpWidget Component
 * Displays follow-up count with optional list view in modal
 */
const FollowUpWidget = ({ title, count, color, leads, subtitle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const config = colorConfig[color] || colorConfig.blue;
  const Icon = config.icon;

  const handleLeadClick = (leadId, leadName) => {
    setIsModalOpen(false);
    // Navigate to leads page with search query
    navigate(`/leads?search=${encodeURIComponent(leadName || "")}`);
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 ${
          leads ? "cursor-pointer" : ""
        } animate-fadeIn`}
        onClick={() => leads && leads.length > 0 && setIsModalOpen(true)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`${config.bg} p-3 rounded-lg`}>
            <Icon className={`text-xl ${config.text}`} />
          </div>
          <span className={`text-3xl font-bold ${config.text}`}>{count}</span>
        </div>
        <h4 className="text-gray-700 font-semibold text-lg">{title}</h4>
        {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        {leads && leads.length > 0 && (
          <p className="text-gray-500 text-xs mt-2">Click to view details</p>
        )}
      </div>

      {/* Modal for lead details */}
      {isModalOpen && leads && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop with Blur */}
          <div
            className="absolute inset-0 cursor-default"
            onClick={() => setIsModalOpen(false)}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slideUp">
            {/* Header */}
            <div
              className={`bg-gradient-to-r ${config.gradient} text-white p-6 flex justify-between items-center`}
            >
              <h3 className="text-2xl font-bold">{title}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="bg-white text-gray-800 hover:bg-gray-100 transition-all rounded-full p-2 shadow-md"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Lead List */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {leads.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No leads found</p>
              ) : (
                <div className="space-y-3">
                  {leads.map((lead, index) => (
                    <div
                      key={lead.leadId || index}
                      onClick={() => handleLeadClick(lead.leadId, lead.name)}
                      className="bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 rounded-xl p-5 cursor-pointer transition-all border border-gray-200 hover:border-gray-300 hover:shadow-md"
                    >
                      <div className="flex justify-between items-start gap-4">
                        {/* Lead Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">
                            {lead.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                            <FaClock className="text-gray-400 text-xs" />
                            {lead.phone}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {lead.status && (
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                {lead.status}
                              </span>
                            )}
                            {lead.priority && (
                              <span
                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                  lead.priority === "High"
                                    ? "bg-red-100 text-red-800"
                                    : lead.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {lead.priority} Priority
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Date & Time */}
                        {lead.nextFollowUp && (
                          <div
                            className={`text-right bg-gradient-to-br ${config.gradient} text-white px-4 py-3 rounded-lg shadow-sm min-w-[140px]`}
                          >
                            <p className="text-xs font-medium opacity-90 mb-1">
                              Next Follow-up
                            </p>
                            <p className="text-sm font-bold">
                              {new Date(lead.nextFollowUp).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                            <p className="text-xs font-semibold mt-1">
                              {new Date(lead.nextFollowUp).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FollowUpWidget;
