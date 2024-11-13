import { UserModel } from '@/entities/User/model/UserModel';
import { useAdaptiveColor } from '@/shared/lib/hooks/useAdaptiveColor';
import { cn } from '@/shared/lib/utils';
import { HeadphoneOff, MicIcon, MicOffIcon } from 'lucide-react';
import { VoiceChatUser as VoiceChatUserModel } from '../model/VoiceChatUser';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover';
import UserPopup from '@/entities/User/ui/UserPopup';

interface VoiceChatUserProps {
  voiceChatUser: VoiceChatUserModel;
  user?: UserModel;
  className?: string;
  isTalking?: boolean;
}

function VoiceChatUser({isTalking, voiceChatUser, user, className}: VoiceChatUserProps) {
  const whiteHex = 16777215;
  const { colorString } = useAdaptiveColor(user ? user.hexId : whiteHex);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex p-2 cursor-pointer transition-colors duration-150 hover:bg-secondary items-center justify-between gap-2 rounded-sm select-none">
          <span
            style={{ color: colorString }}
            className={cn("cursor-pointer text-ellipsis text-sm", className)}>
            {user ? user.username : "Unknown User"}
          </span>
          <div className='flex flex-row gap-1 text-slate-400'>
            { voiceChatUser.isMuted ? <MicOffIcon className="w-5 h-5"/> : <MicIcon className={cn("w-5 h-5 transition-colors duration-75", isTalking && "text-lime-600")}/> }
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