import { useContextSelector } from "use-context-selector";
import { LanguageSettingsContext } from "../providers/LanguageSettingsProvider";
import en from "../../../assets/locale/en.json";

type TFunction = (key: string, ...args: (string | number)[]) => string;

export const useTranslation = (): TFunction => {
  let currentLanguage = useContextSelector(LanguageSettingsContext, (c) => c.currentLanguage);

  const translate: TFunction = (key: string, ...args: (string | number)[]) => {
    let translatedString = "";

    switch (currentLanguage) {
      case "en":
        translatedString = en[key];
        break;
      default:
        translatedString = en[key];
    }

    if (!translatedString) {
      translatedString = en[key];
      if (!translatedString) {
        console.error(`No translation found for ${key}`);
        return "No translation found.";
      }
    }

    // Replace placeholders with provided arguments
    return translatedString.replace(/\{(\d+)\}/g, (match, index) => {
      const argIndex = parseInt(index);
      return args[argIndex] !== undefined ? String(args[argIndex]) : match;
    });
  };

  return translate;
};
