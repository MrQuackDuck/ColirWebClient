import { useState } from "react";
import { MessageModel } from "../../model/MessageModel";
import { createContext } from 'use-context-selector';

export const MessagesContext = createContext<{
  messages: MessageModel[];
  setMessages: React.Dispatch<React.SetStateAction<MessageModel[]>>;
}>({ messages: [] as MessageModel[], setMessages: () => {} });

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState<MessageModel[]>([]);

  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessagesContext.Provider>
  );
};