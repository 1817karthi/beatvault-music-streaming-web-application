/** Backend origin (no path). Override on Render: VITE_API_ORIGIN=https://your-api.onrender.com */
export const apiOrigin = (import.meta.env.VITE_API_ORIGIN ||  "https://beatvault-music-streaming-web-application.onrender.com").replace(/\/$/, "");
export const apiBaseUrl = `${apiOrigin}/api`;

//http://localhost:5000