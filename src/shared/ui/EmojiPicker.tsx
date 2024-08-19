"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/Popover";
import { SmileIcon } from "lucide-react";
import Picker from "@emoji-mart/react";
import { useTheme } from "../lib/providers/ThemeProvider";
import data from '@emoji-mart/data/sets/15/all.json';

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
	let theme = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="h-6 w-6 stroke-slate-400/80 hover:stroke-slate-400/100 text-muted-foreground hover:text-foreground transition" />
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Picker
          emojiSize={24}
          theme={theme.theme}
          data={data}
          maxFrequentRows={1}
					perLine={8}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
