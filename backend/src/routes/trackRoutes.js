const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  listTracks,
  getRecommendations,
  toggleLike,
  addComment,
  uploadTrack,
  uploadTrackByUrl,
  seedDemoTracks,
} = require("../controllers/trackController");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/audio"),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });
const router = express.Router();

router.get("/", listTracks);
router.get("/recommendations", getRecommendations);
router.post("/seed-demo", seedDemoTracks);
router.post("/url", uploadTrackByUrl);
router.post("/", upload.single("audio"), uploadTrack);
router.put("/:id/like", toggleLike);
router.post("/:id/comments", addComment);

module.exports = router;
