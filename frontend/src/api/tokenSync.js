/**
 * Synchronous token store for axios — localStorage alone is updated in React
 * useEffect after setState, so the next API call could run before persistence.
 */
let memoryToken = "";

function normalize(raw) {
  return String(raw ?? "")
    .trim()
    .replace(/^Bearer\s+/i, "");
}

export function getAuthToken() {
  const fromMem = normalize(memoryToken);
  if (fromMem) return fromMem;
  if (typeof localStorage === "undefined") return "";
  return normalize(localStorage.getItem("token"));
}

export function setAuthToken(raw) {
  memoryToken = normalize(raw);
  if (typeof localStorage === "undefined") return;
  if (memoryToken) localStorage.setItem("token", memoryToken);
  else localStorage.removeItem("token");
}
