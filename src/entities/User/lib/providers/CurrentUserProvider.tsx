import { useEffect, useRef, useState } from "react";
import { DetailedUserModel } from "../../model/DetailedUserModel";
import { useLocalStorage } from "@/shared/lib/hooks/useLocalStorage";
import UserService from "../../api/UserService";
import { createContext } from "use-context-selector";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";
import { useErrorToast } from "@/shared/lib/hooks/useErrorToast";

export const CurrentUserContext = createContext<{
  currentUser: DetailedUserModel | null;
  setUser: (user: DetailedUserModel) => void;
  removeUser: () => void;
  updateCurrentUser: () => Promise<DetailedUserModel | undefined>;
}>({ currentUser: null, setUser: () => {}, removeUser: () => {}, updateCurrentUser: () => Promise.resolve(undefined) });

const CurrentUserProvider = ({ children }) => {
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
          reject(e);
        });
    });
  };

  return <CurrentUserContext.Provider value={{ currentUser, setUser, removeUser, updateCurrentUser }}>{children}</CurrentUserContext.Provider>;
};

export default CurrentUserProvider;
