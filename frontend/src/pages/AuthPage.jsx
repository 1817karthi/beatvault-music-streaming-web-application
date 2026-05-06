import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-slate-100">
      <form onSubmit={onSubmit} className="glass-panel w-full max-w-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-red-400">BeatVault</h1>
        <p className="mt-1 text-sm text-slate-400">
          {mode === "login" ? "Sign in to continue streaming." : "Create your account and start listening."}
        </p>

        <div className="mt-5 grid gap-3">
          {mode === "register" && (
            <input
              className="glass-input rounded-lg px-3 py-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className="glass-input rounded-lg px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="glass-input rounded-lg px-3 py-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

        <button
          className="mt-4 w-full rounded-lg bg-red-500/90 px-4 py-2 font-semibold text-white backdrop-blur-md disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <button
          type="button"
          className="mt-3 text-sm text-slate-300 underline"
          onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
        >
          {mode === "login" ? "New here? Create account" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
