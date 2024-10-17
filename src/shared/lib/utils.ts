import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import CryptoJS from 'crypto-js';

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

export function encryptString(str: string, key: string): string {
  if (str.length === 0) return str;
  const encrypted = CryptoJS.AES.encrypt(str, key);
  return encrypted.toString();
}

export function decryptString(str: string, key: string): string | undefined {
  if (str.length === 0) return " ";
  try {
    const decrypted = CryptoJS.AES.decrypt(str, key);
    let decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (str.length > 0 && decryptedString.length === 0) return undefined;

    return decryptedString;
  } 
  catch (error) {
    return undefined;
  }
}

export async function encryptFile(file: File, secretKey: string): Promise<File> {
  const fileArrayBuffer = await file.arrayBuffer();
  const fileWordArray = CryptoJS.lib.WordArray.create(fileArrayBuffer);
  const encrypted = CryptoJS.AES.encrypt(fileWordArray, secretKey).toString(CryptoJS.format.Base64);  

  // Convert encrypted string back to Blob and create a new File
  const encryptedBlob = new Blob([encrypted], { type: file.type });
  const encryptedFile = new File([encryptedBlob], file.name, { type: file.type });

  return encryptedFile;
}

export async function decryptFile(encryptedData: Blob, secretKey: string): Promise<Blob> {
  const encryptedString = await encryptedData.text(); // Read encrypted data as a string
  const decrypted = CryptoJS.AES.decrypt(encryptedString, secretKey);
  const decryptedString = decrypted.toString(CryptoJS.enc.Base64); // Decrypted data in Base64

  // Convert decrypted Base64 string back to binary data
  const byteCharacters = atob(decryptedString);
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);

  // Create a blob from the binary data and return it
  return new Blob([byteArray]);
};