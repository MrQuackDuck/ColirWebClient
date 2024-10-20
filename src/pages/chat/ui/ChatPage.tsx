import { Separator } from "@/shared/ui/Separator";
import ChatSection from "../../../widgets/chat-section/ChatSection";
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
import { ChatConnectionsContext } from "@/shared/lib/providers/ChatConnectionsProvider";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/shared/ui/Resizable";
import { useResponsibility } from "@/shared/lib/hooks/useResponsibility";
import { useChatConnection } from "../lib/hooks/useChatConnection";
import VoiceChatSection from "@/widgets/voice-chat-section/ui/VoiceChatSection";

function ChatPage() {
  let joinedRooms = useContextSelector(JoinedRoomsContext, c => c.joinedRooms);
  let setJoinedRooms = useContextSelector(JoinedRoomsContext, c => c.setJoinedRooms);
  let currentUser = useContextSelector(CurrentUserContext, c => c.currentUser);
  let chatConnections = useContextSelector(ChatConnectionsContext, c => c.chatConnections);
  let setChatConnections = useContextSelector(ChatConnectionsContext, c => c.setChatConnections);
  let setMessages = useContextSelector(MessagesContext, c => c.setMessages);
  let selectedRoom = useContextSelector(SelectedRoomContext, c => c.selectedRoom);
  let setSelectedRoom = useContextSelector(SelectedRoomContext, c => c.setSelectedRoom);
  let setUsers = useContextSelector(UsersContext, c => c.setUsers);
  let [asideOpen, setAsideOpen] = useState<boolean>(false); // For mobile devices
  let [voiceChatSectionOpen, setVoiceChatSectionOpen] = useState<boolean>(false); // For mobile devices
  let { isDesktop } = useResponsibility();

  const { startConnection } = useChatConnection(
    currentUser,
    joinedRooms,
    setJoinedRooms,
    setChatConnections,
    setMessages,
    setUsers,
    selectedRoom,
    setSelectedRoom
  );

  // Starts the SignalR connection for each room
  useEffect(() => {
    let mappedConnections: string[] = [];
    chatConnections.map((c) => {
      if (chatConnections.find((c) => c.roomGuid == selectedRoom?.guid)?.connection.state == HubConnectionState.Connected) return;
      if (mappedConnections.includes(c.roomGuid)) return;
      mappedConnections.push(c.roomGuid);
      startConnection(c.roomGuid, c.connection);
    });
  }, [chatConnections.length]);

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
        {isDesktop && <div className={`flex flex-row w-[100%] h-[100%] max-w-[250px] p-2.5`}>
          <Aside/>
          <Separator orientation="vertical" />
        </div>}
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={80} minSize={40}>
            <ChatSection setAsideVisibility={setAsideOpen} setVoiceChatSectionVisibility={setVoiceChatSectionOpen} room={selectedRoom}/>
          </ResizablePanel>
          {isDesktop && <>
            <ResizableHandle className="mx-2.5" withHandle/>
            <ResizablePanel defaultSize={20} minSize={20}>
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