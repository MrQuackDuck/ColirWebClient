import { useEffect, useRef, useState } from "react";
import { createContext } from "use-context-selector";

import { useErrorToast, useLocalStorage, useTranslation } from "@/shared/lib";

import { UserService } from "../../api/UserService";
import { DetailedUserModel } from "../../model/DetailedUserModel";

export const CurrentUserContext = createContext<{
  currentUser: DetailedUserModel | null;
  setUser: (user: DetailedUserModel) => void;
  removeUser: () => void;
  updateCurrentUser: () => Promise<DetailedUserModel | undefined>;
}>({ currentUser: null, setUser: () => {}, removeUser: () => {}, updateCurrentUser: () => Promise.resolve(undefined) });

export const CurrentUserProvider = ({ children }) => {
  const t = useTranslation();
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const showErrorToast = useErrorToast();
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
            showErrorToast(tRef.current("COULD_NOT_UPDATE_USER_INFO"), tRef.current("SERVER_NOT_AVAILABLE"));
          } else {
            showErrorToast(tRef.current("COULD_NOT_UPDATE_USER_INFO"), e.message);
          }

          console.error(e);
          reject(e);
        });
    });
  };

  return <CurrentUserContext.Provider value={{ currentUser, setUser, removeUser, updateCurrentUser }}>{children}</CurrentUserContext.Provider>;
};
