"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { SmileIcon, SmilePlusIcon } from "lucide-react";
import EmojiPickerReact, { EmojiStyle, Theme } from 'emoji-picker-react';
import { useTheme } from "../lib/providers/ThemeProvider";
import { cn } from "../lib/utils";
import { Button } from "./Button";
import './EmojiPicker.css'

interface EmojiPickerProps {
  onChange: (value: string) => void;
  asButton?: boolean;
  className?: string;
  disabled?: boolean;
}

export const EmojiPicker = ({ onChange, className, asButton, disabled = false }: EmojiPickerProps) => {
	let { theme } = useTheme();

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
      <PopoverContent className="w-full">
        <EmojiPickerReact
          previewConfig={{ showPreview: false }}
          height={400}
          emojiVersion={"3.0"}
          skinTonesDisabled={true}
          hiddenEmojis={["1FAE0"]}
          theme={theme == "dark" ? Theme.DARK : Theme.LIGHT}
          emojiStyle={EmojiStyle.NATIVE}
          onEmojiClick={(emoji) => onChange(emoji.emoji.toString())}
        />
      </PopoverContent>
    </Popover>
  );
};
