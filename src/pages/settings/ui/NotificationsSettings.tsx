import { useContextSelector } from "use-context-selector";

import { NotificationsSettingsContext, useTranslation } from "@/shared/lib";
import { Checkbox, Separator, Slider } from "@/shared/ui";

function NotificationsSettings() {
  const t = useTranslation();
  const { pingVolume, isPingSoundDisabled, setPingVolume, setIsPingSoundDisabled, joinLeaveVolume, isJoinLeaveSoundDisabled, setJoinLeaveVolume, setIsJoinLeaveSoundDisabled } = useContextSelector(
    NotificationsSettingsContext,
    (c) => c
  );

  function handlePingCheckboxChange() {
    setIsPingSoundDisabled(!isPingSoundDisabled);
  }

  function handleJoinLeaveCheckboxChange() {
    setIsJoinLeaveSoundDisabled(!isJoinLeaveSoundDisabled);
  }

  return (
    <div className="flex flex-col gap-3.5 max-w-[48rem]">
      <span className="text-3xl font-semibold">{t("NOTIFICATIONS_AND_SOUNDS")}</span>
      <Separator />
      <div className="flex flex-row gap-3.5">
        <div className="w-full flex flex-col gap-2">
          <span className="text-sm font-medium">{t("PING_VOLUME")}</span>
          <Slider disabled={isPingSoundDisabled} onValueChange={(v) => setPingVolume(v[0])} value={[pingVolume]} className="cursor-pointer" />
          <div className="flex flex-row items-center gap-1.5 pt-2">
            <Checkbox onCheckedChange={handlePingCheckboxChange} checked={isPingSoundDisabled} id="disablePingSound" />
            <label htmlFor="disablePingSound" className="select-none cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t("DISABLE_PING_SOUND")}
            </label>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <span className="text-sm font-medium">{t("JOIN_LEAVE_VOLUME")}</span>
          <Slider disabled={isJoinLeaveSoundDisabled} onValueChange={(v) => setJoinLeaveVolume(v[0])} value={[joinLeaveVolume]} className="cursor-pointer" />
          <div className="flex flex-row items-center gap-1.5 pt-2">
            <Checkbox onCheckedChange={handleJoinLeaveCheckboxChange} checked={isJoinLeaveSoundDisabled} id="disableJoinLeaveSound" />
            <label htmlFor="disableJoinLeaveSound" className="select-none cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t("DISABLE_JOIN_LEAVE_SOUND")}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsSettings;
