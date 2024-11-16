export function prepareSound(sound: string): Promise<() => Promise<void>> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(sound);
    audio.volume = 0.5;
    
    audio.addEventListener('canplaythrough', () => {
      resolve(() => audio.play());
    }, { once: true });
    
    audio.addEventListener('error', reject, { once: true });
  });
}