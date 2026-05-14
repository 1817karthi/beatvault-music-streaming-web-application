import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../api/client";

function HomePage() {
  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();

  const goToDiscover = () => {
    const query = search.trim();
    navigate(query ? `/discover?q=${encodeURIComponent(query)}` : "/discover");
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadError("");
        const { data } = await api.get("/tracks/recommendations");
        setFeatured(data || []);
      } catch (error) {
        setFeatured([]);
        setLoadError(
          error.response?.data?.message ||
            error.message ||
            "Could not reach the API. For local dev, run the backend on port 5000; for Netlify, set VITE_API_ORIGIN."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const topGenres = useMemo(
    () => [...new Set(featured.map((track) => track.genre).filter(Boolean))].slice(0, 6),
    [featured]
  );

  return (
    <div className="min-h-[60vh]">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-red-300">BeatVault</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/discover" className="glass-input rounded-lg px-3 py-2 text-sm">Discover</Link>
          <Link to="/playlists" className="glass-input rounded-lg px-3 py-2 text-sm">Playlist</Link>
          <Link to="/upload" className="glass-input rounded-lg px-3 py-2 text-sm">Upload</Link>
          <div className="glass-input flex items-center rounded-lg px-2 py-1">
            <input
              className="w-40 bg-transparent px-2 py-1 text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search songs"
            />
            <button
              type="button"
              className="rounded bg-red-500/90 px-2 py-1 text-sm text-white"
              onClick={goToDiscover}
              aria-label="Search"
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      <section className="glass-panel rounded-2xl bg-gradient-to-r from-red-800/30 to-black/40 p-6">
        <p className="text-xs uppercase tracking-widest text-red-300">Home</p>
        <h2 className="mt-2 text-3xl font-bold">Welcome to your music space</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Explore trending songs, browse by genre, build playlists, and upload your own tracks.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/discover" className="rounded bg-red-500/90 px-4 py-2 text-sm font-semibold text-white">Start Discovering</Link>
          <Link to="/upload" className="glass-input rounded px-4 py-2 text-sm">Upload New Song</Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="glass-panel rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Tracks Available</p>
          <p className="mt-2 text-3xl font-bold text-red-300">{featured.length}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Top Genres</p>
          <p className="mt-2 text-3xl font-bold text-red-300">{topGenres.length}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Your Hub</p>
          <p className="mt-2 text-sm text-slate-300">Discover, Playlist, Upload in one place</p>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-red-200">Featured Tracks</h3>
          <Link to="/discover" className="text-sm text-red-300 underline">See all</Link>
        </div>

        {loadError && (
          <p className="glass-panel mb-3 rounded-xl p-3 text-sm text-amber-200">{loadError}</p>
        )}

        {loading ? (
          <p className="text-sm text-slate-300">Loading featured tracks...</p>
        ) : featured.length === 0 ? (
          <p className="glass-panel rounded-xl p-4 text-sm text-slate-300">
            No songs yet. Add demo songs from Discover page or upload a new track.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {featured.slice(0, 8).map((track) => (
              <div key={track._id} className="glass-panel rounded-xl p-3">
                <p className="truncate font-semibold">{track.title}</p>
                <p className="truncate text-sm text-slate-400">{track.artist}</p>
                <p className="mt-2 inline-block rounded bg-red-950/60 px-2 py-1 text-xs text-red-300">
                  {track.genre || "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {topGenres.length > 0 && (
        <section className="mt-6">
          <h3 className="mb-3 text-xl font-semibold text-red-200">Browse By Genre</h3>
          <div className="flex flex-wrap gap-2">
            {topGenres.map((genre) => (
              <button
                key={genre}
                type="button"
                className="glass-input rounded-full px-4 py-2 text-sm"
                onClick={() => navigate(`/discover?q=&genre=${encodeURIComponent(genre)}`)}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
