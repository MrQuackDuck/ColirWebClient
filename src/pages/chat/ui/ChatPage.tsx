import { HubConnectionState } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
import { useContextSelector } from "use-context-selector";

import { MessagesContext } from "@/entities/Message";
import { JoinedRoomsContext, SelectedRoomContext } from "@/entities/Room";
import { CurrentUserContext, UsersContext } from "@/entities/User";
import { VoiceChatControls } from "@/features/manage-voice-controls";
import { useResponsiveness, useTranslation } from "@/shared/lib";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Separator,
  Sheet,
  SheetContent,
  SheetContentWithUnmountableContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetWithUnmountableContent
} from "@/shared/ui";
import { Aside } from "@/widgets/aside";
import { ChatConnectionsContext, ChatSection } from "@/widgets/chat-section";
import { VoiceChatConnectionsContext, VoiceChatSection } from "@/widgets/voice-chat-section";

import { useChatConnection } from "../lib/hooks/useChatConnection";
import { useVoiceChatConnection } from "../lib/hooks/useVoiceChatConnection";
import classes from "./ChatPage.module.css";

export function ChatPage() {
  const t = useTranslation();
  const joinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.joinedRooms);
  const setJoinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.setJoinedRooms);
  const currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  const chatConnections = useContextSelector(ChatConnectionsContext, (c) => c.chatConnections);
  const setChatConnections = useContextSelector(ChatConnectionsContext, (c) => c.setChatConnections);
  const voiceChatConnections = useContextSelector(VoiceChatConnectionsContext, (c) => c.voiceChatConnections);
  const joinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, (c) => c.joinedVoiceConnection);
  const setJoinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, (c) => c.setJoinedVoiceConnection);
  const setVoiceChatConnections = useContextSelector(VoiceChatConnectionsContext, (c) => c.setVoiceChatConnections);
  const setMessages = useContextSelector(MessagesContext, (c) => c.setMessages);
  const setUnreadReplies = useContextSelector(MessagesContext, (c) => c.setUnreadReplies);
  const selectedRoom = useContextSelector(SelectedRoomContext, (c) => c.selectedRoom);
  const setSelectedRoom = useContextSelector(SelectedRoomContext, (c) => c.setSelectedRoom);
  const setUsers = useContextSelector(UsersContext, (c) => c.setUsers);
  const [asideOpen, setAsideOpen] = useState<boolean>(false); // For mobile devices
  const [voiceChatSectionOpen, setVoiceChatSectionOpen] = useState<boolean>(false); // For mobile devices
  const { isDesktop } = useResponsiveness();

  const { startChatConnection } = useChatConnection(currentUser, joinedRooms, setJoinedRooms, setChatConnections, setMessages, setUnreadReplies, setUsers, selectedRoom, setSelectedRoom);

  const { startVoiceConnection } = useVoiceChatConnection(currentUser, joinedRooms, selectedRoom, joinedVoiceConnection, setJoinedVoiceConnection, setVoiceChatConnections);

  // Starts a SignalR connection for each room's text chat
  useEffect(() => {
    const mappedConnections: string[] = [];
    chatConnections.map((c) => {
      if (chatConnections.find((c) => c.roomGuid == selectedRoom?.guid)?.connection.state == HubConnectionState.Connected) return;
      if (mappedConnections.includes(c.roomGuid)) return;
      mappedConnections.push(c.roomGuid);
      startChatConnection(c.roomGuid, c.connection);
    });
  }, [chatConnections.length]);

  // Starts a SignalR connection for each room's voice chat
  useEffect(() => {
    const mappedConnections: string[] = [];
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
