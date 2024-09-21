import { UserModel } from "../model/UserModel";
import { useAdaptiveColor } from "@/shared/lib/hooks/useAdaptiveColor";
import { cn, decimalToHexString } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/Tooltip";
import { UserAuthType } from "../model/UserAuthType";
import Moment from "moment";

function Username({ user, className }: { user?: UserModel, className?: string }) {
  let whiteHex = 16777215;
  let { colorString, isAdjusted } = useAdaptiveColor(
    user ? user.hexId : whiteHex
  );

  function formatDate(date?: Date) {
    if (!date) return "Unknown Date";

    const givenDate = Moment(date);
    return givenDate.format("MM/DD/YYYY");
  }

  return (
    <Popover>
      <PopoverTrigger>
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
        <p style={{ color: colorString }}>{user?.username ?? "Unknown User"}</p>
        <Badge className={cn("my-1.5", user?.authType == UserAuthType.Google && "bg-red-500 hover:bg-red-600 text-white",
          user?.authType == UserAuthType.Github && "bg-gray-800 hover:bg-gray-700 text-white"
        )}>
          {user?.authType === UserAuthType.Anonymous ? "Anonymous" :
          user?.authType === UserAuthType.Google ? "Google" : 
          user?.authType === UserAuthType.Github ? "GitHub" : "Unknown"}
        </Badge>
        <div className="text-sm text-primary/80">
          <p><span className="font-medium">Colir ID</span>: {user ? decimalToHexString(user.hexId) : "Unknown"}</p>
          <p><span className="font-medium">Registration Date</span>: {formatDate(user?.registrationDate)}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default Username;
