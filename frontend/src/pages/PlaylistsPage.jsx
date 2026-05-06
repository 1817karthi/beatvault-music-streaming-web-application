import { useEffect, useState } from "react";
import api from "../api/client";
import { usePlayer } from "../context/PlayerContext";

function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [commentMap, setCommentMap] = useState({});
  const { playTrackList } = usePlayer();

  const fetchPlaylists = async () => {
    const { data } = await api.get("/playlists");
    setPlaylists(data);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post("/playlists", { name, tracks: [] });
    setName("");
    setStatus("Playlist created.");
    fetchPlaylists();
  };

  const removeTrack = async (playlist, trackId) => {
    const updatedTracks = playlist.tracks
      .map((track) => (typeof track === "string" ? track : track._id))
      .filter((id) => id !== trackId);

    await api.put(`/playlists/${playlist._id}`, { tracks: updatedTracks });
    setStatus("Track removed from playlist.");
    fetchPlaylists();
  };

  const toggleLike = async (playlistId) => {
    await api.put(`/playlists/${playlistId}/like`);
    fetchPlaylists();
  };

  const addComment = async (playlistId) => {
    const text = commentMap[playlistId]?.trim();
    if (!text) return;
    await api.post(`/playlists/${playlistId}/comments`, { text });
    setCommentMap((prev) => ({ ...prev, [playlistId]: "" }));
    fetchPlaylists();
  };

  const playPlaylist = (playlist) => {
    const playableTracks = (playlist.tracks || []).filter(
      (track) => track && typeof track === "object" && track.audioUrl
    );

    if (playableTracks.length === 0) {
      setStatus("No playable songs in this playlist.");
      return;
    }

    playTrackList(playableTracks, 0);
    setStatus(`Playing ${playlist.name}.`);
  };

  const playSingleTrack = (playlist, trackId) => {
    const playableTracks = (playlist.tracks || []).filter(
      (track) => track && typeof track === "object" && track.audioUrl
    );
    const startIndex = playableTracks.findIndex((track) => track._id === trackId);

    if (startIndex < 0) {
      setStatus("Track is not playable.");
      return;
    }

    playTrackList(playableTracks, startIndex);
    setStatus(`Playing from ${playlist.name}.`);
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Your Playlists</h2>
      <form onSubmit={createPlaylist} className="mb-5 flex gap-2">
        <input className="glass-input w-full rounded-lg p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Create playlist" />
        <button className="rounded-lg bg-red-500/90 px-4 font-semibold text-white backdrop-blur-md" type="submit">Create</button>
      </form>

      {status && <p className="mb-4 text-sm text-red-300">{status}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {playlists.map((playlist) => (
          <div key={playlist._id} className="glass-panel rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-lg font-semibold">{playlist.name}</p>
                <p className="text-xs text-slate-400">{playlist.tracks?.length || 0} tracks</p>
              </div>
              <button
                type="button"
                className="rounded bg-red-600/90 px-3 py-1 text-xs font-semibold text-white"
                onClick={() => toggleLike(playlist._id)}
              >
                Like ({playlist.likes?.length || 0})
              </button>
            </div>
            <button
              type="button"
              className="mb-2 rounded bg-red-500/90 px-3 py-1 text-xs font-semibold text-white"
              onClick={() => playPlaylist(playlist)}
            >
              Play Playlist
            </button>
            <div className="mt-3 grid gap-2">
              {(playlist.tracks || []).map((track) => (
                <div key={track._id} className="glass-input flex items-center justify-between rounded-lg p-2">
                  <div>
                    <p className="text-sm font-medium">{track.title}</p>
                    <p className="text-xs text-slate-400">{track.artist}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded bg-red-500/90 px-2 py-1 text-xs font-semibold text-white"
                      onClick={() => playSingleTrack(playlist, track._id)}
                    >
                      Play
                    </button>
                    <button
                      type="button"
                      className="rounded bg-rose-500/80 px-2 py-1 text-xs font-semibold backdrop-blur-md"
                      onClick={() => removeTrack(playlist, track._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                className="glass-input w-full rounded px-2 py-1 text-sm"
                placeholder="Comment on playlist"
                value={commentMap[playlist._id] || ""}
                onChange={(e) => setCommentMap((prev) => ({ ...prev, [playlist._id]: e.target.value }))}
              />
              <button
                type="button"
                className="rounded bg-red-500/90 px-3 py-1 text-sm font-semibold text-white"
                onClick={() => addComment(playlist._id)}
              >
                Post
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">Comments: {playlist.comments?.length || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistsPage;
