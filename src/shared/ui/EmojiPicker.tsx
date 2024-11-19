import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover';
import { SmileIcon, SmilePlusIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './Button';
import './EmojiPicker.css';
import { ScrollArea } from './ScrollArea';
import emojiData from '../lib/emojis.json';
import { Separator } from './Separator';
import { Input } from './Input';

interface Emoji {
  name: string;
  value: string;
}

interface EmojiPickerProps {
  onChange: (value: string) => void;
  asButton?: boolean;
  className?: string;
  disabled?: boolean;
}

export const EmojiPicker = ({ onChange, className, asButton, disabled = false }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchString, setSearchString] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const filteredEmojiData = useMemo(() => {
    const lowercaseSearch = searchString.toLowerCase();
    return Object.fromEntries(
      Object.entries(emojiData).map(([category, emojis]) => [
        category,
        emojis.filter(emoji => emoji.name.toLowerCase().includes(lowercaseSearch))
      ])
    );
  }, [searchString]);

  useEffect(() => {
    if (isOpen) {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  function getButtonTrigger() {
    return (
      <Button disabled={disabled} className="w-8 h-8" variant="outline" size="icon">
        <SmilePlusIcon className="text-primary/80 h-4 w-4" />
      </Button>
    );
  }

  function getDefaultTrigger() {
    return (
      <SmileIcon className="h-6 w-6 stroke-slate-400/80 hover:stroke-slate-400/100 text-muted-foreground hover:text-foreground transition
        rounded-sm overflow-visible focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1" />
    );
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>, emoji: Emoji) {
    if (e.button === 1) {
      return; // Middle click, do nothing
    }
    onChange(emoji.value);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger tabIndex={0} asChild className={cn(className)} onKeyUp={(e) => e.keyCode == 32 && setIsOpen(!isOpen)}>
        {asButton ? getButtonTrigger() : getDefaultTrigger()}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] overflow-hidden p-2">
        {isOpen && (
          <>
            <Input
              className="w-full"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              placeholder="Find emoji"
            />
            <ScrollArea ref={scrollAreaRef} className="h-[400px] text-[22px] mt-1 p-2">
              <div className="flex flex-col h-full gap-1">
                {Object.entries(filteredEmojiData).map(([category, emojis]) => (
                  emojis.length > 0 && (
                    <div key={category}>
                      <span className="capitalize text-base">{category}</span>
                      <Separator className="mt-0.5" />
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {emojis.map((emoji) => (
                          <Button
                            key={emoji.name}
                            onClick={(e) => handleClick(e, emoji)}
                            variant="ghost"
                            size="icon"
                            className="p-0 rounded-sm overflow-visible focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-[1.2rem]"
                          >
                            {emoji.value}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};