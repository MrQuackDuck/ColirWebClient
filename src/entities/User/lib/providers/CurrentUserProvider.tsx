import { createContext, useState } from "react";
import { DetailedUserModel } from "../../model/DetailedUserModel";
import { useLocalStorage } from "@/shared/lib/hooks/useLocalStorage";
import UserService from "../../api/UserService";

export const CurrentUserContext = createContext<{
  currentUser: DetailedUserModel | null;
  setUser: (user: DetailedUserModel) => void;
  removeUser: () => void;
  updateCurrentUser: () => Promise<void>;
}>({ currentUser: null, setUser: () => {}, removeUser: () => {}, updateCurrentUser:() => Promise.resolve() });

const CurrentUserProvider = ({ children }) => {
  const getUser = () => getFromLocalStorage<DetailedUserModel>("currentUser")

  const { setToLocalStorage, getFromLocalStorage, removeFromLocalStorage } = useLocalStorage();
  const [ currentUser, setCurrentUser ] = useState<DetailedUserModel | null>(getUser());

  const setUser = (user: DetailedUserModel) => {
    setCurrentUser(user);
    setToLocalStorage("currentUser", user);
  }

  const removeUser = () => {
    removeFromLocalStorage("currentUser");
    setCurrentUser(null);
  }

  const updateCurrentUser = async () => {
    return await UserService.GetAccountInfo()
      .then(response => setUser(response.data))
      .catch(() => removeUser());
  }

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setUser, removeUser, updateCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export default CurrentUserProvider;