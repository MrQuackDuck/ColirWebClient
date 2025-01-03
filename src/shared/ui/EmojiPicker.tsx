import "./EmojiPicker.css";

import { SmileIcon, SmilePlusIcon } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";

import emojiData from "../lib/emojis.json";
import { useTranslation } from "../lib/hooks/useTranslation";
import { cn } from "../lib/utils";
import { Button } from "./Button";
import { Input } from "./Input";
import { ScrollArea } from "./ScrollArea";
import { Separator } from "./Separator";

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
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const filteredEmojiData = useMemo(() => {
    const lowercaseSearch = searchString.toLowerCase();
    return Object.fromEntries(Object.entries(emojiData).map(([category, emojis]) => [category, emojis.filter((emoji) => emoji.name.toLowerCase().includes(lowercaseSearch))]));
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
      <Button disabled={disabled} className={cn("w-8 h-8", className)} variant="outline" size="icon">
        <SmilePlusIcon className="text-primary/80 h-4 w-4" />
      </Button>
    );
  }

  function getDefaultTrigger() {
    return (
      <SmileIcon
        className={cn(
          `h-6 w-6 stroke-slate-400/80 hover:stroke-slate-400/100 text-muted-foreground hover:text-foreground transition
        rounded-full overflow-visible focus:outline-none focus-visible:ring-2 focus:ring-ring`,
          disabled && "cursor-not-allowed text-primary/50 pointer-events-none"
        )}
      />
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
      <PopoverContent sticky="partial" className="w-[305px] overflow-hidden p-2">
        <Input className="w-full" value={searchString} onChange={(e) => setSearchString(e.target.value)} placeholder={t("FIND_EMOJI")} />
        <ScrollArea ref={scrollAreaRef} className="h-[50vh] max-h-[calc(50vh)] text-[22px] mt-1 p-2">
          <div className="flex flex-col h-full gap-1">
            {Object.entries(filteredEmojiData).map(
              ([category, emojis]) =>
                emojis.length > 0 && (
                  <div className="px-1" key={category}>
                    <span className="capitalize text-base">{t(category)}</span>
                    <Separator className="mt-0.5" />
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {emojis.map((emoji) => (
                        <Button
                          key={emoji.name}
                          onClick={(e) => handleClick(e, emoji)}
                          variant="ghost"
                          size="icon"
                          className="p-0 rounded-sm overflow-visible focus:outline-none focus-visible:ring-2 focus:ring-ring text-[1.2rem]"
                          title={emoji.name}
                        >
                          {emoji.value}
                        </Button>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
