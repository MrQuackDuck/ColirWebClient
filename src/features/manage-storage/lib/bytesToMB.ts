export function bytesToMB(bytes: number) {
  return Number((bytes / 1024 / 1024).toFixed(2));
}