import { BarChart3Icon, SettingsIcon, Undo2Icon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useContextSelector } from "use-context-selector";

import { CurrentUserContext } from "@/entities/User";
import { AuthContext } from "@/features/authorize";
import { SettingsOpenCloseContext } from "@/features/open-close-settings";
import { useTranslation } from "@/shared/lib";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui";

import StatisticsDialog from "./StatisticsDialog";

function ProfileButton() {
  const t = useTranslation();
  const setIsSettingsOpen = useContextSelector(SettingsOpenCloseContext, (c) => c.setIsOpen);
  const currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);
  const logOut = useContextSelector(AuthContext, (c) => c.logOut);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

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
              <SettingsIcon className="mr-2 h-4 w-4" strokeWidth={2} /> {t("SETTINGS")}
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
