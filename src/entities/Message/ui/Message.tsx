import { Separator } from "@/shared/ui/Separator";
import { MessageModel } from "../model/MessageModel";
import { UserModel } from "@/entities/User/model/UserModel";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/Tooltip";
import Moment from "moment";
import { Button } from "@/shared/ui/Button";
import {
  CheckIcon,
  CopyIcon,
  CornerUpRightIcon,
  PencilIcon,
  PencilOffIcon,
  ReplyIcon,
  SkullIcon,
  Trash2Icon,
} from "lucide-react";
import classes from "./Message.module.css";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";
import { useEffect, useRef, useState } from "react";
import { AutosizeTextarea } from "@/shared/ui/AutosizeTextarea";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/ui/ContextMenu";
import { toast } from "@/shared/ui/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/Dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/ui/Card";
import ReactionBar from "@/entities/Reaction/ui/ReactionBar";
import { EmojiPicker } from "@/shared/ui/EmojiPicker";
import { DialogDescription } from "@radix-ui/react-dialog";
import Username from "@/entities/User/ui/Username";
import AttachmentsSection from "../../Attachment/ui/AttachmentsSection";
import { formatText } from "../lib/formatText";

interface MessageProps {
  message: MessageModel;
  sender?: UserModel;
  repliedMessage?: MessageModel;
  repliedMessageAuthor?: UserModel;
  controlsEnabled: boolean;
  onReactionAdded: (reaction: string) => any;
  onReactionRemoved: (reactionId: number) => any;
  onDeleteClicked: () => any;
  onMessageEdited: (newContent: string) => any;
  onReplyClicked: () => any;
}

