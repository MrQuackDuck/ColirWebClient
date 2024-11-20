import React from "react";
import Message from "./Message";
import { MessageModel } from "../model/MessageModel";
import { UserModel } from "@/entities/User/model/UserModel";
import isEqual from 'fast-deep-equal';

interface MessageListItemProps {
  setMessagesRef: (messageId: number) => (el: HTMLDivElement | null) => void;
  message: MessageModel;
  sender?: UserModel;
  repliedMessage?: MessageModel;
  repliedMessageAuthor?: UserModel;
  controlsEnabled: boolean;
  decryptionKey: string;
  onReactionAdded: (messageId: number, reaction: string) => any;
  onReactionRemoved: (reactionId: number) => any;
  onDeleteClicked: (messageId: number) => any;
  onMessageEdited: (messageId: number, newContent: string) => any;
  onReplyButtonClicked: (message: MessageModel) => any;
  onReplySectionClicked: (messageId: number) => any;
  onObserved: (messageId: number) => any;
}

class MessageListItem extends React.Component<MessageListItemProps> {
  shouldComponentUpdate(nextProps: MessageListItemProps) {
    return !(
      isEqual(this.props.message, nextProps.message) &&
      isEqual(this.props.sender, nextProps.sender) &&
      isEqual(this.props.repliedMessage, nextProps.repliedMessage) &&
      isEqual(this.props.repliedMessageAuthor, nextProps.repliedMessageAuthor) &&
      this.props.controlsEnabled === nextProps.controlsEnabled &&
      this.props.decryptionKey === nextProps.decryptionKey &&
      this.props.onReactionAdded === nextProps.onReactionAdded &&
      this.props.onReactionRemoved === nextProps.onReactionRemoved &&
      this.props.onDeleteClicked === nextProps.onDeleteClicked &&
      this.props.onMessageEdited === nextProps.onMessageEdited &&
      this.props.onReplyButtonClicked === nextProps.onReplyButtonClicked &&
      this.props.onReplySectionClicked === nextProps.onReplySectionClicked
    );
  }

  render() {
    return (
      <Message
        ref={this.props.setMessagesRef(this.props.message.id)}
        message={this.props.message}
        sender={this.props.sender}
        repliedMessage={this.props.repliedMessage}
        repliedMessageAuthor={this.props.repliedMessageAuthor}
        controlsEnabled={this.props.controlsEnabled}
        decryptionKey={this.props.decryptionKey}
        onReactionAdded={this.props.onReactionAdded}
        onReactionRemoved={this.props.onReactionRemoved}
        onDeleteClicked={this.props.onDeleteClicked}
        onMessageEdited={this.props.onMessageEdited}
        onReplyButtonClicked={this.props.onReplyButtonClicked}
        onReplySectionClicked={this.props.onReplySectionClicked}
        onObserved={this.props.onObserved}
      />
    );
  }
}

export default MessageListItem;