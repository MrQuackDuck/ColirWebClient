import leaveAudio from "../../../assets/audio/leave.mp3";

export function playLeaveSound() {
  const audio = new Audio(leaveAudio);
  audio.volume = 0.5;
  audio.play();
}