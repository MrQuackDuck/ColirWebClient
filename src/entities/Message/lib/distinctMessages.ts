import { MessageModel } from "../model/MessageModel";

export const distinctMessages = (array: MessageModel[]): MessageModel[] => {
  const newMessages: MessageModel[] = [];
  array.map((u) => {
    if (newMessages.find((m) => m.id == u.id)) return;
    newMessages.push(u);
  });

  return newMessages;
};
