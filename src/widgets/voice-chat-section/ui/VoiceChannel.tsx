import { Button } from '@/shared/ui/Button'
import { Collapsible, CollapsibleContent } from '@/shared/ui/Collapsible';
import { ChevronUpIcon, HeadphoneOff, MicIcon, MicOffIcon, Plug2Icon, UnplugIcon, Volume2Icon } from 'lucide-react'
import { useState } from 'react';
import { VoiceChatConnection } from '../model/VoiceChatConnection';
import { cn } from '@/shared/lib/utils';
import { useContextSelector } from 'use-context-selector';
import { UsersContext } from '@/entities/User/lib/providers/UsersProvider';
import Username from '@/entities/User/ui/Username';

interface VoiceChannelProps {
  roomName: string;
  voiceChatConnection: VoiceChatConnection;
  isJoined: boolean;
  joinVoiceChannel: (voiceChatConnection: VoiceChatConnection) => void;
  leaveVoiceChannel: (voiceChatConnection: VoiceChatConnection) => void;
}

function VoiceChannel(props: VoiceChannelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const users = useContextSelector(UsersContext, (c) => c.users);

  function toggleCollapse() {
    setIsCollapsed(!isCollapsed);
  }

  function joinVoiceChannel() {
    props.joinVoiceChannel(props.voiceChatConnection);
  }

  function joinOrLeaveVoiceChannel() {
    if (props.isJoined) props.leaveVoiceChannel(props.voiceChatConnection);
    else joinVoiceChannel();
  }

  return (
    <div className='flex flex-col px-1'>
      <div className="flex items-center">
        <div className="flex flex-grow items-center select-none gap-1.5 min-w-0">
          <Volume2Icon className="w-4 h-4 mr-0.5 flex-shrink-0 text-slate-400"/>
          <span onClick={joinVoiceChannel} className='text-sm cursor-pointer hover:underline font-medium overflow-hidden text-ellipsis whitespace-nowrap'>
            {props.roomName}
          </span>
        </div>
        <Button
          onClick={joinOrLeaveVoiceChannel}
          className="w-8 h-8 flex-shrink-0 ml-2"
          variant="ghost"
          size="icon">  
          <span className={cn("transition-colors duration-100", props.isJoined && "text-destructive", !props.isJoined && "text-slate-400")}>
            {props.isJoined && <UnplugIcon className="w-[1.125rem] h-[1.125rem]" />}
            {!props.isJoined && <Plug2Icon className="w-[1.125rem] h-[1.125rem]" />}
          </span>
        </Button>
        <Button
          onClick={toggleCollapse}
          className="w-8 h-8 flex-shrink-0 ml-1"
          variant="ghost"
          size="icon">
          <ChevronUpIcon className={cn("w-5 h-5 text-slate-400 transition-transform duration-100", isCollapsed && "rotate-180")}/>
        </Button>
      </div>
      <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleContent asChild>
          <div className='flex flex-col'>
            {props.voiceChatConnection.joinedUsers.map((user) => (
              <div key={user.hexId} className="flex p-1 items-center justify-between gap-2">
                <Username user={users.find(u => u.hexId == user.hexId)} />
                <div className='flex flex-row gap-1 text-slate-400'>
                  { user.isMuted ? <MicOffIcon className="w-5 h-5"/> : <MicIcon className="w-5 h-5"/> }
                  { user.isDeafened && <HeadphoneOff className="w-5 h-5"/> }
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default VoiceChannel