import useSound from 'use-sound';
import joinAudio from "../../../assets/audio/join.mp3";
import { useContextSelector } from 'use-context-selector';
import { NotificationsSettingsContext } from '../providers/NotificationsSettingsProvider';

export const usePlayJoinSound = (): (() => void) => {
  const joinSoundVolume = useContextSelector(NotificationsSettingsContext, c => c.joinLeaveVolume);
  const isJoinLeaveSoundDisabled = useContextSelector(NotificationsSettingsContext, c => c.isJoinLeaveSoundDisabled);

  const [playJoinSound] = useSound(joinAudio, { volume: joinSoundVolume / 100, soundEnabled: !isJoinLeaveSoundDisabled });
  return playJoinSound;
}