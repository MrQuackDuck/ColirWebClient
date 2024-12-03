import { useEffect, useRef } from "react";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { API_URL } from "@/shared/api";
import { MessageModel } from "@/entities/Message/model/MessageModel";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import { UserModel } from "@/entities/User/model/UserModel";
import { useJwt } from "@/shared/lib/hooks/useJwt";
import { distinctMessages } from "@/entities/Message/lib/distinctMessages";
import pingAudio from "../../../../assets/audio/ping.mp3";
import { DetailedUserModel } from "@/entities/User/model/DetailedUserModel";
import { RoomModel } from "@/entities/Room/model/RoomModel";
import { ChatConnection } from "@/widgets/chat-section/models/ChatConnection";
import { useContextSelector } from "use-context-selector";
import { NotificationsSettingsContext } from "@/shared/lib/providers/NotificationsSettingsProvider";
import { useErrorToast } from "@/shared/lib/hooks/useErrorToast";
import { useInfoToast } from "@/shared/lib/hooks/useInfoToast";

export const useChatConnection = (
  currentUser: DetailedUserModel | null,
  joinedRooms: RoomModel[],
  setJoinedRooms: React.Dispatch<React.SetStateAction<RoomModel[]>>,
  setChatConnections: React.Dispatch<React.SetStateAction<ChatConnection[]>>,
  setMessages: React.Dispatch<React.SetStateAction<MessageModel[]>>,
  setUnreadReplies: React.Dispatch<React.SetStateAction<MessageModel[]>>,
  setUsers: React.Dispatch<React.SetStateAction<UserModel[]>>,
  selectedRoom: RoomModel,
  setSelectedRoom: React.Dispatch<React.SetStateAction<RoomModel>>
) => {
  const showInfoToast = useInfoToast();
  const showErrorToast = useErrorToast();
  const getJwt = useJwt();
  const joinedRoomsRef = useRef(joinedRooms);
  const selectedRoomRef = useRef(selectedRoom);

  const pingSoundVolume = useContextSelector(NotificationsSettingsContext, (c) => c.pingVolume);
  const isPingSoundDisabled = useContextSelector(NotificationsSettingsContext, (c) => c.isPingSoundDisabled);

  const isPingSoundDisabledRef = useRef(isPingSoundDisabled);
  const pingSoundVolumeRef = useRef(pingSoundVolume);
  useEffect(() => {
    isPingSoundDisabledRef.current = isPingSoundDisabled;
    pingSoundVolumeRef.current = pingSoundVolume;
  }, [pingSoundVolume, isPingSoundDisabled]);

  useEffect(() => {
    joinedRoomsRef.current = joinedRooms;
    selectedRoomRef.current = selectedRoom;
  }, [joinedRooms, selectedRoom]);

  const playPingSound = () => {
    if (isPingSoundDisabledRef.current) return;
    let audio = new Audio(pingAudio);
    audio.volume = pingSoundVolumeRef.current / 100;
    audio.play();
  };

  const verifyUsersPresenceOnAllRooms = () => {
    if (!joinedRoomsRef.current || !currentUser) return;

    let usersToKeep: number[] = [];
    joinedRoomsRef.current.forEach((r) => {
      r.joinedUsers.forEach((u) => {
        usersToKeep.push(u.hexId);
      });
    });

    setUsers((prevUsers) => [...prevUsers.filter((u) => usersToKeep.find((userHex) => userHex == u.hexId))]);
  };

  const startChatConnection = (roomGuid: string, connection: HubConnection) => {
    if (!joinedRooms || !currentUser) return;
    if (connection.state != HubConnectionState.Disconnected) return;

    connection
      .start()
      .then(() => {
        // Getting the last message
        connection.invoke<SignalRHubResponse<MessageModel[]>>("GetMessages", { count: 1, skipCount: 0 }).then((lastMessageResponse) => {
          // Getting possible unread messages
          connection.invoke<SignalRHubResponse<MessageModel[]>>("GetUnreadRepliesAsync").then((unreadRepliedResponse) => {
            // If there any unread messages, fetch the whole range of messages from the first unread to the last message
            if (unreadRepliedResponse.content.length > 0) {
              setUnreadReplies((prevUnreadReplies) => [...prevUnreadReplies, ...unreadRepliedResponse.content]);
              let lastMessage = lastMessageResponse.content[0];
              let firstUnreadMessage = unreadRepliedResponse.content[0];
              connection.invoke<SignalRHubResponse<MessageModel[]>>("GetMessagesRange", { startId: firstUnreadMessage.id, endId: lastMessage.id }).then((response) => {
                setMessages((prevMessages) => {
                  if (!response?.content) return prevMessages;
                  return distinctMessages([...prevMessages, ...response.content]);
                });
              });
            }
            // If not just fetch the last 50 messages
            else {
              connection.invoke<SignalRHubResponse<MessageModel[]>>("GetMessages", { count: 25, skipCount: 0 }).then((response) => {
                setMessages((prevMessages) => {
                  if (!response?.content) return prevMessages;
                  return distinctMessages([...prevMessages, ...response.content]);
                });
              });
            }
          });
        });

        // Set up all the event listeners
        connection.on("ReceiveMessage", (message: MessageModel) => {
          // Add message to the unread replies if it's a reply to the current user and it's not in the current room
          if (message.repliedMessage && message.repliedMessage.authorHexId == currentUser.hexId && selectedRoomRef?.current?.guid != message.roomGuid) {
            setUnreadReplies((prevUnreadReplies) => [...prevUnreadReplies, message]);
            playPingSound();
          }

          setMessages((prevMessages) => [...prevMessages, message]);
        });

        connection.on("MessageDeleted", (messageId: number) => {
          setUnreadReplies((prevUnreadReplies) => prevUnreadReplies.filter((m) => m.id != messageId));
          setMessages((prevMessages) => [...prevMessages.filter((m) => m.id != messageId)]);
        });

        connection.on("MessageEdited", (message: MessageModel) =>
          setMessages((prevMessages) => {
            return prevMessages.map((m) => (m.id === message.id ? { ...m, content: message.content, editDate: message.editDate } : m));
          })
        );

        connection.on("MessageGotReaction", (message: MessageModel) =>
          setMessages((prevMessages) => {
            return prevMessages.map((m) => (m.id === message.id ? { ...m, reactions: message.reactions } : m));
          })
        );

        connection.on("MessageLostReaction", (message: MessageModel) =>
          setMessages((prevMessages) => {
            return prevMessages.map((m) => (m.id === message.id ? { ...m, reactions: message.reactions } : m));
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
            setMessages((prevMessages) => prevMessages.filter((m) => m.roomGuid != roomGuid));
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
            if (prevUsers.find((u) => u.hexId == hexId)?.username == newName) return prevUsers;
            return prevUsers.map((u) => (u.hexId == hexId ? { ...u, username: newName } : u));
          });
          setJoinedRooms((prevRooms) =>
            prevRooms.map((room) => ({
              ...room,
              joinedUsers: room.joinedUsers.map((u) => (u.hexId == hexId ? { ...u, username: newName } : u))
            }))
          );
        });

        connection.on("UserDeleted", (hexId) => {
          setJoinedRooms((prevRooms) => {
            let target = prevRooms.find((r) => r.guid == roomGuid);
            if (target) target.joinedUsers = target.joinedUsers.filter((u) => u.hexId != hexId);
            return [...prevRooms];
          });
        });
      })
      .catch((e) => {
        showErrorToast(`Couldn't connect to the room`, `We weren't able to establish a connection. Error: ${e}.`);
      });

    connection.onclose(() => {
      connection.off("ReceiveMessage");
      connection.off("MessageDeleted");
      connection.off("MessageEdited");
      connection.off("MessageGotReaction");
      connection.off("MessageLostReaction");
      connection.off("UserJoined");
      connection.off("UserLeft");
      connection.off("UserKicked");
      connection.off("RoomRenamed");
      connection.off("RoomDeleted");
      connection.off("RoomSizeChanged");
      connection.off("RoomCleared");
      connection.off("UserRenamed");
      connection.off("UserDeleted");
    });
  };

  useEffect(() => {
    if (!joinedRooms) return;

    verifyUsersPresenceOnAllRooms();
    getJwt().then((jwt) => {
      joinedRooms.map((r) => {
        let connection = new HubConnectionBuilder()
          .withUrl(`${API_URL}/Chat?roomGuid=${r.guid}`, {
            accessTokenFactory: () => jwt
          })
          .withAutomaticReconnect(Array.from({ length: 20 }, () => 1000))
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
