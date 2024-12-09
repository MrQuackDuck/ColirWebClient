import { Separator } from "@/shared/ui/Separator";
import ChatSection from "../../../widgets/chat-section/ui/ChatSection";
import { useEffect, useState } from "react";
import classes from "./ChatPage.module.css";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/ui/Sheet";
import { SheetWithUnmountableContent, SheetContent as SheetContentWithUnmountableContent } from "@/shared/ui/SheetWithUnmountableContent";
import { HubConnectionState } from "@microsoft/signalr";
import Aside from "@/widgets/aside/ui/Aside";
import { MessagesContext } from "@/entities/Message/lib/providers/MessagesProvider";
import { useContextSelector } from "use-context-selector";
import { JoinedRoomsContext } from "@/entities/Room/lib/providers/JoinedRoomsProvider";
import { SelectedRoomContext } from "@/entities/Room/lib/providers/SelectedRoomProvider";
import { UsersContext } from "@/entities/User/lib/providers/UsersProvider";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { ChatConnectionsContext } from "@/widgets/chat-section/lib/providers/ChatConnectionsProvider";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/shared/ui/Resizable";
import { useResponsiveness } from "@/shared/lib/hooks/useResponsiveness";
import { useChatConnection } from "../lib/hooks/useChatConnection";
import VoiceChatSection from "@/widgets/voice-chat-section/ui/VoiceChatSection";
import { useVoiceChatConnection } from "../lib/hooks/useVoiceChatConnection";
import { VoiceChatConnectionsContext } from "@/widgets/voice-chat-section/lib/providers/VoiceChatConnectionsProvider";
import VoiceChatControls from "@/features/manage-voice-controls/ui/VoiceChatControls";
import FocusLock from "react-focus-lock";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";

function ChatPage() {
  const t = useTranslation();
  let joinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.joinedRooms);
  let setJoinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.setJoinedRooms);
  let currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  let chatConnections = useContextSelector(ChatConnectionsContext, (c) => c.chatConnections);
  let setChatConnections = useContextSelector(ChatConnectionsContext, (c) => c.setChatConnections);
  let voiceChatConnections = useContextSelector(VoiceChatConnectionsContext, (c) => c.voiceChatConnections);
  let joinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, (c) => c.joinedVoiceConnection);
  let setJoinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, (c) => c.setJoinedVoiceConnection);
  let setVoiceChatConnections = useContextSelector(VoiceChatConnectionsContext, (c) => c.setVoiceChatConnections);
  let setMessages = useContextSelector(MessagesContext, (c) => c.setMessages);
  let setUnreadReplies = useContextSelector(MessagesContext, (c) => c.setUnreadReplies);
  let selectedRoom = useContextSelector(SelectedRoomContext, (c) => c.selectedRoom);
  let setSelectedRoom = useContextSelector(SelectedRoomContext, (c) => c.setSelectedRoom);
  let setUsers = useContextSelector(UsersContext, (c) => c.setUsers);
  let [asideOpen, setAsideOpen] = useState<boolean>(false); // For mobile devices
  let [voiceChatSectionOpen, setVoiceChatSectionOpen] = useState<boolean>(false); // For mobile devices
  let { isDesktop } = useResponsiveness();

  const { startChatConnection } = useChatConnection(currentUser, joinedRooms, setJoinedRooms, setChatConnections, setMessages, setUnreadReplies, setUsers, selectedRoom, setSelectedRoom);

  const { startVoiceConnection } = useVoiceChatConnection(currentUser, joinedRooms, selectedRoom, joinedVoiceConnection, setJoinedVoiceConnection, setVoiceChatConnections);

  // Starts a SignalR connection for each room's text chat
  useEffect(() => {
    let mappedConnections: string[] = [];
    chatConnections.map((c) => {
      if (chatConnections.find((c) => c.roomGuid == selectedRoom?.guid)?.connection.state == HubConnectionState.Connected) return;
      if (mappedConnections.includes(c.roomGuid)) return;
      mappedConnections.push(c.roomGuid);
      startChatConnection(c.roomGuid, c.connection);
    });
  }, [chatConnections.length]);

  // Starts a SignalR connection for each room's voice chat
  useEffect(() => {
    let mappedConnections: string[] = [];
    voiceChatConnections.map((c) => {
      if (voiceChatConnections.find((c) => c.roomGuid == selectedRoom?.guid)?.connection.state == HubConnectionState.Connected) return;
      if (mappedConnections.includes(c.roomGuid)) return;
      mappedConnections.push(c.roomGuid);
      startVoiceConnection(c.roomGuid, c.connection);
    });
  }, [voiceChatConnections.length]);

  useEffect(() => {
    setAsideOpen(false);
  }, [selectedRoom]);

  return (
    <>
      {!isDesktop && (
        <Sheet open={asideOpen} onOpenChange={setAsideOpen}>
          <SheetContent className="px-1" side={"left"}>
            <SheetHeader>
              <SheetTitle>{t("MANAGE_ROOMS")}</SheetTitle>
              <SheetDescription className="text-left px-2.5">{t("HOLD_ROOM_TO_OPEN_CONTEXT_MENU")}</SheetDescription>
            </SheetHeader>
            <Aside />
          </SheetContent>
        </Sheet>
      )}
      <div className={`flex flex-row overflow-y-hidden items-start gap-2 h-full px-[8.5vw] pb-[2vh] animate-appearance opacity-25 ${classes.chat}`}>
        {isDesktop && (
          <div className="flex flex-row overflow-hidden flex-shrink-0 w-full h-full max-w-[280px] overflow-y-hidden p-2.5">
            <Aside />
            <Separator orientation="vertical" />
          </div>
        )}
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel id="chatSectionPanel" order={1} defaultSize={75} minSize={40}>
            <ChatSection setAsideVisibility={setAsideOpen} setVoiceChatSectionVisibility={setVoiceChatSectionOpen} room={selectedRoom} />
          </ResizablePanel>
          {isDesktop && (
            <>
              <ResizableHandle id="handle" className="mx-2.5" withHandle />
              <ResizablePanel id="voiceChatSectionPanel" order={2} defaultSize={25} minSize={20}>
                <VoiceChatSection />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
      {!isDesktop && (
        <SheetWithUnmountableContent orientation="right" open={voiceChatSectionOpen} onOpenClose={setVoiceChatSectionOpen}>
          <SheetContentWithUnmountableContent>
            <FocusLock disabled={!voiceChatSectionOpen} onDeactivation={() => setVoiceChatSectionOpen(false)}>
              <div className="flex flex-col" onKeyDown={(e) => e.key === "Escape" && setVoiceChatSectionOpen(false)}>
                <VoiceChatSection />
                <VoiceChatControls className="flex-row mx-auto" />
              </div>
            </FocusLock>
          </SheetContentWithUnmountableContent>
        </SheetWithUnmountableContent>
      )}
    </>
  );
}

export default ChatPage;
