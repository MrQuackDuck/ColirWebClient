import { UserAuthType } from "./UserAuthType";

export interface UserModel {
    hexId: number;
    username: string;
    authType: UserAuthType;
}