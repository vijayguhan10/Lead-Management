import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LEAD_SERVICE_URL =
  import.meta.env.VITE_LEAD_SERVICE_URL || "http://localhost:3003";

/**
 * Custom hook to fetch telecaller dashboard analytics
 * @param {string} telecallerId - The ID of the telecaller
 * @returns {Object} { dashboardData, loading, error, refetch }
 */
export const useTelecallerDashboardData = (telecallerId) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!telecallerId) {
      setError(new Error("Telecaller ID is required"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${LEAD_SERVICE_URL}/leads/telecaller/dashboard/${telecallerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      setDashboardData(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load telecaller dashboard";
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [telecallerId]);

  const refetch = () => {
    fetchDashboardData();
  };

  return { dashboardData, loading, error, refetch };
};
