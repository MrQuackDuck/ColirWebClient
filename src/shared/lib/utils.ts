import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function replaceAll(str, match, replacement){
  return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function decimalToHexString(number)
{
  if (number < 0)
    number = 0xFFFFFFFF + number + 1;

  return "#" + number.toString(16).toUpperCase();
}