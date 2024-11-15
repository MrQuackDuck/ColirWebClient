import joinAudio from "../../../assets/audio/join.mp3";

export function playJoinSound() {
  const audio = new Audio(joinAudio);
  audio.volume = 0.5;
  audio.play();
}