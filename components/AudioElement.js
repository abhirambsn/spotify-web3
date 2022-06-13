import React, { useContext } from "react";
import { SpotifyContext } from "../context/SpotifyContext";

const AudioElement = () => {
  const { updateVolume, updateProgress } = useContext(SpotifyContext);
  return (
    <audio
      id="audio-element"
      hidden
      playsInline
      onVolumeChange={(e) => updateVolume(e)}
      onTimeUpdate={(e) => updateProgress(e)}
    />
  );
};

export default AudioElement;
