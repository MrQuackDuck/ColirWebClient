import { useState } from "react";
import { createContext } from "use-context-selector";

import { useLocalStorage } from "@/shared/lib";

export const UsersVolumeContext = createContext<{
  userVolumes: Record<number, number>;
  setVolumeForUser: (userHexId: number, volume: number) => void;
}>({ userVolumes: {}, setVolumeForUser: () => {} });

export const UsersVolumeProvider = ({ children }) => {
  const { setToLocalStorage, getFromLocalStorage } = useLocalStorage();
  const [userVolumes, setUserVolumes] = useState<Record<number, number>>(getFromLocalStorage("userVolumes") ?? {});

  const setVolumeForUser = (userHexId: number, volume: number) => {
    const newUserVolumes = { ...userVolumes, [userHexId]: volume };
    setUserVolumes(newUserVolumes);
    setToLocalStorage("userVolumes", newUserVolumes);
  };

  return <UsersVolumeContext.Provider value={{ userVolumes, setVolumeForUser }}>{children}</UsersVolumeContext.Provider>;
};
