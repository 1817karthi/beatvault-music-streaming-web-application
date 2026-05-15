const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const trackRoutes = require("./routes/trackRoutes");
const playlistRoutes = require("./routes/playlistRoutes");

dotenv.config();

const app = express();
connectDb();

// Public app — accept requests from any origin (no auth, no sensitive data).
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/audio", express.static(path.join(__dirname, "../public/audio")));

app.get("/api", (_req, res) => {
  res.json({ message: "Music streaming API running" });
});

app.get("/api/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../public/audio", req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  return res.download(filePath);
});

app.use("/api/tracks", trackRoutes);
app.use("/api/playlists", playlistRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
