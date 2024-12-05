import { availableLanguages } from "@/shared/lib/availableLanguages";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";
import { LanguageSettingsContext } from "@/shared/lib/providers/LanguageSettingsProvider";
import { Button } from "@/shared/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/DropdownMenu";
import { LanguagesIcon } from "lucide-react";
import { useContextSelector } from "use-context-selector";

function LanguageButton() {
  const t = useTranslation();
  let setCurrentLanguage = useContextSelector(LanguageSettingsContext, (c) => c.setCurrentLanguage);

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
