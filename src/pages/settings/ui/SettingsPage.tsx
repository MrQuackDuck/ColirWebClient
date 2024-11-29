import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { useContextSelector } from "use-context-selector";
import { SettingsOpenCloseContext } from "@/features/open-close-settings/lib/providers/SettingsOpenCloseProvider";
import { PanelRightCloseIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/Tooltip";
import classes from "./SettingsPage.module.css";
import { Separator } from "@/shared/ui/Separator";
import AccountSettings from "./AccountSettings";
import FocusLock from 'react-focus-lock';
import VoiceSettings from "./VoiceSettings";
import NotificationsSettings from "./NotificationsSettings";
import StatisticsSettings from "./StatisticsSettings";
import LanguageSettings from "./LanguageSettings";
import ImportExportSettings from "./ImportExportSettings";
import { SettingsTabs as SettingsTabsEnum } from "../lib/SettingsTabs";
import SettingsTabs from "./SettingsTabs";
import { useResponsiveness } from "@/shared/lib/hooks/useResponsiveness";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui/Sheet";

function SettingsPage() {
	let { isDesktop } = useResponsiveness();

	const isOpen = useContextSelector(SettingsOpenCloseContext, c => c.isOpen);
	const setIsOpen = useContextSelector(SettingsOpenCloseContext, c => c.setIsOpen);

	let [isHidden, setIsHidden] = useState(!isOpen);
	let [isSettingsShows, setIsSettingsShows] = useState(isOpen);

	let [isSheetOpen, setIsSheetOpen] = useState(false);

	let [isAnyDialogOpen, setIsAnyDialogOpen] = useState(false);
	let [isAnyDialogOpenDelayed, setIsAnyDialogOpenDelayed] = useState(false);

  let [selectedTab, setSelectedTab] = useState(SettingsTabsEnum.Account);

	useEffect(() => {
		setIsSheetOpen(false);
	}, [selectedTab]);

	// When "Escape" is pressed, the "isAnyDialog" open turns into "false" instantly,
	// and the "handleEscapePressForContainer" can't capture it fast enough
	// which results the "closeButtonRef" to be focused, when it shouldn't be
	useEffect(() => {
		if (isAnyDialogOpen) setTimeout(() => setIsAnyDialogOpenDelayed(true), 50);
		else setTimeout(() => setIsAnyDialogOpenDelayed(false), 50);
	}, [isAnyDialogOpen]);

	// Additional functionality to set "display: hidden" to the component
	// in order to prevent focusing on hidden elements when settings are closed
	useEffect(() => {
		if (isOpen) {
			setIsHidden(false);
			setTimeout(() => {
				setIsSettingsShows(true), 50
				setSelectedTab(SettingsTabsEnum.Account);
			});
		} 
		else {
			setIsSettingsShows(false);
			setTimeout(() => setIsHidden(true), 100);
		}
	}, [isOpen]);

	function handleEscapePressForContainer() {
		if (isAnyDialogOpenDelayed) return;
		let focusedItemTagName = document.activeElement?.tagName;
		if (focusedItemTagName === "TEXTAREA" || focusedItemTagName === "INPUT" || focusedItemTagName === "VIDEO") return;
		setIsOpen(false);
	}

  return (
	<div className={cn("z-30 transition-all ease-in-out scale-[0.98] w-full h-full absolute bg-background",
		classes.settingsPage,
		!isSettingsShows && "opacity-0 pointer-events-none",
		isSettingsShows && "opacity-100 scale-100",
		isHidden && "hidden")}
		onKeyDown={e => (e.key === "Escape") && handleEscapePressForContainer()}>
			<FocusLock className="h-full" disabled={!isOpen} onDeactivation={() => setIsOpen(false)}>
				{!isDesktop && <Button onClick={() => setIsSheetOpen(true)} variant={"ghost"} size={"icon"} className="min-w-10 min-h-10">
					<PanelRightCloseIcon className="h-5 w-5 text-slate-400" />
				</Button>}
				<div className="flex flex-row gap-2.5 h-full">
					{isDesktop && <>
						<SettingsTabs className="flex flex-col gap-2.5" selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
						<Separator className="h-full" orientation="vertical"/>
					</>}
					<div className="w-full pl-4 pr-12 pt-5">
						{ selectedTab == SettingsTabsEnum.Account && <AccountSettings dialogOpenClosed={setIsAnyDialogOpen} /> }
						{ selectedTab == SettingsTabsEnum.VoiceSettings && <VoiceSettings /> }
						{ selectedTab == SettingsTabsEnum.Notifications && <NotificationsSettings /> }
						{ selectedTab == SettingsTabsEnum.Statistics && <StatisticsSettings /> }
						{ selectedTab == SettingsTabsEnum.Language && <LanguageSettings /> }
						{ selectedTab == SettingsTabsEnum.ImportExport && <ImportExportSettings /> }
					</div>
				</div>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button className="absolute right-0 top-0 rounded-full" variant={"outline"} size={'icon'} tabIndex={0} onClick={() => setIsOpen(false)}>
							<XIcon className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left">[Esc] Close</TooltipContent>
				</Tooltip>

				{!isDesktop &&
				<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
					<SheetContent side={"left"}>
						<SheetTitle className="hidden"/>
						<SheetDescription className="hidden"/>
						<SettingsTabs className="flex flex-col gap-2.5" selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
					</SheetContent>
				</Sheet>}
			</FocusLock>
	</div>
  )
}

export default SettingsPage