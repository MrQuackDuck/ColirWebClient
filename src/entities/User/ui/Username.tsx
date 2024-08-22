import { UserModel } from "../model/UserModel";
import { useAdaptiveColor } from "@/shared/lib/hooks/useAdaptiveColor";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/Tooltip";

function Username({ user, className }: { user?: UserModel, className?: string }) {
  let whiteHex = 16777215;
  let { colorString, isAdjusted } = useAdaptiveColor(
    user ? user.hexId : whiteHex
  );

  return (
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
  );
}

export default Username;
