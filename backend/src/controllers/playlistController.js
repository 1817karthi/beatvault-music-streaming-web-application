const Playlist = require("../models/Playlist");

exports.listPlaylists = async (req, res) => {
  const playlists = await Playlist.find().populate("tracks");
  res.json(playlists);
};

exports.createPlaylist = async (req, res) => {
  const playlist = await Playlist.create(req.body);
  res.status(201).json(playlist);
};

exports.updatePlaylist = async (req, res) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  ).populate("tracks");

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  return res.json(playlist);
};

exports.removePlaylist = async (req, res) => {
  const deleted = await Playlist.findOneAndDelete({ _id: req.params.id });
  if (!deleted) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  return res.json({ message: "Playlist deleted" });
};

exports.togglePlaylistLike = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  playlist.likes += 1;

  await playlist.save();
  res.json(playlist);
};

exports.addPlaylistComment = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  playlist.comments.unshift({ author: req.body.author || "Anonymous", text: req.body.text });
  await playlist.save();
  res.json(playlist);
};
