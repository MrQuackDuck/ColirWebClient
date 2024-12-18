import { useContextSelector } from "use-context-selector";

import { availableLanguages, LanguageSettingsContext, useTranslation } from "@/shared/lib";
import { Label, RadioGroup, RadioGroupItem, Separator } from "@/shared/ui";

function LanguageSettings() {
  const t = useTranslation();
  const currentLanguage = useContextSelector(LanguageSettingsContext, (c) => c.currentLanguage);
  const setCurrentLanguage = useContextSelector(LanguageSettingsContext, (c) => c.setCurrentLanguage);

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">{t("LANGUAGE")}</span>
      <Separator />
      <div className="flex flex-col gap-3.5">
        <RadioGroup value={currentLanguage} onValueChange={setCurrentLanguage}>
          {availableLanguages.map((language) => (
            <div className="flex items-center space-x-2" key={language.languageCode}>
              <RadioGroupItem value={language.languageCode} id={language.languageCode} />
              <Label className="text-sm cursor-pointer select-none" htmlFor={language.languageCode}>
                {language.languageName}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

export default LanguageSettings;
