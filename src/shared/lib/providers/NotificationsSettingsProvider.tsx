import { useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const NotificationsSettingsContext = createContext<{
	pingVolume: number;
	isPingSoundDisabled: boolean;
	setPingVolume: (volume: number) => void;
	setIsPingSoundDisabled: (isDisabled: boolean) => void;

	joinLeaveVolume: number;
	isJoinLeaveSoundDisabled: boolean;
	setJoinLeaveVolume: (volume: number) => void;
	setIsJoinLeaveSoundDisabled: (isDisabled: boolean) => void;
}>({
	pingVolume: 50,
	isPingSoundDisabled: false,
	setPingVolume: () => {},
	setIsPingSoundDisabled: () => {},

	joinLeaveVolume: 50,
	isJoinLeaveSoundDisabled: false,
	setJoinLeaveVolume: () => {},
	setIsJoinLeaveSoundDisabled: () => {},
});

const NotificationsSettingsProvider = ({ children }) => {
	let { getFromLocalStorage, setToLocalStorage } = useLocalStorage();
	const [pingVolume, setPingVolume] = useState<number>(getFromLocalStorage("pingVolume") ?? 50);
	const [isPingSoundDisabled, setIsPingSoundDisabled] = useState<boolean>(getFromLocalStorage("isPingSoundDisabled") ?? false);

	const [joinLeaveVolume, setJoinLeaveVolume] = useState<number>(getFromLocalStorage("joinLeaveVolume") ?? 50);
	const [isJoinLeaveSoundDisabled, setDisableJoinLeaveSound] = useState<boolean>(getFromLocalStorage("isJoinLeaveSoundDisabled") ?? false);

	function saveAllToLocalStorage() {
		setToLocalStorage("pingVolume", pingVolume);
		setToLocalStorage("isPingSoundDisabled", isPingSoundDisabled);
		setToLocalStorage("joinLeaveVolume", joinLeaveVolume);
		setToLocalStorage("isJoinLeaveSoundDisabled", isJoinLeaveSoundDisabled);
	}

	useEffect(() => {
		saveAllToLocalStorage();
	}, [pingVolume, isPingSoundDisabled, joinLeaveVolume, isJoinLeaveSoundDisabled]);

	return (
		<NotificationsSettingsContext.Provider
			value={{
				pingVolume,
				isPingSoundDisabled,
				setPingVolume,
				setIsPingSoundDisabled,

				joinLeaveVolume,
				isJoinLeaveSoundDisabled,
				setJoinLeaveVolume,
				setIsJoinLeaveSoundDisabled: setDisableJoinLeaveSound,
			}}
		>
			{children}
		</NotificationsSettingsContext.Provider>
	);
};

export default NotificationsSettingsProvider;