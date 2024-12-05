import React, { useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
import { cn } from "../lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { Button } from "./Button_";
import { XIcon } from "lucide-react";
import classes from "./PopupWindow.module.css";

interface PopupWindowProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onEscapePressed?: () => void;
  onPopupShown?: () => void;
  children?: any;
}

function PopupWindow(props: PopupWindowProps) {
  let [isHidden, setIsHidden] = useState(!props.isOpen);
  let [isPopupWindowShown, setisPopupWindowShown] = useState(props.isOpen);

  // Additional functionality to set "display: hidden" to the component
  // in order to prevent focusing on hidden elements when the popup is closed
  useEffect(() => {
    if (props.isOpen) {
      setIsHidden(false);
      setTimeout(() => {
        setisPopupWindowShown(true);
        if (props.onPopupShown) props?.onPopupShown();
      }, 50);
    } else {
      setisPopupWindowShown(false);
      setTimeout(() => setIsHidden(true), 100);
    }
  }, [props.isOpen]);

  return (
    <div
      className={cn(
        "z-30 transition-all ease-in-out scale-[0.98] w-full h-full absolute bg-background overflow-y-hidden",
        classes.popupWindow,
        !isPopupWindowShown && "opacity-0 pointer-events-none",
        isPopupWindowShown && "opacity-100 scale-100",
        isHidden && "hidden"
      )}
      onKeyDown={(e) => e.key === "Escape" && props.onEscapePressed && props.onEscapePressed()}
    >
      <FocusLock className="h-full" disabled={!props.isOpen} onDeactivation={() => props.setIsOpen(false)}>
        {props.children}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="absolute right-2.5 top-0 rounded-full" variant={"outline"} size={"icon"} tabIndex={0} onClick={() => props.setIsOpen(false)}>
              <XIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">[Esc] Close</TooltipContent>
        </Tooltip>
      </FocusLock>
    </div>
  );
}

export default PopupWindow;
