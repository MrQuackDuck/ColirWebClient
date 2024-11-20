import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { useContextSelector } from "use-context-selector";
import { SettingsOpenCloseContext } from "@/features/open-close-settings/lib/providers/SettingsOpenCloseProvider";
import { BarChart3Icon, GlobeIcon, ImportIcon, MegaphoneIcon, UserIcon, Volume2Icon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/Tooltip";
import classes from "./SettingsPage.module.css";
import { Separator } from "@/shared/ui/Separator";
import Tab from "@/shared/ui/Tab";
import HeaderTab from "@/shared/ui/HeaderTab";
import AccountSettings from "./AccountSettings";
import { useResponsiveness } from "@/shared/lib/hooks/useResponsiveness";
import FocusLock from 'react-focus-lock';

enum SettingsTabs {
	Account = "account",
	VoiceSettings = "voice-settings",
	Notifications = "notifications",
	Statistics = "statistics",
	Language = "language",
	ImportExport = "import-export"
}

function SettingsPage() {
	const isOpen = useContextSelector(SettingsOpenCloseContext, c => c.isOpen);
	const setIsOpen = useContextSelector(SettingsOpenCloseContext, c => c.setIsOpen);

	let [isHidden, setIsHidden] = useState(!isOpen);
	let [isSettingsShows, setIsSettingsShows] = useState(isOpen);

	let [isAnyDialogOpen, setIsAnyDialogOpen] = useState(false);
	let [isAnyDialogOpenDelayed, setIsAnyDialogOpenDelayed] = useState(false);

  let [selectedTab, setSelectedTab] = useState(SettingsTabs.Account);

	let { isDesktop } = useResponsiveness();

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
				setSelectedTab(SettingsTabs.Account);
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
				<div className="flex flex-row gap-2.5 h-full">
					<div className="flex flex-col gap-2.5">
						<HeaderTab>Settings</HeaderTab>
						<Tab className={cn(isDesktop && "w-52")} isSelected={selectedTab == SettingsTabs.Account} onClick={() => setSelectedTab(SettingsTabs.Account)} >
							<UserIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5}/> Account
						</Tab>
						<Tab className={cn(isDesktop && "w-52")} isSelected={selectedTab == SettingsTabs.VoiceSettings} onClick={() => setSelectedTab(SettingsTabs.VoiceSettings)}>
							<Volume2Icon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5}/> Voice settings
						</Tab>
						<Tab className={cn(isDesktop && "w-52")} isSelected={selectedTab == SettingsTabs.Notifications} onClick={() => setSelectedTab(SettingsTabs.Notifications)}>
							<MegaphoneIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5}/> Notifications & Sounds
						</Tab>
						<Tab className={cn(isDesktop && "w-52")} isSelected={selectedTab == SettingsTabs.Statistics} onClick={() => setSelectedTab(SettingsTabs.Statistics)}>
							<BarChart3Icon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5}/> Statistics
						</Tab>
						<Tab className={cn(isDesktop && "w-52")} isSelected={selectedTab == SettingsTabs.Language} onClick={() => setSelectedTab(SettingsTabs.Language)}>
							<GlobeIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5}/> Language
						</Tab>
						<Separator orientation="horizontal"/>
						<Tab className={cn(isDesktop && "w-52")} isSelected={selectedTab == SettingsTabs.ImportExport} onClick={() => setSelectedTab(SettingsTabs.ImportExport)}>
							<ImportIcon className="text-popover-foreground mr-1.5 h-4 w-4" strokeWidth={2.5}/> Import/Export Settings
						</Tab>
					</div>
					<Separator className="h-full" orientation="vertical"/>
					<div className="w-full pl-4 pr-12 pt-5">
						{ selectedTab == SettingsTabs.Account && <AccountSettings/> }
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
			</FocusLock>
		</div>
  )
}

export default SettingsPage