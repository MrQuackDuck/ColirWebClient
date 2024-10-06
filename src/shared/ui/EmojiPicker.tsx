"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { SmileIcon, SmilePlusIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./Button";
import './EmojiPicker.css'
import { ScrollArea } from "./ScrollArea";
import emojiData from '../lib/emojis.json';
import { Separator } from "./Separator";
import { useState } from "react";

interface EmojiPickerProps {
  onChange: (value: string) => void;
  asButton?: boolean;
  className?: string;
  disabled?: boolean;
}

export const EmojiPicker = ({ onChange, className, asButton, disabled = false }: EmojiPickerProps) => {
  let [isOpen, setIsOpen] = useState(false);

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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild className={cn(className)}>
        {getTrigger()}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] overflow-hidden p-4">
        <ScrollArea className="h-[400px] text-[22px]">
          <div className="flex flex-col h-full gap-1">
          {isOpen && Object.keys(emojiData).map((category) => (
            <div key={category}>
              <h4 className="capitalize">{category}</h4>
              <Separator className="mt-0.5"/>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {emojiData[category as keyof typeof emojiData].map((emoji) => (
                  <Button key={emoji} onMouseUp={() => onChange(emoji)} variant={"ghost"} size={"icon"} className="p-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[1.2rem]">{emoji}</Button>
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