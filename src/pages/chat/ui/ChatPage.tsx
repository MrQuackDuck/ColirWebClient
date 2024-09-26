import { Separator } from "@/shared/ui/Separator";
import ChatSection from "./ChatSection";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import { useEffect, useRef, useState } from "react";
import classes from "./ChatPage.module.css";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/Sheet";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { API_URL } from "@/shared/api";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { MessageModel } from "@/entities/Message/model/MessageModel";
import { GetLastMessagesModel } from "@/entities/Message/model/request/GetLastMessagesModel";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import { UserModel } from "@/entities/User/model/UserModel";
import { useJwt } from "@/shared/lib/hooks/useJwt";
import { useJoinedRooms } from "@/entities/Room/lib/hooks/useJoinedRooms";
import { useUsers } from "@/entities/User/lib/hooks/useUsers";
import Aside from "@/widgets/aside/ui/Aside";
import { distinctMessages } from "@/entities/Message/lib/distinctMessages";
import { useSelectedRoom } from "@/entities/Room/lib/hooks/useSelectedRoom";
import { showInfoToast } from "@/shared/lib/showInfoToast";

export interface Connection {
  roomGuid: string;
  connection: HubConnection;
}

function ChatPage() {
  let {currentUser} = useCurrentUser();
  let [connections, setConnections] = useState<Connection[]>([]);
  let [messages, setMessages] = useState<MessageModel[]>([]);
  let {joinedRooms, setJoinedRooms} = useJoinedRooms();
  let {selectedRoom, setSelectedRoom} = useSelectedRoom();
  const joinedRoomsRef = useRef(joinedRooms);
  const selectedRoomRef = useRef(selectedRoom);
  let {setUsers} = useUsers();
  let getJwt = useJwt();
  let [asideOpen, setAsideOpen] = useState<boolean>(false); // For mobile devices

  useEffect(() => {
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

  // Verifies that the users which are not present in the room and don't share same rooms with current user are removed from the memory
  function verifyUsersPresenceOnAllRooms() {
    if (!joinedRooms || !currentUser) return;

    let usersToKeep: number[] = [];
    joinedRooms.forEach((r) => {
      r.joinedUsers.forEach((u) => {
        usersToKeep.push(u.hexId);
      });
    });

    setUsers((prevUsers) => [...prevUsers.filter((u) => usersToKeep.find(userHex => userHex == u.hexId))]);
  }


  function startConnection(roomGuid: string, connection: HubConnection) {
    if (!joinedRooms || !currentUser) return;
    if (connection.state != HubConnectionState.Disconnected) return;

    connection
      .start()
      .then(() => {
        // Getting last messages
        let request: GetLastMessagesModel = { count: 20, skipCount: 0 };
        connection
          .invoke<SignalRHubResponse<MessageModel[]>>("GetMessages", request)
          .then((response) => {
            setMessages((prevMessages) =>
              distinctMessages([...prevMessages, ...response.content])
            );
          });

        connection?.on("ReceiveMessage", (message: MessageModel) => setMessages((prevMessages) => [...prevMessages, message]));
        connection?.on("MessageDeleted", (messageId: number) => setMessages((prevMessages) => [...prevMessages.filter((m) => m.id != messageId)]));
        connection?.on("MessageEdited", (message: MessageModel) =>
          setMessages((prevMessages) => {
            let target = prevMessages.find((m) => m.id == message.id);
            if (target) {
              target.content = message.content;
              target.editDate = message.editDate;
            }
            return [...prevMessages];
          })
        );

        connection?.on("UserJoined", (user: UserModel) => {
          if (currentUser.hexId == user.hexId) return;
          if (selectedRoomRef.current.guid == roomGuid) showInfoToast("User joined", `${user.username} has joined the room.`);
          setUsers((prevUsers) => [...prevUsers, user]);
          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == roomGuid);
            target?.joinedUsers.push(user);
            return [...prevRooms];
          });
        });

        connection?.on("UserLeft", (hexId) => {
          verifyUsersPresenceOnAllRooms();
          // If the current user leaves, remove the connection and the room
          if (currentUser.hexId == hexId) {
            setConnections((prevConnections) => [...prevConnections.filter((c) => c.roomGuid != roomGuid)]);
            connection.stop();
            return;
          }
        });

        connection?.on("UserKicked", (hexId) => {
          verifyUsersPresenceOnAllRooms();
          // If the current user leaves, remove the connection and the room
          if (currentUser.hexId == hexId) {
            setConnections((prevConnections) => [...prevConnections.filter((c) => c.roomGuid != roomGuid)]);
            let newRooms = [...joinedRoomsRef.current.filter((r) => r.guid != roomGuid)];
            setJoinedRooms(newRooms);
            setMessages(prevMessages => prevMessages.filter(m => m.roomGuid != roomGuid));
            if (newRooms.length > 0 && selectedRoomRef.current.guid == roomGuid) setSelectedRoom(newRooms[0]);
            connection.stop();
            return;
          }
        });

        connection?.on("MessageGotReaction", (message: MessageModel) =>
          setMessages((prevMessages) => {
            let target = prevMessages.find((m) => m.id == message.id);
            if (target) {
              target.reactions = [];
              target.reactions = message.reactions;
            }
            return [...prevMessages];
          })
        );

        connection?.on("MessageLostReaction", (message: MessageModel) =>
          setMessages((prevMessages) => {
            let target = prevMessages.find((m) => m.id == message.id);
            if (target) target.reactions = message.reactions;
            return [...prevMessages];
          })
        );

        connection?.on("RoomRenamed", (newName) => {
          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == selectedRoom.guid);
            if (target) target.name = newName;
            return [...prevRooms];
          });
        });
      })
      .catch((e) => {
        showErrorToast(
          `Couldn't connect to the room`,
          `We weren't able to establish a connection. Error: ${e}.`
        );
      });
  }

  useEffect(() => {
    if (!joinedRooms) return;

    verifyUsersPresenceOnAllRooms();
    getJwt().then((jwt) => {
      joinedRooms.map((r) => {
        let connection = new HubConnectionBuilder()
          .withUrl(`${API_URL}/Chat?roomGuid=${r.guid}`, {
            accessTokenFactory: () => jwt,
          })
          .withAutomaticReconnect([5000, 5000, 6000, 6000])
          .build();

        setConnections((prevConnections) => {
          if (prevConnections.find((c) => c.roomGuid == r.guid)) return prevConnections;
          return [...prevConnections, { roomGuid: r.guid, connection: connection }]});
      });
    });
  }, [joinedRooms.length, currentUser]);

  useEffect(() => {
    let mappedConnections: string[] = [];
    connections.map((c) => {
      if (connections.find((c) => c.roomGuid == selectedRoom?.guid)?.connection.state == HubConnectionState.Connected) return;
      if (mappedConnections.includes(c.roomGuid)) return;
      mappedConnections.push(c.roomGuid);
      startConnection(c.roomGuid, c.connection);
    });
  }, [connections.length]);

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
          <Aside/>
        </SheetContent>
      </Sheet>
      <div className={`flex flex-row items-start gap-2 h-full px-[8.5vw] pb-[2vh] animate-appearance opacity-25 ${classes.chat}`}>
        <div className={`flex flex-row w-[100%] h-[100%] max-w-[250px] p-2.5 ${classes.asideSection}`}>
          <Aside/>
          <Separator orientation="vertical" />
        </div>
        <ChatSection
          messages={messages}
          setMessages={setMessages}
          connection={connections.find((c) => c.roomGuid == selectedRoom?.guid)!}
          openAside={() => setAsideOpen(true)}
          room={selectedRoom}/>
      </div>
    </>
  );
}

export default ChatPage;