function Message({
  message,
  sender,
  repliedMessage,
  repliedMessageAuthor,
  controlsEnabled,
  onReactionAdded,
  onReactionRemoved,
  onDeleteClicked,
  onMessageEdited,
  onReplyClicked,
}: MessageProps) {
  let { currentUser } = useCurrentUser();
  let [buttonDeleteConfirmation, setButtonDeleteConfirmation] =
    useState<boolean>(false);
  let [isDialogConfirmationShown, setDeleteDialogConfirmation] =
    useState<boolean>(false);
  let [isEditMode, setIsEditMode] = useState<boolean>(false);
  let [editedContent, setEditedContent] = useState<string>(message.content);
  let [shiftPressed, setShiftPressed] = useState<boolean>(false);
  let textAreaRef = useRef<any>();

  function copyMessage() {
    navigator.clipboard.writeText(message.content);
    toast({
      title: "Copied!",
      description: "Message content copied to the clipboard successfully!",
    });
  }

  function addOrRemoveReaction(reaction: string) {
    let reactionId = message.reactions.find(
      (r) => r.authorHexId == currentUser?.hexId && r.symbol == reaction
    )?.id;

    if (reactionId) onReactionRemoved(reactionId);
    else onReactionAdded(reaction);
  }

  function enableEditMode() {
    setIsEditMode(true);
  }

  // Tracking the edit mode to focus on the textarea
  useEffect(() => {
    if (!isEditMode) return;
    textAreaRef.current.textArea.selectionStart = message.content.length;
    textAreaRef.current.textArea.selectionEnd = message.content.length;
    textAreaRef.current.focus();
  }, [isEditMode]);

  function disableEditMode() {
    setIsEditMode(false);
    setEditedContent(message.content);
  }

  function finishEditing() {
    if (editedContent.length < 0) return;
    if (editedContent != message.content) onMessageEdited(editedContent);
    disableEditMode();
  }

  function deleteMessage(withDelay?: boolean) {
    setDeleteDialogConfirmation(false);
    if (withDelay) {
      setTimeout(() => onDeleteClicked(), 100);
      return;
    }

    onDeleteClicked();
  }

  function showDialogConfirmationOrDelete(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (event.shiftKey) {
      deleteMessage();
      return;
    }

    setButtonDeleteConfirmation(true);
  }

  function handleEditInputKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.keyCode == 27) {
      event.preventDefault();
      disableEditMode();
    }

    if (event.key == "Enter" && !event.shiftKey) {
      event.preventDefault();
      finishEditing();
    }
  }

  function handleMouseEnter() {
    if (message.authorHexId != currentUser?.hexId) return;
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  function handleMouseLeave() {
    if (message.authorHexId != currentUser?.hexId) return;
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    setShiftPressed(false);
    setButtonDeleteConfirmation(false);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.shiftKey) {
      setShiftPressed(true);
      return;
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key == "Shift") setShiftPressed(false);
  }

  function formatDate(date) {
    const now = Moment();
    const givenDate = Moment(date);

    if (givenDate.isSame(now, "day")) return givenDate.format("h:mm A");
    if (givenDate.isSame(now.add(1, "day"), "day"))
      return givenDate.format("MMMM D, h:mm A");
    return givenDate.format("MMMM D, h:mm A");
  }

  function validateContextMenu(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    if (event.target instanceof HTMLElement) {
      if (!isContextMenuAllowed(event.target, 8)) {
        event.target.parentElement?.parentElement
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  function isContextMenuAllowed(element: HTMLElement | null, depth: number): boolean {
    if (depth <= 0) return true;
    if (element == null) return false;
    if (element.classList.contains("message-context-menu-disabled")) return false;
    else {
      return isContextMenuAllowed(element.parentElement, depth - 1);
    }
  }

  return (
    <div className={`flex flex-col justify-between my-0.5 mt-1`}>
      {repliedMessage && (
        <div className="inline-flex w-fit max-h-5 flex-row cursor-pointer hover:underline px-2 pb-[2px] justify-between items-center rounded-t-[6px]">
          <div className="flex flex-row max-h-5 overflow-hidden text-ellipsis items-center text-[11px] gap-1 select-none">
            <CornerUpRightIcon className="w-3 h-3 text-secondary-foreground/80" />
            <Username className="text-[11px]" user={repliedMessageAuthor} />
            <span className="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap">
              {repliedMessage.content} {repliedMessage.attachments.map((attachment) => <span className="text-ellipsis whitespace-nowrap text-primary/70">[{attachment.filename}] </span>)}
            </span>
          </div>
        </div>
      )}

      <Dialog
        open={isDialogConfirmationShown}
        onOpenChange={setDeleteDialogConfirmation}
      >
        <DialogContent>
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Are you sure?</CardTitle>
              <CardDescription>
                You are about to delete the message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-[15px]">
                It will cause the message to disappear.
                <br />
                This action can’t be undone.
              </span>
              <div className="pt-2 flex flex-row gap-2">
                <Button
                  onClick={() => setDeleteDialogConfirmation(false)}
                  className="w-[100%]"
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteMessage(true)}
                  className="w-[100%]"
                  variant={"destructive"}
                >
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <ContextMenu>
        <ContextMenuTrigger onContextMenu={validateContextMenu} asChild>
          {/* Message block */}
          <div onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`flex flex-col justify-between px-2 rounded-[6px] hover:bg-accent/80 
              ${classes["hover-parent"]} ${isEditMode && "bg-accent/80"} ${repliedMessage ? "py-[0.080rem]" : "py-0.5"}`}>
            <div className="flex flex-col w-full my-1 rounded-[6px]">
              <div className="flex row items-center gap-1.5">
                <Username user={sender} />
                <Tooltip>
                    <TooltipTrigger asChild>
                      {<span className="text-slate-400 cursor-default text-[0.625rem] translate-y-[1px]">{formatDate(message.postDate)}</span>}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <span className="text-[12px]">
                        {Moment(message.postDate).format("LLLL")}
                      </span>
                    </TooltipContent>
                </Tooltip>
                {message.editDate && (<>
                  <Separator className="min-h-5" orientation="vertical" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {<span className="text-slate-400 cursor-default text-[0.625rem] font-medium">edited {formatDate(message.editDate)}</span>}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <span className="text-[12px]">{Moment(message.editDate).format("LLLL")}</span>
                    </TooltipContent>
                  </Tooltip>
                </>)}
              </div>
              {!isEditMode && (
                <span className={`${classes["message-content"]} message-content whitespace-pre-line text-sm`}>
                  {formatText(message.content)}
                </span>
              )}
              {isEditMode && (
                <div className="flex flex-row gap-1">
                  <AutosizeTextarea
                    ref={textAreaRef}
                    onKeyDown={handleEditInputKeyDown}
                    onChange={(e) => setEditedContent(e.target.value)}
                    value={editedContent}
                    autoFocus
                    placeholder="Edit the message"
                    className="flex items-center w-full rounded-md border border-input bg-background py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 h-11 resize-none
          ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    onClick={disableEditMode}
                    className="w-10 h-10"
                    variant={"outline"}
                    size={"icon"}
                  >
                    <PencilOffIcon className="text-primary/80 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={finishEditing}
                    className="w-10 h-10"
                    variant={"outline"}
                    size={"icon"}
                  >
                    <CheckIcon className="text-primary/80 h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {message.attachments.length > 0 && <AttachmentsSection className="message-context-menu-disabled" attachments={message.attachments} />}
              {message.reactions.length > 0 && <ReactionBar className="message-context-menu-disabled"
                onReactionAdded={addOrRemoveReaction}
                onReactionRemoved={addOrRemoveReaction}
                reactions={message.reactions}
              />}
            </div>

            {/* Editing block */}
            {!isEditMode && (
              <div
                className={`flex flex-row gap-1.5 pt-0.5 absolute right-1 top-0 ${classes["hover-content"]}`}
              >
                <Button
                  disabled={!controlsEnabled}
                  onClick={onReplyClicked}
                  className="w-8 h-8"
                  variant={"outline"}
                  size={"icon"}
                >
                  <ReplyIcon className="text-primary/80 h-4 w-4" />
                </Button>
                {sender && currentUser?.hexId == sender.hexId && (
                  <>
                    {!isEditMode && (
                      <Button
                        disabled={!controlsEnabled}
                        onClick={enableEditMode}
                        className="w-8 h-8"
                        variant={"outline"}
                        size={"icon"}
                      >
                        <PencilIcon className="text-primary/80 h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
                <EmojiPicker disabled={!controlsEnabled} asButton onChange={addOrRemoveReaction} />
                {sender && currentUser?.hexId == sender.hexId && (
                  <>
                    {!buttonDeleteConfirmation && (
                      <Button
                        disabled={!controlsEnabled}
                        onClick={showDialogConfirmationOrDelete}
                        className="w-8 h-8"
                        variant={"outline"}
                        size={"icon"}
                      >
                        <Trash2Icon
                          className={`${
                            shiftPressed
                              ? "text-destructive"
                              : "text-primary/80"
                          } h-4 w-4`}
                        />
                      </Button>
                    )}
                    {buttonDeleteConfirmation && (
                      <Button
                        onClick={() => onDeleteClicked()}
                        className="w-8 h-8"
                        variant={"outline"}
                        size={"icon"}
                      >
                        <SkullIcon className="text-destructive h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="text-sm">
          <ContextMenuItem disabled={!controlsEnabled} onClick={() => onReplyClicked()}>
            <ReplyIcon className="h-4 w-4 mr-4" />
            Reply
          </ContextMenuItem>
          {sender && currentUser?.hexId == sender.hexId && (
            <ContextMenuItem disabled={!controlsEnabled} onClick={() => enableEditMode()}>
              <PencilIcon className="h-4 w-4 mr-4" />
              Edit
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={() => copyMessage()}>
            <CopyIcon className="h-4 w-4 mr-4" />
            Copy text
          </ContextMenuItem>
          {sender && currentUser?.hexId == sender.hexId && (
            <ContextMenuItem
              disabled={!controlsEnabled}
              onClick={() => setDeleteDialogConfirmation(true)}
              className="text-destructive"
            >
              <Trash2Icon className="h-4 w-4 mr-4" />
              Delete
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export default Message;
