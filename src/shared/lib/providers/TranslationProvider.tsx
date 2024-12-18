import { useEffect, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";

import en from "../../../assets/locale/en.json";
import { availableLanguages } from "../availableLanguages";
import { LanguageSettingsContext } from "./LanguageSettingsProvider";

export const TranslationContext = createContext<{
  translationMap: any;
}>({
  translationMap: {}
});

export const TranslationProvider = ({ children }) => {
  const [translationMap, setTranslationMap] = useState<any>(en);
  const currentLanguage = useContextSelector(LanguageSettingsContext, (c) => c.currentLanguage);

  useEffect(() => {
    const language = availableLanguages.find((lang) => lang.languageCode === currentLanguage)!;
    if (!language) return console.error("Language not found");
    setTranslationMap(language.keyValueMap);
  }, [currentLanguage]);

  return (
    <TranslationContext.Provider
      value={{
        translationMap
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;
