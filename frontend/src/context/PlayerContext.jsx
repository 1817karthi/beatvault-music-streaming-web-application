import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [volume, setVolume] = useState(0.7);
  // Used to force the audio element to reload when repeat-one triggers
  const [replayKey, setReplayKey] = useState(0);

  // Keep latest values accessible inside callbacks without re-creating them
  const queueRef = useRef(queue);
  const currentIndexRef = useRef(currentIndex);
  const shuffleRef = useRef(shuffleEnabled);
  const repeatRef = useRef(repeatMode);
  queueRef.current = queue;
  currentIndexRef.current = currentIndex;
  shuffleRef.current = shuffleEnabled;
  repeatRef.current = repeatMode;

  const currentTrack = queue[currentIndex] || null;

  const playTrackList = useCallback((tracks, startIndex = 0) => {
    setQueue(tracks);
    setCurrentIndex(startIndex);
    setReplayKey((k) => k + 1);
  }, []);

  const next = useCallback(() => {
    const q = queueRef.current;
    const idx = currentIndexRef.current;
    if (q.length === 0) return;
    if (shuffleRef.current && q.length > 1) {
      let randomIndex = idx;
      while (randomIndex === idx) {
        randomIndex = Math.floor(Math.random() * q.length);
      }
      setCurrentIndex(randomIndex);
      setReplayKey((k) => k + 1);
      return;
    }
    setCurrentIndex((prev) => (prev + 1) % q.length);
    setReplayKey((k) => k + 1);
  }, []);

  const previous = useCallback(() => {
    const q = queueRef.current;
    const idx = currentIndexRef.current;
    if (q.length === 0) return;
    if (shuffleRef.current && q.length > 1) {
      let randomIndex = idx;
      while (randomIndex === idx) {
        randomIndex = Math.floor(Math.random() * q.length);
      }
      setCurrentIndex(randomIndex);
      setReplayKey((k) => k + 1);
      return;
    }
    setCurrentIndex((prev) => (prev - 1 + q.length) % q.length);
    setReplayKey((k) => k + 1);
  }, []);

  const toggleShuffle = useCallback(() => setShuffleEnabled((prev) => !prev), []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  const onTrackEnd = useCallback(() => {
    const repeat = repeatRef.current;
    const q = queueRef.current;
    const idx = currentIndexRef.current;

    if (repeat === "one") {
      // Bump replayKey so the audio element gets a new `key` prop and reloads
      setReplayKey((k) => k + 1);
      return;
    }

    if (repeat === "all" || shuffleRef.current || idx < q.length - 1) {
      next();
    }
    // If repeat is "off" and we're on the last track, just stop (do nothing)
  }, [next]);

  const value = useMemo(
    () => ({
      currentTrack,
      queue,
      currentIndex,
      shuffleEnabled,
      repeatMode,
      volume,
      replayKey,
      playTrackList,
      next,
      previous,
      toggleShuffle,
      cycleRepeatMode,
      onTrackEnd,
      setVolume,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTrack, queue, currentIndex, shuffleEnabled, repeatMode, volume, replayKey]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  return useContext(PlayerContext);
}
