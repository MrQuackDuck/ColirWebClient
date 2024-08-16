import { useContext } from "react";
import { CurrentUserContext } from "../providers/CurrentUserProvider";
import { DetailedUserModel } from "../../model/DetailedUserModel";

export const useCurrentUser = (): {
  currentUser: DetailedUserModel | null;
  setUser: (user: DetailedUserModel) => void;
  removeUser: () => void;
  updateCurrentUser: () => Promise<void>;
} => {
  const { currentUser, setUser, removeUser, updateCurrentUser } = useContext(CurrentUserContext);
  return { currentUser, setUser, removeUser, updateCurrentUser };
}