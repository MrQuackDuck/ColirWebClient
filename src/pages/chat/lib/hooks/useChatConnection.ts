import { useEffect, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { API_URL } from "@/shared/api";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { MessageModel } from "@/entities/Message/model/MessageModel";
import { GetLastMessagesModel } from "@/entities/Message/model/request/GetLastMessagesModel";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import { UserModel } from "@/entities/User/model/UserModel";
import { useJwt } from "@/shared/lib/hooks/useJwt";
import { showInfoToast } from "@/shared/lib/showInfoToast";
import { distinctMessages } from "@/entities/Message/lib/distinctMessages";

export const useChatConnection = (
  currentUser,
  joinedRooms,
  setJoinedRooms,
  setChatConnections,
  setMessages,
  setUsers,
  selectedRoom,
  setSelectedRoom
) => {
  const getJwt = useJwt();
  const joinedRoomsRef = useRef(joinedRooms);
  const selectedRoomRef = useRef(selectedRoom);

  useEffect(() => {
    joinedRoomsRef.current = joinedRooms;
    selectedRoomRef.current = selectedRoom;
  }, [joinedRooms, selectedRoom]);

  const verifyUsersPresenceOnAllRooms = () => {
    if (!joinedRoomsRef.current || !currentUser) return;

    let usersToKeep: number[] = [];
    joinedRoomsRef.current.forEach((r) => {
      r.joinedUsers.forEach((u) => {
        usersToKeep.push(u.hexId);
      });
    });

    setUsers((prevUsers) => [...prevUsers.filter((u) => usersToKeep.find(userHex => userHex == u.hexId))]);
  };

  const startChatConnection = (roomGuid: string, connection: HubConnection) => {
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

        // Set up all the event listeners
        connection.on("ReceiveMessage", (message: MessageModel) => setMessages((prevMessages) => [...prevMessages, message]));
        connection.on("MessageDeleted", (messageId: number) => setMessages((prevMessages) => [...prevMessages.filter((m) => m.id != messageId)]));
        connection.on("MessageEdited", (message: MessageModel) =>
          setMessages((prevMessages) => {
            return prevMessages.map((m) =>
              m.id === message.id
                ? { ...m, content: message.content, editDate: message.editDate }
                : m
            );
          })
        );

        connection.on("MessageGotReaction", (message: MessageModel) =>
          setMessages((prevMessages) => {
            return prevMessages.map((m) =>
              m.id === message.id ? { ...m, reactions: message.reactions } : m
            );
          })
        );
  
        connection.on("MessageLostReaction", (message: MessageModel) =>
          setMessages((prevMessages) => {
            return prevMessages.map((m) =>
              m.id === message.id ? { ...m, reactions: message.reactions } : m
            );
          })
        );

        connection.on("UserJoined", (user: UserModel) => {
          if (currentUser.hexId == user.hexId) return;
          if (selectedRoomRef?.current?.guid == roomGuid) showInfoToast("User joined", `${user.username} has joined the room.`);
          setUsers((prevUsers) => [...prevUsers, user]);
          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == roomGuid);
            target?.joinedUsers.push(user);
            return [...prevRooms];
          });
        });

        connection.on("UserLeft", (hexId) => {
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

        connection.on("UserKicked", (hexId) => {
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

        connection.on("RoomRenamed", (newName) => {
          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == selectedRoomRef.current.guid);
            if (target) target.name = newName;
            return [...prevRooms];
          });
        });

        connection.on("RoomDeleted", () => {
          setJoinedRooms((prevRooms) => [...prevRooms.filter((r) => r.guid != selectedRoomRef.current.guid)]);
          setMessages((prevMessages) => [...prevMessages.filter((m) => m.roomGuid != selectedRoomRef.current.guid)]);
        });

        connection.on("RoomSizeChanged", (newSize) => {
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

        connection.on("RoomCleared", () => {
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

        connection.on("UserRenamed", ({ hexId, newName }) => {
          setUsers((prevUsers) => {
            return prevUsers.map((u) => {
              if (u.hexId == hexId) {
                return { ...u, username: newName };
              }
              return u;
            });
          });

          setJoinedRooms((prevRooms) => {
            prevRooms.forEach((r) => {
              r.joinedUsers.forEach((u) => {
                if (u.hexId == hexId) u.username = newName;
              });
            });
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
  };

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
          return [...prevConnections, { roomGuid: r.guid, connection: connection }];
        });
      });
    });
  }, [joinedRooms.length, currentUser]);

  useEffect(() => {
    verifyUsersPresenceOnAllRooms();
  }, [joinedRooms]);

  return { startChatConnection };
};