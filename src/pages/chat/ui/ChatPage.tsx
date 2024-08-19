import { Separator } from "@/shared/ui/Separator";
import Aside from "./Aside";
import ChatSection from "./ChatSection";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import classes from "./ChatPage.module.css";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/Sheet";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { API_URL } from "@/shared/api";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { MessageModel } from "@/entities/Message/model/MessageModel";
import { GetLastMessagesModel } from "@/entities/Message/model/request/GetLastMessagesModel";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import RoomService from "@/entities/Room/api/RoomService";
import { UserModel } from "@/entities/User/model/UserModel";
import { useLocalStorage } from "@/shared/lib/hooks/useLocalStorage";

export interface Connection {
  roomGuid: string;
  connection: HubConnection;
}

function ChatPage() {
  let { currentUser, updateCurrentUser } = useCurrentUser();
  let [selectedRoom, setSelectedRoom] = useState<string>(
    currentUser?.joinedRooms[0].guid ?? ""
  );
  let [connections, setConnections] = useState<Connection[]>([]);
  let [messages, setMessages] = useState<MessageModel[]>([]);
  let [users, setUsers] = useState<UserModel[]>([]);
  let { getFromLocalStorage } = useLocalStorage();
  let [asideOpen, setAsideOpen] = useState(false); // For mobile devices

  const distinctUsers = (array) => {
    const newUsers: UserModel[] = [];
    array.map((u) => {
      if (newUsers.find((usr) => usr.hexId == u.hexId)) return;
      newUsers.push(u);
    });

    return newUsers;
  };

  const updateUsers = async () => {
    if (!currentUser) return;

    updateCurrentUser();
    let pendingUsers: any[] = [];
    await currentUser.joinedRooms.map(async r => {
      await RoomService.GetRoomInfo({ roomGuid: r.guid }).then((roomInfoResponse) => {
        pendingUsers = distinctUsers([
          ...pendingUsers,
          ...roomInfoResponse.data.joinedUsers,
        ]);
        setUsers(pendingUsers);
      });
    });
  };

  useEffect(() => {
    if (!currentUser?.joinedRooms) return;

    updateUsers()
      .then(() => {
        currentUser.joinedRooms.map((r) => {
          // Return if the connection is already registered
          if (connections.filter((c) => c.roomGuid == r.guid).length >= 1) return;
    
          let connection = new HubConnectionBuilder()
            .withUrl(`${API_URL}/Chat?roomGuid=${r.guid}`, {
              accessTokenFactory: () => getFromLocalStorage<string>("jwtToken"),
            })
            .withAutomaticReconnect()
            .build();
    
          setConnections((prevConnections) => [
            ...prevConnections,
            { roomGuid: r.guid, connection: connection },
          ]);
    
          connection.start()
            .then(() => {
              // Getting last messages
              let request: GetLastMessagesModel = { count: 40, skipCount: 0 };
              connection.invoke<SignalRHubResponse<MessageModel[]>>("GetMessages", request)
                .then((response) => {
                  setMessages((prevMessages) => [
                    ...prevMessages,
                    ...response.content,
                  ])
                
                  // Getting the list of replied messages
                  response.content.map(m => {
                    if (!m.repliedMessageId) return;
                    connection.invoke<SignalRHubResponse<MessageModel>>("GetMessageById", { messageId: m.repliedMessageId })
                      .then(resp => {
                        setMessages((prevMessages) => [
                          ...prevMessages,
                          resp.content,
                        ])
                      });
                  })
                }
                );
    
              connection?.on("ReceiveMessage", (m) => setMessages((prevMessages) => [...prevMessages, m]));
              connection?.on("UserJoined", () => updateUsers());
              connection?.on("UserLeft", (hexId) => {
                if (currentUser.hexId != hexId) updateUsers();
              });
            })
            .catch(() =>
              showErrorToast(
                `Couldn't connect to the room`,
                `We weren't able to establish a connection with ${r.name}`
              )
            );
        });
      });
  }, [currentUser?.joinedRooms.length]);

  return (
    <>
      <Sheet open={asideOpen} onOpenChange={setAsideOpen}>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Manage rooms</SheetTitle>
            <SheetDescription className="text-left px-2.5">
              Tip: Hold the room to open the context menu.
            </SheetDescription>
          </SheetHeader>
          <Aside
            rooms={currentUser!.joinedRooms}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            updateCurrentUser={updateCurrentUser}
          />
        </SheetContent>
      </Sheet>
      <div
        className={`flex flex-row items-start gap-2 h-full px-[8.5vw] pb-[2vh] animate-appearance opacity-25 ${classes.chat}`}
      >
        <div
          className={`flex flex-row w-[100%] h-[100%] max-w-[250px] p-2.5 ${classes.asideSection}`}
        >
          <Aside
            rooms={currentUser!.joinedRooms}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            updateCurrentUser={updateCurrentUser}
          />
          <Separator orientation="vertical" />
        </div>
        <ChatSection
          messages={messages}
          users={users}
          connection={connections.find((c) => c.roomGuid == selectedRoom)!}
          openAside={() => setAsideOpen(true)}
          room={currentUser!.joinedRooms.find((r) => r.guid == selectedRoom)!}
        />
      </div>
    </>
  );
}

export default ChatPage;
