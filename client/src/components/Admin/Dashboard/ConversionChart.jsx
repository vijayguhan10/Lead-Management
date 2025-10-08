import React from "react";
import PropTypes from "prop-types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * ConversionChart - Displays monthly conversion trends using an area chart
 */
const ConversionChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex items-center justify-center h-full">
        <div className="text-gray-400">No conversion data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 text-lg">
          Monthly Lead Analytics
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Last 12 Months
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 30 }}
          >
            <defs>
              <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 11, fill: "#6B7280" }}
              stroke="#D1D5DB"
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: "#6B7280" }} 
              stroke="#D1D5DB"
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "2px solid #E5E7EB",
                borderRadius: "12px",
                fontSize: "13px",
                padding: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "8px" }}
            />
            <Legend
              wrapperStyle={{ 
                fontSize: "13px", 
                paddingTop: "15px",
                fontWeight: "500"
              }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="assigned"
              stroke="#7C3AED"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAssigned)"
              name="Assigned Leads"
              dot={{ r: 4, fill: "#7C3AED", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7, strokeWidth: 3 }}
            />
            <Area
              type="monotone"
              dataKey="converted"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorConverted)"
              name="Converted Leads"
              dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7, strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

ConversionChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      converted: PropTypes.number.isRequired,
      assigned: PropTypes.number.isRequired,
    })
  ),
  loading: PropTypes.bool,
};

ConversionChart.defaultProps = {
  data: [],
  loading: false,
};

export default ConversionChart;
