import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { useContextSelector } from "use-context-selector";
import { SettingsOpenCloseContext } from "@/features/open-close-settings/lib/providers/SettingsOpenCloseProvider";
import FocusLock from 'react-focus-lock';
import { XIcon } from "lucide-react";

function SettingsPage() {
	const isOpen = useContextSelector(SettingsOpenCloseContext, c => c.isOpen);
	const setIsOpen = useContextSelector(SettingsOpenCloseContext, c => c.setIsOpen);

  return (
		<div className={cn("z-30 w-full h-full absolute bg-background pt-20 px-[16vw]", !isOpen && "hidden")}>
			<FocusLock disabled={!isOpen}>
				<Button className="absolute right-0 top-0 rounded-full" variant={"outline"} size={'icon'} tabIndex={0} onClick={() => setIsOpen(false)}>
					<XIcon className="h-4 w-4" />
				</Button>
			</FocusLock>
		</div>
  )
}

export default SettingsPage