import { useContextSelector } from "use-context-selector";
import useSound from "use-sound";
import { NotificationsSettingsContext } from "../providers/NotificationsSettingsProvider";
import leaveAudio from "../../../assets/audio/leave.mp3";

export const usePlayLeaveSound = (): (() => void) => {
	const leaveSoundVolume = useContextSelector(NotificationsSettingsContext, c => c.joinLeaveVolume);
	const isJoinLeaveSoundDisabled = useContextSelector(NotificationsSettingsContext, c => c.isJoinLeaveSoundDisabled);

	const [playLeaveSound] = useSound(leaveAudio, { volume: leaveSoundVolume / 100, soundEnabled: !isJoinLeaveSoundDisabled });
	return playLeaveSound;
}