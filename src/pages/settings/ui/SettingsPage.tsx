import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { useContextSelector } from "use-context-selector";
import { SettingsOpenCloseContext } from "@/features/open-close-settings/lib/providers/SettingsOpenCloseProvider";
import FocusLock from 'react-focus-lock';
import { XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/shared/ui/Dialog";
import { useEffect, useState } from "react";

function SettingsPage() {
	const isOpen = useContextSelector(SettingsOpenCloseContext, c => c.isOpen);
	const setIsOpen = useContextSelector(SettingsOpenCloseContext, c => c.setIsOpen);

	let [isHidden, setIsHidden] = useState(!isOpen);
	let [isSettingsShows, setIsSettingsShows] = useState(isOpen);

	// Additional functionality to set "display: hidden" to the component in order to prevent focusing on hidden elements when settings are closed
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

  return (
		<div className={cn("z-30 transition-all ease-in-out scale-[0.98] w-full h-full absolute bg-background pt-20 px-[16vw]", 
		!isSettingsShows && "opacity-0 pointer-events-none",
		isSettingsShows && "opacity-100 scale-100",
		isHidden && "hidden")}
		onKeyDown={e => (e.key === "Escape") && setIsOpen(false)}>
			<FocusLock disabled={!isOpen} onDeactivation={() => setIsOpen(false)}>
				<Dialog>
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

				<Button className="absolute right-0 top-0 rounded-full" variant={"outline"} size={'icon'} tabIndex={0} onClick={() => setIsOpen(false)}>
					<XIcon className="h-4 w-4" />
				</Button>
			</FocusLock>
		</div>
  )
}

export default SettingsPage