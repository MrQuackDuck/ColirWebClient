import { RoomModel } from "@/entities/Room/model/RoomModel"
import { Button } from "@/shared/ui/Button"
import { Separator } from "@/shared/ui/Separator"
import { DollarSignIcon, PanelRightCloseIcon } from "lucide-react"
import Countdown from 'react-countdown'
import classes from './ChatSection.module.css'
import ChatInput, { ChatInputMessage, ChatInputVariant } from "../../../features/send-message/ui/ChatInput"
import { MessageModel } from "@/entities/Message/model/MessageModel"
import { Connection } from "./ChatPage"
import { showErrorToast } from "@/shared/lib/showErrorToast"
import { ScrollArea } from "@/shared/ui/ScrollArea"
import Message from "@/entities/Message/ui/Message"
import { useEffect, useRef, useState } from "react"
import { UserModel } from "@/entities/User/model/UserModel"
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult"
import { SignalRResultType } from "@/shared/model/response/SignalRResultType"
import { useUsers } from "@/entities/User/lib/hooks/useUsers"
import SkeletonMessageList from "@/entities/Message/ui/SkeletonMessageList"
import { HubConnectionState } from "@microsoft/signalr"
import { SendMessageModel } from "@/entities/Message/model/request/SendMessageModel"
import UploadService from "@/entities/Attachment/api/UploadService"
import { ErrorResponse } from "@/shared/model/ErrorResponse"
import { ErrorCode } from "@/shared/model/ErrorCode"
import Dater from "@/shared/ui/Dater"
import { distinctMessages } from "@/entities/Message/lib/distinctMessages"
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser"

interface ChatSectionProps {
  room: RoomModel;
  connection: Connection;
  messages: MessageModel[];
  setMessages: React.Dispatch<React.SetStateAction<MessageModel[]>>;
  openAside: () => any | null;
}

