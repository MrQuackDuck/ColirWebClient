import { useContextSelector } from "use-context-selector"
import { SelectedRoomContext } from "@/entities/Room/lib/providers/SelectedRoomProvider"
import { VoiceChatConnectionsContext } from "../lib/providers/VoiceChatConnectionsProvider";
import { VoiceChatConnection } from "../model/VoiceChatConnection";
import { HubConnectionState } from "@microsoft/signalr";
import { SignalRHubResponse } from "@/shared/model/response/SignalRHubResult";
import { JoinedRoomsContext } from "@/entities/Room/lib/providers/JoinedRoomsProvider";
import { VoiceChatControlsContext } from "@/features/manage-voice-controls/lib/providers/VoiceChatControlsProvider";
import VoiceChat from "./VoiceChat";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EncryptionKeysContext } from "@/shared/lib/providers/EncryptionKeysProvider";
import { decryptString, encryptString } from "@/shared/lib/utils";
import { blobToString } from "../lib/blobToString";
import { stringToBlob } from "../lib/stringToBlob";
import { UserAudioTrack } from "../model/UserAudioTrack";
import { UsersVolumeContext } from "@/features/control-user-volume/lib/providers/UsersVolumeProvider";
import { CurrentlyTalkingUser } from "../model/CurrentlyTalkingUser";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import useSound from 'use-sound';
import leaveAudio from "../../../assets/audio/leave.mp3";
import { usePlayJoinSound } from "@/shared/lib/hooks/usePlayJoinSound";

