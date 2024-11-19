import React from "react";
import { UserModel } from "../model/UserModel";
import { useAdaptiveColor } from "@/shared/lib/hooks/useAdaptiveColor";
import { cn } from "@/shared/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/Tooltip";
import { useState } from "react";
import UserPopup from "./UserPopup";

const Username = React.memo(function Username({ 
  user, 
  className 
}: { 
  user?: UserModel, 
  className?: string 
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const whiteHex = 16777215;
  const { colorString, isAdjusted } = useAdaptiveColor(user ? user.hexId : whiteHex);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger className="rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              style={{ color: colorString }}
              className={cn("cursor-pointer text-ellipsis hover:underline text-sm", className)}>
              {user ? user.username : "Unknown User"}
            </span>
          </TooltipTrigger>
          {isAdjusted && user && (
            <TooltipContent>
              <p>The color was adjusted</p>
            </TooltipContent>
          )}
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent>
        {isPopoverOpen && (
          <UserPopup 
            user={user} 
            colorString={colorString} 
          />
        )}
      </PopoverContent>
    </Popover>
  );
});

export default Username;