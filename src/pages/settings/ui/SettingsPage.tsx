import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { useContextSelector } from "use-context-selector";
import { SettingsOpenCloseContext } from "@/features/open-close-settings/lib/providers/SettingsOpenCloseProvider";
import FocusLock from 'react-focus-lock';
import { XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/shared/ui/Dialog";
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/Tooltip";
import { useResponsiveness } from "@/shared/lib/hooks/useResponsiveness";
import classes from "./SettingsPage.module.css";

function SettingsPage() {
	const isOpen = useContextSelector(SettingsOpenCloseContext, c => c.isOpen);
	const setIsOpen = useContextSelector(SettingsOpenCloseContext, c => c.setIsOpen);
	let closeButtonRef = useRef<HTMLButtonElement>(null);

	let [isHidden, setIsHidden] = useState(!isOpen);
	let [isSettingsShows, setIsSettingsShows] = useState(isOpen);

	let [isAnyDialogOpen, setIsAnyDialogOpen] = useState(false);
	let [isAnyDialogOpenDelayed, setIsAnyDialogOpenDelayed] = useState(false);

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
			setTimeout(() => setIsSettingsShows(true), 50);
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
		closeButtonRef.current?.focus();
	}

  return (
		<div className={cn("z-30 transition-all ease-in-out scale-[0.98] w-full h-full absolute bg-background",
		classes.settingsPage,
		!isSettingsShows && "opacity-0 pointer-events-none",
		isSettingsShows && "opacity-100 scale-100",
		isHidden && "hidden")}
		onKeyDown={e => (e.key === "Escape") && handleEscapePressForContainer()}>
			<FocusLock disabled={!isOpen} onDeactivation={() => setIsOpen(false)}>
				<Dialog open={isAnyDialogOpen} onOpenChange={setIsAnyDialogOpen}>
					<DialogTrigger asChild>
						<Button>Open Dialog</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogTitle>Title</DialogTitle>
						<DialogDescription>Description</DialogDescription>
						<Button>Button #1</Button>
						<Button>Button #2</Button>
					</DialogContent>
				</Dialog>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button onKeyDown={e => (e.key == "Escape") && setIsOpen(false)} ref={closeButtonRef} className="absolute right-0 top-0 rounded-full" variant={"outline"} size={'icon'} tabIndex={0} onClick={() => setIsOpen(false)}>
							<XIcon className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side={isDesktop ? "top" : "left"}>[Esc] Close</TooltipContent>
				</Tooltip>
			</FocusLock>
		</div>
  )
}

export default SettingsPage