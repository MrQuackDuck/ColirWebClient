import { useState } from "react";
import { createContext } from "use-context-selector";

import { UserModel } from "../../model/UserModel";

export const UsersContext = createContext<{
  users: UserModel[];
  setUsers: React.Dispatch<React.SetStateAction<UserModel[]>>;
}>({ users: [] as UserModel[], setUsers: () => {} });

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState<UserModel[]>([]);

  return <UsersContext.Provider value={{ users, setUsers }}>{children}</UsersContext.Provider>;
};
