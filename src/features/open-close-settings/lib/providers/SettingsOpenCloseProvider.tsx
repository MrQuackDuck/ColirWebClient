import { useState } from "react";
import { createContext } from "use-context-selector";

export const SettingsOpenCloseContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => {}
});

export const SettingsOpenCloseProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return <SettingsOpenCloseContext.Provider value={{ isOpen, setIsOpen }}>{children}</SettingsOpenCloseContext.Provider>;
};
