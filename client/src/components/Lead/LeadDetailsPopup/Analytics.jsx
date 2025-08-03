import PropTypes from "prop-types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { FaChartLine, FaTag, FaHourglassHalf } from "react-icons/fa";
import TelecallerPerformanceStat from "./TelecallerPerformanceStat";

const Analytics = ({
  leadActivityData,
  leadSourceData,
  conversionFunnelData,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Lead Activity Chart */}
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaChartLine className="text-[#7C3AED]" />
        Lead Activity Timeline
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={leadActivityData}>
          <defs>
            <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E42" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#fef6e5" stopOpacity={0.08} />
            </linearGradient>
            <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#dcfce7" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="calls"
            stroke="#F59E42"
            fillOpacity={1}
            fill="url(#colorCalls)"
          />
          <Area
            type="monotone"
            dataKey="emails"
            stroke="#16A34A"
            fillOpacity={1}
            fill="url(#colorEmails)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    {/* Lead Source Distribution */}
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaTag className="text-[#16A34A]" />
        Lead Source Distribution
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={leadSourceData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {leadSourceData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {leadSourceData.map((source) => (
          <div key={source.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: source.color }}
            ></div>
            <span className="text-sm text-gray-600">{source.name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Conversion Funnel + Telecaller Performance Stat */}
    <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaHourglassHalf className="text-[#F59E42]" />
          Conversion Funnel Analysis
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={conversionFunnelData} layout="horizontal">
            <XAxis type="number" />
            <YAxis dataKey="stage" type="category" width={80} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <TelecallerPerformanceStat />
    </div>
  </div>
);

Analytics.propTypes = {
  leadActivityData: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      calls: PropTypes.number.isRequired,
      emails: PropTypes.number.isRequired,
      meetings: PropTypes.number,
    })
  ).isRequired,
  leadSourceData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  conversionFunnelData: PropTypes.arrayOf(
    PropTypes.shape({
      stage: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      rate: PropTypes.number,
    })
  ).isRequired,
};

export default Analytics;
