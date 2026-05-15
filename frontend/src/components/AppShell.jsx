import { Outlet } from "react-router-dom";
import PlayerBar from "./PlayerBar";
import { useKeepAlive } from "../hooks/useKeepAlive";

function AppShell() {
  const { waking } = useKeepAlive();

  return (
    <div className="min-h-screen text-slate-100">
      {waking && (
        <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-center gap-2 bg-yellow-500/90 px-4 py-2 text-center text-sm font-semibold text-black backdrop-blur-md">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
          Backend is waking up — please wait a moment before playing songs…
        </div>
      )}
      <div className={`mx-auto max-w-7xl p-4 md:p-6 ${waking ? "pt-12" : ""}`}>
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Welcome to</p>
            <p className="text-sm font-semibold">BeatVault</p>
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
