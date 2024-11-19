import { forwardRef } from "react";

interface ReactionProps {
  symbol: string;
  count: number;
  isActivated: boolean;
  onReactionAdded: () => any;
  onReactionRemoved: () => any;
}

const Reaction = forwardRef((props: ReactionProps, ref: any) => {
  function reactionClicked () {
    if (props.isActivated) props.onReactionRemoved();
    else props.onReactionAdded();
  }

  return (
    <div
      tabIndex={0} ref={ref} onClick={reactionClicked} onKeyDown={(e) => e.keyCode == 32 && reactionClicked()}
      className={`flex flex-row w-min ${props.isActivated ? "bg-accent/100 border-primary/40" : "bg-accent/50 border-primary/20"} text-sm hover:bg-primary/10 gap-1.5 px-1.5 py-[1px] border rounded-[6px] leading-5 select-none cursor-pointer`}>
      <span className="text-[12px]">{props.symbol}</span>
      <span className={`${props.isActivated ? "text-primary/80" : "text-primary/70" } font-semibold`}>{props.count}</span>
    </div>
  )
})

export default Reaction