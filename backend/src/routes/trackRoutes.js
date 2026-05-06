const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
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
router.post("/url", auth, uploadTrackByUrl);
router.post("/", auth, upload.single("audio"), uploadTrack);
router.put("/:id/like", auth, toggleLike);
router.post("/:id/comments", auth, addComment);

module.exports = router;
