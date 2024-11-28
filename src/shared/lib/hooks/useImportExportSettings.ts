import { useContextSelector } from "use-context-selector"
import { EncryptionKeysContext } from "../providers/EncryptionKeysProvider"
import FileSaver from "file-saver";
import { LanguageSettingsContext } from "../providers/LanguageSettingsProvider";
import { UsersVolumeContext } from "@/features/control-user-volume/lib/providers/UsersVolumeProvider";
import { NotificationsSettingsContext } from "../providers/NotificationsSettingsProvider";
import { VoiceSettingsContext } from "../providers/VoiceSettingsProvider";

interface Settings {
	currentLanguage: string;
	encryptionKeys: [string, string][];
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
	let currentLanguage = useContextSelector(LanguageSettingsContext, c => c.currentLanguage);
	let userVolumes = useContextSelector(UsersVolumeContext, c => c.userVolumes);
	let { getAllEncryptionKeys, setEncryptionKey } = useContextSelector(EncryptionKeysContext, c => c);
	
	const { 
    pingVolume,
    isPingSoundDisabled,
    setPingVolume,
    setIsPingSoundDisabled,
    joinLeaveVolume,
    isJoinLeaveSoundDisabled,
    setJoinLeaveVolume,
    setIsJoinLeaveSoundDisabled
  } = useContextSelector(NotificationsSettingsContext, c => c);

  const { voiceInputDevice,
		setVoiceInputDevice,
    voiceInputVolume,
    setVoiceInputVolume,
    voiceOutputDevice,
    setVoiceOutputDevice,
    voiceOutputVolume,
    setVoiceOutputVolume } = useContextSelector(VoiceSettingsContext, c => c);

	const exportSettings = (): void => {
		let settings: Settings = {
			encryptionKeys: Array.from(getAllEncryptionKeys()!.entries()) ?? new Map<string, string>(),
			currentLanguage: currentLanguage,
			userVolumes: userVolumes,
			isJoinLeaveSoundDisabled: isJoinLeaveSoundDisabled,
			isPingSoundDisabled: isPingSoundDisabled,
			joinLeaveVolume: joinLeaveVolume,
			pingVolume: pingVolume,
			voiceInputDevice: voiceInputDevice,
			voiceInputVolume: voiceInputVolume,
			voiceOutputDevice: voiceOutputDevice,
			voiceOutputVolume: voiceOutputVolume,
		}

		const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
		FileSaver.saveAs(blob, "settings.json");
	}

	const importSettings = (settings: Settings): void => {
		settings.encryptionKeys.forEach(([roomGuid, key]) => {
			setEncryptionKey(roomGuid, key);
		});

		setIsJoinLeaveSoundDisabled(settings.isJoinLeaveSoundDisabled);
		setIsPingSoundDisabled(settings.isPingSoundDisabled);
		setJoinLeaveVolume(settings.joinLeaveVolume);
		setPingVolume(settings.pingVolume);
		setVoiceInputDevice(settings.voiceInputDevice);
		setVoiceInputVolume(settings.voiceInputVolume);
		setVoiceOutputDevice(settings.voiceOutputDevice);
		setVoiceOutputVolume(settings.voiceOutputVolume);
	}
	
	return { exportSettings, importSettings };
}