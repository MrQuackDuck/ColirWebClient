export interface CreateRoomModel {
  name: string;
  minutesToLive?: number;
  encryptionKey: string;
}