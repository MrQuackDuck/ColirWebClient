import { RoomModel } from "@/entities/Room/model/RoomModel"
import { Button } from "@/shared/ui/Button"
import { Separator } from "@/shared/ui/Separator"
import { DollarSignIcon, PanelRightCloseIcon } from "lucide-react"
import Countdown from 'react-countdown'
import classes from './ChatSection.module.css'
import ChatInput, { MessageToSend } from "./ChatInput"
import { MessageModel } from "@/entities/Message/model/MessageModel"
import { Connection } from "./ChatPage"
import { showErrorToast } from "@/shared/lib/showErrorToast"
import { HubConnectionState } from "@microsoft/signalr"
import { ScrollArea } from "@/shared/ui/ScrollArea"
import Message from "@/entities/Message/ui/Message"
import { useMemo, useRef, useState } from "react"
import { UserModel } from "@/entities/User/model/UserModel"
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser"
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult"
import { SignalRResultType } from "@/shared/model/response/SignalRResultType"
import { useUsers } from "@/entities/User/lib/hooks/useUsers"

function ChatSection({room, connection, messages, openAside}: {room: RoomModel, connection: Connection, messages: MessageModel[], openAside: () => any | null}) {
  if (room == null) return <></>;
  if (connection == null) return <></>;
  if (connection.connection.state != HubConnectionState.Connected) return <></>;

  let messagesEnd = useRef<any>();
  let scrollArea = useRef<any>();
  const [isMessagesEndObserved, setIsMessagesEndObserved] = useState(false);
  let {currentUser} = useCurrentUser();
  let {users} = useUsers();
  let [messageToReply, setMessageToReply] = useState<MessageModel | null>(null);
  let [messageToReplyAuthor, setMessageToReplyAuthor] = useState<UserModel | null>(null);
  let [lastMessageId, setLastMessageId] = useState<number>(0);

  function replyClicked(message: MessageModel) {
    scrollToBottom();
    setMessageToReply(message);
    setMessageToReplyAuthor(users.find(u => u.hexId == message.authorHexId) ?? null);
  }

  function replyCancelled() {
    setMessageToReply(null);
    setMessageToReplyAuthor(null);
  }

  function sendMessage(message: MessageToSend) {
    replyCancelled();
    connection.connection.send("SendMessage", message)
      .catch(e => showErrorToast("Couldn't deliver the message.", e.message));
  }

  function addReaction(messageId: number, reaction: string) {
    connection.connection.invoke<SignalRHubResponse<any>>("AddReactionOnMessage", { messageId, reaction })
      .then(response => { if (response.resultType == SignalRResultType.Error) throw Error(`Error code: ${response.error.errorCodeAsString}`) })
      .catch(e => showErrorToast("Couldn't add the reaction", e.message));
  }

  function removeReaction(reactionId: number) {
    connection.connection.send("RemoveReactionFromMessage", { reactionId })
      .catch(e => showErrorToast("Couldn't remove the reaction", e.message));
  }

  function deleteMessage(messageId: number) {
    connection.connection.send("DeleteMessage", { messageId: messageId })
      .catch(e => showErrorToast("Couldn't delete the message", e.mesage));
  }

  function editMessage(messageId: number, newContent: string) {
    connection.connection.send("EditMessage", { messageId, newContent })
      .catch(e => showErrorToast("Couldn't delete the message", e.mesage));
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesEnd.current.scrollIntoView({
        block: "nearest",
        inline: "center",
        alignToTop: false
      });
    }, 50)
  }

  useMemo(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsMessagesEndObserved(entry.isIntersecting);
    });
  
    if (messagesEnd.current) {
      observer.observe(messagesEnd.current);
    }
  }, []);

  useMemo(() => {
    if (!messagesEnd.current) return;
    if (isMessagesEndObserved) scrollToBottom();
    let lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;
    if (lastMessage.authorHexId == currentUser?.hexId && lastMessage.id != lastMessageId) scrollToBottom();

    setLastMessageId(lastMessage.id);
  }, [messages])

  return (
    <div className="flex flex-col w-[300%] max-h-full h-full">
      <header className="flex flex-row items-center pb-2 gap-1">
        <Button onClick={() => openAside()} className={`hidden ${classes.openAsideBtn}`} variant={"ghost"} size={"icon"}>
          <PanelRightCloseIcon strokeWidth={2.5} className="h-5 w-5 text-slate-400" />
        </Button>
        <div className="flex flex-row items-center select-none gap-2.5">
          <DollarSignIcon className="text-slate-400 h-[1.125rem] min-w-[1.125] max-w-[1.125]" />
          <span>{room.name}</span>
          <Separator className="min-h-5" orientation="vertical"/>
          <Button className="px-0 h-7" variant={"link"}>{room.joinedUsers.length} members</Button>
          <Separator className="min-h-5" orientation="vertical"/>
          <span className="text-[14px] text-slate-500">Expires in: {room.expiryDate == null ? "Never" : <Countdown date={room.expiryDate}/>}</span>
        </div>
      </header>
      <Separator orientation="horizontal"/>

      <main className={`h-full overflow-hidden ${classes.messagesBlock} ${messageToReply && 'pb-4'}`}>
        <ScrollArea ref={scrollArea} className={`h-full pr-3 pb-2`}>
          {messages.sort((a, b) => a.id - b.id).map(m => {
            let repliedMessage = messages.find(repMessage => repMessage.id == m.repliedMessageId);

            return m.roomGuid == room.guid && <Message
              key={m.id}
              repliedMessage={repliedMessage}
              repliedMessageAuthor={users.find(u => u.hexId == repliedMessage?.authorHexId)}
              onReactionAdded={emoji => addReaction(m.id, emoji)}
              onReactionRemoved={reactionId => removeReaction(reactionId)}
              onReplyClicked={() => replyClicked(m)}
              onDeleteClicked={() => deleteMessage(m.id)}
              onMessageEdited={(newContent) => editMessage(m.id, newContent)}
              message={m}
              sender={users.find(u => u.hexId == m.authorHexId)!}/>
          })}
          <div className="absolute z-50 w-full bottom-30" ref={messagesEnd}></div>
        </ScrollArea>
      </main>

      <ChatInput onReplyCancelled={replyCancelled} messageToReply={messageToReply} messageToReplyAuthor={messageToReplyAuthor} className="w-full" onSend={(m) => sendMessage(m)}/>
    </div>
  )
}

export default ChatSection