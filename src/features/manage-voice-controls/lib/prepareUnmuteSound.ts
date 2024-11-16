import { prepareSound } from "@/shared/lib/prepareSound";
import unmuteAudio from "../../../assets/audio/unmute.mp3";

export function prepareUnmuteSound(): Promise<() => Promise<void>> {
  return prepareSound(unmuteAudio);
}