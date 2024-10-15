import React from 'react';
import { MessageModel } from "@/entities/Message/model/MessageModel";
import { UserModel } from "@/entities/User/model/UserModel";
import Dater from "@/shared/ui/Dater";
import isEqual from 'fast-deep-equal';
import MessageListItem from './MessageListItem';

interface MessagesListProps {
  filteredMessages: MessageModel[];
  users: UserModel[];
  controlsEnabled: boolean;
  addReaction: (messageId: number, reaction: string) => void;
  removeReaction: (reactionId: number) => void;
  deleteMessage: (messageId: number) => void;
  editMessage: (messageId: number, newContent: string) => void;
  replyButtonClicked: (message: MessageModel) => void;
  handleReplySectionClick: (messageId: number) => void;
  setMessageRef: (messageId: number) => (el: HTMLDivElement | null) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  filteredMessages,
  users,
  controlsEnabled,
  addReaction,
  removeReaction,
  deleteMessage,
  editMessage,
  replyButtonClicked,
  handleReplySectionClick,
  setMessageRef
}) => {
  return (
    <>
      {filteredMessages.map((m, index, filteredMessages) => {
        const currentMessageDate = new Date(m.postDate).getDate();
        const previousMessageDate = index > 0 ? new Date(filteredMessages[index - 1].postDate).getDate() : null;
        let needToInsertDater = index === 0 || currentMessageDate !== previousMessageDate;
        const sender = users.find(u => u.hexId === m.authorHexId)!;
        const repliedMessageAuthor = m.repliedMessage ? users.find(u => u.hexId === m.repliedMessage?.authorHexId) : undefined;

        return (
          <div className="rounded-[6px] h-fit" key={m.id}>
            {needToInsertDater && <Dater date={m.postDate} />}
            <MessageListItem
              setMessagesRef={setMessageRef}
              controlsEnabled={controlsEnabled}
              repliedMessage={m.repliedMessage}
              repliedMessageAuthor={repliedMessageAuthor}
              onReactionAdded={addReaction}
              onReactionRemoved={removeReaction}
              onDeleteClicked={deleteMessage}
              onMessageEdited={editMessage}
              onReplyButtonClicked={replyButtonClicked}
              onReplySectionClicked={handleReplySectionClick}
              message={m}
              sender={sender}
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
    prevProps.addReaction === nextProps.addReaction &&
    prevProps.removeReaction === nextProps.removeReaction &&
    prevProps.deleteMessage === nextProps.deleteMessage &&
    prevProps.editMessage === nextProps.editMessage &&
    prevProps.replyButtonClicked === nextProps.replyButtonClicked &&
    prevProps.handleReplySectionClick === nextProps.handleReplySectionClick &&
    prevProps.setMessageRef === nextProps.setMessageRef
  );
};

export default React.memo(MessagesList, arePropsEqual);