import { useEffect, useState } from "react";
import { createContext } from "use-context-selector";

import { useLocalStorage } from "../hooks/useLocalStorage";

type TimeFormat = "12-hour" | "24-hour";

export const TimeFormatSettingsContext = createContext<{
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
}>({
  timeFormat: "12-hour",
  setTimeFormat: () => {}
});

export const TimeFormatSettingsProvider = ({ children }) => {
  const { getFromLocalStorage, setToLocalStorage } = useLocalStorage();
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(getFromLocalStorage("timeFormat") ?? "12-hour");

  function saveAllToLocalStorage() {
    setToLocalStorage("timeFormat", timeFormat);
  }

  useEffect(() => {
    saveAllToLocalStorage();
  }, [timeFormat]);

  return (
    <TimeFormatSettingsContext.Provider
      value={{
        timeFormat: timeFormat,
        setTimeFormat: setTimeFormat
      }}
    >
      {children}
    </TimeFormatSettingsContext.Provider>
  );
};
