import { useState, useEffect } from "react";
import {
  isSoundEnabled,
  setSoundEnabled,
  toggleSound,
  playHover,
  playClick,
  playNodeSelect,
  playSuccess,
} from "../utils/audio";

export default function useSound() {
  const [enabled, setEnabled] = useState(() => isSoundEnabled());

  useEffect(() => {
    const handleSoundChange = (e) => {
      setEnabled(e.detail.enabled);
    };
    window.addEventListener("svai_sound_change", handleSoundChange);
    return () => window.removeEventListener("svai_sound_change", handleSoundChange);
  }, []);

  return {
    enabled,
    toggle: toggleSound,
    setEnabled: setSoundEnabled,
    playHover,
    playClick,
    playNodeSelect,
    playSuccess,
  };
}
