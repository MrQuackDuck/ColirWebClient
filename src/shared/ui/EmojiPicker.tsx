import { useState, useMemo, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { SmileIcon, SmilePlusIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./Button";
import './EmojiPicker.css'
import { ScrollArea } from "./ScrollArea";
import emojiData from '../lib/emojis.json';
import { Separator } from "./Separator";
import { Input } from "./Input";

interface EmojiPickerProps {
  onChange: (value: string) => void;
  asButton?: boolean;
  className?: string;
  disabled?: boolean;
}

export const EmojiPicker = ({ onChange, className, asButton, disabled = false }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchString, setSearchString] = useState('');

  const filteredEmojiData = useMemo(() => {
    const lowercaseSearch = searchString.toLowerCase();
    return Object.fromEntries(
      Object.entries(emojiData).map(([category, emojis]) => [
        category,
        emojis.filter(emoji => emoji.name.toLowerCase().includes(lowercaseSearch))
      ])
    );
  }, [searchString]);

  function getButtonTrigger() {
    return (
      <Button disabled={disabled} className="w-8 h-8" variant="outline" size="icon">
        <SmilePlusIcon className="text-primary/80 h-4 w-4" />
      </Button>
    );
  }

  function getDefaultTrigger() {
    return (
      <SmileIcon className="h-6 w-6 stroke-slate-400/80 hover:stroke-slate-400/100 text-muted-foreground hover:text-foreground transition" />
    );
  }

  function handleClick(e, emoji) {
    if (e && (e.which == 2 || e.button == 4 )) {
      return;
    }

    onChange(emoji.value);
  }

  useEffect(() => {
    if (!isOpen) setSearchString('');
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild className={cn(className)}>
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
            <ScrollArea className="h-[400px] text-[22px] mt-1 p-2">
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
                            className="p-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[1.2rem]"
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