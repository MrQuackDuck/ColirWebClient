import { useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const EncryptionKeysContext = createContext<{
  getEncryptionKey: (roomGuid: string) => string | undefined;
  getAllEncryptionKeys: () => Map<string, string> | undefined;
  setEncryptionKey: (roomGuid: string, key: string) => void;
  removeEncryptionKey: (roomGuid: string) => void;
  changeTrigger: number;
}>({
  getEncryptionKey: () => undefined,
  getAllEncryptionKeys: () => undefined,
  setEncryptionKey: () => {},
  removeEncryptionKey: () => {},
  changeTrigger: 0,
});

export const EncryptionKeysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [changeTrigger, setChangeTrigger] = useState(0);
  const { setToLocalStorage, getFromLocalStorage } = useLocalStorage();
  const [encryptionKeys, setEncryptionKeys] = useState<Map<string, string>>(() => {
    const storedKeys = getFromLocalStorage('encryptionKeys');
    return new Map(storedKeys ? Object.entries(storedKeys) : []);
  });

  function getEncryptionKey(roomGuid: string) {
    return encryptionKeys.get(roomGuid);
  }

  function getAllEncryptionKeys() {
    return encryptionKeys;
  }

  function setEncryptionKey(roomGuid: string, key: string) {
    setEncryptionKeys(new Map(encryptionKeys).set(roomGuid, key));
    setChangeTrigger(changeTrigger + 1);
  }

  function removeEncryptionKey(roomGuid: string) {
    const newKeys = new Map(encryptionKeys);
    newKeys.delete(roomGuid);
    setEncryptionKeys(newKeys);
  }

  // Saves to local storage
  useEffect(() => {
    setToLocalStorage('encryptionKeys', Object.fromEntries(encryptionKeys));
  }, [encryptionKeys, setToLocalStorage]);

  return (
    <EncryptionKeysContext.Provider
      value={{ getEncryptionKey, getAllEncryptionKeys, setEncryptionKey, removeEncryptionKey, changeTrigger }}
    >
      {children}
    </EncryptionKeysContext.Provider>
  );
};