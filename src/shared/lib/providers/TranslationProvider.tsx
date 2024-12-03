import { useEffect, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { LanguageSettingsContext } from "./LanguageSettingsProvider";
import en from "../../../assets/locale/en.json";

export const TranslationContext = createContext<{
  translationMap: any;
}>({
  translationMap: {}
});

const TranslationProvider = ({ children }) => {
  const [translationMap, setTranslationMap] = useState<any>(en);
  let currentLanguage = useContextSelector(LanguageSettingsContext, (c) => c.currentLanguage);

  useEffect(() => {
    import(`../../../assets/locale/${currentLanguage}.json`)
      .then((module) => setTranslationMap(module.default))
      .catch(() => setTranslationMap(en));
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
