import { useState } from "react";
import { createContext } from "use-context-selector";

export const VoiceChatControlsContext = createContext<{
  isMuted: boolean;
  isDeafened: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeafened: React.Dispatch<React.SetStateAction<boolean>>;
}>({ isMuted: true, isDeafened: false, setIsMuted: () => {}, setIsDeafened: () => {} });

export const VoiceChatControlsProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isDeafened, setIsDeafened] = useState<boolean>(false);

  return <VoiceChatControlsContext.Provider value={{ isMuted, isDeafened, setIsMuted, setIsDeafened }}>{children}</VoiceChatControlsContext.Provider>;
};
