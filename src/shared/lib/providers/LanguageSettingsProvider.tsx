import { useEffect, useState } from "react";
import { createContext } from "use-context-selector";

import { useLocalStorage } from "../hooks/useLocalStorage";

export const LanguageSettingsContext = createContext<{
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
}>({
  currentLanguage: "en",
  setCurrentLanguage: () => {}
});

export const LanguageSettingsProvider = ({ children }) => {
  const { getFromLocalStorage, setToLocalStorage } = useLocalStorage();
  const [currentLanguage, setCurrentLanguage] = useState<string>(getFromLocalStorage("currentLanguage") ?? "en");

  function saveAllToLocalStorage() {
    setToLocalStorage("currentLanguage", currentLanguage);
  }

  useEffect(() => {
    saveAllToLocalStorage();
  }, [currentLanguage]);

  return (
    <LanguageSettingsContext.Provider
      value={{
        currentLanguage,
        setCurrentLanguage
      }}
    >
      {children}
    </LanguageSettingsContext.Provider>
  );
};