function ChatSection({
  room,
  connection,
  messages,
  setMessages,
  openAside,
}: ChatSectionProps) {
  if (!room) return <></>;
  let messagesEnd = useRef<any>();
  let messagesStart = useRef<any>();
  let scrollArea = useRef<any>();
  let {users} = useUsers();
  let currentUser = useCurrentUser();
  let [messageToReply, setMessageToReply] = useState<MessageModel | null>(null);
  let [messageToReplyAuthor, setMessageToReplyAuthor] = useState<UserModel | null>(null);
  let [currentChatVariant, setCurrentChatVariant] = useState<ChatInputVariant>("connecting");
  let [messagesLoaded, setMessagesLoaded] = useState(false);
  const messageRefs = useRef(new Map<number, any>());
  let filteredMessages = messages.filter(m => m.roomGuid == room.guid).sort((a, b) => a.id - b.id);
  let viewportRef = useRef<HTMLDivElement | null>(null);
  let [roomsWithNoMoreMessagesToLoad, setRoomsWithNoMoreMessagesToLoad] = useState<string[]>([]);

  function replyButtonClicked(message: MessageModel) {
    setMessageToReply(message);
    setMessageToReplyAuthor(users.find(u => u.hexId == message.authorHexId) ?? null);
    setTimeout(() => scrollToBottom(), 0);
  }

  function replyCancelled() {
    setMessageToReply(null);
    setMessageToReplyAuthor(null);
  }

  async function sendMessage(message: ChatInputMessage) {
    let attachmentIds: number[] = [];

    try {
      if (message.attachments.length > 0)
        attachmentIds = (await UploadService.UploadAttachments({ roomGuid: room.guid, files: message.attachments })).data;
    }
    catch (e: any) {
      let error = e?.response.data as ErrorResponse;

      if (error.errorCode == ErrorCode.NotEnoughSpace)
        showErrorToast("Not enough space!", "There's not enough space in the room to upload the attachment(s).");
      else
        showErrorToast("Couldn't upload attachment(s).", "An unknown error occurred! Please, notify the developer.");
    }

    let model: SendMessageModel = {
      content: message.content,
      attachmentsIds: attachmentIds,
      replyMessageId: messageToReply?.id
    }

    replyCancelled();
    connection.connection.send("SendMessage", model)
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
      if (!viewportRef.current) return;
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }, 0)
  }

  function scrollToMessage(messageId: number) {
    let messageRef = messageRefs.current.get(messageId);
    if (messageRef) {
      messageRef.scrollIntoView({ block: "center" });
    } 
    else {
      connection.connection.invoke<SignalRHubResponse<MessageModel[]>>("GetSurroundingMessages", { messageId: messageId, count: 4 })
        .then(response => {
          setMessages(prevMessages => distinctMessages([...prevMessages, ...response.content]));
          messageRef = messageRefs.current.get(messageId);
          if (messageRef) scrollToMessage(messageId);
        });
    }
  }

  function highlightMessage(messageId: number) {
    let messageRef = messageRefs.current.get(messageId);
    if (messageRef) {
      messageRef.classList.add("outline");
      setTimeout(() => messageRef.classList.remove("outline"), 1000);
    }
  }

  function handleReplySectionClick(messageId: number) {
    scrollToMessage(messageId);
    highlightMessage(messageId);
  }

  function loadMoreMessages() {
    if (roomsWithNoMoreMessagesToLoad.filter(r => r == room.guid).length >= 1) return;

    let countToLoad = 5;
    connection.connection.invoke<SignalRHubResponse<MessageModel[]>>("GetMessages", { count: countToLoad, skipCount: messageRefs.current.size })
      .then(response => {
        setMessages(prevMessages => distinctMessages([...prevMessages, ...response.content]));

        if (response.content.length < countToLoad) {
          setRoomsWithNoMoreMessagesToLoad(prev => [...prev, room.guid]);
        }

        setTimeout(() => {
          if (viewportRef.current)
            viewportRef.current.scrollBy(0, 1);
        }, 0);
      });
  }

  // Load more messages when the user scrolls to the top of the chat
  useEffect(() => {
    if (!connection || connection.roomGuid !== room.guid) return;
    if (!messagesLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && roomsWithNoMoreMessagesToLoad.filter(r => r == room.guid).length == 0) {
          loadMoreMessages();
        }
      }, { threshold: 1.0 }
    );
  
    if (messagesStart.current) {
      observer.observe(messagesStart.current);
    }
  
    return () => {
      if (messagesStart.current) {
        observer.unobserve(messagesStart.current);
      }
    };
  }, [messagesLoaded, connection, roomsWithNoMoreMessagesToLoad]);

  let mainSection = useRef<any>();
  useEffect(() => {
    if (connection == null) return setMessagesLoaded(false);
    if (messages.length == 0 && connection.connection.state != HubConnectionState.Connected) return setMessagesLoaded(false);
    setMessagesLoaded(true);

    // Scroll to the bottom when the user sends a message
    let lastMessage = messages[messages.length - 1];
    if (lastMessage.authorHexId == currentUser.currentUser?.hexId && Math.abs(Date.now() - new Date(lastMessage.postDate).getTime()) < 5000) 
      setTimeout(() => scrollToBottom(), 0);
    }, [messages]);

  useEffect(() => {
    connection?.connection.onreconnecting(() => {
      setCurrentChatVariant("connecting");
    });
    connection?.connection.onreconnected(() => {
      setCurrentChatVariant("default");
    });
    connection?.connection.onclose(() => {
      setCurrentChatVariant("disconnected");
    });
  }, [connection?.connection]);

  useEffect(() => {
    if (messagesLoaded) {
      setCurrentChatVariant("default");
      scrollToBottom();
    }
  }, [messagesLoaded]);

  useEffect(() => {
    scrollToBottom();
    setMessageToReply(null);
  }, [room]);

  let [currentPadding, setCurrentPadding] = useState<number>(0);

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

      <main style={{ paddingBottom: currentPadding }} ref={mainSection} className={`h-full overflow-hidden ${classes.messagesBlock}`}>
        <ScrollArea ref={scrollArea} viewportRef={viewportRef} style={{"overflowAnchor": "none"}} className={`h-full pr-3 pb-2`}>
        {roomsWithNoMoreMessagesToLoad.filter(r => r == room.guid).length == 0 && 
        <div className="z-50 w-full top-30" ref={messagesStart}></div>}
        {filteredMessages.map((m, index, filteredMessages) => {
            let needToInsertDater = index == 0 || new Date(filteredMessages[index].postDate).getDate() != new Date(filteredMessages[index - 1].postDate).getDate();
            let repliedMessageAuthor = users.find(u => u.hexId == m.repliedMessage?.authorHexId);
            
            return (
              <div
              className="rounded-[6px] h-fit"
              key={m.id}>
                {needToInsertDater && <Dater date={m.postDate} />}
                <Message
                  ref={(el) => {
                    if (el) messageRefs.current.set(m.id, el);
                    else messageRefs.current.delete(m.id);
                  }}
                  controlsEnabled={currentChatVariant == "default"}
                  repliedMessage={m.repliedMessage}
                  repliedMessageAuthor={repliedMessageAuthor}
                  onReactionAdded={emoji => addReaction(m.id, emoji)}
                  onReactionRemoved={reactionId => removeReaction(reactionId)}
                  onReplyButtonClicked={() => replyButtonClicked(m)}
                  onReplySectionClicked={() => handleReplySectionClick(m.repliedMessageId || 0)}
                  onDeleteClicked={() => deleteMessage(m.id)}
                  onMessageEdited={(newContent) => editMessage(m.id, newContent)}
                  message={m}
                  sender={users.find(u => u.hexId == m.authorHexId)!}
                />
              </div>
            );
          })}
          {!messagesLoaded && <SkeletonMessageList parentRef={mainSection}/>}
          <div className="absolute z-50 w-full bottom-30" ref={messagesEnd}></div>
        </ScrollArea>
      </main>

      <ChatInput onSizeChange={setCurrentPadding} variant={currentChatVariant}  onReplyCancelled={replyCancelled} messageToReply={messageToReply} messageToReplyAuthor={messageToReplyAuthor} className="w-full" onSend={(m) => sendMessage(m)}/>
    </div>
  )
}

export default ChatSection