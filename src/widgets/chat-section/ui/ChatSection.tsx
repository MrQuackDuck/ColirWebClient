import { RoomModel } from "@/entities/Room/model/RoomModel";
import { Button } from "@/shared/ui/Button";
import { Separator } from "@/shared/ui/Separator";
import { ArrowDown, DollarSignIcon, PanelLeftCloseIcon, PanelRightCloseIcon } from "lucide-react";
import Countdown from "react-countdown";
import classes from "./ChatSection.module.css";
import ChatInput, { ChatInputMessage, ChatInputVariant } from "../../../features/send-message/ui/ChatInput";
import { MessageModel } from "@/entities/Message/model/MessageModel";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { ScrollArea } from "@/shared/ui/ScrollArea";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UserModel } from "@/entities/User/model/UserModel";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import { SignalRResultType } from "@/shared/model/response/SignalRResultType";
import SkeletonMessageList from "@/shared/ui/SkeletonMessageList";
import { HubConnectionState } from "@microsoft/signalr";
import { SendMessageModel } from "@/entities/Message/model/request/SendMessageModel";
import UploadService from "@/entities/Attachment/api/UploadService";
import { ErrorResponse } from "@/shared/model/ErrorResponse";
import { ErrorCode } from "@/shared/model/ErrorCode";
import { distinctMessages } from "@/entities/Message/lib/distinctMessages";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import Username from "@/entities/User/ui/Username";
import AuthTypeBadge from "@/shared/ui/AuthTypeBadge";
import StorageBar from "@/features/manage-storage/ui/StorageBar";
import { useContextSelector } from "use-context-selector";
import { MessagesContext } from "@/entities/Message/lib/providers/MessagesProvider";
import { SelectedRoomContext } from "@/entities/Room/lib/providers/SelectedRoomProvider";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { UsersContext } from "@/entities/User/lib/providers/UsersProvider";
import { ChatConnectionsContext } from "@/widgets/chat-section/lib/providers/ChatConnectionsProvider";
import MessagesList from "@/entities/Message/ui/MessagesList";
import { EncryptionKeysContext } from "@/shared/lib/providers/EncryptionKeysProvider";
import { cn } from "@/shared/lib/utils";
import { useResponsiveness } from "@/shared/lib/hooks/useResponsiveness";
import RoomService from "@/entities/Room/api/RoomService";

interface ChatSectionProps {
  room: RoomModel;
  setAsideVisibility: (isVisible: boolean) => any | null;
  setVoiceChatSectionVisibility: (isVisible: boolean) => any | null;
}

