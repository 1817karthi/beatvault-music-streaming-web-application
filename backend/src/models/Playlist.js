const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
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

module.exports = mongoose.model("Playlist", playlistSchema);
