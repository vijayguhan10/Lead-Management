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

  const makeRequest = async (overrides = {}) => {
    try {
      setLoading(true);
      setError(null);

      const baseURL = SERVICE_URLS[serviceName];
      if (!baseURL) {
        throw new Error(`Unknown service: ${serviceName}`);
      }

      const mergedHeaders = {
        "Content-Type": "application/json",
        ...(localStorage.getItem("jwt_token") && {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        }),
        ...options.headers,
        ...(overrides.headers || {}),
      };

      const resolvedMethod = overrides.method || options.method || "GET";
      const resolvedData =
        overrides.data !== undefined ? overrides.data : options.data;
      const resolvedParams =
        overrides.params !== undefined ? overrides.params : options.params;
      const resolvedTimeout = overrides.timeout || options.timeout || 10000;
      const resolvedEndpoint =
        overrides.endpoint !== undefined ? overrides.endpoint : endpoint;

      const response = await axios({
        method: resolvedMethod,
        url: `${baseURL}${resolvedEndpoint}`,
        data: resolvedData,
        params: resolvedParams,
        headers: mergedHeaders,
        timeout: resolvedTimeout,
      });

      setData(response.data);
      return response.data;
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
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options.manual) {
      // call and swallow errors here; makeRequest sets `error` state and throws for
      // imperative callers, but we don't want unhandled rejections for the auto-fetch
      makeRequest().catch(() => {});
    }
  }, [serviceName, endpoint, JSON.stringify(options)]);

  const refetch = (overrides = {}) => makeRequest(overrides);

  const execute = async (overrides = {}) => {
    return await makeRequest(overrides);
  };

  return { data, loading, error, refetch, execute };
};
