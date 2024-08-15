import { useContext } from "react";
import { AuthContext } from "../AuthProvider";

export const useAuth = (): {
  isAuthorized: boolean;
  authorize: (jwtToken: string, refreshToken: string) => void;
  logOut: () => void;
} => {
  const { isAuthorized, authorize, logOut } = useContext(AuthContext);
  return { isAuthorized, authorize, logOut };
};
