import { AutosizeTextarea } from "@/shared/ui/AutosizeTextarea";
import { Separator } from "@/shared/ui/Separator";
import { Loader2, PaperclipIcon, PlugZapIcon, SendIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import React from "react";
import { EmojiPicker } from "@/shared/ui/EmojiPicker";
import { cn } from "@/shared/lib/utils";
import { MessageModel } from "@/entities/Message/model/MessageModel";
import ReplySection from "./ReplySection";
import { UserModel } from "@/entities/User/model/UserModel";
import FileList from "./FileList";

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
	onReplyCancelled: () => any;
	onSizeChange: (height: number) => any;
	variant?: ChatInputVariant;
}

function ChatInput({
	onSend,
	messageToReply,
	messageToReplyAuthor,
	className,
	onReplyCancelled,
	onSizeChange,
	variant = "default",
}: ChatInputProps) {
	let textArea = useRef<any>();
  let fileInput = useRef<any>();
	let topArea = useRef<any>();

	useEffect(() => {
		// Adding this event listener to focus on textarea when a user clicks outside of it
		textArea.current.textArea.focus();
		document.addEventListener("keydown", (e) => {
			if (e.ctrlKey || e.altKey || e.shiftKey) return;
			if (document.activeElement?.tagName === "TEXTAREA" || document.activeElement?.tagName === "INPUT") return;
			if (textArea.current) textArea.current.textArea.focus();
		});
	}, []);

	function sendMessage() {
		if (textArea.current.textArea.disabled) return;
		onSend({
			content: textArea.current.textArea.value,
			attachments: [...files],
			replyMessageId: messageToReply?.id,
		});
		
		setFiles([]);
		textArea.current.textArea.value = "";
		textArea.current.textArea.style.height = "43x";
	}

	function insertAt(index: number, str: string) {
		if (textArea.current.textArea.disabled) return;
		let value = textArea.current.textArea.value;
		textArea.current.textArea.value =
			value.substr(0, index) + str + value.substr(index);
		setCursorPosition(index + str.length);
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (event.keyCode == 27) {
			onReplyCancelled();
		}

		if (event.key == "Enter" && !event.shiftKey) {
			event.preventDefault();
			let element = event.target as HTMLTextAreaElement;

			if (element.value.length === 0 && files.length === 0) {
				event.preventDefault();
				return;
			}

			sendMessage();
		}
	}

	function getCursorPosition() {
		return textArea.current.textArea.selectionStart;
	}

	function setCursorPosition(index: number) {
		textArea.current.textArea.selectionEnd = index;
	}

	let [files, setFiles] = React.useState<File[]>([]);
  function fileSelected(e) {
    let files = e.target.files as FileList;
    if (files.length == 0) return;

		for (let i = 0; i < files.length; i++) {
			let file = files[i];
			setFiles((prev) => [...prev, file]);
		}
		onSizeChange(topArea.current.clientHeight ?? 0);
  }

	function fileRemoved(file: File) {
		setFiles((prev) => prev.filter((f) => f !== file));
	}

	useEffect(() => {
		onSizeChange(topArea.current.clientHeight ?? 0);
	}, [files])

	useEffect(() => {
		onSizeChange(topArea.current.clientHeight ?? 0);
		setTimeout(() => textArea.current.textArea.focus(), 10);
	}, [messageToReply]);

	return (
		<>
			<div className={cn("flex flex-col absolute bottom-0 items-center", className)}>
				{/* Top section (with reply and files) */}
				<div ref={topArea} className="flex flex-col bg-accent/80 w-full items-center rounded-t-[6px] gap-0.5">
					{messageToReply && variant == "default" && (
						<ReplySection
							onReplyCancelled={onReplyCancelled}
							message={messageToReply}
							sender={messageToReplyAuthor!}
						/>
					)}

					{messageToReply && files.length > 0 && <Separator className="bg-secondary outline-none border-none" />}

					{files.length > 0 && (
						<FileList className={cn(!messageToReply && "rounded-t-[6px]")} onFileRemoved={fileRemoved} files={files}/>
					)}
				</div>

				<div className={cn("flex items-center", className)}>
          {/* Background at top to match secions from above */}
          {(messageToReply || files.length > 0) && variant == "default" && <div className="absolute top-0 h-4 bg-accent/80 w-full"></div>}

					{variant === "default" && (<>
						<PaperclipIcon
              onClick={() => fileInput.current.click()}
							strokeWidth={1.5}
							className="cursor-pointer absolute z-10 stroke-slate-400/80 hover:stroke-slate-400 left-2 top-[20px] h-5 w-5 -translate-y-1/2 transform"
						/>
            <input onChange={fileSelected} multiple={true} className="hidden" ref={fileInput} type="file" />
					</>)}
					{variant === "connecting" && (
						<Loader2 className="absolute z-10 pointer-events-none stroke-slate-400/80 animate-spin m-auto left-2 h-5 w-5" />
					)}
					{variant == "connecting" && (
						<span className="z-10 absolute left pointer-events-none text-muted-foreground/90 text-sm pl-9">
							Connecting...
						</span>
					)}
					{variant === "disconnected" && (
						<PlugZapIcon className="absolute z-10 pointer-events-none stroke-primary m-auto left-2 h-5 w-5" />
					)}
					{variant == "disconnected" && (
						<span className="z-10 absolute pointer-events-none left text-primary text-sm pl-9">
							Disconnected from server.
						</span>
					)}
					<AutosizeTextarea
						readOnly={variant !== "default"}
						autoFocus
						ref={textArea}
						onKeyDown={handleKeyDown}
						placeholder={variant == "default" ? "Write a message..." : ""}
						className={cn(
							`flex items-center w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 h-11 pl-8 pr-20 resize-none
                ring-0 focus-visible:ring-0 focus-visible:ring-offset-0`,
							  variant == "connecting" && "cursor-default",
							  variant == "disconnected" && "cursor-not-allowed bg-destructive/25 border-destructive",
						)}/>
					{variant === "default" && (
						<div className="absolute h-[100%] py-2 right-3 flex flex-row gap-2.5">
							<EmojiPicker
								onChange={(emoji) => insertAt(getCursorPosition(), emoji)}
								key={1}
								className="z-10 cursor-pointer stroke-slate-400/80 hover:stroke-slate-400 top-[14px] h-6 w-6 -translate-y-1/2 transform"/>
							<Separator orientation="vertical" />
							<SendIcon
								onClick={() => sendMessage()}
								strokeWidth={1.5}
								className="z-10 cursor-pointer stroke-slate-400/80 hover:stroke-slate-400 top-[14px] h-6 w-6 -translate-y-1/2 transform"/>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default ChatInput;
