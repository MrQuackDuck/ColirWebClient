"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { SmileIcon, SmilePlusIcon } from "lucide-react";
import Picker from "@emoji-mart/react";
import { useTheme } from "../lib/providers/ThemeProvider";
import data from '@emoji-mart/data'
import { cn } from "../lib/utils";
import { Button } from "./Button";

interface EmojiPickerProps {
  onChange: (value: string) => void;
  asButton?: boolean;
  className?: string;
  disabled?: boolean;
}

export const EmojiPicker = ({ onChange, className, asButton, disabled = false }: EmojiPickerProps) => {
	let theme = useTheme();

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
        <Picker
          style={{ "backgroundColor": "#FFFFFF !important" }}
          emojiSize={24}
          theme={theme.theme}
          data={data}
          noCountryFlags={false}
          maxFrequentRows={1}
					perLine={8}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
