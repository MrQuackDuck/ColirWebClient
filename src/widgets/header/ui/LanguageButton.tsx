import { LanguagesIcon } from "lucide-react";
import { useContextSelector } from "use-context-selector";

import { availableLanguages, LanguageSettingsContext, useTranslation } from "@/shared/lib";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui";

function LanguageButton() {
  const t = useTranslation();
  const setCurrentLanguage = useContextSelector(LanguageSettingsContext, (c) => c.setCurrentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          <LanguagesIcon className="mr-2 h-4 w-4" /> {t("LANGUAGE")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>{t("LANGUAGE")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {availableLanguages.map((language) => (
            <DropdownMenuItem key={language.languageCode} onClick={() => setCurrentLanguage(language.languageCode)} data-no-focus-lock>
              {language.languageName}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageButton;
