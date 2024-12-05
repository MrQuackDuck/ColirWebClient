import { Button } from "@/shared/ui/Button_";
import { useContextSelector } from "use-context-selector";
import { SettingsOpenCloseContext } from "@/features/open-close-settings/lib/providers/SettingsOpenCloseProvider";
import { PanelRightCloseIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/shared/ui/Separator";
import AccountSettings from "./AccountSettings";
import VoiceSettings from "./VoiceSettings";
import NotificationsSettings from "./NotificationsSettings";
import StatisticsSettings from "./StatisticsSettings";
import LanguageSettings from "./LanguageSettings";
import ImportExportSettings from "./ImportExportSettings";
import { SettingsTabs as SettingsTabsEnum } from "../lib/SettingsTabs";
import SettingsTabs from "./SettingsTabs";
import { useResponsiveness } from "@/shared/lib/hooks/useResponsiveness";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui/Sheet";
import PopupWindow from "@/shared/ui/PopupWindow";
import { ScrollArea } from "@/shared/ui/ScrollArea";
import { CurrentUserContext } from "@/entities/User/lib/providers/CurrentUserProvider";

function SettingsPage() {
  let { isDesktop } = useResponsiveness();

  const isSettingsOpen = useContextSelector(SettingsOpenCloseContext, (c) => c.isOpen);
  const setIsSettingsOpen = useContextSelector(SettingsOpenCloseContext, (c) => c.setIsOpen);

  let currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);

  let [isSheetOpen, setIsSheetOpen] = useState(false);

  let [isAnyDialogOpen, setIsAnyDialogOpen] = useState(false);
  let [isAnyDialogOpenDelayed, setIsAnyDialogOpenDelayed] = useState(false);

  let [selectedTab, setSelectedTab] = useState(SettingsTabsEnum.Account);

  useEffect(() => {
    if (!currentUser) return setIsSettingsOpen(false);
  }, [currentUser]);

  useEffect(() => {
    // When switching tabs on mobile devices, close the sheet
    setIsSheetOpen(false);
  }, [selectedTab]);

  // When "Escape" is pressed, the "isAnyDialogOpen" turns into "false" instantly,
  // and the "onEscapePressed" can't capture it fast enough
  // which results the "closeButtonRef" to be focused, when it shouldn't be
  useEffect(() => {
    if (isAnyDialogOpen) setTimeout(() => setIsAnyDialogOpenDelayed(true), 50);
    else setTimeout(() => setIsAnyDialogOpenDelayed(false), 50);
  }, [isAnyDialogOpen]);

  function handleEscapePress() {
    if (isAnyDialogOpenDelayed) return;
    let focusedItemTagName = document.activeElement?.tagName;
    if (focusedItemTagName === "TEXTAREA" || focusedItemTagName === "INPUT" || focusedItemTagName === "VIDEO") return;
    setIsSettingsOpen(false);
  }

  const onPopupShown = () => setSelectedTab(SettingsTabsEnum.Account);

  return (
    <PopupWindow onEscapePressed={handleEscapePress} isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} onPopupShown={onPopupShown}>
      {!isDesktop && (
        <Button onClick={() => setIsSheetOpen(true)} variant={"ghost"} size={"icon"} className="min-w-10 min-h-10">
          <PanelRightCloseIcon className="h-5 w-5 text-slate-400" />
        </Button>
      )}

      <div className="flex flex-row gap-1 h-full">
        {isDesktop && (
          <>
            <SettingsTabs className="flex flex-col gap-2.5" selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            <Separator className="h-full" orientation="vertical" />
          </>
        )}

        <ScrollArea className="w-full">
          <div className="w-full pl-4 pr-12 pt-5">
            {selectedTab == SettingsTabsEnum.Account && <AccountSettings dialogOpenClosed={setIsAnyDialogOpen} />}
            {selectedTab == SettingsTabsEnum.VoiceSettings && <VoiceSettings />}
            {selectedTab == SettingsTabsEnum.Notifications && <NotificationsSettings />}
            {selectedTab == SettingsTabsEnum.Statistics && <StatisticsSettings />}
            {selectedTab == SettingsTabsEnum.Language && <LanguageSettings />}
            {selectedTab == SettingsTabsEnum.ImportExport && <ImportExportSettings />}
          </div>
        </ScrollArea>
      </div>

      {!isDesktop && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side={"left"}>
            <SheetTitle className="hidden" />
            <SheetDescription className="hidden" />
            <SettingsTabs className="flex flex-col gap-2.5" selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          </SheetContent>
        </Sheet>
      )}
    </PopupWindow>
  );
}

export default SettingsPage;
