import { useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const VoiceSettingsContext = createContext<{
  voiceInputDevice: string;
  setVoiceInputDevice: (device: string) => void;
  voiceInputVolume: number;
  setVoiceInputVolume: (volume: number) => void;
  voiceOutputDevice: string;
  setVoiceOutputDevice: (device: string) => void;
  voiceOutputVolume: number;
  setVoiceOutputVolume: (volume: number) => void;
}>({
  voiceInputDevice: "",
  setVoiceInputDevice: () => {},
  voiceInputVolume: 0,
  setVoiceInputVolume: () => {},
  voiceOutputDevice: "",
  setVoiceOutputDevice: () => {},
  voiceOutputVolume: 0,
  setVoiceOutputVolume: () => {}
});

const VoiceSettingsProvider = ({ children }) => {
  let { getFromLocalStorage, setToLocalStorage } = useLocalStorage();
  const [voiceInputDevice, setVoiceInputDevice] = useState<string>(getFromLocalStorage("voiceInputDevice") || "");
  const [voiceInputVolume, setVoiceInputVolume] = useState<number>(getFromLocalStorage("voiceInputVolume") || 50);
  const [voiceOutputDevice, setVoiceOutputDevice] = useState<string>(getFromLocalStorage("voiceOutputDevice") || "");
  const [voiceOutputVolume, setVoiceOutputVolume] = useState<number>(getFromLocalStorage("voiceOutputVolume") || 50);

  function saveAllToLocalStorage() {
    setToLocalStorage("voiceInputDevice", voiceInputDevice);
    setToLocalStorage("voiceInputVolume", voiceInputVolume);
    setToLocalStorage("voiceOutputDevice", voiceOutputDevice);
    setToLocalStorage("voiceOutputVolume", voiceOutputVolume);
  }

  useEffect(() => {
    saveAllToLocalStorage();
  }, [voiceInputDevice, voiceInputVolume, voiceOutputDevice, voiceOutputVolume]);

  return (
    <VoiceSettingsContext.Provider
      value={{
        voiceInputDevice,
        setVoiceInputDevice,
        voiceInputVolume,
        setVoiceInputVolume,
        voiceOutputDevice,
        setVoiceOutputDevice,
        voiceOutputVolume,
        setVoiceOutputVolume
      }}
    >
      {children}
    </VoiceSettingsContext.Provider>
  );
};

export default VoiceSettingsProvider;
