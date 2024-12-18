import { useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";

import { JoinedRoomsContext } from "@/entities/Room";
import { CurrentUserContext } from "@/entities/User";
import { useLocalStorage } from "@/shared/lib";

import { AuthService } from "../AuthService";

export const AuthContext = createContext<{
  isAuthorized: boolean;
  authorize: (jwtToken: string, refreshToken: string) => void;
  logOut: () => void;
}>({ isAuthorized: false, authorize: () => {}, logOut: () => {} });

export const AuthProvider = ({ children }) => {
  const { setToLocalStorage, getFromLocalStorage, removeFromLocalStorage } = useLocalStorage();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(getFromLocalStorage("jwtToken") !== null);
  const setJoinedRooms = useContextSelector(JoinedRoomsContext, (c) => c.setJoinedRooms);
  const updateCurrentUser = useContextSelector(CurrentUserContext, (c) => c.updateCurrentUser);
  const removeUser = useContextSelector(CurrentUserContext, (c) => c.removeUser);

  const authorize = (jwtToken: string, refreshToken: string) => {
    setIsAuthorized(true);
    setToLocalStorage("jwtToken", jwtToken);
    setToLocalStorage("refreshToken", refreshToken);
    updateCurrentUser();
  };

  const logOut = () => {
    setJoinedRooms([]);
    removeUser();
    setIsAuthorized(false);
    removeFromLocalStorage("jwtToken");
    removeFromLocalStorage("refreshToken");
    AuthService.LogOut();
  };

  return <AuthContext.Provider value={{ isAuthorized, authorize, logOut }}>{children}</AuthContext.Provider>;
};
