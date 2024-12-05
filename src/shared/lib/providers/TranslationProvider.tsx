import { useEffect, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { LanguageSettingsContext } from "./LanguageSettingsProvider";
import en from "../../../assets/locale/en.json";
import { availableLanguages } from "../availableLanguages";

export const TranslationContext = createContext<{
  translationMap: any;
}>({
  translationMap: {}
});

const TranslationProvider = ({ children }) => {
  const [translationMap, setTranslationMap] = useState<any>(en);
  let currentLanguage = useContextSelector(LanguageSettingsContext, (c) => c.currentLanguage);

  useEffect(() => {
    let language = availableLanguages.find((lang) => lang.languageCode === currentLanguage)!;
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
