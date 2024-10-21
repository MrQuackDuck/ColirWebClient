import { useContextSelector } from "use-context-selector"
import VoiceChannel from "./VoiceChannel"
import { SelectedRoomContext } from "@/entities/Room/lib/providers/SelectedRoomProvider"
import { VoiceChatConnectionsContext } from "../lib/providers/VoiceChatConnectionsProvider";
import { VoiceChatConnection } from "../model/VoiceChatConnection";
import { HubConnectionState } from "@microsoft/signalr";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import { JoinedRoomsContext } from "@/entities/Room/lib/providers/JoinedRoomsProvider";

function VoiceChatSection() {
  let selectedRoom = useContextSelector(SelectedRoomContext, c => c.selectedRoom);
  let voiceChatConnections = useContextSelector(VoiceChatConnectionsContext, c => c.voiceChatConnections);
  let setJoinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, c => c.setJoinedVoiceConnection);
  let joinedRooms = useContextSelector(JoinedRoomsContext, c => c.joinedRooms);
  let joinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, c => c.joinedVoiceConnection);
  let selectedRoomVoiceChat = voiceChatConnections.find(c => c.roomGuid == selectedRoom.guid && c.connection.state != HubConnectionState.Disconnected);

  let joinVoiceChannel = (connection: VoiceChatConnection) => {
    if (!connection || connection.roomGuid == joinedVoiceConnection?.roomGuid) return;

    // Leave current voice channel
    if (joinedVoiceConnection) leaveVoiceChannel(joinedVoiceConnection);

    connection.connection.invoke<SignalRHubResponse<undefined>>("Join")
      .then((response) => {
        if (response.error) throw new Error(response.error.errorCodeAsString);
        setJoinedVoiceConnection(connection);
      });
  }

  let leaveVoiceChannel = (connection: VoiceChatConnection) => {
    if (!connection) return;
    setJoinedVoiceConnection(undefined);
    connection.connection.invoke<SignalRHubResponse<undefined>>("Leave")
      .then((response) => {
        if (response.error) throw new Error(response.error.errorCodeAsString);
      });
  }

  return (
    <div className="flex flex-col gap-2 pt-1.5">
      {joinedVoiceConnection && joinedVoiceConnection.roomGuid != selectedRoomVoiceChat?.roomGuid &&
        <VoiceChannel
          isJoined={true}
          voiceChatConnection={joinedVoiceConnection}
          joinVoiceChannel={joinVoiceChannel}
          leaveVoiceChannel={leaveVoiceChannel}
          roomName={joinedRooms.find(r => r.guid == joinedVoiceConnection.roomGuid)?.name!} />}
      {selectedRoomVoiceChat && 
        <VoiceChannel
          isJoined={joinedVoiceConnection != undefined && joinedVoiceConnection.roomGuid == selectedRoomVoiceChat.roomGuid}
          voiceChatConnection={selectedRoomVoiceChat}
          joinVoiceChannel={joinVoiceChannel}
          leaveVoiceChannel={leaveVoiceChannel}
          roomName={selectedRoom.name}/>}
    </div>
  )
}

export default VoiceChatSection