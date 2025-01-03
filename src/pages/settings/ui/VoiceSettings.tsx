import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";

import { useTranslation, VoiceSettingsContext } from "@/shared/lib";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Separator, Slider } from "@/shared/ui";

interface InputOutputDevice {
  id: string;
  label: string;
}

function VoiceSettings() {
  const t = useTranslation();
  const [inputDevices, setInputDevices] = useState<InputOutputDevice[]>([]);
  const [outputDevices, setOutputDevices] = useState<InputOutputDevice[]>([]);

  const { voiceInputDevice, setVoiceInputDevice, voiceInputVolume, setVoiceInputVolume, voiceOutputDevice, setVoiceOutputDevice, voiceOutputVolume, setVoiceOutputVolume } = useContextSelector(
    VoiceSettingsContext,
    (c) => c
  );

  async function getDevices() {
    try {
      // First get permission to access media devices
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();

      // Set input and output devices
      setInputDevices(
        devices
          .filter((device) => device.kind === "audioinput")
          .map((device) => {
            return { id: device.deviceId, label: device.label };
          })
      );

      setOutputDevices(
        devices
          .filter((device) => device.kind === "audiooutput")
          .map((device) => {
            return { id: device.deviceId, label: device.label };
          })
      );

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }

  useEffect(() => {
    getDevices();

    // Listen for device changes
    const handleDeviceChange = () => {
      getDevices();
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    // Cleanup function
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">{t("VOICE_SETTINGS")}</span>
      <Separator />
      <div className="flex flex-row gap-4 max-w-[48rem]">
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">{t("VOICE_INPUT_DEVICE")}</span>
            <Select onValueChange={setVoiceInputDevice} defaultValue={voiceInputDevice} disabled={outputDevices.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder={t("DEFAULT")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("INPUT_DEVICE")}</SelectLabel>
                  {inputDevices
                    .filter((device) => device.id.length > 0)
                    .map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.label}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <span className="text-slate-500 text-sm">{t("SELECT_MICROPHONE_DEVICE")}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("INPUT_VOLUME")}</span>
            <Slider disabled={true} step={0.1} className="cursor-pointer" value={[voiceInputVolume]} onValueChange={(v) => setVoiceInputVolume(v[0])} />
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">{t("VOICE_OUTPUT_DEVICE")}</span>
            <Select onValueChange={setVoiceOutputDevice} defaultValue={voiceOutputDevice} disabled={outputDevices.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("OUTPUT_DEVICE")}</SelectLabel>
                  {outputDevices
                    .filter((device) => device.id.length > 0)
                    .map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.label}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <span className="text-slate-500 text-sm">{t("SELECT_OUTPUT_DEVICE")}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("OUTPUT_VOLUME")}</span>
            <Slider step={0.1} className="cursor-pointer" value={[voiceOutputVolume]} onValueChange={(v) => setVoiceOutputVolume(v[0])} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceSettings;
