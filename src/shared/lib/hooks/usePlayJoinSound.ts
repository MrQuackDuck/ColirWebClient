import useSound from 'use-sound';
import joinAudio from "../../../assets/audio/join.mp3";

export const usePlayJoinSound = (): (() => void) => {
  const [playJoinSound] = useSound(joinAudio, { volume: 0.5 });
  return playJoinSound;
}