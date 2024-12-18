import isEqual from "fast-deep-equal";
import React from "react";

import { UserModel } from "@/entities/User";
import { Dater } from "@/shared/ui";

import { MessageModel } from "../model/MessageModel";
import MessageListItem from "./MessageListItem";

interface MessagesListProps {
  filteredMessages: MessageModel[];
  users: UserModel[];
  controlsEnabled: boolean;
  decryptionKey: string;
  addReaction: (messageId: number, reaction: string) => void;
  removeReaction: (reactionId: number) => void;
  deleteMessage: (messageId: number) => void;
  editMessage: (messageId: number, newContent: string) => void;
  replyButtonClicked: (message: MessageModel) => void;
  handleReplySectionClick: (messageId: number) => void;
  setMessageRef: (messageId: number) => (el: HTMLDivElement | null) => void;
  onMessageObserved: (messageId: number) => any;
}

const MessagesListInternal: React.FC<MessagesListProps> = ({
  filteredMessages,
  users,
  controlsEnabled,
  decryptionKey,
  addReaction,
  removeReaction,
  deleteMessage,
  editMessage,
  replyButtonClicked,
  handleReplySectionClick,
  setMessageRef,
  onMessageObserved
}) => {
  return (
    <>
      {filteredMessages.map((m, index, filteredMessages) => {
        const currentMessageDate = new Date(m.postDate).getDate();
        const previousMessageDate = index > 0 ? new Date(filteredMessages[index - 1].postDate).getDate() : null;
        const needToInsertDater = index === 0 || currentMessageDate !== previousMessageDate;
        const sender = users.find((u) => u.hexId === m.authorHexId)!;
        const repliedMessageAuthor = m.repliedMessage ? users.find((u) => u.hexId === m.repliedMessage?.authorHexId) : undefined;

        return (
          <div className="rounded-[6px] h-fit" key={m.id}>
            {needToInsertDater && <Dater date={m.postDate} />}
            <MessageListItem
              setMessagesRef={setMessageRef}
              repliedMessage={m.repliedMessage}
              repliedMessageAuthor={repliedMessageAuthor}
              controlsEnabled={controlsEnabled}
              decryptionKey={decryptionKey}
              onReactionAdded={addReaction}
              onReactionRemoved={removeReaction}
              onDeleteClicked={deleteMessage}
              onMessageEdited={editMessage}
              onReplyButtonClicked={replyButtonClicked}
              onReplySectionClicked={handleReplySectionClick}
              message={m}
              sender={sender}
              onObserved={onMessageObserved}
            />
          </div>
        );
      })}
    </>
  );
};

const arePropsEqual = (prevProps: MessagesListProps, nextProps: MessagesListProps) => {
  return (
    isEqual(prevProps.filteredMessages, nextProps.filteredMessages) &&
    isEqual(prevProps.users, nextProps.users) &&
    prevProps.controlsEnabled === nextProps.controlsEnabled &&
    prevProps.decryptionKey === nextProps.decryptionKey &&
    prevProps.addReaction === nextProps.addReaction &&
    prevProps.removeReaction === nextProps.removeReaction &&
    prevProps.deleteMessage === nextProps.deleteMessage &&
    prevProps.editMessage === nextProps.editMessage &&
    prevProps.replyButtonClicked === nextProps.replyButtonClicked &&
    prevProps.handleReplySectionClick === nextProps.handleReplySectionClick &&
    prevProps.setMessageRef === nextProps.setMessageRef &&
    prevProps.onMessageObserved === nextProps.onMessageObserved
  );
};

export const MessagesList = React.memo(MessagesListInternal, arePropsEqual);
