import { Separator } from "@/shared/ui/Separator";
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
import RoomService from "@/entities/Room/api/RoomService";
import { UserModel } from "@/entities/User/model/UserModel";
import { useJwt } from "@/shared/lib/hooks/useJwt";
import { useJoinedRooms } from "@/entities/Room/lib/hooks/useJoinedRooms";
import { useUsers } from "@/entities/User/lib/hooks/useUsers";
import Aside from "@/widgets/aside/ui/Aside";
import { distinctUsers } from "@/entities/User/lib/distinctUsers";
import { distinctMessages } from "@/entities/Message/lib/distinctMessages";

export interface Connection {
  roomGuid: string;
  connection: HubConnection;
}

function ChatPage() {
  let { currentUser } = useCurrentUser();
  let [connections, setConnections] = useState<Connection[]>([]);
  let [messages, setMessages] = useState<MessageModel[]>([]);
  let { joinedRooms, setJoinedRooms } = useJoinedRooms();
  let [selectedRoom, setSelectedRoom] = useState<string>(joinedRooms[0].guid ?? "");
  let { setUsers } = useUsers();
  let getJwt = useJwt();
  let [asideOpen, setAsideOpen] = useState<boolean>(false); // For mobile devices

  const updateUsers = async () => {
    let pendingUsers: any[] = [];
    joinedRooms.map(async (r) => {
      await RoomService.GetRoomInfo({ roomGuid: r.guid }).then(
        (roomInfoResponse) => {
          pendingUsers = distinctUsers([
            ...pendingUsers,
            ...roomInfoResponse.data.joinedUsers,
          ]);
          setUsers(pendingUsers);
        }
      );
    });
  };

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

            // Getting the list of replied messages
            response.content.map((m) => {
              if (!m.repliedMessageId) return;
              connection.invoke<SignalRHubResponse<MessageModel>>("GetMessageById", { messageId: m.repliedMessageId })
                .then((resp) => {
                  setMessages((prevMessages) =>
                    distinctMessages([...prevMessages, resp.content])
                  );
                });
            });
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
          setUsers((prevUsers) => [...prevUsers, user]);
          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == roomGuid);
            target?.joinedUsers.push(user);
            return [...prevRooms];
          });
        });

        connection?.on("UserLeft", (hexId) => {
          if (currentUser.hexId == hexId) {
            setConnections((prevConnections) => [
              ...prevConnections.filter((c) => c.roomGuid != roomGuid),
            ]);
            connection.stop();
            return;
          }

          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == roomGuid);
            if (target)
              target.joinedUsers = target.joinedUsers.filter(
                (u) => u.hexId != hexId
              );

            // Checking if the user is present on other rooms with current user
            // If present, don't delete the user from memory
            let isUserPresent = false;
            joinedRooms.forEach((r) => {
              if (r.joinedUsers.find((u) => u.hexId == hexId)) {
                isUserPresent = true;
              }
            });

            if (!isUserPresent) {
              setUsers((prevUsers) => [
                ...prevUsers.filter((u) => u.hexId != hexId),
              ]);
            }

            return [...prevRooms];
          });
        });

        connection?.on("UserKicked", (hexId) => {
          if (currentUser.hexId == hexId) {
            setConnections((prevConnections) => [
              ...prevConnections.filter((c) => c.roomGuid != roomGuid),
            ]);
            connection.stop();
            return;
          }

          setUsers((prevUsers) => [
            ...prevUsers.filter((u) => u.hexId != hexId),
          ]);
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
            let target = prevRooms.find((r) => r.guid == selectedRoom);
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

    updateUsers().then(() => {
      joinedRooms.map((r) => {
        // Return if the connection is already registered
        if (connections.find((c) => c.roomGuid == r.guid)) return;

        getJwt().then((jwt) => {
          let connection = new HubConnectionBuilder()
            .withUrl(`${API_URL}/Chat?roomGuid=${r.guid}`, {
              accessTokenFactory: () => jwt,
            })
            .withAutomaticReconnect([5000, 5000, 6000, 6000])
            .build();

          setConnections((prevConnections) => [
            ...prevConnections,
            { roomGuid: r.guid, connection: connection },
          ]);
        });
      });
    });
  }, [joinedRooms.length]);

  useEffect(() => {
    if (!connections) return;

    let mappedConnections: string[] = [];
    connections.map((c) => {
      if (
        connections.find((c) => c.roomGuid == selectedRoom)?.connection.state ==
        HubConnectionState.Connected
      )
        return;
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
          <Aside
            rooms={joinedRooms}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
          />
        </SheetContent>
      </Sheet>
      <div className={`flex flex-row items-start gap-2 h-full px-[8.5vw] pb-[2vh] animate-appearance opacity-25 ${classes.chat}`}>
        <div className={`flex flex-row w-[100%] h-[100%] max-w-[250px] p-2.5 ${classes.asideSection}`}>
          <Aside
            rooms={joinedRooms}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
          />
          <Separator orientation="vertical" />
        </div>
        <ChatSection
          messages={messages}
          setMessages={setMessages}
          connection={connections.find((c) => c.roomGuid == selectedRoom)!}
          openAside={() => setAsideOpen(true)}
          room={joinedRooms.find((r) => r.guid == selectedRoom)!}/>
      </div>
    </>
  );
}

export default ChatPage;