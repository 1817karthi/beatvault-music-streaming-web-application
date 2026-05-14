import axios from "axios";
import { apiBaseUrl } from "./apiOrigin";

const api = axios.create({
  baseURL: apiBaseUrl,
});

export default api;
