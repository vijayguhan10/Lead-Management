import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaPhone,
  FaBuilding,
  FaArrowRight,
} from "react-icons/fa";

const priorityColors = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
};

const statusColors = {
  New: "bg-orange-100 text-orange-800",
  Contacted: "bg-blue-100 text-blue-800",
  Qualified: "bg-purple-100 text-purple-800",
  Converted: "bg-green-100 text-green-800",
  Dropped: "bg-red-100 text-red-800",
};

/**
 * UpcomingFollowUps Component
 * Displays next 2 upcoming follow-ups with click-through to lead details
 */
const UpcomingFollowUps = ({ followUps }) => {
  const navigate = useNavigate();

  const handleLeadClick = (leadId, leadName) => {
    // Navigate to leads page with search query
    navigate(`/leads?search=${encodeURIComponent(leadName || "")}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaCalendarAlt className="text-purple-600" />
        Upcoming Follow-ups
      </h3>

      {!followUps || followUps.length === 0 ? (
        <div className="text-center py-12">
          <FaCalendarAlt className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No upcoming follow-ups scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {followUps.map((followUp, index) => (
            <div
              key={followUp.leadId || index}
              onClick={() => handleLeadClick(followUp.leadId, followUp.name)}
              className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-5 cursor-pointer hover:shadow-lg transition-all border-l-4 border-purple-500 hover:border-purple-700"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-1">
                    {followUp.name}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaPhone className="text-blue-500" />
                      {followUp.phone}
                    </span>
                    {followUp.company && (
                      <span className="flex items-center gap-1">
                        <FaBuilding className="text-gray-500" />
                        {followUp.company}
                      </span>
                    )}
                  </div>
                </div>
                <FaArrowRight className="text-purple-600 text-xl" />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusColors[followUp.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {followUp.status}
                </span>
                {followUp.priority && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      priorityColors[followUp.priority] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {followUp.priority} Priority
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm text-gray-600 ml-auto">
                  <FaCalendarAlt className="text-purple-500" />
                  {new Date(followUp.nextFollowUp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingFollowUps;
