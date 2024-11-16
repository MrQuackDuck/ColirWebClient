import { prepareSound } from "@/shared/lib/prepareSound";
import muteAudio from "../../../assets/audio/mute.mp3";

export function prepareMuteSound(): Promise<() => Promise<void>> {
  return prepareSound(muteAudio);
}