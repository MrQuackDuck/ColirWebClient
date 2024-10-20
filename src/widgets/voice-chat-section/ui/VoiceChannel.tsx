import { Button } from '@/shared/ui/Button'
import { Collapsible, CollapsibleContent } from '@/shared/ui/Collapsible';
import { ChevronDownIcon, ChevronUpIcon, Volume2Icon } from 'lucide-react'
import { useState } from 'react';

function VoiceChannel() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  function toggleCollapse() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className='flex flex-col'>
      <div className="flex items-center">
        <div className="flex-grow flex items-center select-none gap-1.5 min-w-0">
          <Volume2Icon className="w-5 h-5 flex-shrink-0 text-slate-400"/>
          <span className='text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap'>
            Voice channel
          </span>
        </div>
        <Button
          onClick={toggleCollapse}
          className="w-6 h-6 flex-shrink-0 ml-2"
          variant="ghost"
          size="icon">
          {isCollapsed ? <ChevronUpIcon className="w-4 h-4 text-slate-400"/> : <ChevronDownIcon className="w-4 h-4 text-slate-400"/>}
        </Button>
      </div>
      <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleContent>
          <div className='text-sm'>User</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default VoiceChannel