import { UserModel } from '@/entities/User/model/UserModel';
import { useAdaptiveColor } from '@/shared/lib/hooks/useAdaptiveColor';
import { cn } from '@/shared/lib/utils';
import { HeadphoneOff, MicIcon, MicOffIcon } from 'lucide-react';
import { VoiceChatUser as VoiceChatUserModel } from '../model/VoiceChatUser';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover';
import UserPopup from '@/entities/User/ui/UserPopup';
import { useState } from 'react';

interface VoiceChatUserProps {
  voiceChatUser: VoiceChatUserModel;
  user?: UserModel;
  className?: string;
  isTalking?: boolean;
  couldDecrypt?: boolean;
}

function VoiceChatUser({voiceChatUser, user, isTalking, couldDecrypt, className}: VoiceChatUserProps) {
  const whiteHex = 16777215;
  const { colorString } = useAdaptiveColor(user ? user.hexId : whiteHex);
  
  let [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger tabIndex={0} asChild onKeyDown={(e) => e.keyCode == 32 && setIsPopoverOpen(true)}>
        <div className="flex p-2 cursor-pointer transition-colors duration-150 hover:bg-secondary items-center justify-between gap-2 select-none
          rounded-sm overflow-visible focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1">
          <span
            style={{ color: colorString }}
            className={cn("cursor-pointer text-ellipsis text-sm", className)}>
            {user ? user.username : "Unknown User"}
          </span>
          <div className='flex flex-row gap-1 text-slate-400'>
            { voiceChatUser.isMuted ? <MicOffIcon className="w-5 h-5"/> : 
              <MicIcon 
                className={cn("w-5 h-5 transition-colors duration-75",
                  isTalking && couldDecrypt && "text-lime-600",
                  isTalking && !couldDecrypt && "text-destructive")}/> }
            { voiceChatUser.isDeafened && <HeadphoneOff className="w-5 h-5"/> }
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <UserPopup user={user} colorString={colorString} />
      </PopoverContent>
    </Popover>
  )
}

export default VoiceChatUser