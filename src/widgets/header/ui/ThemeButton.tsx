import { useTheme } from "@/shared/lib/providers/ThemeProvider";
import { Button } from "@/shared/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/DropdownMenu";
import { MoonIcon, SunIcon } from "lucide-react";

type Props = {};

function ThemeButton({}: Props) {
  const { theme, setTheme } = useTheme();

  function getIcon() {
    if (theme === "dark") return <MoonIcon className="h-4 w-4" />;
    else return <SunIcon className="h-4 w-4" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onFocusCapture={(e) => e.preventDefault()}>
        <Button className="h-9 w-9 focus-visible:ring-0 focus-visible:ring-offset-0" variant={"outline"} size={"icon"}>
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={() => {}}>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem data-no-focus-lock onClick={() => setTheme("light")}>
            <SunIcon className="mr-2 h-4 w-4" /> Light
          </DropdownMenuItem>
          <DropdownMenuItem data-no-focus-lock onClick={() => setTheme("dark")}>
            <MoonIcon className="mr-2 h-4 w-4" /> Dark
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeButton;
