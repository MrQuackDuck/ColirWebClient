import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";
import { AuthContext } from "@/features/authorize/lib/providers/AuthProvider";
import { SettingsOpenCloseContext } from "@/features/open-close-settings/lib/providers/SettingsOpenCloseProvider";
import { Button } from "@/shared/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/DropdownMenu";
import { GearIcon } from "@radix-ui/react-icons";
import { BarChart3Icon, Undo2Icon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useContextSelector } from "use-context-selector";
import StatisticsDialog from "./StatisticsDialog";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";

function ProfileButton() {
  const t = useTranslation();
  let setIsSettingsOpen = useContextSelector(SettingsOpenCloseContext, (c) => c.setIsOpen);
  let currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  let logOut = useContextSelector(AuthContext, (c) => c.logOut);
  let [isStatsOpen, setIsStatsOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"sm"}>
            <UserIcon className="mr-2 h-4 w-4" strokeWidth={2} /> {t("PROFILE")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuGroup>
            <DropdownMenuItem data-no-focus-lock onClick={openSettings}>
              <GearIcon className="mr-2 h-4 w-4" strokeWidth={2} /> {t("SETTINGS")}
            </DropdownMenuItem>
            <DropdownMenuItem data-no-focus-lock disabled={!currentUser?.userSettings.statisticsEnabled} onClick={() => setIsStatsOpen(true)}>
              <BarChart3Icon className="mr-2 h-4 w-4" strokeWidth={2} /> {t("STATS")}
            </DropdownMenuItem>
            <DropdownMenuItem data-no-focus-lock onClick={logOut}>
              <Undo2Icon className="mr-2 h-4 w-4" strokeWidth={2} /> {t("LOG_OUT")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <StatisticsDialog isStatsOpen={isStatsOpen} setIsStatsOpen={setIsStatsOpen} />
    </>
  );
}

export default ProfileButton;
