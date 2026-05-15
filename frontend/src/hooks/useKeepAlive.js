import { useEffect, useState } from "react";
import { apiBaseUrl } from "../api/apiOrigin";

const PING_INTERVAL_MS = 10 * 60 * 1000; // every 10 minutes

/**
 * Keeps the Render free-tier backend alive by pinging /api every 10 minutes.
 * Also detects cold-start on first load so the UI can show a "waking up" banner.
 *
 * Returns: { backendReady: boolean, waking: boolean }
 */
export function useKeepAlive() {
  const [backendReady, setBackendReady] = useState(false);
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    let intervalId = null;

    async function ping() {
      try {
        const controller = new AbortController();
        // Allow up to 60 s for a cold-start wake-up
        const timeoutId = setTimeout(() => controller.abort(), 60_000);
        const res = await fetch(`${apiBaseUrl}/`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          setBackendReady(true);
          setWaking(false);
        }
      } catch {
        // Ignore — server still waking or network issue
      }
    }

    async function initialCheck() {
      try {
        // Quick 3-second probe first
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3_000);
        const res = await fetch(`${apiBaseUrl}/`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          setBackendReady(true);
          return;
        }
      } catch {
        // Backend is sleeping — show waking banner and wait
        setWaking(true);
      }
      // Full wake-up attempt
      await ping();
    }

    initialCheck();
    intervalId = setInterval(ping, PING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return { backendReady, waking };
}
