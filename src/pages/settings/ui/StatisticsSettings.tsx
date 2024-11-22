import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Separator } from '@/shared/ui/Separator'
import { SaveAllIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatisticsSettings() {
  return (
    <div className="flex flex-col gap-3.5">
      <span className="text-3xl font-semibold">Statistics</span>
      <Separator />
      <div className="flex flex-col gap-3.5 max-w-[48rem]">
        <div className='flex flex-row items-center gap-1.5 pt-2'>
          <Checkbox id="disableStats"/>
          <label htmlFor="disableStats" className="select-none cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Disable stats
          </label>
        </div>
        <Link className="text-sm underline" to={"/"}>How stats works?</Link>
        <div className='flex flex-row gap-2.5'>
          <Button type="submit"><SaveAllIcon className="mr-2 h-4 w-4"/> Save</Button>
          <Button type="button" variant={"outline"}>Reset</Button>
        </div>
      </div>
    </div>
  )
}

export default StatisticsSettings