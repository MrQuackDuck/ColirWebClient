import { prepareSound } from "@/shared/lib/prepareSound";
import leaveAudio from "../../../assets/audio/leave.mp3";

export function prepareLeaveSound(): Promise<() => Promise<void>> {
  return prepareSound(leaveAudio);
}