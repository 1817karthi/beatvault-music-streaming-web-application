const express = require("express");
const {
  listPlaylists,
  createPlaylist,
  updatePlaylist,
  removePlaylist,
  togglePlaylistLike,
  addPlaylistComment,
} = require("../controllers/playlistController");

const router = express.Router();

router.get("/", listPlaylists);
router.post("/", createPlaylist);
router.put("/:id", updatePlaylist);
router.delete("/:id", removePlaylist);
router.put("/:id/like", togglePlaylistLike);
router.post("/:id/comments", addPlaylistComment);

module.exports = router;
