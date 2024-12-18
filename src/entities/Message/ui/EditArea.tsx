import "moment/min/locales";

import { CheckIcon, PencilOffIcon } from "lucide-react";
import React from "react";

import { useTranslation } from "@/shared/lib";
import { AutosizeTextarea, Button, EmojiPicker } from "@/shared/ui";

interface EditAreaProps {
  textAreaRef: React.MutableRefObject<any>;
  handleEditInputKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  setEditedContent: React.Dispatch<React.SetStateAction<string>>;
  editedContent: string;
  onEditModeDisabled: () => void;
  onFinishedEditing: () => void;
}

function EditArea({ textAreaRef, handleEditInputKeyDown, setEditedContent, editedContent, onEditModeDisabled, onFinishedEditing }: EditAreaProps) {
  const t = useTranslation();

  function handleEmojiPicked(emoji: string) {
    setEditedContent((prev) => prev + emoji);
  }

  return (
    <div className="flex flex-row gap-1">
      <AutosizeTextarea
        ref={textAreaRef}
        onKeyDown={handleEditInputKeyDown}
        onChange={(e) => setEditedContent(e.target.value)}
        value={editedContent}
        autoFocus
        placeholder={t("EDIT_MESSAGE")}
        className="flex items-center w-full rounded-md border border-input bg-background py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 h-11 resize-none
          ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button onClick={onEditModeDisabled} className="shrink-0 w-9 h-10" variant={"outline"} size={"icon"}>
        <PencilOffIcon className="text-primary/80 h-4 w-4" />
      </Button>
      <EmojiPicker className="shrink-0 w-9 h-10" asButton onChange={handleEmojiPicked} />
      <Button onClick={onFinishedEditing} className="shrink-0 w-9 h-10" variant={"outline"} size={"icon"}>
        <CheckIcon className="text-primary/80 h-4 w-4" />
      </Button>
    </div>
  );
}

export default EditArea;
