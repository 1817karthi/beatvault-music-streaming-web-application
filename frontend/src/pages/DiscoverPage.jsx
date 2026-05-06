import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import TrackCard from "../components/TrackCard";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";

function DiscoverPage() {
  const [tracks, setTracks] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { playTrackList } = usePlayer();
  const { isAuthenticated } = useAuth();

  const fetchTracks = async (searchValue = search, genreValue = genre) => {
    setLoading(true);
    const { data } = await api.get(
      `/tracks?q=${encodeURIComponent(searchValue)}&genre=${encodeURIComponent(genreValue)}`
    );
    setTracks(data);
    setLoading(false);
  };

  const fetchTracksByGenre = async (selectedGenre) => {
    setGenre(selectedGenre);
    await fetchTracks(search, selectedGenre);
  };

  const fetchRecommendations = async () => {
    const { data } = await api.get("/tracks/recommendations");
    setRecommended(data);
  };

  const fetchPlaylists = async () => {
    if (!isAuthenticated) return;
    const { data } = await api.get("/playlists");
    setPlaylists(data);
  };

  const addDemoSongs = async () => {
    try {
      await api.post("/tracks/seed-demo");
      setStatus("Demo songs added.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Unable to add demo songs.");
    }
    fetchTracks();
    fetchRecommendations();
  };

  const addTrackToPlaylist = async (trackId, playlistId) => {
    const playlist = playlists.find((item) => item._id === playlistId);
    if (!playlist) return;
    const existingIds = (playlist.tracks || []).map((track) => (typeof track === "string" ? track : track._id));
    if (existingIds.includes(trackId)) {
      setStatus("Track already exists in this playlist.");
      return;
    }

    await api.put(`/playlists/${playlistId}`, { tracks: [...existingIds, trackId] });
    setStatus(`Added to ${playlist.name}.`);
    fetchPlaylists();
  };

  useEffect(() => {
    const queryFromHome = searchParams.get("q") || "";
    const genreFromHome = searchParams.get("genre") || "";
    if (queryFromHome || genreFromHome) {
      setSearch(queryFromHome);
      setGenre(genreFromHome);
      fetchTracks(queryFromHome, genreFromHome);
    } else {
      fetchTracks();
    }
    fetchRecommendations();
    fetchPlaylists();
  }, []);

  const trending = useMemo(() => recommended.slice(0, 5), [recommended]);
  const genres = useMemo(
    () => [...new Set(recommended.map((track) => track.genre).filter(Boolean))].slice(0, 6),
    [recommended]
  );

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-red-300">Discover</h1>

      <div className="mb-5 grid gap-2 md:grid-cols-4">
        <input className="glass-input rounded-lg p-2" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search song, artist, album, movie" />
        <input className="glass-input rounded-lg p-2" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" />
        <button className="rounded-lg bg-red-500/90 p-2 font-semibold text-white backdrop-blur-md" onClick={() => fetchTracks()}>Search</button>
        <button className="rounded-lg bg-zinc-900/90 p-2 font-semibold text-red-300 backdrop-blur-md" onClick={addDemoSongs}>Add Demo Songs</button>
      </div>

      {status && <p className="mb-4 text-sm text-red-300">{status}</p>}

      {genres.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {genres.map((item) => (
            <button
              type="button"
              key={item}
              className="glass-input rounded-full px-3 py-1 text-xs"
              onClick={() => fetchTracksByGenre(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {trending.length > 0 && (
        <section className="glass-panel mb-6 rounded-xl p-4">
          <h2 className="mb-3 text-lg font-semibold text-red-200">Trending Right Now</h2>
          <div className="grid gap-2 md:grid-cols-5">
            {trending.map((track, idx) => (
              <button
                key={track._id}
                type="button"
                onClick={() => playTrackList(recommended, idx)}
                className="glass-input rounded-lg p-3 text-left hover:bg-slate-700/50"
              >
                <p className="truncate text-sm font-semibold">{track.title}</p>
                <p className="truncate text-xs text-slate-400">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <p className="text-sm text-slate-300">Loading music...</p>
      ) : tracks.length === 0 ? (
        <p className="glass-panel rounded-xl p-4 text-sm text-slate-300">No tracks found. Try another search or add demo songs.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tracks.map((track, idx) => (
            <TrackCard
              key={track._id}
              track={track}
              playlists={playlists}
              onAddToPlaylist={addTrackToPlaylist}
              onPlay={() => playTrackList(tracks, idx)}
              refresh={() => fetchTracks()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DiscoverPage;
