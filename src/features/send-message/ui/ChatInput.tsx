import { AutosizeTextarea } from "@/shared/ui/AutosizeTextarea";
import { Separator } from "@/shared/ui/Separator";
import { Loader2, PaperclipIcon, PlugZapIcon, SendIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import React from "react";
import { EmojiPicker } from "@/shared/ui/EmojiPicker";
import { cn, encryptFile, encryptString } from "@/shared/lib/utils";
import { MessageModel } from "@/entities/Message/model/MessageModel";
import ReplySection from "./ReplySection";
import { UserModel } from "@/entities/User/model/UserModel";
import FileList from "./FileList";
import { useTranslation } from "@/shared/lib/hooks/useTranslation";

export type ChatInputVariant = "default" | "connecting" | "disconnected";

export interface ChatInputMessage {
  content: string;
  attachments: File[];
  replyMessageId: number | undefined;
}

interface ChatInputProps {
  onSend: (message: ChatInputMessage) => any;
  messageToReply: MessageModel | null;
  messageToReplyAuthor: UserModel | null;
  className?: string;
  encryptionKey: string;
  onReplyCancelled: () => any;
  onSizeChange: (height: number) => any;
  onReplySectionClicked: () => any;
  variant?: ChatInputVariant;
}

function ChatInput({ onSend, messageToReply, messageToReplyAuthor, className, encryptionKey, onReplyCancelled, onSizeChange, variant = "default", onReplySectionClicked }: ChatInputProps) {
  const t = useTranslation();
  let textAreaRef = useRef<any>();
  let fileInputRef = useRef<any>();
  let topAreaRef = useRef<any>();
  const documentRef = useRef(document);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.keyCode != 86) || e.altKey || e.keyCode == 16 || e.keyCode == 9 || e.keyCode == 32) return;
      let focusedItemTagName = document.activeElement?.tagName;
      if (focusedItemTagName === "TEXTAREA" || focusedItemTagName === "INPUT" || (focusedItemTagName === "VIDEO" && e.keyCode == 32)) return;
      if (!textAreaRef.current) return;
      if (e.key === "Enter") e.preventDefault();
      if (e.key == "Escape") onReplyCancelled();
      textAreaRef.current.textArea.focus();
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer?.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          let item = e.dataTransfer.items[i];
          if (item.kind === "file") {
            let file = item.getAsFile();
            if (file) {
              setFiles((prev) => [...prev, file]);
            }
          }
        }
      }
    };

    documentRef.current.addEventListener("keydown", handleKeyDown);
    documentRef.current.addEventListener("dragover", handleDragOver);
    documentRef.current.addEventListener("drop", handleDrop);

    // Cleanup function to prevent duplicate listeners
    return () => {
      documentRef.current.removeEventListener("keydown", handleKeyDown);
      documentRef.current.removeEventListener("dragover", handleDragOver);
      documentRef.current.removeEventListener("drop", handleDrop);
    };
  }, []);

  async function sendMessage() {
    if (textAreaRef.current.textArea.disabled) return;
    const encryptedFiles = files.length > 0 ? await Promise.all([...files].map((file) => encryptFile(file, encryptionKey))) : [];

    onSend({
      content: encryptString(textAreaRef.current.textArea.value, encryptionKey) ?? "",
      attachments: encryptedFiles,
      replyMessageId: messageToReply?.id
    });

    setFiles([]);
    textAreaRef.current.textArea.value = "";
    textAreaRef.current.textArea.style.height = "42px";
  }

  function insertAt(index: number, str: string) {
    if (textAreaRef.current.textArea.disabled) return;
    let value = textAreaRef.current.textArea.value;
    textAreaRef.current.textArea.value = value.substr(0, index) + str + value.substr(index);
    setCursorPosition(index + str.length);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key == "Escape") {
      onReplyCancelled();
    }

    if (event.key == "Enter" && !event.shiftKey) {
      event.preventDefault();
      let element = event.target as HTMLTextAreaElement;

      if (element.value?.length === 0 && files.length === 0) {
        event.preventDefault();
        return;
      }

      sendMessage();
    }
  }

  function getCursorPosition() {
    return textAreaRef.current.textArea.selectionStart;
  }

  function setCursorPosition(index: number) {
    textAreaRef.current.textArea.selectionEnd = index;
  }

  let [files, setFiles] = React.useState<File[]>([]);
  function fileSelected(e) {
    let files = e.target.files as FileList;
    if (files.length == 0) return;

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      setFiles((prev) => [...prev, file]);
    }
    onSizeChange(topAreaRef.current.clientHeight ?? 0);
  }

  function fileRemoved(file: File) {
    setFiles((prev) => prev.filter((f) => f !== file));
  }

  function handlePaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    const clipboardItems = event.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          setFiles((prev) => [...prev, blob]);
        }
      }
    }
  }

  useEffect(() => {
    onSizeChange(topAreaRef.current.clientHeight ?? 0);
  }, [files]);

  useEffect(() => {
    onSizeChange(topAreaRef.current.clientHeight ?? 0);
    setTimeout(() => textAreaRef.current.textArea.focus(), 10);
  }, [messageToReply]);

  return (
    <>
      <div className={cn("flex flex-col absolute bottom-0 items-center", className)}>
        {/* Top section (with reply and files) */}
        <div ref={topAreaRef} className="flex flex-col bg-accent/80 w-full items-center rounded-t-[6px] gap-0.5">
          <ReplySection
            onClicked={onReplySectionClicked}
            onReplyCancelled={onReplyCancelled}
            decryptionKey={encryptionKey}
            message={messageToReply}
            sender={messageToReplyAuthor!}
            className={messageToReply && variant == "default" ? "" : "hidden"}
          />

          {messageToReply && files.length > 0 && <Separator className="bg-secondary outline-none border-none" />}

          {files.length > 0 && <FileList className={cn(!messageToReply && "rounded-t-[6px]")} onFileRemoved={fileRemoved} files={files} />}
        </div>

        <div className={cn("flex items-center", className)}>
          {/* Background at top to match secions from above */}
          {(messageToReply || files.length > 0) && variant == "default" && <div className="absolute top-0 h-4 bg-accent/80 w-full"></div>}

          {variant === "default" && (
            <>
              <PaperclipIcon
                tabIndex={0}
                onClick={() => fileInputRef.current.click()}
                onKeyDown={(e) => e.keyCode == 32 && fileInputRef.current.click()}
                strokeWidth={1.5}
                className="cursor-pointer absolute z-10 stroke-slate-400/80 hover:stroke-slate-400 left-2 top-[20px] h-5 w-5 -translate-y-1/2 transform
								rounded-sm overflow-visible focus:outline-none focus-visible:ring-2 focus:ring-ring"
              />
              <input onChange={fileSelected} multiple={true} className="hidden" ref={fileInputRef} type="file" />
            </>
          )}
          {variant === "connecting" && <Loader2 className="absolute z-10 pointer-events-none stroke-slate-400/80 animate-spin m-auto left-2 h-5 w-5" />}
          {variant == "connecting" && <span className="z-10 absolute left pointer-events-none text-muted-foreground/90 text-sm pl-9">{t("CONNECTING")}</span>}
          {variant === "disconnected" && <PlugZapIcon className="absolute z-10 pointer-events-none stroke-primary m-auto left-2 h-5 w-5" />}
          {variant == "disconnected" && <span className="z-10 absolute pointer-events-none left text-primary text-sm pl-9">{t("DISCONNECTED_FROM_SERVER")}</span>}
          <AutosizeTextarea
            onPaste={handlePaste}
            readOnly={variant !== "default"}
            autoFocus
            ref={textAreaRef}
            onKeyDown={handleKeyDown}
            placeholder={variant == "default" ? t("WRITE_MESSAGE") : ""}
            className={cn(
              `flex items-center w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 h-11 pl-8 pr-20 resize-none
                ring-0 focus-visible:ring-0 focus-visible:ring-offset-0`,
              variant == "connecting" && "cursor-default",
              variant == "disconnected" && "cursor-not-allowed bg-destructive/25 border-destructive"
            )}
          />
          {variant === "default" && (
            <div className="absolute h-[100%] py-2 right-3 flex flex-row gap-2.5">
              <EmojiPicker
                onChange={(emoji) => insertAt(getCursorPosition(), emoji)}
                key={1}
                className="z-10 cursor-pointer stroke-slate-400/80 hover:stroke-slate-400 top-[14px] h-6 w-6 -translate-y-1/2 transform"
              />
              <Separator orientation="vertical" />
              <SendIcon
                tabIndex={0}
                onClick={sendMessage}
                onKeyDown={(e) => e.keyCode == 32 && sendMessage()}
                strokeWidth={1.5}
                className="z-10 cursor-pointer stroke-slate-400/80 hover:stroke-slate-400 top-[14px] h-6 w-6 -translate-y-1/2 transform
									rounded-sm overflow-visible focus:outline-none focus-visible:ring-2 focus:ring-ring"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatInput;
