import { useJoinedRooms } from "@/entities/Room/lib/hooks/useJoinedRooms";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import AuthService from "@/features/authorize/lib/AuthService";
import { useLocalStorage } from "@/shared/lib/hooks/useLocalStorage";
import { createContext, useState } from "react";

export const AuthContext = createContext<{
  isAuthorized: boolean;
  authorize: (jwtToken: string, refreshToken: string) => void;
  logOut: () => void;
}>({ isAuthorized: false, authorize: () => {}, logOut: () => {} });

const AuthProvider = ({ children }) => {
  const { setToLocalStorage, getFromLocalStorage, removeFromLocalStorage } = useLocalStorage();
  const { updateCurrentUser, removeUser } = useCurrentUser();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(getFromLocalStorage("jwtToken") !== null);
  const { setJoinedRooms } = useJoinedRooms();

  const authorize = (jwtToken: string, refreshToken: string) => {
    setIsAuthorized(true);
    setToLocalStorage("jwtToken", jwtToken);
    setToLocalStorage("refreshToken", refreshToken);
    updateCurrentUser();
  };

  const logOut = () => {
    removeUser();
    setJoinedRooms([]);
    setIsAuthorized(false);
    removeFromLocalStorage("jwtToken");
    removeFromLocalStorage("refreshToken");
    AuthService.LogOut();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthorized, authorize, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
