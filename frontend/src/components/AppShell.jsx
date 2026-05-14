import { Outlet } from "react-router-dom";
import PlayerBar from "./PlayerBar";

function AppShell() {
  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Welcome to</p>
            <p className="text-sm font-semibold">BeatVault</p>
          </div>
          <div>
            {typeof localStorage !== "undefined" && localStorage.getItem("token") ? (
              <button
                className="text-xs text-red-300 underline"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/auth";
                }}
              >
                Logout
              </button>
            ) : (
              <a href="/auth" className="text-xs text-red-300 underline">Login</a>
            )}
          </div>
        </header>
        <main className="glass-panel rounded-2xl p-4 pb-44 md:p-6 md:pb-44">
          <Outlet />
        </main>
      </div>
      <PlayerBar />
    </div>
  );
}

export default AppShell;
