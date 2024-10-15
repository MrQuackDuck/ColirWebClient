import { HubConnection } from "@microsoft/signalr";

export interface ChatConnection {
  roomGuid: string;
  connection: HubConnection;
}