import { createContext, useState } from "react";
import { DetailedUserModel } from "../../model/DetailedUserModel";
import { useLocalStorage } from "@/shared/lib/hooks/useLocalStorage";
import UserService from "../../api/UserService";
import { showErrorToast } from "@/shared/lib/showErrorToast";

export const CurrentUserContext = createContext<{
  currentUser: DetailedUserModel | null;
  setUser: (user: DetailedUserModel) => void;
  removeUser: () => void;
  updateCurrentUser: () => Promise<void>;
}>({ currentUser: null, setUser: () => {}, removeUser: () => {}, updateCurrentUser:() => Promise.resolve() });

const CurrentUserProvider = ({ children }) => {
  const setUser = (user: DetailedUserModel) => {
    setCurrentUser(user);
    setToLocalStorage("currentUser", user);
  }
  
  const removeUser = () => {
    removeFromLocalStorage("currentUser");
    setCurrentUser(null);
  }

  const getUser = () => {
    try {
      return getFromLocalStorage<DetailedUserModel>("currentUser")
    }
    catch {
      removeUser();
      return null;
    }
  }

  const { setToLocalStorage, getFromLocalStorage, removeFromLocalStorage } = useLocalStorage();
  const [ currentUser, setCurrentUser ] = useState<DetailedUserModel | null>(getUser());

  const updateCurrentUser = async () => {
    return await UserService.GetAccountInfo()
      .then(response => setUser(response.data))
      .catch(e => {
        if (e.code == "ERR_NETWORK") showErrorToast("Couldn't update the user info", "The server is not available. Please try again later.");
        else showErrorToast("Couldn't update the user info", e.message);
      });
  }

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setUser, removeUser, updateCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export default CurrentUserProvider;