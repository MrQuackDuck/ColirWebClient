import { Translation } from "../model/Translation";
import de from "../../assets/locale/de.json";
import en from "../../assets/locale/en.json";
import es from "../../assets/locale/es.json";
import fr from "../../assets/locale/fr.json";
import pl from "../../assets/locale/pl.json";
import uk from "../../assets/locale/uk.json";
import ru from "../../assets/locale/ru.json";

export const availableLanguages: Translation[] = [
  { languageCode: "de", languageName: "Deutsch", keyValueMap: de },
  { languageCode: "en", languageName: "English", keyValueMap: en },
  { languageCode: "es", languageName: "Español", keyValueMap: es },
  { languageCode: "fr", languageName: "Français", keyValueMap: fr },
  { languageCode: "pl", languageName: "Polski", keyValueMap: pl },
  { languageCode: "uk", languageName: "Українська", keyValueMap: uk },
  { languageCode: "ru", languageName: "Русский", keyValueMap: ru }
];
