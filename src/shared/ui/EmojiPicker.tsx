"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { SmileIcon, SmilePlusIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./Button";
import './EmojiPicker.css'
import { ScrollArea } from "./ScrollArea";
import emojiData from '../lib/emojis.json';

interface EmojiPickerProps {
  onChange: (value: string) => void;
  asButton?: boolean;
  className?: string;
  disabled?: boolean;
}

export const EmojiPicker = ({ onChange, className, asButton, disabled = false }: EmojiPickerProps) => {
  function getTrigger() {
    if (asButton) {
      return (
        <Button disabled={disabled} className="w-8 h-8" variant={"outline"} size={"icon"}>
          <SmilePlusIcon className="text-primary/80 h-4 w-4" />
        </Button>
      );
    } else {
      return (
        <SmileIcon className="h-6 w-6 stroke-slate-400/80 hover:stroke-slate-400/100 text-muted-foreground hover:text-foreground transition" />
      );
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild className={cn(className)}>
        {getTrigger()}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] max-h-[400px] overflow-hidden p-4">
        <ScrollArea className="h-[400px] text-[22px]">
          <div className="flex flex-col gap-1">
          {Object.keys(emojiData).map((category) => (
            <div>
              <h3>{category}</h3>
              <div className="flex flex-wrap gap-1">
                {emojiData[category as keyof typeof emojiData].map((emoji, index) => (
                  <Button key={index} onClick={() => onChange(emoji)} variant={"ghost"} size={"icon"} className="p-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[1.2rem]">{emoji}</Button>
                ))}
              </div>
            </div>
          ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};