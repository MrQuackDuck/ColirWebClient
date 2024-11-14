export interface UserAudioTrack {
  userHexId: number;
  track: HTMLAudioElement;
  couldDecrypt: boolean;
}