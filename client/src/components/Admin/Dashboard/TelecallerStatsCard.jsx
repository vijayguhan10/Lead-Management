import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaUserCircle,
  FaSpinner,
  FaTrophy,
  FaUsers,
  FaTimes,
  FaMedal,
  FaChartLine,
} from "react-icons/fa";
import { useApi } from "../../../hooks/useApi";

/**
 * TelecallerStatsCard - Displays top performer with modal for all telecallers
 */
const TelecallerStatsCard = ({ telecallerPerformance, loading }) => {
  const [telecallersWithNames, setTelecallersWithNames] = useState([]);
  const [loadingNames, setLoadingNames] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orgId = localStorage.getItem("organizationId") || "";
  const { data: telecallersData, loading: telecallersLoading } = useApi(
    "telecaller",
    `/telecallers/organization/${orgId}`
  );

  // Helper function to get rank badge classes
  const getRankBadgeClasses = (index) => {
    if (index === 0) return "bg-gradient-to-br from-yellow-400 to-yellow-600";
    if (index === 1) return "bg-gradient-to-br from-gray-400 to-gray-600";
    if (index === 2) return "bg-gradient-to-br from-orange-400 to-orange-600";
    return "bg-gradient-to-br from-purple-400 to-purple-600";
  };

  // Helper function to get card background classes
  const getCardClasses = (index) => {
    if (index === 0) return "from-yellow-50 via-white to-yellow-50 border-yellow-300";
    if (index === 1) return "from-gray-50 via-white to-gray-50 border-gray-300";
    if (index === 2) return "from-orange-50 via-white to-orange-50 border-orange-300";
    return "from-gray-50 to-white border-gray-200";
  };

  // Helper function to render rank icon
  const getRankIcon = (index) => {
    if (index === 0) return <FaTrophy />;
    if (index < 3) return <FaMedal />;
    return `#${index + 1}`;
  };

  useEffect(() => {
    if (!telecallersLoading && telecallersData && telecallerPerformance) {
      // Map telecaller IDs to names and sort by conversion rate
      const enriched = telecallerPerformance
        .map((perf) => {
          const telecaller = telecallersData.find(
            (tc) =>
              String(tc._id) === String(perf.telecallerId) ||
              String(tc.userId) === String(perf.telecallerId)
          );
          return {
            ...perf,
            name: telecaller?.name || "Unknown Telecaller",
            email: telecaller?.email || "",
          };
        })
        .sort((a, b) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate));
      setTelecallersWithNames(enriched);
      setLoadingNames(false);
    }
  }, [telecallersData, telecallersLoading, telecallerPerformance]);

  if (loading || loadingNames) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center h-full">
        <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
      </div>
    );
  }

  if (!telecallersWithNames || telecallersWithNames.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <FaUserCircle className="text-5xl text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400">No telecaller data available</p>
        </div>
      </div>
    );
  }

  const topPerformer = telecallersWithNames[0];

  return (
    <>
      {/* Top Performer Card */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-xl shadow-lg p-6 border border-purple-200 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FaTrophy className="text-2xl text-yellow-500" />
            <h3 className="font-bold text-gray-800 text-lg">
              Top Performer
            </h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#6D28D9] transition-all shadow-md hover:shadow-lg text-sm"
          >
            <FaUsers className="text-sm" />
            View All ({telecallersWithNames.length})
          </button>
        </div>

        {/* Top Performer Details */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white rounded-xl p-6 shadow-md border border-purple-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FaUserCircle className="text-6xl text-[#7C3AED]" />
                  <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                    <FaMedal className="text-white text-sm" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-xl text-gray-800">
                    {topPerformer.name}
                  </div>
                  {topPerformer.email && (
                    <div className="text-sm text-gray-500">
                      {topPerformer.email}
                    </div>
                  )}
                  <div className="mt-1 inline-flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                    <FaTrophy className="text-xs" />
                    Best Conversion Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Rate Highlight */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 mb-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
              <div className="text-5xl font-bold text-[#7C3AED] mb-1">
                {topPerformer.conversionRate}%
              </div>
              <div className="flex items-center justify-center gap-1 text-green-600 text-sm font-semibold">
                <FaChartLine />
                Top Performance
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">
                  {topPerformer.totalAssigned}
                </div>
                <div className="text-xs text-gray-600 font-medium">Total Assigned</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {topPerformer.converted}
                </div>
                <div className="text-xs text-gray-600 font-medium">Converted</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 text-center border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700">
                  {topPerformer.contacted}
                </div>
                <div className="text-xs text-gray-600 font-medium">Contacted</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs bg-gray-50 rounded-lg p-3">
              <div>
                <span className="font-bold text-purple-600">{topPerformer.qualified}</span>
                <div className="text-gray-600">Qualified</div>
              </div>
              <div>
                <span className="font-bold text-blue-600">{topPerformer.new}</span>
                <div className="text-gray-600">New</div>
              </div>
              <div>
                <span className="font-bold text-red-600">{topPerformer.dropped}</span>
                <div className="text-gray-600">Dropped</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for All Telecallers */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close modal"
            className="fixed inset-0 z-50 w-full h-full cursor-default"
            style={{ 
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp pointer-events-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FaUsers className="text-3xl" />
                <div>
                  <h2 id="modal-title" className="text-2xl font-bold">All Telecallers Performance</h2>
                  <p className="text-purple-100 text-sm">
                    Comprehensive overview of {telecallersWithNames.length} telecaller(s)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all rounded-full p-2"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {telecallersWithNames.map((tc, index) => (
                  <div
                    key={tc.telecallerId}
                    className={`bg-gradient-to-r rounded-xl p-5 border-2 shadow-md hover:shadow-lg transition-all ${getCardClasses(index)}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md ${getRankBadgeClasses(index)}`}>
                            {getRankIcon(index)}
                          </div>
                        </div>

                        {/* Telecaller Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-lg text-gray-800">
                              {tc.name}
                            </div>
                            {index === 0 && (
                              <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                                TOP
                              </span>
                            )}
                          </div>
                          {tc.email && (
                            <div className="text-sm text-gray-500">{tc.email}</div>
                          )}
                        </div>
                      </div>

                      {/* Conversion Rate */}
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#7C3AED]">
                          {tc.conversionRate}%
                        </div>
                        <div className="text-xs text-gray-500">Conversion Rate</div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                        <div className="text-xl font-bold text-blue-700">
                          {tc.totalAssigned}
                        </div>
                        <div className="text-xs text-gray-600">Total Assigned</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                        <div className="text-xl font-bold text-green-700">
                          {tc.converted}
                        </div>
                        <div className="text-xs text-gray-600">Converted</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
                        <div className="text-xl font-bold text-yellow-700">
                          {tc.contacted}
                        </div>
                        <div className="text-xs text-gray-600">Contacted</div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white bg-opacity-60 rounded-lg p-3">
                      <div>
                        <span className="font-bold text-purple-600">{tc.qualified}</span>
                        <div className="text-gray-600">Qualified</div>
                      </div>
                      <div>
                        <span className="font-bold text-blue-600">{tc.new}</span>
                        <div className="text-gray-600">New</div>
                      </div>
                      <div>
                        <span className="font-bold text-red-600">{tc.dropped}</span>
                        <div className="text-gray-600">Dropped</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

TelecallerStatsCard.propTypes = {
  telecallerPerformance: PropTypes.arrayOf(
    PropTypes.shape({
      telecallerId: PropTypes.string.isRequired,
      totalAssigned: PropTypes.number.isRequired,
      converted: PropTypes.number.isRequired,
      contacted: PropTypes.number,
      qualified: PropTypes.number,
      new: PropTypes.number,
      dropped: PropTypes.number,
      conversionRate: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
};

TelecallerStatsCard.defaultProps = {
  telecallerPerformance: [],
  loading: false,
};

export default TelecallerStatsCard;
