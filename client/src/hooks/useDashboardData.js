import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { toast } from "react-toastify";

/**
 * Custom hook to fetch and manage dashboard analytics data
 */
export const useDashboardData = (organizationId) => {
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalLeads: 0,
      assignedLeads: 0,
      convertedLeads: 0,
      conversionRate: "0.00",
      unassignedLeads: 0,
    },
    monthlyConversions: [],
    telecallerPerformance: [],
    sourceConversions: [],
  });

  const {
    data,
    loading,
    error,
    refetch,
  } = useApi(
    "lead",
    organizationId ? `/leads/dashboard/analytics/${organizationId}` : null,
    { manual: !organizationId }
  );

  useEffect(() => {
    if (data) {
      setDashboardData(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error("Dashboard data fetch error:", error);
      toast.error(
        error.message || "Failed to load dashboard data. Please try again."
      );
    }
  }, [error]);

  return {
    dashboardData,
    loading,
    error,
    refetch,
  };
};
