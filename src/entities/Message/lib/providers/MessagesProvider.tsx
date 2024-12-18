import { useState } from "react";
import { createContext } from "use-context-selector";

import { MessageModel } from "../../model/MessageModel";

export const MessagesContext = createContext<{
  messages: MessageModel[];
  setMessages: React.Dispatch<React.SetStateAction<MessageModel[]>>;
  unreadReplies: MessageModel[];
  setUnreadReplies: React.Dispatch<React.SetStateAction<MessageModel[]>>;
}>({ messages: [] as MessageModel[], setMessages: () => {}, unreadReplies: [] as MessageModel[], setUnreadReplies: () => {} });

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [unreadReplies, setUnreadReplies] = useState<MessageModel[]>([]);

  return <MessagesContext.Provider value={{ messages, setMessages, unreadReplies, setUnreadReplies }}>{children}</MessagesContext.Provider>;
};
