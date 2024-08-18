import { Separator } from "@/shared/ui/Separator"
import Aside from "./Aside";
import ChatSection from "./ChatSection";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import classes from "./ChatPage.module.css";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/ui/Sheet";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { API_URL } from "@/shared/api";
import AuthService from "@/features/authorize/lib/AuthService";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { MessageModel } from "@/entities/Message/model/MessageModel";
import { GetLastMessagesModel } from "@/entities/Message/model/request/GetLastMessagesModel";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";

export interface Connection {
  roomGuid: string,
  connection: HubConnection
}

function ChatPage() {
  let { currentUser, updateCurrentUser } = useCurrentUser();
  let [selectedRoom, setSelectedRoom] = useState<string>(currentUser?.joinedRooms[0].guid ?? "");
  let [connections, setConnections] = useState<Connection[]>([]);
  let [messages, setMessages] = useState<MessageModel[]>([]);

  useEffect(() => {
    if (!currentUser?.joinedRooms) return;

    currentUser.joinedRooms.map(r => {
      AuthService.IsAuthenticated()
        .then(() => {
          // Return if the connection is already registered
          if (connections.filter(c => c.roomGuid == r.guid).length > 1) return;

          let connection = new HubConnectionBuilder()
          .withUrl(`${API_URL}/Chat?roomGuid=${r.guid}`)
          .withAutomaticReconnect()
          .build();
        
          setConnections(prevConnections => [
            ...prevConnections,
            { roomGuid: r.guid, connection: connection }
          ]);

          connection.start()
            .then(() => {
              // Getting last messages
              let request: GetLastMessagesModel = { count: 40, skipCount: 0 };
              connection.invoke<SignalRHubResponse<MessageModel[]>>("GetMessages", request)
                .then(response => setMessages(prevMessages => [...prevMessages, ...response.content]));

              connection?.on("ReceiveMessage", m => setMessages(prevMessages => [...prevMessages, m]));
              connection?.on("UserJoined", () => updateCurrentUser());
            })
            .catch(() => showErrorToast(`Couldn't connect to the room", "We weren't able to establish a connection with ${r.name}`));
          })
            .catch(() => showErrorToast(`Couldn't connect to the room`, `We weren't able to establish a connection with ${r.name}`));;
        })
  }, [currentUser?.joinedRooms.length])

  // For mobile devices
  let [asideOpen, setAsideOpen] = useState(false);

  return (<>
    <Sheet open={asideOpen} onOpenChange={setAsideOpen}>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Manage rooms</SheetTitle>
          <SheetDescription className="text-left px-2.5">Tip: Hold the room to open the context menu.</SheetDescription>
        </SheetHeader>
        <Aside rooms={currentUser!.joinedRooms} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} updateCurrentUser={updateCurrentUser}/> 
      </SheetContent>
    </Sheet>
    <div className={`flex flex-row items-start gap-2 h-[100%] px-[8.5vw] pb-[2vh] animate-appearance opacity-25 ${classes.chat}`}>
      <div className={`flex flex-row w-[100%] h-[100%] max-w-[250px] p-2.5 ${classes.asideSection}`}>
        <Aside rooms={currentUser!.joinedRooms} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} updateCurrentUser={updateCurrentUser}/>
        <Separator orientation="vertical" />
      </div>
      <ChatSection messages={messages} connection={connections.find(c => c.roomGuid == selectedRoom)!} openAside={() => setAsideOpen(true)} room={currentUser!.joinedRooms.find(r => r.guid == selectedRoom)!} />
    </div>
  </>)
}

export default ChatPage