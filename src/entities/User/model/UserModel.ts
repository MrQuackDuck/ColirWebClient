import { UserAuthType } from "./UserAuthType";

export interface UserModel {
  hexId: number;
  username: string;
  registrationDate: Date;
  authType: UserAuthType;
}
