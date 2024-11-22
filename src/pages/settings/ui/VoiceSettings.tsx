import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Separator } from '@/shared/ui/Separator'
import { Slider } from '@/shared/ui/Slider';

function VoiceSettings() {
  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">Voice Settings</span>
      <Separator />
      <div className="flex flex-row gap-4 max-w-[48rem]">
        <div className='w-full flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <span className='text-sm font-medium'>Voice Input device</span>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>The input device</SelectLabel>
                  <SelectItem value='realtek'>Microphone (Realtek(R) Audio)</SelectItem>
                  <SelectItem value='cableoutput'>CABLE Output (VB-Audio Virtual Cable)</SelectItem>
                  <SelectItem value='womic'>Microphone (WO Mic Device)</SelectItem>
                  <SelectItem value='noinput'>No input</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <span className='text-slate-500 text-sm'>Select the device that will serve as microphone</span>
          </div>
          <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium'>Voice Input device</span>
            <Slider className='cursor-pointer'/>
          </div>
        </div>

        <div className='w-full flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <span className='text-sm font-medium'>Voice Output device</span>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>The input device</SelectLabel>
                  <SelectItem value='realtek'>Microphone (Realtek(R) Audio)</SelectItem>
                  <SelectItem value='cableoutput'>CABLE Output (VB-Audio Virtual Cable)</SelectItem>
                  <SelectItem value='womic'>Microphone (WO Mic Device)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <span className='text-slate-500 text-sm'>Select the device that will serve as output</span>
          </div>
          <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium'>Output (headphones/speakers) volume</span>
            <Slider className='cursor-pointer'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceSettings