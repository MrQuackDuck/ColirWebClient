import { prepareSound } from "@/shared/lib/prepareSound";
import undeafenAudio from "../../../assets/audio/undeafen.mp3";

export function prepareUndeafenSound(): Promise<() => Promise<void>> {
  return prepareSound(undeafenAudio);
}