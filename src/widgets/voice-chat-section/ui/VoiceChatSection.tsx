import { useContextSelector } from "use-context-selector"
import { SelectedRoomContext } from "@/entities/Room/lib/providers/SelectedRoomProvider"
import { VoiceChatConnectionsContext } from "../lib/providers/VoiceChatConnectionsProvider";
import { VoiceChatConnection } from "../model/VoiceChatConnection";
import { HubConnectionState } from "@microsoft/signalr";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import { JoinedRoomsContext } from "@/entities/Room/lib/providers/JoinedRoomsProvider";
import { VoiceChatControlsContext } from "@/features/manage-voice-controls/lib/providers/VoiceChatControlsProvider";
import VoiceChat from "./VoiceChannel";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { Loader2 } from "lucide-react";

function VoiceChatSection() {
  let selectedRoom = useContextSelector(SelectedRoomContext, c => c.selectedRoom);
  let voiceChatConnections = useContextSelector(VoiceChatConnectionsContext, c => c.voiceChatConnections);
  let setJoinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, c => c.setJoinedVoiceConnection);
  let joinedRooms = useContextSelector(JoinedRoomsContext, c => c.joinedRooms);
  let joinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, c => c.joinedVoiceConnection);
  let selectedRoomVoiceChat = voiceChatConnections.find(c => c.roomGuid == selectedRoom.guid && c.connection.state != HubConnectionState.Disconnected);
  let isMuted = useContextSelector(VoiceChatControlsContext, c => c.isMuted);
  let isDeafened = useContextSelector(VoiceChatControlsContext, c => c.isDeafened);

  let joinVoiceChat = (connection: VoiceChatConnection) => {
    if (!connection || connection.roomGuid == joinedVoiceConnection?.roomGuid) return;

    // Leave current voice channel
    if (joinedVoiceConnection) leaveVoiceChat(joinedVoiceConnection);
    if (connection.connection.state != HubConnectionState.Connected) {
      showErrorToast("An error occurred during joining!", "Connection issues with the server.");
      return;
    }

    connection.connection.invoke<SignalRHubResponse<undefined>>("Join", isMuted, isDeafened)
      .then((response) => {
        if (response.error) throw new Error(response.error.errorCodeAsString);
        setJoinedVoiceConnection(connection);
      });
  }

  let leaveVoiceChat = (connection: VoiceChatConnection) => {
    if (!connection) return;
    setJoinedVoiceConnection(undefined);
    if (connection.connection.state != HubConnectionState.Connected) {
      showErrorToast("An error occurred during leaving!", "Connection issues with the server.");
      return;
    }

    connection.connection.invoke<SignalRHubResponse<undefined>>("Leave")
      .then((response) => {
        if (response.error) throw new Error(response.error.errorCodeAsString);
      });
  }

  return (
    <div className="flex flex-col h-full gap-2 pt-1.5">
      {joinedVoiceConnection &&
        <VoiceChat
          isJoined={true}
          voiceChatConnection={joinedVoiceConnection}
          joinVoiceChat={joinVoiceChat}
          leaveVoiceChat={leaveVoiceChat}
          roomName={joinedRooms.find(r => r.guid == joinedVoiceConnection.roomGuid)?.name!} />}
      {selectedRoomVoiceChat && (joinedVoiceConnection ? joinedVoiceConnection.roomGuid != selectedRoomVoiceChat?.roomGuid : true) && 
        <VoiceChat
          isJoined={joinedVoiceConnection != undefined && joinedVoiceConnection.roomGuid == selectedRoomVoiceChat.roomGuid}
          voiceChatConnection={selectedRoomVoiceChat}
          joinVoiceChat={joinVoiceChat}
          leaveVoiceChat={leaveVoiceChat}
          roomName={selectedRoom.name}/>}

      {(!joinedVoiceConnection && !selectedRoomVoiceChat) && 
        <div className="flex justify-center items-center w-full h-full">
          <Loader2 className='relative w-4 h-4 z-10 animate-spin m-auto'/>
        </div>
      }
    </div>
  )
}

export default VoiceChatSection