import { MoonIcon, SunIcon } from "lucide-react";

import { useTheme, useTranslation } from "@/shared/lib";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui";

function ThemeButton() {
  const t = useTranslation();
  const { theme, setTheme } = useTheme();

  function getIcon() {
    if (theme === "dark") return <MoonIcon className="h-4 w-4" />;
    else return <SunIcon className="h-4 w-4" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-9 w-9" variant={"outline"} size={"icon"}>
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>{t("THEME")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem data-no-focus-lock onClick={() => setTheme("light")}>
            <SunIcon className="mr-2 h-4 w-4" /> {t("LIGHT")}
          </DropdownMenuItem>
          <DropdownMenuItem data-no-focus-lock onClick={() => setTheme("dark")}>
            <MoonIcon className="mr-2 h-4 w-4" /> {t("DARK")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeButton;
