import { LanguageSettingsContext } from "@/shared/lib/providers/LanguageSettingsProvider";
import { Label } from "@/shared/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/RadioGroup";
import { Separator } from "@/shared/ui/Separator";
import { useContextSelector } from "use-context-selector";

function LanguageSettings() {
  let currentLanguage = useContextSelector(LanguageSettingsContext, (c) => c.currentLanguage);
  let setCurrentLanguage = useContextSelector(LanguageSettingsContext, (c) => c.setCurrentLanguage);

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">Language</span>
      <Separator />
      <div className="flex flex-col gap-3.5">
        <RadioGroup value={currentLanguage} onValueChange={setCurrentLanguage}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="de" id="de" />
            <Label className="text-sm cursor-pointer select-none" htmlFor="de">
              Deutsch
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="en" id="en" />
            <Label className="text-sm cursor-pointer select-none" htmlFor="en">
              English
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="es" id="es" />
            <Label className="text-sm cursor-pointer select-none" htmlFor="es">
              Español
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fr" id="fr" />
            <Label className="text-sm cursor-pointer select-none" htmlFor="fr">
              Français
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pl" id="pl" />
            <Label className="text-sm cursor-pointer select-none" htmlFor="pl">
              Polski
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="uk" id="uk" />
            <Label className="text-sm cursor-pointer select-none" htmlFor="uk">
              Українська
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ru" id="ru" />
            <Label className="text-sm cursor-pointer select-none" htmlFor="ru">
              Русский
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

export default LanguageSettings;
