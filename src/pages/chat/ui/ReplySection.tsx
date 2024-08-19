import { MessageModel } from "@/entities/Message/model/MessageModel";
import { UserModel } from "@/entities/User/model/UserModel";
import { useAdaptiveColor } from "@/shared/lib/hooks/useAdaptiveColor";
import { CornerUpRightIcon, XCircleIcon } from "lucide-react";

function ReplySection({message, sender, onReplyCancelled}: {message: MessageModel; sender: UserModel; onReplyCancelled: () => any}) {
  let { colorString } = useAdaptiveColor(
    sender ? sender.hexId : 16777215
  );

  return (
    <>
      <div className="absolute flex flex-row pl-2.5 pr-3 pb-1 h-7 justify-between items-center w-[100%] rounded-t-[6px] top-[-1.4rem] bg-accent">
        <div className="flex flex-row items-center text-[11px] gap-1 select-none">
          <CornerUpRightIcon className="w-3 h-3" />
          <span style={{ color: colorString }}>{sender ? sender.username : "Deleted User"}</span>
          <span>{message.content}</span>
        </div>
        <div className="flex flex-row items-center text-[11px] gap-1 select-none">
          <XCircleIcon onClick={onReplyCancelled} className="cursor-pointer w-4 h-4 stroke-slate-400/80 hover:stroke-slate-400/100" />
        </div>
      </div>
    </>
  );
}

export default ReplySection;
