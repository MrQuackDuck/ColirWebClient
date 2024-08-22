import { useContext } from "react";
import { UserModel } from "../../model/UserModel";
import { UsersContext } from "../providers/UsersProvider";

export const useUsers = (): {
  users: UserModel[];
  setUsers: React.Dispatch<React.SetStateAction<UserModel[]>>;
} => {
  const { users, setUsers } = useContext(UsersContext);
  return { users, setUsers };
}