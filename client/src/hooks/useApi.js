import { useState, useEffect } from "react";
import axios from "axios";

// Simple service URL mapping
const SERVICE_URLS = {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL,
  call: import.meta.env.VITE_CALL_SERVICE_URL,
  lead: import.meta.env.VITE_LEAD_SERVICE_URL,
  media: import.meta.env.VITE_MEDIA_SERVICE_URL,
  telecaller: import.meta.env.VITE_TELECALLER_SERVICE_URL,
  user: import.meta.env.VITE_USER_SERVICE_URL,
  notification: import.meta.env.VITE_NOTIFICATION_SERVICE_URL,
  cloud: import.meta.env.VITE_CLOUD_SERVICE_URL,
};

// Simple hook for API requests
export const useApi = (serviceName, endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const makeRequest = async () => {
    try {
      setLoading(true);
      setError(null);

      const baseURL = SERVICE_URLS[serviceName];
      if (!baseURL) {
        throw new Error(`Unknown service: ${serviceName}`);
      }

      const token = localStorage.getItem("jwt_token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await axios({
        method: options.method || "GET",
        url: `${baseURL}${endpoint}`,
        data: options.data,
        params: options.params,
        headers,
        timeout: 10000,
      });

      setData(response.data);
    } catch (err) {
      console.error(`API Error (${serviceName}${endpoint}):`, err);

      let errorObj = {
        message: "An error occurred",
        isAccessDenied: false,
      };

      if (err.response) {
        const { status } = err.response;
        switch (status) {
          case 401:
            localStorage.removeItem("jwt_token");
            errorObj.message = "Session expired. Please login again.";
            break;
          case 403:
            errorObj.message =
              "Access denied. You don't have permission for this action.";
            errorObj.isAccessDenied = true;
            break;
          case 404:
            errorObj.message = "Resource not found.";
            break;
          case 500:
            errorObj.message = "Server error. Please try again later.";
            break;
          default:
            errorObj.message =
              err.response.data?.message || `Request failed (${status})`;
        }
      } else if (err.request) {
        errorObj.message = `Unable to connect to ${serviceName} service. Check your connection.`;
      } else {
        errorObj.message = err.message || "Unexpected error occurred";
      }

      setError(errorObj);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    makeRequest();
  }, [serviceName, endpoint, JSON.stringify(options)]);

  const refetch = () => makeRequest();

  return { data, loading, error, refetch };
};