function ChatSection({ room, setAsideVisibility, setVoiceChatSectionVisibility }: ChatSectionProps) {
  let messagesEnd = useRef<any>();
  let messagesStart = useRef<any>();
  let users = useContextSelector(UsersContext, (c) => c.users);
  let currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  let [messageToReply, setMessageToReply] = useState<MessageModel | null>(null);
  let [messageToReplyAuthor, setMessageToReplyAuthor] = useState<UserModel | null>(null);
  let [currentChatVariant, setCurrentChatVariant] = useState<ChatInputVariant>("connecting");
  let [messagesLoaded, setMessagesLoaded] = useState(false);
  let selectedRoom = useContextSelector(SelectedRoomContext, (c) => c.selectedRoom);
  let messages = useContextSelector(MessagesContext, (m) => m.messages);
  let setMessages = useContextSelector(MessagesContext, (m) => m.setMessages);
  let unreadReplies = useContextSelector(MessagesContext, (c) => c.unreadReplies);
  let setUnreadReplies = useContextSelector(MessagesContext, (c) => c.setUnreadReplies);
  const isLoadingMoreMessages = useRef<boolean>(false);
  const selectedRoomRef = useRef(selectedRoom);
  let scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const messageElementsRefs = useRef(new Map<number, HTMLDivElement>());
  const setMessageRef = useCallback(
    (messageId: number) => (el: HTMLDivElement | null) => {
      if (el) messageElementsRefs.current.set(messageId, el);
      else messageElementsRefs.current.delete(messageId);
    },
    []
  );
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => m.roomGuid === room.guid).sort((a, b) => a.id - b.id);
  }, [messages, room]);
  let { isDesktop } = useResponsiveness();

  const messageToReplyRef = useRef(messageToReply);
  useEffect(() => {
    messageToReplyRef.current = messageToReply;
  }, [messageToReply]);

  let getEncryptionKey = useContextSelector(EncryptionKeysContext, (c) => c.getEncryptionKey);
  let roomDecryptionKey = getEncryptionKey(room?.guid);

  let [roomsWithNoMoreMessagesToLoad, setRoomsWithNoMoreMessagesToLoad] = useState<string[]>([]);
  let chatConnections = useContextSelector(ChatConnectionsContext, (c) => c.chatConnections);
  let selectedRoomConnection = useMemo(() => chatConnections.find((c) => c.roomGuid == room.guid), [chatConnections, room?.guid]);
  const selectedRoomConnectionRef = useRef(selectedRoomConnection);
  useEffect(() => {
    selectedRoomConnectionRef.current = selectedRoomConnection;
  }, [selectedRoomConnection]);

  const filteredMessagesRef = useRef(filteredMessages);
  useEffect(() => {
    filteredMessagesRef.current = filteredMessages;
  }, [filteredMessages]);

  async function sendMessage(message: ChatInputMessage) {
    let attachmentIds: number[] = [];

    try {
      if (message.attachments.length > 0) attachmentIds = (await UploadService.UploadAttachments({ roomGuid: room.guid, files: message.attachments })).data;
    } catch (e: any) {
      let error = e?.response.data as ErrorResponse;

      if (error.errorCode == ErrorCode.NotEnoughSpace) showErrorToast("Not enough space!", "There's not enough space in the room to upload the attachment(s).");
      else showErrorToast("Couldn't upload attachment(s).", "An unknown error occurred! Please, notify the developer.");
    }

    let model: SendMessageModel = {
      content: message.content,
      attachmentsIds: attachmentIds,
      replyMessageId: messageToReply?.id
    };

    replyCancelled();
    selectedRoomConnection?.connection.send("SendMessage", model).catch((e) => showErrorToast("Couldn't deliver the message.", e.message));

    RoomService.UpdateLastReadMessage({ roomGuid: room.guid });
  }

  const addReaction = useCallback(
    (messageId: number, reaction: string) => {
      selectedRoomConnection?.connection
        .invoke<SignalRHubResponse<any>>("AddReactionOnMessage", { messageId, reaction })
        .then((response) => {
          if (response.resultType == SignalRResultType.Error) throw Error(`Error code: ${response.error.errorCodeAsString}`);
        })
        .catch((e) => showErrorToast("Couldn't add the reaction", e.message));
    },
    [selectedRoomConnection]
  );

  const removeReaction = useCallback(
    (reactionId: number) => {
      selectedRoomConnection?.connection.send("RemoveReactionFromMessage", { reactionId }).catch((e) => showErrorToast("Couldn't remove the reaction", e.message));
    },
    [selectedRoomConnection]
  );

  const deleteMessage = useCallback(
    (messageId: number) => {
      selectedRoomConnection?.connection.send("DeleteMessage", { messageId: messageId }).catch((e) => showErrorToast("Couldn't delete the message", e.message));
    },
    [selectedRoomConnection]
  );

  const editMessage = useCallback(
    (messageId: number, newContent: string) => {
      selectedRoomConnection?.connection.send("EditMessage", { messageId, newContent }).catch((e) => showErrorToast("Couldn't edit the message", e.message));
    },
    [selectedRoomConnection]
  );

  const replyButtonClicked = useCallback((message: MessageModel) => {
    if (messageToReplyRef.current?.id == message.id) {
      replyCancelled();
      return;
    }

    highlightMessage(message.id);
    setMessageToReply(message);
    setMessageToReplyAuthor(users.find((u) => u.hexId == message.authorHexId) ?? null);
  }, []);

  const handleReplySectionClick = useCallback((repliedMessageId: number) => {
    scrollToMessage(repliedMessageId);
    highlightMessage(repliedMessageId);
  }, []);

  function isNearBottom(distance: number): boolean {
    if (!scrollAreaRef.current) return false;
    return scrollAreaRef.current && scrollAreaRef.current.scrollHeight - scrollAreaRef.current.scrollTop - scrollAreaRef.current.clientHeight < distance;
  }

  function replyCancelled() {
    setMessageToReply(null);
    setMessageToReplyAuthor(null);
  }

  function handleInputReplySectionClick() {
    if (messageToReply) {
      scrollToMessage(messageToReply.id);
      highlightMessage(messageToReply.id);
    }
  }

  function scrollToBottom(isSmooth: boolean = false) {
    setTimeout(() => {
      if (!scrollAreaRef.current) return;
      if (isSmooth) scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: "smooth" });
      else scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }, 0);
  }

  function scrollToMessage(messageId: number, repeatCall: boolean = true) {
    if (filteredMessagesRef.current.find((m) => m.id == messageId) == null) return;
    let messageRef = messageElementsRefs.current.get(messageId);
    if (messageRef) {
      messageRef.scrollIntoView({ block: "center" });
      return;
    }

    let nearestMessageId = filteredMessagesRef.current.find((m) => m.id > messageId)?.id;
    selectedRoomConnectionRef.current?.connection.invoke<SignalRHubResponse<MessageModel[]>>("GetMessagesRange", { startId: messageId, endId: nearestMessageId }).then((response) => {
      setMessages((prevMessages) => distinctMessages([...prevMessages, ...response.content]));
      messageRef = messageElementsRefs.current.get(messageId);
      setTimeout(() => {
        if (repeatCall) scrollToMessage(messageId, false);
        highlightMessage(messageId);
      }, 15);
    });
  }

  function highlightMessage(messageId: number) {
    let messageRef = messageElementsRefs.current.get(messageId);
    if (messageRef) {
      messageRef.classList.add("outline");
      setTimeout(() => messageRef.classList.remove("outline"), 1000);
    }
  }

  function loadMoreMessages() {
    if (isLoadingMoreMessages.current) return; // Prevent multiple requests
    if (selectedRoomConnection?.connection.state != HubConnectionState.Connected) return;
    if (roomsWithNoMoreMessagesToLoad.includes(room.guid)) return;

    isLoadingMoreMessages.current = true;

    const countToLoad = 20;

    // Preserve the current scroll position
    const previousScrollHeight = scrollAreaRef.current?.scrollHeight || 0;
    const previousScrollTop = scrollAreaRef.current?.scrollTop || 0;

    selectedRoomConnection?.connection
      .invoke<SignalRHubResponse<MessageModel[]>>("GetMessages", { count: countToLoad, skipCount: messageElementsRefs.current.size })
      .then((response) => {
        if (!response?.content) return;
        setMessages((prevMessages) => distinctMessages([...response.content, ...prevMessages])); // Add new messages to the top

        if (response.content.length < countToLoad) {
          setRoomsWithNoMoreMessagesToLoad((prev) => [...prev, room.guid]);
        }

        setTimeout(() => {
          if (scrollAreaRef.current && scrollAreaRef.current.scrollTop == 0) {
            // Calculate the new scroll position
            const newScrollHeight = scrollAreaRef.current.scrollHeight;
            const scrollDifference = newScrollHeight - previousScrollHeight;
            scrollAreaRef.current.scrollTop = previousScrollTop + scrollDifference; // Adjust scroll position to maintain the current view
          }
        }, 0);
      })
      .finally(() => (isLoadingMoreMessages.current = false));
  }

  // Load more messages when the user scrolls to the top of the chat
  useEffect(() => {
    if (!selectedRoomConnection || selectedRoomConnection.roomGuid !== room.guid) return;
    if (!messagesLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && roomsWithNoMoreMessagesToLoad.filter((r) => r == room.guid).length == 0) {
          loadMoreMessages();
        }
      },
      { threshold: 1.0 }
    );

    if (messagesStart.current) {
      observer.observe(messagesStart.current);
    }

    return () => {
      if (messagesStart.current) {
        observer.unobserve(messagesStart.current);
      }
    };
  }, [messagesLoaded, selectedRoomConnection, roomsWithNoMoreMessagesToLoad]);

  useEffect(() => {
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

  let mainSection = useRef<any>();
  useEffect(() => {
    if (selectedRoomConnection == null) return setMessagesLoaded(false);
    if (messages.length == 0 && selectedRoomConnection.connection.state != HubConnectionState.Connected) return setMessagesLoaded(false);
    setMessagesLoaded(true);

    let lastMessage = messages[messages.length - 1];
    let isMessageNew = Math.abs(Date.now() - new Date(lastMessage?.postDate).getTime()) < 2000;
    let theLastMessageIsNewAndUserIsNearBottom: () => boolean = () => (isMessageNew && isNearBottom(300)) ?? false;
    let theLastMessageIsNewAndCurrentUserIsAuthor: () => boolean = () => isMessageNew && lastMessage && lastMessage.authorHexId == currentUser?.hexId;

    // Scroll to the bottom when the user sends a message
    if (theLastMessageIsNewAndUserIsNearBottom() || theLastMessageIsNewAndCurrentUserIsAuthor()) setTimeout(() => scrollToBottom(), 10);
  }, [filteredMessages]);

  // Set chat variant based on the connection state
  useEffect(() => {
    if (selectedRoomConnection && selectedRoomConnection.connection.state == HubConnectionState.Connected) {
      setCurrentChatVariant("default");
    }
    if (selectedRoomConnection && selectedRoomConnection.connection.state == HubConnectionState.Connecting) {
      setCurrentChatVariant("connecting");
    }
    if (selectedRoomConnection && selectedRoomConnection.connection.state == HubConnectionState.Disconnected) {
      setCurrentChatVariant("disconnected");
    }

    selectedRoomConnection?.connection.onreconnecting(() => {
      if (selectedRoomConnection.roomGuid != selectedRoomRef.current?.guid) return;
      setCurrentChatVariant("connecting");
    });
    selectedRoomConnection?.connection.onreconnected(() => {
      if (selectedRoomConnection.roomGuid != selectedRoomRef.current?.guid) return;
      setCurrentChatVariant("default");
    });
    selectedRoomConnection?.connection.onclose(() => {
      if (selectedRoomConnection.roomGuid != selectedRoomRef.current?.guid) return;
      setCurrentChatVariant("disconnected");
    });
  }, [selectedRoomConnection?.connection.state, selectedRoom]);

  useEffect(() => {
    if (messagesLoaded) {
      setCurrentChatVariant("default");
      setTimeout(() => scrollToBottom(), 0);
    }
  }, [messagesLoaded]);

  useEffect(() => {
    setTimeout(() => scrollToBottom(), 0);
    setMessageToReply(null);
  }, [room.guid]);

  let [downButtonVisible, setDownButtonVisible] = useState(false);
  function handleScroll() {
    if (!scrollAreaRef.current) return;
    let isNearBottom = scrollAreaRef.current.scrollHeight - scrollAreaRef.current.scrollTop - scrollAreaRef.current.clientHeight < 2000;
    setDownButtonVisible(!isNearBottom);
  }

  // Adding event listener for scrolling
  useEffect(() => {
    if (!scrollAreaRef.current) return;
    scrollAreaRef.current.addEventListener("scroll", handleScroll);
    return () => {
      if (!scrollAreaRef.current) return;
      scrollAreaRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [scrollAreaRef.current]);

  useEffect(() => {
    if (isNearBottom(60) && messageToReply) scrollToBottom();
  }, [messageToReply]);

  let [currentPadding, setCurrentPadding] = useState<number>(0);

  function openAside() {
    setAsideVisibility(true);
  }

  function openVoiceChatSection() {
    setVoiceChatSectionVisibility(true);
  }

  function handleMessageObserved(id: number) {
    if (unreadReplies.find((m) => m.id == id)) {
      RoomService.UpdateLastReadMessage({ roomGuid: room.guid, messageId: id });
      setUnreadReplies((prev) => prev.filter((m) => m.id != id));
    }
  }

  if (!room) return <></>;
  return (
    <div className="flex flex-col max-h-full h-full">
      <header className="flex flex-row items-center pb-2 gap-1">
        {!isDesktop && (
          <Button onClick={openAside} variant={"ghost"} size={"icon"} className="min-w-10 min-h-10">
            <PanelRightCloseIcon className="h-5 w-5 text-slate-400" />
          </Button>
        )}
        <div className="w-full flex flex-row justify-between flex-nowrap gap-1 items-center select-none overflow-hidden">
          <div className="flex flex-row overflow-hidden items-center select-none gap-2.5">
            <DollarSignIcon className="text-slate-400 min-w-[1.125rem] max-w-[1.125rem] h-[1.125rem]" />
            <span className="text-ellipsis text-nowrap max-w-[40%] overflow-hidden">{room.name}</span>
            <Separator className="min-h-5" orientation="vertical" />
            <Popover>
              <PopoverTrigger asChild>
                <Button className="px-0 h-7 focus-visible:-outline-offset-2" variant={"link"}>
                  {selectedRoom?.joinedUsers?.length} members
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col w-fit">
                <span className="text-base">Members</span>
                <span className="text-sm text-slate-400">Here are displayed the members of the room.</span>
                <div className={`overflow-y-auto max-h-96 h-full mt-1`}>
                  {room.joinedUsers.map((u) => (
                    <div key={u.hexId} className="flex flex-row items-center gap-1.5">
                      <Username user={u} /> <AuthTypeBadge className="px-2.5 py-0" authType={u?.authType} />
                    </div>
                  ))}
                </div>
                {!isDesktop && <StorageBar className="w-full" room={room} />}
              </PopoverContent>
            </Popover>
            <Separator className="min-h-5" orientation="vertical" />
            <span className={cn("text-[14px] text-ellipsis whitespace-nowrap overflow-hidden text-slate-500", isDesktop && "min-w-[155px] max-w-[155px]")}>
              Expires in: {room.expiryDate == null ? "Never" : <Countdown className="whitespace-nowrap" date={room.expiryDate} />}
            </span>
          </div>
          <div className="w-fit flex-shrink-0">{isDesktop && <StorageBar className="w-56 max-w-56" room={room} />}</div>
        </div>
        {!isDesktop && (
          <Button onClick={openVoiceChatSection} variant={"ghost"} size={"icon"} className="flex-shrink-0 min-w-10 min-h-10">
            <PanelLeftCloseIcon className="h-5 w-5 text-slate-400" />
          </Button>
        )}
      </header>
      <Separator orientation="horizontal" />

      <main style={{ paddingBottom: currentPadding }} ref={mainSection} className={`h-full overflow-hidden ${classes.messagesBlock}`}>
        <ScrollArea viewportRef={scrollAreaRef} style={{ overflowAnchor: "none" }} className={`h-full pr-3 pb-2`}>
          {roomsWithNoMoreMessagesToLoad.filter((r) => r == room.guid).length == 0 && <div className="z-50 w-full top-30" ref={messagesStart}></div>}
          <MessagesList
            filteredMessages={filteredMessages}
            users={users}
            controlsEnabled={currentChatVariant === "default"}
            decryptionKey={roomDecryptionKey ?? ""}
            addReaction={addReaction}
            removeReaction={removeReaction}
            deleteMessage={deleteMessage}
            editMessage={editMessage}
            replyButtonClicked={replyButtonClicked}
            handleReplySectionClick={handleReplySectionClick}
            setMessageRef={setMessageRef}
            onMessageObserved={handleMessageObserved}
          />
          {!messagesLoaded && <SkeletonMessageList parentRef={mainSection} />}
          <div className="absolute z-50 w-full bottom-30" ref={messagesEnd}></div>
        </ScrollArea>
        <Button
          onClick={() => scrollToBottom(true)}
          variant={"outline"}
          size={"icon"}
          className={cn("z-10 transition-opacity duration-200 absolute bottom-8 right-1", downButtonVisible ? "opacity-1" : "opacity-0 pointer-events-none")}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </main>

      <ChatInput
        encryptionKey={roomDecryptionKey ?? ""}
        onReplySectionClicked={handleInputReplySectionClick}
        onSizeChange={setCurrentPadding}
        variant={currentChatVariant}
        onReplyCancelled={replyCancelled}
        messageToReply={messageToReply}
        messageToReplyAuthor={messageToReplyAuthor}
        className="w-full"
        onSend={sendMessage}
      />
    </div>
  );
}

export default ChatSection;
