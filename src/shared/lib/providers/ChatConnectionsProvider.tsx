// ChatConnectionsProvider.tsx
import { ChatConnection } from '@/shared/model/ChatConnection';
import React, { useState } from 'react';
import { createContext } from 'use-context-selector';

export const ChatConnectionsContext = createContext<{
  chatConnections: ChatConnection[];
  setChatConnections: React.Dispatch<React.SetStateAction<ChatConnection[]>>;
}>({ chatConnections: [] as ChatConnection[], setChatConnections: () => {} });

export const ChatConnectionsProvider = ({ children }) => {
  const [chatConnections, setChatConnections] = useState<ChatConnection[]>([]);

  return (
    <ChatConnectionsContext.Provider value={{ chatConnections, setChatConnections }}>
      {children}
    </ChatConnectionsContext.Provider>
  );
};