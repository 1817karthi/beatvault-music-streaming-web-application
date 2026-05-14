import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { setAuthToken } from "../api/tokenSync";

const AuthContext = createContext(null);

function normalizeStoredToken(raw) {
  return String(raw ?? "")
    .trim()
    .replace(/^Bearer\s+/i, "");
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const initial = typeof localStorage !== "undefined" ? localStorage.getItem("token") : "";
    const normalized = normalizeStoredToken(initial);
    setAuthToken(normalized);
    return normalized;
  });
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const raw = normalizeStoredToken(data.token);
    setAuthToken(raw);
    setToken(raw);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    const raw = normalizeStoredToken(data.token);
    setAuthToken(raw);
    setToken(raw);
    setUser(data.user);
  };

  const logout = () => {
    setAuthToken("");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, register, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
