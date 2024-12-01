import { createContext } from "use-context-selector";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";

export const LanguageSettingsContext = createContext<{
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
}>({
  currentLanguage: "en",
  setCurrentLanguage: () => {}
});

const LanguageSettingsProvider = ({ children }) => {
  let { getFromLocalStorage, setToLocalStorage } = useLocalStorage();
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

export default LanguageSettingsProvider;
