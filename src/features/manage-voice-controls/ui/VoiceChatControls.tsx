import { Button } from "@/shared/ui/Button"
import { Headphones, HeadphoneOff, MicIcon, MicOffIcon } from "lucide-react"
import { useContextSelector } from "use-context-selector"
import { VoiceChatControlsContext } from "../lib/providers/VoiceChatControlsProvider";
import { cn } from "@/shared/lib/utils";
import { VoiceChatConnectionsContext } from "@/widgets/voice-chat-section/lib/providers/VoiceChatConnectionsProvider";
import { useEffect } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { prepareUnmuteSound } from "../lib/prepareUnmuteSound";
import { prepareUndeafenSound } from "../lib/prepareUndeafenSound";
import { prepareDeafenSound } from "../lib/prepareDeafenSound";

function VoiceChatControls() {
  const isMuted = useContextSelector(VoiceChatControlsContext, c => c.isMuted);
  const setIsMuted = useContextSelector(VoiceChatControlsContext, c => c.setIsMuted);
  const isDeafened = useContextSelector(VoiceChatControlsContext, c => c.isDeafened);
  const setIsDeafened = useContextSelector(VoiceChatControlsContext, c => c.setIsDeafened);
  const joinedVoiceConnection = useContextSelector(VoiceChatConnectionsContext, c => c.joinedVoiceConnection);

  function toggleMute() {
    if (isDeafened) setIsDeafened(false);
    setIsMuted(!isMuted);

    if (isMuted) prepareUnmuteSound().then(play => play());
    else prepareUnmuteSound().then(play => play());
  }

  function toggleDeafen() {
    if (!isDeafened) setIsMuted(true);
    setIsDeafened(!isDeafened);

    if (isDeafened) prepareUndeafenSound().then(play => play());
    else prepareDeafenSound().then(play => play());
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
    <div className="flex flex-col gap-2">
      <Button onClick={toggleMute} variant={"ghost"} className="w-8 h-8" size={'icon'}>
        <span className={cn("transition-colors duration-100", isMuted && "text-destructive", !isMuted && "text-slate-400")}>
          {isMuted && <MicOffIcon strokeWidth={1.7} className="text-destructive w-6 h-6" />}
          {!isMuted && <MicIcon strokeWidth={1.7} className="text-slate-400 w-6 h-6" />}
        </span>
      </Button>
      <Button onClick={toggleDeafen} variant={"ghost"} className="w-8 h-8" size={'icon'}>
        <span className={cn("transition-colors duration-100", isDeafened && "text-destructive", !isDeafened && "text-slate-400")}>
          {isDeafened && <HeadphoneOff strokeWidth={1.7} className="w-6 h-6" />}
          {!isDeafened && <Headphones strokeWidth={1.7} className="w-6 h-6" />}
        </span>
      </Button>
    </div>
  )
}

export default VoiceChatControls