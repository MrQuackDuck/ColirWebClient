import { useContextSelector } from "use-context-selector"
import { LanguageSettingsContext } from "../providers/LanguageSettingsProvider";
import en from '../../../assets/locale/en.json';

type TFunction = (key: string) => string;
export const useTranslation = (): TFunction => {
	let currentLanguage = useContextSelector(LanguageSettingsContext, c => c.currentLanguage);
	
	const translate: TFunction = (key: string) => {
		switch (currentLanguage) {
			case "en":
				return en[key];
			default:
				return en[key];
		}
	}

	return translate;
}