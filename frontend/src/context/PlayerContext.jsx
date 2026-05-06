import { createContext, useContext, useMemo, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [volume, setVolume] = useState(0.7);

  const currentTrack = queue[currentIndex] || null;

  const playTrackList = (tracks, startIndex = 0) => {
    setQueue(tracks);
    setCurrentIndex(startIndex);
  };

  const next = () => {
    if (queue.length === 0) return;
    if (shuffleEnabled && queue.length > 1) {
      let randomIndex = currentIndex;
      while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * queue.length);
      }
      setCurrentIndex(randomIndex);
      return;
    }
    setCurrentIndex((prev) => (prev + 1) % queue.length);
  };

  const previous = () => {
    if (queue.length === 0) return;
    if (shuffleEnabled && queue.length > 1) {
      let randomIndex = currentIndex;
      while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * queue.length);
      }
      setCurrentIndex(randomIndex);
      return;
    }
    setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length);
  };

  const toggleShuffle = () => setShuffleEnabled((prev) => !prev);

  const cycleRepeatMode = () => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  };

  const onTrackEnd = () => {
    if (repeatMode === "one") {
      setCurrentIndex((prev) => prev);
      return;
    }

    if (repeatMode === "all" || shuffleEnabled || currentIndex < queue.length - 1) {
      next();
    }
  };

  const value = useMemo(
    () => ({
      currentTrack,
      queue,
      currentIndex,
      shuffleEnabled,
      repeatMode,
      volume,
      playTrackList,
      next,
      previous,
      toggleShuffle,
      cycleRepeatMode,
      onTrackEnd,
      setVolume,
    }),
    [currentTrack, queue, currentIndex, shuffleEnabled, repeatMode, volume]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  return useContext(PlayerContext);
}
