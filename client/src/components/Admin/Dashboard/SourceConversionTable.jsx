import React from "react";
import PropTypes from "prop-types";
import { FaChartPie } from "react-icons/fa";

/**
 * SourceConversionTable - Displays conversion statistics by lead source
 */
const SourceConversionTable = ({ sourceConversions, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-[280px]">
        <div className="animate-pulse text-gray-400">Loading source data...</div>
      </div>
    );
  }

  if (!sourceConversions || sourceConversions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-[280px]">
        <div className="text-center">
          <FaChartPie className="text-5xl text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400">No source data available</p>
        </div>
      </div>
    );
  }

  const maxConverted = Math.max(...sourceConversions.map((s) => s.converted));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 text-lg">
          Conversion by Source
        </h3>
        <span className="text-xs text-gray-500">
          {sourceConversions.length} Source(s)
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Source
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Total Leads
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Converted
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Conversion Rate
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Performance
              </th>
            </tr>
          </thead>
          <tbody>
            {sourceConversions.map((source) => {
              const barWidth = maxConverted > 0 ? (source.converted / maxConverted) * 100 : 0;
              const rateNum = parseFloat(source.conversionRate);
              let rateColor = "text-gray-600";
              if (rateNum >= 50) rateColor = "text-green-600";
              else if (rateNum >= 25) rateColor = "text-yellow-600";
              else if (rateNum > 0) rateColor = "text-orange-600";

              return (
                <tr
                  key={source.source}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {source.source}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">
                    {source.total}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-green-600">
                    {source.converted}
                  </td>
                  <td className={`py-3 px-4 text-center font-bold ${rateColor}`}>
                    {source.conversionRate}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {source.converted}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

SourceConversionTable.propTypes = {
  sourceConversions: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      converted: PropTypes.number.isRequired,
      conversionRate: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool,
};

SourceConversionTable.defaultProps = {
  sourceConversions: [],
  loading: false,
};

export default SourceConversionTable;
