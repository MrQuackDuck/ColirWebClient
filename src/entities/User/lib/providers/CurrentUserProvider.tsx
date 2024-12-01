import { useState } from "react";
import { DetailedUserModel } from "../../model/DetailedUserModel";
import { useLocalStorage } from "@/shared/lib/hooks/useLocalStorage";
import UserService from "../../api/UserService";
import { showErrorToast } from "@/shared/lib/showErrorToast";
import { createContext } from "use-context-selector";

export const CurrentUserContext = createContext<{
  currentUser: DetailedUserModel | null;
  setUser: (user: DetailedUserModel) => void;
  removeUser: () => void;
  updateCurrentUser: () => Promise<DetailedUserModel | undefined>;
}>({ currentUser: null, setUser: () => {}, removeUser: () => {}, updateCurrentUser: () => Promise.resolve(undefined) });

const CurrentUserProvider = ({ children }) => {
  const { setToLocalStorage, getFromLocalStorage, removeFromLocalStorage } = useLocalStorage();
  const setUser = (user: DetailedUserModel) => {
    setCurrentUser(user);
    setToLocalStorage("currentUser", user);
  };

  const getUser = () => {
    try {
      return getFromLocalStorage<DetailedUserModel>("currentUser") ?? null;
    } catch {
      removeFromLocalStorage("currentUser");
      return null;
    }
  };

  const [currentUser, setCurrentUser] = useState<DetailedUserModel | null>(getUser());

  const removeUser = () => {
    removeFromLocalStorage("currentUser");
    setCurrentUser(null);
  };

  const updateCurrentUser = (): Promise<DetailedUserModel | undefined> => {
    return new Promise((resolve, reject) => {
      UserService.GetAccountInfo()
        .then((response) => {
          setUser(response.data);
          resolve(response.data);
        })
        .catch((e) => {
          if (e.code === "ERR_NETWORK") {
            showErrorToast("Couldn't update the user info", "The server is not available. Please try again later.");
          } else {
            showErrorToast("Couldn't update the user info", e.message);
          }
          reject(e);
        });
    });
  };

  return <CurrentUserContext.Provider value={{ currentUser, setUser, removeUser, updateCurrentUser }}>{children}</CurrentUserContext.Provider>;
};

export default CurrentUserProvider;
