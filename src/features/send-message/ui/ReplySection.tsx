import { MessageModel } from "@/entities/Message/model/MessageModel";
import { UserModel } from "@/entities/User/model/UserModel";
import Username from "@/entities/User/ui/Username";
import { CornerUpRightIcon, XCircleIcon } from "lucide-react";

function ReplySection({message, sender, onReplyCancelled}: {message: MessageModel; sender: UserModel; onReplyCancelled: () => any}) {
  return (
    <>
      <div className="flex flex-row overflow-hidden text-ellipsis pl-2.5 pr-3 h-5 justify-between items-center w-[100%]">
        <div className="flex flex-row overflow-hidden text-ellipsis items-center text-[11px] gap-1 select-none">
          <CornerUpRightIcon className="w-3 h-3" />
          <Username className="text-[12px]" user={sender} />
          <span className="max-w-screen-sm overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex flex-row overflow-hidden text-ellipsis mr-1">{message.content}</span>
            {message.attachments.map((attachment) => <span className="flex flex-row overflow-hidden text-ellipsis whitespace-nowrap flex-nowrap text-primary/70">[{attachment.filename}] </span>)}
          </span>
        </div>
        <div className="flex flex-row pl-1 items-center text-[11px] gap-1 select-none">
          <XCircleIcon onClick={onReplyCancelled} className="cursor-pointer w-4 h-4 stroke-slate-400/80 hover:stroke-slate-400/100" />
        </div>
      </div>
    </>
  );
}

export default ReplySection;
