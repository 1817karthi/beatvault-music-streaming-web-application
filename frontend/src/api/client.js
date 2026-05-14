import axios from "axios";
import { apiBaseUrl } from "./apiOrigin";

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("token");
  const token = raw?.trim();
  if (token) {
    const value = token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`;
    config.headers.set("Authorization", value);
  }

  return config;
});

export default api;
