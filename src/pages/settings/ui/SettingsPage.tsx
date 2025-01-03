import { PanelRightCloseIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";

import { CurrentUserContext } from "@/entities/User";
import { SettingsOpenCloseContext } from "@/features/open-close-settings";
import { useResponsiveness } from "@/shared/lib";
import { SettingsTabs as SettingsTabsEnum } from "@/shared/model";
import { Button, PopupWindow, ScrollArea, Separator, Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui";

import AccountSettings from "./AccountSettings";
import AppearanceSettings from "./AppearanceSettings";
import ImportExportSettings from "./ImportExportSettings";
import LanguageSettings from "./LanguageSettings";
import NotificationsSettings from "./NotificationsSettings";
import SettingsTabs from "./SettingsTabs";
import StatisticsSettings from "./StatisticsSettings";
import VoiceSettings from "./VoiceSettings";

export function SettingsPage() {
  const { isDesktop } = useResponsiveness();

  const isSettingsOpen = useContextSelector(SettingsOpenCloseContext, (c) => c.isOpen);
  const setIsSettingsOpen = useContextSelector(SettingsOpenCloseContext, (c) => c.setIsOpen);

  const currentUser = useContextSelector(CurrentUserContext, (c) => c.currentUser);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [isAnyDialogOpen, setIsAnyDialogOpen] = useState(false);
  const [isAnyDialogOpenDelayed, setIsAnyDialogOpenDelayed] = useState(false);

  const [selectedTab, setSelectedTab] = useState(SettingsTabsEnum.Account);

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
    const focusedItemTagName = document.activeElement?.tagName;
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
            {selectedTab == SettingsTabsEnum.Appearance && <AppearanceSettings />}
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
