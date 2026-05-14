/** Backend origin (no path). Netlify/CI: set VITE_API_ORIGIN. Local dev uses localhost unless overridden. */
const productionApiOrigin = "https://beatvault-music-streaming-web-application.onrender.com";
export const apiOrigin = (
  import.meta.env.VITE_API_ORIGIN ||
  (import.meta.env.DEV ? "http://localhost:5000" : productionApiOrigin)
).replace(/\/$/, "");
export const apiBaseUrl = `${apiOrigin}/api`;