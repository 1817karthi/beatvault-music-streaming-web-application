import axios from "axios";
import { apiBaseUrl } from "./apiOrigin";
import { getAuthToken } from "./tokenSync";

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    const value = token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`;
    if (typeof config.headers?.set === "function") {
      config.headers.set("Authorization", value);
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = value;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      // Optional: redirect to auth or reload to reflect logged out state
      // window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;
