import React from "react";
import PropTypes from "prop-types";

/**
 * MetricCard - Displays a single metric with icon, value, label and trend indicator
 */
const MetricCard = ({ label, value, subtext, icon, color, percent }) => {
  return (
    <div
      className={`dashboard-card bg-gradient-to-br ${color} rounded-xl shadow-lg flex flex-col items-start p-4 border border-gray-200 transition-transform hover:scale-[1.03] hover:shadow-xl`}
    >
      <span className="text-xs text-gray-600 mb-1 font-semibold uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-3 mb-2">
        <div className="text-2xl">{icon}</div>
        <span className="text-3xl font-bold text-gray-800">{value}</span>
      </div>
      {subtext && (
        <div className="text-xs text-gray-500 mb-2">{subtext}</div>
      )}
      {percent !== undefined && (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] transition-all duration-500"
            style={{ width: `${Math.min(percent, 100)}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

MetricCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtext: PropTypes.string,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string,
  percent: PropTypes.number,
};

MetricCard.defaultProps = {
  color: "from-white to-gray-50",
  subtext: "",
};

export default MetricCard;
