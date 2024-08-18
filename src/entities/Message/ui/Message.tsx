import { Separator } from "@/shared/ui/Separator";
import { MessageModel } from "../model/MessageModel";
import moment from 'moment';

function Message({ message }: { message: MessageModel }) {
  moment().format("MMMM Do YYYY, h:mm:ss");

  return (
    <div className="flex flex-col my-1.5">
      <div className="flex row items-center gap-1.5">
        <span className="text-sm">mrquackduck</span>
        <span className="text-slate-400 text-[0.625rem]">{<>{message.postDate}</>}</span>
        {
          message.editDate && 
          <>
            <Separator className="min-h-5" orientation="vertical" />
            <span className="text-slate-400 text-[0.625rem] font-bold">{message.editDate.toString()}</span>
          </>
        }
      </div>
      <span className="whitespace-pre-line text-sm">{message.content}</span>
    </div>
  );
}

export default Message;
