import { useMemo, useState } from "react";
import api from "../api/client";

function TrackCard({ track, playlists, onAddToPlaylist, onPlay, refresh }) {
  const [comment, setComment] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const isLocalTrack = track.audioUrl?.startsWith("/audio/");

  const canSaveToPlaylist = useMemo(() => playlists.length > 0, [playlists]);

  const like = async () => {
    try {
      await api.put(`/tracks/${track._id}/like`);
      refresh();
    } catch (_error) {
      // keep UI responsive if request fails
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await api.post(`/tracks/${track._id}/comments`, { text: comment });
      setComment("");
      refresh();
    } catch (_error) {
      // keep UI responsive if request fails
    }
  };

  const addToPlaylist = async () => {
    if (!selectedPlaylistId) return;
    await onAddToPlaylist(track._id, selectedPlaylistId);
  };

  return (
    <div className="glass-panel rounded-xl p-4">
      <h3 className="font-semibold">{track.title}</h3>
      <p className="text-sm text-slate-300">{track.artist} | {track.genre || "Unknown"}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={onPlay} className="rounded bg-red-500/90 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">Play</button>
        <button onClick={like} className="rounded bg-zinc-900/90 px-3 py-1 text-sm font-medium text-red-300 backdrop-blur-md">Like ({track.likes?.length || 0})</button>
        {isLocalTrack && (
          <a href={`http://localhost:5000/api/download/${track.audioUrl.split("/").pop()}`} className="rounded bg-red-700/90 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">Download</a>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <select
          className="glass-input w-full rounded px-2 py-1 text-sm"
          value={selectedPlaylistId}
          onChange={(e) => setSelectedPlaylistId(e.target.value)}
          disabled={!canSaveToPlaylist}
        >
          <option value="">{canSaveToPlaylist ? "Add to playlist" : "Create a playlist first"}</option>
          {playlists.map((playlist) => (
            <option value={playlist._id} key={playlist._id}>{playlist.name}</option>
          ))}
        </select>
        <button type="button" onClick={addToPlaylist} className="rounded bg-red-600/90 px-3 text-sm font-semibold text-white backdrop-blur-md">Save</button>
      </div>

      <form onSubmit={addComment} className="mt-3 flex gap-2">
        <input value={comment} onChange={(e) => setComment(e.target.value)} className="glass-input w-full rounded px-2 py-1 text-sm" placeholder="Add comment" />
        <button type="submit" className="glass-input rounded px-3 text-sm">Post</button>
      </form>

      <p className="mt-2 text-xs text-slate-400">Comments: {track.comments?.length || 0}</p>
      <div className="mt-2 flex gap-3 text-xs text-slate-300">
        <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
      </div>
    </div>
  );
}

export default TrackCard;
