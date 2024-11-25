import { useEffect, useState } from "react";
import { createContext } from "use-context-selector";

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
	const [pingVolume, setPingVolume] = useState<number>(50);
	const [isPingSoundDisabled, setIsPingSoundDisabled] = useState<boolean>(false);

	const [joinLeaveVolume, setJoinLeaveVolume] = useState<number>(50);
	const [isJoinLeaveSoundDisabled, setDisableJoinLeaveSound] = useState<boolean>(false);

	function saveAllToLocalStorage() {
		localStorage.setItem("pingVolume", pingVolume.toString());
		localStorage.setItem("isPingSoundDisabled", isPingSoundDisabled.toString());
		localStorage.setItem("joinLeaveVolume", joinLeaveVolume.toString());
		localStorage.setItem("isJoinLeaveSoundDisabled", isJoinLeaveSoundDisabled.toString());
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