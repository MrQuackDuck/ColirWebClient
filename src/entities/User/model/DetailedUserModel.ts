import { RoomModel } from "@/entities/Room/model/RoomModel";
import { UserAuthType } from "./UserAuthType";
import { UserSettingsModel } from "./UserSettingsModel";
import { UserStatisticsModel } from "./UserStatisticsModel";

export interface DetailedUserModel {
  id: number;
  hexId: number;
  username: string;
  authType: UserAuthType;
  userStatistics: UserStatisticsModel;
  userSettings: UserSettingsModel;
  joinedRooms: RoomModel[];
}
