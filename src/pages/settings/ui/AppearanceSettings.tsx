import { useContextSelector } from "use-context-selector";

import { useFormatDate, useTheme, useTranslation } from "@/shared/lib";
import { TimeFormatSettingsContext } from "@/shared/lib/providers/TimeFormatProvider";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Separator } from "@/shared/ui";

function AppearanceSettings() {
  const t = useTranslation();
  const { theme, setTheme } = useTheme();
  const { timeFormat, setTimeFormat } = useContextSelector(TimeFormatSettingsContext, (c) => c);
  const { formatFullDate } = useFormatDate();
  const exampleTime: Date = new Date(2025, 11, 19, 13, 27);

  function handleThemeChange(value: string) {
    if (value == "dark" || value == "light") setTheme(value);
  }
  
  function handleTimeFormatChange(value: string) {
    if (value == "12-hour" || value == "24-hour") setTimeFormat(value);
  }

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">{t("APPEARANCE")}</span>
      <Separator />
      <div className="flex flex-row gap-4 max-w-[48rem]">
        <div className="w-full flex flex-col gap-1.5">
          <span className="text-sm font-medium">{t("THEME")}</span>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("DEFAULT")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("THEME")}</SelectLabel>
                <SelectItem value="light">{t("LIGHT")}</SelectItem>
                <SelectItem value="dark">{t("DARK")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex flex-col gap-1.5">
          <span className="text-sm font-medium">{t("TIME_FORMAT")}</span>
          <Select value={timeFormat} onValueChange={handleTimeFormatChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("DEFAULT")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("TIME_FORMAT")}</SelectLabel>
                <SelectItem value="12-hour">{t("12_HOUR")}</SelectItem>
                <SelectItem value="24-hour">{t("24_HOUR")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <span className="text-slate-500 text-sm">
            <span className="font-semibold">{t("EXAMPLE")}</span>: {formatFullDate(exampleTime)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AppearanceSettings;
