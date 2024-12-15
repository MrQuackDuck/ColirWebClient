import { RoomModel } from "@/entities/Room/model/RoomModel";
import { Button } from "@/shared/ui/Button";
import { Separator } from "@/shared/ui/Separator";
import { ArrowDown, DollarSignIcon, PanelLeftCloseIcon, PanelRightCloseIcon } from "lucide-react";
import Countdown from "react-countdown";
import ChatInput, { ChatInputMessage, ChatInputVariant } from "../../../features/send-message/ui/ChatInput";
import { MessageModel } from "@/entities/Message/model/MessageModel";
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
import { useTranslation } from "@/shared/lib/hooks/useTranslation";
import { useErrorToast } from "@/shared/lib/hooks/useErrorToast";
import RoomOwnerIcon from "@/shared/ui/RoomOwnerIcon";
import { InvertedScrollArea } from "@/shared/ui/InvertedScrollArea";
import { useInvertedScrollArea } from "@/shared/lib/hooks/useInvertedScrollArea";

interface ChatSectionProps {
  room: RoomModel;
  setAsideVisibility: (isVisible: boolean) => any | null;
  setVoiceChatSectionVisibility: (isVisible: boolean) => any | null;
}

function ChatSection({ room, setAsideVisibility, setVoiceChatSectionVisibility }: ChatSectionProps) {
  const t = useTranslation();
  const showErrorToast = useErrorToast();
  let mainSection = useRef<any>();
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
  const { scrollRef, contentRef, scrollToBottom } = useInvertedScrollArea();
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

      if (error.errorCode == ErrorCode.NotEnoughSpace) showErrorToast(t("NOT_ENOUGH_SPACE"), t("THERE_IS_NOT_ENOUGH_SPACE_TO_UPLOAD_ATTACHMENTS"));
      else showErrorToast(t("COULD_NOT_UPLOAD_ATTACHMENTS"), t("UNKNOWN_ERROR_OCCURRED_NOTIFY_DEVELOPER"));
    }

    let model: SendMessageModel = {
      content: message.content,
      attachmentsIds: attachmentIds,
      replyMessageId: messageToReply?.id
    };

    replyCancelled();
    selectedRoomConnection?.connection
      .invoke<SignalRHubResponse<any>>("SendMessage", model)
      .then((response) => {
        if (response.resultType == SignalRResultType.Error) throw Error(`${t("ERROR_CODE")}: ${response.error.errorCodeAsString}`);
        RoomService.UpdateLastReadMessage({ roomGuid: room.guid });
      })
      .catch((e) => {
        showErrorToast(t("COULD_NOT_DELIVER_MESSAGE"), e.message);
        throw e;
      });
  }

  const addReaction = useCallback(
    (messageId: number, reaction: string) => {
      selectedRoomConnection?.connection
        .invoke<SignalRHubResponse<any>>("AddReactionOnMessage", { messageId, reaction })
        .then((response) => {
          if (response.resultType == SignalRResultType.Error) throw Error(`Error code: ${response.error.errorCodeAsString}`);
        })
        .catch((e) => showErrorToast(t("COULD_NOT_ADD_REACTION"), e.message));
    },
    [selectedRoomConnection]
  );

  const removeReaction = useCallback(
    (reactionId: number) => {
      selectedRoomConnection?.connection.send("RemoveReactionFromMessage", { reactionId }).catch((e) => showErrorToast(t("COULD_NOT_REVMOVE_REACTION"), e.message));
    },
    [selectedRoomConnection]
  );

  const deleteMessage = useCallback(
    (messageId: number) => {
      selectedRoomConnection?.connection.send("DeleteMessage", { messageId: messageId }).catch((e) => showErrorToast(t("COULD_NOT_DELETE_MESSAGE"), e.message));
    },
    [selectedRoomConnection]
  );

  const editMessage = useCallback(
    (messageId: number, newContent: string) => {
      selectedRoomConnection?.connection
        .invoke<SignalRHubResponse<any>>("EditMessage", { messageId, newContent })
        .then((response) => {
          if (response.resultType == SignalRResultType.Error) throw Error(`${t("ERROR_CODE")}: ${response.error.errorCodeAsString}`);
        })
        .catch((e) => showErrorToast(t("COULD_NOT_EDIT_MESSAGE"), e.message));
    },
    [selectedRoomConnection]
  );

  const replyButtonClicked = useCallback((message: MessageModel) => {
    // If the user clicks the reply button on the same message, cancel the reply
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
    if (!scrollRef.current) return false;
    return scrollRef.current && scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight < distance;
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

  function scrollToMessage(messageId: number, repeatCall: boolean = true) {
    if (filteredMessagesRef.current.find((m) => m.id == messageId) != null) {
      let messageRef = messageElementsRefs.current.get(messageId);
      if (messageRef) {
        messageRef.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
    }

    if (!repeatCall) return;
    let nearestMessageId = filteredMessagesRef.current.find((m) => m.id > messageId)?.id;
    selectedRoomConnectionRef.current?.connection.invoke<SignalRHubResponse<MessageModel[]>>("GetMessagesRange", { startId: messageId, endId: nearestMessageId }).then((response) => {
      setMessages((prevMessages) => distinctMessages([...prevMessages, ...response.content]));
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
    const previousScrollHeight = scrollRef.current?.scrollHeight || 0;
    const previousScrollTop = scrollRef.current?.scrollTop || 0;

    selectedRoomConnection?.connection
      .invoke<SignalRHubResponse<MessageModel[]>>("GetMessages", { count: countToLoad, skipCount: messageElementsRefs.current.size })
      .then((response) => {
        if (!response?.content) return;
        setMessages((prevMessages) => distinctMessages([...response.content, ...prevMessages])); // Add new messages to the top

        if (response.content.length < countToLoad) {
          setRoomsWithNoMoreMessagesToLoad((prev) => [...prev, room.guid]);
        }

        setTimeout(() => {
          if (scrollRef.current && scrollRef.current.scrollTop == 0) {
            // Calculate the new scroll position
            const newScrollHeight = scrollRef.current.scrollHeight;
            const scrollDifference = newScrollHeight - previousScrollHeight;
            scrollRef.current.scrollTop = previousScrollTop + scrollDifference; // Adjust scroll position to maintain the current view
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

  function updateLastLocalMessage() {
    let lastMessage = filteredMessages[filteredMessages.length - 1];
    lastMessageIdScrolledToBottom.current = lastMessage?.id;
  }

  function scrollToBottomAndUpdateLastMessage(smoothScroll: boolean = false) {
    scrollToBottom(smoothScroll ? "smooth" : "instant");
    updateLastLocalMessage();
  }

  // Count the number of messages in each room to control the scroll behavior
  const [roomMessagesCount, setRoomMessagesCount] = useState<{ [roomGuid: string]: number }>({});
  const lastMessageIdScrolledToBottom = useRef<number | null>(null);
  useEffect(() => {
    if (selectedRoomConnection == null) return setMessagesLoaded(false);
    if (messages.length == 0 && selectedRoomConnection.connection.state != HubConnectionState.Connected) return setMessagesLoaded(false);

    setMessagesLoaded(true);

    const currentRoomGuid = selectedRoomConnection.roomGuid;
    const previousMessageCount = roomMessagesCount[currentRoomGuid] || 0;

    setRoomMessagesCount((prev) => ({
      ...prev,
      [currentRoomGuid]: messages.length
    }));

    if (lastMessageIdScrolledToBottom.current == null) {
      return updateLastLocalMessage();
    }

    let lastMessage = filteredMessages[filteredMessages.length - 1];
    const hasNewMessage = messages.length > previousMessageCount && lastMessageIdScrolledToBottom.current != lastMessage?.id;
    lastMessageIdScrolledToBottom.current = lastMessage?.id;

    let theLastMessageIsNewAndCurrentUserIsAuthor: () => boolean = () => hasNewMessage && lastMessage && lastMessage.authorHexId == currentUser?.hexId;

    // Scroll to the bottom when the user sends a message
    if (theLastMessageIsNewAndCurrentUserIsAuthor()) scrollToBottomAndUpdateLastMessage();
  }, [filteredMessages, selectedRoomConnection]);

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
    if (messagesLoaded) setCurrentChatVariant("default");
  }, [messagesLoaded]);

  useEffect(() => {
    setMessageToReply(null);
  }, [room.guid]);

  let [downButtonVisible, setDownButtonVisible] = useState(false);
  function handleScroll() {
    if (!scrollRef.current) return;
    let isNearBottom = scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight < 2000;
    setDownButtonVisible(!isNearBottom);
  }

  // Adding event listener for scrolling
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.addEventListener("scroll", handleScroll);
    return () => {
      if (!scrollRef.current) return;
      scrollRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef.current]);

  useEffect(() => {
    if (isNearBottom(60) && messageToReply) scrollToBottomAndUpdateLastMessage();
  }, [messageToReply]);

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
                  {selectedRoom?.joinedUsers?.length} {t("MEMBERS")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col w-fit">
                <span className="text-base">{t("MEMBERS_TITLE")}</span>
                <span className="text-sm text-slate-400">{t("HERE_ARE_DISPLAYED_MEMBERS_OF_ROOM")}</span>
                <div className={`overflow-y-auto max-h-96 h-full mt-1`}>
                  {room.joinedUsers.map((u) => (
                    <div key={u.hexId} className="flex flex-row items-center gap-1.5">
                      <Username user={u} /> {room?.owner?.hexId == u?.hexId && <RoomOwnerIcon />} <AuthTypeBadge className="px-2.5 py-0" authType={u?.authType} />
                    </div>
                  ))}
                </div>
                {!isDesktop && <StorageBar className="w-full" room={room} />}
              </PopoverContent>
            </Popover>
            <Separator className="min-h-5" orientation="vertical" />
            <span className={cn("text-[14px] text-ellipsis whitespace-nowrap overflow-hidden text-slate-500", isDesktop && "min-w-[155px]")}>
              {t("EXPIRES_IN")}: {room.expiryDate == null ? t("NEVER") : <Countdown className="whitespace-nowrap" date={room.expiryDate} />}
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

      <main ref={mainSection} className={`h-full overflow-hidden pb-1`}>
        <InvertedScrollArea scrollRef={scrollRef} contentRef={contentRef} style={{ overflowAnchor: "none" }} className={`h-full pr-3`}>
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
        </InvertedScrollArea>
        <Button
          onClick={() => scrollToBottomAndUpdateLastMessage(true)}
          variant={"outline"}
          size={"icon"}
          className={cn("z-10 transition-opacity duration-200 absolute bottom-4 right-1", downButtonVisible ? "opacity-1" : "opacity-0 pointer-events-none")}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </main>

      <ChatInput
        encryptionKey={roomDecryptionKey ?? ""}
        onReplySectionClicked={handleInputReplySectionClick}
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
