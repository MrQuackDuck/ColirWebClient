import { Separator } from "@/shared/ui/Separator";
import { MessageModel } from "../model/MessageModel";
import { UserModel } from "@/entities/User/model/UserModel";
import { useAdaptiveColor } from "@/shared/lib/hooks/useAdaptiveColor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/Tooltip";
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
import ReactMarkdown from "react-markdown";
import ReactionBar from "@/entities/Reaction/ui/ReactionBar";
import { EmojiPicker } from "@/shared/ui/EmojiPicker";

function Message({
  message,
  sender,
  repliedMessage,
  repliedMessageAuthor,
  onReactionAdded,
  onReactionRemoved,
  onDeleteClicked,
  onMessageEdited,
  onReplyClicked,
}: {
  message: MessageModel;
  sender?: UserModel;
  repliedMessage: MessageModel | undefined;
  repliedMessageAuthor: UserModel | undefined;
  onReactionAdded: (reaction: string) => any;
  onReactionRemoved: (reactionId: number) => any;
  onDeleteClicked: () => any;
  onMessageEdited: (newContent: string) => any;
  onReplyClicked: () => any;
}) {
  let whiteHex = 16777215; // #FFFFFF
  let { currentUser } = useCurrentUser();
  let { colorString, isAdjusted } = useAdaptiveColor(
    sender ? sender.hexId : whiteHex
  );
  let repliedHexId = useAdaptiveColor(
    repliedMessageAuthor ? repliedMessageAuthor.hexId : whiteHex
  ).colorString;
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

  function handleMouseLeave() {
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

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, []);

  return (
    <div className={`flex flex-col justify-between my-1`}>
      {repliedMessage && (
        <div className="inline-flex max-h-5 flex-row cursor-pointer hover:underline px-2 pb-[2px] justify-between items-center rounded-t-[6px]">
          <div className="flex flex-row max-h-5 overflow-hidden text-ellipsis items-center text-[11px] gap-1 select-none">
            <CornerUpRightIcon className="w-3 h-3 text-secondary-foreground/80" />
            <span style={{ color: repliedHexId }}>
              {repliedMessageAuthor
                ? repliedMessageAuthor.username
                : "Deleted User"}
            </span>
            <span className="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap">
              {repliedMessage.content}
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
        <ContextMenuTrigger asChild>
          <div
            onMouseLeave={handleMouseLeave}
            className={`flex flex-row justify-between px-2 py-0.5 rounded-[6px] hover:bg-accent/80 ${
              classes["hover-parent"]
            } ${isEditMode && "bg-accent/80"}`}
          >
            <div className="flex flex-col w-full my-1 rounded-[6px]">
              <div className="flex row items-center gap-1.5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        style={{ color: colorString }}
                        className="cursor-pointer hover:underline text-sm"
                      >
                        {sender ? sender.username : "Deleted User"}
                      </span>
                    </TooltipTrigger>
                    {isAdjusted && sender && (
                      <TooltipContent>
                        <p>The color was adjusted</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <span className="text-slate-400 cursor-default text-[0.625rem] translate-y-[1px]">
                  {<>{Moment(message.postDate).format("LLLL")}</>}
                </span>
                {message.editDate && (
                  <>
                    <Separator className="min-h-5" orientation="vertical" />
                    <span className="text-slate-400 text-[0.625rem] font-medium">
                      edited {Moment(message.editDate).format("LLLL")}
                    </span>
                  </>
                )}
              </div>

              {!isEditMode && (
                <span
                  className={`${classes["message-content"]} message-content whitespace-pre-line text-sm`}
                >
                  <ReactMarkdown className="whitespace-pre-line text-sm text-wrap">
                    {message.content}
                  </ReactMarkdown>
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
              <ReactionBar 
                onReactionAdded={onReactionAdded}
                onReactionRemoved={onReactionRemoved}
              reactions={message.reactions} />
            </div>
            {!isEditMode && (
              <div
                className={`flex flex-row gap-1.5 pt-0.5 absolute right-1 top-0 ${classes["hover-content"]}`}
              >
                <Button
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
                <EmojiPicker asButton onChange={onReactionAdded} />
                {sender && currentUser?.hexId == sender.hexId && (
                  <>
                    {!buttonDeleteConfirmation && (
                      <Button
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
          <ContextMenuItem onClick={() => onReplyClicked()}>
            <ReplyIcon className="h-4 w-4 mr-4" />
            Reply
          </ContextMenuItem>
          {sender && currentUser?.hexId == sender.hexId && (
            <ContextMenuItem onClick={() => enableEditMode()}>
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
