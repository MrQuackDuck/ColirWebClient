import { createContext } from "use-context-selector";
import { useState } from "react";
import { VoiceChatConnection } from "../../model/VoiceChatConnection";

export const VoiceChatConnectionsContext = createContext<{
  voiceChatConnections: VoiceChatConnection[];
  setVoiceChatConnections: React.Dispatch<React.SetStateAction<VoiceChatConnection[]>>;
  joinedVoiceConnection?: VoiceChatConnection;
  setJoinedVoiceConnection: React.Dispatch<React.SetStateAction<VoiceChatConnection | undefined>>;
}>({ voiceChatConnections: [] as VoiceChatConnection[], setVoiceChatConnections: () => {}, joinedVoiceConnection: undefined, setJoinedVoiceConnection: () => {} });

export const VoiceChatConnectionsProvider = ({ children }) => {
  const [joinedVoiceConnection, setJoinedVoiceConnection] = useState<VoiceChatConnection | undefined>();
  const [voiceChatConnections, setVoiceChatConnections] = useState<VoiceChatConnection[]>([]);

  return (
    <VoiceChatConnectionsContext.Provider value={{ voiceChatConnections, setVoiceChatConnections, joinedVoiceConnection, setJoinedVoiceConnection }}>{children}</VoiceChatConnectionsContext.Provider>
  );
};
