import { useState } from "react";
import api from "../api/client";

function UploadPage() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [movieName, setMovieName] = useState("");
  const [audio, setAudio] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [message, setMessage] = useState("");

  const clearForm = () => {
    setTitle("");
    setArtist("");
    setAlbum("");
    setGenre("");
    setMovieName("");
    setAudio(null);
    setAudioUrl("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!audio) {
      setMessage("Please choose an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);
    formData.append("genre", genre);
    formData.append("movieName", movieName);
    formData.append("audio", audio);

    try {
      // Let axios set multipart boundary; manual Content-Type breaks uploads and can confuse proxies.
      await api.post("/tracks", formData);
      setMessage("Song uploaded successfully.");
      clearForm();
    } catch (error) {
      setMessage(error.response?.data?.message || "Upload failed.");
    }
  };

  const onSubmitByUrl = async (e) => {
    e.preventDefault();
    if (!audioUrl.trim()) {
      setMessage("Please enter a valid audio URL.");
      return;
    }

    try {
      await api.post("/tracks/url", { title, artist, album, genre, movieName, audioUrl: audioUrl.trim() });
      setMessage("Song URL added successfully.");
      clearForm();
    } catch (error) {
      setMessage(error.response?.data?.message || "URL upload failed.");
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Upload Music</h2>
      <p className="mb-4 text-sm text-slate-400">Upload from device or add a direct internet audio URL.</p>

      <div className="grid gap-4 xl:grid-cols-2">
        <form onSubmit={onSubmit} className="glass-panel grid gap-3 rounded-xl p-4">
          <h3 className="text-lg font-semibold">From Device</h3>
          <input className="glass-input rounded p-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song title" required />
          <input className="glass-input rounded p-2" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artist" required />
          <input className="glass-input rounded p-2" value={album} onChange={(e) => setAlbum(e.target.value)} placeholder="Album" />
          <input className="glass-input rounded p-2" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" />
          <input className="glass-input rounded p-2" value={movieName} onChange={(e) => setMovieName(e.target.value)} placeholder="Movie name" />
          <input className="glass-input rounded p-2" type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] || null)} required />
          <button className="rounded bg-red-500/90 p-2 font-semibold text-white backdrop-blur-md" type="submit">Upload</button>
        </form>

        <form onSubmit={onSubmitByUrl} className="glass-panel grid gap-3 rounded-xl p-4">
          <h3 className="text-lg font-semibold">From Internet URL</h3>
          <input className="glass-input rounded p-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song title" required />
          <input className="glass-input rounded p-2" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artist" required />
          <input className="glass-input rounded p-2" value={album} onChange={(e) => setAlbum(e.target.value)} placeholder="Album" />
          <input className="glass-input rounded p-2" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" />
          <input className="glass-input rounded p-2" value={movieName} onChange={(e) => setMovieName(e.target.value)} placeholder="Movie name" />
          <input className="glass-input rounded p-2" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="https://example.com/song.mp3" required />
          <button className="rounded bg-zinc-900/90 p-2 font-semibold text-red-300 backdrop-blur-md" type="submit">Add URL</button>
        </form>
      </div>

      {message && <p className="mt-4 text-sm text-red-300">{message}</p>}
    </div>
  );
}

export default UploadPage;
