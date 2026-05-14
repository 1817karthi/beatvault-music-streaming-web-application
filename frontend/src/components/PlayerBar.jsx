import { useEffect, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { usePlayer } from "../context/PlayerContext";
import { apiOrigin } from "../api/apiOrigin";

function PlayerBar() {
  const {
    currentTrack,
    next,
    previous,
    shuffleEnabled,
    repeatMode,
    toggleShuffle,
    cycleRepeatMode,
    onTrackEnd,
    volume,
    setVolume,
  } = usePlayer();
  const playerRef = useRef(null);
  const source = currentTrack?.audioUrl?.startsWith("http")
    ? currentTrack.audioUrl
    : `${apiOrigin}${currentTrack?.audioUrl || ""}`;

  useEffect(() => {
    const audio = playerRef.current?.audio?.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume, currentTrack]);
  const volumeControl = (
    <div className="glass-panel fixed right-3 top-1/2 z-30 -translate-y-1/2 rounded-full px-2 py-3">
      <div className="mb-2 text-center text-[10px] text-slate-300">VOL</div>
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(volume * 100)}
        onChange={(e) => setVolume(Number(e.target.value) / 100)}
        className="h-24 w-2 cursor-pointer appearance-none rounded-lg bg-zinc-800 [writing-mode:bt-lr] md:h-28"
        style={{ WebkitAppearance: "slider-vertical" }}
      />
    </div>
  );

  if (!currentTrack) {
    return (
      <>
        <div className="glass-panel fixed bottom-0 left-2 right-2 z-20 rounded-xl p-3 text-center">
          Select a track to play
        </div>
        {volumeControl}
      </>
    );
  }

  return (
    <>
      <div className="glass-panel fixed bottom-2 left-2 right-2 z-20 rounded-xl p-2">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-2">
          <p className="text-sm text-slate-200">Now Playing: {currentTrack.title} - {currentTrack.artist}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleShuffle}
              className={`rounded px-2 py-1 text-xs ${shuffleEnabled ? "bg-red-500/90 text-white" : "glass-input"}`}
            >
              Shuffle {shuffleEnabled ? "On" : "Off"}
            </button>
            <button type="button" onClick={cycleRepeatMode} className="glass-input rounded px-2 py-1 text-xs">
              Repeat {repeatMode.toUpperCase()}
            </button>
          </div>
        </div>
        <AudioPlayer
          ref={playerRef}
          src={source}
          volume={volume}
          onLoadedMetadata={() => {
            const audio = playerRef.current?.audio?.current;
            if (audio) {
              audio.volume = volume;
            }
          }}
          onClickNext={next}
          onClickPrevious={previous}
          onEnded={onTrackEnd}
          loop={repeatMode === "one"}
          customVolumeControls={[]}
          showSkipControls
          showJumpControls={false}
          autoPlayAfterSrcChange
        />
      </div>
      {volumeControl}
    </>
  );
}

export default PlayerBar;
