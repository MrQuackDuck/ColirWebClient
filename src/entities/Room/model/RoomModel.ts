import { UserModel } from "@/entities/User";

export interface RoomModel {
  guid: string;
  name: string;
  expiryDate: Date | null;
  owner: UserModel;
  usedMemoryInBytes: number;
  freeMemoryInBytes: number;
  joinedUsers: UserModel[];
}
