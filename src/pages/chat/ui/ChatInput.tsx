import { AutosizeTextarea } from '@/shared/ui/AutosizeTextarea';
import { Separator } from '@/shared/ui/Separator'
import { PaperclipIcon, SendIcon, SmilePlusIcon } from 'lucide-react'
import { useRef } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/Popover'
import EmojiPicker, { Theme } from 'emoji-picker-react';

export interface MessageToSend {
  content: string,
  attachments: []
}

function ChatInput({onSend}: {onSend: (message: MessageToSend) => any}) {
  let editableDiv = useRef<any>();

  function sendMessage() {
    onSend({ content: editableDiv.current.textArea.value, attachments: [] });
    editableDiv.current.innerHTML = "";
    editableDiv.current.innerHTML.style.height = "42px";
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key == "Enter" && !event.shiftKey) {
      event.preventDefault();
      let element = event.target as HTMLDivElement;

      if (element.innerHTML.length < 0) return;

      sendMessage();
    }
  }

  function getEmojiPicker() {
    return (<>
      <Popover>
        <PopoverTrigger asChild>
          <SmilePlusIcon strokeWidth={1.5} className="z-10 cursor-pointer stroke-slate-400/80 hover:stroke-slate-400/100 top-[14px] h-6 w-6 -translate-y-1/2 transform"/>
        </PopoverTrigger>
        <PopoverContent asChild>
          <EmojiPicker theme={Theme.DARK} onEmojiClick={e => editableDiv.current.textArea.value += e.emoji}/>
        </PopoverContent>
      </Popover>
    </>)
  }

  return (<>
    <div className="relative flex items-center">
      {/* <ReplySection/> */}

      <PaperclipIcon strokeWidth={1.5} className="cursor-pointer absolute z-10 stroke-slate-400/80 hover:stroke-slate-400/100 left-2 top-[20px] h-5 w-5 -translate-y-1/2 transform"/>
      <div className="flex items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 h-11 pl-8 pr-20 resize-none ring-offset-0">
        <div className='w-full' ref={editableDiv} contentEditable={true} onKeyDown={e => handleKeyUp(e)}></div>
      </div>
      <div className='absolute h-[100%] py-2 right-3 flex flex-row gap-2.5'>
        {getEmojiPicker()}
        <Separator orientation='vertical' />
        <SendIcon onClick={() => sendMessage()} strokeWidth={1.5} className="z-10 cursor-pointer stroke-slate-400/80 hover:stroke-slate-400/100 top-[14px] h-6 w-6 -translate-y-1/2 transform"/>
      </div>
    </div>
  </>)
}

export default ChatInput