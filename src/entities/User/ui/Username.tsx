import React from "react";
import { UserModel } from "../model/UserModel";
import { useAdaptiveColor } from "@/shared/lib/hooks/useAdaptiveColor";
import { cn } from "@/shared/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/Tooltip";
import UserPopup from "./UserPopup";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";

const Username = React.memo(function Username({ user, className }: { user?: UserModel; className?: string }) {
  const t = useTranslation();
  const whiteHex = 16777215;
  const { colorString, isAdjusted } = useAdaptiveColor(user ? user.hexId : whiteHex);

  return (
    <Popover>
      <PopoverTrigger style={{ color: colorString }} className="max-w-56 rounded-sm text-nowrap overflow-hidden text-ellipsis focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <span style={{ color: colorString }} className={cn("cursor-pointer text-left text-nowrap overflow-hidden text-ellipsis hover:underline text-sm", className)}>
              {user ? user.username : t("UNKNOWN_USER")}
            </span>
          </TooltipTrigger>
          {isAdjusted && user && (
            <TooltipContent>
              <p>{t("COLOR_WAS_ADJUSTED_TO_FIT_THEME")}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent>
        <UserPopup user={user} colorString={colorString} />
      </PopoverContent>
    </Popover>
  );
});

export default Username;
