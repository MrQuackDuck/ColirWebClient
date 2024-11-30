import { useState } from "react";
import { createContext } from "use-context-selector";

export const FaqOpenCloseContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const FaqOpenCloseProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <FaqOpenCloseContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </FaqOpenCloseContext.Provider>
  );
};