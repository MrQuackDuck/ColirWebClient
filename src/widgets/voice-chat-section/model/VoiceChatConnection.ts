import { HubConnection } from "@microsoft/signalr";
import { VoiceChatUser } from "./VoiceChatUser";

export interface VoiceChatConnection {
  roomGuid: string;
  connection: HubConnection;
  joinedUsers: VoiceChatUser[];
}