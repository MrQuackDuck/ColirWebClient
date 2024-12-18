import { CrownIcon } from "lucide-react";

import { useTranslation } from "../lib/hooks/useTranslation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

export function RoomOwnerIcon() {
  const t = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <CrownIcon fill="#854d0e" fillOpacity={0.5} strokeWidth={2.2} className="h-4 w-4 text-yellow-500 cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="text-xs">{t("ROOM_OWNER")}</TooltipContent>
    </Tooltip>
  );
}
