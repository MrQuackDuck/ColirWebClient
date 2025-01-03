import CryptoJS from "crypto-js";
import FileSaver from "file-saver";
import Moment from "moment";
import { useContextSelector } from "use-context-selector";

import { UsersVolumeContext } from "@/features/control-user-volume";
import { decryptString, encryptString, TimeFormatSettingsContext } from "@/shared/lib";

import { EncryptionKeysContext } from "../providers/EncryptionKeysProvider";
import { LanguageSettingsContext } from "../providers/LanguageSettingsProvider";
import { NotificationsSettingsContext } from "../providers/NotificationsSettingsProvider";
import { VoiceSettingsContext } from "../providers/VoiceSettingsProvider";

class Settings {
  currentLanguage: string;
  encryptionKeys: [string, string][];
  timeFormat: string;
  userVolumes: Record<number, number>;
  isJoinLeaveSoundDisabled: boolean;
  isPingSoundDisabled: boolean;
  joinLeaveVolume: number;
  pingVolume: number;
  voiceInputDevice: string;
  voiceInputVolume: number;
  voiceOutputDevice: string;
  voiceOutputVolume: number;
}

export const useImportExportSettings = () => {
  const { currentLanguage, setCurrentLanguage } = useContextSelector(LanguageSettingsContext, (c) => c);
  const userVolumes = useContextSelector(UsersVolumeContext, (c) => c.userVolumes);
  const { getAllEncryptionKeys, setEncryptionKey } = useContextSelector(EncryptionKeysContext, (c) => c);
  const { timeFormat, setTimeFormat } = useContextSelector(TimeFormatSettingsContext, c => c);

  const { pingVolume, isPingSoundDisabled, setPingVolume, setIsPingSoundDisabled, joinLeaveVolume, isJoinLeaveSoundDisabled, setJoinLeaveVolume, setIsJoinLeaveSoundDisabled } = useContextSelector(
    NotificationsSettingsContext,
    (c) => c
  );

  const { voiceInputDevice, setVoiceInputDevice, voiceInputVolume, setVoiceInputVolume, voiceOutputDevice, setVoiceOutputDevice, voiceOutputVolume, setVoiceOutputVolume } = useContextSelector(
    VoiceSettingsContext,
    (c) => c
  );

  // Helper: Generate random 64-character key
  const generateKey = (): string => {
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  };

  // Export settings
  const exportSettings = (): void => {
    const settings: Settings = {
      encryptionKeys: Array.from(getAllEncryptionKeys()!.entries()) ?? new Map<string, string>(),
      currentLanguage,
      timeFormat,
      userVolumes,
      isJoinLeaveSoundDisabled,
      isPingSoundDisabled,
      joinLeaveVolume,
      pingVolume,
      voiceInputDevice,
      voiceInputVolume,
      voiceOutputDevice,
      voiceOutputVolume
    };

    // Serialize and compute checksum
    const serializedSettings = JSON.stringify(settings);
    const checksum = CryptoJS.SHA256(serializedSettings).toString();

    // Generate encryption key and encrypt
    const encryptionKey = generateKey();
    const encryptedData = encryptString(serializedSettings, encryptionKey);

    // Append key and checksum
    const finalData = `${encryptedData}${checksum}${encryptionKey}`;

    // Save file
    const blob = new Blob([finalData], { type: "text/plain" });
    FileSaver.saveAs(blob, `settings-${Moment().format("YYYY-MM-DD h-mm-ss")}.esf`); // ESF = Encrypted Settings File
  };

  // Import settings
  const importSettings = async (file: File): Promise<void> => {
    const fileContent = await file.text();

    // Extract key and checksum
    const encryptionKey = fileContent.slice(-64);
    const checksum = fileContent.slice(-128, -64);
    const encryptedData = fileContent.slice(0, -128);

    // Decrypt data
    const decryptedData = decryptString(encryptedData, encryptionKey);
    if (!decryptedData) {
      throw new Error("Failed to decrypt settings. The key may be incorrect.");
    }

    // Verify checksum
    const computedChecksum = CryptoJS.SHA256(decryptedData).toString();
    if (computedChecksum !== checksum) {
      throw new Error("Checksum mismatch. The file may be corrupted or tampered with.");
    }

    // Parse settings and update contexts
    const settings: Settings = JSON.parse(decryptedData);
    settings.encryptionKeys.forEach(([roomGuid, key]) => {
      setEncryptionKey(roomGuid, key);
    });

    setCurrentLanguage(settings.currentLanguage);
    setTimeFormat(settings.timeFormat as "12-hour" | "24-hour");
    setIsJoinLeaveSoundDisabled(settings.isJoinLeaveSoundDisabled);
    setIsPingSoundDisabled(settings.isPingSoundDisabled);
    setJoinLeaveVolume(settings.joinLeaveVolume);
    setPingVolume(settings.pingVolume);
    setVoiceInputDevice(settings.voiceInputDevice);
    setVoiceInputVolume(settings.voiceInputVolume);
    setVoiceOutputDevice(settings.voiceOutputDevice);
    setVoiceOutputVolume(settings.voiceOutputVolume);
  };

  return { exportSettings, importSettings };
};
