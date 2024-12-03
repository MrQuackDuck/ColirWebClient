import { useContextSelector } from "use-context-selector";
import en from "../../../assets/locale/en.json";
import { TranslationContext } from "../providers/TranslationProvider";

type TFunction = (key: string, ...args: (string | number)[]) => string;

export const useTranslation = (): TFunction => {
  let translationMap = useContextSelector(TranslationContext, (c) => c.translationMap);

  const translate: TFunction = (key: string, ...args: (string | number)[]) => {
    let translatedString = translationMap[key];

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
