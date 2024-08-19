import { Separator } from "@/shared/ui/Separator";
import { MessageModel } from "../model/MessageModel";
import moment from "moment";
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
  CornerUpRightIcon,
  PencilIcon,
  ReplyIcon,
  SmilePlus,
  Trash2Icon,
} from "lucide-react";
import classes from "./Message.module.css";
import { useCurrentUser } from "@/entities/User/lib/hooks/useCurrentUser";

function Message({
  message,
  sender,
  repliedMessage,
  repliedMessageAuthor,
  onReplyClicked,
}: {
  message: MessageModel;
  sender?: UserModel;
  repliedMessage: MessageModel | undefined;
  repliedMessageAuthor: UserModel | undefined;
  onReplyClicked: () => any;
}) {
  let { currentUser } = useCurrentUser();

  moment().format("MMMM Do YYYY, h:mm:ss");
  let { colorString, isAdjusted } = useAdaptiveColor(sender ? sender.hexId : 16777215);

  let repliedHexId = "#FFFFFF";
  if (repliedMessageAuthor)
    repliedHexId = useAdaptiveColor(repliedMessageAuthor.hexId).colorString;

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
      <div
        className={`flex flex-row justify-between px-2 py-0.5 rounded-[6px] ${classes["hover-parent"]} hover:bg-accent/80`}
      >
        <div className="flex flex-col my-1 rounded-[6px]">
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
            <span className="text-slate-400 text-[0.625rem] translate-y-[1px]">
              {<>{Moment(message.postDate).format("LLLL")}</>}
            </span>
            {message.editDate && (
              <>
                <Separator className="min-h-5" orientation="vertical" />
                <span className="text-slate-400 text-[0.625rem] font-bold">
                  {message.editDate.toString()}
                </span>
              </>
            )}
          </div>
          <span className="whitespace-pre-line text-sm">{message.content}</span>
        </div>
        <div
          className={`flex flex-row gap-1.5 pt-0.5 ${classes["hover-content"]}`}
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
            <Button className="w-8 h-8" variant={"outline"} size={"icon"}>
              <PencilIcon className="text-primary/80 h-4 w-4" />
            </Button>
          )}
          <Button className="w-8 h-8" variant={"outline"} size={"icon"}>
            <SmilePlus className="text-primary/80 h-4 w-4" />
          </Button>
          {sender && currentUser?.hexId == sender.hexId && (
            <Button className="w-8 h-8" variant={"outline"} size={"icon"}>
              <Trash2Icon className="text-destructive h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
