import { Separator } from "@/shared/ui/Separator";
import ChatSection from "./ChatSection";
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
import Aside from "@/widgets/aside/ui/Aside";
import { distinctMessages } from "@/entities/Message/lib/distinctMessages";
import { showInfoToast } from "@/shared/lib/showInfoToast";
import { MessagesContext } from "@/entities/Message/lib/providers/MessagesProvider";
import { useContextSelector } from 'use-context-selector';
import { JoinedRoomsContext } from "@/entities/Room/lib/providers/JoinedRoomsProvider";
import { SelectedRoomContext } from "@/entities/Room/lib/providers/SelectedRoomProvider";
import { UsersContext } from "@/entities/User/lib/providers/UsersProvider";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { ChatConnectionsContext } from "@/shared/lib/providers/ChatConnectionsProvider";

function ChatPage() {
  let joinedRooms = useContextSelector(JoinedRoomsContext, c => c.joinedRooms);
  let setJoinedRooms = useContextSelector(JoinedRoomsContext, c => c.setJoinedRooms);
  let currentUser = useContextSelector(CurrentUserContext, c => c.currentUser);
  let chatConnections = useContextSelector(ChatConnectionsContext, c => c.chatConnections);
  let setChatConnections = useContextSelector(ChatConnectionsContext, c => c.setChatConnections);
  let setMessages = useContextSelector(MessagesContext, c => c.setMessages);
  let selectedRoom = useContextSelector(SelectedRoomContext, c => c.selectedRoom);
  let setSelectedRoom = useContextSelector(SelectedRoomContext, c => c.setSelectedRoom);
  const joinedRoomsRef = useRef(joinedRooms);
  const selectedRoomRef = useRef(selectedRoom);
  let setUsers = useContextSelector(UsersContext, c => c.setUsers);
  let getJwt = useJwt();
  let [asideOpen, setAsideOpen] = useState<boolean>(false); // For mobile devices

  // Verifies that the users which are not present in the room and don't share same rooms with current user are removed from the memory
  function verifyUsersPresenceOnAllRooms() {
    if (!joinedRoomsRef.current || !currentUser) return;

    let usersToKeep: number[] = [];
    joinedRoomsRef.current.forEach((r) => {
      r.joinedUsers.forEach((u) => {
        usersToKeep.push(u.hexId);
      });
    });

    setUsers((prevUsers) => [...prevUsers.filter((u) => usersToKeep.find(userHex => userHex == u.hexId))]);
  }

  function startConnection(roomGuid: string, connection: HubConnection) {
    if (!joinedRooms || !currentUser) return;
    if (connection.state != HubConnectionState.Disconnected) return;

    connection.start()
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
            return prevMessages.map((m) =>
              m.id === message.id
                ? { ...m, content: message.content, editDate: message.editDate }
                : m
            );
          })
        );

        connection?.on("MessageGotReaction", (message: MessageModel) =>
          setMessages((prevMessages) => {
            return prevMessages.map((m) =>
              m.id === message.id ? { ...m, reactions: message.reactions } : m
            );
          })
        );
  
        connection?.on("MessageLostReaction", (message: MessageModel) =>
          setMessages((prevMessages) => {
            return prevMessages.map((m) =>
              m.id === message.id ? { ...m, reactions: message.reactions } : m
            );
          })
        );

        connection?.on("UserLeft", (hexId) => {
          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == roomGuid);
            if (target) target.joinedUsers = target.joinedUsers.filter((u) => u.hexId != hexId);
            return [...prevRooms];
          });

          // If the current user leaves, remove the connection and the room
          if (currentUser.hexId == hexId) {
            setChatConnections((prevConnections) => [...prevConnections.filter((c) => c.roomGuid != roomGuid)]);
            connection.stop();
            return;
          }
        });

        connection?.on("UserKicked", (hexId) => {
          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == roomGuid);
            if (target) target.joinedUsers = target.joinedUsers.filter((u) => u.hexId != hexId);
            return [...prevRooms];
          });

          // If the current user leaves, remove the connection and the room
          if (currentUser.hexId == hexId) {
            setChatConnections((prevConnections) => [...prevConnections.filter((c) => c.roomGuid != roomGuid)]);
            let newRooms = [...joinedRoomsRef.current.filter((r) => r.guid != roomGuid)];
            setJoinedRooms(newRooms);
            setMessages(prevMessages => prevMessages.filter(m => m.roomGuid != roomGuid));
            if (newRooms.length > 0 && selectedRoomRef.current.guid == roomGuid) setSelectedRoom(newRooms[0]);
            connection.stop();
            return;
          }
        });

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

        connection?.on("RoomRenamed", (newName) => {
          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == selectedRoom.guid);
            if (target) target.name = newName;
            return [...prevRooms];
          });
        });

        connection?.on("RoomDeleted", () => {
          setJoinedRooms((prevRooms) => [...prevRooms.filter((r) => r.guid != selectedRoom.guid)]);
          setMessages((prevMessages) => [...prevMessages.filter((m) => m.roomGuid != selectedRoom.guid)]);
        });

        connection?.on("RoomSizeChanged", (newSize) => {
          let target = joinedRoomsRef.current.find((r) => r.guid == roomGuid);
          if (target?.usedMemoryInBytes == newSize) return;
          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == roomGuid);
            if (target) {
              let prevSize = target.freeMemoryInBytes + target.usedMemoryInBytes;
              target.freeMemoryInBytes = prevSize - newSize;
              target.usedMemoryInBytes = newSize;
            }
            return [...prevRooms];
          });
        });

        connection?.on("RoomCleared", () => {
          setMessages((prevMessages) => {
            return prevMessages.map((m) => {
              if (m.roomGuid === roomGuid) {
                return { ...m, attachments: [] };
              }
              return m;
            });
          });

          // Also clears the room's memory
          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == roomGuid);
            if (target) {
              let prevSize = target.freeMemoryInBytes + target.usedMemoryInBytes;
              target.freeMemoryInBytes = prevSize;
              target.usedMemoryInBytes = 0;
            }
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

        setChatConnections((prevConnections) => {
          if (prevConnections.find((c) => c.roomGuid == r.guid)) return prevConnections;
          return [...prevConnections, { roomGuid: r.guid, connection: connection }]});
      });
    });
  }, [joinedRooms.length, currentUser]);

  useEffect(() => {
    verifyUsersPresenceOnAllRooms();
  }, [joinedRooms]);

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
          setAsideVisibility={setAsideOpen}
          room={selectedRoom}/>
      </div>
    </>
  );
}

export default ChatPage;