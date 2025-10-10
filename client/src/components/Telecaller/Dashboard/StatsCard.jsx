import React from "react";
import {
  FaChartLine,
  FaCheckCircle,
  FaStar,
  FaExclamationCircle,
} from "react-icons/fa";

const colorConfig = {
  blue: {
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: FaChartLine,
  },
  green: {
    gradient: "from-green-500 to-green-600",
    bg: "bg-green-50",
    text: "text-green-600",
    icon: FaCheckCircle,
  },
  purple: {
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    text: "text-purple-600",
    icon: FaStar,
  },
  orange: {
    gradient: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    text: "text-orange-600",
    icon: FaExclamationCircle,
  },
};

/**
 * StatsCard Component
 * Displays a metric with icon, value, and subtitle
 */
const StatsCard = ({ title, value, color, subtitle }) => {
  const config = colorConfig[color] || colorConfig.blue;
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-l-4 border-transparent hover:border-current animate-fadeIn">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className={`text-4xl font-bold ${config.text} mb-2`}>{value}</h3>
          {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
        </div>
        <div className={`${config.bg} p-4 rounded-lg`}>
          <Icon className={`text-2xl ${config.text}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
