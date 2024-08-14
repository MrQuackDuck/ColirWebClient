import AuthService from "@/entities/User/api/AuthService";
import { createContext, useState } from "react";

export const AuthContext = createContext<{
  isAuthorized: boolean;
  authorize: (token: string) => void;
  logOut: () => void;
}>({ isAuthorized: false, authorize: () => {}, logOut: () => {} });

const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(localStorage.getItem("jwtToken") !== null);

  const authorize = (token: string) => {
    setIsAuthorized(true);
    localStorage.setItem("jwtToken", token);
  };

  const logOut = () => {
    setIsAuthorized(false);
    localStorage.removeItem("jwtToken");
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
