/** Backend origin (no path). Override on Render: VITE_API_ORIGIN=https://your-api.onrender.com */
export const apiOrigin = (import.meta.env.VITE_API_ORIGIN || "http://localhost:5000").replace(/\/$/, "");
export const apiBaseUrl = `${apiOrigin}/api`;
