import { Separator } from "@/shared/ui/Separator";
import ChatSection from "../../../widgets/chat-section/ui/ChatSection";
import { useEffect, useState } from "react";
import classes from "./ChatPage.module.css";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/Sheet";
import {
  HubConnectionState,
} from "@microsoft/signalr";
import Aside from "@/widgets/aside/ui/Aside";
import { MessagesContext } from "@/entities/Message/lib/providers/MessagesProvider";
import { useContextSelector } from 'use-context-selector';
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

function ChatPage() {
  let joinedRooms = useContextSelector(JoinedRoomsContext, c => c.joinedRooms);
  let setJoinedRooms = useContextSelector(JoinedRoomsContext, c => c.setJoinedRooms);
  let currentUser = useContextSelector(CurrentUserContext, c => c.currentUser);
  let chatConnections = useContextSelector(ChatConnectionsContext, c => c.chatConnections);
  let setChatConnections = useContextSelector(ChatConnectionsContext, c => c.setChatConnections);
  let voiceChatConnections = useContextSelector(VoiceChatConnectionsContext, c => c.voiceChatConnections);
  let joinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, c => c.joinedVoiceConnection);
  let setVoiceChatConnections = useContextSelector(VoiceChatConnectionsContext, c => c.setVoiceChatConnections);
  let setMessages = useContextSelector(MessagesContext, c => c.setMessages);
  let selectedRoom = useContextSelector(SelectedRoomContext, c => c.selectedRoom);
  let setSelectedRoom = useContextSelector(SelectedRoomContext, c => c.setSelectedRoom);
  let setUsers = useContextSelector(UsersContext, c => c.setUsers);
  let [asideOpen, setAsideOpen] = useState<boolean>(false); // For mobile devices
  let [voiceChatSectionOpen, setVoiceChatSectionOpen] = useState<boolean>(false); // For mobile devices
  let { isDesktop } = useResponsiveness();

  const { startChatConnection } = useChatConnection(
    currentUser,
    joinedRooms,
    setJoinedRooms,
    setChatConnections,
    setMessages,
    setUsers,
    selectedRoom,
    setSelectedRoom
  );

  const { startVoiceConnection } = useVoiceChatConnection(
    currentUser,
    joinedRooms,
    selectedRoom,
    joinedVoiceConnection,
    setVoiceChatConnections
  );

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

  return (
    <>
      {!isDesktop && <Sheet open={asideOpen} onOpenChange={setAsideOpen}>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Manage rooms</SheetTitle>
            <SheetDescription className="text-left px-2.5">
              Tip: Hold the room to open the context menu.
            </SheetDescription>
          </SheetHeader>
          <Aside/>
        </SheetContent>
      </Sheet>}
      <div className={`flex flex-row items-start gap-2 h-full px-[8.5vw] pb-[2vh] animate-appearance opacity-25 ${classes.chat}`}>
        {isDesktop && 
          <div className={`flex flex-row flex-shrink-0 w-full h-full max-w-[280px] p-2.5`}>
            <Aside/>
            <Separator orientation="vertical" />
          </div>
        }
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel id="chatSectionPanel" order={1} defaultSize={75} minSize={40}>
            <ChatSection setAsideVisibility={setAsideOpen} setVoiceChatSectionVisibility={setVoiceChatSectionOpen} room={selectedRoom}/>
          </ResizablePanel>
          {isDesktop && <>
            <ResizableHandle id="handle" className="mx-2.5" withHandle/>
            <ResizablePanel id="voiceChatSectionPanel" order={2} defaultSize={25} minSize={20}>
              <VoiceChatSection/>
            </ResizablePanel>
          </>}
        </ResizablePanelGroup>
      </div>
      {!isDesktop && <Sheet open={voiceChatSectionOpen} onOpenChange={setVoiceChatSectionOpen}>
        <SheetContent side={"right"}>
          <SheetTitle className="hidden" />
          <SheetDescription className="hidden"/>
          <VoiceChatSection/>
        </SheetContent>
      </Sheet>}
    </>
  );
}

export default ChatPage;