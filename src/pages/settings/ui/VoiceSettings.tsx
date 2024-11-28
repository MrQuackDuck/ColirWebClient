import { VoiceSettingsContext } from '@/shared/lib/providers/VoiceSettingsProvider';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Separator } from '@/shared/ui/Separator';
import { Slider } from '@/shared/ui/Slider';
import { useEffect, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

function VoiceSettings() {
  const [inputDevices, setInputDevices] = useState<string[]>([]);
  const [outputDevices, setOutputDevices] = useState<string[]>([]);

  const {
    voiceInputDevice,
    setVoiceInputDevice,
    voiceInputVolume,
    setVoiceInputVolume,
    voiceOutputDevice,
    setVoiceOutputDevice,
    voiceOutputVolume,
    setVoiceOutputVolume
  } = useContextSelector(VoiceSettingsContext, c => c);

  async function getDevices() {
    try {
      // First get permission to access media devices
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // Set input and output devices
      setInputDevices(devices
        .filter(device => device.kind === 'audioinput')
        .map(device => device.label)
      );
      
      setOutputDevices(devices
        .filter(device => device.kind === 'audiooutput')
        .map(device => device.label)
      );
      
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }

  useEffect(() => {
    getDevices();

    // Listen for device changes
    const handleDeviceChange = () => {
      getDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    // Cleanup function
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">Voice Settings</span>
      <Separator />
      <div className="flex flex-row gap-4 max-w-[48rem]">
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Voice Input device</span>
            <Select onValueChange={setVoiceInputDevice} defaultValue={voiceInputDevice} disabled={outputDevices.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>The input device</SelectLabel>
                  {inputDevices.filter(device => device.length > 0).map(device => (
                    <SelectItem key={device} value={device}>{device}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <span className="text-slate-500 text-sm">Select the device that will serve as microphone</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Input Volume</span>
            <Slider step={0.1} className="cursor-pointer" value={[voiceInputVolume]} onValueChange={v => setVoiceInputVolume(v[0])} />
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Voice Output device</span>
            <Select onValueChange={setVoiceOutputDevice} defaultValue={voiceOutputDevice} disabled={outputDevices.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>The output device</SelectLabel>
                  {outputDevices.filter(device => device.length > 0).map(device => (
                    <SelectItem key={device} value={device}>{device}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <span className="text-slate-500 text-sm">Select the device that will serve as output</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Output (headphones/speakers) volume</span>
            <Slider step={0.1} className="cursor-pointer" value={[voiceOutputVolume]} onValueChange={v => setVoiceOutputVolume(v[0])} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceSettings;