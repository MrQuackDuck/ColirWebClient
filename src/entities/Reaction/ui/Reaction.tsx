interface ReactionProps {
  symbol: string;
  count: number;
  isActivated: boolean;
  onReactionAdded: () => any;
  onReactionRemoved: () => any;
}

function Reaction(props: ReactionProps) {
  function reactionClicked () {
    if (props.isActivated) props.onReactionRemoved();
    else props.onReactionAdded();
  }

  return (
    <button onClick={reactionClicked} className="flex flex-row w-min text-sm bg-accent/50 border-primary/20 hover:bg-primary/10 gap-1.5 px-1.5 py-[1px] border rounded-[6px] leading-5 select-none cursor-pointer">
      <span className="text-[12px]">{props.symbol}</span>
      {/* <AnimatedNumbers
        className="text-primary/80 font-semibold"
        transitions={() => ({
          type: "spring",
          duration: 1,
          bounce: 0,
          mass: 0.2,
          when: "in",
          ease: "easeInOut",
          velocity: 1,
        })}
        animateToNumber={props.count}
        /> */}
        <span className="text-primary/80 font-semibold">{props.count}</span>
    </button>
  )
}

export default Reaction