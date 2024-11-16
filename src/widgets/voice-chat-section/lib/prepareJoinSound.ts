import { prepareSound } from "@/shared/lib/prepareSound";
import joinAudio from "../../../assets/audio/join.mp3";

export function prepareJoinSound(): Promise<() => Promise<void>> {
  return prepareSound(joinAudio);
}