import { AutosizeTextarea } from "@/shared/ui/AutosizeTextarea";
import { Separator } from "@/shared/ui/Separator";
import { PaperclipIcon, SendIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import React from "react";
import { EmojiPicker } from "@/shared/ui/EmojiPicker";
import { cn } from "@/shared/lib/utils";
import { MessageModel } from "@/entities/Message/model/MessageModel";
import ReplySection from "./ReplySection";
import { UserModel } from "@/entities/User/model/UserModel";

export interface MessageToSend {
  content: string;
  attachments: [];
  replyMessageId?: number;
}

function ChatInput({
  onSend,
  messageToReply,
  messageToReplyAuthor,
  className,
  onReplyCancelled,
}: {
  onSend: (message: MessageToSend) => any;
  messageToReply: MessageModel | null;
  messageToReplyAuthor: UserModel | null;
  className?: string;
  onReplyCancelled: () => any;
}) {
  let textArea = useRef<any>();

  useEffect(() => {
    // Adding this event listener to focus the textarea when the user clicks outside of it
    textArea.current.textArea.focus();
    document.addEventListener("keydown", e => {
      if (e.ctrlKey || e.altKey) return;
      if (document.activeElement?.tagName === "TEXTAREA" || document.activeElement?.tagName === "INPUT") return;
      if (textArea.current) textArea.current.textArea.focus();
    });
  }, []);

  function sendMessage() {
    onSend({ content: textArea.current.textArea.value, attachments: [], replyMessageId: messageToReply?.id });
    textArea.current.textArea.value = "";
    textArea.current.textArea.style.height = "43x";
  }

  function insertAt(index: number, str: string) {
    let value = textArea.current.textArea.value;
    textArea.current.textArea.value =
      value.substr(0, index) + str + value.substr(index);
    setCursorPosition(index + str.length);
  }

  // Move to file
  function getCursorPosition() {
    return textArea.current.textArea.selectionStart;
  }

  // Move to file
  function setCursorPosition(index: number) {
    textArea.current.textArea.selectionEnd = index;
  }

  // Move to file
  function getSelectedText() {
    let start = textArea.current.textArea.selectionStart;
    let end = textArea.current.textArea.selectionEnd;
    return textArea.current.textArea.value.substring(start, end);
  }

  function replaceAfter(string, search, replace, index) {
    if (string.length > index) {
      return (
        string.slice(0, index) + string.slice(index).replace(search, replace)
      );
    }

    return string;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.keyCode == 27) {
      onReplyCancelled();
    }

    if (event.keyCode == 66 && event.ctrlKey) {
      event.preventDefault();
      let selection = getSelectedText();
      if (!selection) return;
      textArea.current.textArea.value = replaceAfter(
        textArea.current.textArea.value,
        selection,
        `**${selection}**`,
        textArea.current.textArea.selectionStart
      );
    }

    if (event.key == "Enter" && !event.shiftKey) {
      event.preventDefault();
      let element = event.target as HTMLTextAreaElement;

      if (element.value.length < 0) return;

      sendMessage();
    }
  }

  useEffect(() => {
    setTimeout(() => textArea.current.textArea.focus(), 10);
  }, [messageToReply]);

  return (
    <>
      <div className={cn("flex absolute bottom-0 items-center", className)}>
        {messageToReply && <ReplySection onReplyCancelled={onReplyCancelled} message={messageToReply} sender={messageToReplyAuthor!} />}

        <PaperclipIcon
          strokeWidth={1.5}
          className="cursor-pointer absolute z-10 stroke-slate-400/80 hover:stroke-slate-400/100 left-2 top-[20px] h-5 w-5 -translate-y-1/2 transform"
        />
        <AutosizeTextarea
          autoFocus
          ref={textArea}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          className="flex items-center w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 h-11 pl-8 pr-20 resize-none
        ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
        <div className="absolute h-[100%] py-2 right-3 flex flex-row gap-2.5">
          <EmojiPicker
            onChange={(emoji) => insertAt(getCursorPosition(), emoji)}
            key={1}
            className="z-10 cursor-pointer stroke-slate-400/80 hover:stroke-slate-400/100 top-[14px] h-6 w-6 -translate-y-1/2 transform"
          />
          <Separator orientation="vertical" />
          <SendIcon
            onClick={() => sendMessage()}
            strokeWidth={1.5}
            className="z-10 cursor-pointer stroke-slate-400/80 hover:stroke-slate-400/100 top-[14px] h-6 w-6 -translate-y-1/2 transform"
          />
        </div>
      </div>
    </>
  );
}

export default ChatInput;
