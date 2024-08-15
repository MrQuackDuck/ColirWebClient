export function addMinutes(date: Date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}