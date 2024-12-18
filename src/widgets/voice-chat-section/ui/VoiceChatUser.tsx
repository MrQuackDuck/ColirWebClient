import { HeadphoneOff, MicIcon, MicOffIcon } from "lucide-react";
import { useState } from "react";

import { UserModel, UserPopup } from "@/entities/User";
import { cn, useAdaptiveColor } from "@/shared/lib";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";

import { VoiceChatUser as VoiceChatUserModel } from "../model/VoiceChatUser";

interface VoiceChatUserProps {
  voiceChatUser: VoiceChatUserModel;
  user?: UserModel;
  className?: string;
  isTalking?: boolean;
  couldDecrypt?: boolean;
}

function VoiceChatUser({ voiceChatUser, user, isTalking, couldDecrypt, className }: VoiceChatUserProps) {
  const whiteHex = 16777215;
  const { colorString } = useAdaptiveColor(user ? user.hexId : whiteHex);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger tabIndex={0} asChild onKeyDown={(e) => e.keyCode == 32 && setIsPopoverOpen(true)}>
        <div
          className="flex p-2 cursor-pointer transition-colors duration-150 hover:bg-secondary items-center justify-between gap-2 select-none
          rounded-sm overflow-visible focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
        >
          <span style={{ color: colorString, lineBreak: "anywhere" }} className={cn("cursor-pointer text-ellipsis text-sm", className)}>
            {user ? user.username : "Unknown User"}
          </span>
          <div className="flex flex-row gap-1 text-slate-400">
            {voiceChatUser.isMuted ? (
              <MicOffIcon className="w-5 h-5" />
            ) : (
              <MicIcon className={cn("w-5 h-5 transition-colors duration-75", isTalking && couldDecrypt && "text-lime-600", isTalking && !couldDecrypt && "text-destructive")} />
            )}
            {voiceChatUser.isDeafened && <HeadphoneOff className="w-5 h-5" />}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <UserPopup user={user} colorString={colorString} />
      </PopoverContent>
    </Popover>
  );
}

export default VoiceChatUser;
