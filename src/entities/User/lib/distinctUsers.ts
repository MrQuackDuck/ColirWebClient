import { UserModel } from "../model/UserModel";

export const distinctUsers = (array: UserModel[]) => {
  const newUsers: UserModel[] = [];
  array.map((u) => {
    if (newUsers.find((usr) => usr.hexId == u.hexId)) return;
    newUsers.push(u);
  });

  return newUsers;
};