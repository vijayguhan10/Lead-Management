import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/**
 * TrendsChart Component
 * Displays conversion trends with monthly/weekly filter
 */
const TrendsChart = ({ data, filter, onFilterChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fadeIn">
      {/* Header with filter */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Conversion Trends</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange("monthly")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "monthly"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => onFilterChange("weekly")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "weekly"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          >
            <defs>
              <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorContacted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey={filter === "monthly" ? "month" : "week"}
              angle={-15}
              textAnchor="end"
              height={70}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "0.5rem",
                padding: "0.75rem",
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
              wrapperStyle={{
                paddingBottom: "1rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="converted"
              name="Converted"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorConverted)"
            />
            <Area
              type="monotone"
              dataKey="contacted"
              name="Contacted"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorContacted)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TrendsChart;
