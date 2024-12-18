import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { useContextSelector } from "use-context-selector";

import joinAudio from "@/assets/audio/join.mp3";
import leaveAudio from "@/assets/audio/leave.mp3";
import { API_URL } from "@/shared/api";
import { AccessTokenFactory, NotificationsSettingsContext, useJwt } from "@/shared/lib";
import { SignalRHubResult, SignalRResultType } from "@/shared/model";
import { VoiceChatConnection, VoiceChatUser } from "@/widgets/voice-chat-section";

export const useVoiceChatConnection = (
  currentUser,
  joinedRooms,
  selectedRoom,
  joinedVoiceConnection,
  setJoinedVoiceConnection,
  setVoiceChatConnections: React.Dispatch<React.SetStateAction<VoiceChatConnection[]>>
) => {
  const getJwt = useJwt();
  const joinedRoomsRef = useRef(joinedRooms);
  const joinedVoiceConnectionRef = useRef(joinedVoiceConnection);
  const selectedRoomRef = useRef(selectedRoom);
  const joinSoundVolume = useContextSelector(NotificationsSettingsContext, (c) => c.joinLeaveVolume);
  const isJoinLeaveSoundDisabled = useContextSelector(NotificationsSettingsContext, (c) => c.isJoinLeaveSoundDisabled);

  const joinSoundVolumeRef = useRef(joinSoundVolume);
  const isJoinLeaveSoundDisabledRef = useRef(isJoinLeaveSoundDisabled);

  useEffect(() => {
    joinSoundVolumeRef.current = joinSoundVolume;
    isJoinLeaveSoundDisabledRef.current = isJoinLeaveSoundDisabled;
  }, [joinSoundVolume, isJoinLeaveSoundDisabled]);

  const playJoinSound = () => {
    if (isJoinLeaveSoundDisabledRef.current) return;
    const audio = new Audio(joinAudio);
    audio.volume = joinSoundVolumeRef.current / 100;
    audio.play();
  };

  const playLeaveSound = () => {
    const audio = new Audio(leaveAudio);
    audio.volume = 0.5;
    audio.play();
  };

  useEffect(() => {
    joinedRoomsRef.current = joinedRooms;
    joinedVoiceConnectionRef.current = joinedVoiceConnection;
    selectedRoomRef.current = selectedRoom;
  }, [joinedRooms, joinedVoiceConnection, selectedRoom]);

  const startVoiceConnection = (roomGuid: string, connection: HubConnection) => {
    if (!joinedRooms || !currentUser) return;
    if (joinedRoomsRef.current.find((r) => r.guid === roomGuid) === undefined) return;
    if (connection.state != HubConnectionState.Disconnected) return;

    connection.start().then(() => {
      // Getting voice chat users
      connection.invoke<SignalRHubResult<VoiceChatUser[]>>("GetVoiceChatUsers").then((response) => {
        if (response.resultType == SignalRResultType.Error) throw new Error(response.error.errorCodeAsString);
        const users = response.content;
        setVoiceChatConnections((prevConnections) => {
          const connectionToUpdate = prevConnections.find((c) => c.connection === connection);
          if (!connectionToUpdate) return prevConnections;
          connectionToUpdate.joinedUsers = users;
          return [...prevConnections];
        });
      });

      connection.on("UserJoined", (user: VoiceChatUser) => {
        if (user.hexId !== currentUser.hexId && joinedVoiceConnectionRef.current && roomGuid === joinedVoiceConnectionRef.current.roomGuid) playJoinSound();
        setVoiceChatConnections((prevConnections) => {
          const connectionToUpdate = prevConnections.find((c) => c.connection === connection);
          if (!connectionToUpdate) return prevConnections;
          connectionToUpdate.joinedUsers.push(user);
          return [...prevConnections];
        });
      });

      connection.on("UserLeft", (userHexId: number) => {
        if (userHexId !== currentUser.hexId && joinedVoiceConnectionRef.current && roomGuid === joinedVoiceConnectionRef.current.roomGuid) playLeaveSound();
        setVoiceChatConnections((prevConnections) => {
          const connectionToUpdate = prevConnections.find((c) => c.connection === connection);
          if (!connectionToUpdate) return prevConnections;
          connectionToUpdate.joinedUsers = connectionToUpdate.joinedUsers.filter((u) => u.hexId !== userHexId);
          return [...prevConnections];
        });
      });

      connection.on("UserMuted", (userHexId: number) => {
        setVoiceChatConnections((prevConnections) => {
          const connectionToUpdate = prevConnections.find((c) => c.connection === connection);
          if (!connectionToUpdate) return prevConnections;
          const user = connectionToUpdate.joinedUsers.find((u) => u.hexId === userHexId);
          if (user) user.isMuted = true;
          return [...prevConnections];
        });
      });

      connection.on("UserUnmuted", (userHexId: number) => {
        setVoiceChatConnections((prevConnections) => {
          const connectionToUpdate = prevConnections.find((c) => c.connection === connection);
          if (!connectionToUpdate) return prevConnections;
          const user = connectionToUpdate.joinedUsers.find((u) => u.hexId === userHexId);
          if (user) user.isMuted = false;
          return [...prevConnections];
        });
      });

      connection.on("UserDeafened", (userHexId: number) => {
        setVoiceChatConnections((prevConnections) => {
          const connectionToUpdate = prevConnections.find((c) => c.connection === connection);
          if (!connectionToUpdate) return prevConnections;
          const user = connectionToUpdate.joinedUsers.find((u) => u.hexId === userHexId);
          if (user) user.isDeafened = true;
          return [...prevConnections];
        });
      });

      connection.on("UserUndeafened", (userHexId: number) => {
        setVoiceChatConnections((prevConnections) => {
          const connectionToUpdate = prevConnections.find((c) => c.connection === connection);
          if (!connectionToUpdate) return prevConnections;
          const user = connectionToUpdate.joinedUsers.find((u) => u.hexId === userHexId);
          if (user) user.isDeafened = false;
          return [...prevConnections];
        });
      });

      connection.onclose(() => {
        if (joinedVoiceConnectionRef.current.roomGuid === roomGuid) setJoinedVoiceConnection(null);

        setVoiceChatConnections((prevConnections) => {
          const connectionToUpdate = prevConnections.find((c) => c.connection === connection);
          if (!connectionToUpdate) return prevConnections;
          connectionToUpdate.joinedUsers = [];
          return [...prevConnections];
        });
      });

      // On reconnect, refresh the users
      connection.onreconnected(() => {
        connection.invoke<SignalRHubResult<VoiceChatUser[]>>("GetVoiceChatUsers").then((response) => {
          if (response.resultType == SignalRResultType.Error) throw new Error(response.error.errorCodeAsString);
          const users = response.content;
          setVoiceChatConnections((prevConnections) => {
            const connectionToUpdate = prevConnections.find((c) => c.connection === connection);
            if (!connectionToUpdate) return prevConnections;
            connectionToUpdate.joinedUsers = users;
            return [...prevConnections];
          });
        });
      });
    });
  };

  // Pushes a new connection to the voice chat connections array
  useEffect(() => {
    if (!joinedRooms) return;

    const tokenFactory: AccessTokenFactory = new AccessTokenFactory(getJwt, 60);
    joinedRooms.forEach((room) => {
      const connection = new HubConnectionBuilder()
        .withUrl(`${API_URL}/VoiceChat?roomGuid=${room.guid}`, {
          accessTokenFactory: () => tokenFactory.getAccessToken()
        })
        .withAutomaticReconnect(Array.from({ length: 20 }, () => 1000))
        .build();

      setVoiceChatConnections((prevConnections) => {
        if (prevConnections.find((c) => c.roomGuid === room.guid)) return prevConnections;
        return [...prevConnections, { roomGuid: room.guid, connection, joinedUsers: [] }];
      });
    });
  }, [joinedRooms.length, currentUser]);

  return { startVoiceConnection };
};
