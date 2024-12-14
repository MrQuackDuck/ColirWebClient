import { Button } from "@/shared/ui/Button";
import { Collapsible, CollapsibleContent } from "@/shared/ui/Collapsible";
import { ChevronUpIcon, Plug2Icon, UnplugIcon, Volume2Icon } from "lucide-react";
import { VoiceChatConnection } from "../model/VoiceChatConnection";
import { cn } from "@/shared/lib/utils";
import { useContextSelector } from "use-context-selector";
import { UsersContext } from "@/entities/User/lib/providers/UsersProvider";
import VoiceChatUser from "./VoiceChatUser";
import { CurrentlyTalkingUser } from "../model/CurrentlyTalkingUser";

interface VoiceChatProps {
  roomName: string;
  voiceChatConnection: VoiceChatConnection;
  isJoined: boolean;
  joinVoiceChat: (voiceChatConnection: VoiceChatConnection) => void;
  leaveVoiceChat: (voiceChatConnection: VoiceChatConnection) => void;
  currentlyTalkingUsers?: CurrentlyTalkingUser[];
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

function VoiceChat(props: VoiceChatProps) {
  const users = useContextSelector(UsersContext, (c) => c.users);

  function toggleCollapse() {
    props.toggleCollapse();
  }

  function joinVoiceChat() {
    props.joinVoiceChat(props.voiceChatConnection);
  }

  function joinOrLeaveVoiceChat() {
    if (props.isJoined) props.leaveVoiceChat(props.voiceChatConnection);
    else joinVoiceChat();
  }

  return (
    <div className="flex flex-col px-1">
      <div className="flex items-center">
        <div className="flex flex-grow items-center select-none gap-1.5 min-w-0">
          <Volume2Icon className="w-4 h-4 mr-0.5 flex-shrink-0 text-slate-400" />
          <span onClick={joinVoiceChat} className="text-sm cursor-pointer hover:underline font-medium overflow-hidden text-ellipsis whitespace-nowrap">
            {props.roomName}
          </span>
        </div>
        <Button onClick={joinOrLeaveVoiceChat} className="w-8 h-8 flex-shrink-0 ml-2" variant="ghost" size="icon">
          <span className={cn("transition-colors duration-100", props.isJoined && "text-destructive", !props.isJoined && "text-slate-400")}>
            {props.isJoined && <UnplugIcon className="w-[1.125rem] h-[1.125rem]" />}
            {!props.isJoined && <Plug2Icon className="w-[1.125rem] h-[1.125rem]" />}
          </span>
        </Button>
        <Button onClick={toggleCollapse} className="w-8 h-8 flex-shrink-0 ml-1" variant="ghost" size="icon">
          <ChevronUpIcon className={cn("w-5 h-5 text-slate-400 transition-transform duration-100", props.isCollapsed && "rotate-180")} />
        </Button>
      </div>
      <Collapsible open={!props.isCollapsed}>
        <CollapsibleContent asChild>
          <div className="flex flex-col pt-1">
            {props.voiceChatConnection.joinedUsers.map((user) => (
              <VoiceChatUser
                key={user.hexId}
                user={users.find((u) => u.hexId == user.hexId)}
                voiceChatUser={user}
                isTalking={props.currentlyTalkingUsers?.some((t) => t.userHexId == user.hexId)}
                couldDecrypt={props.currentlyTalkingUsers?.find((t) => t.userHexId == user.hexId)?.couldDecrypt}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default VoiceChat;
