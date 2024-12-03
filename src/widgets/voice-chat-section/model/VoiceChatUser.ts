export interface VoiceChatUser {
  hexId: number;
  roomGuid: string;
  isMuted: boolean;
  isDeafened: boolean;
  isVideoEnabled: boolean;
  isStreamEnabled: boolean;
}
