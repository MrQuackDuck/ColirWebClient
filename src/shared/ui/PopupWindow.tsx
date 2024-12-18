import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import FocusLock from "react-focus-lock";

import { useResponsiveness } from "../lib/hooks/useResponsiveness";
import { useTranslation } from "../lib/hooks/useTranslation";
import { cn } from "../lib/utils";
import { Button } from "./Button";
import classes from "./PopupWindow.module.css";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

interface PopupWindowProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onEscapePressed?: () => void;
  onPopupShown?: () => void;
  children?: any;
}

export function PopupWindow(props: PopupWindowProps) {
  const t = useTranslation();

  const [isHidden, setIsHidden] = useState(!props.isOpen);
  const [isPopupWindowShown, setisPopupWindowShown] = useState(props.isOpen);
  const { isDesktop } = useResponsiveness();

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
        "z-30 transition-all ease-in-out scale-[0.98] w-full h-full fixed bg-background overflow-y-hidden",
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
          {isDesktop && <TooltipContent side="left">{t("ESC_CLOSE")}</TooltipContent>}
        </Tooltip>
      </FocusLock>
    </div>
  );
}