function VoiceChatSection() {
  let currentUser = useContextSelector(CurrentUserContext, c => c.currentUser);
  let selectedRoom = useContextSelector(SelectedRoomContext, c => c.selectedRoom);
  let voiceChatConnections = useContextSelector(VoiceChatConnectionsContext, c => c.voiceChatConnections);
  let setJoinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, c => c.setJoinedVoiceConnection);
  let joinedRooms = useContextSelector(JoinedRoomsContext, c => c.joinedRooms);
  let joinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, c => c.joinedVoiceConnection);
  let selectedRoomVoiceChat = voiceChatConnections.find(c => c.roomGuid == selectedRoom.guid && c.connection.state != HubConnectionState.Disconnected);
  let isMuted = useContextSelector(VoiceChatControlsContext, c => c.isMuted);
  let setIsMuted = useContextSelector(VoiceChatControlsContext, c => c.setIsMuted);
  let isDeafened = useContextSelector(VoiceChatControlsContext, c => c.isDeafened);
  let getEncryptionKey = useContextSelector(EncryptionKeysContext, c => c.getEncryptionKey);
  let [currentlyTalkingUsers, setCurrentlyTalkingUsers] = useState<CurrentlyTalkingUser[]>([]);
  const userVolumes = useContextSelector(UsersVolumeContext, c => c.userVolumes);
  const playJoinSound = usePlayJoinSound();
  const [playLeaveSound] = useSound(leaveAudio, { volume: 0.5 });

  let isMutedRef = useRef(isMuted);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  let isDeafenedRef = useRef(isDeafened);
  useEffect(() => { isDeafenedRef.current = isDeafened; }, [isDeafened]);

  let currentUserRef = useRef(currentUser);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  let joinedVoiceConnectionRef = useRef(joinedVoiceConnection);
  useEffect(() => { joinedVoiceConnectionRef.current = joinedVoiceConnection; }, [joinedVoiceConnection]);
  
  const keyChangeTrigger = useContextSelector(EncryptionKeysContext, c => c.changeTrigger);
  const joinedVoiceKeyRef = useRef<string>(getEncryptionKey(joinedVoiceConnectionRef.current?.roomGuid ?? "") ?? "");
  useEffect(() => {
    joinedVoiceKeyRef.current = getEncryptionKey(joinedVoiceConnectionRef.current?.roomGuid ?? "") ?? "";
  }, [keyChangeTrigger, joinedVoiceConnection]);

  let mediaRecorderRef = useRef<MediaRecorder | null>(null);
  let mediaStreamRef = useRef<MediaStream | null>(null);

  const userVolumesRef = useRef(userVolumes);
  useEffect(() => { userVolumesRef.current = userVolumes; }, [userVolumes]);

  let [currentlyPlayingAudioTracks, setCurrentlyPlayingAudioTracks] = useState<UserAudioTrack[]>([]);

  useEffect(() => {
    currentlyPlayingAudioTracks.forEach(track => {
      if (track.userHexId == currentUserRef.current?.hexId) {
        track.track.volume = 0;
        return;
      }
      track.track.volume = userVolumes[track.userHexId] != undefined ? userVolumes[track.userHexId] / 100 : 1;
    });
  }, [userVolumes]);

  async function startRecording() {
    // Clean up any existing streams and recorders
    await cleanupMediaStream();

    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
    } catch (error) {
      showErrorToast("An error occurred!", "Failed to get the permission to record audio.");
      setIsMuted(true);
      return;
    }

    mediaStreamRef.current = stream;
    const mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 128000,
    });
    mediaRecorderRef.current = mediaRecorder;

    let audioChunks: Blob[] = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
      if (audioChunks.length === 0) return;
      
      let audioBlob = new Blob(audioChunks);
      
      if (!joinedVoiceConnectionRef.current) return;

      let encryptionKey = joinedVoiceKeyRef.current;
      let blobAsString = await blobToString(audioBlob);

      if (!await isAudioTooQuiet(audioBlob)) {        
        joinedVoiceConnectionRef.current?.connection.invoke<SignalRHubResponse<undefined>>(
          "SendVoiceSignal", 
          encryptString(blobAsString, encryptionKey)
        );
      }

      if (isMutedRef.current || !joinedVoiceConnectionRef.current) return;

      // Reset audio chunks
      audioChunks = [];

      // Only start a new recording if we still have an active connection
      if (mediaRecorderRef.current === mediaRecorder) {
        mediaRecorder.start();
        setTimeout(() => {
          if (mediaRecorderRef.current === mediaRecorder) mediaRecorder.stop();
        }, 300);
      }
    });

    mediaRecorder.start();
    setTimeout(() => {
      if (mediaRecorderRef.current === mediaRecorder) mediaRecorder.stop();
    }, 300);
  }

  async function isAudioTooQuiet(audioChunk: Blob, threshold = -50): Promise<boolean> {
    const arrayBuffer = await audioChunk.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);
    
    // Calculate RMS (Root Mean Square) value
    let sum = 0;
    for (let i = 0; i < channelData.length; i++) {
        sum += channelData[i] * channelData[i];
    }
    const rms = Math.sqrt(sum / channelData.length);
    
    // Convert to dB
    const db = 20 * Math.log10(rms);
    
    // Clean up
    audioContext.close();
    
    return db < threshold;
  }

  async function cleanupMediaStream() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    mediaRecorderRef.current = null;
  }

  function stopRecording() {
    cleanupMediaStream();
  }

  const joinVoiceChat = async (connection: VoiceChatConnection) => {
    if (!connection || connection.roomGuid == joinedVoiceConnection?.roomGuid) return;

    // Clean up previous connection
    if (joinedVoiceConnection) {
      await leaveVoiceChat(joinedVoiceConnection);
    }

    if (connection.connection.state != HubConnectionState.Connected) {
      showErrorToast("An error occurred during joining!", "Connection issues with the server.");
      return;
    }
 
    const response = await connection.connection.invoke<SignalRHubResponse<undefined>>("Join", isMuted, isDeafened);
    if (response.error) {
      showErrorToast("Join Error", "Failed to join voice chat");
      console.error("Error joining voice chat:", response.error.errorCodeAsString);
      return;
    }

    setTimeout(() => playJoinSound(), 25);

    // Remove any existing voice signal handlers
    connection.connection.off("ReceiveVoiceSignal");

    // Handle incoming voice signal
    connection.connection.on("ReceiveVoiceSignal", async ({ issuerId, data }) => {
      if (isDeafenedRef.current) return;
      if (!joinedVoiceConnectionRef.current) return;
      if (joinedVoiceConnectionRef.current.joinedUsers.find(u => u.hexId == issuerId)?.isMuted) return;
      let decryptionKey = joinedVoiceKeyRef.current;

      let decryptedAudio = decryptString(data, decryptionKey);
      
      if (decryptedAudio == undefined) {
        // Imitate a silent audio track for 300ms
        setCurrentlyPlayingAudioTracks(prev => [...prev, { userHexId: issuerId, track: new Audio(), couldDecrypt: false }]);
        setTimeout(() => {
          setCurrentlyPlayingAudioTracks(prev => prev.filter(track => track.userHexId != issuerId));
        }, 300);
        return;
      }

      let audioBlob = await stringToBlob(decryptedAudio);
      let audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      
      setCurrentlyPlayingAudioTracks(prev => [...prev, { userHexId: issuerId, track: audio, couldDecrypt: true }]);
      audio.volume = userVolumesRef.current[issuerId] != undefined ? userVolumesRef.current[issuerId] / 100 : 1;

      if (issuerId == currentUserRef.current?.hexId) {
        audio.volume = 0;
      }

      await audio.play();
      audio.onended = () => {
        setCurrentlyPlayingAudioTracks(prev => prev.filter(track => track.track != audio));
      }
      URL.revokeObjectURL(audioURL); // Clean up the URL after playing
    });

    setJoinedVoiceConnection(connection);
    if (!isMuted) await startRecording();
  };

  useEffect(() => {
    setCurrentlyTalkingUsers(currentlyPlayingAudioTracks.map(track => ({ userHexId: track.userHexId, couldDecrypt: track.couldDecrypt })));
  }, [currentlyPlayingAudioTracks]);

  const leaveVoiceChat = async (connection: VoiceChatConnection) => {
    if (!connection) return;
    
    await cleanupMediaStream();
    
    // Remove the voice signal handler
    connection.connection.off("ReceiveVoiceSignal");

    if (connection.connection.state != HubConnectionState.Connected) {
      showErrorToast("An error occurred during leaving!", "Connection issues with the server.");
      playLeaveSound();
      setJoinedVoiceConnection(undefined);
      return;
    }

    try {
      const response = await connection.connection.invoke<SignalRHubResponse<undefined>>("Leave");
      if (response.error) throw new Error(response.error.errorCodeAsString);
    } catch (error) {
      console.error("Error leaving voice chat:", error);
      showErrorToast("Leave Error", "Failed to leave voice chat");
    } finally {
      playLeaveSound();
      setJoinedVoiceConnection(undefined);
    }
  };

  useEffect(() => {
    if (isMuted) stopRecording();
    if (!isMuted && joinedVoiceConnectionRef.current) startRecording();
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMediaStream();
    };
  }, []);

  return (
    <div className="flex flex-col h-full gap-2 pt-1.5">
      {joinedVoiceConnection &&
        <VoiceChat
          isJoined={true}
          voiceChatConnection={joinedVoiceConnection}
          joinVoiceChat={joinVoiceChat}
          leaveVoiceChat={leaveVoiceChat}
          currentlyTalkingUsers={currentlyTalkingUsers}
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
        </div>}
    </div>
  );
}

export default VoiceChatSection;