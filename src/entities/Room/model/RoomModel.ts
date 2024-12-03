import { UserModel } from "@/entities/User/model/UserModel";

export interface RoomModel {
  guid: string;
  name: string;
  expiryDate: Date | null;
  owner: UserModel;
  usedMemoryInBytes: number;
  freeMemoryInBytes: number;
  joinedUsers: UserModel[];
}
