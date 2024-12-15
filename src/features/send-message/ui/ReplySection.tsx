import { MessageModel } from "@/entities/Message/model/MessageModel";
import { UserModel } from "@/entities/User/model/UserModel";
import Username from "@/entities/User/ui/Username";
import { cn, decryptString } from "@/shared/lib/utils";
import { CornerUpRightIcon, XCircleIcon } from "lucide-react";

function ReplySection({
  message,
  sender,
  className,
  decryptionKey,
  onReplyCancelled,
  onClicked
}: {
  message: MessageModel | null;
  className?: string;
  sender: UserModel;
  onReplyCancelled: () => any;
  decryptionKey: string;
  onClicked: () => any;
}) {
  let decryptedMessage = decryptString(message?.content ?? "", decryptionKey);

  return (
    <div className={cn("flex flex-row overflow-hidden text-ellipsis pl-2.5 pr-3 h-5 justify-between items-center w-[100%]", className)}>
      <div onClick={onClicked} className="flex flex-row cursor-pointer overflow-hidden text-ellipsis items-center text-[11px] gap-1 select-none">
        <CornerUpRightIcon className="shrink-0 w-3 h-3" />
        <div className="shrink-0"><Username className="shrink-0 text-[12px]" user={sender} /></div>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="block flex-row overflow-hidden text-ellipsis whitespace-nowrap mr-1">
            {decryptedMessage}
            {decryptedMessage === undefined && <span className="text-destructive">{<>t("COULD_NOT_DECRYPT")</>}</span>}
          </span>
          <div className="flex flex-row gap-1">
            {message?.attachments.map((attachment) => (
              <span key={attachment.id} className="flex flex-row text-nowrap overflow-hidden text-ellipsis flex-nowrap text-primary/70">
                [{decryptString(attachment.filename, decryptionKey)}]{" "}
              </span>
            ))}
          </div>
        </span>
      </div>
      <div className="flex flex-row pl-1 items-center text-[11px] gap-1 select-none">
        <XCircleIcon onClick={onReplyCancelled} className="cursor-pointer w-4 h-4 stroke-slate-400/80 hover:stroke-slate-400/100" />
      </div>
    </div>
  );
}

export default ReplySection;
