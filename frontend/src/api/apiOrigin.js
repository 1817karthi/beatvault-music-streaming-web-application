/** Backend origin (no trailing slash). Local dev: http://localhost:5000. Production: set VITE_API_ORIGIN in the host build env (e.g. Netlify). */
const devOrigin = "http://localhost:5000";
const defaultProdOrigin = "https://beatvault-music-streaming-web-application.onrender.com";

export const apiOrigin = (
  import.meta.env.VITE_API_ORIGIN?.trim() ||
  (import.meta.env.DEV ? devOrigin : defaultProdOrigin)
).replace(/\/$/, "");

export const apiBaseUrl = `${apiOrigin}/api`;
