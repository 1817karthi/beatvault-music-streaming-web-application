const Track = require("../models/Track");

exports.listTracks = async (req, res) => {
  const { q = "", genre = "" } = req.query;
  const regex = new RegExp(q, "i");

  const query = {
    $and: [
      genre ? { genre: new RegExp(genre, "i") } : {},
      {
        $or: [
          { title: regex },
          { artist: regex },
          { album: regex },
          { movieName: regex },
        ],
      },
    ],
  };

  const tracks = await Track.find(query).sort({ createdAt: -1 });
  res.json(tracks);
};

exports.getRecommendations = async (req, res) => {
  const tracks = await Track.find().sort({ likes: -1, createdAt: -1 }).limit(12);
  return res.json(tracks);
};

exports.toggleLike = async (req, res) => {
  const track = await Track.findById(req.params.id);
  if (!track) {
    return res.status(404).json({ message: "Track not found" });
  }

  track.likes += 1;

  await track.save();
  return res.json(track);
};

exports.addComment = async (req, res) => {
  const track = await Track.findById(req.params.id);
  if (!track) {
    return res.status(404).json({ message: "Track not found" });
  }

  track.comments.unshift({ author: req.body.author || "Anonymous", text: req.body.text });
  await track.save();
  return res.json(track);
};

exports.uploadTrack = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "Audio file is required" });
  }

  const track = await Track.create({
    ...req.body,
    audioUrl: `/audio/${file.filename}`,
  });

  return res.status(201).json(track);
};

exports.uploadTrackByUrl = async (req, res) => {
  const { title, artist, album, genre, movieName, audioUrl } = req.body;
  if (!audioUrl) {
    return res.status(400).json({ message: "Audio URL is required" });
  }

  if (!/^https?:\/\/.+/i.test(audioUrl)) {
    return res.status(400).json({ message: "Audio URL must start with http:// or https://" });
  }

  const track = await Track.create({
    title,
    artist,
    album,
    genre,
    movieName,
    audioUrl,
  });

  return res.status(201).json(track);
};

exports.seedDemoTracks = async (_req, res) => {
  const count = await Track.countDocuments();
  if (count > 0) {
    return res.status(400).json({ message: "Tracks already exist. Seeding skipped." });
  }

  const demoTracks = [
    {
      title: "Demo Chill 1",
      artist: "SoundHelix",
      album: "Demo Album",
      genre: "Chill",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      title: "Demo Ambient 2",
      artist: "SoundHelix",
      album: "Demo Album",
      genre: "Ambient",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      title: "Demo Pop 3",
      artist: "SoundHelix",
      album: "Demo Album",
      genre: "Pop",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
  ];

  const created = await Track.insertMany(demoTracks);
  return res.status(201).json(created);
};
