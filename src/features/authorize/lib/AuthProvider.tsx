import AuthService from "@/features/authorize/lib/AuthService";
import { createContext, useState } from "react";

export const AuthContext = createContext<{
  isAuthorized: boolean;
  authorize: (jwtToken: string, refreshToken: string) => void;
  logOut: () => void;
}>({ isAuthorized: false, authorize: () => {}, logOut: () => {} });

const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(localStorage.getItem("jwtToken") !== null);

  const authorize = (jwtToken: string, refreshToken: string) => {
    setIsAuthorized(true);
    localStorage.setItem("jwtToken", jwtToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logOut = () => {
    setIsAuthorized(false);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
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
