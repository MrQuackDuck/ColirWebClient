import { prepareSound } from "@/shared/lib/prepareSound";
import deafenAudio from "../../../assets/audio/deafen.mp3";

export function prepareDeafenSound(): Promise<() => Promise<void>> {
  return prepareSound(deafenAudio);
}