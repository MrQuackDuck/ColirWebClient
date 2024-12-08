import { decryptString, encryptString } from "../utils";

export const useLocalStorage = () => {
  function generateRandomKey(length: number = 16): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  function setToLocalStorage(key: string, data: any) {
    const randomKey = generateRandomKey();
    const jsonString = JSON.stringify(data);
    const encryptedData = encryptString(jsonString, randomKey);
    localStorage.setItem(key, encryptedData + randomKey);
  }

  function getFromLocalStorage<T>(key: string): T | null {
    try {
      const storedValue = localStorage.getItem(key);
      if (!storedValue) return null;

      const encryptedData = storedValue.slice(0, -16);
      const randomKey = storedValue.slice(-16);
      const decryptedString = decryptString(encryptedData, randomKey);

      if (decryptedString === undefined) return null;

      return JSON.parse(decryptedString) as T;
    } catch {
      return null;
    }
  }

  function removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  return { setToLocalStorage, getFromLocalStorage, removeFromLocalStorage };
};
