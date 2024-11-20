import { Button } from "@/shared/ui/Button"
import { Headphones, HeadphoneOff, MicIcon, MicOffIcon } from "lucide-react"
import { useContextSelector } from "use-context-selector"
import { VoiceChatControlsContext } from "../lib/providers/VoiceChatControlsProvider";
import { cn } from "@/shared/lib/utils";
import { VoiceChatConnectionsContext } from "@/widgets/voice-chat-section/lib/providers/VoiceChatConnectionsProvider";
import { useEffect } from "react";
import useSound from 'use-sound';
import { HubConnectionState } from "@microsoft/signalr";
import muteAudio from "../../../assets/audio/mute.mp3";
import unmuteAudio from "../../../assets/audio/unmute.mp3";
import deafenAudio from "../../../assets/audio/deafen.mp3";
import undeafenAudio from "../../../assets/audio/undeafen.mp3";

interface VoiceChatControlsProps {
  className?: string;
}

function VoiceChatControls({ className }: VoiceChatControlsProps) {
  const isMuted = useContextSelector(VoiceChatControlsContext, c => c.isMuted);
  const setIsMuted = useContextSelector(VoiceChatControlsContext, c => c.setIsMuted);
  const isDeafened = useContextSelector(VoiceChatControlsContext, c => c.isDeafened);
  const setIsDeafened = useContextSelector(VoiceChatControlsContext, c => c.setIsDeafened);
  const joinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, c => c.joinedVoiceConnection);

  const [playMuteSound] = useSound(muteAudio, { volume: 0.5 });
  const [playUnmuteSound] = useSound(unmuteAudio, { volume: 0.5 });
  const [playDeafenSound] = useSound(deafenAudio, { volume: 0.5 });
  const [playUndeafenSound] = useSound(undeafenAudio, { volume: 0.5 });

  function toggleMute() {
    if (isMuted) setTimeout(() => playUnmuteSound(), 25);
    else playMuteSound();

    if (isDeafened) setIsDeafened(false);
    setIsMuted(!isMuted);
  }

  function toggleDeafen() {
    if (!isDeafened) setIsMuted(true);
    setIsDeafened(!isDeafened);

    if (isDeafened) playUndeafenSound();
    else playDeafenSound();
  }

  useEffect(() => {
    if (joinedVoiceConnection && joinedVoiceConnection.connection.state == HubConnectionState.Connected) {
      if (isMuted) joinedVoiceConnection.connection.invoke("MuteSelf");
      else joinedVoiceConnection.connection.invoke("UnmuteSelf");
    }
  }, [isMuted]);

  useEffect(() => {
    if (joinedVoiceConnection && joinedVoiceConnection.connection.state == HubConnectionState.Connected) {
      if (isDeafened) joinedVoiceConnection.connection.invoke("DeafenSelf");
      else joinedVoiceConnection.connection.invoke("UndeafenSelf");
    }
  }, [isDeafened]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button onClick={toggleMute} variant={"ghost"} className="w-8 h-8 focus-visible:ring-offset-0" size={'icon'}>
        <span className={cn("transition-colors duration-100", isMuted && "text-destructive", !isMuted && "text-slate-400")}>
          {isMuted && <MicOffIcon strokeWidth={1.7} className="text-destructive w-6 h-6" />}
          {!isMuted && <MicIcon strokeWidth={1.7} className="text-slate-400 w-6 h-6" />}
        </span>
      </Button>
      <Button onClick={toggleDeafen} variant={"ghost"} className="w-8 h-8 focus-visible:ring-offset-0" size={'icon'}>
        <span className={cn("transition-colors duration-100", isDeafened && "text-destructive", !isDeafened && "text-slate-400")}>
          {isDeafened && <HeadphoneOff strokeWidth={1.7} className="w-6 h-6" />}
          {!isDeafened && <Headphones strokeWidth={1.7} className="w-6 h-6" />}
        </span>
      </Button>
    </div>
  )
}

export default VoiceChatControls