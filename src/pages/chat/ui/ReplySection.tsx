import { CornerUpRightIcon, XCircleIcon } from "lucide-react";

function ReplySection() {
  return (
    <>
      <div className="absolute flex flex-row px-2.5 pb-1 h-7 justify-between items-center w-[100%] rounded-t-[6px] top-[-1.4rem] bg-accent">
        <div className="flex flex-row items-center text-[11px] gap-1 select-none">
          <CornerUpRightIcon className="w-3 h-3" />
          <span>mrquackduck</span>
          <span>Lorem Ipsum is simply dummy text of the...</span>
        </div>
        <div className="flex flex-row items-center text-[11px] gap-1 select-none">
          <XCircleIcon className="cursor-pointer w-4 h-4 stroke-slate-400/80 hover:stroke-slate-400/100" />
        </div>
      </div>
    </>
  );
}

export default ReplySection;