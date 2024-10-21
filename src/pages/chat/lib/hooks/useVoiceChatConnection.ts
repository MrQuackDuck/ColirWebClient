import { API_URL } from "@/shared/api";
import { useJwt } from "@/shared/lib/hooks/useJwt";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import { SignalRResultType } from "@/shared/model/response/SignalRResultType";
import { VoiceChatConnection } from "@/widgets/voice-chat-section/model/VoiceChatConnection";
import { VoiceChatUser } from "@/widgets/voice-chat-section/model/VoiceChatUser";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useRef } from "react";

export const useVoiceChatConnection = (
  currentUser,
  joinedRooms,
  selectedRoom,
  setVoiceChatConnections: React.Dispatch<React.SetStateAction<VoiceChatConnection[]>>
) => {
  const getJwt = useJwt();
  const joinedRoomsRef = useRef(joinedRooms);
  const selectedRoomRef = useRef(selectedRoom);

  useEffect(() => {
    joinedRoomsRef.current = joinedRooms;
    selectedRoomRef.current = selectedRoom;
  }, [joinedRooms, selectedRoom]);

  const startVoiceConnection = (roomGuid: string, connection: HubConnection) => {
    if (!joinedRooms || !currentUser) return;
    if (joinedRoomsRef.current.find((r) => r.guid === roomGuid) === undefined) return;
    if (connection.state != HubConnectionState.Disconnected) return;

    connection.start()
      .then(() => {
        // Getting voice chat users
        connection.invoke<SignalRHubResponse<VoiceChatUser[]>>("GetVoiceChatUsers")
          .then((response) => {
            if (response.resultType == SignalRResultType.Error) throw new Error(response.error.errorCodeAsString);
            let users = response.content;
            setVoiceChatConnections((prevConnections) => {
              let connectionToUpdate = prevConnections.find((c) => c.connection === connection);
              if (!connectionToUpdate) return prevConnections;
              connectionToUpdate.joinedUsers = users;
              return [...prevConnections];
            });
          });

          connection.on("UserJoined", (user: VoiceChatUser) => {
            setVoiceChatConnections((prevConnections) => {
              let connectionToUpdate = prevConnections.find((c) => c.connection === connection);
              if (!connectionToUpdate) return prevConnections;
              connectionToUpdate.joinedUsers.push(user);
              return [...prevConnections];
            });
          });

          connection.on("UserLeft", (userHexId: number) => {
            setVoiceChatConnections((prevConnections) => {
              let connectionToUpdate = prevConnections.find((c) => c.connection === connection);
              if (!connectionToUpdate) return prevConnections;
              connectionToUpdate.joinedUsers = connectionToUpdate.joinedUsers.filter((u) => u.hexId !== userHexId);
              return [...prevConnections];
            });
          });

          connection.on("UserMuted", (userHexId: number) => {
            setVoiceChatConnections((prevConnections) => {
              let connectionToUpdate = prevConnections.find((c) => c.connection === connection);
              if (!connectionToUpdate) return prevConnections;
              let user = connectionToUpdate.joinedUsers.find((u) => u.hexId === userHexId);
              if (user) user.isMuted = true;
              return [...prevConnections];
            });
          });

          connection.on("UserUnmuted", (userHexId: number) => {
            setVoiceChatConnections((prevConnections) => {
              let connectionToUpdate = prevConnections.find((c) => c.connection === connection);
              if (!connectionToUpdate) return prevConnections;
              let user = connectionToUpdate.joinedUsers.find((u) => u.hexId === userHexId);
              if (user) user.isMuted = false;
              return [...prevConnections];
            });
          });

          connection.on("UserDeafened", (userHexId: number) => {
            setVoiceChatConnections((prevConnections) => {
              let connectionToUpdate = prevConnections.find((c) => c.connection === connection);
              if (!connectionToUpdate) return prevConnections;
              let user = connectionToUpdate.joinedUsers.find((u) => u.hexId === userHexId);
              if (user) user.isDeafened = true;
              return [...prevConnections];
            });
          });

          connection.on("UserUndeafened", (userHexId: number) => {
            setVoiceChatConnections((prevConnections) => {
              let connectionToUpdate = prevConnections.find((c) => c.connection === connection);
              if (!connectionToUpdate) return prevConnections;
              let user = connectionToUpdate.joinedUsers.find((u) => u.hexId === userHexId);
              if (user) user.isDeafened = false;
              return [...prevConnections];
            });
          });
      });
  }

  // Pushes a new connection to the voice chat connections array
  useEffect(() => {
    if (!joinedRooms) return;

    getJwt().then((jwt) => {
      joinedRooms.forEach((room) => {
        let connection = new HubConnectionBuilder()
          .withUrl(`${API_URL}/VoiceChat?roomGuid=${room.guid}`, {
            accessTokenFactory: () => jwt,
          })
          .build();

        setVoiceChatConnections((prevConnections) => {
          if (prevConnections.find((c) => c.roomGuid === room.guid)) return prevConnections;
          return [...prevConnections, { roomGuid: room.guid, connection, joinedUsers: [] }];
        });
      });
    });
  }, [joinedRooms.length, currentUser]);

  return { startVoiceConnection };
}