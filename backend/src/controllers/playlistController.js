const Playlist = require("../models/Playlist");

exports.listPlaylists = async (req, res) => {
  const playlists = await Playlist.find({ createdBy: req.user.id }).populate("tracks");
  res.json(playlists);
};

exports.createPlaylist = async (req, res) => {
  const playlist = await Playlist.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(playlist);
};

exports.updatePlaylist = async (req, res) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    req.body,
    { new: true }
  ).populate("tracks");

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  return res.json(playlist);
};

exports.removePlaylist = async (req, res) => {
  const deleted = await Playlist.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
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

  const index = playlist.likes.findIndex((id) => id.toString() === req.user.id);
  if (index >= 0) {
    playlist.likes.splice(index, 1);
  } else {
    playlist.likes.push(req.user.id);
  }

  await playlist.save();
  res.json(playlist);
};

exports.addPlaylistComment = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  playlist.comments.unshift({ user: req.user.id, text: req.body.text });
  await playlist.save();
  res.json(playlist);
};
