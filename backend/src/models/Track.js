const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: String,
    movieName: String,
    genre: String,
    coverUrl: String,
    audioUrl: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [
      {
        author: { type: String, default: "Anonymous" },
        text: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Track", trackSchema);
